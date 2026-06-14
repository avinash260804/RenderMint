import { isUserOnboarded } from "@/modules/auth/server/onboarding-service";

const authRoutePrefixes = ["/login", "/signup", "/auth/login", "/auth/signup"];

export function sanitizeNextPath(nextPath?: string | null) {
  if (!nextPath) return null;

  const trimmed = nextPath.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return null;
  }

  return trimmed;
}

export async function resolvePostAuthRedirect(userId: string, nextPath?: string | null) {
  const safeNext = sanitizeNextPath(nextPath);
  const onboarded = await isUserOnboarded(userId);

  if (!onboarded) {
    return "/onboarding";
  }

  if (!safeNext || safeNext === "/onboarding") {
    return "/dashboard";
  }

  if (authRoutePrefixes.some((prefix) => safeNext.startsWith(prefix))) {
    return "/dashboard";
  }

  return safeNext;
}
