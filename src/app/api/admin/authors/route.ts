import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { getAuthors, createAuthor, updateAuthor, deleteAuthor } from "@/lib/author-store";

async function requireAdmin(request: NextRequest): Promise<boolean> {
  const session = request.cookies.get("admin-session");
  if (!session?.value) return false;
  return verifyAdminToken(session.value);
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ authors: getAuthors() });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const result = createAuthor({
    name: String(body.name || ""),
    email: String(body.email || ""),
    role: body.role === "admin" || body.role === "editor" ? body.role : "author",
    bio: String(body.bio || ""),
    password: String(body.password || ""),
  });
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ author: result.author }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const body = await request.json().catch(() => null);
  const author = updateAuthor(id, {
    name: body?.name !== undefined ? String(body.name) : undefined,
    role: body?.role === "admin" || body?.role === "editor" || body?.role === "author" ? body.role : undefined,
    bio: body?.bio !== undefined ? String(body.bio) : undefined,
    status: body?.status === "active" || body?.status === "inactive" ? body.status : undefined,
    password: body?.password ? String(body.password) : undefined,
  });
  if (!author) return NextResponse.json({ error: "Author not found" }, { status: 404 });
  return NextResponse.json({ author });
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const ok = deleteAuthor(id);
  if (!ok) return NextResponse.json({ error: "Author not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
