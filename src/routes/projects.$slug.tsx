import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Github, PlayCircle, Workflow, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { BentoCard, MicroLabel, SiteShell } from "@/components/site/SiteShell";
import { projects } from "@/lib/site-data";
import { ProjectStackHighlights } from "@/components/site/InteractiveComponents";

const PROJECT_THEMES: Record<
  string,
  {
    colorValue: string;
    glow: string;
    accentText: string;
    accentBorder: string;
    accentBorderHover: string;
    textGradient: string;
    problemBorder: string;
    problemBg: string;
    badgeBorder: string;
    badgeText: string;
    badgeBg: string;
    metricAccent: string;
  }
> = {
  lumen: {
    colorValue: "#6366f1", // Indigo
    glow: "rgba(99,102,241,0.18)",
    accentText: "text-indigo-600 dark:text-indigo-400",
    accentBorder: "border-indigo-500/40 dark:border-indigo-400/40",
    accentBorderHover: "hover:border-indigo-500/60 dark:hover:border-indigo-400/50",
    textGradient:
      "from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400",
    problemBorder: "border-indigo-500/40",
    problemBg: "bg-indigo-500/[0.04] dark:bg-indigo-500/[0.02]",
    badgeBorder: "border-indigo-500/30",
    badgeText: "text-indigo-600 dark:text-indigo-400",
    badgeBg: "bg-indigo-500/5 dark:bg-indigo-500/10",
    metricAccent: "from-indigo-500 to-purple-500",
  },
  effortless: {
    colorValue: "#10b981", // Emerald
    glow: "rgba(16,185,129,0.18)",
    accentText: "text-emerald-600 dark:text-emerald-400",
    accentBorder: "border-emerald-500/40 dark:border-emerald-400/40",
    accentBorderHover: "hover:border-emerald-500/60 dark:hover:border-emerald-400/50",
    textGradient:
      "from-emerald-500 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400",
    problemBorder: "border-emerald-500/40",
    problemBg: "bg-emerald-500/[0.04] dark:bg-emerald-500/[0.02]",
    badgeBorder: "border-emerald-500/30",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-500/5 dark:bg-emerald-500/10",
    metricAccent: "from-emerald-500 to-teal-500",
  },
  medconnect: {
    colorValue: "#ec4899", // Pink / Rose
    glow: "rgba(236,72,153,0.18)",
    accentText: "text-pink-600 dark:text-pink-400",
    accentBorder: "border-pink-500/40 dark:border-pink-400/40",
    accentBorderHover: "hover:border-pink-500/60 dark:hover:border-pink-400/50",
    textGradient:
      "from-pink-500 via-purple-500 to-indigo-500 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400",
    problemBorder: "border-pink-500/40",
    problemBg: "bg-pink-500/[0.04] dark:bg-pink-500/[0.02]",
    badgeBorder: "border-pink-500/30",
    badgeText: "text-pink-600 dark:text-pink-400",
    badgeBg: "bg-pink-500/5 dark:bg-pink-500/10",
    metricAccent: "from-pink-500 to-purple-500",
  },
  "vtu-automation": {
    colorValue: "#06b6d4", // Cyan
    glow: "rgba(6,182,212,0.18)",
    accentText: "text-cyan-600 dark:text-cyan-400",
    accentBorder: "border-cyan-500/40 dark:border-cyan-400/40",
    accentBorderHover: "hover:border-cyan-500/60 dark:hover:border-cyan-400/50",
    textGradient:
      "from-cyan-500 via-blue-500 to-indigo-500 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400",
    problemBorder: "border-cyan-500/40",
    problemBg: "bg-cyan-500/[0.04] dark:bg-cyan-500/[0.02]",
    badgeBorder: "border-cyan-500/30",
    badgeText: "text-cyan-600 dark:text-cyan-400",
    badgeBg: "bg-cyan-500/5 dark:bg-cyan-500/10",
    metricAccent: "from-cyan-500 to-blue-500",
  },
  tracely: {
    colorValue: "#3b82f6", // Blue
    glow: "rgba(59,130,246,0.18)",
    accentText: "text-blue-600 dark:text-blue-400",
    accentBorder: "border-blue-500/40 dark:border-blue-400/40",
    accentBorderHover: "hover:border-blue-500/60 dark:hover:border-blue-400/50",
    textGradient:
      "from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400",
    problemBorder: "border-blue-500/40",
    problemBg: "bg-blue-500/[0.04] dark:bg-blue-500/[0.02]",
    badgeBorder: "border-blue-500/30",
    badgeText: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-500/5 dark:bg-blue-500/10",
    metricAccent: "from-blue-500 to-indigo-500",
  },
};

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    if (!p) return { meta: [{ title: "Project · Samarth Kashyap" }] };
    return {
      meta: [
        { title: `${p.name} · Samarth Kashyap` },
        { name: "description", content: p.description },
        { property: "og:title", content: `${p.name} · Samarth Kashyap` },
        { property: "og:description", content: p.description },
        { property: "og:image", content: p.image },
        { name: "twitter:image", content: p.image },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center md:px-8">
        <h1 className="text-3xl font-bold">Project not found</h1>
        <Link to="/projects" className="mt-6 inline-block text-sm underline">
          ← All projects
        </Link>
      </div>
    </SiteShell>
  ),
  component: ProjectDetail,
});

