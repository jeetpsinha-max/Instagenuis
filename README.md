# 🚀 Instagenuis - AI-Powered Instagram Growth Engine

[![CI/CD Pipeline](https://github.com/Avinashb722/Instagenuis/actions/workflows/ci.yml/badge.svg)](https://github.com/Avinashb722/Instagenuis/actions)
[![Powered by Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%202.5-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Instagenuis** is an enterprise-grade, AI-driven content strategy and virality prediction engine built for content creators, agencies, and social media managers. Leveraging Google Gemini 2.5 Flash LLMs (`@google/genai`), Instagenuis analyzes content hooks, estimates virality scores, constructs 7-day content calendars, and surfaces trending hashtags in real time.

---

## 🏗 System Architecture

```mermaid
graph TD
    User([User Interface - React + Tailwind]) -->|HTTPS / REST API| Server[Express Server tsx/node]
    Server -->|CORS / Rate Limiting| Security[Security & Rate Limit Middleware]
    Security -->|Route Handling| Endpoints{API Controllers}
    Endpoints -->|Prompt Engineering| GeminiSDK[@google/genai SDK]
    GeminiSDK -->|API Request| GoogleGemini[Google Gemini 2.5 Flash API]
    GoogleGemini -->|AI Insights / JSON| GeminiSDK
    GeminiSDK -->|Structured Payload| Endpoints
    Endpoints -->|JSON Response| User

    subgraph Error Handling & Fallback
        Server -.->|Key Missing / Outage| FallbackEngine[Resilient Fallback Mode]
        FallbackEngine -.->|Mock Structured Data| User
    end
```

---

## ⚡ Key Features

- 🧠 **Gemini AI Agent Integration**: Intelligent prompt execution powered by `@google/genai` (Gemini 2.5 Flash).
- 📈 **Virality Predictor**: Algorithmic score estimation (0-100) with detailed reasoning based on hook strength and audience timing.
- 📅 **Automated Content Planner**: Generates full 7-day multi-format Instagram content schedules (Reels, Carousels, Stories).
- 🏷️ **Hashtag Intelligence**: Dynamic hashtag recommendations tuned to target content niches.
- 🔒 **Security Hardened**: Pre-configured CORS, custom rate-limiting headers (`X-RateLimit-*`), input sanitization, and fallback resiliency.
- 🧪 **Comprehensive Test Suite**: Vitest + Supertest integration testing suite verifying all API endpoints.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_google_gemini_api_key_here
```

---

## 🚀 Quick Setup & Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Avinashb722/Instagenuis.git
   cd Instagenuis
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY into .env
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Access the server at `http://localhost:3000`.

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

---

## 📡 API Reference

### Health Check
- **GET** `/api/health`
- **Response**:
  ```json
  {
    "status": "ok",
    "service": "instagenuis-api",
    "timestamp": "2026-08-12T12:00:00.000Z",
    "version": "1.0.0",
    "geminiConfigured": true
  }
  ```

### Ask Gemini AI Agent
- **POST** `/api/gemini/ask`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "prompt": "Write a 30-second Instagram Reel script about morning routines for developers.",
    "model": "gemini-2.5-flash"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "response": "Hook: 'Stop scrolling if you want to double your coding output before 9 AM...'",
    "fallback": false,
    "model": "gemini-2.5-flash"
  }
  ```

### Virality Score Prediction
- **POST** `/api/virality/score`
- **Body**:
  ```json
  {
    "prompt": "5 VS Code extensions you didn't know existed",
    "niche": "coding",
    "timing": "Monday Morning"
  }
  ```

### Content Plan Generator
- **POST** `/api/content/plan`
- **Body**:
  ```json
  {
    "niche": "fitness"
  }
  ```

### Trending Hashtags
- **GET** `/api/trends/hashtags?niche=tech`

---

## 🧪 Testing Guide

Run the Vitest integration suite:

```bash
# Execute unit & integration tests
npm test

# Run linter & type check
npm run lint
```

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).
