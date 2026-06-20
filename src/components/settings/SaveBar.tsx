"use client";

import { PillButton } from "./PillButton";

interface SaveBarProps {
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void | Promise<void>;
  onDiscard: () => void;
}

export function SaveBar({ isDirty, isSaving, onSave, onDiscard }: SaveBarProps) {
  if (!isDirty) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-white/10 bg-[oklch(0.09_0.004_45_/_0.95)] p-4 backdrop-blur-md animate-in slide-in-from-bottom-3 duration-300 motion-reduce:animate-none md:p-6"
    >
      <p className="font-mono text-sm uppercase tracking-[0.16em] text-muted-foreground">Unsaved changes</p>
      <div className="flex gap-3">
        <PillButton variant="secondary" size="sm" onClick={onDiscard} disabled={isSaving}>
          Discard
        </PillButton>
        <PillButton variant="primary" size="sm" onClick={onSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </PillButton>
      </div>
    </div>
  );
}
