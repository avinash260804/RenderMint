"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, PencilLine, Save } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";

import { AssetUploader } from "@/components/upload/asset-uploader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  postCreationDefaultValues,
  postCreationSchema,
  type PostCreationInput,
  type PostCreationValidated,
} from "@/modules/posts/schemas/post-creation-schema";
import { cn } from "@/lib/utils";

const postTypes = ["discussion", "critique", "showcase", "help", "resource"] as const;
const disciplines = ["architecture", "interior-design", "urban-design"] as const;

const softwaresByDiscipline: Record<(typeof disciplines)[number], string[]> = {
  architecture: ["Rhino", "Grasshopper", "Revit", "AutoCAD", "SketchUp"],
  "interior-design": ["SketchUp", "AutoCAD", "V-Ray", "Enscape"],
  "urban-design": ["Rhino", "GIS", "Illustrator"],
};

const draftStorageKey = (postType: PostCreationInput["postType"]) =>
  `designershub:draft:${postType}`;

type Mode = "edit" | "preview";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-destructive text-sm">{message}</p>;
}

export function PostCreationForm() {
  const [mode, setMode] = useState<Mode>("edit");
  const [savedNotice, setSavedNotice] = useState("Draft autosaves locally.");

  const form = useForm<PostCreationInput, unknown, PostCreationValidated>({
    resolver: zodResolver(postCreationSchema),
    defaultValues: postCreationDefaultValues,
    mode: "onSubmit",
  });

  const values = form.watch();
  const postType = form.watch("postType");
  const discipline = form.watch("discipline") as (typeof disciplines)[number];
  const attachments = values.attachments ?? [];

  useEffect(() => {
    const raw = localStorage.getItem(draftStorageKey(postType));
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<PostCreationInput>;
      form.reset({ ...postCreationDefaultValues, ...parsed, postType });
      setSavedNotice(`Loaded ${postType} draft from local storage.`);
    } catch {
      setSavedNotice("Could not load saved draft.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postType]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      localStorage.setItem(draftStorageKey(postType), JSON.stringify(values));
    }, 500);

    return () => window.clearTimeout(timer);
  }, [postType, values]);

  const softwareOptions = useMemo(() => softwaresByDiscipline[discipline] ?? [], [discipline]);

  function handleClearDraft() {
    localStorage.removeItem(draftStorageKey(postType));
    form.reset({ ...postCreationDefaultValues, postType });
    setSavedNotice(`Cleared ${postType} draft.`);
  }

  async function onSubmit(input: PostCreationValidated) {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const payload = (await response.json().catch(() => null)) as
      | {
          data?: { slug?: string };
          error?: { message?: string };
        }
      | null;

    if (!response.ok) {
      setSavedNotice(
        payload?.error?.message ??
          "Post validation passed locally, but publishing failed. Check auth/onboarding state.",
      );
      return;
    }

    localStorage.setItem(`designershub:submitted:${Date.now()}`, JSON.stringify(payload?.data));
    localStorage.removeItem(draftStorageKey(input.postType));
    setSavedNotice(
      payload?.data?.slug
        ? `Post created successfully with slug ${payload.data.slug}.`
        : "Post created successfully.",
    );
    form.reset({
      ...postCreationDefaultValues,
      postType: input.postType,
      discipline: input.discipline,
    });
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-card/80 rounded-2xl">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl">Create Post</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              Step-based dynamic form with validation, draft autosave, and preview.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={mode === "edit" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("edit")}
            >
              <PencilLine className="size-4" /> Edit
            </Button>
            <Button
              variant={mode === "preview" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("preview")}
            >
              <Eye className="size-4" /> Preview
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="border-border/60 bg-muted/40 text-muted-foreground rounded-xl border px-4 py-3 text-sm">
            {savedNotice}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Post type</label>
            <select
              className="border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 h-10 w-full rounded-lg border bg-transparent px-3 text-sm outline-none"
              value={postType}
              onChange={(event) =>
                form.setValue("postType", event.target.value as PostCreationInput["postType"], {
                  shouldValidate: true,
                })
              }
            >
              {postTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {mode === "edit" ? (
            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input {...form.register("title")} placeholder="Write a clear post title" />
                  <FieldError message={form.formState.errors.title?.message} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Discipline</label>
                  <select
                    className="border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 h-10 w-full rounded-lg border bg-transparent px-3 text-sm outline-none"
                    {...form.register("discipline")}
                  >
                    {disciplines.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <FieldError message={form.formState.errors.discipline?.message} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Software {postType === "help" ? "(required)" : "(optional)"}
                  </label>
                  <select
                    className="border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 h-10 w-full rounded-lg border bg-transparent px-3 text-sm outline-none"
                    {...form.register("software")}
                  >
                    <option value="">Select software</option>
                    {softwareOptions.map((software) => (
                      <option key={software} value={software}>
                        {software}
                      </option>
                    ))}
                  </select>
                  <FieldError message={form.formState.errors.software?.message} />
                </div>
              </div>

              <AssetUploader
                postType={postType}
                assets={attachments}
                onChange={(attachments) =>
                  form.setValue("attachments", attachments, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                error={form.formState.errors.attachments?.message}
              />

              {postType === "discussion" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Body</label>
                    <Textarea
                      {...form.register("body")}
                      rows={6}
                      placeholder="Describe your discussion topic in detail."
                    />
                    <FieldError message={form.formState.errors.body?.message} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags</label>
                    <Input
                      {...form.register("tags")}
                      placeholder="workflow, presentation, studio-culture"
                    />
                  </div>
                </>
              ) : null}

              {postType === "critique" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Context</label>
                    <Textarea
                      {...form.register("context")}
                      rows={3}
                      placeholder="Project stage, site, and goals."
                    />
                    <FieldError message={form.formState.errors.context?.message} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project description</label>
                    <Textarea
                      {...form.register("projectDescription")}
                      rows={4}
                      placeholder="Explain the design intent and current direction."
                    />
                    <FieldError message={form.formState.errors.projectDescription?.message} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Challenge statement</label>
                    <Textarea
                      {...form.register("challengeStatement")}
                      rows={3}
                      placeholder="What specific challenge do you want help with?"
                    />
                    <FieldError message={form.formState.errors.challengeStatement?.message} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Feedback requested</label>
                    <Input
                      {...form.register("feedbackRequested")}
                      placeholder="Facade language, zoning clarity, circulation..."
                    />
                  </div>
                </>
              ) : null}

              {postType === "showcase" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project summary</label>
                    <Textarea
                      {...form.register("projectSummary")}
                      rows={4}
                      placeholder="Summarize the project and final outcome."
                    />
                    <FieldError message={form.formState.errors.projectSummary?.message} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tools used</label>
                    <Input
                      {...form.register("toolsUsed")}
                      placeholder="Rhino, Grasshopper, V-Ray"
                    />
                    <FieldError message={form.formState.errors.toolsUsed?.message} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project link (optional)</label>
                    <Input {...form.register("projectLink")} placeholder="https://..." />
                    <FieldError message={form.formState.errors.projectLink?.message} />
                  </div>
                </>
              ) : null}

              {postType === "help" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Issue description</label>
                    <Textarea
                      {...form.register("issueDescription")}
                      rows={4}
                      placeholder="Describe exactly what is failing and when."
                    />
                    <FieldError message={form.formState.errors.issueDescription?.message} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Error context (optional)</label>
                    <Textarea
                      {...form.register("errorContext")}
                      rows={3}
                      placeholder="Error messages, steps to reproduce, expected output."
                    />
                  </div>
                </>
              ) : null}

              {postType === "resource" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Resource explanation</label>
                    <Textarea
                      {...form.register("resourceExplanation")}
                      rows={4}
                      placeholder="Explain why this resource matters and who should use it."
                    />
                    <FieldError message={form.formState.errors.resourceExplanation?.message} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Resource links (comma or newline separated)
                    </label>
                    <Textarea
                      {...form.register("resourceLinks")}
                      rows={3}
                      placeholder="https://example.com\nhttps://example.org"
                    />
                    <FieldError message={form.formState.errors.resourceLinks?.message} />
                  </div>
                </>
              ) : null}

              <CardFooter className="bg-transparent px-0 pb-0">
                <div className="flex w-full flex-wrap items-center justify-between gap-3">
                  <Button type="button" variant="ghost" onClick={handleClearDraft}>
                    Clear Draft
                  </Button>
                  <Button type="submit">
                    <Save className="size-4" /> Validate & Save Draft Submission
                  </Button>
                </div>
              </CardFooter>
            </form>
          ) : (
            <PostPreview values={values} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PostPreview({ values }: { values: PostCreationInput }) {
  return (
    <div className="border-border/70 bg-muted/30 space-y-4 rounded-xl border p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="capitalize">{values.postType}</Badge>
        <Badge variant="outline" className="capitalize">
          {values.discipline}
        </Badge>
        {values.software ? <Badge variant="secondary">{values.software}</Badge> : null}
      </div>

      <h3
        className={cn(
          "text-balance text-2xl font-semibold tracking-tight",
          !values.title && "text-muted-foreground",
        )}
      >
        {values.title || "Untitled post"}
      </h3>

      {values.postType === "discussion" ? (
        <p className="whitespace-pre-wrap text-sm">{values.body || "No body yet."}</p>
      ) : null}
      {values.postType === "critique" ? (
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Context:</span> {values.context || "-"}
          </p>
          <p>
            <span className="font-medium">Project:</span> {values.projectDescription || "-"}
          </p>
          <p>
            <span className="font-medium">Challenge:</span> {values.challengeStatement || "-"}
          </p>
          <p>
            <span className="font-medium">Feedback:</span> {values.feedbackRequested || "-"}
          </p>
        </div>
      ) : null}
      {values.postType === "showcase" ? (
        <div className="space-y-2 text-sm">
          <p className="whitespace-pre-wrap">{values.projectSummary || "No summary yet."}</p>
          <p>
            <span className="font-medium">Tools:</span> {values.toolsUsed || "-"}
          </p>
          <p>
            <span className="font-medium">Link:</span> {values.projectLink || "-"}
          </p>
        </div>
      ) : null}
      {values.postType === "help" ? (
        <div className="space-y-2 text-sm">
          <p className="whitespace-pre-wrap">
            {values.issueDescription || "No issue description yet."}
          </p>
          <p>
            <span className="font-medium">Error context:</span> {values.errorContext || "-"}
          </p>
        </div>
      ) : null}
      {values.postType === "resource" ? (
        <div className="space-y-2 text-sm">
          <p className="whitespace-pre-wrap">
            {values.resourceExplanation || "No explanation yet."}
          </p>
          <p>
            <span className="font-medium">Links:</span> {values.resourceLinks || "-"}
          </p>
        </div>
      ) : null}

      {values.tags ? (
        <div className="flex flex-wrap gap-2">
          {values.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
            .map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
        </div>
      ) : null}

      {(values.attachments ?? []).length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(values.attachments ?? []).map((asset, index) => (
            <div
              key={`${asset.key}-${index}`}
              className="border-border/70 overflow-hidden rounded-lg border"
            >
              <div className="relative aspect-[4/3]">
                <Image src={asset.url} alt={asset.name} fill className="object-cover" unoptimized />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
