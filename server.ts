import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

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
