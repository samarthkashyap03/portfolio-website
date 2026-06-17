import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  MapPin,
  Sparkles,
  Send,
  Terminal as TerminalIcon,
  Compass,
  Wrench,
  Cpu,
  Github,
  ExternalLink,
  Brain,
  ShieldCheck,
  Mail,
  Linkedin,
  Award,
  Lightbulb,
  Trophy,
  Users,
  Globe,
  BookOpen,
  Activity,
  CheckCircle,
} from "lucide-react";
import { useState, useMemo, type FormEvent, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MicroLabel, SiteShell } from "@/components/site/SiteShell";
import { projects, skillGroups, identity, nowList, contact, type Project } from "@/lib/site-data";
import { SkillsMarquee } from "@/components/site/SkillsMarquee";
import { Magnetic, Reveal, Typewriter } from "@/components/site/interactive";
import { ChatWindow } from "@/components/site/ChatWindow";
import portrait from "@/assets/portrait.jpg";
import {
  InteractiveHeroGraph,
  MissionControl,
  ThreeDProductViewer,
  JourneyStory,
  LiveSkillArchitecture,
  SKOS,
  ProjectStackHighlights,
} from "@/components/site/InteractiveComponents";
import { GitHubHeatmap } from "@/components/site/GitHubHeatmap";
import { SamarthOSCanvas } from "@/components/site/SamarthOSCanvas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Samarth Kashyap — Software Engineer & Systems Builder" },
      {
        name: "description",
        content:
          "MSc Computer Science student in Kaiserslautern building AI agent systems, distributed backends, and hardware-software synergy.",
      },
      {
        name: "keywords",
        content:
          "Samarth Kashyap, software engineer, RPTU Kaiserslautern, AI agent, pgvector, full-stack, distributed backends, IoT, Germany, computer science student, portfolio, developer",
      },
      { property: "og:title", content: "Samarth Kashyap — Software Engineer & Systems Builder" },
      {
        property: "og:description",
        content:
          "AI agent systems, backend, and product engineering. Granted patent holder. Projects and resume details.",
      },
    ],
  }),
  component: Index,
});

const FILTERS = ["All", "AI", "Full-Stack", "Hardware"] as const;
type Filter = (typeof FILTERS)[number];

const categoryFor = (p: Project): Exclude<Filter, "All">[] => {
  const tags: Exclude<Filter, "All">[] = [];
  if (["lumen"].includes(p.slug)) tags.push("AI");
  if (["lumen", "effortless"].includes(p.slug)) tags.push("Full-Stack");
  if (["medconnect"].includes(p.slug)) tags.push("Hardware");
  return tags;
};

const iconFor = (slug: string) => {
  if (slug === "lumen") return Brain;
  if (slug === "effortless") return ShieldCheck;
  return Cpu;
};

// ─── Beyond Code Card ──────────────────────────────────────────────────────────
interface BeyondCardData {
  id: string;
  icon: React.ElementType;
  badge: string;
  title: string;
  tagline: string;
  details: string[];
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  hoverBorder: string;
  dotColor: string;
  accentHover: string;
  revealBorderTop: string;
  glowRgb: string; // e.g. "139,92,246"
  delay: number; // animation-delay offset ms
}

const BEYOND_CARDS: BeyondCardData[] = [
  {
    id: "patent",
    icon: Award,
    badge: "Govt. of India",
    title: "Granted Patent Holder",
    tagline: "Designed and patented a physical kiosk for automated medicine dispensing.",
    details: [
      "Designed a physical carousel rotated by a NEMA17 stepper motor and A4988 driver",
      "Calibrated disk positions using A3144 Hall Effect sensors and disk-mounted magnets",
      "Wrote ESP8266 firmware in C++ to verify prescriptions via scanned QR and NFC tags",
      "Indian Patent No. 710119106, funded and awarded Best Project at college exhibition",
    ],
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/15",
    iconBorder: "border-violet-500/40",
    hoverBorder: "hover:border-violet-400/70",
    dotColor: "bg-violet-400",
    accentHover: "group-hover:text-violet-400",
    revealBorderTop: "border-t border-violet-500/50",
    glowRgb: "139,92,246",
    delay: 0,
  },
  {
    id: "edc",
    icon: Lightbulb,
    badge: "Jyothy Institute of Technology",
    title: "EDC Founder",
    tagline:
      "Started the first student-run entrepreneurship club at Jyothy Institute of Technology.",
    details: [
      "Convinced college administration to approve and establish JIT's first entrepreneurship body",
      "Organized student pitch sessions and hands-on bootstrapping workshops from scratch",
      "Recruited and grew a core community of 60+ active students in our first semester",
      "Brought local founders and tech leads to campus to mentor student builders",
    ],
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15",
    iconBorder: "border-emerald-500/40",
    hoverBorder: "hover:border-emerald-400/70",
    dotColor: "bg-emerald-400",
    accentHover: "group-hover:text-emerald-400",
    revealBorderTop: "border-t border-emerald-500/50",
    glowRgb: "52,211,153",
    delay: 700,
  },
  {
    id: "technoxian",
    icon: Cpu,
    badge: "Pragati Maidan · New Delhi",
    title: "Technoxian World Robotics",
    tagline:
      "Led JIT's robotics team at the Technoxian International Robotics Contest in New Delhi.",
    details: [
      "Coordinated a 10-member team to construct an autonomous, fast line-following robot chassis",
      "Coded and tuned the PID (Proportional-Integral-Derivative) loop for precise sensor feedback",
      "Calibrated analog IR sensor arrays to handle varying track reflections and lighting",
      "Competed against hundreds of teams at Pragati Maidan, securing a fastest-lap certificate",
    ],
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/15",
    iconBorder: "border-orange-500/40",
    hoverBorder: "hover:border-orange-400/70",
    dotColor: "bg-orange-400",
    accentHover: "group-hover:text-orange-400",
    revealBorderTop: "border-t border-orange-500/50",
    glowRgb: "251,146,60",
    delay: 1400,
  },
  {
    id: "jithack",
    icon: Trophy,
    badge: "JITHACK '23 · 3rd Place",
    title: "Hackathon Podium",
    tagline: "Secured 3rd place at JITHACK 2023 by building a wireless robotic arm.",
    details: [
      "Designed, wired, and calibrated a robotic arm controlled entirely over Wi-Fi in under 24 hours",
      "Configured the ESP8266 as a standalone access point to host a local control server",
      "Wrote lightweight C++ socket code on the controller to receive axis-rotation coordinates",
      "Finished 3rd out of 40+ competing teams after delivering a successful live hardware demo",
    ],
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/15",
    iconBorder: "border-cyan-500/40",
    hoverBorder: "hover:border-cyan-400/70",
    dotColor: "bg-cyan-400",
    accentHover: "group-hover:text-cyan-400",
    revealBorderTop: "border-t border-cyan-500/50",
    glowRgb: "34,211,238",
    delay: 2100,
  },
];