function Section({
  title,
  themeBorder,
  themeBg,
  children,
}: {
  title: string;
  themeBorder?: string;
  themeBg?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border ${themeBorder || "border-border/80"} ${themeBg || "bg-card/45 dark:bg-white/[0.01]"} p-6 md:p-8 transition-all duration-500 shadow-sm hover:shadow-[0_0_20px_rgba(0,0,0,0.015)]`}
    >
      <h2 className="mb-4 font-mono text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground font-extrabold flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-accent animate-pulse" />
        {title}
      </h2>
      <div className="text-sm md:text-base leading-relaxed text-foreground/90 font-medium font-sans">
        {children}
      </div>
    </section>
  );
}

function ProjectDetail() {
  const { project: p } = Route.useLoaderData();
  const [mode, setMode] = useState<"technical" | "easy">("technical");

  const theme = PROJECT_THEMES[p.slug] || {
    colorValue: "#8b5cf6",
    glow: "rgba(139,92,246,0.15)",
    accentText: "text-accent",
    accentBorder: "border-accent/40",
    accentBorderHover: "hover:border-accent/50",
    textGradient: "from-accent to-cyan-400",
    problemBorder: "border-border/40",
    problemBg: "bg-secondary/40",
    badgeBorder: "border-border/80",
    badgeText: "text-foreground",
    badgeBg: "bg-card/90",
    metricAccent: "from-accent to-cyan-400",
  };

  const currentProblem = mode === "easy" && p.easyMode ? p.easyMode.problem : p.problem;
  const currentApproach = mode === "easy" && p.easyMode ? p.easyMode.approach : p.approach;
  const currentOutcome = mode === "easy" && p.easyMode ? p.easyMode.outcome : p.outcome;

  return (
    <SiteShell>
      <article
        className="mx-auto max-w-5xl px-4 py-16 md:px-8 md:py-24"
        style={
          {
            "--color-accent": theme.colorValue,
          } as React.CSSProperties
        }
      >
        <Link
          to="/projects"
          className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" /> All projects
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <MicroLabel>{p.year}</MicroLabel>
        </div>

        <h1 className="mt-4 text-balance text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
          <span className={`bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
            {p.name}
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-xl font-bold text-foreground leading-snug tracking-tight">
          {p.tagline}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {p.liveUrl ? (
            <a
              href={p.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background hover:bg-accent hover:text-accent-foreground shadow-md transition-all cursor-pointer"
            >
              <ExternalLink className="size-4" /> Live demo
            </a>
          ) : null}
          {p.repoUrl ? (
            <a
              href={p.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold hover:border-accent hover:text-accent hover:bg-accent/5 transition-all cursor-pointer"
            >
              <Github className="size-4" /> Repository
            </a>
          ) : null}
        </div>

        <BentoCard
          className={`mt-12 overflow-hidden p-0 border transition-colors duration-500 ${theme.accentBorder}`}
        >
          <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
            <img
              src={p.image}
              alt={p.name}
              width={1024}
              height={576}
              className={`size-full ${
                p.slug === "medconnect"
                  ? "object-cover scale-[1.05]"
                  : "object-contain bg-secondary/20 dark:bg-black/40"
              }`}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
            {p.demo ? (
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-3.5 py-2 text-xs font-semibold shadow backdrop-blur">
                <PlayCircle className="size-4 text-accent" />
                {p.demo.note}
              </div>
            ) : null}
          </div>
        </BentoCard>

        {p.metrics && p.metrics.length ? (
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
            {p.metrics.map((m: { label: string; value: string }) => (
              <div
                key={m.label}
                className="relative overflow-hidden spotlight rounded-2xl border border-border bg-card p-5 shadow-sm hover:scale-[1.02] transition-transform duration-300"
              >
                <div
                  className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${theme.textGradient}`}
                />
                <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                  {m.label}
                </div>
                <div className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 items-start">
          <div className="space-y-8 md:col-span-2">
            {/* EASY / TECHNICAL SELECTOR CONTROL */}
            {p.easyMode && (
              <div className="flex items-center gap-1.5 bg-secondary/50 dark:bg-white/[0.03] border border-border/80 p-1 rounded-full w-fit shadow-sm">
                <button
                  onClick={() => setMode("technical")}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer select-none ${
                    mode === "technical"
                      ? "bg-foreground text-background shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Technical Explanation
                </button>
                <button
                  onClick={() => setMode("easy")}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer select-none ${
                    mode === "easy"
                      ? "bg-foreground text-background shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Simple Explanation
                </button>
              </div>
            )}

            <Section title="Problem" themeBorder={theme.accentBorder} themeBg={theme.problemBg}>
              <p className="leading-relaxed text-foreground/90 font-medium text-pretty">
                {currentProblem}
              </p>
            </Section>

            <Section title="Approach" themeBorder={theme.accentBorder} themeBg={theme.problemBg}>
              <ul className="space-y-4">
                {currentApproach.map((a: string) => (
                  <li key={a} className="flex gap-3 items-start leading-relaxed">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="text-foreground/95 font-semibold text-pretty">{a}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {mode === "technical" && p.architecture && p.architecture.length ? (
              <Section
                title="Architecture"
                themeBorder={theme.accentBorder}
                themeBg={theme.problemBg}
              >
                <div className="rounded-xl border border-border/60 bg-secondary/30 dark:bg-black/10 p-5">
                  <div className="mb-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                    <Workflow className="size-4 text-accent" />
                    Data + control flow
                  </div>
                  <ol className="space-y-3.5">
                    {p.architecture.map((step: string, idx: number) => (
                      <li
                        key={step}
                        className="flex gap-3.5 font-mono text-xs leading-relaxed text-foreground/90 font-medium"
                      >
                        <span className="text-accent font-extrabold">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </Section>
            ) : null}

            <Section title="Outcome" themeBorder={theme.accentBorder} themeBg={theme.problemBg}>
              <p className="leading-relaxed text-foreground/90 font-medium text-pretty">
                {currentOutcome}
              </p>
            </Section>
          </div>

          <aside className="space-y-8 md:sticky md:top-24">
            {p.badge && (
              <div
                className={`rounded-2xl border ${theme.accentBorder} ${theme.problemBg} p-5 shadow-sm`}
              >
                <MicroLabel>Validation & Recognition</MicroLabel>
                <div className="mt-3 flex">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-sm">
                    <Sparkles className="size-3.5 animate-pulse text-emerald-500" />
                    {p.badge}
                  </div>
                </div>
              </div>
            )}

            <div
              className={`rounded-2xl border ${theme.accentBorder} ${theme.problemBg} p-5 shadow-sm`}
            >
              <ProjectStackHighlights highlights={p.highlights} stack={p.stack} />
            </div>
          </aside>
        </div>
      </article>
    </SiteShell>
  );
}
