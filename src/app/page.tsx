"use client";

import { useState } from "react";

// ============================================================
// SHARED STYLES & COMPONENTS
// ============================================================

const SectionHeader = ({ label }: { label: string }) => (
  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#94A3B8", marginBottom: 16 }}>
    {label}
  </div>
);

const Card = ({ children, style }: { children: any; style?: any }) => (
  <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.1)", borderRadius: 12, padding: 24, ...style }}>
    {children}
  </div>
);

const DotList = ({ items, color, dimColor }: { items: string[]; color?: string; dimColor?: string }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {items.map((item, i) => (
      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: color || "#94A3B8", marginTop: 7, flexShrink: 0, boxShadow: color ? `0 0 6px ${color}40` : "none" }} />
        <span style={{ fontSize: 15, color: dimColor || "#CBD5E1", lineHeight: 1.55 }}>{item}</span>
      </div>
    ))}
  </div>
);

// ============================================================
// PAGE DATA
// ============================================================

const pages = [
  { id: "timeline", label: "AI Evolution", icon: "◈" },
  { id: "framework", label: "Knowledge Levels", icon: "◆" },
];

// --- Timeline data ---
const eras = [
  {
    id: 1, years: "2022–2023", title: "The Chat Revolution", tagline: "AI goes mainstream overnight",
    color: "#3B82F6", icon: "💬",
    summary: "ChatGPT launched November 30, 2022 and reached 100 million users in two months — the fastest-growing consumer application in history. For most people, this was their first interaction with a large language model.",
    capabilities: ["Natural language Q&A and conversation", "Essay writing, summarization, translation", "Simple code generation and explanation", "Brainstorming and creative ideation"],
    limitations: ["Frequent hallucination — confidently wrong answers", "No internet access or real-time information", "Text-only — couldn't process images or documents", "Short context windows (~8K tokens, a few pages)"],
    milestones: [
      { date: "Nov 2022", event: "ChatGPT launches (GPT-3.5)", highlight: true },
      { date: "Feb 2023", event: "Microsoft integrates GPT into Bing" },
      { date: "Mar 2023", event: "GPT-4 releases — major reasoning leap", highlight: true },
      { date: "Mar 2023", event: "Anthropic launches Claude 1" },
      { date: "Mar 2023", event: "Google launches Bard" },
      { date: "Jul 2023", event: "Meta releases Llama 2 (open source)", highlight: true },
      { date: "Nov 2023", event: "OpenAI launches custom GPTs" },
    ],
    enterprise: "Most adoption was experimental — individuals trying ChatGPT for emails and brainstorming. No organizational AI strategy existed yet. This was the 'try it and see' era.",
  },
  {
    id: 2, years: "2024", title: "Reasoning & Multimodal AI", tagline: "AI learns to think and see",
    color: "#8B5CF6", icon: "🧠",
    summary: "2024 was the year AI models learned to reason step-by-step, process images and documents, and follow complex multi-step instructions. Context windows expanded from pages to entire books.",
    capabilities: ["Chain-of-thought reasoning on complex problems", "Image, PDF, and document analysis", "1M+ token context windows (entire codebases)", "Computer use — AI controlling screen interfaces"],
    limitations: ["Reasoning models were slow and expensive", "Computer use was experimental and error-prone", "Still primarily a Q&A tool, not an action-taker", "Enterprise integration remained difficult"],
    milestones: [
      { date: "Feb 2024", event: "Gemini 1.5 Pro — 1M token context window", highlight: true },
      { date: "Mar 2024", event: "Claude 3 launches (Opus, Sonnet, Haiku)" },
      { date: "May 2024", event: "GPT-4o — text, image, audio, video in one model" },
      { date: "Jun 2024", event: "Claude 3.5 Sonnet — cheaper beats bigger", highlight: true },
      { date: "Sep 2024", event: "OpenAI o1 — first dedicated reasoning model", highlight: true },
      { date: "Oct 2024", event: "Claude 3.5 Sonnet v2 with Computer Use" },
      { date: "Dec 2024", event: "Gemini 2.0 Flash with agentic features" },
    ],
    enterprise: "Organizations moved from experimentation to pilot programs. AI could now process documents and reason through complex workflows — making it relevant for healthcare, finance, and legal applications.",
  },
  {
    id: 3, years: "2025", title: "The Coding Assistant Wave", tagline: "AI starts building things",
    color: "#EC4899", icon: "⚡",
    summary: "AI transitioned from answering questions about code to actually writing, testing, and deploying it. Claude Code and Codex turned natural language into functional software. 'Vibe coding' entered the vocabulary.",
    capabilities: ["Full-file code generation from natural language", "Terminal-native agents that read, write, test, and commit code", "End-to-end project creation and deployment", "Multi-step debugging and refactoring"],
    limitations: ["Still single-agent — one AI doing everything", "Complex integrations required significant human guidance", "Production quality varied — good for prototypes, risky for critical systems", "Non-developers still largely excluded from building"],
    milestones: [
      { date: "Feb 2025", event: "Claude Code launches (research preview)", highlight: true },
      { date: "Feb 2025", event: "Claude 3.7 Sonnet — extended thinking" },
      { date: "May 2025", event: "Claude 4 launches — professional-grade coding", highlight: true },
      { date: "May 2025", event: "OpenAI Codex launches as cloud coding agent", highlight: true },
      { date: "Aug 2025", event: "GPT-5 launches — unified reasoning + intelligence" },
      { date: "Oct 2025", event: "Claude Sonnet 4.5 — best cost-to-performance ratio" },
      { date: "Nov 2025", event: "Claude Code hits $1B annualized revenue" },
      { date: "Nov 2025", event: "Claude Opus 4.5 — reclaims coding benchmark lead" },
      { date: "Dec 2025", event: "GPT-5.2 launches — 400K context, three modes" },
    ],
    enterprise: "The developer workflow fundamentally shifted. Plan with AI → generate with a coding agent → review → deploy. People who couldn't code were building functional applications. AI became a building tool, not just a writing assistant.",
  },
  {
    id: 4, years: "2026", title: "The Orchestration Era", tagline: "From writing code to directing AI teams",
    color: "#F59E0B", icon: "🎯",
    summary: "The current era. Practitioners no longer write code — they orchestrate AI systems. Multiple specialized agents coordinate on projects. The role evolved from 'developer' to 'AI director.'",
    capabilities: ["Multi-agent teams dividing and coordinating work", "Planning engines + build engines as separate roles", "Non-developers building production software via Cowork", "MCP connecting AI to databases, payments, APIs, and enterprise systems"],
    limitations: ["Multi-agent coordination can fail on complex dependencies", "Autonomous agents in regulated environments require governance", "Costs scale with complexity — multi-agent runs aren't cheap", "Organizational readiness still lags tool capabilities"],
    milestones: [
      { date: "Jan 2026", event: "Claude Cowork launches — GUI agent for non-developers", highlight: true },
      { date: "Jan 2026", event: "GPT-5.2-Codex — agentic coding with context compaction" },
      { date: "Feb 2026", event: "Claude Opus 4.6 — 1M context, Agent Teams", highlight: true },
      { date: "Feb 2026", event: "Claude Sonnet 4.6 — matches prior Opus at ¼ cost" },
      { date: "Feb 2026", event: "Codex desktop app — multi-agent management" },
      { date: "Mar 2026", event: "GPT-5.4 launches — Codex surpasses 2M weekly users", highlight: true },
      { date: "Mar 2026", event: "Claude Agent SDK — build production agents as a library" },
      { date: "Mar 2026", event: "MCP ecosystem matures — connects AI to everything" },
    ],
    enterprise: "The competitive advantage is no longer access to better AI — everyone has frontier models. It's how fast an organization adopts AI into workflows. Data quality is the bottleneck, not model quality. McKesson's data moat (Ontada, Compile, distribution) is the differentiator.",
  },
];

