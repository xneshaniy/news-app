import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { sanitizeString } from "@/lib/api-utils";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "20")));
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const author = searchParams.get("author") || "all";

    const where: Prisma.ArticleWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category !== "all") {
      where.category = category;
    }

    if (author !== "all") {
      where.source = author;
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          content: true,
          canonicalUrl: true,
          image: true,
          publishedAt: true,
          source: true,
          author: true,
          category: true,
          country: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, content, canonicalUrl, image, publishedAt, source, author, category, country } = body;

    if (!title || !canonicalUrl) {
      return NextResponse.json({ error: "Title and canonical URL are required" }, { status: 400 });
    }

    const article = await prisma.article.create({
      data: {
        source: source || "Manual",
        sourceArticleId: null,
        canonicalUrl,
        title: sanitizeString(title, 500),
        description: description ? sanitizeString(description, 1000) : null,
        content: content ? sanitizeString(content, 50000) : null,
        image: image || null,
        author: author ? sanitizeString(author, 200) : null,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        category: category ? sanitizeString(category, 100) : null,
        country: country ? sanitizeString(country, 100) : null,
      },
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Article with this URL already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}