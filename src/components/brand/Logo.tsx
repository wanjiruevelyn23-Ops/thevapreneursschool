import { cn } from "@/lib/utils";

/**
 * Waypoint logo mark: navy node → emerald node, connected by an ascending line.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("h-8 w-8", className)}
    >
      <path
        d="M8.5 23.5 L23.5 8.5"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        opacity="0.45"
      />
      <circle cx="8.5" cy="23.5" r="4.25" fill="currentColor" />
      <circle cx="23.5" cy="8.5" r="4.25" className="fill-accent" />
    </svg>
  );
}

export function Logo({
  className,
  tone = "navy",
}: {
  className?: string;
  tone?: "navy" | "light";
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark
        className={cn("h-8 w-8 shrink-0", tone === "light" ? "text-primary-foreground" : "text-primary")}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.0625rem] font-semibold tracking-tight",
            tone === "light" ? "text-primary-foreground" : "text-primary",
          )}
        >
          VApreneurs School
        </span>
        <span
          className={cn(
            "eyebrow mt-1",
            tone === "light" ? "text-accent" : "text-accent-deep",
          )}
        >
          Map your skills
        </span>
      </span>
    </span>
  );
}
