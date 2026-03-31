"use client";
import { useState } from "react";

// ============================================================
// SHARED STYLES & COMPONENTS
// ============================================================

const FONT_LINK = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";

const SectionHeader = ({ label }: { label: string }) => (
  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#C4D0DE", marginBottom: 16 }}>
    {label}
  </div>
);

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.1)", borderRadius: 12, padding: 24, ...style }}>
    {children}
  </div>
);

const DotList = ({ items, color, dimColor = "#E2EAF2" }: { items: string[]; color?: string; dimColor?: string }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {items.map((item, i) => (
      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: color || "#C4D0DE", marginTop: 7, flexShrink: 0, boxShadow: color ? `0 0 6px ${color}40` : "none" }} />
        <span style={{ fontSize: 15, color: dimColor, lineHeight: 1.55 }}>{item}</span>
      </div>
    ))}
  </div>
);

// ============================================================
// GLIDE STACK DATA
// ============================================================

const dataLayer = [
  {
    id: "rcm",
    title: "Revenue Cycle Management",
    color: "#3B82F6",
    items: ["Claims (837P / 837I)", "Prior authorization", "EOB / ERA processing", "J-code billing", "Denial management", "CAR-T billing", "Remittance reconciliation"],
  },
  {
    id: "inventory",
    title: "Inventory Management",
    color: "#8B5CF6",
    items: ["Drug stock levels", "Lot & serial tracking", "Cold chain monitoring", "Expiry management", "Reorder triggers", "Specialty drug handling", "Warehouse fulfillment"],
  },
  {
    id: "pricing",
    title: "Distribution Pricing & Rebates",
    color: "#EC4899",
    items: ["WAC — wholesale acquisition cost", "Contract price", "OID discounts", "FFS distribution fees", "Buy-side rebates", "Net cost recovery", "Margin waterfall"],
  },
  {
    id: "gpo",
    title: "GPO Rebates",
    color: "#F59E0B",
    items: ["Manufacturer rebates", "Tier qualification logic", "GPO admin fees", "Rebate tier thresholds", "Contract compliance", "GVI rebate feeds", "Back-end economics"],
  },
  {
    id: "mid",
    title: "MID Data",
    color: "#10B981",
    items: ["In-office dispensing", "Practice Rx purchases", "PMID transactions", "Practice pharmacy ops", "Drug utilization rates", "Dispensing economics"],
  },
  {
    id: "payer",
    title: "Payer Policy Surveillance",
    color: "#06B6D4",
    items: ["Formulary status", "Step therapy requirements", "Prior auth criteria", "Coverage policies", "Preferred drug lists", "Mid-quarter changes", "Commercial & Medicare rules"],
  },
  {
    id: "biosimilar",
    title: "Biosimilar Utilization",
    color: "#EF4444",
    items: ["Reference drug tracking", "Biosimilar adoption rates", "Biosimilar selection", "Payer preference signals", "Cost delta analysis", "Interchangeability status"],
  },
  {
    id: "account",
    title: "Customer & Account Data",
    color: "#A78BFA",
    items: ["Practice demographics", "Account tier & segment", "Contract history", "Renewal dates & terms", "GPO affiliation", "Field rep assignments", "Retention risk signals"],
  },
];

const intelligenceLayer = [
  {
    id: "ml",
    title: "Machine Learning",
    subtitle: "Pattern recognition",
    color: "#8B5CF6",
    capabilities: ["Predictive pricing models", "Win / loss signal learning", "Margin forecasting", "Demand & utilization forecasting", "Anomaly detection", "Learning loops on deal outcomes"],
    usedBy: ["Nova 2.0", "X-Ray"],
  },
  {
    id: "prompting",
    title: "AI Prompting Tools",
    subtitle: "LLM interfaces",
    color: "#3B82F6",
    capabilities: ["Natural language to SQL", "Conversational Q&A on live data", "RAG — retrieval-augmented generation", "Document extraction & synthesis", "Explainable, grounded answers", "Pricing guidance chat"],
    usedBy: ["Skynet", "Nova 2.0", "Titan", "X-Ray"],
  },
  {
    id: "agents",
    title: "Agents",
    subtitle: "Automated workflows",
    color: "#F59E0B",
    capabilities: ["24/7 payer policy surveillance", "Automated document extraction", "Deal orchestration pipelines", "Multi-step data acquisition", "Scheduled monitoring & alerting", "Approval workflow automation"],
    usedBy: ["Titan", "Nova 2.0", "X-Ray"],
  },
];

