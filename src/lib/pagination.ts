type CursorPayload = {
  id: string;
  createdAt: string;
};

type PaginationInput = {
  page?: number;
  limit?: number;
};

export function getPaginationParams(input: PaginationInput) {
  const page = Math.max(1, Math.floor(input.page ?? 1));
  const take = Math.min(Math.max(Math.floor(input.limit ?? 20), 1), 100);

  return {
    skip: (page - 1) * take,
    take,
  };
}

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
