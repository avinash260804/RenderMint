import { NextResponse } from "next/server";

import { prisma } from "@/server/db/client";
import { deletePost, getPostBySlug, updatePost } from "@/modules/posts/post-service";

type RouteProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function GET(_: Request, { params }: RouteProps) {
  const { slug } = await params;
  const post = await getPostBySlug(prisma, slug);
  if (!post) return jsonError("Post not found", 404);
  return NextResponse.json({ data: post });
}

export async function PATCH(request: Request, { params }: RouteProps) {
  if (!isAuthenticated(request)) return jsonError("Unauthorized", 401);
  const { slug } = await params;
  const existing = await getPostBySlug(prisma, slug);
  if (!existing) return jsonError("Post not found", 404);

  const body = await request.json().catch(() => null);
  const post = await updatePost(prisma, "user-auth-1", existing.id, body ?? {});
  return NextResponse.json({ data: post });
}

export async function DELETE(request: Request, { params }: RouteProps) {
  if (!isAuthenticated(request)) return jsonError("Unauthorized", 401);
  const { slug } = await params;
  const existing = await getPostBySlug(prisma, slug);
  if (!existing) return jsonError("Post not found", 404);

  await deletePost(prisma, "user-auth-1", existing.id);
  return new NextResponse(null, { status: 204 });
}

function isAuthenticated(request: Request) {
  return request.headers.get("cookie")?.includes("sb-access-token") ?? false;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: { message } }, { status });
}