const projects = [
  {
    id: "titan", name: "Titan", tagline: "Payer policy intelligence",
    color: "#F59E0B", status: "Live", statusColor: "#10B981",
    description: "Eliminates the quarterly manual grind for payer policy tracking. Continuously monitors formularies, step therapy requirements, and preferred drug lists across oncology drugs and biosimilars — delivering verified, real-time coverage intelligence to prevent claim denials.",
    capabilities: ["24/7 automated payer surveillance", "Formulary & step therapy extraction", "Preferred drug list monitoring", "Audit-ready governance trail", "Real-time API + clean UI delivery"],
    dataInputs: ["Payer Policy Surveillance", "Biosimilar Utilization"],
    intelligenceUsed: ["Agents", "AI Prompting Tools"],
    impact: "Removes administrative barriers for cancer patients — ensures the right drug is verified before treatment, not after a denial.",
  },
  {
    id: "nova", name: "Nova 2.0", tagline: "AI pricing engine",
    color: "#10B981", status: "In dev", statusColor: "#3B82F6",
    description: "Replaces the Excel-based pricing model end-to-end. Automates buy/sell economics across WAC, contract price, VCD, FFS, GPO admin fees, and OIDs. Phase 3 adds AI deal recommendations. Phase 4 deploys small-account autonomy and field enablement. Estimated $28–45M upside.",
    capabilities: ["Automated WAC / GPO / OID waterfall", "Real-time what-if scenario modeling", "AI deal recommendations (Phase 3)", "SOX-compliant approval workflows", "Drug-level and account-level P&L", "LLM pricing guidance chat"],
    dataInputs: ["Distribution Pricing & Rebates", "GPO Rebates", "Customer & Account Data"],
    intelligenceUsed: ["Machine Learning", "AI Prompting Tools"],
    impact: "$28–45M upside through improved pricing efficiency. Compresses analyst time per deal and systematically protects margin on every renewal.",
  },
  {
    id: "xray", name: "X-Ray", tagline: "Net price dashboard",
    color: "#3B82F6", status: "Building", statusColor: "#F59E0B",
    description: "Unifies the drug pricing silos into one net price / cost recovery view. Forces the data access and governance decisions that Nova 2.0 Phase II requires — rebate feeds, buy-side fees, and a single source of truth. The data backbone for the entire pricing platform.",
    capabilities: ["WAC − OID − rebate = net cost recovery", "Unified pricing silo dashboard", "Economics waterfall visualization", "Internal + potential customer-facing views", "Real-time rebate feed integration"],
    dataInputs: ["Distribution Pricing & Rebates", "GPO Rebates"],
    intelligenceUsed: ["Machine Learning", "AI Prompting Tools", "Agents"],
    impact: "Drives competitive market response and provides customer pricing clarity. Foundation that Nova 2.0 is built on — without X-Ray, there is no pricing engine.",
  },
  {
    id: "skynet", name: "Skynet", tagline: "Dynamic QBR portal",
    color: "#EF4444", status: "Planning", statusColor: "#A8B8CC",
    description: "Replaces the static PowerPoint QBR process. Pulls data from disparate sources into a unified schema and delivers it through a dynamic, interactive customer portal. The rep or customer can ask any question in natural language — converted to SQL on the fly against a live database.",
    capabilities: ["Automated data aggregation from all sources", "Dynamic customer-facing portal", "Natural language to SQL query engine", "Real-time distribution purchase analytics", "GPO rebate, PMID, biosimilar reporting", "Technology adoption tracking"],
    dataInputs: ["GPO Rebates", "MID Data", "Biosimilar Utilization", "Customer & Account Data"],
    intelligenceUsed: ["AI Prompting Tools"],
    impact: "Moves from a static PowerPoint deck with manual data gathering to a live customer experience. Eliminates hours of rep prep time per QBR cycle.",
  },
];

// ============================================================
// GLIDE STACK PAGE
// ============================================================

