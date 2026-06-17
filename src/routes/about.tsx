import { Link, createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { motion } from "framer-motion";
import {
  Cpu,
  Award,
  MapPin,
  Globe,
  Sparkles,
  BookOpen,
  Clock,
  Users,
  GraduationCap,
  Code,
  ArrowLeft,
  Workflow,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  const timelineMilestones = [
    {
      year: "2017",
      title: "Started with Robotics",
      desc: "Began experimenting with Arduino boards and simple robots in 9th grade, sparking a lifelong interest in software.",
      icon: Cpu,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      glow: "shadow-[0_0_8px_rgba(139,92,246,0.5)]",
    },
    {
      year: "2021",
      title: "Building Communities",
      desc: "Co-founded the Entrepreneurship Club (EDC) at college and ran programming bootcamps for 30+ students.",
      icon: Users,
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
      glow: "shadow-[0_0_8px_rgba(244,114,182,0.5)]",
    },
    {
      year: "2025",
      title: "Improving Medicine Access",
      desc: "Built MedConnect, an automated medicine dispensing system that later received an Indian patent.",
      icon: Award,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      glow: "shadow-[0_0_8px_rgba(168,85,247,0.5)]",
    },
    {
      year: "2025",
      title: "Moved to Germany",
      desc: "Pursuing M.Sc. in Computer Science at RPTU Kaiserslautern to study software systems at scale.",
      icon: MapPin,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      glow: "shadow-[0_0_8px_rgba(6,182,212,0.5)]",
    },
    {
      year: "Present",
      title: "Built & Shipped Products",
      desc: "Shipped functional web platforms like Lumen and Effortless to solve real-world daily user problems.",
      icon: Globe,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      glow: "shadow-[0_0_8px_rgba(16,185,129,0.5)]",
    },
  ];

  return (
    <SiteShell>
      <div className="relative mx-auto max-w-5xl px-4 md:px-8 py-10 md:py-16 overflow-visible">
        {/* Ambient background glows */}
        <div className="glow-orb top-10 left-10 size-[300px] bg-accent/5 dark:bg-accent/10" />
        <div className="glow-orb bottom-20 right-10 size-[350px] bg-cyan-400/5 dark:bg-cyan-500/5" />

        {/* Back navigation button */}
        <div className="mb-8 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-accent hover:text-foreground transition-colors border border-accent/20 bg-accent/5 px-4 py-2 rounded-full shadow-sm hover:shadow-[0_0_15px_color-mix(in_oklab,var(--color-accent)_20%,transparent)] cursor-pointer"
          >
            <ArrowLeft className="size-3.5" /> Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start relative z-10">
          {/* Main Narrative Column (Memoir text) */}
          <div className="lg:col-span-8 space-y-10 font-sans">
            {/* Opening Statement */}
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-1.5">
                <Sparkles className="size-3.5 animate-pulse" /> My Story
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gradient leading-tight">
                Curiosity & Code
              </h1>
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono border-b border-border pb-4">
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" /> 4 min read
                </span>
                <span>·</span>
                <span>By Samarth Kashyap</span>
              </div>
            </div>

            {/* Immersive quote block */}
            <div className="relative p-6 md:p-8 rounded-2xl border border-accent/15 bg-accent/5 backdrop-blur-sm shadow-inner mt-4">
              <blockquote className="text-lg md:text-xl font-serif italic text-foreground leading-relaxed pl-6 relative">
                <span className="absolute left-0 top-0 text-5xl text-accent/25 font-serif leading-none select-none">
                  “
                </span>
                I didn't get interested in technology because of software. I got interested because
                I wanted to make things move. That curiosity started with Arduino boards, small
                robots, and countless evenings spent figuring out why something wasn't working.
              </blockquote>
            </div>

            {/* Memoir Chapters */}
            <div className="space-y-10 text-foreground/90 leading-relaxed text-base md:text-[17px]">
              {[
                {
                  chapter: "Chapter 1",
                  title: "Arduino, Robots & Curiosity",
                  icon: Cpu,
                  color: "text-violet-400",
                  bg: "bg-violet-500/10",
                  border: "border-violet-500/20",
                  glow: "from-violet-500/15 via-indigo-500/5 to-transparent",
                  hoverClass:
                    "hover:border-violet-500/40 dark:hover:border-violet-400/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:bg-secondary/20 dark:hover:bg-white/[0.03]",
                  lineGradient: "bg-gradient-to-b from-violet-500 to-indigo-500",
                  iconGlow: "shadow-[0_0_15px_rgba(139,92,246,0.25)]",
                  content: (
                    <>
                      <p>
                        It started in 9th grade with a cheap{" "}
                        <span className="text-violet-500 dark:text-violet-400 font-semibold">
                          Arduino kit
                        </span>
                        . The magic of writing code, uploading it, and watching a physical motor
                        turn or an LED blink was instant. I didn't care about abstract algorithms
                        yet—I just wanted to make things move.
                      </p>
                      <p className="mt-4">
                        By troubleshooting loose wires and writing basic loops, I learned to code
                        entirely by experimenting. That curiosity followed me to college, where I
                        built a{" "}
                        <span className="text-cyan-500 dark:text-cyan-400 font-semibold">
                          WiFi-controlled robotic arm
                        </span>{" "}
                        for the JITHACK hackathon (securing 3rd place) and competed internationally
                        at the Technoxian World Robotics Championship in New Delhi. The realization
                        was clear: software gives you the power to build anything from a blank page.
                      </p>
                    </>
                  ),
                },
                {
                  chapter: "Chapter 2",
                  title: "Building, Leading & Solving Problems",
                  icon: Users,
                  color: "text-pink-400",
                  bg: "bg-pink-500/10",
                  border: "border-pink-500/20",
                  glow: "from-pink-500/15 via-rose-500/5 to-transparent",
                  hoverClass:
                    "hover:border-pink-500/40 dark:hover:border-pink-400/30 hover:shadow-[0_0_30px_rgba(244,114,182,0.15)] hover:bg-secondary/20 dark:hover:bg-white/[0.03]",
                  lineGradient: "bg-gradient-to-b from-pink-500 to-rose-500",
                  iconGlow: "shadow-[0_0_15px_rgba(244,114,182,0.25)]",
                  content: (
                    <>
                      <p>
                        Engineering is lonely in isolation, so I focused on community. Finding no
                        technical startup body on campus, I co-founded the{" "}
                        <span className="text-purple-500 dark:text-purple-400 font-semibold">
                          EDC Club
                        </span>
                        , growing it to 60+ active student members. I also ran Python workshops for
                        juniors, discovering that teaching code is the best way to master it.
                      </p>
                      <p className="mt-4">
                        To solve real-world campus inefficiencies during my bachelors, I built a{" "}
                        <span className="text-violet-500 dark:text-violet-400 font-semibold">
                          VTU Results Automator
                        </span>
                        —a Python Selenium desktop application that fetched and analyzed university
                        exam results, saving department staff weeks of manual portal data entry.
                      </p>
                      <p className="mt-4">
                        In my 4th semester, my team decided to solve a larger issue: medicine access
                        in remote rural areas. We co-developed{" "}
                        <span className="text-pink-500 dark:text-pink-400 font-semibold">
                          MedConnect
                        </span>
                        —an autonomous, cloud-connected medicine dispensing kiosk. We spent
                        countless Sundays coding firmware, wiring stepper motors, and fixing
                        hardware failures. The system eventually secured institutional funding and
                        received a granted Indian patent. That project proved that dedication beats
                        raw resources every time.
                      </p>
                    </>
                  ),
                },
                {
                  chapter: "Chapter 3",
                  title: "Germany, Software & New Challenges",
                  icon: MapPin,
                  color: "text-cyan-400",
                  bg: "bg-cyan-500/10",
                  border: "border-cyan-500/20",
                  glow: "from-cyan-500/15 via-teal-500/5 to-transparent",
                  hoverClass:
                    "hover:border-cyan-500/40 dark:hover:border-cyan-400/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:bg-secondary/20 dark:hover:bg-white/[0.03]",
                  lineGradient: "bg-gradient-to-b from-cyan-500 to-teal-500",
                  iconGlow: "shadow-[0_0_15px_rgba(6,182,212,0.25)]",
                  content: (
                    <>
                      <p>
                        Driven to build software systems at scale, I moved 7,000 km to Germany in
                        late 2025 to pursue my{" "}
                        <span className="text-cyan-500 dark:text-cyan-400 font-semibold">
                          M.Sc. in Computer Science at RPTU Kaiserslautern
                        </span>
                        . Studying software engineering here has taught me how databases, networks,
                        and distributed systems behave under heavy production loads.
                      </p>
                      <p className="mt-4">
                        To stay sharp, I build and ship side projects directly to production:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-muted-foreground mt-4">
                        <li>
                          <strong className="text-foreground font-semibold">Lumen</strong>: An
                          AI-powered reading assistant that distills cluttered articles into
                          swipeable cards using pgvector vector search.
                        </li>
                        <li>
                          <strong className="text-foreground font-semibold">Effortless</strong>: A
                          privacy-first writing verification platform that tracks typing patterns
                          without saving document text.
                        </li>
                      </ul>
                      <p className="pt-6 mt-6 border-t border-border/40 italic font-medium text-foreground text-pretty">
                        My long-term ambition remains the same: to build a technology company of my
                        own. I love the act of creation, and I want to build products that solve
                        real problems alongside people who share that same curiosity.
                      </p>
                    </>
                  ),
                },
              ].map((c, idx) => {
                const ChapIcon = c.icon;
                return (
                  <motion.section
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: idx * 0.15 }}
                    className={`relative rounded-3xl border border-border/85 dark:border-white/10 bg-card/65 dark:bg-white/[0.02] p-6 md:p-8 transition-all duration-500 shadow-sm overflow-hidden group/chapter ${c.hoverClass}`}
                  >
                    {/* Left glowing border accent */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${c.lineGradient} opacity-60 group-hover/chapter:opacity-100 transition-all duration-300`}
                    />

                    {/* Glowing background card orb */}
                    <div
                      className={`absolute -right-20 -top-20 size-48 bg-gradient-to-tr ${c.glow} rounded-full blur-3xl pointer-events-none group-hover/chapter:scale-125 transition-all duration-700`}
                    />

                    {/* Chapter Header */}
                    <div className="flex items-center gap-3.5 mb-6 relative z-10">
                      <div
                        className={`p-2.5 rounded-xl bg-card border ${c.border} ${c.iconGlow} transition-all duration-300`}
                      >
                        <ChapIcon
                          className={`size-5.5 ${c.color} group-hover/chapter:scale-110 group-hover/chapter:brightness-110 transition-transform duration-300`}
                        />
                      </div>
                      <div className="text-left">
                        <span className="font-mono text-[11px] font-extrabold uppercase tracking-widest text-accent">
                          {c.chapter}
                        </span>
                        <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight mt-0.5">
                          {c.title}
                        </h3>
                      </div>
                    </div>

                    <div className="relative z-10 text-foreground/85 dark:text-foreground/90 font-medium">
                      {c.content}
                    </div>
                  </motion.section>
                );
              })}
            </div>
          </div>

          {/* Timeline Sidebar Column */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border bg-card/75 dark:bg-white/[0.02] p-6 shadow-md space-y-6 backdrop-blur-sm">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-1.5">
                <Workflow className="size-3.5 text-accent" /> Timeline Milestones
              </span>

              <div className="relative border-l border-border/70 pl-4 ml-2.5 space-y-6 text-xs leading-relaxed text-muted-foreground">
                {timelineMilestones.map((step) => {
                  const StepIcon = step.icon;
                  return (
                    <div
                      key={step.year}
                      className="relative group/step hover:-translate-y-0.5 transition-all duration-200 cursor-default"
                    >
                      {/* Timeline dot connector with matching glow */}
                      <span className="absolute -left-[22px] top-0.5 flex size-3 items-center justify-center rounded-full bg-card border border-accent/40 shadow-inner group-hover/step:scale-125 group-hover/step:border-accent transition-all duration-200">
                        <span
                          className={`size-1.5 rounded-full ${step.color.replace("text-", "bg-")} ${step.glow} transition-all duration-300`}
                        />
                      </span>

                      <div className="space-y-1">
                        <span
                          className={`font-mono text-[10px] font-extrabold tracking-wider ${step.color}`}
                        >
                          {step.year}
                        </span>
                        <h5 className="font-extrabold text-foreground text-[13px] flex items-center gap-1.5 transition-colors duration-200 group-hover/step:text-accent">
                          {step.title}
                        </h5>
                        <p className="text-[11px] text-muted-foreground/95 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-border/30 text-[10px] font-mono text-muted-foreground text-center">
                Samarth Kashyap · Digital Biography
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
