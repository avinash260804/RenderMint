import { FileX2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
};

export function EmptyState({ title, description, actionLabel }: EmptyStateProps) {
  return (
    <div className="atelier-panel rounded-[1.25rem] border-dashed p-8 text-center">
      <div className="mx-auto mb-4 w-fit rounded-2xl border border-white/8 bg-white/[0.04] p-3">
        <FileX2 className="text-muted-foreground size-6" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mx-auto mt-2 max-w-md font-mono text-[0.74rem] leading-6 text-muted-foreground">
        {description}
      </p>
      {actionLabel ? (
        <Button
          className="mt-5 rounded-full border-white/10 bg-white/[0.03] font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
          size="sm"
          variant="outline"
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
