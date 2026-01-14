
import { GoogleGenAI, Type } from "@google/genai";
import { ParseResult } from "../types";

const API_KEY = process.env.API_KEY || "";

export const parseStudentList = async (text: string): Promise<ParseResult[]> => {
  if (!API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyseer de volgende tekst en extraheer een lijst van studenten en hun behaalde punten. 
      De tekst kan namen en getallen bevatten in verschillende formaten (bijv. "Jan 12", "Piet: 15", "18 punten voor Klaas").
      Geef alleen een valide JSON array terug van objecten met de velden 'name' (string) en 'score' (number).
      Tekst: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              score: { type: Type.NUMBER }
            },
            required: ["name", "score"]
          }
        }
      }
    });

    const jsonStr = response.text?.trim() || "[]";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    // Fallback logic for simple comma-separated or newline-separated lists if API fails
    return [];
  }
};
