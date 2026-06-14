import { AppError } from "@/lib/handle-error";

type SupabaseLike = {
  auth: {
    getUser: () => Promise<{
      data?: {
        user?: { id: string; email?: string | null } | null;
      };
      error?: unknown;
    }>;
  };
};

export async function requireAuth(supabase: SupabaseLike) {
  const {
    data: { user } = {},
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  return user;
}
