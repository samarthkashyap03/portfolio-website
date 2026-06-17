import lumenImg from "@/assets/lumen.jpg";
import effortlessImg from "@/assets/effortless.jpg";
import medconnectImg from "@/assets/medconnect.jpg";
import vtuImg from "@/assets/vtu_automation.png";
import tracelyImg from "@/assets/tracely.png";

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  year: string;
  stack: string[];
  highlights: string[];
  image: string;
  liveUrl?: string;
  repoUrl?: string;
  badge?: string;
  problem: string;
  approach: string[];
  outcome: string;
  architecture?: string[];
  demo?: { kind: "video" | "image" | "link"; src?: string; note: string };
  metrics?: { label: string; value: string }[];
  featured?: boolean;
  easyMode?: {
    problem: string;
    approach: string[];
    outcome: string;
  };
};

export const projects: Project[] = [
  {
    slug: "lumen",
    name: "Lumen",
    tagline: "Read Less. Understand More.",
    description:
      "A full-stack CMS platform that transforms long-form articles into swipeable knowledge cards through a multi-stage agent pipeline.",
    year: "2026",
    stack: [
      "React",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "Celery",
      "pgvector",
      "Python",
      "Groq",
      "Supabase",
      "TypeScript",
      "LangChain",
    ],
    highlights: [
      "Article Processing Pipeline",
      "Semantic Search",
      "Background Workers",
      "Knowledge Retrieval",
    ],
    image: lumenImg,
    liveUrl: "https://lumenbrief.vercel.app",
    repoUrl: "https://github.com/samarthkashyap03/lumen",
    problem:
      "Reading long-form online articles has become painful due to cookie banners, newsletter popups, ads, and distracted readers skim and forget the value.",
    approach: [
      "Build a multi-stage AI agent pipeline (Chunker, Embedding Agent, Analyzer, Generator, Validator, Optimizer, Publisher) using PyTorch, Groq, and LangChain.",
      "Implement semantic search and contextual article chat using HuggingFace sentence-transformers and pgvector index in Supabase.",
      "Use Celery with Redis for asynchronous background tasks and content publishing dashboard.",
    ],
    outcome:
      "A live full-stack SaaS platform enabling readers to turn long articles into distraction-free reading views or swipeable cards, and interact via grounded RAG Chat.",
    architecture: [
      "Article Link/Editor Input → Chunker (split text)",
      "Embedding Agent → HuggingFace sentence-transformers → pgvector store (Supabase)",
      "Analyzer & Generator (Groq LLM) → structured card blueprint and summaries",
      "Validator & Optimizer → fact-checking against source and text polishing",
      "Publisher → PostgreSQL/Supabase database → React Client UI and RAG Chat",
    ],
    demo: {
      kind: "link",
      src: "https://lumenbrief.vercel.app",
      note: "Paste any long article URL → swipe cards or chat with the piece.",
    },
    metrics: [
      { label: "Article → KB", value: "< 8s Processing" },
      { label: "Semantic Search", value: "PostgreSQL + pgvector" },
      { label: "Deployment", value: "Live Application" },
    ],
    featured: true,
    easyMode: {
      problem:
        "Reading long articles online is annoying because of ads, popups, and clutter, which makes it hard to focus and remember what you read.",
      approach: [
        "Created an AI pipeline that automatically breaks long articles down into bite-sized swipeable cards.",
        "Built a smart search bar that understands the meaning of what you type, rather than just matching exact keywords.",
        "Configured a fast background processor to load and analyze links in under 8 seconds.",
      ],
      outcome:
        "A live website where anyone can paste a link to read articles in a clean card view, search their saved library, or chat directly with their articles.",
    },
  },
  {
    slug: "effortless",
    name: "Effortless",
    tagline: "Proof of Human Work",
    description:
      "A full-stack SaaS platform that verifies document authenticity and links cryptographic proof to generated work without storing or analyzing document content.",
    year: "2026",
    stack: [
      "React",
      "Vite",
      "TypeScript",
      "Tailwind CSS",
      "PostgreSQL",
      "Supabase",
      "Tiptap",
      "TanStack Query",
      "Zod",
      "Vitest",
      "Playwright",
    ],
    highlights: ["Client-side Verification", "Document Privacy", "Authorship Proof", "Audit Trail"],
    image: effortlessImg,
    liveUrl: "https://effortless-app.com",
    repoUrl: "https://github.com/samarthkashyap03/effortless",
    problem:
      "With AI detectors frequently misflagging human-written work, writers need a reliable way to prove document authenticity without violating privacy or storing content.",
    approach: [
      "Develop a Tiptap-based text editor that tracks non-content writing metadata (typing speed, pause durations, edits).",
      "Export document to PDF and calculate a SHA-256 cryptographic hash of the file.",
      "Store only the session metadata and document hash in Supabase, keeping text content private.",
      "Create a public verification tool allowing users to upload a PDF and confirm its matching certificate.",
    ],
    outcome:
      "A privacy-first writing verification system proving human effort without storing raw text or screen recordings, secure via Supabase RLS.",
    architecture: [
      "Tiptap Editor + Tracking SDK (tracking.ts) → behavioral signals (typing patterns, pauses) → calculate score (0-100)",
      "Document Export → Generated PDF Document → Generate SHA-256 Hash",
      "Supabase Client → Save session data, hash, and create verification report (Reports Table)",
      "Database (Supabase) → Row Level Security (RLS) → Enforce ownership rules on Sessions Table",
      "Verification Tool (Verify.tsx) → Upload Document & Certificate → Compare hashes → Verified Genuine or Failed",
    ],
    demo: {
      kind: "link",
      src: "https://effortless-app.com",
      note: "Issue a certificate, share the verify link, anyone can confirm it.",
    },
    metrics: [
      { label: "Data Privacy", value: "Client-Side Only" },
      { label: "Document Storage", value: "No Storage" },
      { label: "Session Proofs", value: "Cryptographic" },
    ],
    featured: true,
    easyMode: {
      problem:
        "Writers get falsely accused of using AI to write their work, but sharing screen recordings or drafts to prove authenticity compromises their privacy.",
      approach: [
        "Built a text editor that tracks typing speeds and patterns (like natural pauses) to verify human activity.",
        "Generated a secure digital certificate for the file without uploading or saving the writing content itself.",
        "Created a free public tool where anyone can drag and drop a PDF to verify it matches a genuine human writing session.",
      ],
      outcome:
        "A privacy-first writing tool that lets users prove they wrote their documents themselves without ever storing their actual words online.",
    },
  },
  {
    slug: "medconnect",
    name: "MedConnect",
    tagline: "Automated Medicine Dispensing System",
    description:
      "An autonomous medicine dispensing kiosk that uses QR-based prescription verification and robotic dispensing to provide fast access to medicines, especially in rural areas.",
    year: "2025",
    stack: ["Arduino", "ESP8266", "C++", "PID Control", "Python", "MQTT"],
    highlights: ["QR Authentication", "Firmware Control", "Dispensing Logic", "Sensor Calibration"],
    image: medconnectImg,
    badge: "Patent Granted · IN 710119106",
    problem:
      "Long pharmacy wait times, lack of pharmacies in remote rural areas, dependency on delivery services, and manual medicine retrieval delays.",
    approach: [
      "Design a hardware carousel system driven by NEMA17 stepper motors and A4988 drivers for storage disk rotation.",
      "Build an ESP8266-controlled robotic picking arm with servo motors to retrieve and dispense packages.",
      "Implement QR-based prescription scan and PN532 NFC tag location tracking for double-verification.",
      "Create a feedback calibration loop using A3144 Hall Effect sensors for storage disk positioning.",
    ],
    outcome:
      "Granted Indian Patent (No. 710119106) and secured institutional funding for a fully operational kiosk.",
    architecture: [
      "Mobile App → Select medicine & make payment → Cloud Server → Generate QR Code",
      "Device QR Scanner → read prescription details → ESP8266 Controller",
      "Storage disk rotates to sector → A3144 Hall sensor calibrates disk position",
      "Robotic arm picks medicine → PN532 NFC Reader verifies NFC tag of medicine location",
      "Dispenser releases medicine → ESP8266 updates inventory in Cloud DB",
    ],
    demo: {
      kind: "image",
      note: "Hardware prototype + caregiver dashboard. Field-tested with real schedules.",
    },
    metrics: [
      { label: "Patent Number", value: "IN 710119106" },
      { label: "Hardware Core", value: "ESP8266" },
      { label: "Dispense Check", value: "QR + NFC" },
    ],
    featured: true,
    easyMode: {
      problem:
        "Getting medicines in remote villages is slow and difficult because of a lack of nearby pharmacies and long travel times.",
      approach: [
        "Designed a physical vending machine carousel that holds medicine packages securely.",
        "Built a robotic arm driven by simple microcontroller chips to pick and dispense the right box.",
        "Integrated a QR scanner and barcode reader so patients can verify prescriptions safely before getting their medicine.",
      ],
      outcome:
        "Received an official Indian patent for a working hardware prototype that lets patients safely collect prescriptions from an automated kiosk.",
    },
  },
  {
    slug: "tracely",
    name: "Tracely",
    tagline: "Job Application Tracker with AI Auto-Fill",
    description:
      "A clean, responsive web application to track and manage job applications, helping to organize job searches, see application statistics, and manage custom options.",
    year: "2025",
    stack: ["React", "Tailwind CSS", "Supabase", "TypeScript", "Vite", "Groq AI"],
    highlights: ["AI Auto-Fill", "Application Metrics", "Options Management", "Secure Auth"],
    image: tracelyImg,
    liveUrl: "https://tracely.me",
    repoUrl: "https://github.com/samarthkashyap03/tracely",
    problem:
      "Tracking job applications manually is tedious and slow, especially copying and pasting details like company name, title, salary, and requirements from descriptions.",
    approach: [
      "Integrate Groq AI API to parse pasted job descriptions and automatically extract role properties.",
      "Build a responsive layout using React 19, Tailwind CSS, and shadcn/ui components.",
      "Use Supabase Auth and database tables to secure user application data and configuration options.",
      "Create a real-time dashboard displaying key counters for applications, interviews, offers, and rejections.",
    ],
    outcome:
      "A unified, lightweight dashboard that allows developers to trace their job application productivity metrics with zero friction.",
    architecture: [
      "Client App (React 19 / Tailwind / TanStack Query) → Direct Secure Extraction Request → Groq API (Llama 3.3 parsing)",
      "Client App (React 19 / Tailwind / TanStack Query) → Secure Session & SQL Queries → Supabase DB & Auth (Row Level Security)",
      "SSR Server (TanStack Start / Cloudflare Router) → Renders UI / Hydrates → Client App",
    ],
    demo: {
      kind: "image",
      note: "Tracks session metrics and tasks in real-time with offline support.",
    },
    metrics: [
      { label: "Extraction", value: "Groq AI (Llama)" },
      { label: "UI Library", value: "shadcn/ui" },
      { label: "DB & Auth", value: "Supabase" },
    ],
    featured: false,
    easyMode: {
      problem:
        "Applying for jobs is tedious because copying and pasting company names, salaries, and links into spreadsheets takes too much time.",
      approach: [
        "Integrated a helper tool that automatically reads job descriptions and pulls out details like role, pay, and links.",
        "Designed a simple dashboard showing cards for active, interviewed, or offered jobs.",
        "Saved all records to a secure database so users can track their progress from any device.",
      ],
      outcome:
        "A lightweight, secure job tracker that saves developers hours of copying and pasting during their job search.",
    },
  },
  {
    slug: "vtu-automation",
    name: "VTU Result Automation",
    tagline: "Student Result Retrieval & Analysis",
    description:
      "A Python-based desktop automation tool to fetch student results from the VTU results portal and export them into an Excel sheet for department-level analysis.",
    year: "2023",
    stack: ["Python", "Tkinter", "Selenium", "openpyxl", "xlwt"],
    highlights: ["Browser Automation", "Desktop GUI", "Excel Generation", "Captcha Bypass"],
    image: vtuImg,
    repoUrl: "https://github.com/samarthkashyap03/vtu-result-automation",
    problem:
      "College result compilation from PDF archives is slow, manual, and highly prone to human error.",
    approach: [
      "Build a Tkinter GUI to configure Chromedriver paths, USN files, ranges, and save folders.",
      "Implement Selenium browser automation to feed student USNs sequentially to the VTU portal.",
      "Include manual captcha input prompts in the terminal to bypass portal security checks.",
      "Extract names, subject marks, internal assessments, and exam grades to compile in Excel.",
    ],
    outcome:
      "Originally built and used across multiple departments in my college to automate result retrieval and reduce manual effort by 90%.",
    architecture: [
      "Tkinter GUI → Read input Excel sheet containing student USNs",
      "Selenium WebDriver → Open VTU portal & inject USN",
      "User Terminal → Manually submit captcha once for the session",
      "BeautifulSoup/XPath Selectors → Extract name, IA, SEE, total marks, and pass/fail status",
      "openpyxl & xlwt → Write compiled student performance records to output .xls Excel file",
    ],
    demo: {
      kind: "image",
      note: "Parses class-wide results in seconds directly to structured reports.",
    },
    metrics: [
      { label: "Effort Saved", value: "90%" },
      { label: "Output Format", value: ".xls Excel" },
      { label: "UI Engine", value: "Tkinter" },
    ],
    featured: false,
    easyMode: {
      problem:
        "College staff spend days manually opening individual student portals, entering codes, and writing down grades into spreadsheets.",
      approach: [
        "Wrote a desktop program that automatically opens the college website, inputs student IDs, and copies grades.",
        "Created a prompt for staff to quickly solve security captchas once per class run.",
        "Compiled all retrieved results directly into a structured Excel file, ready to print.",
      ],
      outcome:
        "A time-saving tool used by multiple college departments that cut manual grading entry times by 90%.",
    },
  },
];

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readMinutes: number;
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "going-from-zero-to-shipped",
    title: "Going from zero to shipped",
    description:
      "What I keep relearning every time I take an idea from a blank page to something people actually use.",
    date: "2024-11-18",
    readMinutes: 5,
    body: [
      "Every project I finish teaches me the same lesson in a slightly different accent: the first version should embarrass you a little.",
      "If it doesn't, you waited too long to show it. Lumen started as a single endpoint that returned three bullet points. That was enough to learn what people actually wanted.",
      "Shipping is a forcing function for taste. You only really know what a product should feel like once it's in someone else's hands and they ignore the parts you thought were important.",
    ],
  },
  {
    slug: "notes-on-building-reliable-ai-apps",
    title: "Notes on building reliable AI apps",
    description:
      "Patterns I lean on when an AI feature has to keep working tomorrow, not just demo well today.",
    date: "2024-10-02",
    readMinutes: 7,
    body: [
      "Reliability in AI apps is mostly an old problem in new clothing: clear contracts, retries, caching, and honest failure modes.",
      "Treat the model as an untrusted, expensive external service. Schema-validate every output. Decide up front what a graceful failure looks like.",
      "Most of the perceived 'magic' of a good AI product is just the un-glamorous engineering wrapped around the model call.",
    ],
  },
];

