
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { QualityAnalysisResult, ListingSuggestions } from '../types';

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("API_KEY environment variable is not set. Gemini API calls will fail.");
}

let chat: Chat | null = null;

// Schemas for structured responses
const qualityAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    qualityScore: {
      type: Type.STRING,
      description: "A single letter grade from A (Excellent) to D (Poor).",
      enum: ['A', 'B', 'C', 'D'],
    },
    issues: {
      type: Type.ARRAY,
      description: "A list of observed quality issues or defects. If none, return an empty array.",
      items: {
        type: Type.STRING,
        description: "A brief description of a single issue.",
      },
    },
  },
  required: ["qualityScore", "issues"],
};

const listingSuggestionSchema = {
    type: Type.OBJECT,
    properties: {
        suggestedTitle: { type: Type.STRING, description: "A compelling, SEO-friendly title."},
        suggestedDescription: { type: Type.STRING, description: "A rewritten description highlighting unique craftmanship, materials, and origin story."},
        suggestedKeywords: {
            type: Type.ARRAY,
            description: "An array of 5-7 relevant keywords.",
            items: { type: Type.STRING }
        },
        locationInsight: { type: Type.STRING, description: "A short, interesting fact about the craftsmanship or materials from the supplier's region."}
    },
    required: ["suggestedTitle", "suggestedDescription", "suggestedKeywords", "locationInsight"],
}

// Function for Image Analysis
export const analyzeProductImage = async (base64ImageData: string, mimeType: string): Promise<QualityAnalysisResult> => {
  if (!ai) throw new Error("API_KEY not configured.");
  const model = 'gemini-2.5-flash';
  
  const prompt = `You are a meticulous quality control inspector for handcrafted products... Analyze the provided image for any visual defects... Return the result in the specified JSON format.`;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [{ text: prompt }, { inlineData: { data: base64ImageData, mimeType: mimeType } }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: qualityAnalysisSchema,
      }
    });
    
    const jsonString = response.text.trim();
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Error calling Gemini API for image analysis:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};

// Function for Listing Suggestions
export const getListingSuggestions = async (productData: { title: string, description: string, category: string }, country: string): Promise<ListingSuggestions> => {
    if (!ai) throw new Error("API_KEY not configured.");
    const model = 'gemini-2.5-flash';
    const prompt = `You are an expert e-commerce merchandiser specializing in handcrafted goods for a global B2B audience. A supplier from ${country} has provided the following draft information for their product:

    Title: "${productData.title}"
    Category: "${productData.category}"
    Description: "${productData.description}"

    Your task is to provide actionable recommendations to improve this listing. Using Google Maps grounding for context about the supplier's location, provide the following in the specified JSON format:
    1. suggestedTitle: A compelling, SEO-friendly title.
    2. suggestedDescription: A rewritten description that highlights unique craftmanship, materials, and potential uses. Weave in interesting details about the product's origin based on the supplier's location.
    3. suggestedKeywords: An array of 5-7 relevant keywords.
    4. locationInsight: A short, interesting fact about the craftsmanship or materials from the supplier's region.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
                responseMimeType: "application/json",
                responseSchema: listingSuggestionSchema,
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error calling Gemini API for listing suggestions:", error);
        throw new Error("Failed to get suggestions from Gemini API.");
    }
};

// Function for Chatbot
export const chatWithBot = async (message: string): Promise<string> => {
    if (!ai) throw new Error("API_KEY not configured.");
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-pro',
            config: {
                systemInstruction: "You are a helpful assistant for the Borderless SKU Lab, a B2B marketplace for handcrafted goods. Your name is 'SKU-Bot'. You can answer questions about the platform, sourcing, logistics, and help users find products. Be concise and professional, with a slightly futuristic, 'cyberpunk' tone. Use markdown for formatting.",
            }
        });
    }

    try {
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error in chat session:", error);
        // Reset chat on error
        chat = null;
        throw new Error("Chat session failed.");
    }
}
