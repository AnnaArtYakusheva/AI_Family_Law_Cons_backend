import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3002;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash-lite-preview-09-2025";
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const SITE_URL = process.env.SITE_URL || FRONTEND_ORIGIN;
const SITE_TITLE = process.env.SITE_TITLE || "AI Family Law Consultant";

if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is missing. Set it in environment variables.");
}

app.use(
  cors({
    origin: FRONTEND_ORIGIN.split(",").map((origin) => origin.trim()),
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "3mb" }));

app.use(express.static("."));

async function callOpenRouter({ prompt, responseFormat = "text" }) {
  const body = {
    model: "openrouter/auto",
    extra_body: {
      route: "fallback",
      models: [
        OPENROUTER_MODEL,
        "anthropic/claude-3-haiku"
      ],
    },
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format:
      responseFormat === "json" ? { type: "json_object" } : undefined,
  };

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": SITE_URL,
      "X-Title": SITE_TITLE,
    },
    body: JSON.stringify(body),
  });

  const raw = await response.text();

  if (!response.ok) {
    throw new Error(`OpenRouter error ${response.status}: ${raw}`);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Failed to parse OpenRouter response: ${raw}`);
  }

  const text = data.choices?.[0]?.message?.content || "";

  return {
    text,
    usage: data.usage || null,
    model: data.model || OPENROUTER_MODEL,
  };
}

app.post("/api/llm", async (req, res) => {
  try {
    const { prompt, responseFormat } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "prompt is required and must be a string",
      });
    }

    const result = await callOpenRouter({
      prompt,
      responseFormat,
    });

    return res.json(result);
  } catch (error) {
    console.error("[/api/llm] error:", error);

    return res.status(500).json({
      error: "LLM request failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    model: OPENROUTER_MODEL,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend started on port ${PORT}`);
});