export const skillGroups = [
  { label: "Languages", items: ["Python", "TypeScript", "JavaScript", "SQL", "C++"] },
  { label: "Backend", items: ["FastAPI", "PostgreSQL", "Redis", "REST APIs"] },
  { label: "Frontend", items: ["React", "TypeScript", "Tailwind CSS"] },
  { label: "Tools", items: ["Docker", "Git", "Linux", "GitHub", "Cursor", "Claude Code"] },
];

export const contact = {
  email: "samarthkashyap03@gmail.com",
  linkedin: "https://linkedin.com/in/samarthkashyap",
  github: "https://github.com/samarthkashyap03",
  location: "Kaiserslautern, Germany",
};

/* ---------- Identity / soul of the site ---------- */

export const identity = {
  shortBio: "Builder first, engineer second, technical entrepreneur at heart.",
  philosophy:
    "Build things, figure out exactly how they work under the hood, and make them a little better every single day.",
  tags: [
    "AI Agent Architecture",
    "Distributed Backends",
    "Hardware × Software",
    "Search & Recsys",
    "Shipping > Theorising",
  ],
  principles: [
    {
      k: "Practical idealist",
      v: "I build because I'm annoyed by inefficiency — Lumen exists because reading the web is broken; Effortless exists because AI detectors unfairly flag human work.",
    },
    {
      k: "Curious, execution-focused",
      v: "Multi-agent orchestrations or low-level PID loops — same instinct. Dive deep, then ship clean and reliable.",
    },
    {
      k: "Resilient & adaptable",
      v: "India → Kaiserslautern for my MSc at RPTU. New stacks, new standards, new language — same baseline.",
    },
  ],
};

