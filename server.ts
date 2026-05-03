import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // GitHub Proxy API to avoid CORS issues and allow easy fetching of repo data
  app.get("/api/github/repos/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "GitHub-Project-Desplanner-AI"
        }
      });
      
      if (!response.ok) {
        return res.status(response.status).json({ error: "Failed to fetch repositories" });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching repos:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Fetch README content for a repo
  app.get("/api/github/readme/:owner/:repo", async (req, res) => {
    try {
      const { owner, repo } = req.params;
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: {
          "Accept": "application/vnd.github.v3.raw",
          "User-Agent": "GitHub-Project-Desplanner-AI"
        }
      });
      
      if (!response.ok) {
        return res.json({ content: "No README found." });
      }
      
      const content = await response.text();
      res.json({ content });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // AI Analysis Endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "API key is missing. Please provide a valid API key." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const { repoName, description, readme } = req.body;

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

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("AI Analysis error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze repository" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
