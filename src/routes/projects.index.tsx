import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Github, Layers, Code, ExternalLink } from "lucide-react";
import { MicroLabel, SiteShell } from "@/components/site/SiteShell";
import { projects } from "@/lib/site-data";
import { Magnetic } from "@/components/site/interactive";
import { useMemo } from "react";
import {
  ProjectStackHighlights,
  ThreeDProductViewer,
} from "@/components/site/InteractiveComponents";

export const Route = createFileRoute("/projects/")({
  component: ProjectsPage,
  head: () => ({
    meta: [
      { title: "Projects Archive & Labs — Samarth Kashyap" },
      {
        name: "description",
        content:
          "An archive of engineering projects, tools, and automation systems built by Samarth Kashyap.",
      },
      {
        name: "keywords",
        content:
          "Samarth Kashyap projects, engineering portfolio, RPTU Kaiserslautern, VTU result automation, Tracely, Lumen, MedConnect, open source",
      },
    ],
  }),
});

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

function ProjectsPage() {
  // Show only non-featured projects
  const otherProjects = useMemo(() => projects.filter((p) => p.featured === false), []);

  const iconFor = (slug: string) => {
    if (slug === "vtu-automation") return Layers;
    return Code;
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <Link
          to="/"
          hash="projects"
          className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" /> Back to Featured Work
        </Link>

        <header className="mb-16">
          <MicroLabel>Archive & Labs</MicroLabel>
          <h1 className="mt-4 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl text-gradient">
            More Systems & Builds
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-snug text-muted-foreground">
            A listing of additional applications, automation scripts, and workflow tools constructed
            over the years.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12">
          {otherProjects.map((p, idx) => {
            const Icon = iconFor(p.slug);
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

            return (
              <div
                key={p.slug}
                className={`group relative rounded-3xl border p-6 md:p-10 transition-all duration-500 bg-card/45 dark:bg-white/[0.01] shadow-sm ${theme.accentBorderHover} hover:shadow-[0_0_35px_${theme.glow}]`}
                style={
                  {
                    "--color-accent": theme.colorValue,
                  } as React.CSSProperties
                }
              >
                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Left Column: Image preview */}
                  <div className="lg:col-span-6">
                    <ThreeDProductViewer>
                      {p.liveUrl ? (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative block aspect-[16/10] overflow-hidden rounded-2xl border bg-secondary/30 dark:bg-white/[0.02] shadow-md border-border/80 group-hover:border-accent/40 cursor-pointer"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className={`absolute inset-0 size-full transition-transform duration-[1200ms] ease-out ${
                              p.slug === "medconnect"
                                ? "object-cover scale-[1.02] group-hover:scale-[1.10]"
                                : "object-contain bg-secondary/20 dark:bg-black/40 group-hover:scale-105"
                            }`}
                          />
                          <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
                          <div
                            className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border ${theme.badgeBorder} ${theme.badgeBg} px-3.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest ${theme.badgeText} shadow-sm`}
                          >
                            <Icon className="size-3" />
                            {p.year}
                          </div>
                        </a>
                      ) : (
                        <Link
                          to="/projects/$slug"
                          params={{ slug: p.slug }}
                          className="relative block aspect-[16/10] overflow-hidden rounded-2xl border bg-secondary/30 dark:bg-white/[0.02] shadow-md border-border/80 group-hover:border-accent/40 cursor-pointer"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className={`absolute inset-0 size-full transition-transform duration-[1200ms] ease-out ${
                              p.slug === "medconnect"
                                ? "object-cover scale-[1.02] group-hover:scale-[1.10]"
                                : "object-contain bg-secondary/20 dark:bg-black/40 group-hover:scale-105"
                            }`}
                          />
                          <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
                          <div
                            className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border ${theme.badgeBorder} ${theme.badgeBg} px-3.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest ${theme.badgeText} shadow-sm`}
                          >
                            <Icon className="size-3" />
                            {p.year}
                          </div>
                        </Link>
                      )}
                    </ThreeDProductViewer>
                  </div>

                  {/* Right Column: Content */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="space-y-3.5">
                      <h3 className="text-3xl font-extrabold tracking-tight">
                        <span
                          className={`bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}
                        >
                          {p.name}
                        </span>
                      </h3>
                      <p className="text-base leading-relaxed text-muted-foreground font-semibold text-pretty">
                        {p.tagline}
                      </p>
                    </div>

                    {/* Problem */}
                    <div
                      className={`space-y-1.5 text-sm border-l-2 pl-4 py-1.5 ${theme.problemBorder} ${theme.problemBg}`}
                    >
                      <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground font-extrabold block">
                        Problem Statement
                      </span>
                      <p className="text-foreground/90 leading-relaxed font-semibold text-pretty">
                        {p.problem}
                      </p>
                    </div>

                    {/* Metrics */}
                    {p.metrics && p.metrics.length > 0 && (
                      <div className="grid grid-cols-3 gap-2.5 pt-2">
                        {p.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="relative overflow-hidden bg-secondary/40 dark:bg-white/[0.02] border border-border/60 p-3 rounded-2xl text-center shadow-sm hover:scale-[1.02] transition-all duration-300"
                          >
                            <div
                              className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${theme.textGradient}`}
                            />
                            <span className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground font-bold truncate">
                              {m.label}
                            </span>
                            <span className="block font-extrabold text-sm md:text-base text-foreground mt-1 tracking-tight">
                              {m.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Stack / Engineering Highlights */}
                    <ProjectStackHighlights highlights={p.highlights} stack={p.stack} />

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3 border-t border-border/40 pt-5">
                      <Magnetic>
                        <Link
                          to="/projects/$slug"
                          params={{ slug: p.slug }}
                          className="group/btn inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-bold text-background hover:bg-accent hover:text-accent-foreground shadow-md transition-all hover:shadow-[0_0_15px_color-mix(in_oklab,var(--color-accent)_40%,transparent)] cursor-pointer"
                        >
                          View Case Study
                          <ArrowUpRight className="size-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </Link>
                      </Magnetic>
                      {p.liveUrl && (
                        <Magnetic>
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/btn inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-bold text-foreground/90 hover:border-accent hover:text-accent hover:bg-accent/5 shadow-sm transition-all cursor-pointer"
                          >
                            <ExternalLink className="size-4 text-muted-foreground group-hover/btn:text-accent" />{" "}
                            Live
                          </a>
                        </Magnetic>
                      )}
                      {p.repoUrl && (
                        <Magnetic>
                          <a
                            href={p.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="group/btn inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-bold text-foreground/90 hover:border-accent hover:text-accent hover:bg-accent/5 shadow-sm transition-all cursor-pointer"
                          >
                            <Github className="size-4 text-muted-foreground group-hover/btn:text-accent" />{" "}
                            Source
                          </a>
                        </Magnetic>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SiteShell>
  );
}
