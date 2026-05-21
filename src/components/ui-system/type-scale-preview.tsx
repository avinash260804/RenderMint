import { typographyTokens } from "@/components/ui-system/tokens";
import { cn } from "@/lib/utils";

export function TypeScalePreview() {
  return (
    <section className="border-border/70 bg-card/70 space-y-3 rounded-2xl border p-5">
      <p className={typographyTokens.label}>Typography system</p>
      <h1 className={cn(typographyTokens.h1, "font-serif")}>
        Premium, modern, structured creative community.
      </h1>
      <h2 className={typographyTokens.h3}>Readable hierarchy for high scanability</h2>
      <p className={typographyTokens.body}>
        Discussion is text-first. Critique is image-first. Showcase is gallery-first. Help is
        solution-first.
      </p>
    </section>
  );
}
