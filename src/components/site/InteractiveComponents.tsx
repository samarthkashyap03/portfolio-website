import React, { useEffect, useRef, useState, type MouseEvent, type FormEvent } from "react";
import {
  Terminal as TerminalIcon,
  Search,
  Compass,
  ArrowRight,
  Sparkles,
  Award,
  Globe,
  Cpu,
  Monitor,
  Database,
  Brain,
  User,
  Activity,
  Layers,
  MapPin,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  Wrench,
  Code,
  Cloud,
  Users,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { MicroLabel } from "./SiteShell";

// ───────── 1. BUILDER LIFECYCLE INTERACTIVE GRAPH (Hero Right) ─────────
export function InteractiveHeroGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes = [
    {
      id: "problem",
      label: "Problem",
      icon: HelpCircle,
      x: 50,
      y: 175,
      color: "oklch(0.60 0.15 20)",
      details:
        "Identifying bottlenecks, friction points, and user frustration in existing workflows.",
    },
    {
      id: "research",
      label: "Research",
      icon: Search,
      x: 190,
      y: 110,
      color: "oklch(0.75 0.16 85)",
      details: "Analyzing user behavior, gathering requirements, and studying system limits.",
    },
    {
      id: "design",
      label: "Design",
      icon: Compass,
      x: 330,
      y: 175,
      color: "oklch(0.70 0.15 140)",
      details: "Sketching architecture, data flows, UI components, and state boundaries.",
    },
    {
      id: "build",
      label: "Build",
      icon: Code,
      x: 470,
      y: 240,
      color: "oklch(0.55 0.18 265)",
      details: "Writing modular software, writing testable components, and refining code quality.",
    },
    {
      id: "test",
      label: "Test",
      icon: Activity,
      x: 610,
      y: 175,
      color: "oklch(0.65 0.20 300)",
      details: "Validating edge cases, unit tests, integration paths, and performance boundaries.",
    },
    {
      id: "deploy",
      label: "Deploy",
      icon: Globe,
      x: 750,
      y: 110,
      color: "oklch(0.75 0.15 190)",
      details: "Shipping code to serverless edges, setting up CI/CD, and scaling traffic paths.",
    },
    {
      id: "learn",
      label: "Learn",
      icon: Brain,
      x: 890,
      y: 175,
      color: "oklch(0.72 0.16 195)",
      details:
        "Monitoring session telemetry, analyzing user feedback, and planning next iterations.",
    },
  ];

  const connections = [
    { from: "problem", to: "research" },
    { from: "research", to: "design" },
    { from: "design", to: "build" },
    { from: "build", to: "test" },
    { from: "test", to: "deploy" },
    { from: "deploy", to: "learn" },
  ];

  // Continuous S-Curve path connecting all nodes from start to finish
  const fullPath =
    "M 50 175 " +
    "C 120 175, 120 110, 190 110 " +
    "C 260 110, 260 175, 330 175 " +
    "C 400 175, 400 240, 470 240 " +
    "C 540 240, 540 175, 610 175 " +
    "C 680 175, 680 110, 750 110 " +
    "C 820 110, 820 175, 890 175";

  const activeNodeData = nodes.find((n) => n.id === hoveredNode);

  // Helper for generating smooth horizontal S-curves
  const getCurvePath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = to.x - from.x;
    return `M ${from.x} ${from.y} C ${from.x + dx / 2} ${from.y}, ${from.x + dx / 2} ${to.y}, ${to.x} ${to.y}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative flex h-[410px] w-full flex-col items-center justify-between rounded-3xl border border-violet-500/35 dark:border-violet-400/30 bg-card/65 dark:bg-white/[0.02] backdrop-blur-lg overflow-hidden ring-glow select-none"
      style={{ boxShadow: "0 0 25px rgba(139,92,246,0.1), inset 0 1px 0 rgba(139,92,246,0.08)" }}
    >
      {/* Visual Instruction Badge */}
      <div className="absolute top-4 left-4 font-mono text-[9px] font-bold text-violet-400 bg-violet-500/15 px-2.5 py-1 rounded border border-violet-500/35 z-10 uppercase tracking-wider pointer-events-none">
        SYSTEM WORKSPACE: Hover nodes to trace mapping paths (Swipe / scroll horizontally)
      </div>

      {/* Scrollable Viewport */}
      <div className="w-full overflow-x-auto scrollbar-none flex-grow flex items-center min-h-[290px]">
        <svg className="h-[310px] w-[940px] shrink-0 block mx-auto" viewBox="0 0 940 350">
          <defs>
            {/* Custom glowing gradient for each node bubble */}
            {nodes.map((node) => (
              <radialGradient key={node.id} id={`grad-${node.id}`} cx="45%" cy="45%" r="60%">
                <stop offset="0%" stopColor="var(--color-card)" stopOpacity="0.4" />
                <stop offset="80%" stopColor="var(--color-card)" stopOpacity="0.95" />
                <stop offset="100%" stopColor={node.color} stopOpacity="0.15" />
              </radialGradient>
            ))}
          </defs>

          {/* Continuous Flow Pipeline Background Guideline */}
          <path
            d={fullPath}
            fill="none"
            stroke="color-mix(in oklab, var(--color-foreground) 8%, transparent)"
            strokeWidth="2.5"
          />

          {/* Solid glowing line segment traveling from start to end: Outer glow stroke (GPU friendly) */}
          <path
            d={fullPath}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="9"
            strokeDasharray="150, 940"
            className="opacity-25 pointer-events-none"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-1090"
              dur="5.5s"
              repeatCount="indefinite"
            />
          </path>

          {/* Solid glowing line segment traveling from start to end: Inner core stroke */}
          <path
            d={fullPath}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="3.5"
            strokeDasharray="150, 940"
            className="opacity-90 pointer-events-none"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-1090"
              dur="5.5s"
              repeatCount="indefinite"
            />
          </path>

          {/* Connection Curves */}
          {connections.map((conn, idx) => {
            const fromNode = nodes.find((n) => n.id === conn.from);
            const toNode = nodes.find((n) => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            const isHighlighted = hoveredNode === conn.from || hoveredNode === conn.to;
            const pathData = getCurvePath(fromNode, toNode);

            return (
              <g key={idx} className="pointer-events-none">
                {isHighlighted && (
                  <path
                    d={pathData}
                    fill="none"
                    stroke={fromNode.color}
                    strokeWidth="9"
                    className="opacity-20 transition-all duration-300"
                  />
                )}
                <path
                  d={pathData}
                  fill="none"
                  stroke={
                    isHighlighted
                      ? fromNode.color
                      : "color-mix(in oklab, var(--color-foreground) 15%, transparent)"
                  }
                  strokeWidth={isHighlighted ? 3.5 : 2}
                  className="transition-all duration-300"
                  strokeDasharray={isHighlighted ? "none" : "6,6"}
                />
                {isHighlighted && (
                  <g>
                    {/* Outer glow dot */}
                    <circle r="12" fill={fromNode.color} className="opacity-25">
                      <animateMotion dur="1.4s" repeatCount="indefinite" path={pathData} />
                    </circle>
                    {/* Core sharp dot */}
                    <circle r="6" fill={fromNode.color}>
                      <animateMotion dur="1.4s" repeatCount="indefinite" path={pathData} />
                    </circle>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const Icon = node.icon;
            const isHovered = hoveredNode === node.id;

            return (
              <g
                key={node.id}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Large Outer Ring Glow on Hover */}
                {isHovered && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="44"
                    fill="transparent"
                    stroke={node.color}
                    strokeWidth="1.5"
                    className="opacity-50 animate-pulse"
                  />
                )}
                {/* Node Circle (Enlarged) */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? "36" : "30"}
                  fill={`url(#grad-${node.id})`}
                  stroke={isHovered ? node.color : "var(--color-border)"}
                  strokeWidth={isHovered ? "3.5" : "2.5"}
                  className="transition-all duration-300 shadow-xl"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 16px ${node.color})` : "none",
                  }}
                />
                {/* Node Icon (Enlarged) */}
                <foreignObject
                  x={node.x - 18}
                  y={node.y - 18}
                  width="36"
                  height="36"
                  className="pointer-events-none"
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <Icon
                      className="size-6 transition-all duration-300"
                      style={{ color: isHovered ? node.color : "var(--color-foreground)" }}
                    />
                  </div>
                </foreignObject>
                {/* Node Label (Big & Visible) */}
                <text
                  x={node.x}
                  y={node.y + 54}
                  textAnchor="middle"
                  className={`font-sans text-[13px] font-black uppercase tracking-widest transition-all duration-300 pointer-events-none ${
                    isHovered ? "fill-foreground scale-105" : "fill-muted-foreground"
                  }`}
                  style={{
                    fill: isHovered ? node.color : undefined,
                  }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Overlay details panel */}
      <div className="w-full border-t border-violet-500/30 dark:border-violet-400/25 bg-secondary/80 dark:bg-black/40 p-4 text-center transition-all min-h-[75px] flex items-center justify-center relative z-10">
        {activeNodeData ? (
          <div className="animate-entrance space-y-1">
            <span
              className="font-mono text-[11px] uppercase tracking-widest font-extrabold"
              style={{ color: activeNodeData.color }}
            >
              {activeNodeData.label} Phase
            </span>
            <p className="text-xs md:text-sm text-foreground/95 font-bold leading-relaxed">
              {activeNodeData.details}
            </p>
          </div>
        ) : (
          <span className="font-mono text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest font-bold">
            Hover nodes to trace the builder lifecycle steps
          </span>
        )}
      </div>
    </div>
  );
}

// ───────── 2. MISSION CONTROL COMMAND PALETTE ─────────
export function MissionControl() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const items = [
    { label: "Home / Hook", target: "home" },
    { label: "Journey Timeline", target: "journey" },
    { label: "Projects Showcase", target: "projects" },
    { label: "Skills Workbench", target: "skills" },
    { label: "Builder's Principles", target: "principles" },
    { label: "Engineering Logs", target: "blog" },
    { label: "Talk to AI Clone", target: "chat" },
    { label: "Contact Coordinates", target: "contact" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavigate = (targetId: string) => {
    setIsOpen(false);
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const filteredItems = items.filter((it) => it.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      {/* Floating CMD Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full bg-foreground text-background shadow-2xl hover:bg-accent hover:text-accent-foreground transition-all cursor-pointer ring-glow"
        aria-label="Open Command Palette"
      >
        <span className="font-mono text-xs font-bold">⌘K</span>
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-entrance">
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border/80 bg-card p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-2 border-b border-border pb-3 mb-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                autoFocus
                placeholder="Search command palette... (esc to close)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setIsOpen(false);
                }}
              />
            </div>

            {/* List */}
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {filteredItems.map((it) => (
                <button
                  key={it.target}
                  onClick={() => handleNavigate(it.target)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-secondary transition-colors"
                >
                  <span className="font-medium">{it.label}</span>
                  <ArrowRight className="size-3.5 opacity-60" />
                </button>
              ))}
              {filteredItems.length === 0 && (
                <p className="text-center font-mono text-xs text-muted-foreground py-4">
                  No matching commands found.
                </p>
              )}
            </div>
            <div className="mt-4 border-t border-border/50 pt-3 flex justify-between items-center text-[10px] font-mono text-muted-foreground">
              <span>Use Ctrl+K to open anywhere</span>
              <button onClick={() => setIsOpen(false)} className="hover:text-foreground">
                [close]
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ───────── 3. 3D PRODUCT / CARD ROTATOR ─────────
export function ThreeDProductViewer({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;

    // Tilt calculations
    const rotX = -(y / (r.height / 2)) * 12; // tilt max 12deg
    const rotY = (x / (r.width / 2)) * 12;

    el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (el) {
      el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="transition-transform duration-200 ease-out will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

// Helper Component for interactive, glowing 6D/3D Journey Cards
function JourneyCard({
  step,
}: {
  step: { flag: string; period: string; title: string; bullets: string[]; tags: string[] };
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    setCoords({ x, y });

    // 3D tilt calculation
    const rotX = -((y - r.height / 2) / (r.height / 2)) * 8; // Max 8 degrees tilt for performance and aesthetics
    const rotY = ((x - r.width / 2) / (r.width / 2)) * 8;
    el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const el = cardRef.current;
    if (el) {
      el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
      className="group relative flex flex-col gap-4 rounded-2xl border border-accent/25 dark:border-accent/30 bg-secondary/30 dark:bg-white/[0.03] p-6 shadow-[0_0_15px_color-mix(in_oklab,var(--color-accent)_10%,transparent)] transition-all duration-300 overflow-hidden cursor-pointer hover:border-accent/60 hover:shadow-[0_0_30px_color-mix(in_oklab,var(--color-accent)_30%,transparent)]"
    >
      {/* Cursor spotlight radial glow overlay */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, color-mix(in_oklab, var(--color-accent) 15%, transparent), transparent 80%)`,
        }}
      />

      {/* Floating background flag */}
      <div className="absolute top-4 right-4 text-4xl opacity-10 select-none transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12 pointer-events-none">
        {step.flag}
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 relative z-10 pointer-events-none">
        <div className="flex size-12 items-center justify-center rounded-xl bg-card border border-border/50 shadow-inner text-2xl transition-all duration-300 group-hover:scale-110 group-hover:border-accent/40 group-hover:shadow-[0_0_15px_color-mix(in_oklab,var(--color-accent)_25%,transparent)]">
          {step.flag}
        </div>
        <div>
          <p className="font-mono text-[10px] text-accent uppercase tracking-widest font-semibold">
            {step.period}
          </p>
          <h4 className="text-lg font-bold text-foreground transition-colors group-hover:text-accent">
            {step.title}
          </h4>
        </div>
      </div>

      {/* Bullets */}
      <ul className="space-y-3 flex-1 relative z-10 pointer-events-none">
        {step.bullets.map((b) => (
          <li
            key={b}
            className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground/90"
          >
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent/40 group-hover:bg-accent group-hover:scale-110 transition-all duration-300" />
            {b}
          </li>
        ))}
      </ul>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/30 relative z-10 pointer-events-none">
        {step.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-card/85 px-2 py-0.5 font-mono text-[9px] text-foreground/60 border border-border/40 transition-colors duration-300 group-hover:border-accent/30 group-hover:text-accent"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ───────── 4. HORIZONTAL TIMELINE STORY ─────────
export function JourneyStory() {
  const steps = [
    {
      flag: "🇮🇳",
      period: "2021 – 2025",
      title: "India",
      bullets: [
        "B.E. in Computer Science",
        "Built & patented MedConnect (IoT medicine dispenser)",
        "Automated result scraping for the department",
      ],
      tags: ["C++", "IoT", "Python"],
    },
    {
      flag: "🇩🇪",
      period: "2025 – Present",
      title: "Germany",
      bullets: [
        "MSc Computer Science @ RPTU Kaiserslautern",
        "Specializing in Software Engineering & AI Systems",
        "Built Lumen — semantic AI reader & CMS platform",
      ],
      tags: ["FastAPI", "React", "pgvector"],
    },
    {
      flag: "🚀",
      period: "Now",
      title: "Shipping",
      bullets: [
        "Open to software engineering roles & internships",
        "Building web products and AI-powered utilities",
        "German A2 (currently pursuing B1)",
      ],
      tags: ["TypeScript", "PostgreSQL", "Tailwind CSS"],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {steps.map((st) => (
        <JourneyCard key={st.title} step={st} />
      ))}
    </div>
  );
}

// ───────── 5. LIVE SKILLS ARCHITECTURE DIAGRAM ─────────
export function LiveSkillArchitecture() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const architecture = {
    frontend: {
      title: "Frontend Layer",
      technologies: ["React", "Next.js", "TypeScript"],
      projects: [
        "Lumen (knowledge reader UI)",
        "Effortless verification dashboard",
        "Caregiver dashboard",
      ],
    },
    backend: {
      title: "Backend Core",
      technologies: ["FastAPI", "Python", "NodeJS"],
      projects: ["Lumen summary APIs", "MedConnect scheduler", "Express APIs"],
    },
    infra: {
      title: "Infrastructure & DB",
      technologies: ["Docker", "PostgreSQL", "Redis", "Linux"],
      projects: ["Redis caching server", "pgvector semantic indexes", "Dockerized services"],
    },
    ai: {
      title: "AI Orchestration",
      technologies: ["LangChain", "OpenAI APIs", "Semantic Search"],
      projects: ["AI clone agent", "Article summarizer & Q&A models", "Vector retrieval pipelines"],
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      {/* Node Layout Map */}
      <div className="md:col-span-7 space-y-4 relative">
        <div className="glow-orb size-40 bg-accent/5 top-10 left-10" />

        {Object.entries(architecture).map(([key, value]) => {
          const isActive = activeComponent === key;

          return (
            <div
              key={key}
              onMouseEnter={() => setActiveComponent(key)}
              onMouseLeave={() => setActiveComponent(null)}
              className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer ${
                isActive ? "border-accent ring-glow scale-101" : "border-border/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    {key === "frontend" && <Monitor className="size-4" />}
                    {key === "backend" && <Cpu className="size-4" />}
                    {key === "infra" && <Database className="size-4" />}
                    {key === "ai" && <Brain className="size-4" />}
                  </div>
                  <h4 className="font-extrabold text-sm">{value.title}</h4>
                </div>
                <div className="flex flex-wrap gap-1">
                  {value.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-secondary/70 px-2 py-0.5 font-mono text-[9px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Display Sidebar */}
      <div className="md:col-span-5 h-full">
        <div className="glass-card h-full min-h-[220px] p-6 rounded-2xl border border-border/80 flex flex-col justify-between bg-card/60 backdrop-blur-md">
          {activeComponent ? (
            <div className="space-y-4 animate-entrance">
              <MicroLabel>Layer Connections</MicroLabel>
              <h4 className="text-xl font-bold text-accent">
                {architecture[activeComponent as keyof typeof architecture].title}
              </h4>
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-muted-foreground font-bold">
                  Used in projects:
                </span>
                <ul className="space-y-1.5">
                  {architecture[activeComponent as keyof typeof architecture].projects.map(
                    (proj) => (
                      <li
                        key={proj}
                        className="flex items-center gap-2 text-xs text-foreground/90 font-medium"
                      >
                        <span className="size-1 rounded-full bg-accent" />
                        {proj}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-center items-center text-center py-8">
              <Activity className="size-8 text-accent animate-pulse mb-3" />
              <p className="font-mono text-xs text-muted-foreground">
                Hover over architectural blocks to trace connection contexts
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────── 6. INTERACTIVE OPERATING SYSTEM CONSOLE ─────────
export function SKOS() {
  const [history, setHistory] = useState<Array<{ cmd: string; out: string }>>([
    { cmd: "help", out: "Welcome to SKOS. Available commands: whoami, skills, projects, clear" },
  ]);
  const [input, setInput] = useState("");
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  const commands: Record<string, string> = {
    whoami:
      "Samarth Kashyap — MSc Computer Science Student & Tech Innovator. Building distributed networks, patented hardware, and full-stack software.",
    skills: "Python, FastAPI, TypeScript, React, PostgreSQL, Docker, Redis, C++, IoT firmware.",
    projects:
      "Lumen (swipeable articles), Effortless (certificates verifier), MedConnect (dispenser device).",
    help: "Available commands: whoami, skills, projects, clear",
  };

  const handleCommandSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanCmd = input.trim().toLowerCase();
    if (cleanCmd === "clear") {
      setHistory([]);
    } else if (cleanCmd in commands) {
      setHistory((prev) => [...prev, { cmd: input, out: commands[cleanCmd] }]);
    } else if (cleanCmd !== "") {
      setHistory((prev) => [
        ...prev,
        { cmd: input, out: `Command not found: '${input}'. Type 'help' for listing.` },
      ]);
    }
    setInput("");
  };

  useEffect(() => {
    if (history.length > 1) {
      terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  return (
    <div className="terminal w-full max-w-2xl mx-auto flex flex-col justify-between min-h-[300px]">
      <div className="space-y-3 font-mono text-xs max-h-60 overflow-y-auto pr-2">
        {history.map((h, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="prompt">samarth@skos:~$</span>
              <span className="text-foreground">{h.cmd}</span>
            </div>
            <div className="text-muted-foreground/90 leading-relaxed whitespace-pre-wrap">
              {h.out}
            </div>
          </div>
        ))}
        <div ref={terminalBottomRef} />
      </div>

      <form
        onSubmit={handleCommandSubmit}
        className="mt-4 flex items-center gap-1.5 font-mono text-xs border-t border-border/30 pt-3"
      >
        <span className="prompt">samarth@skos:~$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type whoami, skills, projects..."
          className="flex-1 bg-transparent outline-none text-foreground"
        />
      </form>
    </div>
  );
}

export function ProjectStackHighlights({
  highlights,
  stack,
}: {
  highlights: string[];
  stack: string[];
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group/highlights relative border-t border-border/40 pt-4 cursor-pointer select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered((prev) => !prev)}
      title="Click/Hover to toggle Stack details"
    >
      <div className="relative min-h-[105px]">
        {/* WHAT I BUILT VIEW */}
        <div
          className={`transition-all duration-300 ease-out ${
            isHovered
              ? "opacity-0 -translate-y-2 pointer-events-none absolute inset-x-0 top-0"
              : "opacity-100 translate-y-0 relative"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground font-extrabold flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-accent animate-pulse" />
              What I Built
            </span>
            <span className="font-mono text-[9px] text-muted-foreground/50 hidden sm:inline-block">
              Hover to reveal stack
            </span>
          </div>
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            {highlights.map((h) => (
              <li
                key={h}
                className="flex items-center gap-2 text-xs text-foreground/90 font-semibold"
              >
                <span className="text-accent text-sm leading-none">•</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* BUILT WITH VIEW */}
        <div
          className={`transition-all duration-300 ease-out ${
            isHovered
              ? "opacity-100 translate-y-0 relative"
              : "opacity-0 translate-y-2 pointer-events-none absolute inset-x-0 top-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-accent font-extrabold flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-accent" />
              Built With
            </span>
            <span className="font-mono text-[9px] text-accent/60 hidden sm:inline-block">
              Tap to see highlights
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {stack.map((s) => (
              <span
                key={s}
                className="rounded-md border border-border/85 bg-secondary/60 dark:bg-white/[0.04] px-2.5 py-1 font-mono text-[10.5px] md:text-xs text-foreground font-bold shadow-sm"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
