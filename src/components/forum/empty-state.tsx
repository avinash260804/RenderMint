import { FileX2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
};

export function EmptyState({ title, description, actionLabel }: EmptyStateProps) {
  return (
    <div className="border-border/80 bg-card/60 rounded-2xl border border-dashed p-8 text-center">
      <div className="bg-muted mx-auto mb-4 w-fit rounded-xl p-3">
        <FileX2 className="text-muted-foreground size-6" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">{description}</p>
      {actionLabel ? (
        <Button className="mt-5" size="sm" variant="outline">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
