"use client";

import Image from "next/image";
import { Loader2, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getUploadLimits,
  type UploadedAsset,
} from "@/modules/uploads/schemas/upload-schema";

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
  const limits = getUploadLimits(postType);
  const remainingSlots = Math.max(0, limits.maxFiles - assets.length);

  async function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    if (remainingSlots === 0) {
      setUploadError(`You have already reached the ${limits.maxFiles}-file limit.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    setUploadError(null);

    const nextAssets: UploadedAsset[] = [...assets];
    const filesToUpload = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      setUploadError(`Only ${remainingSlots} more file(s) can be uploaded for this post type.`);
    }

    try {
      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("postType", postType);
        formData.set("currentCount", String(nextAssets.length));

        const response = await fetch("/api/uploads", {
          method: "POST",
          body: formData,
        });

        const payload = (await response.json().catch(() => null)) as {
          data?: UploadedAsset;
          error?: { message?: string };
        } | null;

        if (!response.ok || !payload?.data) {
          setUploadError(payload?.error?.message ?? "Upload failed.");
          continue;
        }

        nextAssets.push(payload.data);
      }

      onChange(nextAssets);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
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
          <p className="text-muted-foreground text-xs">
            {hintByType[postType]} {assets.length}/{limits.maxFiles} uploaded.
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={handleFileSelection}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading || remainingSlots === 0}
          onClick={() => inputRef.current?.click()}
        >
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