const stats = [
  { label: "Enterprise AI Adoption", values: ["~55%", "~72%", "~88%", "90%+"] },
  { label: "Max Context Window", values: ["32K tokens", "1M tokens", "1M tokens", "1M+ (GA)"] },
  { label: "AI Equity Investment", values: ["~$50B", "~$95B", "$124B+", "Growing"] },
  { label: "Agentic AI Jobs", values: ["Negligible", "Emerging", "985% YoY growth", "Mainstream"] },
];

// --- Framework data ---
const levels = [
  { level: 1, title: "AI User", subtitle: "Effective Prompting & Interpretation", analogy: "Knows how to drive the car", color: "#3B82F6",
    description: "Can interact with conversational AI models to get useful results. Understands basic prompting principles and can iterate to improve output quality.",
    competencies: ["Crafts clear, specific prompts that produce actionable results", "Iterates on prompts — refines based on output quality", "Recognizes when AI output is wrong or hallucinated", "Uses AI for writing, summarization, research, and brainstorming", "Understands basic limitations and knowledge cutoffs", "Familiar with at least one major AI platform"],
    interview: [{ type: "Prompt Refinement", desc: "Give a vague prompt and ask them to improve it" }, { type: "Output Evaluation", desc: "Show an AI response with subtle errors — can they spot them?" }, { type: "Use Case ID", desc: "Describe 3 ways they'd use AI in their current role" }],
  },
  { level: 2, title: "AI Project Designer", subtitle: "Context Engineering & Persona Design", analogy: "Plans the route and configures the GPS", color: "#8B5CF6",
    description: "Structures AI projects within platforms like Claude Projects or ChatGPT. Designs persistent context — instructions, personas, and reference materials — that shape AI behavior across an entire body of work.",
    competencies: ["Creates projects with custom instructions and knowledge files", "Writes system-level instructions defining tone, scope, and constraints", "Designs persona-based approaches (PM, developer, QA, domain expert)", "Curates and uploads reference documents for domain context", "Uses conversation starters and templates for team workflows", "Fluent in markdown formatting for AI instructions"],
    interview: [{ type: "Project Design", desc: "Set up an AI assistant for the sales team — walk through it" }, { type: "Persona Creation", desc: "What personas for a revenue cycle optimization project?" }, { type: "Instruction Writing", desc: "Write system instructions for a Claude Project scenario" }],
  },
  { level: 3, title: "AI Builder", subtitle: "Prototypes & Simple Applications", analogy: "Builds a go-kart using AI-powered tools", color: "#EC4899",
    description: "Uses AI coding tools to generate functional websites, components, and straightforward applications. Can take an idea from concept to working prototype using AI-assisted development.",
    competencies: ["Uses Claude Code, Codex, or Cursor to generate working code", "Builds websites, landing pages, and simple interactive apps", "Uses AI as a planning engine for requirements and task breakdowns", "Deploys simple projects via GitHub and Vercel", "Creates and modifies basic database schemas with AI help", "Can read and evaluate AI-generated code for obvious errors"],
    interview: [{ type: "Build Walkthrough", desc: "Describe something you've built with AI coding tools" }, { type: "Code Review", desc: "Identify a bug in AI-generated code and describe a fix" }, { type: "Tool Selection", desc: "What tools to build a simple internal task tracker?" }],
  },
  { level: 4, title: "AI Developer", subtitle: "Full-Stack Production Systems", analogy: "Builds and ships a production vehicle with all systems connected", color: "#F59E0B",
    description: "Orchestrates full-stack, production-grade applications using AI-assisted development. Manages complex integrations — authentication, payments, messaging — across multi-service architectures.",
    competencies: ["Architects multi-service apps: frontend, backend, database, deployment", "Integrates OAuth, Stripe, Twilio, analytics, and external APIs", "Connects AI to tools and data sources via MCP", "Designs relational schemas with RLS, triggers, and migrations", "Manages environments, secrets, and production safeguards", "Orchestrates agentic workflows with human-in-the-loop patterns"],
    interview: [{ type: "Architecture Design", desc: "Design a patient portal with scheduling, messaging, and insurance verification" }, { type: "Integration Scenario", desc: "Add Stripe billing to an existing Next.js + Supabase app" }, { type: "Debugging", desc: "Stripe webhooks aren't updating Supabase — diagnose it" }],
  },
  { level: 5, title: "AI Architect", subtitle: "LLM Customization & System Design", analogy: "Designs and modifies the engine itself", color: "#EF4444",
    description: "Works directly with LLM internals — fine-tuning models, customizing training data, designing multi-model systems, and building novel agentic architectures. Extends, adapts, and creates AI tools.",
    competencies: ["Fine-tunes LLMs on proprietary or domain-specific datasets", "Designs training data pipelines: collection, cleaning, labeling", "Understands transformer internals, attention, tokenization", "Builds custom agentic reasoning and decision-making systems", "Implements RAG pipelines with custom embedding strategies", "Manages model deployment: optimization, cost, scaling, monitoring"],
    interview: [{ type: "System Design", desc: "Design an AI system for automated claims adjudication" }, { type: "Fine-tuning", desc: "When to fine-tune vs. RAG vs. prompt engineering?" }, { type: "Multi-Agent", desc: "Design a multi-agent system for drug distribution logistics" }],
  },
];

