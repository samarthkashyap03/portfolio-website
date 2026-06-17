import React, { useState } from "react";
import {
  Code2,
  Database,
  Boxes,
  Cpu,
  GitBranch,
  Rocket,
  Sparkles,
  Terminal,
  Layers,
  Brain,
  Zap,
  Globe,
  Settings,
  Workflow,
} from "lucide-react";

const CATEGORIES = ["All", "Languages", "AI & LLM", "Backend", "Frontend", "Tools"] as const;
type SkillCategory = (typeof CATEGORIES)[number];

interface SkillItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  categories: SkillCategory[];
}

const ROW_A: SkillItem[] = [
  { label: "Python", icon: Terminal, categories: ["Languages"] },
  { label: "TypeScript", icon: Code2, categories: ["Languages", "Frontend"] },
  { label: "JavaScript", icon: Code2, categories: ["Languages"] },
  { label: "SQL", icon: Database, categories: ["Languages"] },
  { label: "C++", icon: Cpu, categories: ["Languages"] },
  { label: "RAG Systems", icon: Brain, categories: ["AI & LLM"] },
  { label: "LLM Integration", icon: Sparkles, categories: ["AI & LLM"] },
  { label: "Vector Search", icon: Database, categories: ["AI & LLM", "Backend"] },
  { label: "LangChain", icon: Workflow, categories: ["AI & LLM"] },
  { label: "AI Workflows", icon: Brain, categories: ["AI & LLM"] },
];

const ROW_B: SkillItem[] = [
  { label: "FastAPI", icon: Zap, categories: ["Backend"] },
  { label: "PostgreSQL", icon: Database, categories: ["Backend"] },
  { label: "Redis", icon: Boxes, categories: ["Backend"] },
  { label: "Celery", icon: Settings, categories: ["Backend"] },
  { label: "REST APIs", icon: Globe, categories: ["Backend"] },
  { label: "pgvector", icon: Database, categories: ["Backend", "AI & LLM"] },
  { label: "React", icon: Layers, categories: ["Frontend"] },
  { label: "Tailwind CSS", icon: Layers, categories: ["Frontend"] },
];

const ROW_C: SkillItem[] = [
  { label: "Docker", icon: Globe, categories: ["Tools"] },
  { label: "Git", icon: GitBranch, categories: ["Tools"] },
  { label: "GitHub", icon: GitBranch, categories: ["Tools"] },
  { label: "Linux", icon: Terminal, categories: ["Tools"] },
  { label: "n8n", icon: Workflow, categories: ["Tools", "AI & LLM"] },
];

interface MarqueeRowProps {
  items: SkillItem[];
  reverse?: boolean;
  speed?: string;
  activeCategory: SkillCategory;
}

function MarqueeRow({ items, reverse = false, speed = "35s", activeCategory }: MarqueeRowProps) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-mask overflow-hidden py-1.5 select-none relative group/row">
      <div
        className="flex w-max gap-4 hover:[animation-play-state:paused]"
        style={{
          animation: `${reverse ? "marquee-reverse" : "marquee"} ${speed} linear infinite`,
        }}
      >
        {doubled.map(({ label, icon: Icon, categories }, i) => {
          const isHighlighted = activeCategory === "All" || categories.includes(activeCategory);
          return (
            <span
              key={`${label}-${i}`}
              className={`group/item inline-flex shrink-0 items-center gap-2.5 rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-500 cursor-default ${
                isHighlighted
                  ? "border-accent/40 text-foreground bg-card/90 dark:bg-white/[0.04] shadow-[0_0_20px_color-mix(in_oklab,var(--color-accent)_20%,transparent)] scale-[1.02]"
                  : "border-border/60 dark:border-white/5 text-foreground/40 bg-card/20 dark:bg-white/[0.005] opacity-30"
              } hover:scale-[1.05] hover:!opacity-100 hover:border-accent/60 hover:!text-foreground hover:shadow-[0_0_25px_color-mix(in_oklab,var(--color-accent)_30%,transparent)]`}
            >
              <Icon
                className={`size-4 transition-all duration-300 group-hover/item:rotate-12 ${
                  isHighlighted ? "text-accent" : "text-muted-foreground/30"
                }`}
              />
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function SkillsMarquee() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("All");
  const allSkills = [...ROW_A, ...ROW_B, ...ROW_C];

  return (
    <div className="space-y-6 py-2 relative z-10">
      {/* Interactive Category Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-2">
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-300 cursor-pointer border ${
                active
                  ? "bg-foreground text-background border-foreground shadow-[0_0_15px_color-mix(in_oklab,var(--color-primary)_20%,transparent)] scale-[1.02]"
                  : "text-muted-foreground border-border/80 hover:text-foreground hover:border-foreground/40 bg-card/45 dark:bg-white/[0.01]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Scrolling Tech Ribbon */}
      <div className="w-full overflow-hidden border-t border-b border-border/40 py-4 relative bg-card/25 dark:bg-white/[0.002] backdrop-blur-sm">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />
        <MarqueeRow items={allSkills} speed="55s" activeCategory={activeCategory} />
      </div>
    </div>
  );
}