function GlideStackPage() {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [activeDataBucket, setActiveDataBucket] = useState<number | null>(null);

  const selectedProject = activeProject !== null ? projects[activeProject] : null;
  const selectedBucket = activeDataBucket !== null ? dataLayer[activeDataBucket] : null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
      <h1 style={{ fontSize: 42, fontWeight: 700, color: "#FFFFFF", margin: "0 0 8px", lineHeight: 1.15 }}>The Glide Stack</h1>
      <p style={{ fontSize: 17, color: "#C4D0DE", margin: "0 0 6px", maxWidth: 720, lineHeight: 1.6 }}>
        Oncology and Multi-Specialty AI Platform Architecture
      </p>
      <p style={{ fontSize: 13, color: "#C4D0DE", margin: "0 0 48px", lineHeight: 1.5 }}>
        Click any project or data bucket to explore.
      </p>

      <SectionHeader label="Applications" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 4 }}>
        {projects.map((p, i) => (
          <div key={p.id} onClick={() => setActiveProject(activeProject === i ? null : i)}
            style={{ background: activeProject === i ? `${p.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activeProject === i ? p.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: p.color, opacity: activeProject === i ? 1 : 0.4 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: p.color }}>{p.name}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: p.statusColor, background: `${p.statusColor}15`, border: `1px solid ${p.statusColor}30`, borderRadius: 4, padding: "2px 7px", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{p.status}</span>
            </div>
            <div style={{ fontSize: 13, color: "#C4D0DE" }}>{p.tagline}</div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div style={{ margin: "12px 0 0", background: `${selectedProject.color}08`, border: `1px solid ${selectedProject.color}20`, borderRadius: 12, padding: "28px 28px 24px", animation: "fadeIn 0.2s ease" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedProject.color, marginBottom: 6 }}>Project overview</div>
            <p style={{ fontSize: 15, color: "#E2EAF2", margin: 0, lineHeight: 1.65 }}>{selectedProject.description}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#C4D0DE", marginBottom: 14 }}>Capabilities</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {selectedProject.capabilities.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: selectedProject.color, marginTop: 7, flexShrink: 0, boxShadow: `0 0 6px ${selectedProject.color}40` }} />
                    <span style={{ fontSize: 14, color: "#E2EAF2", lineHeight: 1.5 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20, flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#C4D0DE", marginBottom: 12 }}>Data inputs</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selectedProject.dataInputs.map((d, i) => (
                    <span key={i} style={{ fontSize: 12, color: "#C4D0DE", background: "rgba(148,163,184,0.08)", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 6, padding: "4px 10px" }}>{d}</span>
                  ))}
                </div>
              </div>
              <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20, flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#C4D0DE", marginBottom: 12 }}>Intelligence used</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selectedProject.intelligenceUsed.map((d, i) => (
                    <span key={i} style={{ fontSize: 12, color: selectedProject.color, background: `${selectedProject.color}12`, border: `1px solid ${selectedProject.color}25`, borderRadius: 6, padding: "4px 10px" }}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: "14px 18px", background: `${selectedProject.color}0A`, border: `1px solid ${selectedProject.color}18`, borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 12 }}>
            <span style={{ color: selectedProject.color, fontSize: 14, marginTop: 1 }}>◆</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: selectedProject.color, marginBottom: 4 }}>Business impact</div>
              <span style={{ fontSize: 14, color: "#E2EAF2", lineHeight: 1.6 }}>{selectedProject.impact}</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 40px" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#C4D0DE", whiteSpace: "nowrap" }}>builds on</span>
        <div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} />
      </div>

      <SectionHeader label="Intelligence layer" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 4 }}>
        {intelligenceLayer.map((layer) => (
          <div key={layer.id} style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 12, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: layer.color, opacity: 0.5 }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF", marginBottom: 3 }}>{layer.title}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#A8B8CC", marginBottom: 16 }}>{layer.subtitle}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
              {layer.capabilities.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: layer.color, marginTop: 6, flexShrink: 0, opacity: 1 }} />
                  <span style={{ fontSize: 13, color: "#E2EAF2", lineHeight: 1.5 }}>{c}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {layer.usedBy.map((proj, i) => {
                const p = projects.find((x) => x.name === proj);
                return (
                  <span key={i} style={{ fontSize: 11, color: p ? p.color : "#C4D0DE", background: p ? `${p.color}12` : "rgba(148,163,184,0.08)", border: `1px solid ${p ? p.color + "25" : "rgba(148,163,184,0.15)"}`, borderRadius: 5, padding: "2px 8px", fontFamily: "'JetBrains Mono', monospace" }}>
                    {proj}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 40px" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#C4D0DE", whiteSpace: "nowrap" }}>powered by</span>
        <div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} />
      </div>

      <SectionHeader label="Data layer" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {dataLayer.map((bucket, i) => (
          <div key={bucket.id} onClick={() => setActiveDataBucket(activeDataBucket === i ? null : i)}
            style={{ background: activeDataBucket === i ? `${bucket.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activeDataBucket === i ? bucket.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "16px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: bucket.color, opacity: activeDataBucket === i ? 1 : 0.35 }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: bucket.color, marginBottom: 10, lineHeight: 1.3, minHeight: 34 }}>{bucket.title}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {bucket.items.slice(0, 3).map((item, j) => (
                <span key={j} style={{ fontSize: 11, color: "#E2EAF2", background: "rgba(148,163,184,0.10)", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 4, padding: "2px 7px" }}>{item}</span>
              ))}
              {bucket.items.length > 3 && (
                <span style={{ fontSize: 11, color: "#C4D0DE", padding: "2px 4px" }}>+{bucket.items.length - 3} more</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedBucket && (
        <div style={{ margin: "12px 0 0", background: `${selectedBucket.color}08`, border: `1px solid ${selectedBucket.color}20`, borderRadius: 12, padding: "24px 28px", animation: "fadeIn 0.2s ease" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedBucket.color, marginBottom: 16 }}>
            {selectedBucket.title} — full data inventory
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
            {selectedBucket.items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: selectedBucket.color, flexShrink: 0, boxShadow: `0 0 6px ${selectedBucket.color}50` }} />
                <span style={{ fontSize: 14, color: "#E2EAF2" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ height: 64 }} />
    </div>
  );
}

// ============================================================
// AI FUTURES DATA
// ============================================================

const eras = [
  {
    id: 1, years: "2022–2023", title: "The Chat Revolution", tagline: "AI goes mainstream overnight",
    color: "#3B82F6", icon: "💬",
    summary: "ChatGPT launched November 30, 2022 and reached 100 million users in two months — the fastest-growing consumer application in history. For most people, this was their first interaction with a large language model.",
    capabilities: ["Natural language Q&A and conversation", "Essay writing, summarization, translation", "Simple code generation and explanation", "Brainstorming and creative ideation"],
    limitations: ["Frequent hallucination — confidently wrong answers", "No internet access or real-time information", "Text-only — couldn't process images or documents", "Short context windows (~8K tokens, a few pages)"],
    milestones: [
      { date: "Nov 2022", event: "ChatGPT launches (GPT-3.5)", highlight: true },
      { date: "Feb 2023", event: "Microsoft integrates GPT into Bing", highlight: false },
      { date: "Mar 2023", event: "GPT-4 releases — major reasoning leap", highlight: true },
      { date: "Mar 2023", event: "Anthropic launches Claude 1", highlight: false },
      { date: "Mar 2023", event: "Google launches Bard", highlight: false },
      { date: "Jul 2023", event: "Meta releases Llama 2 (open source)", highlight: true },
      { date: "Nov 2023", event: "OpenAI launches custom GPTs", highlight: false },
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
      { date: "Mar 2024", event: "Claude 3 launches (Opus, Sonnet, Haiku)", highlight: false },
      { date: "May 2024", event: "GPT-4o — text, image, audio, video in one model", highlight: false },
      { date: "Jun 2024", event: "Claude 3.5 Sonnet — cheaper beats bigger", highlight: true },
      { date: "Sep 2024", event: "OpenAI o1 — first dedicated reasoning model", highlight: true },
      { date: "Oct 2024", event: "Claude 3.5 Sonnet v2 with Computer Use", highlight: false },
      { date: "Dec 2024", event: "Gemini 2.0 Flash with agentic features", highlight: false },
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
      { date: "Feb 2025", event: "Claude 3.7 Sonnet — extended thinking", highlight: false },
      { date: "May 2025", event: "Claude 4 launches — professional-grade coding", highlight: true },
      { date: "May 2025", event: "OpenAI Codex launches as cloud coding agent", highlight: true },
      { date: "Aug 2025", event: "GPT-5 launches — unified reasoning + intelligence", highlight: false },
      { date: "Oct 2025", event: "Claude Sonnet 4.5 — best cost-to-performance ratio", highlight: false },
      { date: "Nov 2025", event: "Claude Code hits $1B annualized revenue", highlight: false },
      { date: "Nov 2025", event: "Claude Opus 4.5 — reclaims coding benchmark lead", highlight: false },
      { date: "Dec 2025", event: "GPT-5.2 launches — 400K context, three modes", highlight: false },
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
      { date: "Jan 2026", event: "GPT-5.2-Codex — agentic coding with context compaction", highlight: false },
      { date: "Feb 2026", event: "Claude Opus 4.6 — 1M context, Agent Teams", highlight: true },
      { date: "Feb 2026", event: "Claude Sonnet 4.6 — matches prior Opus at ¼ cost", highlight: false },
      { date: "Feb 2026", event: "Codex desktop app — multi-agent management", highlight: false },
      { date: "Mar 2026", event: "GPT-5.4 launches — Codex surpasses 2M weekly users", highlight: true },
      { date: "Mar 2026", event: "Claude Agent SDK — build production agents as a library", highlight: false },
      { date: "Mar 2026", event: "MCP ecosystem matures — connects AI to everything", highlight: false },
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

const levels = [
  {
    level: 1, title: "AI User", subtitle: "Effective Prompting & Interpretation",
    analogy: "Knows how to drive the car", color: "#3B82F6",
    description: "Can interact with conversational AI models to get useful results. Understands basic prompting principles and can iterate to improve output quality.",
    competencies: ["Crafts clear, specific prompts that produce actionable results", "Iterates on prompts — refines based on output quality", "Recognizes when AI output is wrong or hallucinated", "Uses AI for writing, summarization, research, and brainstorming", "Understands basic limitations and knowledge cutoffs", "Familiar with at least one major AI platform"],
    interview: [
      { type: "Prompt Refinement", desc: "Give a vague prompt and ask them to improve it" },
      { type: "Output Evaluation", desc: "Show an AI response with subtle errors — can they spot them?" },
      { type: "Use Case ID", desc: "Describe 3 ways they'd use AI in their current role" },
    ],
  },
  {
    level: 2, title: "AI Project Designer", subtitle: "Context Engineering & Persona Design",
    analogy: "Plans the route and configures the GPS", color: "#8B5CF6",
    description: "Structures AI projects within platforms like Claude Projects or ChatGPT. Designs persistent context — instructions, personas, and reference materials — that shape AI behavior across an entire body of work.",
    competencies: ["Creates projects with custom instructions and knowledge files", "Writes system-level instructions defining tone, scope, and constraints", "Designs persona-based approaches (PM, developer, QA, domain expert)", "Curates and uploads reference documents for domain context", "Uses conversation starters and templates for team workflows", "Fluent in markdown formatting for AI instructions"],
    interview: [
      { type: "Project Design", desc: "Set up an AI assistant for the sales team — walk through it" },
      { type: "Persona Creation", desc: "What personas for a revenue cycle optimization project?" },
      { type: "Instruction Writing", desc: "Write system instructions for a Claude Project scenario" },
    ],
  },
  {
    level: 3, title: "AI Builder", subtitle: "Prototypes & Simple Applications",
    analogy: "Builds a go-kart using AI-powered tools", color: "#EC4899",
    description: "Uses AI coding tools to generate functional websites, components, and straightforward applications. Can take an idea from concept to working prototype using AI-assisted development.",
    competencies: ["Uses Claude Code, Codex, or Cursor to generate working code", "Builds websites, landing pages, and simple interactive apps", "Uses AI as a planning engine for requirements and task breakdowns", "Deploys simple projects via GitHub and Vercel", "Creates and modifies basic database schemas with AI help", "Can read and evaluate AI-generated code for obvious errors"],
    interview: [
      { type: "Build Walkthrough", desc: "Describe something you've built with AI coding tools" },
      { type: "Code Review", desc: "Identify a bug in AI-generated code and describe a fix" },
      { type: "Tool Selection", desc: "What tools to build a simple internal task tracker?" },
    ],
  },
  {
    level: 4, title: "AI Developer", subtitle: "Full-Stack Production Systems",
    analogy: "Builds and ships a production vehicle with all systems connected", color: "#F59E0B",
    description: "Orchestrates full-stack, production-grade applications using AI-assisted development. Manages complex integrations — authentication, payments, messaging — across multi-service architectures.",
    competencies: ["Architects multi-service apps: frontend, backend, database, deployment", "Integrates OAuth, Stripe, Twilio, analytics, and external APIs", "Connects AI to tools and data sources via MCP", "Designs relational schemas with RLS, triggers, and migrations", "Manages environments, secrets, and production safeguards", "Orchestrates agentic workflows with human-in-the-loop patterns"],
    interview: [
      { type: "Architecture Design", desc: "Design a patient portal with scheduling, messaging, and insurance verification" },
      { type: "Integration Scenario", desc: "Add Stripe billing to an existing Next.js + Supabase app" },
      { type: "Debugging", desc: "Stripe webhooks aren't updating Supabase — diagnose it" },
    ],
  },
  {
    level: 5, title: "AI Architect", subtitle: "LLM Customization & System Design",
    analogy: "Designs and modifies the engine itself", color: "#EF4444",
    description: "Works directly with LLM internals — fine-tuning models, customizing training data, designing multi-model systems, and building novel agentic architectures. Extends, adapts, and creates AI tools.",
    competencies: ["Fine-tunes LLMs on proprietary or domain-specific datasets", "Designs training data pipelines: collection, cleaning, labeling", "Understands transformer internals, attention, tokenization", "Builds custom agentic reasoning and decision-making systems", "Implements RAG pipelines with custom embedding strategies", "Manages model deployment: optimization, cost, scaling, monitoring"],
    interview: [
      { type: "System Design", desc: "Design an AI system for automated claims adjudication" },
      { type: "Fine-tuning", desc: "When to fine-tune vs. RAG vs. prompt engineering?" },
      { type: "Multi-Agent", desc: "Design a multi-agent system for drug distribution logistics" },
    ],
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
// USE CASE MAP PAGE
// ============================================================

// ============================================================
// TIMELINE PAGE
// ============================================================

function TimelinePage() {
  const [activeEra, setActiveEra] = useState<number | null>(null);
  const selected = activeEra !== null ? eras[activeEra] : null;

  return (
    <>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#C4D0DE" }}>AI Timeline</span>
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 700, color: "#FFFFFF", margin: "0 0 8px", lineHeight: 1.15 }}>The Evolution of AI</h1>
        <p style={{ fontSize: 17, color: "#C4D0DE", margin: "0 0 48px", maxWidth: 660, lineHeight: 1.6 }}>
          From ChatGPT&apos;s launch to the orchestration era — how AI transformed from a curiosity to a production platform in four years.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 4 }}>
          {eras.map((era, i) => (
            <div key={era.id} onClick={() => setActiveEra(activeEra === i ? null : i)}
              style={{ background: activeEra === i ? `${era.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activeEra === i ? era.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: era.color, opacity: activeEra === i ? 1 : 0.4 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: era.color }}>{era.years}</span>
                <span style={{ fontSize: 18 }}>{era.icon}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF", marginBottom: 4 }}>{era.title}</div>
              <div style={{ fontSize: 13, color: "#C4D0DE" }}>{era.tagline}</div>
            </div>
          ))}
        </div>

        {selected && (
          <div style={{ margin: "12px 0 0", background: `${selected.color}08`, border: `1px solid ${selected.color}20`, borderRadius: 12, padding: "28px 28px 24px", animation: "fadeIn 0.2s ease" }}>
            <p style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.7, margin: "0 0 24px" }}>{selected.summary}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <Card>
                <SectionHeader label="What It Could Do" />
                <DotList items={selected.capabilities} color={selected.color} />
              </Card>
              <Card>
                <SectionHeader label="What It Couldn&apos;t Do Yet" />
                <DotList items={selected.limitations} dimColor="#C4D0DE" />
              </Card>
            </div>
            <Card style={{ marginBottom: 16 }}>
              <SectionHeader label="Key Milestones" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 8 }}>
                {selected.milestones.map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, background: m.highlight ? `${selected.color}0C` : "transparent", border: m.highlight ? `1px solid ${selected.color}20` : "1px solid transparent" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: selected.color, whiteSpace: "nowrap", minWidth: 72 }}>{m.date}</span>
                    <span style={{ fontSize: 14, color: m.highlight ? "#F0F4F8" : "#E2EAF2", fontWeight: m.highlight ? 600 : 400 }}>{m.event}</span>
                  </div>
                ))}
              </div>
            </Card>
            <div style={{ padding: "18px 22px", background: `${selected.color}08`, border: `1px solid ${selected.color}18`, borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontSize: 16, color: selected.color, marginTop: 1 }}>◆</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: selected.color, marginBottom: 6 }}>What This Meant for Enterprise</div>
                <span style={{ fontSize: 15, color: "#E2EAF2", lineHeight: 1.65 }}>{selected.enterprise}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── SDLC VELOCITY CHART ── */}
      <VelocityChart />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px 0" }}>
        <SectionHeader label="The Numbers Tell the Story" />
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "200px repeat(4, 1fr)", borderBottom: "1px solid rgba(148,163,184,0.1)", padding: "14px 20px" }}>
            <span />
            {eras.map((era, i) => (
              <span key={era.id} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: activeEra === i ? era.color : "#C4D0DE", textAlign: "center", transition: "color 0.2s ease" }}>{era.years}</span>
            ))}
          </div>
          {stats.map((stat, si) => (
            <div key={si} style={{ display: "grid", gridTemplateColumns: "200px repeat(4, 1fr)", padding: "12px 20px", borderBottom: si < stats.length - 1 ? "1px solid rgba(148,163,184,0.06)" : "none" }}>
              <span style={{ fontSize: 13, color: "#C4D0DE" }}>{stat.label}</span>
              {stat.values.map((v, vi) => (
                <span key={vi} style={{ fontSize: 13, textAlign: "center", fontWeight: activeEra === vi ? 600 : 400, color: activeEra === vi ? eras[vi].color : "#E2EAF2", transition: "all 0.2s ease" }}>{v}</span>
              ))}
            </div>
          ))}
        </Card>
      </div>

      {/* ── COMPUTE GROWTH CHART ── */}
      <ComputeGrowthChart />

      <div style={{ height: 64 }} />
    </>
  );
}

// ============================================================
// COMPUTE GROWTH CHART
// ============================================================

function ComputeGrowthChart() {
  const [activeMetric, setActiveMetric] = useState(0);

  const metrics = [
    {
      id: "tokens",
      label: "Tokens per Watt",
      unit: "Relative throughput index (Nov 2022 = 1×)",
      description: "How much useful AI output is produced per watt of energy consumed. Hardware and inference software optimizations compound independently from raw chip performance.",
      source: "Sources: MLCommons MLPerf Inference benchmarks (2022–2025), Anthropic efficiency disclosures",
      mooresColor: "#A8B8CC",
      aiColor: "#8B5CF6",
      mooresLabel: "Expected hardware gains",
      aiLabel: "Actual tokens / watt",
      moores: [
        { x: 0, y: 1 }, { x: 12, y: 1.4 }, { x: 24, y: 2 }, { x: 36, y: 2.8 }, { x: 40, y: 3.2 },
      ],
      ai: [
        { x: 0, y: 1 }, { x: 8, y: 3 }, { x: 16, y: 8 }, { x: 24, y: 18 }, { x: 32, y: 35 }, { x: 40, y: 60 },
      ],
      callout: "Tokens per watt has improved ~60× since 2022 — driven by H100 hardware, inference optimization, and model distillation. Hardware improvements alone would have delivered ~3×.",
    },
    {
      id: "flops",
      label: "Training Compute",
      unit: "Relative FLOP index — log scale (Nov 2022 = 1×)",
      description: "Total floating point operations invested in training frontier models. Sets the ceiling for model capability and reflects the industry's compounding investment in AI intelligence.",
      source: "Sources: Epoch AI Training Compute Database (2024), OpenAI scaling law papers, Anthropic model cards",
      mooresColor: "#A8B8CC",
      aiColor: "#F59E0B",
      mooresLabel: "Moore's Law expectation",
      aiLabel: "Frontier model training FLOP",
      moores: [
        { x: 0, y: 1 }, { x: 12, y: 1.4 }, { x: 24, y: 2 }, { x: 36, y: 2.8 }, { x: 40, y: 3.2 },
      ],
      ai: [
        { x: 0, y: 1 }, { x: 6, y: 3 }, { x: 14, y: 10 }, { x: 22, y: 30 }, { x: 30, y: 80 }, { x: 40, y: 200 },
      ],
      callout: "Training compute for frontier models has grown ~200× since GPT-3.5 — doubling roughly every 6 months vs. every 24 months under Moore's Law.",
    },
  ];

  const m = metrics[activeMetric];
  const W = 900, H = 270, PAD = { t: 24, r: 20, b: 52, l: 72 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const xMax = 40;
  const allY = [...m.moores.map((p: {x:number,y:number}) => p.y), ...m.ai.map((p: {x:number,y:number}) => p.y)];
  const yMin = Math.min(...allY);
  const yMax = Math.max(...allY);
  const logMin = Math.log10(yMin * 0.8);
  const logMax = Math.log10(yMax * 1.15);

  const cx = (x: number) => PAD.l + (x / xMax) * innerW;
  const cy = (y: number) => PAD.t + innerH - ((Math.log10(y) - logMin) / (logMax - logMin)) * innerH;
  const toPath = (pts: {x:number,y:number}[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"} ${cx(p.x).toFixed(1)} ${cy(p.y).toFixed(1)}`).join(" ");

  const xLabels = [
    { x: 0, label: "Nov '22" }, { x: 10, label: "Sep '23" }, { x: 20, label: "Jul '24" },
    { x: 30, label: "May '25" }, { x: 40, label: "Mar '26" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px 0" }}>
      <SectionHeader label="Compute Growth vs. Moore's Law" />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {metrics.map((met, i) => (
          <button key={met.id} onClick={() => setActiveMetric(i)}
            style={{ background: activeMetric === i ? "rgba(59,130,246,0.12)" : "transparent", border: activeMetric === i ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(148,163,184,0.15)", borderRadius: 8, padding: "8px 16px", cursor: "pointer", outline: "none", fontSize: 13, fontWeight: activeMetric === i ? 600 : 400, color: activeMetric === i ? "#F0F4F8" : "#A8B8CC", transition: "all 0.2s ease" }}>
            {met.label}
          </button>
        ))}
      </div>
      <Card style={{ padding: "24px 24px 20px" }}>
        <div style={{ fontSize: 12, color: "#A8B8CC", marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>{m.unit}</div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
          {/* Y-axis gridlines + labels */}
          {(() => {
            const ticks = [];
            const logRange = logMax - logMin;
            // Generate ~4 round power-of-10 or half-decade ticks that fall in range
            const tickCandidates = [0.1, 0.25, 0.5, 1, 2, 3, 5, 10, 20, 30, 50, 100, 200, 500];
            const allY2 = [...m.moores.map((p: {x:number,y:number}) => p.y), ...m.ai.map((p: {x:number,y:number}) => p.y)];
            const yDataMin = Math.min(...allY2);
            const yDataMax = Math.max(...allY2);
            const filtered = tickCandidates.filter(v => v >= yDataMin * 0.7 && v <= yDataMax * 1.3);
            filtered.forEach((v, i) => {
              const yPos = cy(v);
              const label = v >= 1000 ? `${Math.round(v/1000)}K×` : v >= 10 ? `${Math.round(v)}×` : v >= 1 ? `${parseFloat(v.toFixed(1))}×` : `${parseFloat(v.toFixed(2))}×`;
              ticks.push(
                <g key={i}>
                  <line x1={PAD.l - 4} y1={yPos} x2={W - PAD.r} y2={yPos} stroke="rgba(196,208,222,0.10)" strokeWidth="1" />
                  <text x={PAD.l - 8} y={yPos} textAnchor="end" dominantBaseline="central" fontSize="11" fill="#C4D0DE" fontFamily="JetBrains Mono, monospace">{label}</text>
                </g>
              );
            });
            return ticks;
          })()}
          {/* Y-axis line */}
          <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + innerH} stroke="rgba(196,208,222,0.15)" strokeWidth="1" />
          {/* Lines */}
          <path d={toPath(m.moores)} fill="none" stroke={m.mooresColor} strokeWidth="2" strokeDasharray="6 4" />
          <path d={toPath(m.ai)} fill="none" stroke={m.aiColor} strokeWidth="2.5" />
          {/* AI dots */}
          {m.ai.map((p: {x:number,y:number}, i: number) => (
            <circle key={i} cx={cx(p.x)} cy={cy(p.y)} r="4" fill={m.aiColor} />
          ))}
          {/* X-axis labels */}
          {xLabels.map(l => (
            <text key={l.x} x={cx(l.x)} y={H - 8} textAnchor="middle" fontSize="11" fill="#C4D0DE" fontFamily="JetBrains Mono, monospace">{l.label}</text>
          ))}
          {/* Legend */}
          <line x1={PAD.l + 4} y1={PAD.t + 8} x2={PAD.l + 28} y2={PAD.t + 8} stroke={m.mooresColor} strokeWidth="2" strokeDasharray="6 4" />
          <text x={PAD.l + 34} y={PAD.t + 13} fontSize="12" fill="#C4D0DE" fontFamily="DM Sans, sans-serif">{m.mooresLabel}</text>
          <line x1={PAD.l + 220} y1={PAD.t + 8} x2={PAD.l + 244} y2={PAD.t + 8} stroke={m.aiColor} strokeWidth="2.5" />
          <text x={PAD.l + 250} y={PAD.t + 13} fontSize="12" fill={m.aiColor} fontWeight="600" fontFamily="DM Sans, sans-serif">{m.aiLabel}</text>
        </svg>
        <div style={{ marginTop: 16, padding: "14px 18px", background: `${m.aiColor}0A`, border: `1px solid ${m.aiColor}20`, borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span style={{ color: m.aiColor, fontSize: 14, flexShrink: 0, marginTop: 1 }}>◆</span>
          <div>
            <div style={{ fontSize: 14, color: "#E2EAF2", lineHeight: 1.6 }}>{m.callout}</div>
            <div style={{ fontSize: 11, color: "#A8B8CC", marginTop: 6, fontFamily: "'JetBrains Mono', monospace" }}>{m.source}</div>
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: "#A8B8CC", lineHeight: 1.6 }}>{m.description}</div>
      </Card>
    </div>
  );
}

// ============================================================
// SDLC VELOCITY CHART
// ============================================================

const velocityData = [
  { era: "Pre-AI baseline", period: "Before 2023", multiplier: 1, color: "#A8B8CC", projected: false, description: "Traditional software development — no AI assistance in the workflow.", source: "" },
  { era: "GitHub Copilot", period: "2023", multiplier: 1.25, color: "#3B82F6", projected: false, description: "Autocomplete and single-file suggestions. Modest gains on defined tasks — developers still drive all architecture, design, and implementation decisions.", source: "GitHub (2023): Developers complete tasks 55% faster on narrow autocomplete tasks; real-world net gain more modest" },
  { era: "Early coding agents", period: "Early 2025", multiplier: 2, color: "#8B5CF6", projected: false, description: "Claude Code and Codex — multi-file generation and full feature scaffolding. AI begins handling implementation; human handles direction and review.", source: "McKinsey (2025): AI coding tools deliver 2–4× on well-defined tasks; 2× reflects real-world average across mixed workloads" },
  { era: "Claude 4 + extended thinking", period: "Mid 2025", multiplier: 3.5, color: "#EC4899", projected: false, description: "Architecture-level reasoning, test generation, and large-scale refactoring. AI reasons across entire codebases and proposes structural changes with minimal guidance.", source: "Anthropic (2025): Claude 4 SWE-bench — 72.5% autonomous task resolution on complex software benchmarks" },
  { era: "Opus 4.6 Agent Teams", period: "Q1 2026", multiplier: 7, color: "#F59E0B", projected: false, description: "Multi-agent parallelism — specialized agents plan, build, test, and review concurrently. Human role shifts from implementation to orchestration and approval.", source: "Anthropic (2026): Agent Teams benchmark — parallel workstreams deliver ~3× throughput vs. single-agent baseline" },
  { era: "Next-gen agents (projected)", period: "Q1 2027 est.", multiplier: 14, color: "#10B981", projected: true, description: "Projected: autonomous sprint planning, self-healing test suites, continuous deployment pipelines. Human role is outcome definition and governance.", source: "Estimated — extrapolated from Epoch AI scaling trajectory and current agent benchmark progression" },
];

function VelocityChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxMult = 20;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
      <SectionHeader label="Developer Velocity — AI Coding Tools Over Time" />
      <div style={{ fontSize: 13, color: "#A8B8CC", marginBottom: 24, lineHeight: 1.6, maxWidth: 720 }}>
        Output multiplier relative to a developer working without AI assistance. Based on published benchmarks and research — hover each bar for source details.
      </div>
      <Card style={{ padding: "28px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {velocityData.map((d, i) => {
            const pct = (d.multiplier / maxMult) * 100;
            const isHovered = hovered === i;
            return (
              <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                <div style={{ display: "grid", gridTemplateColumns: "172px 1fr 56px", alignItems: "center", gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: d.projected ? "#A8B8CC" : "#E2EAF2", lineHeight: 1.3 }}>{d.era}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: d.color, marginTop: 2 }}>{d.period}</div>
                  </div>
                  <div style={{ height: 36, borderRadius: 6, background: "rgba(148,163,184,0.08)", position: "relative", overflow: "hidden", border: `1px solid ${isHovered ? d.color : d.color + "90"}`, transition: "all 0.15s ease", cursor: "default" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: d.projected ? `repeating-linear-gradient(45deg, ${d.color}CC, ${d.color}CC 6px, ${d.color}66 6px, ${d.color}66 12px)` : isHovered ? `${d.color}EE` : `${d.color}BB`, borderRight: `3px solid ${d.color}`, borderRadius: "0 4px 4px 0", transition: "all 0.3s ease", boxShadow: isHovered ? `0 0 24px ${d.color}80` : `0 0 10px ${d.color}30` }} />
                    {d.projected && (
                      <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: d.color, fontWeight: 600, letterSpacing: 0.5 }}>ESTIMATED</div>
                    )}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 700, color: d.color, textAlign: "right" }}>{d.multiplier}×</div>
                </div>
                {isHovered && (
                  <div style={{ marginTop: 8, marginLeft: 186, padding: "10px 14px", background: `${d.color}08`, border: `1px solid ${d.color}18`, borderRadius: 8, animation: "fadeIn 0.15s ease" }}>
                    <div style={{ fontSize: 13, color: "#E2EAF2", lineHeight: 1.55, marginBottom: d.source ? 6 : 0 }}>{d.description}</div>
                    {d.source && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#A8B8CC" }}>{d.source}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 28, padding: "18px 20px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.18)", borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 14 }}>
          <span style={{ color: "#3B82F6", fontSize: 16, flexShrink: 0, marginTop: 1 }}>◆</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#3B82F6", marginBottom: 6 }}>The urgency case</div>
            <span style={{ fontSize: 14, color: "#E2EAF2", lineHeight: 1.7 }}>
              A team with access to Opus 4.6 Agent Teams today ships roughly <strong style={{ color: "#FFFFFF" }}>7× the output</strong> of a team working without AI assistance — compared to <strong style={{ color: "#FFFFFF" }}>1.25× with Copilot alone</strong>. The gap between organizations using advanced AI tooling and those still on basic autocomplete is not incremental. It is structural, and it compounds every sprint.
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// FRAMEWORK PAGE
// ============================================================

function FrameworkPage() {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const selected = activeLevel !== null ? levels[activeLevel] : null;

  return (
    <>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#8B5CF6", boxShadow: "0 0 12px #8B5CF6" }} />
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#C4D0DE" }}>Assessment Framework</span>
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 700, color: "#FFFFFF", margin: "0 0 8px", lineHeight: 1.15 }}>AI Knowledge Levels</h1>
        <p style={{ fontSize: 17, color: "#C4D0DE", margin: "0 0 48px", maxWidth: 660, lineHeight: 1.6 }}>
          A five-level framework for assessing AI literacy — from effective prompting to LLM customization.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 4 }}>
          {levels.map((l, i) => (
            <div key={l.level} onClick={() => setActiveLevel(activeLevel === i ? null : i)}
              style={{ background: activeLevel === i ? `${l.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activeLevel === i ? l.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: l.color, opacity: activeLevel === i ? 1 : 0.4 }} />
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: l.color, fontWeight: 600, marginBottom: 6 }}>Level {l.level}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", marginBottom: 4, lineHeight: 1.3 }}>{l.title}</div>
              <div style={{ fontSize: 12, color: "#A8B8CC" }}>{l.subtitle}</div>
            </div>
          ))}
        </div>

        {selected && (
          <div style={{ margin: "12px 0 0", background: `${selected.color}08`, border: `1px solid ${selected.color}20`, borderRadius: 12, padding: "28px 28px 24px", animation: "fadeIn 0.2s ease" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: `${selected.color}15`, border: `1px solid ${selected.color}30`, marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: selected.color }}>✦</span>
              <span style={{ fontSize: 13, color: selected.color, fontWeight: 500 }}>{selected.analogy}</span>
            </div>
            <p style={{ fontSize: 17, color: "#F0F4F8", lineHeight: 1.7, margin: "0 0 24px", maxWidth: 740 }}>{selected.description}</p>
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
                      <div style={{ fontSize: 14, color: "#E2EAF2", lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px 0" }}>
        <SectionHeader label="Target Levels by Role" />
        <Card style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {roleMapping.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "280px 60px 1fr", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 14, color: "#E2EAF2" }}>{r.role}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#F0F4F8", fontWeight: 600 }}>{r.levels}</span>
              <div style={{ height: 6, borderRadius: 3, background: "rgba(148,163,184,0.08)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(r.bar / 5) * 100}%`, borderRadius: 3, background: `linear-gradient(90deg, ${levels[0].color}, ${levels[Math.min(Math.round(r.bar) - 1, 4)].color})`, opacity: 0.7 }} />
              </div>
            </div>
          ))}
        </Card>
        <div style={{ marginTop: 32, padding: "16px 20px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span style={{ color: "#3B82F6", fontSize: 14, marginTop: 1 }}>◆</span>
          <span style={{ fontSize: 14, color: "#E2EAF2", lineHeight: 1.6 }}>
            <strong style={{ color: "#FFFFFF" }}>Level 2 is the floor.</strong>{" "}
            Every role should target at least Level 2 — the ability to structure AI projects, design personas, and engineer context. Levels are cumulative: a Level 4 candidate demonstrates all prior competencies.
          </span>
        </div>
      </div>
      <div style={{ height: 64 }} />
    </>
  );
}

// ============================================================
// MAIN APP — TAB NAVIGATION
// ============================================================

const pages = [
  { id: "glide", label: "Glide Stack", icon: "◈" },
  { id: "timeline", label: "AI Evolution", icon: "◆" },
  { id: "framework", label: "Knowledge Levels", icon: "✦" },
];

export default function App() {
  const [activePage, setActivePage] = useState("glide");

  return (
    <div style={{ minHeight: "100vh", background: "#141B2D", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
      `}</style>

      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(11,15,26,0.9)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(148,163,184,0.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "center", height: 56 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {pages.map((page) => {
              const isActive = activePage === page.id;
              return (
                <button key={page.id} onClick={() => setActivePage(page.id)}
                  style={{ background: isActive ? "rgba(59,130,246,0.12)" : "transparent", border: isActive ? "1px solid rgba(59,130,246,0.25)" : "1px solid transparent", borderRadius: 8, padding: "8px 16px", cursor: "pointer", outline: "none", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s ease" }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(148,163,184,0.06)"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                  <span style={{ fontSize: 13, color: isActive ? "#3B82F6" : "#A8B8CC" }}>{page.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, color: isActive ? "#F0F4F8" : "#C4D0DE", transition: "color 0.2s ease" }}>{page.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <div key={activePage} style={{ animation: "fadeIn 0.3s ease" }}>
        {activePage === "glide" && <GlideStackPage />}
        {activePage === "timeline" && <TimelinePage />}
        {activePage === "framework" && <FrameworkPage />}
      </div>
    </div>
  );
}
