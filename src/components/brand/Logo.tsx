export function Logo({
  className,
  tone = "navy",
}: {
  className?: string;
  tone?: "navy" | "light";
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <LogoMark
        className={cn(
          "h-9 w-9 shrink-0",
          tone === "light" ? "text-primary-foreground" : "text-primary",
        )}
      />

      <span
        className={cn(
          "font-display text-[1.25rem] font-semibold tracking-tight",
          tone === "light" ? "text-primary-foreground" : "text-primary",
        )}
      >
        The VApreneurs School
      </span>
    </span>
  );
}
