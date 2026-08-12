import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Rate Limiting Headers Middleware
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 60;

app.use((req, res, next) => {
  const ip = req.ip || "127.0.0.1";
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + RATE_LIMIT_WINDOW_MS;
  }

  record.count += 1;
  rateLimitMap.set(ip, record);

  res.setHeader("X-RateLimit-Limit", MAX_REQUESTS.toString());
  res.setHeader("X-RateLimit-Remaining", Math.max(0, MAX_REQUESTS - record.count).toString());
  res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000).toString());

  next();
});

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not found in environment.");
  }
  return new GoogleGenAI({ apiKey: apiKey || "" });
};

// 1. Health Check
app.get("/api/health", (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  res.json({
    status: "ok",
    service: "instagenuis-api",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    geminiConfigured: Boolean(apiKey && apiKey !== "your_gemini_api_key_here")
  });
});

// 2. Gemini AI Agent Endpoint
app.post("/api/gemini/ask", async (req, res) => {
  try {
    const { prompt, model = "gemini-2.5-flash", systemInstruction } = req.body;
    if (!prompt) {
      return res.status(400).json({
        error: "Bad Request",
        message: "The 'prompt' field is required in request body."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return res.json({
        success: true,
        response: `[Fallback Mode] Gemini API key not configured. Processing prompt locally: "${prompt}"`,
        fallback: true,
        model
      });
    }

    const ai = getGeminiClient();
    const aiResponse = await ai.models.generateContent({
      model: model || "gemini-2.5-flash",
      contents: prompt,
      ...(systemInstruction ? { config: { systemInstruction } } : {})
    });

    return res.json({
      success: true,
      response: aiResponse.text || "",
      fallback: false,
      model: model || "gemini-2.5-flash"
    });
  } catch (error: any) {
    console.error("Gemini ask endpoint error:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "Failed to process request with Gemini AI",
      fallback: true
    });
  }
});

// 3. Virality Score Prediction
app.post("/api/virality/score", async (req, res) => {
  try {
    const { prompt, niche, timing } = req.body;
    if (!prompt || !niche) return res.status(400).json({ error: "prompt and niche are required" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return res.json({
        score: 85,
        reasoning: "Fallback virality estimation based on high-performing content patterns.",
        fallback: true
      });
    }

    const ai = getGeminiClient();
    const aiPrompt = `Predict the Instagram virality score (0-100) for this idea.
Prompt: "${prompt}"
Niche: "${niche}"
Timing: "${timing || 'Unknown'}"
Analyze based on trendiness, hook strength, and timing. Return ONLY a JSON object with properties 'score' (number 0-100) and 'reasoning' (short text).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: aiPrompt,
      config: { responseMimeType: "application/json" }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Virality score error:", error);
    res.status(500).json({ error: error.message, fallback: true });
  }
});

// 4. AI Content Plan
app.post("/api/content/plan", async (req, res) => {
  try {
    const { niche } = req.body;
    if (!niche) return res.status(400).json({ error: "niche is required" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return res.json({
        plan: Array.from({ length: 7 }, (_, i) => ({
          day: i + 1,
          format: i % 2 === 0 ? "reel" : "carousel",
          hook: `High-converting hook for ${niche} day ${i + 1}`,
          description: `Engaging caption and call-to-action for ${niche}.`
        })),
        fallback: true
      });
    }

    const ai = getGeminiClient();
    const prompt = `Create a 7-day Instagram content calendar with AI hooks for the niche: "${niche}". Return ONLY a JSON object with property 'plan', which is an array of 7 objects. Each object must have 'day' (number 1-7), 'format' (e.g. reel, carousel, story), 'hook' (string), and 'description' (string).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Content plan error:", error);
    res.status(500).json({ error: error.message, fallback: true });
  }
});

// 5. Trending Hashtags
app.get("/api/trends/hashtags", (req, res) => {
  const { niche = "general" } = req.query;
  res.json({
    niche,
    hashtags: [
      `#${niche}Life`,
      `#${niche}Tips`,
      `#${niche}Hacks`,
      "#Viral",
      "#ExplorePage",
      "#TrendingNow"
    ]
  });
});

async function startServer() {
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

  app.listen(PORT, () => {
    console.log(`Instagenuis API running on http://localhost:${PORT}`);
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}
