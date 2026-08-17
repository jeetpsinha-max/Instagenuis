import { describe, it, expect, beforeAll, afterAll } from "vitest";
import http from "http";
import { app } from "../server.js";

let server: http.Server;
let baseUrl: string;

beforeAll(async () => {
  server = http.createServer(app);
  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      const addr = server.address();
      const port = typeof addr === "object" && addr ? addr.port : 3000;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

afterAll(async () => {
  if (server) {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

describe("Instagenuis API Integration Tests", () => {
  it("GET /api/health returns status ok and gemini status", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("status", "ok");
    expect(body).toHaveProperty("service", "instagenuis-api");
    expect(body).toHaveProperty("geminiConfigured");
    expect(res.headers.get("x-ratelimit-limit")).toBeDefined();
  });

  it("POST /api/gemini/ask returns 400 when prompt is missing", async () => {
    const res = await fetch(`${baseUrl}/api/gemini/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty("error", "Bad Request");
  });

  it("POST /api/gemini/ask returns valid response or fallback when prompt provided", async () => {
    const res = await fetch(`${baseUrl}/api/gemini/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "Generate 3 reel ideas for tech productivity" })
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("success", true);
    expect(body).toHaveProperty("response");
    expect(typeof body.response).toBe("string");
  });

  it("POST /api/virality/score returns 400 when niche is missing", async () => {
    const res = await fetch(`${baseUrl}/api/virality/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "Test idea" })
    });
    expect(res.status).toBe(400);
  });

  it("GET /api/trends/hashtags returns hashtag list", async () => {
    const res = await fetch(`${baseUrl}/api/trends/hashtags?niche=tech`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("niche", "tech");
    expect(Array.isArray(body.hashtags)).toBe(true);
    expect(body.hashtags.length).toBeGreaterThan(0);
  });
});
