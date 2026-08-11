import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const WAYPOINTS = [
  {
    number: 1,
    label: "Learn the skill",
    text: "4 self-taught skill tracks, coaching optional.",
    to: "/courses" as const,
  },
  {
    number: 2,
    label: "Position yourself",
    text: "10-day live Accelerator, Cohort 1.",
    to: "/accelerator" as const,
  },
  {
    number: 3,
    label: "Sustain the business",
    text: "3 toolkit courses for the long haul.",
    to: "/courses" as const,
  },
];

/** The route-map visual: three waypoints on an ascending dashed line. */
export function RouteMap({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox="0 0 600 220"
        className="w-full"
        role="img"
        aria-label="Route map with three waypoints: learn the skill, position yourself, sustain the business"
      >
        <path
          d="M40 180 C 150 175, 165 115, 300 110 S 455 100, 560 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="7 9"
          strokeLinecap="round"
          className="text-accent/60"
        />
        {[
          { cx: 40, cy: 180 },
          { cx: 300, cy: 110 },
          { cx: 560, cy: 40 },
        ].map((point, index) => (
          <g key={point.cx}>
            <circle
              cx={point.cx}
              cy={point.cy}
              r="17"
              className="fill-accent/15"
            />
            <circle cx={point.cx} cy={point.cy} r="10" className="fill-accent" />
            <text
              x={point.cx}
              y={point.cy + 3.5}
              textAnchor="middle"
              className="fill-primary-foreground font-mono text-[10px]"
            >
              {index + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function WaypointStrip({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {WAYPOINTS.map((waypoint) => (
        <Link
          key={waypoint.number}
          to={waypoint.to}
          className={cn(
            "group rounded-xl border p-4 transition-colors",
            tone === "dark"
              ? "border-primary-foreground/15 bg-primary-foreground/5 hover:border-accent/60"
              : "border-border bg-card hover:border-accent/60",
          )}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent font-mono text-[10px] text-accent-foreground">
              {waypoint.number}
            </span>
            <span
              className={cn(
                "eyebrow",
                tone === "dark" ? "text-accent" : "text-accent-deep",
              )}
            >
              Waypoint {waypoint.number}
            </span>
          </div>
          <p
            className={cn(
              "mt-2.5 font-display text-base font-semibold",
              tone === "dark" ? "text-primary-foreground" : "text-primary",
            )}
          >
            {waypoint.label}
          </p>
          <p
            className={cn(
              "mt-1 text-sm",
              tone === "dark"
                ? "text-primary-foreground/65"
                : "text-muted-foreground",
            )}
          >
            {waypoint.text}
          </p>
        </Link>
      ))}
    </div>
  );
}
