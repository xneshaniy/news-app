import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cutoffDays = Number(process.env.ARTICLE_RETENTION_DAYS) || 14;
    const cutoff = new Date(Date.now() - cutoffDays * 24 * 60 * 60 * 1000);

    const result = await prisma.article.deleteMany({
      where: {
        publishedAt: { lt: cutoff },
        source: { not: "Manual" },
      },
    });

    return NextResponse.json({
      success: true,
      deleted: result.count,
      cutoff: cutoff.toISOString(),
    });
  } catch (error) {
    console.error("Cleanup job failed:", error);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}