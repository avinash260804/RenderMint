import { NextResponse } from "next/server";

import { getAssetObject } from "@/modules/uploads/server/upload-service";

export async function GET(_request: Request, { params }: { params: { key: string[] } }) {
  const key = params.key.join("/");

  const asset = await getAssetObject(key);
  if (!asset) {
    return NextResponse.json({ error: "Asset not found." }, { status: 404 });
  }

  return new NextResponse(asset.stream, {
    headers: {
      "Content-Type": asset.contentType,
      ...(asset.contentLength ? { "Content-Length": String(asset.contentLength) } : {}),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
