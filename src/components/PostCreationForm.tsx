"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Discipline = { id: string; slug: string; name: string };
type SubmitResult = { slug: string };

export default function PostCreationForm({
  disciplines,
  onSubmit,
}: {
  disciplines: Discipline[];
  onSubmit: (input: {
    title: string;
    content: string;
    disciplineId: string;
    postType: string;
    tags: string;
  }) => Promise<SubmitResult>;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [disciplineId, setDisciplineId] = useState("");
  const [postType, setPostType] = useState("DISCUSSION");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (!tags) return;
    const timer = window.setTimeout(() => {
      void fetch(`/api/tags?q=${encodeURIComponent(tags)}`);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [tags]);

  const titleError = !title.trim()
    ? "Title is required"
    : title.length > 200
      ? "Title is too long. Maximum 200 characters."
      : "";
  const disciplineError = !disciplineId ? "Discipline is required" : "";
  const postTypeError = !postType || !content.trim() ? "Post type is required" : "";
  const contentError = !content.trim() ? "Content is required" : "";
  const canSubmit = !titleError && !disciplineError && !postTypeError && !contentError;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    const result = await onSubmit({ title, content, disciplineId, postType, tags });
    router.push(`/thread/${result.slug}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title
        <input value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      {titleError ? <p>{titleError}</p> : null}
      <label>
        Discipline
        <select value={disciplineId} onChange={(event) => setDisciplineId(event.target.value)}>
          <option value="">Select discipline</option>
          {disciplines.map((discipline) => (
            <option key={discipline.id} value={discipline.id}>
              {discipline.name}
            </option>
          ))}
        </select>
      </label>
      {disciplineError ? <p>{disciplineError}</p> : null}
      <label>
        Content
        <textarea value={content} onChange={(event) => setContent(event.target.value)} />
      </label>
      {contentError ? <p>{contentError}</p> : null}
      <label>
        Post type
        <select value={postType} onChange={(event) => setPostType(event.target.value)}>
          {["DISCUSSION", "HELP", "CRITIQUE", "SHOWCASE", "RESOURCE"].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      {postTypeError ? <p>{postTypeError}</p> : null}
      <input
        aria-label="Tags"
        placeholder="Tags"
        value={tags}
        onChange={(event) => setTags(event.target.value)}
      />
      <button type="submit" disabled={!canSubmit}>
        Publish Post
      </button>
    </form>
  );
}
