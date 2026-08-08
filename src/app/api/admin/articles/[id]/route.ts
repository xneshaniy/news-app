import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sanitizeString } from "@/lib/api-utils";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, content, canonicalUrl, image, publishedAt, source, author, category, country } = body;

    const article = await prisma.article.update({
      where: { id },
      data: {
        title: title ? sanitizeString(title, 500) : undefined,
        description: description ? sanitizeString(description, 1000) : null,
        content: content ? sanitizeString(content, 50000) : null,
        canonicalUrl: canonicalUrl ? sanitizeString(canonicalUrl, 1000) : undefined,
        image: image !== undefined ? (image || null) : undefined,
        author: author ? sanitizeString(author, 200) : null,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        category: category ? sanitizeString(category, 100) : null,
        country: country ? sanitizeString(country, 100) : null,
        source: source ? sanitizeString(source, 100) : undefined,
      },
    });

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Error updating article:", error);
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting article:", error);
    if (error instanceof Error && error.message.includes("Record to delete not found")) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}