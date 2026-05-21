"use client";

import Image from "next/image";
import { Loader2, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UploadedAsset } from "@/modules/uploads/schemas/upload-schema";

type PostType = "discussion" | "critique" | "showcase" | "help" | "resource";

type AssetUploaderProps = {
  postType: PostType;
  assets: UploadedAsset[];
  onChange: (assets: UploadedAsset[]) => void;
  error?: string;
};

const hintByType: Record<PostType, string> = {
  discussion: "Optional images for context.",
  critique: "At least one image is required.",
  showcase: "Upload a gallery of final visuals.",
  help: "At least one screenshot is required.",
  resource: "Optional files/images for references.",
};

export function AssetUploader({ postType, assets, onChange, error }: AssetUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    setUploadError(null);

    const nextAssets: UploadedAsset[] = [...assets];

    for (const file of files) {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("postType", postType);

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json().catch(() => null)) as {
        asset?: UploadedAsset;
        error?: string;
      } | null;

      if (!response.ok || !payload?.asset) {
        setUploadError(payload?.error ?? "Upload failed.");
        continue;
      }

      nextAssets.push(payload.asset);
    }

    onChange(nextAssets);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAsset(index: number) {
    const next = assets.filter((_, currentIndex) => currentIndex !== index);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Attachments</p>
          <p className="text-muted-foreground text-xs">{hintByType[postType]}</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={handleFileSelection}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <UploadCloud className="size-4" /> Add files
        </Button>
      </div>

      {uploading ? (
        <div className="text-muted-foreground inline-flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" /> Uploading...
        </div>
      ) : null}

      {uploadError ? <p className="text-destructive text-sm">{uploadError}</p> : null}
      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      {assets.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset, index) => (
            <div
              key={`${asset.key}-${index}`}
              className="bg-card border-border/70 rounded-xl border p-2"
            >
              <div className="bg-muted relative mb-2 aspect-[4/3] overflow-hidden rounded-lg">
                <Image src={asset.url} alt={asset.name} fill className="object-cover" unoptimized />
              </div>
              <div className="space-y-2">
                <p className="truncate text-xs font-medium">{asset.name}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px]">
                    {Math.max(1, Math.round(asset.size / 1024))} KB
                  </Badge>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => removeAsset(index)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground border-border rounded-xl border border-dashed px-4 py-5 text-sm">
          No files added yet.
        </div>
      )}
    </div>
  );
}
