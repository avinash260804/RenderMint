"use client";

import { AuthPage } from "@/components/v0/login/auth-page";

export function LoginPreviewPage() {
  return (
    <div className="v0-preview-theme min-h-screen bg-background text-foreground">
      <AuthPage initialMode="signup" />
    </div>
  );
}
