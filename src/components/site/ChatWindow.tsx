import { useEffect, useRef, useState, type FormEvent } from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const STORAGE_KEY = "sk-chat-history-v1";

const intro: ChatMessage = {
  id: "intro",
  role: "assistant",
  content: "Hi, I'm Samarth's AI clone. Ask me anything about my projects, stack, or background.",
};

const suggestions = [
  "What is Samarth working on right now?",
  "Tell me about the patent on MedConnect.",
  "What's his backend stack?",
  "Is he open to internships?",
];

// Mock responder — the real backend will replace this.
function mockReply(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("patent") || p.includes("medconnect"))
    return "MedConnect is an automated medicine dispenser combining custom hardware (ESP8266, Arduino) with a small Python service for scheduling and reminders. It was granted a patent in India: 710119106.";
  if (p.includes("lumen"))
    return "Lumen turns long articles into swipeable knowledge cards and lets you chat with the article itself. Stack: Python, FastAPI, PostgreSQL, Redis, React, TypeScript. Live at lumenbrief.vercel.app.";
  if (p.includes("effortless"))
    return "Effortless is a document verification and certificate platform. Issuers publish certificates, anyone can verify them later. Built with React, TypeScript, PostgreSQL and Supabase.";
  if (p.includes("stack") || p.includes("backend") || p.includes("tech"))
    return "Mostly Python and TypeScript day to day. Backend: FastAPI, PostgreSQL, Redis. Frontend: React, TypeScript, Tailwind. Comfortable with Docker, Linux, and shipping things to production.";
  if (p.includes("intern") || p.includes("role") || p.includes("hir") || p.includes("job"))
    return "Yes — Samarth is open to internships and full-time roles in AI applications, backend engineering, and search/recommendation systems. Best way to reach out is samarthkashyap03@gmail.com.";
  if (p.includes("learn"))
    return "Right now: building more reliable AI applications, designing larger backend systems, running software in production, and improving his German.";
  return "I can answer questions about Samarth's projects (Lumen, Effortless, MedConnect), his stack, his patent, what he's learning, or how to reach him. Try one of the suggestions below.";
}

// Helper to parse basic markdown lists and bolding for chat responses
function renderMessageContent(content: string) {
  const lines = content.split("\n");
  
  return (
    <div className="space-y-1.5 text-left">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed === "") {
          return <div key={idx} className="h-1.5" />;
        }

        // Check if it's a bullet point (starts with '-' or '*' or '•' or '●')
        const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ") || trimmed.startsWith("● ");
        // Check if it's a numbered point (starts with digit followed by dot and space)
        const isNumbered = /^\d+\.\s/.test(trimmed);

        let displayLine = line;
        if (isBullet) {
          displayLine = trimmed.substring(2);
        } else if (isNumbered) {
          const match = trimmed.match(/^\d+\.\s(.*)/);
          displayLine = match ? match[1] : trimmed;
        }

        // Helper to parse inline bolding (**text**)
        const parts = displayLine.split(/(\*\*.*?\*\*)/g);
        const parsedElements = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="font-extrabold text-white dark:text-foreground">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 mt-0.5">
              <span className="text-violet-400 mt-2 shrink-0 select-none text-[6px]">●</span>
              <span className="flex-1 text-sm md:text-[15px] leading-relaxed text-foreground/90">{parsedElements}</span>
            </div>
          );
        }

        if (isNumbered) {
          const numMatch = trimmed.match(/^(\d+)/);
          const num = numMatch ? numMatch[1] : "1";
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 mt-0.5">
              <span className="font-mono text-xs font-bold text-violet-400 mt-0.5 shrink-0 select-none">{num}.</span>
              <span className="flex-1 text-sm md:text-[15px] leading-relaxed text-foreground/90">{parsedElements}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="text-sm md:text-[15px] leading-relaxed text-foreground/95">
            {parsedElements}
          </p>
        );
      })}
    </div>
  );
}

