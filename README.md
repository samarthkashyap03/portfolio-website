# Portfolio Website

My personal portfolio — built to showcase my projects, skills, and experience with a focus on interactive design and performance.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (SSR/SSG) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| Animations | Framer Motion |
| Routing | TanStack Router (file-based) |
| Bundler | Vite |
| Package Manager | Bun |

## Architecture

```
src/
├── routes/           # File-based pages (TanStack Router)
│   ├── index.tsx     # Home / hero
│   ├── about.tsx     # About me
│   ├── projects/     # Projects index + detail pages
│   ├── blog/         # Blog index + post pages
│   ├── contact.tsx   # Contact form
│   ├── chat.tsx      # AI chat interface
│   └── __root.tsx    # App shell & global layout
├── components/
│   └── site/         # Portfolio-specific components
│       ├── SamarthOSCanvas.tsx    # Interactive OS-style canvas
│       ├── GitHubHeatmap.tsx      # GitHub contribution heatmap
│       ├── SkillsMarquee.tsx      # Animated skills ticker
│       ├── ChatWindow.tsx         # AI chat UI
│       └── InteractiveComponents.tsx
└── styles.css        # Global styles & design tokens
```

## Getting Started

```bash
bun install
bun run dev
```

## License

MIT
