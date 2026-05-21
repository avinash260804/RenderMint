import { NextResponse } from "next/server";

import { uploadRequestSchema } from "@/modules/uploads/schemas/upload-schema";
import { uploadAsset } from "@/modules/uploads/server/upload-service";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const postType = formData.get("postType");

    if (!(file instanceof File) || typeof postType !== "string") {
      return NextResponse.json({ error: "Invalid upload payload." }, { status: 400 });
    }

    const parsed = uploadRequestSchema.safeParse({ postType });

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid post type for upload." }, { status: 400 });
    }

    const asset = await uploadAsset({
      file,
      postType: parsed.data.postType,
    });

    return NextResponse.json({ asset });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