export const languageEngine = {
  current: "German: A2 → B1",
  progress: 45,
  log: [
    "Compiling… 45% progress.",
    "Fixed: missing semicolon in syntax grammar.",
    "Warn: dative case occasionally unresolved.",
    "Build passing on small-talk module.",
  ],
};

export const nowList = [
  "Shipping a multi-agent backend for Lumen v2",
  "Reading: Designing Data-Intensive Applications",
  "Lifting German from A2 → B1",
  "Open to AI / backend / search roles in the EU",
];

export type MissionLog = {
  year: string;
  role: string;
  highlights: string[];
};

export const missionLogs: MissionLog[] = [
  {
    year: "2026",
    role: "AI & Full-Stack Builder (Lumen / Effortless)",
    highlights: [
      "Engineered FastAPI article processing, reducing processing speed to <8s",
      "Designed public verify pipelines with account-less cryptographic security",
      "Configured pgvector embeddings storage for semantic question & answering",
    ],
  },
  {
    year: "2025",
    role: "IoT System Architect (MedConnect Dispenser)",
    highlights: [
      "Secured patented scheduling loops driving microcontrollers in C++",
      "Assembled automated carer dashboard linked over MQTT networks",
      "Achieved dispensing accuracy ≥98% during testing environments",
    ],
  },
];

export type Testimonial = {
  name: string;
  role: string;
  comment: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Dr. L. Weber",
    role: "Academic Mentor",
    comment:
      "Samarth possesses an elite capacity to dissect abstract distributed concepts, converting them into working systems with clear design principles.",
  },
  {
    name: "Alex Thorne",
    role: "Collaborating Builder",
    comment:
      "A developer who starts shipping immediately. He understands low-level hardware constraints and high-level web scalability equally well.",
  },
];
