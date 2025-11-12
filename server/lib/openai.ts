import OpenAI from "openai";
import pLimit from "p-limit";
import pRetry, { AbortError } from "p-retry";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
export const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

function isRateLimitError(error: any): boolean {
  const errorMsg = error?.message || String(error);
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RATELIMIT_EXCEEDED") ||
    errorMsg.toLowerCase().includes("quota") ||
    errorMsg.toLowerCase().includes("rate limit")
  );
}

export async function moderateContent(
  content: string,
  contentType: "article" | "howto" | "post" | "business"
): Promise<{
  isFlagged: boolean;
  reason: string | null;
  confidenceScore: number;
  categories: string[];
}> {
  try {
    const response = await pRetry(
      async () => {
        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
            messages: [
              {
                role: "system",
                content: `You are a content moderation AI for a B2B beauty and aesthetics platform. Analyze content for:
- Spam or promotional abuse
- Harassment or offensive language
- Fake or misleading information
- Inappropriate content (sexual, violent, illegal)
- Scams or fraud attempts

Return a JSON object with:
- isFlagged: boolean (true if content violates any policy)
- reason: string or null (brief explanation if flagged)
- confidenceScore: number 0-100 (how confident you are)
- categories: array of strings (which policies were violated: "spam", "harassment", "misinformation", "inappropriate", "fraud")`
              },
              {
                role: "user",
                content: `Content Type: ${contentType}\n\nContent to moderate:\n${content}`
              }
            ],
            response_format: { type: "json_object" },
            max_completion_tokens: 500,
          });

          const result = JSON.parse(completion.choices[0]?.message?.content || "{}");
          return {
            isFlagged: result.isFlagged || false,
            reason: result.reason || null,
            confidenceScore: result.confidenceScore || 0,
            categories: result.categories || [],
          };
        } catch (error: any) {
          if (isRateLimitError(error)) {
            throw error;
          }
          throw new AbortError(error);
        }
      },
      {
        retries: 3,
        minTimeout: 1000,
        maxTimeout: 8000,
        factor: 2,
      }
    );

    return response;
  } catch (error) {
    console.error("Content moderation error:", error);
    return {
      isFlagged: false,
      reason: null,
      confidenceScore: 0,
      categories: [],
    };
  }
}

export async function validateBusinessListing(business: {
  name: string;
  description: string;
  category: string;
  location: string;
  contactEmail?: string;
  phone?: string;
}): Promise<{
  isValid: boolean;
  issues: string[];
  suggestions: string[];
  confidenceScore: number;
}> {
  try {
    const response = await pRetry(
      async () => {
        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
            messages: [
              {
                role: "system",
                content: `You are an AI validator for a DFW beauty and aesthetics business directory. Validate business listings for:
- Completeness: name, description, contact info are meaningful
- Legitimacy: business seems real and professional
- Relevance: business is related to health, beauty, or aesthetics
- Location: business is in DFW area (Dallas-Fort Worth)
- Compliance: no spam, scams, or fake businesses

Return a JSON object with:
- isValid: boolean (true if listing passes validation)
- issues: array of strings (problems found, empty if valid)
- suggestions: array of strings (recommendations for improvement)
- confidenceScore: number 0-100 (how confident you are)`
              },
              {
                role: "user",
                content: `Business Listing:\n${JSON.stringify(business, null, 2)}`
              }
            ],
            response_format: { type: "json_object" },
            max_completion_tokens: 500,
          });

          const result = JSON.parse(completion.choices[0]?.message?.content || "{}");
          return {
            isValid: result.isValid !== false,
            issues: result.issues || [],
            suggestions: result.suggestions || [],
            confidenceScore: result.confidenceScore || 0,
          };
        } catch (error: any) {
          if (isRateLimitError(error)) {
            throw error;
          }
          throw new AbortError(error);
        }
      },
      {
        retries: 3,
        minTimeout: 1000,
        maxTimeout: 8000,
        factor: 2,
      }
    );

    return response;
  } catch (error) {
    console.error("Business validation error:", error);
    return {
      isValid: true,
      issues: [],
      suggestions: [],
      confidenceScore: 0,
    };
  }
}

export async function batchModerateContent(
  items: Array<{ content: string; contentType: "article" | "howto" | "post" | "business" }>
): Promise<Array<{
  isFlagged: boolean;
  reason: string | null;
  confidenceScore: number;
  categories: string[];
}>> {
  const limit = pLimit(2);
  
  const processingPromises = items.map((item) =>
    limit(() => moderateContent(item.content, item.contentType))
  );
  
  return await Promise.all(processingPromises);
}
