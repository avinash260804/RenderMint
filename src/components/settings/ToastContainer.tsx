"use client";

import { AlertCircle, CheckCircle, X } from "lucide-react";

import { useToast } from "@/lib/toast";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div aria-live="polite" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm animate-in fade-in slide-in-from-bottom-3 duration-150 motion-reduce:animate-none ${
            toast.type === "success" ? "bg-emerald-950/90 text-emerald-100" : "bg-red-950/90 text-red-100"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0 animate-in zoom-in duration-200 motion-reduce:animate-none" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 animate-in zoom-in duration-200 motion-reduce:animate-none" />
          )}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 transition-opacity duration-150 hover:opacity-70 motion-reduce:transition-none"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
