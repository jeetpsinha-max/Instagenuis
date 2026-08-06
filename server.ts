import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.post("/api/analyze-transcript", async (req, res) => {
  try {
    const { transcript, videoTitle, platform = 'tiktok' } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: "Transcript is required" });
    }

    const prompt = `
      You are an expert social media strategist for ${platform}. 
      Analyze the following transcript of a long-form video titled "${videoTitle}".
      Identify 3-5 high-engagement, viral-potential short clips (30-60 seconds each) specifically optimized for ${platform}'s algorithm.
      
      For each clip, provide:
      1. A catchy, click-worthy title for ${platform}.
      2. A technical justification of why this hook will work on ${platform}.
      3. Estimated start and end time (approximate based on the text).
      4. A suggested high-retention caption with relevant hashtags for ${platform}.

      Transcript:
      ${transcript}

      Return the response as a JSON array of objects.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }
    
    const clips = JSON.parse(text);
    res.json({ clips });
  } catch (error: any) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ClipGenius Backend running on http://localhost:${PORT}`);
  });
}

startServer();