const roleMapping = [
  { role: "Business analyst, operations, clinical, sales", levels: "2–3", bar: 2.5 },
  { role: "Product manager, project manager, team lead", levels: "3–4", bar: 3.5 },
  { role: "Software developer, data analyst, IT", levels: "3–5", bar: 4 },
  { role: "AI/ML engineer, platform architect", levels: "4–5", bar: 4.5 },
  { role: "Executive, VP, director", levels: "2–3", bar: 2.5 },
];

// ============================================================
// PAGE: AI EVOLUTION TIMELINE
// ============================================================

function TimelinePage() {
  const [activeEra, setActiveEra] = useState(null);
  const selected = activeEra !== null ? eras[activeEra] : null;

  return (
    <>
      {/* Header */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 0" }}>
        <h1 style={{ fontSize: 42, fontWeight: 700, color: "#F1F5F9", margin: "0 0 8px", lineHeight: 1.15 }}>
          The Evolution of AI
        </h1>
        <p style={{ fontSize: 17, color: "#94A3B8", margin: 0, maxWidth: 660, lineHeight: 1.6 }}>
          From ChatGPT's launch to the orchestration era — how AI transformed from a chatbot into an autonomous building tool in under four years.
        </p>
      </div>

      {/* Timeline nodes */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{ position: "relative", marginBottom: 40 }}>
          <div style={{ position: "absolute", top: 28, left: 0, right: 0, height: 2, background: "rgba(148,163,184,0.1)", zIndex: 0 }} />
          {activeEra !== null && (
            <div style={{ position: "absolute", top: 28, left: 0, height: 2, zIndex: 1, width: `${((activeEra + 1) / eras.length) * 100}%`, background: `linear-gradient(90deg, ${eras[0].color}, ${eras[activeEra].color})`, transition: "width 0.4s ease" }} />
          )}
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
            {eras.map((era, i) => {
              const isActive = activeEra === i;
              return (
                <button key={era.id} onClick={() => setActiveEra(isActive ? null : i)}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 0, outline: "none", flex: 1 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                    background: isActive ? `${era.color}25` : "rgba(15,23,42,0.8)",
                    border: `2px solid ${isActive ? era.color : "rgba(148,163,184,0.2)"}`,
                    transition: "all 0.3s ease", boxShadow: isActive ? `0 0 24px ${era.color}30` : "none",
                  }}>{era.icon}</div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: isActive ? era.color : "#94A3B8", transition: "color 0.2s ease" }}>{era.years}</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: isActive ? "#FFFFFF" : "#E2E8F0", transition: "color 0.2s ease", textAlign: "center", lineHeight: 1.2 }}>{era.title}</span>
                  <span style={{ fontSize: 13, color: isActive ? "#CBD5E1" : "#64748B", transition: "color 0.2s ease", textAlign: "center", maxWidth: 200 }}>{era.tagline}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {eras.map((era, i) => (
            <div key={era.id} style={{ flex: 1, height: 3, borderRadius: 2, background: activeEra === i ? era.color : "rgba(148,163,184,0.1)", transition: "all 0.3s ease" }} />
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 0", animation: "fadeIn 0.35s ease" }}>
          <p style={{ fontSize: 17, color: "#E2E8F0", lineHeight: 1.7, margin: "0 0 28px", maxWidth: 800 }}>{selected.summary}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <Card><SectionHeader label="What AI Could Do" /><DotList items={selected.capabilities} color={selected.color} /></Card>
            <Card><SectionHeader label="What It Couldn't Do Yet" /><DotList items={selected.limitations} dimColor="#94A3B8" /></Card>
          </div>
          <Card style={{ marginBottom: 20, padding: 22 }}>
            <SectionHeader label="Key Milestones" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 8 }}>
              {selected.milestones.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, background: m.highlight ? `${selected.color}0C` : "transparent", border: m.highlight ? `1px solid ${selected.color}20` : "1px solid transparent" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: selected.color, whiteSpace: "nowrap", minWidth: 72 }}>{m.date}</span>
                  <span style={{ fontSize: 14, color: m.highlight ? "#E2E8F0" : "#CBD5E1", fontWeight: m.highlight ? 600 : 400 }}>{m.event}</span>
                </div>
              ))}
            </div>
          </Card>
          <div style={{ padding: "18px 22px", background: `${selected.color}08`, border: `1px solid ${selected.color}18`, borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 14 }}>
            <span style={{ fontSize: 16, color: selected.color, marginTop: 1 }}>◆</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: selected.color, marginBottom: 6 }}>What This Meant for Enterprise</div>
              <span style={{ fontSize: 15, color: "#CBD5E1", lineHeight: 1.65 }}>{selected.enterprise}</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats table */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px 0" }}>
        <SectionHeader label="The Numbers Tell the Story" />
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "200px repeat(4, 1fr)", borderBottom: "1px solid rgba(148,163,184,0.1)", padding: "14px 20px" }}>
            <span />
            {eras.map((era, i) => (
              <span key={era.id} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: activeEra === i ? era.color : "#94A3B8", textAlign: "center", transition: "color 0.2s ease" }}>{era.years}</span>
            ))}
          </div>
          {stats.map((stat, si) => (
            <div key={si} style={{ display: "grid", gridTemplateColumns: "200px repeat(4, 1fr)", padding: "12px 20px", borderBottom: si < stats.length - 1 ? "1px solid rgba(148,163,184,0.06)" : "none" }}>
              <span style={{ fontSize: 13, color: "#94A3B8" }}>{stat.label}</span>
              {stat.values.map((v, vi) => (
                <span key={vi} style={{ fontSize: 13, textAlign: "center", fontWeight: activeEra === vi ? 600 : 400, color: activeEra === vi ? eras[vi].color : "#CBD5E1", transition: "all 0.2s ease" }}>{v}</span>
              ))}
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}

// ============================================================
// PAGE: KNOWLEDGE LEVELS FRAMEWORK
// ============================================================

function FrameworkPage() {
  const [activeLevel, setActiveLevel] = useState(null);
  const selected = activeLevel !== null ? levels[activeLevel] : null;

  return (
    <>
      {/* Header */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 0" }}>
        <h1 style={{ fontSize: 42, fontWeight: 700, color: "#F1F5F9", margin: "0 0 8px", lineHeight: 1.15 }}>AI Knowledge Levels</h1>
        <p style={{ fontSize: 17, color: "#94A3B8", margin: 0, maxWidth: 620, lineHeight: 1.6 }}>
          Five tiers of AI proficiency — from effective prompting to LLM architecture. Select a level to explore competencies and interview criteria.
        </p>
      </div>

      {/* Stair-step */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 300 }}>
          {levels.map((l, i) => {
            const isActive = activeLevel === i;
            const height = 80 + i * 52;
            return (
              <button key={l.level} onClick={() => setActiveLevel(isActive ? null : i)}
                style={{
                  flex: 1, height, border: `1.5px solid ${isActive ? l.color : "rgba(148,163,184,0.2)"}`, borderRadius: 12,
                  background: isActive ? `linear-gradient(180deg, ${l.color}22 0%, ${l.color}08 100%)` : "rgba(15,23,42,0.6)",
                  cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "flex-start", padding: "14px 14px",
                  overflow: "hidden", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", outline: "none",
                  boxShadow: isActive ? `0 0 30px ${l.color}15, 0 4px 20px rgba(0,0,0,0.3)` : "0 2px 8px rgba(0,0,0,0.2)",
                }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: isActive ? l.color : "#94A3B8", letterSpacing: 1 }}>LVL {l.level}</span>
                  {isActive && <div style={{ width: 7, height: 7, borderRadius: "50%", background: l.color, boxShadow: `0 0 10px ${l.color}` }} />}
                </div>
              </button>
            );
          })}
        </div>
        {/* Title row */}
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {levels.map((l, i) => {
            const isActive = activeLevel === i;
            return (
              <div key={l.level} style={{ flex: 1, cursor: "pointer", padding: "0 4px" }} onClick={() => setActiveLevel(isActive ? null : i)}>
                <div style={{ fontSize: 20, fontWeight: 700, color: isActive ? "#FFFFFF" : "#E2E8F0", marginBottom: 4, lineHeight: 1.2, transition: "color 0.2s ease" }}>{l.title}</div>
                <div style={{ fontSize: 13, color: isActive ? "#CBD5E1" : "#94A3B8", lineHeight: 1.4, transition: "color 0.2s ease" }}>{l.subtitle}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
          {levels.map((l, i) => (
            <div key={l.level} style={{ flex: 1, height: 3, borderRadius: 2, background: activeLevel === i ? l.color : "rgba(148,163,184,0.12)", transition: "all 0.3s ease" }} />
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 0", animation: "fadeIn 0.3s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: `${selected.color}15`, border: `1px solid ${selected.color}30`, marginBottom: 20 }}>
            <span style={{ fontSize: 13, color: selected.color }}>✦</span>
            <span style={{ fontSize: 13, color: selected.color, fontWeight: 500 }}>{selected.analogy}</span>
          </div>
          <p style={{ fontSize: 17, color: "#E2E8F0", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 740 }}>{selected.description}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Card>
              <SectionHeader label="Expected Competencies" />
              <DotList items={selected.competencies} color={selected.color} />
            </Card>
            <Card>
              <SectionHeader label="Interview Assessment" />
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {selected.interview.map((item, i) => (
                  <div key={i} style={{ padding: "14px 16px", background: `${selected.color}08`, border: `1px solid ${selected.color}18`, borderRadius: 8 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, color: selected.color, marginBottom: 4, letterSpacing: 0.5 }}>{item.type}</div>
                    <div style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Role mapping */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 0" }}>
        <SectionHeader label="Target Levels by Role" />
        <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {roleMapping.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "280px 60px 1fr", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 14, color: "#CBD5E1" }}>{r.role}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#E2E8F0", fontWeight: 600 }}>{r.levels}</span>
              <div style={{ height: 6, borderRadius: 3, background: "rgba(148,163,184,0.08)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(r.bar / 5) * 100}%`, borderRadius: 3, background: `linear-gradient(90deg, ${levels[0].color}, ${levels[Math.min(Math.round(r.bar) - 1, 4)].color})`, opacity: 0.7, transition: "width 0.5s ease" }} />
              </div>
            </div>
          ))}
        </Card>
        <div style={{ marginTop: 32, padding: "16px 20px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span style={{ color: "#3B82F6", fontSize: 14, marginTop: 1 }}>◆</span>
          <span style={{ fontSize: 14, color: "#CBD5E1", lineHeight: 1.6 }}>
            <strong style={{ color: "#F1F5F9" }}>Level 2 is the floor.</strong>{" "}
            Every role should target at least Level 2 — the ability to structure AI projects, design personas, and engineer context. Levels are cumulative: a Level 4 candidate demonstrates all prior competencies.
          </span>
        </div>
      </div>
    </>
  );
}

// ============================================================
// MAIN APP WITH TAB NAVIGATION
// ============================================================

export default function App() {
  const [activePage, setActivePage] = useState("timeline");

  return (
    <div style={{ minHeight: "100vh", background: "#0B0F1A", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>

      {/* Navigation bar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(11,15,26,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(148,163,184,0.08)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          {/* Logo / Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6", boxShadow: "0 0 10px #3B82F6" }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: "#E2E8F0", letterSpacing: 0.5 }}>AI Futures</span>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            {pages.map((page) => {
              const isActive = activePage === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => setActivePage(page.id)}
                  style={{
                    background: isActive ? "rgba(59,130,246,0.12)" : "transparent",
                    border: isActive ? "1px solid rgba(59,130,246,0.25)" : "1px solid transparent",
                    borderRadius: 8, padding: "8px 16px", cursor: "pointer", outline: "none",
                    display: "flex", alignItems: "center", gap: 8,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(148,163,184,0.06)"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize: 13, color: isActive ? "#3B82F6" : "#64748B" }}>{page.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, color: isActive ? "#E2E8F0" : "#94A3B8", transition: "color 0.2s ease" }}>{page.label}</span>
                </button>
              );
            })}
          </div>

          {/* Credit */}
          <span style={{ fontSize: 11, color: "#475569", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5 }}>
            Dan Lodder · 2026
          </span>
        </div>
      </nav>

      {/* Page content */}
      <div key={activePage} style={{ animation: "fadeIn 0.3s ease" }}>
        {activePage === "timeline" && <TimelinePage />}
        {activePage === "framework" && <FrameworkPage />}
      </div>

      {/* Footer spacer */}
      <div style={{ height: 64 }} />
    </div>
  );
}
