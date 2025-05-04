"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createGeminiPrompt } from "@/lib/geminiPrompt";

type NGO = {
  id: string;
  name: string;
  des: string;
};

type GeminiResponse = {
  message: string;
  ngos: NGO[];
};

export async function getGeminiResponse(userQuery: string, ngos: NGO[]): Promise<GeminiResponse> {
  const prompt = createGeminiPrompt(userQuery, ngos);

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not defined in environment");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // use "gemini-1.5-pro" if needed

  const chatSession = model.startChat({
    generationConfig: {
      temperature: 0.8,
      topK: 32,
      topP: 0.95,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    },
    history: [
      {
        role: "user",
        parts: [{ text: "You are an assistant that helps users discover NGOs." }],
      },
      {
        role: "model",
        parts: [{ text: "Sure! I can help with that. Please tell me what you're looking for." }],
      },
    ],
  });

  try {
    const result = await chatSession.sendMessage(prompt);
    const raw = result.response.text();

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No valid JSON found in Gemini response");

    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to get response from Gemini");
  }
}
