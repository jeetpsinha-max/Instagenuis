import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../server.js";

describe("Instagenuis API Integration Tests", () => {
  it("GET /api/health returns status ok and gemini status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("service", "instagenuis-api");
    expect(res.body).toHaveProperty("geminiConfigured");
    expect(res.headers).toHaveProperty("x-ratelimit-limit");
    expect(res.headers).toHaveProperty("x-ratelimit-remaining");
  });

  it("POST /api/gemini/ask returns 400 when prompt is missing", async () => {
    const res = await request(app).post("/api/gemini/ask").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Bad Request");
  });

  it("POST /api/gemini/ask returns valid response or fallback when prompt provided", async () => {
    const res = await request(app)
      .post("/api/gemini/ask")
      .send({ prompt: "Generate 3 reel ideas for tech productivity" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("response");
    expect(typeof res.body.response).toBe("string");
  });

  it("POST /api/virality/score returns 400 when niche is missing", async () => {
    const res = await request(app).post("/api/virality/score").send({ prompt: "Test idea" });
    expect(res.status).toBe(400);
  });

  it("GET /api/trends/hashtags returns hashtag list", async () => {
    const res = await request(app).get("/api/trends/hashtags?niche=tech");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("niche", "tech");
    expect(Array.isArray(res.body.hashtags)).toBe(true);
    expect(res.body.hashtags.length).toBeGreaterThan(0);
  });
});
