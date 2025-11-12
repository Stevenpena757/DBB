import { moderateContent, validateBusinessListing } from "./openai";
import type { IStorage } from "../storage";
import type { Article, HowTo, Post, PendingBusiness } from "@shared/schema";

const CONFIDENCE_THRESHOLD = 70;

export async function moderateArticle(
  article: Article,
  storage: IStorage
): Promise<void> {
  const content = `Title: ${article.title}\n\nExcerpt: ${article.excerpt}\n\nContent: ${article.content}`;
  
  const result = await moderateContent(content, "article");
  
  if (result.isFlagged && result.confidenceScore >= CONFIDENCE_THRESHOLD) {
    await storage.createAiModerationQueueItem({
      itemType: "article",
      itemId: article.id,
      flags: result.categories,
      aiScore: result.confidenceScore,
      aiReasoning: result.reason || "Content flagged by AI moderation",
    });
  }
}

export async function moderateHowTo(
  howTo: HowTo,
  storage: IStorage
): Promise<void> {
  const stepsText = Array.isArray(howTo.steps) 
    ? howTo.steps.map((step: any) => 
        `Step ${step.stepNumber}: ${step.title}\n${step.description}`
      ).join("\n\n")
    : '';
  
  const content = `Title: ${howTo.title}\n\nDescription: ${howTo.description}\n\nSteps:\n${stepsText}`;
  
  const result = await moderateContent(content, "howto");
  
  if (result.isFlagged && result.confidenceScore >= CONFIDENCE_THRESHOLD) {
    await storage.createAiModerationQueueItem({
      itemType: "how_to",
      itemId: howTo.id,
      flags: result.categories,
      aiScore: result.confidenceScore,
      aiReasoning: result.reason || "Content flagged by AI moderation",
    });
  }
}

export async function moderatePost(
  post: Post,
  storage: IStorage
): Promise<void> {
  const result = await moderateContent(post.content, "post");
  
  if (result.isFlagged && result.confidenceScore >= CONFIDENCE_THRESHOLD) {
    await storage.createAiModerationQueueItem({
      itemType: "post",
      itemId: post.id,
      flags: result.categories,
      aiScore: result.confidenceScore,
      aiReasoning: result.reason || "Content flagged by AI moderation",
    });
  }
}

export async function validatePendingBusiness(
  business: PendingBusiness,
  storage: IStorage
): Promise<{
  isValid: boolean;
  issues: string[];
  suggestions: string[];
}> {
  const result = await validateBusinessListing({
    name: business.name,
    description: business.description,
    category: business.category,
    location: business.location,
    contactEmail: business.email || undefined,
    phone: business.phone || undefined,
  });
  
  if (!result.isValid && result.confidenceScore >= CONFIDENCE_THRESHOLD) {
    await storage.createAiModerationQueueItem({
      itemType: "business",
      itemId: business.id,
      flags: ["validation_failed"],
      aiScore: result.confidenceScore,
      aiReasoning: `Validation issues: ${result.issues.join(", ")}`,
    });
  }
  
  return {
    isValid: result.isValid,
    issues: result.issues,
    suggestions: result.suggestions,
  };
}
