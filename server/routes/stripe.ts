import { Router, raw as expressRaw, type RequestHandler } from "express";
import Stripe from "stripe";
import { z } from "zod";
import type { IStorage } from "../storage";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

// Stripe Price IDs (create these in your Stripe dashboard)
const STRIPE_PRICES = {
  pro: process.env.STRIPE_PRICE_ID_PRO || "price_pro_monthly_29",
  premium: process.env.STRIPE_PRICE_ID_PREMIUM || "price_premium_monthly_99",
};

export function createStripeRouter(storage: IStorage, isAuthenticated: RequestHandler) {
  const router = Router();

  // Stripe webhook uses the rawBody captured by express.json verify
  router.post("/webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    
    if (!sig) {
      return res.status(400).json({ error: "Missing stripe signature" });
    }

    let event: Stripe.Event;

    try {
      // Use the raw buffer captured by express.json's verify function
      const rawBody = (req as any).rawBody;
      if (!rawBody) {
        throw new Error("Raw body not available");
      }

      event = stripe.webhooks.constructEvent(
        rawBody,  // Use the rawBody from express.json verify
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    try {
      switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const businessId = parseInt(session.metadata?.businessId || "0");
            const tier = session.metadata?.tier as "pro" | "premium";

            if (!businessId || !tier) {
              console.error("Missing metadata in checkout session");
              break;
            }

            // Get subscription details from Stripe
            const stripeSubscriptionResponse = await stripe.subscriptions.retrieve(
              session.subscription as string
            );
            const stripeSubscription = stripeSubscriptionResponse as Stripe.Subscription;

            // Check if subscription already exists (idempotency for webhook retries)
            const existingSubscriptions = await storage.getAllSubscriptions();
            const existingSubscription = existingSubscriptions.find(
              (sub) => sub.stripeSubscriptionId === stripeSubscription.id
            );

            if (!existingSubscription) {
              // Create subscription record only if it doesn't exist
              await storage.createSubscription({
                businessId,
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: stripeSubscription.id,
                stripePriceId: stripeSubscription.items.data[0].price.id,
                tier,
                status: stripeSubscription.status,
                currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
                currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
                cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
              });

              // Update business subscription tier
              await storage.updateBusinessAdmin(businessId, {
                subscriptionTier: tier,
              });
            }

            break;
          }

          case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            const existingSubscription = await storage.getAllSubscriptions();
            const dbSubscription = existingSubscription.find(
              (sub) => sub.stripeSubscriptionId === subscription.id
            );

            if (dbSubscription) {
              await storage.updateSubscription(dbSubscription.id, {
                status: subscription.status,
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
              });

              // If subscription was canceled, downgrade business to free tier
              if (subscription.status === "canceled") {
                await storage.updateBusinessAdmin(dbSubscription.businessId, {
                  subscriptionTier: "free",
                });
              }
            }
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const existingSubscriptions = await storage.getAllSubscriptions();
            const dbSubscription = existingSubscriptions.find(
              (sub) => sub.stripeSubscriptionId === subscription.id
            );

            if (dbSubscription) {
              await storage.updateSubscription(dbSubscription.id, {
                status: "canceled",
              });

              // Downgrade business to free tier
              await storage.updateBusinessAdmin(dbSubscription.businessId, {
                subscriptionTier: "free",
              });
            }
            break;
          }

          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            const subscriptionId = typeof invoice.subscription === 'string' 
              ? invoice.subscription 
              : invoice.subscription?.id;
            
            if (subscriptionId) {
              const existingSubscriptions = await storage.getAllSubscriptions();
              const dbSubscription = existingSubscriptions.find(
                (sub) => sub.stripeSubscriptionId === subscriptionId
              );

              if (dbSubscription) {
                await storage.updateSubscription(dbSubscription.id, {
                  status: "past_due",
                });
              }
            }
            break;
          }

          default:
            console.log(`Unhandled event type ${event.type}`);
        }

      res.json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  // Create checkout session for subscription (requires authentication and business ownership)
  router.post("/create-checkout-session", isAuthenticated, async (req: any, res) => {
    try {
      const createCheckoutSchema = z.object({
        businessId: z.number(),
        tier: z.enum(["pro", "premium"]),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      });

      const { businessId, tier, successUrl, cancelUrl } = createCheckoutSchema.parse(req.body);
      
      const business = await storage.getBusinessById(businessId);
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }

      // Verify business ownership
      const replitId = req.user.claims.sub.toString();
      const currentUser = await storage.getUserByReplitId(replitId);
      if (!currentUser || business.claimedBy !== currentUser.id) {
        return res.status(403).json({ error: "You do not own this business" });
      }

      // Check if business already has an active subscription
      const existingSubscription = await storage.getSubscriptionByBusinessId(businessId);
      if (existingSubscription && existingSubscription.status === "active") {
        return res.status(400).json({ error: "Business already has an active subscription" });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: STRIPE_PRICES[tier],
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          businessId: businessId.toString(),
          tier,
        },
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request", details: error.errors });
      }
      console.error("Failed to create checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Create customer portal session (requires authentication and business ownership)
  router.post("/create-portal-session", isAuthenticated, async (req: any, res) => {
    try {
      const createPortalSchema = z.object({
        businessId: z.number(),
        returnUrl: z.string().url(),
      });

      const { businessId, returnUrl } = createPortalSchema.parse(req.body);
      
      // Verify business ownership
      const business = await storage.getBusinessById(businessId);
      if (!business) {
        return res.status(404).json({ error: "Business not found" });
      }

      const replitId = req.user.claims.sub.toString();
      const currentUser = await storage.getUserByReplitId(replitId);
      if (!currentUser || business.claimedBy !== currentUser.id) {
        return res.status(403).json({ error: "You do not own this business" });
      }

      const subscription = await storage.getSubscriptionByBusinessId(businessId);
      if (!subscription) {
        return res.status(404).json({ error: "No subscription found" });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: returnUrl,
      });

      res.json({ url: session.url });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request", details: error.errors });
      }
      console.error("Failed to create portal session:", error);
      res.status(500).json({ error: "Failed to create portal session" });
    }
  });

  return router;
}
