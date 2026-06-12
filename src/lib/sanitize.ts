export function sanitizeText(input: string) {
  return input.replace(/<[^>]*>/g, "").trim();
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
