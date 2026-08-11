import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("eyebrow text-accent-deep", className)}>{children}</p>
  );
}

export function WaypointLabel({
  number,
  label,
  className,
}: {
  number: number;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent font-mono text-[0.6875rem] font-medium text-accent-foreground">
        {number}
      </span>
      <span className="eyebrow text-accent-deep">Waypoint {number} · {label}</span>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
      <h2 className="text-3xl leading-tight text-primary sm:text-4xl">{title}</h2>
      {intro ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p>
      ) : null}
    </div>
  );
}
