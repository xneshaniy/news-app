import { NextRequest, NextResponse } from "next/server";
import { fetchWithTimeout, sanitizeString } from "@/lib/api-utils";

const FREE_TRANSLATE_API = "https://api.mymemory.translated.net/get";

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: "Missing text or target language" }, { status: 400 });
    }

    const truncatedText = sanitizeString(text, 500);
    const safeLang = sanitizeString(targetLang, 10);

    try {
      const url = `${FREE_TRANSLATE_API}?q=${encodeURIComponent(truncatedText)}&langpair=en|${safeLang}`;
      const res = await fetchWithTimeout(url, { next: { revalidate: 3600 }, timeout: 8000 });

      if (res.ok) {
        const data = await res.json();
        if (data.responseStatus === 200 && data.responseData?.translatedText) {
          return NextResponse.json({
            translatedText: data.responseData.translatedText,
            source: "mymemory",
          });
        }
      }
    } catch {
      // fallback to next API
    }

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(truncatedText)}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });

      if (res.ok) {
        const data = await res.json();
        if (data[0]) {
          const translated = data[0].map((s: string[]) => s[0]).join("");
          return NextResponse.json({
            translatedText: translated,
            source: "google",
          });
        }
      }
    } catch {
      // all APIs failed
    }

    return NextResponse.json({
      translatedText: `[${targetLang.toUpperCase()}] ${truncatedText}`,
      source: "fallback",
    });
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
