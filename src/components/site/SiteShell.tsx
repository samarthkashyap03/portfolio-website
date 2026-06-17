import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState, useRef, type ReactNode } from "react";
import { Sun, Moon, Github, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SKOS } from "./InteractiveComponents";

const navItems = [
  { hash: "home", label: "Home" },
  { hash: "journey", label: "About" },
  { hash: "projects", label: "Projects" },
  { hash: "skills", label: "Skills" },
  { hash: "experience", label: "Experience" },
  { hash: "beyond", label: "Beyond" },
  { hash: "chat", label: "Chat" },
  { hash: "contact", label: "Contact" },
] as const;

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setTheme(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center rounded-full p-2 text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="size-4 animate-entrance" />
      ) : (
        <Moon className="size-4 animate-entrance" />
      )}
    </button>
  );
}

export function SiteNav() {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  const isClickScrolling = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNavClick = (hash: string) => {
    setActiveSection(hash);
    isClickScrolling.current = true;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    // Set a timeout to re-enable observer after the smooth scroll finishes (approx 800ms)
    clickTimeoutRef.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const sections = [
      "home",
      "journey",
      "projects",
      "skills",
      "experience",
      "beyond",
      "chat",
      "contact",
    ];
    let frameId: number | null = null;
    let lastTime = 0;

    const handleScroll = () => {
      if (isClickScrolling.current) return;

      const now = performance.now();
      // Throttle to max once every 60ms (~16fps) to prevent layout thrashing
      if (now - lastTime < 60) {
        return;
      }
      lastTime = now;

      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        // Detect if scroll has reached the bottom of the page
        const isAtBottom =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
        if (isAtBottom) {
          setActiveSection("contact");
          return;
        }

        // Find the section that occupies the largest height in the viewport
        let currentSection = "home";
        let maxVisibleHeight = -1;

        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            // Calculate visible height of this section in viewport
            const visibleTop = Math.max(rect.top, 0);
            const visibleBottom = Math.min(rect.bottom, window.innerHeight);
            const visibleHeight = visibleBottom - visibleTop;

            if (visibleHeight > maxVisibleHeight && visibleHeight > 0) {
              maxVisibleHeight = visibleHeight;
              currentSection = id;
            }
          }
        }

        setActiveSection(currentSection);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link
          to="/"
          hash="home"
          onClick={() => handleNavClick("home")}
          className="font-mono text-xs font-bold tracking-tighter text-foreground hover:text-accent"
        >
          SK / 2026
        </Link>
        <div className="hidden items-center md:flex p-1 rounded-full border border-border/50 bg-background/50 backdrop-blur-md shadow-sm">
          {navItems.slice(1).map((item) => {
            const isActive = activeSection === item.hash && location.pathname === "/";
            return (
              <Link
                key={item.hash}
                to="/"
                hash={item.hash}
                onClick={() => handleNavClick(item.hash)}
                className={`relative px-4 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "text-foreground font-bold"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-accent/15 border border-accent/20 shadow-[0_0_10px_rgba(139,92,246,0.15)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:inline">
              Open to roles
            </span>
          </div>
          <a
            href="https://github.com/samarthkashyap03"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center rounded-full p-1.5 text-foreground/60 transition-all hover:text-foreground hover:bg-secondary"
            title="GitHub"
          >
            <Github className="size-4 transition-transform group-hover:scale-110 group-hover:rotate-12" />
          </a>
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center rounded-full p-1.5 text-foreground/60 transition-all hover:text-foreground hover:bg-secondary cursor-pointer md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 flex flex-col gap-1 rounded-2xl border border-border bg-background/95 backdrop-blur-md p-4 shadow-xl md:hidden overflow-hidden"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.hash && location.pathname === "/";
              return (
                <Link
                  key={item.hash}
                  to="/"
                  hash={item.hash}
                  onClick={() => {
                    handleNavClick(item.hash);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                    isActive
                      ? "bg-accent/10 border-accent/20 text-accent"
                      : "border-transparent text-foreground/75 hover:bg-secondary/40 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function SiteFooter() {
  const [showTerminal, setShowTerminal] = useState(false);

  return (
    <footer className="mt-24 border-t border-border px-4 py-12 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest">Samarth Kashyap</p>
          <p
            onClick={() => setShowTerminal(!showTerminal)}
            className="font-mono text-xs text-muted-foreground cursor-pointer hover:text-accent transition-colors select-none group"
            title="Click to toggle Developer Console"
          >
            Built in Kaiserslautern · 49.44° N, 7.77° E{" "}
            <span className="inline-block text-accent opacity-65 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
              &gt;_
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-widest">
          <a
            href="https://github.com/samarthkashyap03"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/samarthkashyap"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            LinkedIn
          </a>
          <a
            href="mailto:samarthkashyap03@gmail.com"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Email
          </a>
        </div>
      </div>

      {showTerminal && (
        <div className="mx-auto max-w-7xl mt-8 animate-entrance border border-border/80 bg-black/25 dark:bg-black/45 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[9px] text-accent uppercase tracking-widest font-extrabold flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-accent animate-ping" />
              Developer Console (SKOS v1.0.4)
            </span>
            <button
              onClick={() => setShowTerminal(false)}
              className="text-[9px] font-mono hover:text-accent uppercase tracking-wider text-muted-foreground transition-colors cursor-pointer"
            >
              [Close Console]
            </button>
          </div>
          <SKOS />
        </div>
      )}
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-accent/15 selection:text-accent">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function BentoCard({
  children,
  className = "",
  variant = "surface",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  variant?: "surface" | "accent";
  delay?: number;
}) {
  const base =
    "spotlight animate-entrance rounded-2xl border border-border p-6 md:p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.25)]";
  const tone =
    variant === "accent" ? "bg-accent text-accent-foreground" : "bg-card text-card-foreground";
  return (
    <div
      className={`${base} ${tone} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}

export function MicroLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      {children}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mx-auto max-w-7xl px-4 pb-12 pt-16 md:px-8 md:pt-24">
      <MicroLabel>{eyebrow}</MicroLabel>
      <h1 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-6 max-w-2xl text-pretty text-lg leading-snug text-muted-foreground">
          {description}
        </p>
      ) : null}
    </header>
  );
}
