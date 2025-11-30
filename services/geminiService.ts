import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis, AutomationRequest } from "../types";

// Note: In a real app, this should be behind a backend proxy.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeRequestWithGemini = async (request: AutomationRequest): Promise<AIAnalysis> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    You are a Senior Revit API Developer and Python Automation Expert.
    Analyze the following automation request from an architect.
    
    Request Title: ${request.title}
    Project: ${request.projectName}
    Revit Version: ${request.revitVersion}
    Request Description: ${request.description}
    
    Provide a technical analysis for implementing this using pyRevit or RevitPythonShell.
    Consider version-specific API differences if applicable for Revit ${request.revitVersion}.
    
    1. Estimate complexity (1-10).
    2. List necessary Revit API namespaces (e.g., Autodesk.Revit.DB...).
    3. Provide a brief implementation strategy.
    4. Write a Pseudo-code outline.
  `;

  // Prepare contents. If there are image attachments, we include them.
  const parts: any[] = [{ text: prompt }];

  // Filter for images in attachments
  request.attachments.forEach(att => {
    if (att.type.startsWith('image/')) {
        // Remove data url prefix for API
        const base64Data = att.data.split(',')[1];
        parts.push({
            inlineData: {
                mimeType: att.type,
                data: base64Data
            }
        });
    }
  });

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          complexityScore: { type: Type.NUMBER, description: "1 is trivial, 10 is impossible" },
          suggestedNamespaces: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of Revit API namespaces needed" 
          },
          implementationStrategy: { type: Type.STRING, description: "High level summary of the approach" },
          pseudoCode: { type: Type.STRING, description: "Pythonic pseudo code logic" }
        },
        required: ["complexityScore", "suggestedNamespaces", "implementationStrategy", "pseudoCode"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");

  return JSON.parse(text) as AIAnalysis;
};
