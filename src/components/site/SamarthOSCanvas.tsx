import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Cpu,
  BookOpen,
  MapPin,
  Users,
  Code,
  Layers,
  Award,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Github,
  Zap,
  ArrowRight,
  Workflow,
  Sparkles,
} from "lucide-react";

type NodeId =
  | "samarth"
  | "germany"
  | "patent"
  | "leadership"
  | "ai"
  | "software"
  | "products"
  | "automation"
  | "robotics";

interface OSNode {
  id: NodeId;
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  x: number;
  y: number;
  color: string;
}

export function SamarthOSCanvas() {
  const [hoveredNode, setHoveredNode] = useState<NodeId | null>(null);
  const [activeNode, setActiveNode] = useState<NodeId | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNodeClick = (e: React.MouseEvent, nodeId: NodeId) => {
    e.stopPropagation();
    if (isMobile) {
      if (hoveredNode === nodeId) {
        // Second tap: open detail view
        setActiveNode(nodeId === "samarth" ? "products" : nodeId);
        setHoveredNode(null);
      } else {
        // First tap: show hover card
        setHoveredNode(nodeId);
      }
    } else {
      // Desktop: single click opens detail view
      setActiveNode(nodeId === "samarth" ? "products" : nodeId);
    }
  };

  const nodes: OSNode[] = [
    {
      id: "germany",
      label: "Germany",
      sublabel: "MSc @ RPTU",
      icon: MapPin,
      x: 250,
      y: 45,
      color: "#22d3ee",
    },
    {
      id: "patent",
      label: "Patent",
      sublabel: "Granted IoT",
      icon: Award,
      x: 50,
      y: 115,
      color: "#c084fc",
    },
    {
      id: "leadership",
      label: "Leadership",
      sublabel: "Team Lead / TA",
      icon: Users,
      x: 450,
      y: 115,
      color: "#f43f5e",
    },
    {
      id: "ai",
      label: "AI",
      sublabel: "How I Think",
      icon: Brain,
      x: 35,
      y: 235,
      color: "#3b82f6",
    },
    {
      id: "software",
      label: "Software",
      sublabel: "How I Engineer",
      icon: Code,
      x: 465,
      y: 235,
      color: "#10b981",
    },
    {
      id: "products",
      label: "Products",
      sublabel: "Why I Build",
      icon: Cpu,
      x: 85,
      y: 355,
      color: "#a855f7",
    },
    {
      id: "automation",
      label: "Automation",
      sublabel: "VTU / Scrapers",
      icon: Layers,
      x: 415,
      y: 355,
      color: "#f59e0b",
    },
    {
      id: "robotics",
      label: "Robotics",
      sublabel: "PID & Arms",
      icon: Workflow,
      x: 250,
      y: 395,
      color: "#ec4899",
    },
  ];

  // Connections mapping to follow layout structure
  const connections = [
    { from: "germany", to: "samarth" },
    { from: "patent", to: "leadership" },
    { from: "patent", to: "samarth" },
    { from: "leadership", to: "samarth" },
    { from: "samarth", to: "ai" },
    { from: "samarth", to: "software" },
    { from: "samarth", to: "products" },
    { from: "samarth", to: "automation" },
    { from: "products", to: "robotics" },
    { from: "automation", to: "robotics" },
    { from: "ai", to: "products" },
    { from: "software", to: "automation" },
  ];

  const centerNode = {
    id: "samarth" as NodeId,
    label: "SAMARTH.OS",
    sublabel: "ACTIVE",
    x: 250,
    y: 220,
  };

  const getNodeCoords = (id: string) => {
    if (id === "samarth") return { x: centerNode.x, y: centerNode.y };
    const n = nodes.find((node) => node.id === id);
    return n ? { x: n.x, y: n.y } : { x: 250, y: 220 };
  };

  const getHoverCardStyle = (nodeId: NodeId) => {
    if (isMobile) {
      return {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "calc(100% - 32px)",
        maxWidth: "295px",
      };
    }
    const coords = getNodeCoords(nodeId);

    switch (nodeId) {
      case "samarth":
        return {
          left: "50%",
          top: `${((coords.y + 65) / 460) * 100}%`,
          transform: "translateX(-50%)",
        };
      case "germany":
        // Render ABOVE Germany node (safe with overflow-visible)
        return {
          left: "50%",
          top: `${((coords.y - 170) / 460) * 100}%`,
          transform: "translateX(-50%)",
        };
      case "robotics":
        // Render ABOVE robotics node to prevent bottom cutoff
        return {
          left: "50%",
          top: `${((coords.y - 240) / 460) * 100}%`,
          transform: "translateX(-50%)",
        };
      case "patent":
      case "ai":
        // Render on the LEFT side of the node
        return {
          right: `${100 - ((coords.x - 55) / 500) * 100}%`,
          top: `${(coords.y / 460) * 100}%`,
          transform: "translateY(-50%)",
        };
      case "products":
        // Render on the LEFT side of the node, shifted upwards to avoid bottom cutoff
        return {
          right: `${100 - ((coords.x - 55) / 500) * 100}%`,
          top: `${(coords.y / 460) * 100}%`,
          transform: "translateY(-82%)",
        };
      case "leadership":
      case "software":
        // Render on the LEFT side of the node to prevent right screen cut-off
        return {
          right: `${100 - ((coords.x - 55) / 500) * 100}%`,
          top: `${(coords.y / 460) * 100}%`,
          transform: "translateY(-50%)",
        };
      case "automation":
        // Render on the LEFT side of the node, shifted upwards to avoid bottom cutoff
        return {
          right: `${100 - ((coords.x - 55) / 500) * 100}%`,
          top: `${(coords.y / 460) * 100}%`,
          transform: "translateY(-82%)",
        };
      default:
        return {
          left: `${(coords.x / 500) * 100}%`,
          top: `${(coords.y / 460) * 100}%`,
          transform: "translate(-50%, -50%)",
        };
    }
  };

  const activeHoverNodeColor = hoveredNode
    ? hoveredNode === "samarth"
      ? "var(--color-accent)"
      : nodes.find((n) => n.id === hoveredNode)?.color || "var(--color-accent)"
    : "var(--color-accent)";

  return (
    <div
      className={`relative flex ${activeNode ? "min-h-[580px] md:min-h-[600px]" : "min-h-[520px]"} w-full flex-col justify-between rounded-3xl border p-6 backdrop-blur-xl overflow-visible select-none graph-glow-pulsate bg-card/65 transition-all duration-300`}
    >
      <AnimatePresence mode="wait">
        {!activeNode ? (
          // LEVEL 1 & 2: GRAPH MODE
          <motion.div
            key="graph"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col h-full justify-between overflow-visible"
          >
            {/* Header / Instructions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3 mb-2 z-10">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Samarth.OS Career Graph
                </span>
              </div>
              <span className="font-mono text-[11px] sm:text-xs font-bold text-accent bg-accent/15 px-3 py-1 rounded border border-accent/30 shadow-sm self-start sm:self-auto">
                {isMobile
                  ? "Tap nodes to inspect · Tap again to explore details"
                  : "Hover nodes to inspect · Click to explore details"}
              </span>
            </div>

            {/* SVG Interactive Canvas */}
            <div className="relative flex-1 min-h-[400px] w-full flex items-center justify-center overflow-visible">
              <svg
                className="absolute inset-0 size-full overflow-visible"
                viewBox="0 0 500 460"
                onClick={() => setHoveredNode(null)}
              >
                {/* Glowing Gradients */}
                <defs>
                  <filter id="glow-heavy" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Connection lines */}
                {connections.map((conn, idx) => {
                  const fromCoords = getNodeCoords(conn.from);
                  const toCoords = getNodeCoords(conn.to);
                  const isHighlighted =
                    hoveredNode &&
                    (conn.from === hoveredNode ||
                      conn.to === hoveredNode ||
                      (hoveredNode === "patent" && conn.from === "patent") ||
                      (hoveredNode === "ai" && conn.from === "samarth" && conn.to === "ai"));

                  return (
                    <g key={idx} className="pointer-events-none">
                      {isHighlighted && (
                        <line
                          x1={fromCoords.x}
                          y1={fromCoords.y}
                          x2={toCoords.x}
                          y2={toCoords.y}
                          className="stroke-accent opacity-30"
                          strokeWidth="6"
                        />
                      )}
                      <line
                        x1={fromCoords.x}
                        y1={fromCoords.y}
                        x2={toCoords.x}
                        y2={toCoords.y}
                        strokeDasharray={isHighlighted ? "none" : "4,4"}
                        strokeWidth={isHighlighted ? 2.5 : 1.2}
                        className={`transition-all duration-300 ${
                          isHighlighted ? "stroke-accent" : "stroke-muted-foreground/40"
                        }`}
                      />
                      {/* Flowing animated dots/packets */}
                      {isHighlighted && (
                        <circle r="3.5" fill="var(--color-accent)">
                          <animateMotion
                            dur="1.8s"
                            repeatCount="indefinite"
                            path={`M ${fromCoords.x} ${fromCoords.y} L ${toCoords.x} ${toCoords.y}`}
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* Central OS Node (Now Larger with Hover Support & Ambient Glow) */}
                <g
                  className="cursor-pointer"
                  onMouseEnter={() => !isMobile && setHoveredNode("samarth")}
                  onMouseLeave={() => !isMobile && setHoveredNode(null)}
                  onClick={(e) => handleNodeClick(e, "samarth")}
                >
                  {/* Glowing pulsing outer circle */}
                  <circle
                    cx={centerNode.x}
                    cy={centerNode.y}
                    r="68"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                    className="opacity-20 animate-pulse"
                  />
                  <circle
                    cx={centerNode.x}
                    cy={centerNode.y}
                    r="58"
                    fill="var(--color-card)"
                    stroke={
                      hoveredNode === "samarth" ? "var(--color-accent)" : "var(--color-border)"
                    }
                    strokeWidth="3.5"
                    className="shadow-2xl transition-all duration-300"
                    style={{
                      filter:
                        hoveredNode === "samarth"
                          ? "drop-shadow(0 0 16px var(--color-accent))"
                          : "none",
                    }}
                  />
                  <circle
                    cx={centerNode.x}
                    cy={centerNode.y}
                    r="48"
                    fill="var(--color-secondary)"
                    className="opacity-95"
                  />
                  <text
                    x={centerNode.x}
                    y={centerNode.y - 1}
                    textAnchor="middle"
                    className="font-sans text-[15px] sm:text-[16px] font-medium fill-foreground tracking-tight"
                  >
                    {centerNode.label}
                  </text>
                  <text
                    x={centerNode.x}
                    y={centerNode.y + 14}
                    textAnchor="middle"
                    className="font-sans text-[10px] font-bold fill-emerald-400 tracking-wider animate-pulse"
                  >
                    [{centerNode.sublabel}]
                  </text>
                </g>

                {/* Floating Orbiting Nodes (Larger size & bigger font) */}
                {nodes.map((node) => {
                  const Icon = node.icon;
                  const isHovered = hoveredNode === node.id;
                  const isOtherHovered = hoveredNode !== null && hoveredNode !== node.id;

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer group"
                      onMouseEnter={() => !isMobile && setHoveredNode(node.id)}
                      onMouseLeave={() => !isMobile && setHoveredNode(null)}
                      onClick={(e) => handleNodeClick(e, node.id)}
                    >
                      {/* Hover outer ring */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isHovered ? "44" : "35"}
                        fill="transparent"
                        stroke={node.color}
                        strokeWidth="2.5"
                        className="transition-all duration-300"
                        style={{
                          opacity: isHovered ? 1.0 : 0.4,
                          filter: isHovered ? `drop-shadow(0 0 14px ${node.color})` : "none",
                        }}
                      />
                      {/* Core Node Circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isHovered ? "38" : "30"}
                        fill="var(--color-card)"
                        stroke={isHovered ? node.color : "var(--color-border)"}
                        strokeWidth={isHovered ? "3" : "2.5"}
                        className="transition-all duration-300 shadow-xl"
                        style={{
                          opacity: isOtherHovered ? 0.35 : 1,
                          filter: isHovered ? `drop-shadow(0 0 10px ${node.color})` : "none",
                        }}
                      />
                      {/* Icon overlay */}
                      <foreignObject
                        x={node.x - 14}
                        y={node.y - 14}
                        width="28"
                        height="28"
                        className="pointer-events-none transition-all duration-300"
                        style={{ opacity: isOtherHovered ? 0.25 : 1 }}
                      >
                        <div className="flex size-full items-center justify-center">
                          <Icon
                            className="size-6 transition-transform duration-300 group-hover:scale-110"
                            style={{ color: isHovered ? node.color : "var(--color-foreground)" }}
                          />
                        </div>
                      </foreignObject>
                      {/* Label Text (Larger & Higher Contrast) */}
                      <text
                        x={node.x}
                        y={node.y + 52}
                        textAnchor="middle"
                        className="font-sans text-[14px] sm:text-[15px] transition-all duration-300 fill-foreground drop-shadow-md"
                        style={{
                          opacity: isOtherHovered ? 0.25 : 1,
                          fill: isHovered ? node.color : "var(--color-foreground)",
                          fontWeight: isHovered ? 800 : 500,
                          textShadow: isHovered
                            ? `0 0 10px ${node.color}, 0 0 2px ${node.color}`
                            : "none",
                        }}
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* LEVEL 2 Hover Mini-Dashboards (Z-Index fix, pointer-events managed, absolute inline) */}
              <div className="absolute inset-0 z-30 pointer-events-none overflow-visible">
                <AnimatePresence>
                  {hoveredNode && (
                    <motion.div
                      key={hoveredNode}
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      style={{
                        ...getHoverCardStyle(hoveredNode),
                        borderColor: activeHoverNodeColor,
                        boxShadow: `0 0 18px -4px ${activeHoverNodeColor}33, 0 8px 28px -9px rgba(0,0,0,0.5)`,
                      }}
                      className="absolute md:w-72 rounded-2xl border bg-card/95 p-5 backdrop-blur-lg pointer-events-auto transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isMobile && (
                        <div className="flex justify-end mb-2 pb-2 border-b border-border/40">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setHoveredNode(null);
                            }}
                            className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-accent px-2 py-0.5 rounded border border-border bg-secondary/50 cursor-pointer"
                          >
                            [ Close Card ]
                          </button>
                        </div>
                      )}
                      {hoveredNode === "samarth" && (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-[11px] font-bold text-accent uppercase tracking-wider flex items-center gap-1">
                              <Sparkles className="size-3 animate-spin" /> About Me
                            </span>
                            <span className="font-sans text-[11px] text-emerald-400 font-bold">
                              Active
                            </span>
                          </div>
                          <h4 className="font-sans text-base font-extrabold text-foreground">
                            Samarth Kashyap
                          </h4>
                          <ul className="list-disc pl-4 space-y-1 text-[13px] text-foreground/90 font-medium leading-relaxed font-sans">
                            <li>
                              Build full-stack applications bridging backend, AI, and automation.
                            </li>
                            <li>Design clean APIs, database schemas, and background workers.</li>
                            <li>Experiment with hardware prototyping and custom IoT firmware.</li>
                          </ul>
                        </div>
                      )}

                      {hoveredNode === "patent" && (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                              Patent Granted
                            </span>
                            <span className="font-sans text-[11px] text-muted-foreground">
                              IN 710119106
                            </span>
                          </div>
                          <h4 className="font-sans text-base font-extrabold text-foreground">
                            MEDCONNECT
                          </h4>
                          <ul className="list-disc pl-4 space-y-1 text-[13px] text-foreground/90 font-medium leading-relaxed font-sans">
                            <li>
                              Granted Indian Patent No. 710119106 for an autonomous medicine kiosk.
                            </li>
                            <li>
                              Secured institutional funding to build and deploy the physical device.
                            </li>
                            <li>
                              Connects ESP8266 controller, stepper motors, and mobile app via cloud.
                            </li>
                          </ul>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {["C++", "Arduino", "ESP8266", "PID Control"].map((tech) => (
                              <span
                                key={tech}
                                className="rounded bg-purple-400/10 px-2 py-0.5 font-sans text-[10px] text-purple-300 font-bold border border-purple-400/20"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {hoveredNode === "ai" && (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                              How I Think
                            </span>
                            <span className="font-sans text-[11px] text-emerald-400 font-bold">
                              Systems
                            </span>
                          </div>
                          <h4 className="font-sans text-base font-extrabold text-foreground">
                            How do I build intelligent systems?
                          </h4>
                          <ul className="list-disc pl-4 space-y-1 text-[13px] text-foreground/90 font-medium leading-relaxed font-sans">
                            <li>Build deterministic AI systems and RAG pipelines from scratch.</li>
                            <li>
                              Use pgvector semantic search and background queues for document
                              parsing.
                            </li>
                            <li>
                              Prevent hallucinations by enforcing strict text verification bounds.
                            </li>
                          </ul>
                        </div>
                      )}

                      {hoveredNode === "software" && (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                              How I Engineer
                            </span>
                            <span className="font-sans text-[11px] text-emerald-400 font-bold">
                              Production
                            </span>
                          </div>
                          <h4 className="font-sans text-base font-extrabold text-foreground">
                            How do I build production apps?
                          </h4>
                          <ul className="list-disc pl-4 space-y-1 text-[13px] text-foreground/90 font-medium leading-relaxed font-sans">
                            <li>
                              Ship type-safe web applications with fast initial page load times.
                            </li>
                            <li>
                              Build high-performance backend endpoints using FastAPI and PostgreSQL.
                            </li>
                            <li>
                              Implement asynchronous tasks with Celery and Redis to handle heavy
                              loads.
                            </li>
                          </ul>
                        </div>
                      )}

                      {hoveredNode === "germany" && (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                              Education
                            </span>
                            <span className="font-sans text-[11px] text-muted-foreground">
                              Kaiserslautern
                            </span>
                          </div>
                          <h4 className="font-sans text-base font-extrabold text-foreground">
                            M.Sc. at RPTU
                          </h4>
                          <div className="flex items-center gap-1.5 font-sans text-[11px] text-muted-foreground">
                            <span>India</span>
                            <ArrowRight className="size-2.5 text-cyan-400" />
                            <span>RPTU</span>
                            <ArrowRight className="size-2.5 text-cyan-400" />
                            <span className="text-cyan-400 font-bold">Germany</span>
                          </div>
                          <ul className="list-disc pl-4 space-y-1 text-[13px] text-foreground/90 font-medium leading-relaxed font-sans">
                            <li>Pursuing M.Sc. in Computer Science at RPTU Kaiserslautern.</li>
                            <li>Specializing in Software Engineering and Intelligent Systems.</li>
                            <li>
                              Deepening understanding of software architecture and scalable systems.
                            </li>
                          </ul>
                        </div>
                      )}

                      {hoveredNode === "leadership" && (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                              Team Leadership
                            </span>
                            <span className="font-sans text-[11px] text-rose-400 font-bold">
                              Active Lead
                            </span>
                          </div>
                          <h4 className="font-sans text-base font-extrabold text-foreground">
                            Teaching & Teams
                          </h4>
                          <ul className="list-disc pl-4 space-y-1 text-[13px] text-foreground/90 font-medium leading-relaxed font-sans">
                            <li>
                              Led a 10-member team building hardware at international robotics
                              contests.
                            </li>
                            <li>
                              Mentored 30+ students during Python & object-oriented programming
                              bootcamps.
                            </li>
                            <li>
                              Founded and organized startup workshops for the college
                              entrepreneurship club.
                            </li>
                          </ul>
                        </div>
                      )}

                      {hoveredNode === "products" && (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                              Why I Build
                            </span>
                            <span className="font-sans text-[11px] text-muted-foreground">
                              Solutions
                            </span>
                          </div>
                          <h4 className="font-sans text-base font-extrabold text-foreground">
                            What problems did I solve?
                          </h4>
                          <ul className="list-disc pl-4 space-y-1 text-[13px] text-foreground/90 font-medium leading-relaxed font-sans">
                            <li>
                              Ship clean SaaS applications that solve real-world daily bottlenecks.
                            </li>
                            <li>
                              Built Lumen (AI-powered reading assistant) and Effortless (writing
                              verification).
                            </li>
                            <li>Focused on lightweight, privacy-first tools with instant value.</li>
                          </ul>
                        </div>
                      )}

                      {hoveredNode === "automation" && (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                              Automation Systems
                            </span>
                            <span className="font-sans text-[11px] text-muted-foreground">
                              College Result Automator
                            </span>
                          </div>
                          <h4 className="font-sans text-base font-extrabold text-foreground">
                            VTU Result Automation & Scrapers
                          </h4>
                          <ul className="list-disc pl-4 space-y-1 text-[13px] text-foreground/90 font-medium leading-relaxed font-sans">
                            <li>
                              Wrote Python scripts to scrape college portals and automate grade
                              formatting.
                            </li>
                            <li>
                              Replaced manual data entry for staff, reducing processing time by 90%.
                            </li>
                            <li>
                              Built API integrations for automated lead-generation data processing.
                            </li>
                          </ul>
                        </div>
                      )}

                      {hoveredNode === "robotics" && (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-[11px] font-bold text-pink-400 uppercase tracking-wider">
                              Robotics arm
                            </span>
                            <span className="font-sans text-[11px] text-pink-400 font-bold">
                              Technoxian
                            </span>
                          </div>
                          <h4 className="font-sans text-base font-extrabold text-foreground">
                            Robotics & Firmware
                          </h4>
                          <ul className="list-disc pl-4 space-y-1 text-[13px] text-foreground/90 font-medium leading-relaxed font-sans">
                            <li>
                              Secured 3rd place at JITHACK 2023 with a WiFi-controlled robotic arm.
                            </li>
                            <li>
                              Developed custom C++ firmware on Arduino and ESP8266 microcontrollers.
                            </li>
                            <li>
                              Programmed PID feedback loops to stabilize high-speed mobile robots.
                            </li>
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : (
          // LEVEL 3, 4, 5: UNIFIED DETAIL PANELS
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col h-full justify-between"
          >
            {/* Top Bar Navigation */}
            <div className="flex items-center justify-between border-b border-border/40 pb-3.5 mb-4">
              <button
                onClick={() => setActiveNode(null)}
                className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-3.5" /> [ Back to OS Canvas ]
              </button>
              <span className="font-sans text-[10px] uppercase tracking-wider px-2.5 py-1 rounded bg-muted font-bold text-accent">
                {activeNode.toUpperCase()} Node Detailed Context
              </span>
            </div>

            {/* Detailed Panels for Each Section */}
            <div
              className={`flex-1 overflow-y-auto ${activeNode ? "max-h-[450px] md:max-h-[470px]" : "max-h-[390px]"} pr-2 scrollbar-thin`}
            >
              {activeNode === "patent" && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="font-sans text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                      Intellectual Property · 2024
                    </span>
                    <h3 className="font-sans text-2xl font-extrabold text-foreground">
                      Medconnect - an automated medicine dispensing machine
                    </h3>
                    <p className="font-sans text-sm text-foreground/80">
                      Patent Status: Granted (IN 710119106)
                    </p>
                  </div>

                  {/* Architecture Flow */}
                  <div className="rounded-xl border border-purple-400/20 bg-purple-400/5 p-4 space-y-3 transition-all duration-300 hover:scale-[1.01] hover:bg-purple-400/10 hover:border-purple-400/30 cursor-default">
                    <span className="font-sans text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Workflow className="size-3 text-purple-400 animate-pulse" />
                      Device & Software System Architecture
                    </span>
                    <div className="flex flex-col md:flex-row items-stretch justify-between gap-1.5 font-sans text-xs text-purple-200">
                      {/* Step 1 */}
                      <div className="flex-1 border border-purple-400/30 rounded-lg p-2 bg-purple-950/40 flex flex-col justify-between text-center min-h-[56px] transition-all duration-300 hover:scale-[1.03] hover:bg-purple-900/40 hover:border-purple-400/40">
                        <div className="font-bold text-[9px] text-purple-300 uppercase tracking-wider">
                          1. Mobile App
                        </div>
                        <div className="text-[11px] text-purple-100/90 leading-tight">
                          Order prescription
                        </div>
                      </div>

                      <div className="flex items-center justify-center py-0.5 md:py-0">
                        <ArrowRight className="size-3.5 rotate-90 md:rotate-0 text-purple-400/60" />
                      </div>

                      {/* Step 2 */}
                      <div className="flex-1 border border-purple-400/30 rounded-lg p-2 bg-purple-950/40 flex flex-col justify-between text-center min-h-[56px] transition-all duration-300 hover:scale-[1.03] hover:bg-purple-900/40 hover:border-purple-400/40">
                        <div className="font-bold text-[9px] text-purple-300 uppercase tracking-wider">
                          2. Cloud QR
                        </div>
                        <div className="text-[11px] text-purple-100/90 leading-tight">
                          Secure token auth
                        </div>
                      </div>

                      <div className="flex items-center justify-center py-0.5 md:py-0">
                        <ArrowRight className="size-3.5 rotate-90 md:rotate-0 text-purple-400/60" />
                      </div>

                      {/* Step 3 */}
                      <div className="flex-1 border border-purple-400/30 rounded-lg p-2 bg-purple-950/40 flex flex-col justify-between text-center min-h-[56px] transition-all duration-300 hover:scale-[1.03] hover:bg-purple-900/40 hover:border-purple-400/40">
                        <div className="font-bold text-[9px] text-purple-300 uppercase tracking-wider">
                          3. Kiosk Scan
                        </div>
                        <div className="text-[11px] text-purple-100/90 leading-tight">
                          Verify & decrypt
                        </div>
                      </div>

                      <div className="flex items-center justify-center py-0.5 md:py-0">
                        <ArrowRight className="size-3.5 rotate-90 md:rotate-0 text-purple-400/60" />
                      </div>

                      {/* Step 4 */}
                      <div className="flex-1 border border-purple-400/30 rounded-lg p-2 bg-purple-950/40 flex flex-col justify-between text-center min-h-[56px] transition-all duration-300 hover:scale-[1.03] hover:bg-purple-900/40 hover:border-purple-400/40">
                        <div className="font-bold text-[9px] text-purple-300 uppercase tracking-wider">
                          4. ESP8266 Core
                        </div>
                        <div className="text-[11px] text-purple-100/90 leading-tight">
                          C++ motor driver
                        </div>
                      </div>

                      <div className="flex items-center justify-center py-0.5 md:py-0">
                        <ArrowRight className="size-3.5 rotate-90 md:rotate-0 text-purple-400/60" />
                      </div>

                      {/* Step 5 */}
                      <div className="flex-1 border border-purple-400/30 rounded-lg p-2 bg-purple-950/40 flex flex-col justify-between text-center min-h-[56px] transition-all duration-300 hover:scale-[1.03] hover:bg-purple-900/40 hover:border-purple-400/40">
                        <div className="font-bold text-[9px] text-purple-300 uppercase tracking-wider">
                          5. Dispensing
                        </div>
                        <div className="text-[11px] text-purple-100/90 leading-tight">
                          Calibrated motor drop
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="font-bold text-foreground text-sm sm:text-base">
                          What it is
                        </h4>
                        <ul className="list-disc pl-4 space-y-1 text-[13px] sm:text-sm text-foreground/80 mt-1">
                          <li>Physical kiosk for automated medicine dispensing.</li>
                          <li>
                            Patients order via mobile app, scan secure QR code, and retrieve
                            tablets.
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-foreground text-sm sm:text-base">
                          Why I built it
                        </h4>
                        <ul className="list-disc pl-4 space-y-1 text-[13px] sm:text-sm text-foreground/80 mt-1">
                          <li>Provide 24/7 medicine access in remote or rural areas.</li>
                          <li>Eliminate long pharmacy lines and manual retrieval errors.</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="font-bold text-foreground text-sm sm:text-base">
                          Lessons Learned
                        </h4>
                        <ul className="list-disc pl-4 space-y-1 text-[13px] sm:text-sm text-foreground/80 mt-1">
                          <li>
                            Solved NEMA17 stepper position drift during power dips using Hall effect
                            sensors.
                          </li>
                          <li>
                            Stored runtime system status in flash memory to resume safely after
                            power drops.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeNode === "ai" && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="font-sans text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                      How I Think
                    </span>
                    <h3 className="font-sans text-2xl font-extrabold text-foreground">
                      Building Systems that Reason
                    </h3>
                    <p className="font-sans text-sm text-foreground/80">
                      My approach to writing code that handles documents and answers queries without
                      guessing.
                    </p>
                  </div>

                  {/* Lumen Architecture Diagram */}
                  <div className="rounded-xl border border-blue-400/20 bg-blue-400/5 p-4 space-y-3 transition-all duration-300 hover:scale-[1.01] hover:bg-blue-400/10 hover:border-blue-400/30 cursor-default">
                    <span className="font-sans text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                      Context Retrieval & Synthesis Flow
                    </span>
                    <div className="flex flex-col gap-2.5 font-sans text-xs text-blue-300 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="w-20 font-bold text-blue-400">1. Input:</span>
                        <div className="flex-1 border border-blue-400/30 rounded px-2.5 py-1 bg-card transition-all duration-300 hover:scale-[1.01] hover:bg-blue-950/40 hover:border-blue-400/40">
                          Raw Documents or User Questions
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-20 font-bold text-blue-400">2. Process:</span>
                        <div className="flex-1 flex flex-wrap gap-1.5">
                          {[
                            "Splitting text",
                            "Generating vector coordinates",
                            "Indexing in PostgreSQL",
                          ].map((step) => (
                            <span
                              key={step}
                              className="border border-blue-400/30 rounded px-2 py-0.5 bg-card text-[10px] font-semibold transition-all duration-300 hover:scale-[1.05] hover:bg-blue-900/40 hover:border-blue-400/40"
                            >
                              {step}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-20 font-bold text-blue-400">3. Output:</span>
                        <div className="flex-1 border border-blue-400/30 rounded px-2.5 py-1 bg-card transition-all duration-300 hover:scale-[1.01] hover:bg-blue-950/40 hover:border-blue-400/40">
                          Feeding relevant context into Groq Llama for fact-based responses
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground text-sm sm:text-base">
                        Focusing on reliability
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-[13px] sm:text-sm text-foreground/80 mt-1">
                        <li>
                          Control inputs by preprocessing, cleaning, and chunking raw text files.
                        </li>
                        <li>
                          Enforce strict validation bounds to prevent hallucinations and model logic
                          drifts.
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground text-sm sm:text-base">
                        Asynchronous and structured storage
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-[13px] sm:text-sm text-foreground/80 mt-1">
                        <li>
                          Index text segments and embeddings coordinates in PostgreSQL using
                          pgvector.
                        </li>
                        <li>
                          Offload document reading and processing to Celery background tasks with
                          Redis queues.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeNode === "software" && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="font-sans text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      How I Engineer
                    </span>
                    <h3 className="font-sans text-2xl font-extrabold text-foreground">
                      Full-Stack Architecture & Engineering
                    </h3>
                    <p className="font-sans text-sm text-foreground/80">
                      How do I build production applications that are fast, secure, and
                      maintainable?
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-5 space-y-2 transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-400/10 hover:border-emerald-400/30 cursor-default min-h-[160px] flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="font-sans text-[10px] font-bold text-emerald-300 uppercase">
                          FRONTEND
                        </span>
                        <h5 className="font-sans text-sm font-bold text-foreground">
                          React & TypeScript
                        </h5>
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px] sm:text-[12px] text-foreground/80 mt-1 font-sans">
                          <li>Snappy, fast-loading UIs.</li>
                          <li>Clean component structures.</li>
                          <li>Minimal dependency footprints.</li>
                        </ul>
                      </div>
                    </div>
                    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-5 space-y-2 transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-400/10 hover:border-emerald-400/30 cursor-default min-h-[160px] flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="font-sans text-[10px] font-bold text-emerald-300 uppercase">
                          BACKEND
                        </span>
                        <h5 className="font-sans text-sm font-bold text-foreground">
                          FastAPI & Celery
                        </h5>
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px] sm:text-[12px] text-foreground/80 mt-1 font-sans">
                          <li>High-performance API endpoints.</li>
                          <li>Type-safe payloads.</li>
                          <li>Celery / Redis background queues.</li>
                        </ul>
                      </div>
                    </div>
                    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-5 space-y-2 transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-400/10 hover:border-emerald-400/30 cursor-default min-h-[160px] flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="font-sans text-[10px] font-bold text-emerald-300 uppercase">
                          DATABASE
                        </span>
                        <h5 className="font-sans text-sm font-bold text-foreground">
                          PostgreSQL & Supabase
                        </h5>
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px] sm:text-[12px] text-foreground/80 mt-1 font-sans">
                          <li>Relational table optimizations.</li>
                          <li>Secure Supabase RLS policies.</li>
                          <li>pgvector semantic indexing.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="font-sans text-[13px] sm:text-sm space-y-1">
                    <h4 className="font-bold text-foreground text-sm sm:text-base">
                      My Engineering Focus
                    </h4>
                    <ul className="list-disc pl-4 space-y-0.5 text-[13px] sm:text-sm text-foreground/80 mt-1">
                      <li>Choose simple solutions over complex frameworks.</li>
                      <li>
                        Prioritize type safety, clear database schemas, and minimal dependencies.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeNode === "germany" && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="font-sans text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                      Education & Transition
                    </span>
                    <h3 className="font-sans text-2xl font-extrabold text-foreground">
                      MSc Computer Science at RPTU
                    </h3>
                    <p className="font-sans text-sm text-foreground/80">
                      Kaiserslautern, Germany (2025 - Present)
                    </p>
                  </div>

                  <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4 space-y-3 transition-all duration-300 hover:scale-[1.01] hover:bg-cyan-400/10 hover:border-cyan-400/30 cursor-default">
                    <span className="font-sans text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                      Academic & Transition Vector
                    </span>
                    <div className="relative border-l border-cyan-400/30 pl-4 ml-2 space-y-4 font-sans text-xs text-muted-foreground">
                      <div className="relative">
                        <span className="absolute -left-[21px] top-1 size-2 rounded-full bg-cyan-400" />
                        <span className="font-bold text-foreground">
                          Visvesvaraya Technological University (India)
                        </span>
                        <p className="text-[11px] mt-0.5">
                          Bachelor of Engineering in Computer Science (2021-2025)
                        </p>
                      </div>
                      <div className="relative">
                        <span className="absolute -left-[21px] top-1 size-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="font-bold text-foreground">
                          RPTU Kaiserslautern (Germany)
                        </span>
                        <p className="text-[11px] mt-0.5">
                          Master of Science in Computer Science (Specializing in Software
                          Engineering and Intelligent Systems)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-[13px] sm:text-sm">
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground text-sm sm:text-base">
                        Why I'm here
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-[13px] sm:text-sm text-foreground/80 mt-1">
                        <li>Study systems engineering and advanced computing concepts.</li>
                        <li>Build projects in a challenging international environment.</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground text-sm sm:text-base">
                        What I'm studying
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-[13px] sm:text-sm text-foreground/80 mt-1">
                        <li>M.Sc. in Computer Science at RPTU Kaiserslautern.</li>
                        <li>Specialization in Software Engineering and Intelligent Systems.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeNode === "leadership" && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="font-sans text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                      Leadership & Mentoring
                    </span>
                    <h3 className="font-sans text-2xl font-extrabold text-foreground">
                      Leadership & Mentorship
                    </h3>
                    <p className="font-sans text-sm text-foreground/80">
                      Leading teams, mentoring peers, and organizing student builder communities.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-5 space-y-2 transition-all duration-300 hover:scale-[1.02] hover:bg-rose-400/10 hover:border-rose-400/30 cursor-default min-h-[160px] flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="font-sans text-[10px] font-bold text-rose-300 uppercase">
                          Robotics Lead
                        </span>
                        <h5 className="font-sans text-sm font-bold text-foreground">
                          Robotics Team Lead
                        </h5>
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px] sm:text-[12px] text-rose-300/95 mt-1 font-sans">
                          <li>Led 10 members at Technoxian.</li>
                          <li>Coordinated physical build.</li>
                          <li>Wrote PID control loops in C++.</li>
                        </ul>
                      </div>
                    </div>
                    <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-5 space-y-2 transition-all duration-300 hover:scale-[1.02] hover:bg-rose-400/10 hover:border-rose-400/30 cursor-default min-h-[160px] flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="font-sans text-[10px] font-bold text-rose-300 uppercase">
                          Teaching Assistant
                        </span>
                        <h5 className="font-sans text-sm font-bold text-foreground">
                          JIT Workshop Lead
                        </h5>
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px] sm:text-[12px] text-rose-300/95 mt-1 font-sans">
                          <li>Delivered Python/OOP bootcamps.</li>
                          <li>Mentored 30+ students.</li>
                          <li>Conducted code reviews.</li>
                        </ul>
                      </div>
                    </div>
                    <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-5 space-y-2 transition-all duration-300 hover:scale-[1.02] hover:bg-rose-400/10 hover:border-rose-400/30 cursor-default min-h-[160px] flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="font-sans text-[10px] font-bold text-rose-300 uppercase">
                          Founder
                        </span>
                        <h5 className="font-sans text-sm font-bold text-foreground">
                          Entrepreneurship Club
                        </h5>
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px] sm:text-[12px] text-rose-300/95 mt-1 font-sans">
                          <li>Founded club at JIT college.</li>
                          <li>Organized startup panels.</li>
                          <li>Ran prototyping hackathons.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="font-sans text-[13px] sm:text-sm space-y-1">
                    <h4 className="font-bold text-foreground text-sm sm:text-base">
                      Why it matters
                    </h4>
                    <ul className="list-disc pl-4 space-y-0.5 text-[13px] sm:text-sm text-foreground/80 mt-1">
                      <li>
                        Leading teams and teaching taught me how to explain complex ideas simply.
                      </li>
                      <li>
                        Clear team communication is just as important as writing clean architecture.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeNode === "products" && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="font-sans text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      Why I Build
                    </span>
                    <h3 className="font-sans text-2xl font-extrabold text-foreground">
                      Product Portfolio
                    </h3>
                    <p className="font-sans text-sm text-foreground/80">
                      What real-world problems did I set out to solve with my applications?
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-5 space-y-2 transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-400/10 hover:border-emerald-400/30 cursor-default min-h-[160px] flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-sans text-sm sm:text-base font-bold text-foreground">
                            Lumen
                          </h4>
                          <span className="font-sans text-[9px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20 font-bold">
                            Problem: Clutter
                          </span>
                        </div>
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px] sm:text-[12px] text-foreground/80 mt-1 font-sans">
                          <li>Cleans cluttered articles.</li>
                          <li>Generates 3 summary cards.</li>
                          <li>Chat directly with the text.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-5 space-y-2 transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-400/10 hover:border-emerald-400/30 cursor-default min-h-[160px] flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-sans text-sm sm:text-base font-bold text-foreground">
                            Effortless
                          </h4>
                          <span className="font-sans text-[9px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20 font-bold">
                            Problem: AI Flags
                          </span>
                        </div>
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px] sm:text-[12px] text-foreground/80 mt-1 font-sans">
                          <li>Proves human authorship.</li>
                          <li>Verifies typing speed/habits.</li>
                          <li>Stores zero content.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-5 space-y-2 transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-400/10 hover:border-emerald-400/30 cursor-default min-h-[160px] flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-sans text-sm sm:text-base font-bold text-foreground">
                            Tracely
                          </h4>
                          <span className="font-sans text-[9px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20 font-bold">
                            Problem: Copy-Paste
                          </span>
                        </div>
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px] sm:text-[12px] text-foreground/80 mt-1 font-sans">
                          <li>Organizes job searches.</li>
                          <li>Extracts details from descriptions.</li>
                          <li>Maintains statuses & tags.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="font-sans text-[13px] sm:text-sm space-y-1">
                    <h4 className="font-bold text-foreground text-sm sm:text-base">Why I Ship</h4>
                    <ul className="list-disc pl-4 space-y-0.5 text-[13px] sm:text-sm text-foreground/80 mt-1">
                      <li>Solve immediate personal or department-level bottlenecks.</li>
                      <li>Focus on lightweight, privacy-focused, useful tools.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeNode === "automation" && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="font-sans text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      System Automation
                    </span>
                    <h3 className="font-sans text-2xl font-extrabold text-foreground">
                      VTU Result Automation & Lead Generation
                    </h3>
                    <p className="font-sans text-sm text-foreground/80">
                      Parsing, structuring, and reporting data at scale
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 space-y-3 transition-all duration-300 hover:scale-[1.01] hover:bg-amber-400/10 hover:border-amber-400/30 cursor-default">
                    <span className="font-sans text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                      VTU Parser Stats (Department-Wide)
                    </span>
                    <div className="flex flex-col gap-2 font-sans text-xs text-foreground/80 font-medium">
                      <div className="flex justify-between border-b border-border/30 pb-1">
                        <span>Parsing Engine</span>
                        <span className="text-amber-400 font-semibold">Python / Selenium</span>
                      </div>
                      <div className="flex justify-between border-b border-border/30 pb-1">
                        <span>Distribution Scope</span>
                        <span className="text-amber-400 font-semibold">
                          Multiple Departments (JIT)
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-border/30 pb-1">
                        <span>Data Storage</span>
                        <span className="text-amber-400 font-semibold">Excel (.xlsx / .xls)</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-[13px] sm:text-sm">
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground text-sm sm:text-base">
                        College Result Automator
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-[13px] sm:text-sm text-foreground/80 mt-1">
                        <li>
                          Selenium browser script to crawl university grade portals and parse data.
                        </li>
                        <li>
                          Saves department staff hours of typing by exporting directly to formatted
                          Excel sheets.
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground text-sm sm:text-base">
                        Targetgrid Internship
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-[13px] sm:text-sm text-foreground/80 mt-1">
                        <li>
                          Wrote Python scripts and REST integrations to collect and parse lead data.
                        </li>
                        <li>
                          Replaced manual, slow data gathering with automated collection pipelines.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeNode === "robotics" && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="font-sans text-[11px] font-bold text-pink-400 uppercase tracking-wider">
                      Robotics & Firmware
                    </span>
                    <h3 className="font-sans text-2xl font-extrabold text-foreground">
                      PID Rigs & Robotics
                    </h3>
                    <p className="font-sans text-sm text-foreground/80">
                      Arduino & ESP8266 controller architectures
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-[13px] sm:text-sm">
                    <div className="rounded-xl border border-pink-400/20 bg-pink-400/5 p-5 space-y-2 transition-all duration-300 hover:scale-[1.02] hover:bg-pink-400/10 hover:border-pink-400/30 cursor-default flex flex-col justify-between min-h-[120px]">
                      <div>
                        <h4 className="font-bold text-foreground text-sm sm:text-base mb-1">
                          JITHACK Robotic Arm
                        </h4>
                        <ul className="list-disc pl-4 space-y-0.5 text-[12px] sm:text-xs text-foreground/80 mt-1">
                          <li>Built physical arm using stepper controllers and servo motors.</li>
                          <li>Programmed WiFi control loops using ESP8266 microcontroller.</li>
                          <li>Won 3rd place at JITHACK 2023.</li>
                        </ul>
                      </div>
                    </div>
                    <div className="rounded-xl border border-pink-400/20 bg-pink-400/5 p-5 space-y-2 transition-all duration-300 hover:scale-[1.02] hover:bg-pink-400/10 hover:border-pink-400/30 cursor-default flex flex-col justify-between min-h-[120px]">
                      <div>
                        <h4 className="font-bold text-foreground text-sm sm:text-base mb-1">
                          Technoxian Robot Control
                        </h4>
                        <ul className="list-disc pl-4 space-y-0.5 text-[12px] sm:text-xs text-foreground/80 mt-1">
                          <li>Led a 10-member team at the Technoxian International Contest.</li>
                          <li>
                            Programmed PID control loops to balance the robot on high-speed tracks.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="font-sans text-[13px] sm:text-sm space-y-1">
                    <h4 className="font-bold text-foreground text-sm sm:text-base">
                      What I learned
                    </h4>
                    <ul className="list-disc pl-4 space-y-0.5 text-[13px] sm:text-sm text-foreground/80 mt-1">
                      <li>
                        Physical hardware deals with noisy sensors, battery drops, and real-world
                        friction.
                      </li>
                      <li>
                        Writing firmware teaches you to write highly resilient, edge-case-tested
                        code.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions inside detailed panel */}
            <div className="mt-4 border-t border-border/40 pt-3 flex justify-between items-center text-xs font-sans text-muted-foreground">
              <span>Samarth.OS v1.2</span>
              <button
                onClick={() => setActiveNode(null)}
                className="hover:text-foreground underline cursor-pointer"
              >
                [close detail view]
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
