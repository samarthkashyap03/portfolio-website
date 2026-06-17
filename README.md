# Portfolio Website

My personal portfolio — built to showcase my projects, skills, and experience with a focus on interactive design and performance.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 (Single Page Application) |
| Language | TypeScript |
| UI & Components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Routing | [TanStack Router](https://tanstack.com/router) (File-based Client Routing) |
| Dev Server & Bundler | Vite |
| Package Manager | npm |
| Frontend Deployment | Vercel (Static Web Hosting) |
| Backend Deployment | Railway (FastAPI RAG Backend) |

## Architecture

```
.
├── index.html            # Main HTML entry point
├── vercel.json           # Vercel client-side routing fallback configuration
├── vite.config.ts        # Vite configuration (TanStack Router & Tailwind plugins)
├── package.json          # Dependencies & scripts
└── src/
    ├── main.tsx          # Client-side React mount point
    ├── router.tsx        # TanStack Router instance & Query Client initialization
    ├── routeTree.gen.ts  # Auto-generated routing tree
    ├── routes/           # File-based page routes (TanStack Router)
    │   ├── __root.tsx    # Root layout & query client provider
    │   ├── index.tsx     # Home page / dashboard
    │   ├── about.tsx     # About page
    │   ├── contact.tsx   # Contact information page
    │   ├── chat.tsx      # AI Chat Interface
    │   ├── projects.tsx  # Projects route layout
    │   ├── projects.index.tsx  # Projects list page
    │   └── projects.$slug.tsx  # Project detail page (dynamic slug routing)
    ├── components/
    │   └── site/         # Interactive site components
    │       ├── SamarthOSCanvas.tsx    # Interactive OS-style desktop canvas
    │       ├── GitHubHeatmap.tsx      # GitHub contribution visualizer
    │       ├── SkillsMarquee.tsx      # Scrolling skills ticker
    │       ├── ChatWindow.tsx         # AI RAG chat window component
    │       └── InteractiveComponents.tsx
    ├── hooks/            # Custom application hooks
    ├── lib/              # Site helpers & data loaders
    │   ├── site-data.ts  # Static portfolio details (projects, credentials, metrics)
    │   └── lovable-error-reporting.ts # Client error telemetry reporter
    └── styles.css        # Tailwind global design tokens & custom animations
```

## Getting Started

### Local Development

1. Install frontend packages:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:8080` to view the application.

3. To connect the chat feature to a local RAG server, run the FastAPI backend (`rag_backend.py`) on port `8000`.

## License

MIT

