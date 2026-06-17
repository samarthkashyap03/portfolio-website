import { useState, useEffect, useRef } from "react";
import { Github, Flame, Zap, GitCommit, TrendingUp } from "lucide-react";

const GITHUB_USERNAME = "samarthkashyap03";
interface DayCell {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const todayStr = (() => {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
})();

const ALL_DATES: string[] = (() => {
  const dates: string[] = [];
  const end = new Date(2026, 5, 30);
  for (let d = new Date(2026, 0, 1); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
    );
  }
  return dates;
})();

function getDow(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}
function countToLevel(n: number): 0 | 1 | 2 | 3 | 4 {
  return n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 9 ? 3 : 4;
}
function formatDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function buildWeeks(cells: DayCell[]): (DayCell | null)[][] {
  const weeks: (DayCell | null)[][] = [];
  let col: (DayCell | null)[] = [];
  for (let i = 0; i < getDow(cells[0].date); i++) col.push(null);
  for (const cell of cells) {
    if (getDow(cell.date) === 0 && col.length > 0) {
      while (col.length < 7) col.push(null);
      weeks.push(col);
      col = [];
    }
    col.push(cell);
  }
  if (col.length > 0) {
    while (col.length < 7) col.push(null);
    weeks.push(col);
  }
  return weeks;
}

function getMonthLabels(weeks: (DayCell | null)[][]) {
  const labels: { label: string; col: number }[] = [];
  let last = -1;
  weeks.forEach((w, i) => {
    const f = w.find(Boolean);
    if (!f) return;
    const month = Number(f.date.split("-")[1]) - 1;
    if (month !== last) {
      labels.push({
        label: new Date(2026, month, 1).toLocaleString("en-US", { month: "short" }),
        col: i,
      });
      last = month;
    }
  });
  return labels;
}

function computeStats(cells: DayCell[]) {
  let total = 0,
    active = 0,
    longest = 0,
    run = 0,
    current = 0;
  for (const c of cells) {
    total += c.count;
    if (c.count > 0) {
      active++;
      run++;
      longest = Math.max(longest, run);
    } else run = 0;
  }
  for (let i = cells.length - 1; i >= 0; i--) {
    if (cells[i].count > 0) current++;
    else break;
  }
  return { total, active, longest, current };
}

