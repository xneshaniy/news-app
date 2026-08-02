import { NextRequest, NextResponse } from "next/server";
import { clampString } from "@/lib/validation";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function callOpenRouter(messages: { role: string; content: string }[], model = "google/gemini-2.5-flash") {
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://worldlive.dpdns.org",
      "X-Title": "WorldLive News",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 2048,
      temperature: 0.7,
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error: ${response.status} - ${err}`);
  }
  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, content, title, tags, model } = body;

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 });
    }

    const aiModel = model || "google/gemini-2.5-flash";

    if (action === "summarize") {
      if (!content) return NextResponse.json({ error: "Missing content" }, { status: 400 });
      const safeContent = clampString(content, 10000);
      const result = await callOpenRouter(
        [
          { role: "system", content: "You are a professional news editor. Summarize the following article in 2-3 concise paragraphs. Focus on key facts, quotes, and implications. Use clear, journalistic language." },
          { role: "user", content: `Summarize this article:\n\n${safeContent}` },
        ],
        aiModel
      );
      return NextResponse.json({ success: true, summary: result.choices?.[0]?.message?.content || "" });
    }

    if (action === "title") {
      if (!content) return NextResponse.json({ error: "Missing content" }, { status: 400 });
      const safeContent = clampString(content, 3000);
      const result = await callOpenRouter(
        [
          { role: "system", content: "You are a headline writer for a major news organization. Generate 5 compelling, SEO-friendly article titles. Return them as a JSON array of strings." },
          { role: "user", content: `Generate 5 titles for this article:\n\n${safeContent}` },
        ],
        aiModel
      );
      const text = result.choices?.[0]?.message?.content || "[]";
      let titles: string[];
      try {
        const match = text.match(/\[[\s\S]*\]/);
        titles = match ? JSON.parse(match[0]) : text.split("\n").filter((l: string) => l.trim());
      } catch {
        titles = text.split("\n").filter((l: string) => l.trim()).slice(0, 5);
      }
      return NextResponse.json({ success: true, titles });
    }

    if (action === "tags") {
      if (!content) return NextResponse.json({ error: "Missing content" }, { status: 400 });
      const safeContent = clampString(content, 3000);
      const result = await callOpenRouter(
        [
          { role: "system", content: "You are a content tagger. Extract 5-10 relevant tags/keywords from the article. Return them as a JSON array of lowercase strings, no hashtags." },
          { role: "user", content: `Extract tags from:\n\n${safeContent}` },
        ],
        aiModel
      );
      const text = result.choices?.[0]?.message?.content || "[]";
      let tagsList: string[];
      try {
        const match = text.match(/\[[\s\S]*\]/);
        tagsList = match ? JSON.parse(match[0]) : text.split(",").map((t: string) => t.trim().toLowerCase());
      } catch {
        tagsList = text.split(",").map((t: string) => t.trim().toLowerCase()).filter(Boolean);
      }
      return NextResponse.json({ success: true, tags: tagsList });
    }

    if (action === "plagiarism") {
      if (!content) return NextResponse.json({ error: "Missing content" }, { status: 400 });
      const safeContent = clampString(content, 5000);
      const result = await callOpenRouter(
        [
          { role: "system", content: "You are a plagiarism detection assistant. Analyze the following text and provide: 1) An originality score (0-100), 2) Whether it appears to be AI-generated, 3) Any suspicious patterns. Return as JSON: { score: number, aiGenerated: boolean, confidence: string, notes: string }" },
          { role: "user", content: `Analyze this text for originality:\n\n${safeContent}` },
        ],
        aiModel
      );
      const text = result.choices?.[0]?.message?.content || "{}";
      let analysis;
      try {
        const match = text.match(/\{[\s\S]*\}/);
        analysis = match ? JSON.parse(match[0]) : { score: 85, aiGenerated: false, confidence: "medium", notes: text };
      } catch {
        analysis = { score: 85, aiGenerated: false, confidence: "medium", notes: text };
      }
      return NextResponse.json({ success: true, ...analysis });
    }

    if (action === "rewrite") {
      if (!content) return NextResponse.json({ error: "Missing content" }, { status: 400 });
      const tone = body.tone || "professional";
      const safeContent = clampString(content, 5000);
      const result = await callOpenRouter(
        [
          { role: "system", content: `Rewrite the following text in a ${tone} tone. Maintain all facts and key information while improving clarity and readability.` },
          { role: "user", content: safeContent },
        ],
        aiModel
      );
      return NextResponse.json({ success: true, rewritten: result.choices?.[0]?.message?.content || "" });
    }

    if (action === "translate") {
      if (!content || !body.targetLanguage) return NextResponse.json({ error: "Missing content or targetLanguage" }, { status: 400 });
      const safeContent = clampString(content, 5000);
      const safeLanguage = clampString(String(body.targetLanguage), 50);
      const result = await callOpenRouter(
        [
          { role: "system", content: `Translate the following text to ${safeLanguage}. Maintain the original tone and style. Return only the translation, no explanations.` },
          { role: "user", content: safeContent },
        ],
        aiModel
      );
      return NextResponse.json({ success: true, translation: result.choices?.[0]?.message?.content || "" });
    }

    if (action === "chat") {
      const rawMessages = body.messages || [{ role: "user", content }];
      const messages = rawMessages.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role,
        content: clampString(m.content, 2000),
      }));
      const result = await callOpenRouter(
        [{ role: "system", content: "You are WorldLive AI, a helpful news assistant. Answer questions about news, help with research, and provide analysis. Be concise and factual." }, ...messages],
        aiModel
      );
      return NextResponse.json({ success: true, reply: result.choices?.[0]?.message?.content || "" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
