import DOMPurify from "isomorphic-dompurify";

export function sanitizeText(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }).trim();
}

export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li", "code", "pre"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  }).trim();
}

export function sanitizeUrl(input: string): string | null {
  const value = input.trim();

  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) return null;

  try {
    const url = new URL(value);
    return url.toString();
  } catch {
    return null;
  }
}
