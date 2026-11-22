import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  id?: string;
}

export function SectionHeading({ eyebrow, title, description, align = "center", className, id }: Props) {
  return (
    <div className={cn("mx-auto max-w-2xl", align === "center" ? "text-center" : "mx-0 text-left", className)}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      )}
      <h2 id={id} className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>}
    </div>
  );
}
