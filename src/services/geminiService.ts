import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export async function analyzeRepository(repoName: string, description: string, readme: string) {
  const prompt = `
    Analyze the following GitHub repository and provide a human-readable summary.
    Repository Name: ${repoName}
    Short Description: ${description}
    
    README Content (First 2000 chars):
    ${readme.substring(0, 2000)}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are an expert technical writer. Your goal is to explain complex codebases to both developers and beginners. 
      Generate a JSON response following this schema:
      {
        summary: "A clear, simple 2-3 sentence overview of what this project does.",
        keyFeatures: ["List 3-5 main features"],
        techStack: ["List detected languages, frameworks, and libraries"],
        beginnerExplanation: "A very simple, beginner-friendly explanation of why someone would use this."
      }`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          keyFeatures: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          techStack: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          beginnerExplanation: { type: Type.STRING }
        },
        required: ["summary", "keyFeatures", "techStack", "beginnerExplanation"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Invalid AI response format");
  }
}
