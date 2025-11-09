import { Router } from "express";
import type { IStorage } from "../storage";
import { z } from "zod";

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
      const updateBusinessSchema = z.object({
        subscriptionTier: z.enum(["free", "pro", "premium"]).optional(),
        featured: z.boolean().optional(),
        isSponsored: z.boolean().optional(),
        sponsoredUntil: z.string().optional()
      });
      
      const updates = updateBusinessSchema.parse(req.body);
      const businessId = parseInt(req.params.id);
      
      const updatedBusiness = await storage.updateBusiness(businessId, updates);
      
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

  return router;
}
