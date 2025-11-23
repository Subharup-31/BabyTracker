import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getPediatricResponse(userMessage: string): Promise<string> {
  const systemPrompt = `You are a friendly and knowledgeable pediatric assistant.
Your role is to provide helpful, accurate, and reassuring information about baby health, development, vaccines, feeding, sleep, and common parenting concerns.

Guidelines:
- Be warm, supportive, and empathetic
- Provide evidence-based information
- When appropriate, suggest consulting a pediatrician
- Keep responses concise but informative
- Use simple, parent-friendly language
- Never provide emergency medical advice - always recommend seeking immediate medical attention for emergencies

Remember: You're here to support and inform parents, not replace professional medical care.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: userMessage,
    });

    return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("Gemini API error:", error);
    
    // Handle quota exceeded errors
    if (error.status === 429) {
      throw new Error("AI service quota exceeded. Please try again in a few minutes or check your Gemini API billing settings.");
    }
    
    // Handle other API errors
    if (error.status) {
      throw new Error(`AI service error (${error.status}). Please try again later.`);
    }
    
    throw new Error("Failed to get AI response. Please try again later.");
  }
}
