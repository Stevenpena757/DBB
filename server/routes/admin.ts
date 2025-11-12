import { Router } from "express";
import type { IStorage } from "../storage";
import { z } from "zod";
import { businessAdminUpdateSchema } from "@shared/schema";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export function createAdminRouter(storage: IStorage) {
  const router = Router();

  router.get("/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Failed to get all users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  router.patch("/users/:id/role", async (req, res) => {
    try {
      const updateRoleSchema = z.object({
        role: z.enum(["user", "business_owner", "admin"])
      });
      
      const { role } = updateRoleSchema.parse(req.body);
      const userId = parseInt(req.params.id);
      
      const updatedUser = await storage.updateUserRole(userId, role);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid role", details: error.errors });
      }
      console.error("Failed to update user role:", error);
      res.status(500).json({ error: "Failed to update user role" });
    }
  });

  router.get("/businesses", async (req, res) => {
    try {
      const businesses = await storage.getAllBusinesses();
      res.json(businesses);
    } catch (error) {
      console.error("Failed to get all businesses:", error);
      res.status(500).json({ error: "Failed to fetch businesses" });
    }
  });

  router.patch("/businesses/:id", async (req, res) => {
    try {
      const updates = businessAdminUpdateSchema.parse(req.body);
      const businessId = parseInt(req.params.id);
      
      const updatedBusiness = await storage.updateBusinessAdmin(businessId, updates);
      
      if (!updatedBusiness) {
        return res.status(404).json({ error: "Business not found" });
      }
      
      res.json(updatedBusiness);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid business update", details: error.errors });
      }
      console.error("Failed to update business:", error);
      res.status(500).json({ error: "Failed to update business" });
    }
  });

  router.get("/claims", async (req, res) => {
    try {
      const claims = await storage.getAllClaimRequests();
      res.json(claims);
    } catch (error) {
      console.error("Failed to get claim requests:", error);
      res.status(500).json({ error: "Failed to fetch claim requests" });
    }
  });

  router.patch("/claims/:id", async (req, res) => {
    try {
      const updateClaimSchema = z.object({
        status: z.enum(["pending", "approved", "rejected"])
      });
      
      const { status } = updateClaimSchema.parse(req.body);
      const claimId = parseInt(req.params.id);
      
      if (status === "approved") {
        await storage.approveClaimRequest(claimId);
      } else {
        await storage.updateClaimRequest(claimId, status);
      }
      
      res.json({ success: true, claimId, status });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid status", details: error.errors });
      }
      console.error("Failed to update claim request:", error);
      res.status(500).json({ error: "Failed to update claim request" });
    }
  });

  router.get("/stats", async (req, res) => {
    try {
      const stats = await storage.getPlatformStats();
      res.json(stats);
    } catch (error) {
      console.error("Failed to get platform stats:", error);
      res.status(500).json({ error: "Failed to fetch platform stats" });
    }
  });

  // Pending Business Listings
  router.get("/pending-businesses", async (req, res) => {
    try {
      const pendingBusinesses = await storage.getAllPendingBusinesses();
      res.json(pendingBusinesses);
    } catch (error) {
      console.error("Failed to get pending businesses:", error);
      res.status(500).json({ error: "Failed to fetch pending businesses" });
    }
  });

  router.post("/pending-businesses/:id/approve", async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const reviewedBy = req.user.id; // Get admin user ID from session
      const reviewNotes = req.body.reviewNotes || "";
      
      const newBusiness = await storage.approvePendingBusiness(id, reviewedBy, reviewNotes);
      res.json({ success: true, business: newBusiness });
    } catch (error) {
      console.error("Failed to approve pending business:", error);
      res.status(500).json({ error: "Failed to approve business listing" });
    }
  });

  router.post("/pending-businesses/:id/reject", async (req: any, res) => {
    try {
      const rejectSchema = z.object({
        reviewNotes: z.string().min(1, "Please provide a reason for rejection")
      });
      
      const { reviewNotes } = rejectSchema.parse(req.body);
      const id = parseInt(req.params.id);
      const reviewedBy = req.user.id; // Get admin user ID from session
      
      const rejectedBusiness = await storage.rejectPendingBusiness(id, reviewedBy, reviewNotes);
      
      if (!rejectedBusiness) {
        return res.status(404).json({ error: "Pending business not found" });
      }
      
      res.json({ success: true, business: rejectedBusiness });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      console.error("Failed to reject pending business:", error);
      res.status(500).json({ error: "Failed to reject business listing" });
    }
  });

  // Subscriptions Management
  router.get("/subscriptions", async (req, res) => {
    try {
      const subscriptionsWithBusiness = await storage.getAllSubscriptionsWithBusiness();
      res.json(subscriptionsWithBusiness);
    } catch (error) {
      console.error("Failed to get subscriptions:", error);
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  });

  router.post("/subscriptions/:id/refund", async (req, res) => {
    try {
      const refundSchema = z.object({
        reason: z.string().optional(),
        amount: z.number().positive().optional(), // Amount in cents, optional for full refund
      });

      const { reason, amount } = refundSchema.parse(req.body);
      const subscriptionId = parseInt(req.params.id);

      // Get subscription to find the latest invoice
      const subscriptions = await storage.getAllSubscriptions();
      const subscription = subscriptions.find(sub => sub.id === subscriptionId);

      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      // Retrieve the Stripe subscription to get the latest invoice
      const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
      
      if (!stripeSubscription.latest_invoice) {
        return res.status(400).json({ error: "No invoice found for this subscription" });
      }

      // Get the invoice and charge
      const invoice = await stripe.invoices.retrieve(stripeSubscription.latest_invoice as string);
      
      const chargeId = typeof invoice.charge === 'string' ? invoice.charge : invoice.charge?.id;
      
      if (!chargeId) {
        return res.status(400).json({ error: "No charge found for this invoice" });
      }

      // Create the refund
      const refundParams: Stripe.RefundCreateParams = {
        charge: chargeId,
        reason: reason as any || 'requested_by_customer',
      };

      if (amount) {
        refundParams.amount = amount;
      }

      const refund = await stripe.refunds.create(refundParams);

      res.json({ 
        success: true, 
        refund: {
          id: refund.id,
          amount: refund.amount,
          status: refund.status,
          currency: refund.currency,
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid refund request", details: error.errors });
      }
      if (error instanceof Stripe.errors.StripeError) {
        console.error("Stripe refund error:", error.message);
        return res.status(400).json({ error: error.message });
      }
      console.error("Failed to process refund:", error);
      res.status(500).json({ error: "Failed to process refund" });
    }
  });

  return router;
}