function BeyondCard({ card }: { card: BeyondCardData }) {
  const Icon = card.icon;
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      onClick={() => isMobile && setIsRevealed(!isRevealed)}
      className={[
        "group relative min-h-[340px] overflow-hidden rounded-3xl",
        "border border-border dark:border-white/[0.25]",
        "bg-card/40 dark:bg-white/[0.02] backdrop-blur-xl",
        "transition-all duration-500 cursor-default select-none",
        "beyond-card-glow",
        card.hoverBorder,
        isMobile ? "cursor-pointer animate-entrance" : "",
      ].join(" ")}
      style={
        {
          "--card-glow-color": `rgba(${card.glowRgb}, 0.12)`,
          animationDelay: `${card.delay}ms`,
          boxShadow: `0 0 20px rgba(${card.glowRgb}, 0.08), inset 0 1px 0 rgba(${card.glowRgb}, 0.1)`,
        } as React.CSSProperties
      }
    >
      {/* ── Always-on ambient orbs ── */}
      <div
        className={`absolute -top-12 -right-12 size-48 rounded-full ${card.iconBg} blur-3xl pointer-events-none`}
        style={{
          opacity: 0.35,
          animation: `beyond-card-glow ${3.5}s ease-in-out infinite`,
          animationDelay: `${card.delay}ms`,
        }}
      />
      <div
        className={`absolute -bottom-12 -left-12 size-36 rounded-full ${card.iconBg} blur-3xl pointer-events-none`}
        style={{
          opacity: 0.2,
          animation: `beyond-card-glow ${4}s ease-in-out infinite`,
          animationDelay: `${card.delay + 500}ms`,
        }}
      />

      {/* ── Horizontal scan line ── */}
      <div className="absolute inset-x-0 top-0 h-full pointer-events-none overflow-hidden rounded-3xl z-[1]">
        <div
          className="absolute inset-x-0 h-[2px] beyond-scan-line"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${card.glowRgb},0.6), rgba(${card.glowRgb},0.9), rgba(${card.glowRgb},0.6), transparent)`,
            animationDelay: `${card.delay + 800}ms`,
          }}
        />
      </div>

      {/* ── Floating watermark icon ── */}
      <Icon
        className="absolute bottom-4 right-5 size-28 pointer-events-none text-foreground beyond-watermark-float"
        style={{ animationDelay: `${card.delay}ms` }}
      />

      {/* ── Normal state content ── */}
      <div className="relative z-10 p-7 flex flex-col gap-5 transition-all duration-400 group-hover:opacity-0 group-hover:-translate-y-3">
        {/* Icon badge — always breathing */}
        <div
          className={`self-start p-3 rounded-2xl ${card.iconBg} border ${card.iconBorder} beyond-icon-breathe`}
          style={{ animationDelay: `${card.delay}ms` }}
        >
          <Icon className={`size-5 ${card.iconColor}`} />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground block">
            {card.badge}
          </span>
          <h3
            className={`text-xl font-extrabold text-foreground tracking-tight transition-colors duration-300 ${card.accentHover}`}
          >
            {card.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{card.tagline}</p>
        </div>

        {/* Hover hint — pulses */}
        <span
          className="font-mono text-[9px] text-muted-foreground/35 uppercase tracking-wider"
          style={{
            animation: "beyond-icon-breathe 2.5s ease-in-out infinite",
            animationDelay: `${card.delay + 300}ms`,
          }}
        >
          {isMobile ? "Tap to reveal ↑" : "Hover to reveal ↑"}
        </span>
      </div>

      {/* ── Reveal panel — slides up on hover ── */}
      <div
        className={[
          "absolute inset-0 z-20 flex flex-col justify-end overflow-hidden",
          isRevealed ? "translate-y-0" : "translate-y-full",
          "group-hover:translate-y-0",
          "transition-transform duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          `bg-card/[0.96] dark:bg-background/[0.96] backdrop-blur-2xl`,
          card.revealBorderTop,
        ].join(" ")}
        style={{
          boxShadow: `0 -10px 40px -5px rgba(${card.glowRgb}, 0.25) inset`,
        }}
      >
        {/* Panel top glow stripe */}
        <div
          className="absolute top-0 inset-x-0 h-[1px] pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${card.glowRgb},0.7), transparent)`,
          }}
        />

        {/* Panel header */}
        <div className="px-7 pt-6 pb-3 flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${card.iconBg} border ${card.iconBorder} shadow-[0_0_16px_rgba(var(--tw-shadow-color)/0.4)]`}
            style={{ boxShadow: `0 0 16px rgba(${card.glowRgb},0.3)` }}
          >
            <Icon className={`size-4 ${card.iconColor}`} />
          </div>
          <div>
            <p className="font-extrabold text-sm text-foreground">{card.title}</p>
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
              {card.badge}
            </p>
          </div>
        </div>

        {/* Bullet details — staggered */}
        <ul className="px-7 pb-7 space-y-3">
          {card.details.map((detail, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-foreground/85 leading-relaxed"
              style={{
                opacity: 0,
                animation: "entrance-up 0.35s ease-out forwards",
                animationDelay: `${i * 80}ms`,
              }}
            >
              <span
                className={`mt-[7px] size-1.5 rounded-full ${card.dotColor} shrink-0`}
                style={{ boxShadow: `0 0 8px rgba(${card.glowRgb}, 0.9)` }}
              />
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AboutMeTransitionCards() {
  const cards = [
    {
      label: "Milestone 01",
      value: "Started with Robotics",
      desc: "Began experimenting with Arduino boards and simple robots in 9th grade, sparking a lifelong interest in software.",
      icon: Cpu,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      glow: "from-violet-500/15 dark:from-violet-500/20",
      hoverBorder: "hover:border-violet-400/70 dark:hover:border-violet-500/70",
      shadow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]",
      borderAccent: "bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500",
    },
    {
      label: "Milestone 02",
      value: "Building Communities",
      desc: "Co-founded the Entrepreneurship Club (EDC) at college and ran programming bootcamps for 30+ students.",
      icon: Users,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
      glow: "from-pink-500/15 dark:from-pink-500/20",
      hoverBorder: "hover:border-pink-400/70 dark:hover:border-pink-500/70",
      shadow: "hover:shadow-[0_0_30px_rgba(244,114,182,0.35)]",
      borderAccent: "bg-gradient-to-r from-pink-500 via-rose-500 to-violet-500",
    },
    {
      label: "Milestone 03",
      value: "Improving Medicine Access",
      desc: "Built MedConnect, an automated medicine dispensing system that later received an Indian patent.",
      icon: Award,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      glow: "from-purple-500/15 dark:from-purple-500/20",
      hoverBorder: "hover:border-purple-400/70 dark:hover:border-purple-500/70",
      shadow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]",
      borderAccent: "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500",
    },
    {
      label: "Milestone 04",
      value: "Moved to Germany",
      desc: "Pursuing M.Sc. in Computer Science at RPTU Kaiserslautern to study software systems at scale.",
      icon: MapPin,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      glow: "from-cyan-500/15 dark:from-cyan-500/20",
      hoverBorder: "hover:border-cyan-400/70 dark:hover:border-cyan-500/70",
      shadow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.35)]",
      borderAccent: "bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500",
    },
    {
      label: "Milestone 05",
      value: "Built & Shipped Products",
      desc: "Shipped functional web platforms like Lumen and Effortless to solve real-world daily user problems.",
      icon: Globe,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      glow: "from-emerald-500/15 dark:from-emerald-500/20",
      hoverBorder: "hover:border-emerald-400/70 dark:hover:border-emerald-500/70",
      shadow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]",
      borderAccent: "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c, index) => {
          const CardIcon = c.icon;

          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={[
                "group/card relative rounded-2xl border border-border/90 dark:border-white/15",
                "bg-card/95 dark:bg-white/[0.04] py-7 px-5 flex flex-col justify-between min-h-[195px] overflow-hidden",
                "transition-all duration-500 select-none cursor-default hover:scale-[1.03] hover:bg-secondary/40 dark:hover:bg-white/[0.06]",
                c.hoverBorder,
                c.shadow,
              ].join(" ")}
            >
              {/* Top accent colorful stripe */}
              <div
                className={`absolute top-0 inset-x-0 h-1 ${c.borderAccent} opacity-40 group-hover/card:opacity-100 transition-opacity duration-300`}
              />

              {/* Dynamic hover accent light source */}
              <div
                className={`absolute inset-0 bg-gradient-to-tr ${c.glow} to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none blur-md`}
              />

              {/* Watermark background icon */}
              <CardIcon className="absolute bottom-2 right-2 size-20 text-muted-foreground/5 pointer-events-none group-hover/card:scale-110 group-hover/card:text-accent/10 transition-all duration-500" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[9.5px] font-bold uppercase tracking-widest text-muted-foreground group-hover/card:text-accent transition-colors duration-300">
                    {c.label}
                  </span>
                  <div
                    className={`p-2 rounded-lg ${c.bg} border ${c.border} group-hover/card:scale-110 group-hover/card:border-accent/30 transition-all duration-300`}
                  >
                    <CardIcon
                      className={`size-4.5 ${c.color} transition-all duration-300 group-hover/card:brightness-125 group-hover/card:drop-shadow-[0_0_8px_currentColor]`}
                    />
                  </div>
                </div>
                <h4 className="text-[14.5px] sm:text-[15px] font-black text-foreground mb-2 leading-snug">
                  {c.value}
                </h4>
              </div>
              <p className="relative z-10 text-[11.5px] md:text-[12px] leading-relaxed text-muted-foreground/95 dark:text-muted-foreground/80 mt-auto">
                {c.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function StoryDeck() {
  const [activeTab, setActiveTab] = useState(0);

  const slides = [
    {
      icon: Cpu,
      title: "Arduino, Robots & Curiosity",
      text: (
        <span>
          I started building in 9th grade with{" "}
          <span className="text-violet-500 dark:text-violet-400 font-semibold">
            Arduino boards and simple robots
          </span>
          . Watching code bring physical hardware to life sparked a{" "}
          <span className="text-cyan-500 dark:text-cyan-400 font-semibold">curiosity</span> that
          never left. It pulled me straight into{" "}
          <span className="text-violet-500 dark:text-violet-400 font-semibold">
            software engineering
          </span>
          , driven by a simple urge: to create.
        </span>
      ),
      marker: "2017 → First Arduino projects",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      accentGlow: "from-violet-500/25 via-violet-500/5 to-transparent",
      activeBorder:
        "border-violet-500/40 dark:border-violet-500/30 shadow-[0_0_35px_rgba(139,92,246,0.2)]",
      iconGlow: "shadow-[0_0_15px_rgba(139,92,246,0.35)]",
    },
    {
      icon: Award,
      title: "Building, Leading & Solving Problems",
      text: (
        <span>
          In college, I co-founded the{" "}
          <span className="text-purple-500 dark:text-purple-400 font-semibold">EDC club</span> and
          ran programming workshops. That community focus led to{" "}
          <span className="text-pink-500 dark:text-pink-400 font-semibold">MedConnect</span>—an
          automated pharmacy kiosk built on endless Sundays that later received a{" "}
          <span className="text-purple-500 dark:text-purple-400 font-semibold">
            granted Indian patent
          </span>
          .
        </span>
      ),
      marker: "2024 → Patent Granted",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      accentGlow: "from-purple-500/25 via-purple-500/5 to-transparent",
      activeBorder:
        "border-purple-500/40 dark:border-purple-500/30 shadow-[0_0_35px_rgba(168,85,247,0.2)]",
      iconGlow: "shadow-[0_0_15px_rgba(168,85,247,0.35)]",
    },
    {
      icon: MapPin,
      title: "Germany, Software & New Challenges",
      text: (
        <span>
          I moved 7,000 km to Germany for my Master's at{" "}
          <span className="text-cyan-500 dark:text-cyan-400 font-semibold">RPTU</span>, studying
          software systems at scale. Today, I ship side projects like{" "}
          <span className="text-emerald-500 dark:text-emerald-400 font-semibold">Lumen</span> and{" "}
          <span className="text-purple-500 dark:text-purple-400 font-semibold">Effortless</span>. My
          goal is to build a{" "}
          <span className="text-cyan-500 dark:text-cyan-400 font-semibold">technology company</span>{" "}
          of my own.
        </span>
      ),
      marker: "2025 → MSc @ RPTU",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      accentGlow: "from-cyan-500/25 via-cyan-500/5 to-transparent",
      activeBorder:
        "border-cyan-500/40 dark:border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.2)]",
      iconGlow: "shadow-[0_0_15px_rgba(6,182,212,0.35)]",
    },
  ];

  const current = slides[activeTab];
  const Icon = current.icon;

  return (
    <div className="flex flex-col h-full justify-between space-y-6">
      <div className="space-y-4">
        <span className="font-mono text-xs md:text-sm font-extrabold uppercase tracking-widest text-accent pl-0.5 block">
          ABOUT ME
        </span>

        {/* Navigation tabs with Sliding Active Pill */}
        <div className="grid grid-cols-3 gap-1 md:flex md:gap-2 p-1.5 border border-border/80 bg-secondary/40 dark:bg-white/[0.04] rounded-xl w-full md:w-fit relative">
          {slides.map((slide, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className="relative w-full md:w-auto text-center px-2 py-2.5 md:px-4.5 md:py-2.5 rounded-lg text-[10px] md:text-sm font-bold transition-all cursor-pointer font-mono whitespace-nowrap z-10"
            >
              {activeTab === idx && (
                <motion.div
                  layoutId="activeStoryTab"
                  className="absolute inset-0 bg-card rounded-lg border border-border/60 shadow-md"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span
                className={`relative z-20 transition-colors duration-300 ${
                  activeTab === idx ? "text-accent" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Chapter {idx + 1}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Slide Content card with Fade/Slide Animations */}
      <div
        className={`relative min-h-[220px] flex flex-col justify-between rounded-2xl border bg-card/95 dark:bg-white/[0.04] p-8 backdrop-blur-md overflow-hidden transition-all duration-[500ms] ${current.activeBorder}`}
      >
        {/* Decorative dynamic ambient glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-tr ${current.accentGlow} pointer-events-none opacity-80 blur-2xl`}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 relative z-10"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl bg-card border ${current.border} ${current.iconGlow} transition-all duration-300`}
              >
                <Icon className={`size-6 ${current.color} animate-pulse`} />
              </div>
              <h3 className="text-2xl font-black text-foreground tracking-tight">
                {current.title}
              </h3>
            </div>
            <div className="text-base md:text-lg leading-relaxed text-foreground/85 dark:text-foreground/90 font-medium text-pretty">
              {current.text}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between font-mono text-[11px] text-accent font-bold pt-4 border-t border-border/30 relative z-10">
          <span>{current.marker}</span>
          <Link
            to="/about"
            className="group/link inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-5 py-2 font-mono text-xs md:text-sm text-accent transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:border-accent hover:shadow-[0_0_15px_color-mix(in_oklab,var(--color-accent)_30%,transparent)] hover:scale-105 cursor-pointer"
          >
            Read My Journey{" "}
            <span className="transition-transform group-hover/link:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      {/* Slide Navigation actions */}
      <div className="flex items-center justify-between w-full font-mono text-xs pt-2">
        <button
          onClick={() => setActiveTab((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
          className="px-5 py-2.5 border rounded-full bg-card hover:bg-secondary hover:text-accent hover:border-accent/40 transition-all cursor-pointer font-bold shadow-sm hover:scale-105 duration-200"
        >
          ← Prev
        </button>
        <div className="flex gap-1.5">
          {slides.map((_, idx) => (
            <button key={idx} onClick={() => setActiveTab(idx)} className="p-1 focus:outline-none">
              <span
                className={`block size-2.5 rounded-full transition-all ${
                  activeTab === idx
                    ? "bg-accent w-5"
                    : "bg-muted-foreground/35 hover:bg-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
        <button
          onClick={() => setActiveTab((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
          className="px-5 py-2.5 border rounded-full bg-card hover:bg-secondary hover:text-accent hover:border-accent/40 transition-all cursor-pointer font-bold shadow-sm hover:scale-105 duration-200"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function ProjectBlueprint({ slug }: { slug: string }) {
  if (slug === "lumen") {
    return (
      <svg
        className="absolute inset-0 size-full opacity-45 group-hover/project:opacity-85 transition-opacity duration-500 pointer-events-none"
        viewBox="0 0 400 250"
        fill="none"
        stroke="currentColor"
      >
        {/* Tech Grid */}
        <path
          d="M 0,25 H 400 M 0,75 H 400 M 0,125 H 400 M 0,175 H 400 M 0,225 H 400"
          strokeWidth="0.5"
          stroke="var(--color-accent)"
          strokeDasharray="3 6"
          opacity="0.2"
        />
        <path
          d="M 50,0 V 250 M 150,0 V 250 M 250,0 V 250 M 350,0 V 250"
          strokeWidth="0.5"
          stroke="var(--color-accent)"
          strokeDasharray="3 6"
          opacity="0.2"
        />

        {/* Card Deck Wireframe */}
        <rect
          x="100"
          y="60"
          width="200"
          height="130"
          rx="8"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          className="animate-pulse"
        />
        <rect
          x="110"
          y="50"
          width="180"
          height="10"
          rx="2"
          stroke="var(--color-accent)"
          strokeWidth="1"
          opacity="0.6"
        />
        <rect
          x="120"
          y="40"
          width="160"
          height="10"
          rx="2"
          stroke="var(--color-accent)"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Core elements */}
        <line x1="120" y1="90" x2="280" y2="90" stroke="var(--color-accent)" strokeWidth="1.5" />
        <line x1="120" y1="110" x2="240" y2="110" stroke="var(--color-accent)" strokeWidth="1" />
        <line x1="120" y1="130" x2="260" y2="130" stroke="var(--color-accent)" strokeWidth="1" />

        {/* Link / Swipe arrows */}
        <path
          d="M 320,125 L 340,125 M 335,120 L 340,125 L 335,130"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="340"
          cy="125"
          r="8"
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />

        {/* Text summaries nodes */}
        <circle cx="125" cy="160" r="4" fill="var(--color-accent)" />
        <circle cx="165" cy="160" r="4" fill="var(--color-accent)" opacity="0.6" />
        <circle cx="205" cy="160" r="4" fill="var(--color-accent)" opacity="0.3" />
      </svg>
    );
  }

  if (slug === "effortless") {
    return (
      <svg
        className="absolute inset-0 size-full opacity-45 group-hover/project:opacity-85 transition-opacity duration-500 pointer-events-none"
        viewBox="0 0 400 250"
        fill="none"
        stroke="currentColor"
      >
        {/* Tech Grid */}
        <path
          d="M 0,25 H 400 M 0,75 H 400 M 0,125 H 400 M 0,175 H 400 M 0,225 H 400"
          strokeWidth="0.5"
          stroke="var(--color-accent)"
          strokeDasharray="3 6"
          opacity="0.2"
        />
        <path
          d="M 50,0 V 250 M 150,0 V 250 M 250,0 V 250 M 350,0 V 250"
          strokeWidth="0.5"
          stroke="var(--color-accent)"
          strokeDasharray="3 6"
          opacity="0.2"
        />

        {/* Certificate Frame */}
        <rect
          x="80"
          y="40"
          width="240"
          height="170"
          rx="4"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        <rect
          x="90"
          y="50"
          width="220"
          height="150"
          stroke="var(--color-accent)"
          strokeWidth="0.75"
          strokeDasharray="2 2"
        />

        {/* Sealed stamp */}
        <circle
          cx="270"
          cy="160"
          r="22"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          className="animate-spin"
          style={{ transformOrigin: "270px 160px", animationDuration: "12s" }}
          strokeDasharray="4 4"
        />
        <circle cx="270" cy="160" r="16" stroke="var(--color-accent)" strokeWidth="1" />
        <path
          d="M 264,160 L 276,160 M 270,154 L 270,166"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />

        {/* Lines */}
        <line x1="110" y1="80" x2="220" y2="80" stroke="var(--color-accent)" strokeWidth="2" />
        <line x1="110" y1="105" x2="290" y2="105" stroke="var(--color-accent)" strokeWidth="1" />
        <line x1="110" y1="125" x2="250" y2="125" stroke="var(--color-accent)" strokeWidth="1" />
        <line x1="110" y1="145" x2="210" y2="145" stroke="var(--color-accent)" strokeWidth="1" />

        {/* Verifier loop badge */}
        <path
          d="M 200,185 Q 240,210 280,185"
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
      </svg>
    );
  }

  if (slug === "medconnect") {
    return (
      <svg
        className="absolute inset-0 size-full opacity-45 group-hover/project:opacity-85 transition-opacity duration-500 pointer-events-none"
        viewBox="0 0 400 250"
        fill="none"
        stroke="currentColor"
      >
        {/* Tech Grid */}
        <path
          d="M 0,25 H 400 M 0,75 H 400 M 0,125 H 400 M 0,175 H 400 M 0,225 H 400"
          strokeWidth="0.5"
          stroke="var(--color-accent)"
          strokeDasharray="3 6"
          opacity="0.2"
        />
        <path
          d="M 50,0 V 250 M 150,0 V 250 M 250,0 V 250 M 350,0 V 250"
          strokeWidth="0.5"
          stroke="var(--color-accent)"
          strokeDasharray="3 6"
          opacity="0.2"
        />

        {/* Dispenser Carousel */}
        <circle
          cx="200"
          cy="125"
          r="65"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          className="animate-spin"
          style={{ transformOrigin: "200px 125px", animationDuration: "25s" }}
        />
        <circle cx="200" cy="125" r="45" stroke="var(--color-accent)" strokeWidth="1" />
        <circle cx="200" cy="125" r="5" fill="var(--color-accent)" />

        {/* Slots */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 200 + 15 * Math.cos(rad);
          const y1 = 125 + 15 * Math.sin(rad);
          const x2 = 200 + 45 * Math.cos(rad);
          const y2 = 125 + 45 * Math.sin(rad);
          return (
            <line
              key={angle}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--color-accent)"
              strokeWidth="1"
              opacity="0.7"
            />
          );
        })}

        {/* stepper motor diagram in bottom corner */}
        <rect
          x="40"
          y="160"
          width="60"
          height="50"
          rx="2"
          stroke="var(--color-accent)"
          strokeWidth="1"
        />
        <circle
          cx="70"
          cy="185"
          r="10"
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <line
          x1="70"
          y1="185"
          x2="200"
          y2="125"
          stroke="var(--color-accent)"
          strokeWidth="0.75"
          opacity="0.4"
          strokeDasharray="4 4"
        />

        {/* Telemetry Wave */}
        <path
          d="M 300,60 Q 320,40 340,60 T 380,60"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          className="animate-pulse"
        />
      </svg>
    );
  }

  // Fallback Generic System Blueprint (Code Editor + Graph Nodes)
  return (
    <svg
      className="absolute inset-0 size-full opacity-45 group-hover/project:opacity-85 transition-opacity duration-500 pointer-events-none"
      viewBox="0 0 400 250"
      fill="none"
      stroke="currentColor"
    >
      {/* Tech Grid */}
      <path
        d="M 0,25 H 400 M 0,75 H 400 M 0,125 H 400 M 0,175 H 400 M 0,225 H 400"
        strokeWidth="0.5"
        stroke="var(--color-accent)"
        strokeDasharray="3 6"
        opacity="0.2"
      />
      <path
        d="M 50,0 V 250 M 150,0 V 250 M 250,0 V 250 M 350,0 V 250"
        strokeWidth="0.5"
        stroke="var(--color-accent)"
        strokeDasharray="3 6"
        opacity="0.2"
      />

      {/* Code Editor Window */}
      <rect
        x="80"
        y="50"
        width="240"
        height="150"
        rx="6"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
      />
      <line x1="80" y1="75" x2="320" y2="75" stroke="var(--color-accent)" strokeWidth="1" />

      {/* Window Controls */}
      <circle cx="100" cy="62" r="3" fill="var(--color-accent)" />
      <circle cx="110" cy="62" r="3" fill="var(--color-accent)" opacity="0.6" />
      <circle cx="120" cy="62" r="3" fill="var(--color-accent)" opacity="0.3" />

      {/* Brackets & Structured Lines */}
      <path
        d="M 120,105 L 110,120 L 120,135 M 280,105 L 290,120 L 280,135"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <line
        x1="140"
        y1="105"
        x2="230"
        y2="105"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        opacity="0.8"
      />
      <line
        x1="140"
        y1="120"
        x2="260"
        y2="120"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        opacity="0.8"
      />
      <line
        x1="140"
        y1="135"
        x2="190"
        y2="135"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        opacity="0.8"
      />
      <line
        x1="140"
        y1="150"
        x2="250"
        y2="150"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        opacity="0.8"
      />

      {/* Network / Spinning Gear Node */}
      <circle
        cx="310"
        cy="180"
        r="14"
        stroke="var(--color-accent)"
        strokeWidth="1"
        strokeDasharray="2 2"
        className="animate-spin"
        style={{ transformOrigin: "310px 180px", animationDuration: "16s" }}
      />
      <circle cx="310" cy="180" r="8" stroke="var(--color-accent)" strokeWidth="1" />
    </svg>
  );
}

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

interface ProjectCardProps {
  p: Project;
  idx: number;
  filteredLength: number;
}

function ProjectCard({ p, idx, filteredLength }: ProjectCardProps) {
  const [isActive, setIsActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = iconFor(p.slug);
  const reverse = idx % 2 === 1;

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      {
        threshold: 0.2, // trigger when 20% of the card is visible
        rootMargin: "-15% 0px -15% 0px", // focus on middle area of screen
      },
    );

    const currentCard = cardRef.current;
    if (currentCard) {
      observer.observe(currentCard);
    }

    return () => {
      if (currentCard) {
        observer.unobserve(currentCard);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative group/project transition-all duration-[800ms] ease-out transform ${
        isActive
          ? "scale-[1.015] opacity-100 translate-y-0"
          : "scale-[0.975] opacity-60 translate-y-8"
      }`}
      style={
        {
          "--color-accent": theme.colorValue,
        } as React.CSSProperties
      }
    >
      <div
        className={`relative rounded-3xl border p-6 md:p-10 transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
          isActive
            ? `${theme.accentBorder} bg-card/90 dark:bg-white/[0.03] shadow-[0_0_45px_${theme.glow}]`
            : `border-border/100 dark:border-white/10 bg-card/45 dark:bg-white/[0.01] shadow-sm ${theme.accentBorderHover} hover:shadow-[0_0_35px_${theme.glow}]`
        }`}
      >
        {/* Visual Cover: 3D Product Viewer (Left column) */}
        <div className={`lg:col-span-7 ${reverse ? "lg:order-2" : ""}`}>
          <ThreeDProductViewer>
            {p.liveUrl ? (
              <a
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative block aspect-[16/10] overflow-hidden rounded-2xl border bg-secondary/30 dark:bg-white/[0.02] shadow-md group/viewer cursor-pointer transition-all duration-500 ${isActive ? theme.accentBorder : "border-border/80 hover:border-accent/50"}`}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className={`absolute inset-0 size-full transition-transform duration-[1200ms] ease-out ${
                    p.slug === "medconnect"
                      ? `object-cover ${isActive ? "scale-[1.10]" : "scale-[1.02] group-hover/project:scale-[1.10]"}`
                      : `object-contain bg-secondary/20 dark:bg-black/40 ${isActive ? "scale-105" : "group-hover/project:scale-105"}`
                  }`}
                />
                <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
                <div
                  className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border ${theme.badgeBorder} ${theme.badgeBg} px-3.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest ${theme.badgeText} shadow-sm`}
                >
                  <Icon className="size-3" />
                  {categoryFor(p)[0] ?? "Build"}
                </div>
                <div
                  className={`absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-xs font-bold text-background shadow-lg transition-all duration-300 ${isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0 group-hover/project:translate-y-0 group-hover/project:opacity-100"}`}
                >
                  View Live <ArrowUpRight className="size-4" />
                </div>
              </a>
            ) : (
              <Link
                to="/projects/$slug"
                params={{ slug: p.slug }}
                className={`relative block aspect-[16/10] overflow-hidden rounded-2xl border bg-secondary/30 dark:bg-white/[0.02] shadow-md group/viewer cursor-pointer transition-all duration-500 ${isActive ? theme.accentBorder : "border-border/80 hover:border-accent/50"}`}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className={`absolute inset-0 size-full transition-transform duration-[1200ms] ease-out ${
                    p.slug === "medconnect"
                      ? `object-cover ${isActive ? "scale-[1.10]" : "scale-[1.02] group-hover/project:scale-[1.10]"}`
                      : `object-contain bg-secondary/20 dark:bg-black/40 ${isActive ? "scale-105" : "group-hover/project:scale-105"}`
                  }`}
                />
                <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
                <div
                  className={`absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border ${theme.badgeBorder} ${theme.badgeBg} px-3.5 py-1.5 font-mono text-[9px] font-bold uppercase tracking-widest ${theme.badgeText} shadow-sm`}
                >
                  <Icon className="size-3" />
                  {categoryFor(p)[0] ?? "Build"}
                </div>
                <div
                  className={`absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-xs font-bold text-background shadow-lg transition-all duration-300 ${isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0 group-hover/project:translate-y-0 group-hover/project:opacity-100"}`}
                >
                  View Details <ArrowUpRight className="size-4" />
                </div>
              </Link>
            )}
          </ThreeDProductViewer>
        </div>

        {/* Project Details: Content (Right column) */}
        <div className={`lg:col-span-5 space-y-6 ${reverse ? "lg:order-1" : ""}`}>
          <div className="space-y-3.5">
            <div className="flex items-center justify-between font-mono text-xs text-muted-foreground font-bold">
              <span>
                {String(idx + 1).padStart(2, "0")} / {String(filteredLength).padStart(2, "0")}
              </span>
              <span>{p.year}</span>
            </div>

            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              <span
                className={`bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}
              >
                {p.name}
              </span>
            </h3>

            <p className="text-lg md:text-xl font-bold text-foreground leading-snug tracking-tight">
              {p.tagline}
            </p>
          </div>

          {/* Problem info in summary */}
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

          {/* Metrics List */}
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

          {/* Validation Badge */}
          {p.badge && (
            <div className="border-t border-border/40 pt-4 flex items-center gap-2">
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground font-extrabold">
                Validation
              </span>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-sm">
                <Sparkles className="size-3.5 animate-pulse" />
                {p.badge}
              </div>
            </div>
          )}

          {/* Interactive Action Buttons */}
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
                  rel="noopener noreferrer"
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
}

function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!barRef.current) return;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (window.scrollY / totalScroll) * 100;
        barRef.current.style.width = `${progress}%`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 z-50 h-[3px] bg-gradient-to-r from-accent to-cyan-400 transition-all duration-100"
      style={{ width: "0%" }}
    />
  );
}

function Index() {
  // Projects filter
  const [projectFilter, setProjectFilter] = useState<Filter>("All");
  const featuredProjects = useMemo(() => projects.filter((p) => p.featured !== false), []);
  const filteredProjects = useMemo(
    () =>
      projectFilter === "All"
        ? featuredProjects
        : featuredProjects.filter((p) => categoryFor(p).includes(projectFilter)),
    [projectFilter, featuredProjects],
  );

  // Contact submit state
  const [contactSent, setContactSent] = useState(false);
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [bioFlipped, setBioFlipped] = useState(false);
  function handleContactSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setContactSent(true);
  }

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Samarth Kashyap",
            alternateName: "Samarth's Digital Canvas",
            url: "https://samarthkashyap.tech",
          }),
        }}
      />
      {/* Scroll Progress Line */}
      <ScrollProgressBar />

      {/* Floating Command Palette Trigger */}
      <MissionControl />

      <div className="relative overflow-x-hidden overflow-y-visible">
        {/* ───────── SECTION 1: HERO / THE ENGINEER IS THE HERO ───────── */}
        <section
          id="home"
          className="hero-spotlight relative overflow-x-hidden overflow-y-visible pt-3 pb-8 md:pt-4 md:pb-12 scroll-mt-20"
          onMouseMove={(e) => {
            const el = e.currentTarget;
            const r = el.getBoundingClientRect();
            el.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
            el.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
          }}
        >
          <div className="glow-orb top-20 left-10 size-[350px] bg-accent/15 dark:bg-accent/10" />
          <div className="glow-orb bottom-10 right-20 size-[400px] bg-cyan-400/10 dark:bg-cyan-500/5" />

          {/* Subtle background grids */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-grid mask-radial opacity-20 dark:opacity-15"
          />

          <div className="relative mx-auto max-w-[1500px] px-4 md:px-8 lg:px-12 xl:px-16">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-16 xl:gap-32">
              {/* Left Column: Clear Hook & Personal Details */}
              <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center min-w-0 overflow-visible">
                <span className="font-mono text-xs md:text-sm font-bold uppercase tracking-widest text-accent mb-4 pl-1">
                  TURNING IDEAS INTO WORKING SYSTEMS
                </span>

                <h1 className="text-6xl font-black leading-[1.05] tracking-tight md:text-8xl mb-6 pb-2 text-gradient hover:drop-shadow-[0_0_20px_color-mix(in_oklab,var(--color-accent)_40%,transparent)] transition-all duration-500 select-none">
                  Samarth Kashyap
                </h1>

                {/* Rotating / Moving Title Element */}
                <div className="font-mono text-xl md:text-2xl font-bold tracking-widest text-accent uppercase h-10 flex items-center pl-1 mb-8">
                  <Typewriter
                    words={[
                      "Software Engineer",
                      "AI Applications",
                      "Backend Engineer",
                      "Product Builder",
                    ]}
                  />
                </div>

                {/* Clean modern info capsules (Moved from footer) */}
                <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 text-[11px] sm:text-xs font-mono overflow-visible w-full">
                  <span className="flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full border border-emerald-500/30 dark:border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-500/15 px-3 py-1.5 font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 hover:scale-105 hover:-translate-y-0.5 transition-all cursor-default select-none shadow-[0_0_8px_rgba(16,185,129,0.12)] hover:shadow-[0_0_14px_rgba(16,185,129,0.25)]">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                    </span>
                    Patent Holder
                  </span>
                  <span className="group flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full border border-border/80 dark:border-white/20 bg-card dark:bg-white/5 px-3 py-1.5 font-bold text-foreground hover:border-accent/50 hover:text-accent hover:bg-accent/5 hover:scale-105 hover:-translate-y-0.5 transition-all cursor-default select-none shadow-sm hover:shadow-[0_0_10px_color-mix(in_oklab,var(--color-accent)_12%,transparent)]">
                    <Award className="size-3.5 text-accent transition-transform group-hover:rotate-12" />
                    AI Systems
                  </span>
                  <span className="group flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full border border-border/80 dark:border-white/20 bg-card dark:bg-white/5 px-3 py-1.5 font-bold text-foreground hover:border-accent/50 hover:text-accent hover:bg-accent/5 hover:scale-105 hover:-translate-y-0.5 transition-all cursor-default select-none shadow-sm hover:shadow-[0_0_10px_color-mix(in_oklab,var(--color-accent)_12%,transparent)]">
                    <BookOpen className="size-3.5 text-accent transition-transform group-hover:-rotate-12" />
                    Full-Stack
                  </span>
                  <span className="group flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full border border-border/80 dark:border-white/20 bg-card dark:bg-white/5 px-3 py-1.5 font-bold text-foreground hover:border-accent/50 hover:text-accent hover:bg-accent/5 hover:scale-105 hover:-translate-y-0.5 transition-all cursor-default select-none shadow-sm hover:shadow-[0_0_10px_color-mix(in_oklab,var(--color-accent)_12%,transparent)]">
                    <Brain className="size-3.5 text-accent transition-transform group-hover:scale-110" />
                    MSc @ RPTU
                  </span>
                  <span className="group flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full border border-border/80 dark:border-white/20 bg-card dark:bg-white/5 px-3 py-1.5 font-bold text-foreground hover:border-accent/50 hover:text-accent hover:bg-accent/5 hover:scale-105 hover:-translate-y-0.5 transition-all cursor-default select-none shadow-sm hover:shadow-[0_0_10px_color-mix(in_oklab,var(--color-accent)_12%,transparent)]">
                    <span className="text-accent transition-transform group-hover:scale-125">
                      ●
                    </span>
                    🇩🇪 Germany
                  </span>
                </div>

                {/* Flip Bio Card */}
                <div
                  className="flip-card mt-4 mb-4 w-full md:w-[680px] max-w-[90vw] h-[130px] cursor-pointer select-none transition-all duration-300 hover:scale-[1.015] hover:drop-shadow-[0_0_12px_color-mix(in_oklab,var(--color-accent)_15%,transparent)]"
                  onClick={() => setBioFlipped((f) => !f)}
                  title="Click to flip"
                >
                  <div className={`flip-card-inner h-full ${bioFlipped ? "flipped" : ""}`}>
                    {/* Front: Bio text */}
                    <div className="flip-card-front bio-glow-front h-full rounded-2xl border border-border/80 dark:border-white/20 bg-secondary/40 dark:bg-white/[0.05] p-5 shadow-lg backdrop-blur-sm flex flex-col justify-between">
                      <p className="text-base md:text-lg leading-relaxed text-muted-foreground text-pretty">
                        I like building things that start as{" "}
                        <span className="font-semibold text-pink-500 dark:text-pink-400">
                          side projects
                        </span>{" "}
                        and end up solving{" "}
                        <span className="font-semibold text-emerald-500 dark:text-emerald-400">
                          real problems
                        </span>
                        .
                      </p>
                      <span className="block text-[7px] font-mono text-muted-foreground/45 uppercase tracking-widest">
                        flip ↩
                      </span>
                    </div>
                    {/* Back: Second text */}
                    <div className="flip-card-back bio-glow-back h-full rounded-2xl border border-border/80 dark:border-white/20 bg-secondary/40 dark:bg-white/[0.05] p-5 shadow-lg backdrop-blur-sm flex flex-col justify-between">
                      <p className="text-base md:text-lg leading-relaxed text-muted-foreground text-pretty">
                        Based in{" "}
                        <span className="font-semibold text-blue-500 dark:text-blue-400">
                          Germany
                        </span>
                        , originally from{" "}
                        <span className="font-semibold text-pink-500 dark:text-pink-400">
                          India
                        </span>
                        . Still{" "}
                        <span className="font-semibold text-blue-500 dark:text-blue-400">
                          learning
                        </span>
                        , still{" "}
                        <span className="font-semibold text-pink-500 dark:text-pink-400">
                          building
                        </span>
                        , still{" "}
                        <span className="font-semibold text-emerald-500 dark:text-emerald-400">
                          shipping
                        </span>
                        .
                      </p>
                      <span className="block text-[7px] font-mono text-muted-foreground/45 uppercase tracking-widest">
                        flip ↩
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Triggers */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Magnetic>
                    <a
                      href="#projects"
                      className="group inline-flex items-center gap-2.5 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-all hover:bg-accent hover:text-accent-foreground shadow-lg hover:shadow-[0_0_25px_color-mix(in_oklab,var(--color-accent)_50%,transparent)]"
                    >
                      View Work
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </Magnetic>
                  <Magnetic>
                    <button
                      onClick={() => setShowJourneyModal(true)}
                      className="group inline-flex items-center gap-2.5 rounded-full border border-foreground/20 dark:border-white/20 px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-accent/60 hover:text-accent hover:bg-accent/5 shadow-sm hover:shadow-[0_0_20px_color-mix(in_oklab,var(--color-accent)_25%,transparent)] cursor-pointer"
                    >
                      60-Second Journey
                      <Activity className="size-3.5 transition-transform group-hover:scale-110" />
                    </button>
                  </Magnetic>
                  <Magnetic>
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full border border-foreground/20 dark:border-white/20 px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:border-accent/60 hover:text-accent hover:bg-accent/5 shadow-sm hover:shadow-[0_0_20px_color-mix(in_oklab,var(--color-accent)_25%,transparent)]"
                      title="Download Resume"
                    >
                      Resume
                      <ExternalLink className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </Magnetic>
                </div>
              </div>

              {/* Right Column: Samarth.OS Core Interactive Canvas */}
              <div className="relative mx-auto w-full lg:col-span-5 lg:col-start-7 lg:ml-12 xl:ml-20 lg:max-w-none">
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-accent to-cyan-400 opacity-20 blur-lg transition-opacity duration-500 dark:opacity-30" />
                <SamarthOSCanvas />
              </div>
            </div>
          </div>
        </section>

        {/* 60s Journey Fullscreen Modal */}
        {showJourneyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-entrance">
            <div className="w-full max-w-4xl rounded-3xl border border-accent/40 bg-card p-6 md:p-8 shadow-[0_0_50px_color-mix(in_oklab,var(--color-accent)_25%,transparent)] dark:shadow-[0_0_60px_color-mix(in_oklab,var(--color-accent)_35%,transparent)] relative">
              <button
                onClick={() => setShowJourneyModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground font-mono text-sm"
              >
                [close]
              </button>
              <MicroLabel>Overview</MicroLabel>
              <h3 className="text-3xl font-extrabold tracking-tight mt-2 mb-6 text-gradient">
                60-Second Journey Summary
              </h3>
              <JourneyStory />
            </div>
          </div>
        )}

        {/* ───────── SECTION 2: ABOUT ME ───────── */}
        <section id="journey" className="relative border-t border-border py-20 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            {/* Main Boxed Layout */}
            <div className="rounded-3xl border border-border/100 dark:border-accent/30 bg-card/75 dark:bg-white/[0.03] backdrop-blur-xl p-8 md:p-12 shadow-[0_0_50px_color-mix(in_oklab,var(--color-accent)_12%,transparent)] hover:shadow-[0_0_70px_color-mix(in_oklab,var(--color-accent)_25%,transparent)] hover:border-accent/40 dark:hover:border-accent/50 transition-all duration-500 relative overflow-hidden space-y-16 group/about">
              {/* Ambient Background Orbs inside the box */}
              <div className="absolute top-0 right-0 size-[350px] bg-gradient-to-tr from-accent/15 to-purple-500/5 rounded-full blur-[90px] pointer-events-none animate-pulse duration-[8000ms]" />
              <div className="absolute bottom-0 left-0 size-[350px] bg-gradient-to-tr from-cyan-500/15 to-teal-500/5 rounded-full blur-[90px] pointer-events-none animate-pulse duration-[10000ms]" />
              <div className="absolute top-1/2 left-1/3 size-[250px] bg-pink-500/10 rounded-full blur-[80px] pointer-events-none animate-pulse duration-[12000ms]" />

              {/* Row 1: Photo & About Headline / Narrative */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 relative z-10 items-start">
                {/* Left Column: Photo & Details */}
                <div className="md:col-span-4 lg:col-span-3 flex flex-col items-center md:items-start space-y-4">
                  <div className="relative group">
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 opacity-30 blur-md transition-all duration-700 group-hover:opacity-75 group-hover:blur-lg animate-[text-shimmer_6s_linear_infinite]" />
                    <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 opacity-20 transition-all duration-700 group-hover:opacity-50" />
                    <div className="relative size-44 md:size-52 overflow-hidden rounded-2xl border border-border/40 shadow-xl dark:border-white/10">
                      <img
                        src={portrait}
                        alt="Samarth Kashyap"
                        className="size-full object-cover object-[60%_10%] transition-all duration-300 scale-[1.7] origin-[30%_0%] group-hover:scale-[1.95]"
                      />
                    </div>
                  </div>
                  <div className="text-center md:text-left w-full space-y-2.5 pt-1">
                    <h3 className="text-xl font-bold text-foreground">Samarth Kashyap</h3>
                    <div className="flex flex-col gap-2.5 w-full pt-2">
                      {[
                        {
                          label: "Started Building",
                          value: "2017",
                          color: "bg-cyan-500",
                          glow: "shadow-[0_0_8px_#06b6d4]",
                          hoverClass:
                            "hover:border-cyan-500/40 dark:hover:border-cyan-400/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:bg-cyan-500/5 dark:hover:bg-cyan-400/5",
                        },
                        {
                          label: "Current Focus",
                          value: "Systems & Products",
                          color: "bg-accent",
                          glow: "shadow-[0_0_8px_var(--color-accent)]",
                          hoverClass:
                            "hover:border-accent/40 dark:hover:border-accent/30 hover:shadow-[0_0_15px_color-mix(in_oklab,var(--color-accent)_20%,transparent)] hover:bg-accent/5 dark:hover:bg-accent/5",
                        },
                        {
                          label: "Long-Term Goal",
                          value: "Build a Technology Company",
                          color: "bg-purple-500",
                          glow: "shadow-[0_0_8px_#c084fc]",
                          hoverClass:
                            "hover:border-purple-500/40 dark:hover:border-purple-400/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:bg-purple-500/5 dark:hover:bg-purple-400/5",
                        },
                        {
                          label: "Currently Exploring",
                          value: "AI, Retrieval Systems & Product Development",
                          color: "bg-pink-500",
                          glow: "shadow-[0_0_8px_#f472b6]",
                          hoverClass:
                            "hover:border-pink-500/40 dark:hover:border-pink-400/30 hover:shadow-[0_0_15px_rgba(244,114,182,0.15)] hover:bg-pink-500/5 dark:hover:bg-pink-400/5",
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className={`group/item flex items-center gap-3 rounded-xl border border-border/50 dark:border-white/5 bg-secondary/20 dark:bg-white/[0.01] p-3 transition-all duration-300 hover:scale-[1.02] cursor-default select-none shadow-sm ${item.hoverClass}`}
                        >
                          <span
                            className={`size-2 rounded-full ${item.color} ${item.glow} shrink-0 group-hover/item:scale-125 transition-transform duration-300`}
                          />
                          <div className="text-[10.5px] font-mono leading-none">
                            <span className="text-muted-foreground/80 block mb-0.5 text-left">
                              {item.label}
                            </span>
                            <span className="text-foreground font-bold text-left block mt-0.5">
                              {item.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: StoryDeck Interactive Narrative Hook */}
                <div className="md:col-span-8 lg:col-span-9">
                  <StoryDeck />
                </div>
              </div>

              {/* Row 2: Cards 1, 2, 3 spanning full width */}
              <div className="relative z-10">
                <AboutMeTransitionCards />
              </div>

              {/* Premium Glowing Personal Message Section (Anchor) */}
              <div className="relative z-10 p-6 md:p-8 flex flex-col items-start justify-start text-left w-full space-y-3 rounded-2xl border border-border/80 dark:border-white/10 bg-secondary/30 dark:bg-white/[0.01] hover:border-accent/40 transition-all duration-500 overflow-hidden shadow-inner group/quote">
                {/* Glowing animated backdrop */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-cyan-500/5 to-pink-500/5 opacity-75 group-hover/quote:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute -top-12 -left-12 size-40 bg-accent/10 rounded-full blur-2xl group-hover/quote:scale-110 transition-transform duration-500" />
                <div className="absolute -bottom-12 -right-12 size-40 bg-cyan-500/10 rounded-full blur-2xl group-hover/quote:scale-110 transition-transform duration-500" />

                <div className="relative z-10 flex flex-col items-start space-y-3 w-full">
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-1.5 justify-start">
                    <Sparkles className="size-3.5 text-accent animate-pulse" /> Core Principle
                  </span>

                  {/* Blockquote with decorative large quote markers */}
                  <blockquote className="text-lg md:text-2xl font-serif text-foreground dark:text-white italic leading-relaxed tracking-wide relative pl-8 select-none text-left w-full">
                    <span className="absolute left-0 -top-2 text-5xl md:text-6xl text-accent/30 dark:text-accent/40 font-serif leading-none select-none">
                      “
                    </span>
                    <span className="relative z-10">
                      Curiosity got me into engineering. Building things keeps me here. AI helps me
                      move faster, but the motivation remains the same:{" "}
                      <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent font-semibold dark:from-pink-400 dark:via-purple-400 dark:to-cyan-400">
                        understand problems deeply and build useful solutions
                      </span>
                      .
                    </span>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── SECTION 3: FEATURED PROJECTS ───────── */}
        <section
          id="projects"
          className="relative border-t border-border py-20 scroll-mt-20 bg-secondary/15"
        >
          <div className="relative mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="text-center md:text-left">
                <MicroLabel>Innovator Showcase</MicroLabel>
                <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl text-foreground dark:text-white">
                  Featured Builds.
                </h2>
                <p className="mt-4 max-w-xl text-base text-muted-foreground">
                  A deep dive into selected systems constructed from bare ideas.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-border bg-card/65 p-1 backdrop-blur-md self-center md:self-end">
                {FILTERS.map((f) => {
                  const active = projectFilter === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setProjectFilter(f)}
                      className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? "bg-foreground text-background shadow-md"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-24">
              {filteredProjects.map((p, idx) => (
                <ProjectCard
                  key={p.slug}
                  p={p}
                  idx={idx}
                  filteredLength={filteredProjects.length}
                />
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2.5 rounded-full border border-foreground/20 dark:border-white/20 bg-card dark:bg-white/5 px-8 py-3.5 text-sm font-bold text-foreground transition-all hover:border-accent hover:text-accent hover:shadow-[0_0_25px_rgba(139,92,246,0.25)] hover:scale-105"
              >
                View More Projects
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ───────── SECTION 4: CAPABILITIES & SYSTEM PLAYGROUND ───────── */}
        <section id="skills" className="relative border-t border-border py-20 scroll-mt-20">
          <div className="relative mx-auto max-w-7xl px-4 md:px-8 space-y-28 md:space-y-36">
            {/* From Problem to Production (Interactive System Graph) */}
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-3xl font-extrabold tracking-tight text-foreground dark:text-white md:text-4xl">
                  From Problem to Production
                </h3>
                <p className="text-base text-muted-foreground max-w-xl mx-auto">
                  A practical view of how I approach engineering problems.
                </p>
              </div>
              <InteractiveHeroGraph />
            </div>

            {/* Technology Stack Marquee */}
            <div className="space-y-8">
              <div className="text-center">
                <MicroLabel>Capabilities</MicroLabel>
                <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl text-foreground dark:text-white">
                  Technology Stack
                </h2>
              </div>
              <SkillsMarquee />
            </div>
          </div>
        </section>

        {/* ───────── SECTION 7: PROFESSIONAL EXPERIENCE ───────── */}
        <section
          id="experience"
          className="relative border-t border-border py-20 scroll-mt-20 bg-secondary/15"
        >
          <div className="relative mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-16 text-center">
              <MicroLabel>Career Path</MicroLabel>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl text-foreground dark:text-white">
                My Journey
              </h2>
              <p className="mt-4 mx-auto max-w-xl text-base text-muted-foreground">
                Places where I have applied my skills.
              </p>
            </div>

            {/* Glowing background blobs (Increased intensity and contrast) */}
            <div className="absolute left-[15%] top-[25%] -z-10 size-[350px] rounded-full bg-accent/18 blur-[90px] pointer-events-none animate-pulse" />
            <div className="absolute right-[15%] bottom-[25%] -z-10 size-[350px] rounded-full bg-cyan-500/18 blur-[90px] pointer-events-none animate-pulse" />

            {/* Vertical Editorial Timeline */}
            <ExperienceTimeline />
          </div>
        </section>

        {/* ───────── SECTION 8: BEYOND CODE ───────── */}
        <section id="beyond" className="relative border-t border-border py-20 scroll-mt-20">
          <div className="relative mx-auto max-w-7xl px-4 md:px-8">
            {/* Section header */}
            <div className="mb-14 text-center">
              <MicroLabel>Beyond Code</MicroLabel>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl text-foreground dark:text-white">
                Beyond Code.
              </h2>
              <p className="mt-4 mx-auto max-w-xl text-base text-muted-foreground">
                Patents, competitions, leadership — the full picture of what drives me.
              </p>
            </div>

            {/* 2-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top 4 achievement cards */}
              {BEYOND_CARDS.map((card) => (
                <BeyondCard key={card.id} card={card} />
              ))}

              {/* GitHub heatmap — spans full width */}
              <div className="md:col-span-2 relative">
                {/* Subtle label */}
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    Open Source · GitHub Activity
                  </span>
                  <div className="flex-1 h-px bg-accent/25" />
                </div>
                <GitHubHeatmap compact />
              </div>
            </div>
          </div>
        </section>
        {/*------Include Section : Blogs here if you want----------*/}

        {/* ───────── SECTION 9: AI CLONE CHAT ───────── */}
        <section
          id="chat"
          className="relative border-t border-violet-500/25 dark:border-violet-500/20 py-20 scroll-mt-20 bg-secondary/10"
        >
          <div className="relative mx-auto max-w-3xl px-4 md:px-8">
            <div className="text-center space-y-4 mb-10">
              <MicroLabel>Cloned intelligence</MicroLabel>
              <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl text-foreground dark:text-white">
                Interactive Knowledge Base
              </h2>
              <p className="mx-auto max-w-xl text-base text-muted-foreground">
                Ask about projects, experience, research, or technologies I've worked with.
              </p>
            </div>
            <div className="animate-entrance">
              <ChatWindow variant="page" />
            </div>
          </div>
        </section>

        {/* ───────── SECTION 10: CONTACT ───────── */}
        <section
          id="contact"
          className="relative border-t border-border py-28 md:py-36 scroll-mt-20 overflow-hidden"
        >
          {/* ── Animated Aurora Background ── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute -top-40 -left-20 size-[500px] rounded-full bg-violet-600/20 blur-[160px] animate-pulse"
              style={{ animationDuration: "6s" }}
            />
            <div
              className="absolute top-1/2 -right-32 size-[400px] rounded-full bg-fuchsia-500/15 blur-[140px] animate-pulse"
              style={{ animationDuration: "8s", animationDelay: "2s" }}
            />
            <div
              className="absolute -bottom-32 left-1/3 size-[450px] rounded-full bg-indigo-500/15 blur-[150px] animate-pulse"
              style={{ animationDuration: "7s", animationDelay: "4s" }}
            />
            <div
              className="absolute top-1/4 left-1/2 size-[300px] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse"
              style={{ animationDuration: "9s", animationDelay: "1s" }}
            />
          </div>

          {/* ── Subtle grid overlay ── */}
          <div className="absolute inset-0 bg-grid mask-radial opacity-20 pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-8">
            {/* ── Headline Block ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16 md:mb-20"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/15 border border-violet-500/40 px-4 py-1.5 mb-6">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-violet-300">
                  Available for Opportunities
                </span>
              </div>

              <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                  Let's Build
                </span>
                <br />
                <span className="text-foreground dark:text-white">Something Together</span>
              </h2>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Whether it's a project idea, a job opportunity, or just a conversation about tech —
                I'd love to hear from you.
              </p>
            </motion.div>

            {/* ── Contact Method Cards ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14"
            >
              {/* Email Card */}
              <a
                href={`mailto:${contact.email}`}
                className="group relative flex flex-col items-center text-center gap-4 rounded-2xl border border-violet-500/40 bg-violet-500/[0.06] backdrop-blur-xl p-6 transition-all duration-500 hover:border-violet-400/70 hover:bg-violet-500/[0.12] hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative flex size-14 items-center justify-center rounded-2xl bg-violet-500/20 border border-violet-500/45 group-hover:scale-110 group-hover:border-violet-400/70 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-500">
                  <Mail className="size-6 text-violet-400 group-hover:text-violet-300 transition-colors" />
                </div>
                <div className="relative z-10">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-violet-400/70 mb-1">
                    Email
                  </p>
                  <p className="text-sm font-semibold text-foreground/90 group-hover:text-violet-300 transition-colors truncate max-w-[180px]">
                    {contact.email}
                  </p>
                </div>
                <ArrowUpRight className="absolute top-4 right-4 size-4 text-violet-500/30 group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </a>

              {/* LinkedIn Card */}
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center text-center gap-4 rounded-2xl border border-blue-500/40 bg-blue-500/[0.06] backdrop-blur-xl p-6 transition-all duration-500 hover:border-blue-400/70 hover:bg-blue-500/[0.12] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative flex size-14 items-center justify-center rounded-2xl bg-blue-500/20 border border-blue-500/45 group-hover:scale-110 group-hover:border-blue-400/70 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-500">
                  <Linkedin className="size-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
                <div className="relative z-10">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-400/70 mb-1">
                    LinkedIn
                  </p>
                  <p className="text-sm font-semibold text-foreground/90 group-hover:text-blue-300 transition-colors">
                    samarthkashyap
                  </p>
                </div>
                <ArrowUpRight className="absolute top-4 right-4 size-4 text-blue-500/30 group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </a>

              {/* GitHub Card */}
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center text-center gap-4 rounded-2xl border border-slate-400/35 bg-slate-500/[0.06] backdrop-blur-xl p-6 transition-all duration-500 hover:border-slate-400/65 hover:bg-slate-500/[0.12] hover:shadow-[0_0_40px_rgba(148,163,184,0.25)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-slate-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative flex size-14 items-center justify-center rounded-2xl bg-slate-500/20 border border-slate-400/40 group-hover:scale-110 group-hover:border-slate-400/65 group-hover:shadow-[0_0_20px_rgba(148,163,184,0.3)] transition-all duration-500">
                  <Github className="size-6 text-slate-400 group-hover:text-slate-300 transition-colors" />
                </div>
                <div className="relative z-10">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400/70 mb-1">
                    GitHub
                  </p>
                  <p className="text-sm font-semibold text-foreground/90 group-hover:text-slate-300 transition-colors">
                    samarthkashyap03
                  </p>
                </div>
                <ArrowUpRight className="absolute top-4 right-4 size-4 text-slate-500/30 group-hover:text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </a>

              {/* Location Card */}
              <div className="group relative flex flex-col items-center text-center gap-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/[0.06] backdrop-blur-xl p-6 transition-all duration-500 hover:border-emerald-400/70 hover:bg-emerald-500/[0.12] hover:shadow-[0_0_40px_rgba(16,185,129,0.25)] hover:-translate-y-1 cursor-default">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative flex size-14 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/45 group-hover:scale-110 group-hover:border-emerald-400/70 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-500">
                  <MapPin className="size-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                </div>
                <div className="relative z-10">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400/70 mb-1">
                    Location
                  </p>
                  <p className="text-sm font-semibold text-foreground/90 group-hover:text-emerald-300 transition-colors">
                    {contact.location}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── Message Form Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative rounded-3xl border border-violet-500/30 bg-white/[0.03] backdrop-blur-2xl p-8 md:p-10 overflow-hidden shadow-[0_0_0_1px_rgba(139,92,246,0.1)]">
                {/* Form glow accents */}
                <div className="absolute -top-20 -right-20 size-60 rounded-full bg-violet-600/15 blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 size-60 rounded-full bg-fuchsia-600/10 blur-[100px] pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/25 to-fuchsia-500/25 border border-violet-500/50">
                      <Send className="size-5 text-violet-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground dark:text-white">
                        Send a Message
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        I'll get back to you within 24 hours.
                      </p>
                    </div>
                  </div>

                  {contactSent ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center"
                    >
                      <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30 mx-auto mb-4">
                        <CheckCircle className="size-7 text-emerald-400" />
                      </div>
                      <p className="text-lg font-bold text-foreground dark:text-white mb-1">
                        Message Sent!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Thanks for reaching out — I'll reply soon.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <label className="block space-y-2">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Your Name
                          </span>
                          <input
                            required
                            type="text"
                            placeholder="Jane Doe"
                            className="w-full rounded-xl border border-violet-500/25 bg-white/[0.04] px-4 py-3 text-sm text-foreground dark:text-white placeholder:text-muted-foreground/40 outline-none focus:border-violet-400/60 focus:bg-violet-500/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-400"
                          />
                        </label>
                        <label className="block space-y-2">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Your Email
                          </span>
                          <input
                            required
                            type="email"
                            placeholder="jane@company.com"
                            className="w-full rounded-xl border border-violet-500/25 bg-white/[0.04] px-4 py-3 text-sm text-foreground dark:text-white placeholder:text-muted-foreground/40 outline-none focus:border-violet-400/60 focus:bg-violet-500/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-400"
                          />
                        </label>
                      </div>
                      <label className="block space-y-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Message
                        </span>
                        <textarea
                          required
                          rows={5}
                          placeholder="Tell me about what you're building..."
                          className="w-full resize-none rounded-xl border border-violet-500/25 bg-white/[0.04] px-4 py-3 text-sm text-foreground dark:text-white placeholder:text-muted-foreground/40 outline-none focus:border-violet-400/60 focus:bg-violet-500/[0.06] focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-400"
                        />
                      </label>
                      <button
                        type="submit"
                        className="group/btn relative w-full rounded-xl px-6 py-3.5 text-sm font-bold text-white overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:-translate-y-0.5 cursor-pointer"
                      >
                        {/* Button gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 transition-opacity duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                        {/* Shimmer sweep */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Send className="size-4" />
                          Send Message
                        </span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}

const EXPERIENCE_THEMES: Record<
  string,
  {
    colorValue: string;
    glow: string;
    accentText: string;
    accentBorder: string;
    accentBorderHover: string;
    textGradient: string;
    pillActive: string;
  }
> = {
  targetgrid: {
    colorValue: "#f59e0b", // Amber
    glow: "rgba(245,158,11,0.18)",
    accentText: "text-amber-500 dark:text-amber-400",
    accentBorder: "border-amber-500/50 dark:border-amber-400/50",
    accentBorderHover: "hover:border-amber-500/60 dark:hover:border-amber-400/50",
    textGradient: "from-amber-500 to-rose-500 dark:from-amber-400 dark:to-rose-400",
    pillActive: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
  },
  aiensured: {
    colorValue: "#6366f1", // Indigo
    glow: "rgba(99,102,241,0.18)",
    accentText: "text-indigo-500 dark:text-indigo-400",
    accentBorder: "border-indigo-500/50 dark:border-indigo-400/50",
    accentBorderHover: "hover:border-indigo-500/60 dark:hover:border-indigo-400/50",
    textGradient:
      "from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400",
    pillActive: "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
  },
  jyothy: {
    colorValue: "#10b981", // Emerald
    glow: "rgba(16,185,129,0.18)",
    accentText: "text-emerald-500 dark:text-emerald-400",
    accentBorder: "border-emerald-500/50 dark:border-emerald-400/50",
    accentBorderHover: "hover:border-emerald-500/60 dark:hover:border-emerald-400/50",
    textGradient: "from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400",
    pillActive: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  },
};

export function ExperienceTimeline() {
  const [hoveredExp, setHoveredExp] = useState<string | null>(null);

  const lineGradientClass =
    hoveredExp === "targetgrid"
      ? "from-amber-400 via-rose-400 to-transparent"
      : hoveredExp === "aiensured"
        ? "from-indigo-400 via-purple-400 to-transparent"
        : hoveredExp === "jyothy"
          ? "from-emerald-400 via-teal-400 to-transparent"
          : "from-accent via-cyan-400 to-transparent";

  const timelineItems = [
    {
      id: "targetgrid",
      dateRange: "Sep 2024 – Feb 2025",
      location: "India",
      companyName: "Targetgrid",
      roleName: "Software Development Intern",
      bullets: [
        "Built Python automation to collect and process lead-gen data.",
        "Integrated third-party REST APIs to speed up pipelines.",
        "Developed web scrapers that cut operational effort.",
      ],
      skills: ["Python", "REST APIs", "Web Scraping", "Automation"],
      primarySkills: ["Python", "REST APIs"],
    },
    {
      id: "aiensured",
      dateRange: "Nov 2023 – Jan 2024",
      location: "Bengaluru, India",
      companyName: "AiEnsured",
      roleName: "Machine Learning Intern",
      bullets: [
        "Trained computer vision models for data classification.",
        "Conducted model testing & validation diagnostics.",
      ],
      skills: ["Computer Vision", "Model Validation", "Teachable Machine", "Testing"],
      primarySkills: ["Computer Vision", "Model Validation"],
    },
    {
      id: "jyothy",
      dateRange: "Jan 2023 – Mar 2023",
      location: "Bengaluru, India",
      companyName: "Jyothy Institute of Technology",
      roleName: "Technical Teaching Assistant & Student Mentor",
      bullets: [
        "Led and structured interactive coding bootcamps on Python fundamentals and Object-Oriented Programming (OOP).",
        "Conducted detailed code reviews and one-on-one mentorship sessions to guide a cohort of 30+ students.",
      ],
      skills: [
        "Python Workshops",
        "OOP Architecture",
        "Code Quality Reviews",
        "Student Mentorship",
      ],
      primarySkills: ["Python Workshops", "OOP Architecture"],
    },
  ];

  return (
    <div className="relative max-w-4xl mx-auto pl-8 md:pl-12 space-y-12">
      {/* Timeline Vertical Connector Line (Brightened glowing fiber line) */}
      <div
        className={`absolute left-[7px] top-10 bottom-10 w-0.5 bg-gradient-to-b ${lineGradientClass} opacity-40 blur-sm pointer-events-none transition-all duration-500`}
      />
      <div
        className={`absolute left-[7px] top-10 bottom-10 w-0.5 bg-gradient-to-b ${lineGradientClass} pointer-events-none transition-all duration-500`}
      />

      {timelineItems.map((item) => {
        const theme = EXPERIENCE_THEMES[item.id];
        const isCurrentHovered = hoveredExp === item.id;

        return (
          <div
            key={item.id}
            className="relative group select-none"
            onMouseEnter={() => setHoveredExp(item.id)}
            onMouseLeave={() => setHoveredExp(null)}
          >
            {/* Timeline Node Point (Brightened pulsing halo) */}
            <div className="absolute -left-[30px] md:-left-[46px] top-8 flex items-center justify-center z-10">
              <div
                className={`absolute size-5 rounded-full animate-ping opacity-75 transition-all duration-300 pointer-events-none ${
                  isCurrentHovered ? "opacity-100" : "opacity-0"
                }`}
                style={{ backgroundColor: theme.colorValue }}
              />
              <div
                className={`size-3.5 rounded-full border-2 bg-background shadow-md transition-all duration-300 ${
                  isCurrentHovered ? "scale-125" : "border-accent"
                }`}
                style={{
                  borderColor: isCurrentHovered ? theme.colorValue : undefined,
                  boxShadow: isCurrentHovered ? `0 0 12px ${theme.colorValue}` : undefined,
                }}
              />
            </div>

            <div
              className={`group relative rounded-3xl border p-8 transition-all duration-500 backdrop-blur-xl ${
                isCurrentHovered
                  ? `${theme.accentBorder} bg-card/95 dark:bg-black/50`
                  : "border-violet-500/35 dark:border-violet-400/30 bg-card/90 dark:bg-black/40 hover:border-violet-400/50"
              }`}
              style={{
                boxShadow: isCurrentHovered
                  ? `0 0 45px ${theme.glow}, 0 0 0 1px ${theme.colorValue}33`
                  : `0 0 20px rgba(139,92,246,0.08), inset 0 1px 0 rgba(139,92,246,0.06)`,
              }}
            >
              {/* Soft Radial Ambient Glow */}
              <div
                className={`absolute -inset-4 rounded-3xl opacity-0 transition-opacity duration-700 blur-2xl pointer-events-none ${
                  isCurrentHovered ? "opacity-100" : ""
                }`}
                style={{
                  background: `radial-gradient(circle at center, ${theme.glow}, transparent 70%)`,
                }}
              />

              <div className="flex items-center justify-between mb-4 relative z-10">
                <span
                  className={`font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-colors duration-300 ${
                    isCurrentHovered
                      ? theme.pillActive
                      : "bg-violet-500/15 border-violet-500/35 text-violet-400"
                  }`}
                >
                  {item.dateRange}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {item.location}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-foreground relative z-10 transition-colors">
                <span
                  className={
                    isCurrentHovered
                      ? `bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`
                      : ""
                  }
                >
                  {item.companyName}
                </span>
              </h3>
              <p className="text-sm font-semibold text-muted-foreground mb-6 relative z-10">
                {item.roleName}
              </p>

              <ul className="space-y-3.5 mb-8 relative z-10">
                {item.bullets.map((bullet, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3.5 text-sm text-foreground/85 leading-relaxed"
                  >
                    <ArrowUpRight
                      className={`size-3.5 mt-1 shrink-0 rotate-45 transition-all duration-300 ${
                        isCurrentHovered ? theme.accentText : "text-accent"
                      } group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-violet-500/25 dark:border-violet-400/20 relative z-10">
                {item.skills.map((skill) => {
                  const isPrimary = item.primarySkills.includes(skill);
                  return (
                    <span
                      key={skill}
                      className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border transition-all duration-300 ${
                        isCurrentHovered
                          ? isPrimary
                            ? theme.pillActive
                            : "text-foreground bg-secondary/80 border-border"
                          : isPrimary
                            ? "text-violet-400 bg-violet-500/15 border-violet-500/35"
                            : "text-cyan-400 bg-cyan-500/10 border-cyan-500/35"
                      }`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