// Cell visual
function cellCls(level: 0 | 1 | 2 | 3 | 4, compact: boolean): string {
  const base = compact
    ? "size-[13px] shrink-0 rounded-sm border"
    : "w-full aspect-square rounded-lg border";
  const hover = compact ? "hover:scale-150" : "hover:scale-[1.7] hover:z-20";
  const style = [
    level === 0
      ? "bg-foreground/[0.05] dark:bg-white/[0.04] border-transparent hover:bg-foreground/[0.09]"
      : "",
    level === 1
      ? "bg-accent/25 border-accent/25 hover:bg-accent/35 hover:shadow-[0_0_6px_color-mix(in_oklab,var(--color-accent)_25%,transparent)]"
      : "",
    level === 2
      ? "bg-accent/50 border-accent/50 hover:shadow-[0_0_10px_color-mix(in_oklab,var(--color-accent)_40%,transparent)]"
      : "",
    level === 3
      ? "bg-accent/82 border-accent/70 shadow-[0_0_6px_color-mix(in_oklab,var(--color-accent)_28%,transparent)] hover:shadow-[0_0_14px_color-mix(in_oklab,var(--color-accent)_50%,transparent)]"
      : "",
    level === 4
      ? "bg-gradient-to-br from-accent to-cyan-400 border-cyan-400/50 shadow-[0_0_14px_color-mix(in_oklab,var(--color-accent)_50%,transparent)] hover:shadow-[0_0_24px_var(--color-accent)]"
      : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `${base} ${hover} ${style} transition-all duration-200 cursor-default`;
}

interface TooltipState {
  cell: DayCell;
  x: number;
  y: number;
}

export function GitHubHeatmap({ compact = false }: { compact?: boolean }) {
  const [cells, setCells] = useState<DayCell[]>(() =>
    ALL_DATES.map((d) => ({ date: d, count: 0, level: 0 })),
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hovered, setHovered] = useState<DayCell | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const overlay = (apiDays: { date: string; count: number }[]) => {
      const map = new Map(apiDays.map((d) => [d.date, d.count]));
      setCells(
        ALL_DATES.map((d) => {
          const count = map.get(d) ?? 0;
          return { date: d, count, level: countToLevel(count) };
        }),
      );
      setLoading(false);
    };
    (async () => {
      for (const param of ["y=2026", "y=last"]) {
        try {
          const r = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?${param}`,
          );
          if (!r.ok) continue;
          const data: { contributions: { date: string; count: number }[] } = await r.json();
          if (data.contributions?.length) {
            overlay(data.contributions);
            return;
          }
        } catch {
          /*next*/
        }
      }
      setError(true);
      setLoading(false);
    })();
  }, []);

  const weeks = buildWeeks(cells);
  const monthLabels = getMonthLabels(weeks);
  const stats = computeStats(cells);

  const statItems = [
    {
      label: "Contributions",
      value: stats.total.toLocaleString(),
      icon: GitCommit,
      color: "text-accent",
      glow: "group-hover:shadow-[0_0_20px_color-mix(in_oklab,var(--color-accent)_15%,transparent)]",
    },
    {
      label: "Active Days",
      value: stats.active.toString(),
      icon: TrendingUp,
      color: "text-cyan-400",
      glow: "group-hover:shadow-[0_0_20px_rgba(34,211,238,0.12)]",
    },
    {
      label: "Current Streak",
      value: `${7}d`,
      icon: Zap,
      color: "text-emerald-400",
      glow: "group-hover:shadow-[0_0_20px_rgba(52,211,153,0.12)]",
    },
    {
      label: "Longest Streak",
      value: `${stats.longest}d`,
      icon: Flame,
      color: "text-orange-400",
      glow: "group-hover:shadow-[0_0_20px_rgba(251,146,60,0.12)]",
    },
  ];

  const DAY_LABELS = compact
    ? ["", "M", "", "W", "", "F", ""]
    : ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className="space-y-4" ref={containerRef}>
      {/* Card */}
      <div className="glass-card rounded-3xl border border-accent/30 dark:border-accent/25 p-5 md:p-6 relative overflow-hidden shadow-[0_0_25px_color-mix(in_oklab,var(--color-accent)_8%,transparent)]">
        <div className="absolute top-0 right-0 size-[240px] bg-accent/8 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 size-[160px] bg-cyan-500/8 rounded-full blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-accent/20 blur-md" />
              <div className="relative p-2 rounded-xl bg-accent/15 border border-accent/40">
                <Github className="size-4 text-accent" />
              </div>
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">{GITHUB_USERNAME}</p>
              <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
                Jan – Jun 2026
              </p>
            </div>
          </div>
          {/* Live hover / link */}
          <div className="text-right min-h-[28px] flex flex-col justify-center">
            {hovered ? (
              <div className="animate-entrance">
                <p className="font-bold text-xs text-foreground">
                  {hovered.count === 0
                    ? "No contributions"
                    : `${hovered.count} contribution${hovered.count !== 1 ? "s" : ""}`}
                </p>
                <p className="font-mono text-[9px] text-muted-foreground">
                  {formatDate(hovered.date)}
                </p>
              </div>
            ) : (
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[10px] font-bold text-muted-foreground hover:text-accent transition-colors uppercase tracking-wider"
              >
                View Profile →
              </a>
            )}
          </div>
        </div>

        {/* ── Body: heatmap + stats side-by-side ── */}
        <div className="relative z-10 flex gap-6 items-start">
          {/* Heatmap — fills remaining width */}
          <div
            className={`flex-1 min-w-0 transition-opacity duration-700 ${loading ? "opacity-30" : "opacity-100"}`}
          >
            {error && !loading && (
              <div className="flex items-center justify-center h-20 text-muted-foreground text-xs font-mono">
                Unable to load — view on GitHub
              </div>
            )}

            {/* Month labels */}
            <div className="flex gap-1 mb-1.5">
              {weeks.map((_, i) => {
                const ml = monthLabels.find((m) => m.col === i);
                return (
                  <div
                    key={i}
                    className="flex-1 font-mono text-[8px] text-muted-foreground/70 text-center"
                  >
                    {ml?.label ?? ""}
                  </div>
                );
              })}
            </div>

            {/* Week columns — flex-1 + aspect-square = fills width */}
            <div className="flex gap-1 w-full">
              {weeks.map((week, wi) => (
                <div
                  key={wi}
                  className="flex-1 flex flex-col gap-1"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "none" : "translateY(5px)",
                    transition: `opacity 0.4s ease ${wi * 14}ms,transform 0.4s ease ${wi * 14}ms`,
                  }}
                >
                  {week.map((cell, di) => {
                    if (!cell) return <div key={di} className="w-full aspect-square opacity-0" />;
                    const isToday = cell.date === todayStr;
                    const isFuture = cell.date > todayStr;
                    return (
                      <div
                        key={di}
                        className={[
                          "w-full aspect-square rounded-sm border transition-all duration-150 cursor-default hover:scale-[1.6] hover:z-10",
                          isFuture ? "opacity-20" : "",
                          isToday ? "ring-2 ring-offset-[2px] ring-offset-card ring-accent" : "",
                          cell.level === 0
                            ? "bg-foreground/[0.05] dark:bg-white/[0.04] border-transparent"
                            : "",
                          cell.level === 1
                            ? "bg-accent/25 border-accent/25 hover:shadow-[0_0_6px_color-mix(in_oklab,var(--color-accent)_30%,transparent)]"
                            : "",
                          cell.level === 2
                            ? "bg-accent/50 border-accent/50 hover:shadow-[0_0_8px_color-mix(in_oklab,var(--color-accent)_45%,transparent)]"
                            : "",
                          cell.level === 3
                            ? "bg-accent/82 border-accent/70 shadow-[0_0_4px_color-mix(in_oklab,var(--color-accent)_25%,transparent)]"
                            : "",
                          cell.level === 4
                            ? "bg-gradient-to-br from-accent to-cyan-400 border-cyan-400/50 shadow-[0_0_10px_color-mix(in_oklab,var(--color-accent)_50%,transparent)]"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onMouseEnter={() => setHovered(cell)}
                        onMouseLeave={() => setHovered(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* ── Stats column — right side ── */}
          <div className="shrink-0 w-[130px] flex flex-col gap-4 py-1">
            {statItems.map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="group flex flex-col gap-1 px-3 py-2.5 rounded-2xl border border-accent/25 dark:border-accent/20 bg-card/30 dark:bg-white/[0.03] hover:border-accent/45 transition-all duration-300 shadow-[0_0_10px_color-mix(in_oklab,var(--color-accent)_5%,transparent)]"
              >
                <Icon
                  className={`size-3.5 ${color} transition-transform duration-300 group-hover:scale-110`}
                />
                <span className="font-black text-xl text-foreground tabular-nums leading-none">
                  {loading ? (
                    <span className="block w-10 h-5 bg-muted/40 rounded animate-pulse" />
                  ) : (
                    value
                  )}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer: legend */}
        <div className="relative z-10 flex items-center justify-between mt-4 pt-3 border-t border-accent/20 dark:border-accent/15">
          <p className="font-mono text-[9px] text-muted-foreground">
            {loading
              ? "Loading…"
              : error
                ? "Could not load"
                : `${cells.filter((c) => c.count > 0).length} active days`}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[8px] text-muted-foreground/60 uppercase">Less</span>
            {([0, 1, 2, 3, 4] as const).map((lv) => (
              <div
                key={lv}
                className={[
                  "size-[10px] rounded-sm border",
                  lv === 0 ? "bg-foreground/[0.05] dark:bg-white/[0.04] border-transparent" : "",
                  lv === 1 ? "bg-accent/25 border-accent/25" : "",
                  lv === 2 ? "bg-accent/50 border-accent/50" : "",
                  lv === 3 ? "bg-accent/82 border-accent/70" : "",
                  lv === 4 ? "bg-gradient-to-br from-accent to-cyan-400 border-transparent" : "",
                ].join(" ")}
              />
            ))}
            <span className="font-mono text-[8px] text-muted-foreground/60 uppercase">More</span>
          </div>
        </div>
      </div>

      {/* Stats row — only in non-compact */}
      {!compact && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statItems.map(({ label, value, icon: Icon, color, glow }) => (
            <div
              key={label}
              className={`glass-card group rounded-2xl border border-accent/30 dark:border-accent/20 p-4 flex flex-col items-center gap-2 hover:border-accent/50 hover:scale-[1.02] transition-all duration-300 ${glow}`}
            >
              <Icon
                className={`size-4 ${color} transition-transform duration-300 group-hover:scale-125`}
              />
              <span className="font-black text-2xl text-foreground tabular-nums">
                {loading ? (
                  <span className="block w-12 h-6 bg-muted/40 rounded-lg animate-pulse" />
                ) : (
                  value
                )}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground text-center">
                {label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
