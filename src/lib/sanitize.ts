export function sanitizeText(input: string) {
  return input.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<[^>]*>/g, "").trim();
}

export function sanitizeHtml(input: string) {
  return sanitizeText(input);
}

export function sanitizeUrl(input: string) {
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
