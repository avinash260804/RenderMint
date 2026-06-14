"use client";

import { AuthPage } from "@/components/v0/login/auth-page";

type AuthActionsProps = {
  mode: "login" | "signup";
  nextPath?: string | null;
  errorCode?: string | null;
};

export function AuthActions({ mode, nextPath, errorCode }: AuthActionsProps) {
  return (
    <AuthPage
      initialMode={mode === "login" ? "signin" : "signup"}
      nextPath={nextPath}
      errorCode={errorCode}
    />
  );
}
