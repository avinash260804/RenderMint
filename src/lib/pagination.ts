type CursorPayload = {
  id: string;
  createdAt: string;
};

export function encodeCursor(payload: CursorPayload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeCursor(cursor: string): CursorPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as CursorPayload;

    if (
      typeof parsed?.id !== "string" ||
      parsed.id.length === 0 ||
      typeof parsed?.createdAt !== "string" ||
      parsed.createdAt.length === 0
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