export function ChatWindow({
  variant = "page",
  showSuggestions = true,
}: {
  variant?: "page" | "card";
  showSuggestions?: boolean;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([intro]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Use the env variable if provided (Railway URL in prod), fallback to localhost for dev
  const resolvedBackendUrl =
    typeof import.meta.env !== "undefined" && import.meta.env.VITE_BACKEND_URL
      ? (import.meta.env.VITE_BACKEND_URL as string).replace(/\/$/, "")
      : "http://localhost:8000";
  const [backendUrl] = useState(resolvedBackendUrl);
  const [useLiveBackend, setUseLiveBackend] = useState(false);

  // Check if local FastAPI is running on mount
  useEffect(() => {
    fetch(`${backendUrl}/health`)
      .then((res) => {
        if (res.ok) setUseLiveBackend(true);
      })
      .catch(() => {
        // Fall back to mock quietly
      });
  }, [backendUrl]);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist + scroll.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setPending(true);

    let reply = "";
    if (useLiveBackend) {
      try {
        const res = await fetch(`${backendUrl}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        });
        if (res.ok) {
          const data = await res.json();
          reply = data.response || data.reply || "No response field received from backend.";
        } else {
          reply = `Backend error: ${res.statusText}. Using fallback. \n\n` + mockReply(trimmed);
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        reply =
          `Could not connect to FastAPI backend: ${errMsg}. Using fallback. \n\n` +
          mockReply(trimmed);
      }
    } else {
      // Simulate latency for premium feel
      await new Promise((r) => setTimeout(r, 800));
      reply = mockReply(trimmed);
    }

    setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "assistant", content: reply }]);
    setPending(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  function reset() {
    setMessages([intro]);
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
    inputRef.current?.focus();
  }

  const containerHeight = "h-[500px]"; // Perfect height for larger premium text

  return (
    <div
      className={`relative flex ${containerHeight} flex-col overflow-hidden rounded-2xl border border-violet-500/35 dark:border-violet-400/30 bg-black/60 p-5 backdrop-blur-2xl transition-all duration-500 ${pending ? "shadow-[0_0_40px_-5px_rgba(139,92,246,0.45)] border-violet-500/50" : "shadow-[0_0_25px_rgba(139,92,246,0.12)] hover:shadow-[0_0_35px_rgba(139,92,246,0.22)]"}`}
    >
      {/* Background Radial Glow Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_60%)]" />

      {/* Top Header Panel */}
      <div className="relative z-10 mb-4 flex items-center justify-between border-b border-violet-500/25 dark:border-violet-400/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-3 w-3">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${useLiveBackend ? "bg-emerald-400" : "bg-violet-400"}`}
            ></span>
            <span
              className={`relative inline-flex h-3 w-3 rounded-full ${useLiveBackend ? "bg-emerald-500" : "bg-violet-500"}`}
            ></span>
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {useLiveBackend ? "RAG Server Active" : "Clone Intelligence (Simulation)"}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setUseLiveBackend(!useLiveBackend)}
            className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase transition-all duration-300 ${useLiveBackend ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "bg-white/5 text-muted-foreground border border-violet-500/25 dark:border-violet-400/20 hover:bg-white/10 hover:text-white"}`}
          >
            {useLiveBackend ? "Live API" : "Simulated"}
          </button>
          {messages.length > 1 && (
            <button
              onClick={reset}
              className="rounded-full bg-white/5 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase text-muted-foreground border border-violet-500/25 dark:border-violet-400/20 hover:bg-white/10 hover:text-white hover:border-violet-500/40 transition-all"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={scrollRef}
        className="relative z-10 flex-1 space-y-4 overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        aria-live="polite"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-entrance`}
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 px-4 py-3 text-sm md:text-base text-white shadow-[0_4px_15px_-3px_rgba(139,92,246,0.4)] border border-violet-500/30 transition-all hover:brightness-110"
                  : "max-w-[85%] rounded-2xl rounded-tl-sm bg-white/5 border border-violet-500/20 dark:border-violet-400/15 px-4 py-3 text-sm md:text-base leading-relaxed text-foreground transition-all hover:bg-white/10"
              }
            >
              {renderMessageContent(m.content)}
            </div>
          </div>
        ))}
        {pending ? (
          <div className="flex items-center gap-2.5 pl-1.5 py-1 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
            </span>
            <span className="font-mono text-xs uppercase tracking-wider animate-pulse text-violet-400 font-semibold">
              Clone is typing...
            </span>
          </div>
        ) : null}
      </div>

      {/* Suggestion Chips */}
      {showSuggestions && messages.length <= 1 ? (
        <div className="relative z-10 mt-3 flex flex-wrap gap-2">
          {suggestions.slice(0, 3).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => void send(s)}
              className="rounded-full border border-violet-500/25 dark:border-violet-400/20 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition-all duration-300 hover:bg-violet-500/20 hover:border-violet-500/45 hover:text-white hover:shadow-[0_0_12px_rgba(139,92,246,0.25)]"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative z-10 mt-4 flex items-center gap-3">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            useLiveBackend ? "Ask the AI Clone..." : "e.g. What's the architecture behind Lumen?"
          }
          disabled={pending}
          className="min-w-0 flex-1 rounded-xl border border-violet-500/30 dark:border-violet-400/25 bg-black/60 px-4 py-3 text-sm md:text-base text-white outline-none placeholder:text-muted-foreground focus:border-violet-500/60 focus:shadow-[0_0_20px_-3px_rgba(139,92,246,0.4)] disabled:opacity-60 transition-all duration-300"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="shrink-0 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 px-5 py-3 text-sm md:text-base font-bold text-white shadow-[0_4px_15px_-3px_rgba(139,92,246,0.4)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] disabled:opacity-40 disabled:pointer-events-none"
        >
          Send
        </button>
      </form>
    </div>
  );
}
