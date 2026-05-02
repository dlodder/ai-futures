"use client";
import { useState } from "react";

// ============================================================
// SHARED STYLES & COMPONENTS
// ============================================================

const FONT_LINK = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";

const SectionHeader = ({ label }: { label: string }) => (
  <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#E2EAF2", marginBottom: 16 }}>
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
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: color || "#D0DAE6", marginTop: 7, flexShrink: 0, boxShadow: color ? `0 0 6px ${color}40` : "none" }} />
        <span style={{ fontSize: 17, color: dimColor, lineHeight: 1.55 }}>{item}</span>
      </div>
    ))}
  </div>
);

// ============================================================
// GLIDE STACK DATA
// ============================================================

const dataLayer = [
  { id: "rcm", title: "Revenue Cycle Management", color: "#3B82F6", items: ["Claims (837P / 837I)", "Prior authorization", "EOB / ERA processing", "J-code billing", "Denial management", "CAR-T billing", "Remittance reconciliation"] },
  { id: "inventory", title: "Inventory Management", color: "#8B5CF6", items: ["Drug stock levels", "Lot & serial tracking", "Cold chain monitoring", "Expiry management", "Reorder triggers", "Specialty drug handling", "Warehouse fulfillment"] },
  { id: "pricing", title: "Distribution Pricing & Rebates", color: "#EC4899", items: ["WAC \u2014 wholesale acquisition cost", "Contract price", "OID discounts", "FFS distribution fees", "Buy-side rebates", "Net cost recovery", "Margin waterfall"] },
  { id: "gpo", title: "GPO Rebates", color: "#F59E0B", items: ["Manufacturer rebates", "Tier qualification logic", "GPO admin fees", "Rebate tier thresholds", "Contract compliance", "GVI rebate feeds", "Back-end economics"] },
  { id: "mid", title: "MID Data", color: "#10B981", items: ["In-office dispensing", "Practice Rx purchases", "PMID transactions", "Practice pharmacy ops", "Drug utilization rates", "Dispensing economics"] },
  { id: "payer", title: "Payer Policy Surveillance", color: "#06B6D4", items: ["Formulary status", "Step therapy requirements", "Prior auth criteria", "Coverage policies", "Preferred drug lists", "Mid-quarter changes", "Commercial & Medicare rules"] },
  { id: "biosimilar", title: "Biosimilar Utilization", color: "#EF4444", items: ["Reference drug tracking", "Biosimilar adoption rates", "Biosimilar selection", "Payer preference signals", "Cost delta analysis", "Interchangeability status"] },
  { id: "account", title: "Customer & Account Data", color: "#A78BFA", items: ["Practice demographics", "Account tier & segment", "Contract history", "Renewal dates & terms", "GPO affiliation", "Field rep assignments", "Retention risk signals"] },
];

const intelligenceLayer = [
  { id: "ml", title: "Machine Learning", subtitle: "Pattern recognition", color: "#8B5CF6", capabilities: ["Predictive pricing models", "Win / loss signal learning", "Margin forecasting", "Demand & utilization forecasting", "Anomaly detection", "Learning loops on deal outcomes"], usedBy: ["Nova 2.0", "X-Ray"] },
  { id: "prompting", title: "AI Prompting Tools", subtitle: "LLM interfaces", color: "#3B82F6", capabilities: ["Natural language to SQL", "Conversational Q&A on live data", "RAG \u2014 retrieval-augmented generation", "Document extraction & synthesis", "Explainable, grounded answers", "Pricing guidance chat"], usedBy: ["Skynet", "Nova 2.0", "Titan", "X-Ray"] },
  { id: "agents", title: "Agents", subtitle: "Automated workflows", color: "#F59E0B", capabilities: ["24/7 payer policy surveillance", "Automated document extraction", "Deal orchestration pipelines", "Multi-step data acquisition", "Scheduled monitoring & alerting", "Approval workflow automation"], usedBy: ["Titan", "Nova 2.0", "X-Ray"] },
];

const projects = [
  { id: "titan", name: "Titan", tagline: "Payer policy intelligence", color: "#F59E0B", status: "Live", statusColor: "#10B981", description: "Eliminates the quarterly manual grind for payer policy tracking. Continuously monitors formularies, step therapy requirements, and preferred drug lists across oncology drugs and biosimilars \u2014 delivering verified, real-time coverage intelligence to prevent claim denials.", capabilities: ["24/7 automated payer surveillance", "Formulary & step therapy extraction", "Preferred drug list monitoring", "Audit-ready governance trail", "Real-time API + clean UI delivery"], dataInputs: ["Payer Policy Surveillance", "Biosimilar Utilization"], intelligenceUsed: ["Agents", "AI Prompting Tools"], impact: "Removes administrative barriers for cancer patients \u2014 ensures the right drug is verified before treatment, not after a denial." },
  { id: "nova", name: "Nova 2.0", tagline: "AI pricing engine", color: "#10B981", status: "In dev", statusColor: "#3B82F6", description: "Replaces the Excel-based pricing model end-to-end. Automates buy/sell economics across WAC, contract price, VCD, FFS, GPO admin fees, and OIDs. Phase 3 adds AI deal recommendations. Phase 4 deploys small-account autonomy and field enablement. Estimated $6\u201312M upside.", capabilities: ["Automated WAC / GPO / OID waterfall", "Real-time what-if scenario modeling", "AI deal recommendations (Phase 3)", "SOX-compliant approval workflows", "Drug-level and account-level P&L", "LLM pricing guidance chat"], dataInputs: ["Distribution Pricing & Rebates", "GPO Rebates", "Customer & Account Data"], intelligenceUsed: ["Machine Learning", "AI Prompting Tools"], impact: "$6\u201312M upside through improved pricing efficiency. Compresses analyst time per deal and systematically protects margin on every renewal." },
  { id: "xray", name: "X-Ray", tagline: "Drug pricing transparency", color: "#3B82F6", status: "Building", statusColor: "#F59E0B", description: "Customer-facing solution delivering full drug pricing transparency and net cost recovery visibility to practices. Shows the complete cost walk from WAC through discounts and rebates to net price, then layers in reimbursement to reveal per-drug NCR. Built on the same shared data infrastructure as Nova.", capabilities: ["WAC-to-net-price cost walk per drug", "Net cost recovery (NCR) calculation", "Reimbursement vs. net price comparison", "Customer-facing and field rep views", "Real-time rebate feed integration"], dataInputs: ["Distribution Pricing & Rebates", "GPO Rebates"], intelligenceUsed: ["Machine Learning", "AI Prompting Tools", "Agents"], impact: "Gives practices and field reps full visibility into drug economics \u2014 pricing transparency that drives competitive market response and enables data-driven drug decisions at the point of care." },
  { id: "skynet", name: "Skynet", tagline: "Dynamic QBR portal", color: "#EF4444", status: "Planning", statusColor: "#A8B8CC", description: "Replaces the static PowerPoint QBR process. Pulls data from disparate sources into a unified schema and delivers it through a dynamic, interactive customer portal. The rep or customer can ask any question in natural language \u2014 converted to SQL on the fly against a live database.", capabilities: ["Automated data aggregation from all sources", "Dynamic customer-facing portal", "Natural language to SQL query engine", "Real-time distribution purchase analytics", "GPO rebate, PMID, biosimilar reporting", "Technology adoption tracking"], dataInputs: ["GPO Rebates", "MID Data", "Biosimilar Utilization", "Customer & Account Data"], intelligenceUsed: ["AI Prompting Tools"], impact: "Moves from a static PowerPoint deck with manual data gathering to a live customer experience. Eliminates hours of rep prep time per QBR cycle." },
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
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 6px", maxWidth: 720, lineHeight: 1.6 }}>Oncology and Multi-Specialty AI Platform Architecture</p>
      <p style={{ fontSize: 15, color: "#D0DAE6", margin: "0 0 48px", lineHeight: 1.5 }}>Click any project or data bucket to explore.</p>

      <SectionHeader label="Applications" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 4 }}>
        {projects.map((p, i) => (
          <div key={p.id} onClick={() => setActiveProject(activeProject === i ? null : i)} style={{ background: activeProject === i ? `${p.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activeProject === i ? p.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: p.color, opacity: activeProject === i ? 1 : 0.4 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: p.color }}>{p.name}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: p.statusColor, background: `${p.statusColor}15`, border: `1px solid ${p.statusColor}30`, borderRadius: 4, padding: "2px 7px", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{p.status}</span>
            </div>
            <div style={{ fontSize: 15, color: "#D0DAE6" }}>{p.tagline}</div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div style={{ margin: "12px 0 0", background: `${selectedProject.color}08`, border: `1px solid ${selectedProject.color}20`, borderRadius: 12, padding: "28px 28px 24px", animation: "fadeIn 0.2s ease" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedProject.color, marginBottom: 6 }}>Project overview</div>
            <p style={{ fontSize: 17, color: "#E2EAF2", margin: 0, lineHeight: 1.65 }}>{selectedProject.description}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 14 }}>Capabilities</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {selectedProject.capabilities.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: selectedProject.color, marginTop: 7, flexShrink: 0, boxShadow: `0 0 6px ${selectedProject.color}40` }} />
                    <span style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.5 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 12 }}>Data inputs</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selectedProject.dataInputs.map((d, i) => (
                    <span key={i} style={{ fontSize: 14, color: "#D0DAE6", background: "rgba(148,163,184,0.08)", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 6, padding: "4px 10px" }}>{d}</span>
                  ))}
                </div>
              </div>
              <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 12 }}>Intelligence used</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selectedProject.intelligenceUsed.map((d, i) => (
                    <span key={i} style={{ fontSize: 14, color: selectedProject.color, background: `${selectedProject.color}12`, border: `1px solid ${selectedProject.color}25`, borderRadius: 6, padding: "4px 10px" }}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: "14px 18px", background: `${selectedProject.color}0A`, border: `1px solid ${selectedProject.color}18`, borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 12 }}>
            <span style={{ color: selectedProject.color, fontSize: 16, marginTop: 1 }}>{"\u25C6"}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: selectedProject.color, marginBottom: 4 }}>Business impact</div>
              <span style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.6 }}>{selectedProject.impact}</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 40px" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#D0DAE6", whiteSpace: "nowrap" }}>builds on</span>
        <div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} />
      </div>

      <SectionHeader label="Intelligence layer" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 4 }}>
        {intelligenceLayer.map((layer) => (
          <div key={layer.id} style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 12, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: layer.color, opacity: 0.5 }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF", marginBottom: 3 }}>{layer.title}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#B8C8DA", marginBottom: 16 }}>{layer.subtitle}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
              {layer.capabilities.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: layer.color, marginTop: 6, flexShrink: 0, opacity: 1 }} />
                  <span style={{ fontSize: 15, color: "#E2EAF2", lineHeight: 1.5 }}>{c}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {layer.usedBy.map((proj, i) => { const p = projects.find((x) => x.name === proj); return (
                <span key={i} style={{ fontSize: 13, color: p ? p.color : "#D0DAE6", background: p ? `${p.color}12` : "rgba(148,163,184,0.08)", border: `1px solid ${p ? p.color + "25" : "rgba(148,163,184,0.15)"}`, borderRadius: 5, padding: "2px 8px", fontFamily: "'JetBrains Mono', monospace" }}>{proj}</span>
              ); })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 40px" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#D0DAE6", whiteSpace: "nowrap" }}>powered by</span>
        <div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} />
      </div>

      <SectionHeader label="Data layer" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {dataLayer.map((bucket, i) => (
          <div key={bucket.id} onClick={() => setActiveDataBucket(activeDataBucket === i ? null : i)} style={{ background: activeDataBucket === i ? `${bucket.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activeDataBucket === i ? bucket.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "16px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: bucket.color, opacity: activeDataBucket === i ? 1 : 0.35 }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: bucket.color, marginBottom: 10, lineHeight: 1.3, minHeight: 34 }}>{bucket.title}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {bucket.items.slice(0, 3).map((item, j) => (
                <span key={j} style={{ fontSize: 13, color: "#E2EAF2", background: "rgba(148,163,184,0.10)", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 4, padding: "2px 7px" }}>{item}</span>
              ))}
              {bucket.items.length > 3 && <span style={{ fontSize: 13, color: "#D0DAE6", padding: "2px 4px" }}>+{bucket.items.length - 3} more</span>}
            </div>
          </div>
        ))}
      </div>

      {selectedBucket && (
        <div style={{ margin: "12px 0 0", background: `${selectedBucket.color}08`, border: `1px solid ${selectedBucket.color}20`, borderRadius: 12, padding: "24px 28px", animation: "fadeIn 0.2s ease" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedBucket.color, marginBottom: 16 }}>{selectedBucket.title} &mdash; full data inventory</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
            {selectedBucket.items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: selectedBucket.color, flexShrink: 0, boxShadow: `0 0 6px ${selectedBucket.color}50` }} />
                <span style={{ fontSize: 16, color: "#E2EAF2" }}>{item}</span>
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
  { id: 1, years: "2022\u20132023", title: "The Chat Revolution", tagline: "AI goes mainstream overnight", color: "#3B82F6", icon: "\uD83D\uDCAC", summary: "ChatGPT launched November 30, 2022 and reached 100 million users in two months \u2014 the fastest-growing consumer application in history. For most people, this was their first interaction with a large language model.", capabilities: ["Natural language Q&A and conversation", "Essay writing, summarization, translation", "Simple code generation and explanation", "Brainstorming and creative ideation"], limitations: ["Frequent hallucination \u2014 confidently wrong answers", "No internet access or real-time information", "Text-only \u2014 couldn\u2019t process images or documents", "Short context windows (~8K tokens, a few pages)"], milestones: [{ date: "Nov 2022", event: "ChatGPT launches (GPT-3.5)", highlight: true }, { date: "Feb 2023", event: "Microsoft integrates GPT into Bing", highlight: false }, { date: "Mar 2023", event: "GPT-4 releases \u2014 major reasoning leap", highlight: true }, { date: "Mar 2023", event: "Anthropic launches Claude 1", highlight: false }, { date: "Mar 2023", event: "Google launches Bard", highlight: false }, { date: "Jul 2023", event: "Meta releases Llama 2 (open source)", highlight: true }, { date: "Nov 2023", event: "OpenAI launches custom GPTs", highlight: false }], enterprise: "Most adoption was experimental \u2014 individuals trying ChatGPT for emails and brainstorming. No organizational AI strategy existed yet. This was the \u2018try it and see\u2019 era." },
  { id: 2, years: "2024", title: "Reasoning & Multimodal AI", tagline: "AI learns to think and see", color: "#8B5CF6", icon: "\uD83E\uDDE0", summary: "2024 was the year AI models learned to reason step-by-step, process images and documents, and follow complex multi-step instructions. Context windows expanded from pages to entire books.", capabilities: ["Chain-of-thought reasoning on complex problems", "Image, PDF, and document analysis", "1M+ token context windows (entire codebases)", "Computer use \u2014 AI controlling screen interfaces"], limitations: ["Reasoning models were slow and expensive", "Computer use was experimental and error-prone", "Still primarily a Q&A tool, not an action-taker", "Enterprise integration remained difficult"], milestones: [{ date: "Feb 2024", event: "Gemini 1.5 Pro \u2014 1M token context window", highlight: true }, { date: "Mar 2024", event: "Claude 3 launches (Opus, Sonnet, Haiku)", highlight: false }, { date: "May 2024", event: "GPT-4o \u2014 text, image, audio, video in one model", highlight: false }, { date: "Jun 2024", event: "Claude 3.5 Sonnet \u2014 cheaper beats bigger", highlight: true }, { date: "Sep 2024", event: "OpenAI o1 \u2014 first dedicated reasoning model", highlight: true }, { date: "Oct 2024", event: "Claude 3.5 Sonnet v2 with Computer Use", highlight: false }, { date: "Dec 2024", event: "Gemini 2.0 Flash with agentic features", highlight: false }], enterprise: "Organizations moved from experimentation to pilot programs. AI could now process documents and reason through complex workflows \u2014 making it relevant for healthcare, finance, and legal applications." },
  { id: 3, years: "2025", title: "The Coding Assistant Wave", tagline: "AI starts building things", color: "#EC4899", icon: "\u26A1", summary: "AI transitioned from answering questions about code to actually writing, testing, and deploying it. Claude Code and Codex turned natural language into functional software. \u2018Vibe coding\u2019 entered the vocabulary.", capabilities: ["Full-file code generation from natural language", "Terminal-native agents that read, write, test, and commit code", "End-to-end project creation and deployment", "Multi-step debugging and refactoring"], limitations: ["Still single-agent \u2014 one AI doing everything", "Complex integrations required significant human guidance", "Production quality varied \u2014 good for prototypes, risky for critical systems", "Non-developers still largely excluded from building"], milestones: [{ date: "Feb 2025", event: "Claude Code launches (research preview)", highlight: true }, { date: "Feb 2025", event: "Claude 3.7 Sonnet \u2014 extended thinking", highlight: false }, { date: "May 2025", event: "Claude 4 launches \u2014 professional-grade coding", highlight: true }, { date: "May 2025", event: "OpenAI Codex launches as cloud coding agent", highlight: true }, { date: "Aug 2025", event: "GPT-5 launches \u2014 unified reasoning + intelligence", highlight: false }, { date: "Oct 2025", event: "Claude Sonnet 4.5 \u2014 best cost-to-performance ratio", highlight: false }, { date: "Nov 2025", event: "Claude Code hits $1B annualized revenue", highlight: false }, { date: "Nov 2025", event: "Claude Opus 4.5 \u2014 reclaims coding benchmark lead", highlight: false }, { date: "Dec 2025", event: "GPT-5.2 launches \u2014 400K context, three modes", highlight: false }], enterprise: "The developer workflow fundamentally shifted. Plan with AI \u2192 generate with a coding agent \u2192 review \u2192 deploy. People who couldn\u2019t code were building functional applications. AI became a building tool, not just a writing assistant." },
  { id: 4, years: "2026", title: "The Orchestration Era", tagline: "From writing code to directing AI teams", color: "#F59E0B", icon: "\uD83C\uDFAF", summary: "The current era. Practitioners no longer write code \u2014 they orchestrate AI systems. Multiple specialized agents coordinate on projects. The role evolved from \u2018developer\u2019 to \u2018AI director.\u2019", capabilities: ["Multi-agent teams dividing and coordinating work", "Planning engines + build engines as separate roles", "Non-developers building production software via Cowork", "MCP connecting AI to databases, payments, APIs, and enterprise systems"], limitations: ["Multi-agent coordination can fail on complex dependencies", "Autonomous agents in regulated environments require governance", "Costs scale with complexity \u2014 multi-agent runs aren\u2019t cheap", "Organizational readiness still lags tool capabilities"], milestones: [{ date: "Jan 2026", event: "Claude Cowork launches \u2014 GUI agent for non-developers", highlight: true }, { date: "Jan 2026", event: "GPT-5.2-Codex \u2014 agentic coding with context compaction", highlight: false }, { date: "Feb 2026", event: "Claude Opus 4.6 \u2014 1M context, Agent Teams", highlight: true }, { date: "Feb 2026", event: "Claude Sonnet 4.6 \u2014 matches prior Opus at \u00BC cost", highlight: false }, { date: "Feb 2026", event: "Codex desktop app \u2014 multi-agent management", highlight: false }, { date: "Mar 2026", event: "GPT-5.4 launches \u2014 Codex surpasses 2M weekly users", highlight: true }, { date: "Mar 2026", event: "Claude Agent SDK \u2014 build production agents as a library", highlight: false }, { date: "Mar 2026", event: "MCP ecosystem matures \u2014 connects AI to everything", highlight: false }], enterprise: "The competitive advantage is no longer access to better AI \u2014 everyone has frontier models. It\u2019s how fast an organization adopts AI into workflows. Data quality is the bottleneck, not model quality. McKesson\u2019s data moat (Ontada, Compile, distribution) is the differentiator." },
];

const stats = [
  { label: "Enterprise AI Adoption", values: ["~55%", "~72%", "~88%", "90%+"] },
  { label: "Max Context Window", values: ["32K tokens", "1M tokens", "1M tokens", "1M+ (GA)"] },
  { label: "AI Equity Investment", values: ["~$50B", "~$95B", "$124B+", "Growing"] },
  { label: "Agentic AI Jobs", values: ["Negligible", "Emerging", "985% YoY growth", "Mainstream"] },
];

const levels = [
  { level: 1, title: "AI User", subtitle: "Effective Prompting & Interpretation", analogy: "Knows how to drive the car", color: "#3B82F6", description: "Can interact with conversational AI models to get useful results. Understands basic prompting principles and can iterate to improve output quality.", competencies: ["Crafts clear, specific prompts that produce actionable results", "Iterates on prompts \u2014 refines based on output quality", "Recognizes when AI output is wrong or hallucinated", "Uses AI for writing, summarization, research, and brainstorming", "Understands basic limitations and knowledge cutoffs", "Familiar with at least one major AI platform"], interview: [{ type: "Prompt Refinement", desc: "Give a vague prompt and ask them to improve it" }, { type: "Output Evaluation", desc: "Show an AI response with subtle errors \u2014 can they spot them?" }, { type: "Use Case ID", desc: "Describe 3 ways they\u2019d use AI in their current role" }] },
  { level: 2, title: "AI Project Designer", subtitle: "Context Engineering & Persona Design", analogy: "Plans the route and configures the GPS", color: "#8B5CF6", description: "Structures AI projects within platforms like Claude Projects or ChatGPT. Designs persistent context \u2014 instructions, personas, and reference materials \u2014 that shape AI behavior across an entire body of work.", competencies: ["Creates projects with custom instructions and knowledge files", "Writes system-level instructions defining tone, scope, and constraints", "Designs persona-based approaches (PM, developer, QA, domain expert)", "Curates and uploads reference documents for domain context", "Uses conversation starters and templates for team workflows", "Fluent in markdown formatting for AI instructions"], interview: [{ type: "Project Design", desc: "Set up an AI assistant for the sales team \u2014 walk through it" }, { type: "Persona Creation", desc: "What personas for a revenue cycle optimization project?" }, { type: "Instruction Writing", desc: "Write system instructions for a Claude Project scenario" }] },
  { level: 3, title: "AI Builder", subtitle: "Prototypes & Simple Applications", analogy: "Builds a go-kart using AI-powered tools", color: "#EC4899", description: "Uses AI coding tools to generate functional websites, components, and straightforward applications. Can take an idea from concept to working prototype using AI-assisted development.", competencies: ["Uses Claude Code, Codex, or Cursor to generate working code", "Builds websites, landing pages, and simple interactive apps", "Uses AI as a planning engine for requirements and task breakdowns", "Deploys simple projects via GitHub and Vercel", "Creates and modifies basic database schemas with AI help", "Can read and evaluate AI-generated code for obvious errors"], interview: [{ type: "Build Walkthrough", desc: "Describe something you\u2019ve built with AI coding tools" }, { type: "Code Review", desc: "Identify a bug in AI-generated code and describe a fix" }, { type: "Tool Selection", desc: "What tools to build a simple internal task tracker?" }] },
  { level: 4, title: "AI Developer", subtitle: "Full-Stack Production Systems", analogy: "Builds and ships a production vehicle with all systems connected", color: "#F59E0B", description: "Orchestrates full-stack, production-grade applications using AI-assisted development. Manages complex integrations \u2014 authentication, payments, messaging \u2014 across multi-service architectures.", competencies: ["Architects multi-service apps: frontend, backend, database, deployment", "Integrates OAuth, Stripe, Twilio, analytics, and external APIs", "Connects AI to tools and data sources via MCP", "Designs relational schemas with RLS, triggers, and migrations", "Manages environments, secrets, and production safeguards", "Orchestrates agentic workflows with human-in-the-loop patterns"], interview: [{ type: "Architecture Design", desc: "Design a patient portal with scheduling, messaging, and insurance verification" }, { type: "Integration Scenario", desc: "Add Stripe billing to an existing Next.js + Supabase app" }, { type: "Debugging", desc: "Stripe webhooks aren\u2019t updating Supabase \u2014 diagnose it" }] },
  { level: 5, title: "AI Architect", subtitle: "LLM Customization & System Design", analogy: "Designs and modifies the engine itself", color: "#EF4444", description: "Works directly with LLM internals \u2014 fine-tuning models, customizing training data, designing multi-model systems, and building novel agentic architectures. Extends, adapts, and creates AI tools.", competencies: ["Fine-tunes LLMs on proprietary or domain-specific datasets", "Designs training data pipelines: collection, cleaning, labeling", "Understands transformer internals, attention, tokenization", "Builds custom agentic reasoning and decision-making systems", "Implements RAG pipelines with custom embedding strategies", "Manages model deployment: optimization, cost, scaling, monitoring"], interview: [{ type: "System Design", desc: "Design an AI system for automated claims adjudication" }, { type: "Fine-tuning", desc: "When to fine-tune vs. RAG vs. prompt engineering?" }, { type: "Multi-Agent", desc: "Design a multi-agent system for drug distribution logistics" }] },
];

const roleMapping = [
  { role: "Business analyst, operations, clinical, sales", levels: "2\u20133", bar: 2.5 },
  { role: "Product manager, project manager, team lead", levels: "3\u20134", bar: 3.5 },
  { role: "Software developer, data analyst, IT", levels: "3\u20135", bar: 4 },
  { role: "AI/ML engineer, platform architect", levels: "4\u20135", bar: 4.5 },
  { role: "Executive, VP, director", levels: "2\u20133", bar: 2.5 },
];

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
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#D0DAE6" }}>AI Timeline</span>
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 700, color: "#FFFFFF", margin: "0 0 8px", lineHeight: 1.15 }}>The Evolution of AI</h1>
        <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 48px", maxWidth: 660, lineHeight: 1.6 }}>From ChatGPT&apos;s launch to the orchestration era &mdash; how AI transformed from a curiosity to a production platform in four years.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 4 }}>
          {eras.map((era, i) => (
            <div key={era.id} onClick={() => setActiveEra(activeEra === i ? null : i)} style={{ background: activeEra === i ? `${era.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activeEra === i ? era.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: era.color, opacity: activeEra === i ? 1 : 0.4 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: era.color }}>{era.years}</span>
                <span style={{ fontSize: 18 }}>{era.icon}</span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF", marginBottom: 4 }}>{era.title}</div>
              <div style={{ fontSize: 15, color: "#D0DAE6" }}>{era.tagline}</div>
            </div>
          ))}
        </div>

        {selected && (
          <div style={{ margin: "12px 0 0", background: `${selected.color}08`, border: `1px solid ${selected.color}20`, borderRadius: 12, padding: "28px 28px 24px", animation: "fadeIn 0.2s ease" }}>
            <p style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.7, margin: "0 0 24px" }}>{selected.summary}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <Card><SectionHeader label="What It Could Do" /><DotList items={selected.capabilities} color={selected.color} /></Card>
              <Card><SectionHeader label="What It Couldn&apos;t Do Yet" /><DotList items={selected.limitations} dimColor="#D0DAE6" /></Card>
            </div>
            <Card style={{ marginBottom: 16 }}>
              <SectionHeader label="Key Milestones" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 8 }}>
                {selected.milestones.map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, background: m.highlight ? `${selected.color}0C` : "transparent", border: m.highlight ? `1px solid ${selected.color}20` : "1px solid transparent" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: selected.color, whiteSpace: "nowrap", minWidth: 72 }}>{m.date}</span>
                    <span style={{ fontSize: 16, color: m.highlight ? "#F0F4F8" : "#E2EAF2", fontWeight: m.highlight ? 600 : 400 }}>{m.event}</span>
                  </div>
                ))}
              </div>
            </Card>
            <div style={{ padding: "18px 22px", background: `${selected.color}08`, border: `1px solid ${selected.color}18`, borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontSize: 16, color: selected.color, marginTop: 1 }}>{"\u25C6"}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: selected.color, marginBottom: 6 }}>What This Meant for Enterprise</div>
                <span style={{ fontSize: 17, color: "#E2EAF2", lineHeight: 1.65 }}>{selected.enterprise}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <VelocityChart />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px 0" }}>
        <SectionHeader label="The Numbers Tell the Story" />
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "200px repeat(4, 1fr)", borderBottom: "1px solid rgba(148,163,184,0.1)", padding: "14px 20px" }}>
            <span />
            {eras.map((era, i) => (<span key={era.id} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: activeEra === i ? era.color : "#D0DAE6", textAlign: "center", transition: "color 0.2s ease" }}>{era.years}</span>))}
          </div>
          {stats.map((stat, si) => (
            <div key={si} style={{ display: "grid", gridTemplateColumns: "200px repeat(4, 1fr)", padding: "12px 20px", borderBottom: si < stats.length - 1 ? "1px solid rgba(148,163,184,0.06)" : "none" }}>
              <span style={{ fontSize: 15, color: "#D0DAE6" }}>{stat.label}</span>
              {stat.values.map((v, vi) => (<span key={vi} style={{ fontSize: 15, textAlign: "center", fontWeight: activeEra === vi ? 600 : 400, color: activeEra === vi ? eras[vi].color : "#E2EAF2", transition: "all 0.2s ease" }}>{v}</span>))}
            </div>
          ))}
        </Card>
      </div>

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
    { id: "tokens", label: "Tokens per Watt", unit: "Relative throughput index (Nov 2022 = 1\u00D7)", description: "How much useful AI output is produced per watt of energy consumed. Hardware and inference software optimizations compound independently from raw chip performance.", source: "Sources: MLCommons MLPerf Inference benchmarks (2022\u20132025), Anthropic efficiency disclosures", mooresColor: "#A8B8CC", aiColor: "#8B5CF6", mooresLabel: "Expected hardware gains", aiLabel: "Actual tokens / watt", moores: [{ x: 0, y: 1 }, { x: 12, y: 1.4 }, { x: 24, y: 2 }, { x: 36, y: 2.8 }, { x: 40, y: 3.2 }], ai: [{ x: 0, y: 1 }, { x: 8, y: 3 }, { x: 16, y: 8 }, { x: 24, y: 18 }, { x: 32, y: 35 }, { x: 40, y: 60 }], callout: "Tokens per watt has improved ~60\u00D7 since 2022 \u2014 driven by H100 hardware, inference optimization, and model distillation. Hardware improvements alone would have delivered ~3\u00D7." },
    { id: "flops", label: "Training Compute", unit: "Relative FLOP index \u2014 log scale (Nov 2022 = 1\u00D7)", description: "Total floating point operations invested in training frontier models. Sets the ceiling for model capability and reflects the industry\u2019s compounding investment in AI intelligence.", source: "Sources: Epoch AI Training Compute Database (2024), OpenAI scaling law papers, Anthropic model cards", mooresColor: "#A8B8CC", aiColor: "#F59E0B", mooresLabel: "Moore\u2019s Law expectation", aiLabel: "Frontier model training FLOP", moores: [{ x: 0, y: 1 }, { x: 12, y: 1.4 }, { x: 24, y: 2 }, { x: 36, y: 2.8 }, { x: 40, y: 3.2 }], ai: [{ x: 0, y: 1 }, { x: 6, y: 3 }, { x: 14, y: 10 }, { x: 22, y: 30 }, { x: 30, y: 80 }, { x: 40, y: 200 }], callout: "Training compute for frontier models has grown ~200\u00D7 since GPT-3.5 \u2014 doubling roughly every 6 months vs. every 24 months under Moore\u2019s Law." },
  ];
  const m = metrics[activeMetric];
  const W = 900, H = 270, PAD = { t: 24, r: 20, b: 52, l: 72 };
  const innerW = W - PAD.l - PAD.r, innerH = H - PAD.t - PAD.b;
  const xMax = 40;
  const allY = [...m.moores.map((p: {x:number,y:number}) => p.y), ...m.ai.map((p: {x:number,y:number}) => p.y)];
  const logMin = Math.log10(Math.min(...allY) * 0.8), logMax = Math.log10(Math.max(...allY) * 1.15);
  const cx = (x: number) => PAD.l + (x / xMax) * innerW;
  const cy = (y: number) => PAD.t + innerH - ((Math.log10(y) - logMin) / (logMax - logMin)) * innerH;
  const toPath = (pts: {x:number,y:number}[]) => pts.map((p, i) => `${i === 0 ? "M" : "L"} ${cx(p.x).toFixed(1)} ${cy(p.y).toFixed(1)}`).join(" ");
  const xLabels = [{ x: 0, label: "Nov '22" }, { x: 10, label: "Sep '23" }, { x: 20, label: "Jul '24" }, { x: 30, label: "May '25" }, { x: 40, label: "Mar '26" }];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px 0" }}>
      <SectionHeader label="Compute Growth vs. Moore&apos;s Law" />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {metrics.map((met, i) => (<button key={met.id} onClick={() => setActiveMetric(i)} style={{ background: activeMetric === i ? "rgba(59,130,246,0.12)" : "transparent", border: activeMetric === i ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(148,163,184,0.15)", borderRadius: 8, padding: "8px 16px", cursor: "pointer", outline: "none", fontSize: 15, fontWeight: activeMetric === i ? 600 : 400, color: activeMetric === i ? "#F0F4F8" : "#B8C8DA", transition: "all 0.2s ease" }}>{met.label}</button>))}
      </div>
      <Card style={{ padding: "24px 24px 20px" }}>
        <div style={{ fontSize: 14, color: "#B8C8DA", marginBottom: 8, fontFamily: "'JetBrains Mono', monospace" }}>{m.unit}</div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
          {(() => { const ticks: React.ReactNode[] = []; const tickCandidates = [0.1, 0.25, 0.5, 1, 2, 3, 5, 10, 20, 30, 50, 100, 200, 500]; const yDataMin = Math.min(...allY); const yDataMax = Math.max(...allY); tickCandidates.filter(v => v >= yDataMin * 0.7 && v <= yDataMax * 1.3).forEach((v, i) => { const yPos = cy(v); const label = v >= 1000 ? `${Math.round(v/1000)}K\u00D7` : v >= 10 ? `${Math.round(v)}\u00D7` : v >= 1 ? `${parseFloat(v.toFixed(1))}\u00D7` : `${parseFloat(v.toFixed(2))}\u00D7`; ticks.push(<g key={i}><line x1={PAD.l - 4} y1={yPos} x2={W - PAD.r} y2={yPos} stroke="rgba(196,208,222,0.10)" strokeWidth="1" /><text x={PAD.l - 8} y={yPos} textAnchor="end" dominantBaseline="central" fontSize="11" fill="#D0DAE6" fontFamily="JetBrains Mono, monospace">{label}</text></g>); }); return ticks; })()}
          <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + innerH} stroke="rgba(196,208,222,0.15)" strokeWidth="1" />
          <path d={toPath(m.moores)} fill="none" stroke={m.mooresColor} strokeWidth="2" strokeDasharray="6 4" />
          <path d={toPath(m.ai)} fill="none" stroke={m.aiColor} strokeWidth="2.5" />
          {m.ai.map((p: {x:number,y:number}, i: number) => (<circle key={i} cx={cx(p.x)} cy={cy(p.y)} r="4" fill={m.aiColor} />))}
          {xLabels.map(l => (<text key={l.x} x={cx(l.x)} y={H - 8} textAnchor="middle" fontSize="11" fill="#D0DAE6" fontFamily="JetBrains Mono, monospace">{l.label}</text>))}
          <line x1={PAD.l + 4} y1={PAD.t + 8} x2={PAD.l + 28} y2={PAD.t + 8} stroke={m.mooresColor} strokeWidth="2" strokeDasharray="6 4" />
          <text x={PAD.l + 34} y={PAD.t + 13} fontSize="12" fill="#D0DAE6" fontFamily="DM Sans, sans-serif">{m.mooresLabel}</text>
          <line x1={PAD.l + 220} y1={PAD.t + 8} x2={PAD.l + 244} y2={PAD.t + 8} stroke={m.aiColor} strokeWidth="2.5" />
          <text x={PAD.l + 250} y={PAD.t + 13} fontSize="12" fill={m.aiColor} fontWeight="600" fontFamily="DM Sans, sans-serif">{m.aiLabel}</text>
        </svg>
        <div style={{ marginTop: 16, padding: "14px 18px", background: `${m.aiColor}0A`, border: `1px solid ${m.aiColor}20`, borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span style={{ color: m.aiColor, fontSize: 16, flexShrink: 0, marginTop: 1 }}>{"\u25C6"}</span>
          <div>
            <div style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.6 }}>{m.callout}</div>
            <div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 6, fontFamily: "'JetBrains Mono', monospace" }}>{m.source}</div>
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 15, color: "#B8C8DA", lineHeight: 1.6 }}>{m.description}</div>
      </Card>
    </div>
  );
}

// ============================================================
// SDLC VELOCITY CHART
// ============================================================

const velocityData = [
  { era: "Pre-AI baseline", period: "Before 2023", multiplier: 1, color: "#B8C8DA", projected: false, description: "Traditional software development \u2014 no AI assistance in the workflow.", source: "" },
  { era: "GitHub Copilot", period: "2023", multiplier: 1.25, color: "#3B82F6", projected: false, description: "Autocomplete and single-file suggestions. Modest gains on defined tasks \u2014 developers still drive all architecture, design, and implementation decisions.", source: "GitHub (2023): Developers complete tasks 55% faster on narrow autocomplete tasks; real-world net gain more modest" },
  { era: "Early coding agents", period: "Early 2025", multiplier: 2, color: "#8B5CF6", projected: false, description: "Claude Code and Codex \u2014 multi-file generation and full feature scaffolding. AI begins handling implementation; human handles direction and review.", source: "McKinsey (2025): AI coding tools deliver 2\u20134\u00D7 on well-defined tasks; 2\u00D7 reflects real-world average across mixed workloads" },
  { era: "Claude 4 + extended thinking", period: "Mid 2025", multiplier: 3.5, color: "#EC4899", projected: false, description: "Architecture-level reasoning, test generation, and large-scale refactoring. AI reasons across entire codebases and proposes structural changes with minimal guidance.", source: "Anthropic (2025): Claude 4 SWE-bench \u2014 72.5% autonomous task resolution on complex software benchmarks" },
  { era: "Opus 4.6 Agent Teams", period: "Q1 2026", multiplier: 7, color: "#F59E0B", projected: false, description: "Multi-agent parallelism \u2014 specialized agents plan, build, test, and review concurrently. Human role shifts from implementation to orchestration and approval.", source: "Anthropic (2026): Agent Teams benchmark \u2014 parallel workstreams deliver ~3\u00D7 throughput vs. single-agent baseline" },
  { era: "Next-gen agents (projected)", period: "Q1 2027 est.", multiplier: 14, color: "#10B981", projected: true, description: "Projected: autonomous sprint planning, self-healing test suites, continuous deployment pipelines. Human role is outcome definition and governance.", source: "Estimated \u2014 extrapolated from Epoch AI scaling trajectory and current agent benchmark progression" },
];

function VelocityChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxMult = 20;
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
      <SectionHeader label="Developer Velocity \u2014 AI Coding Tools Over Time" />
      <div style={{ fontSize: 15, color: "#B8C8DA", marginBottom: 24, lineHeight: 1.6, maxWidth: 720 }}>Output multiplier relative to a developer working without AI assistance. Based on published benchmarks and research \u2014 hover each bar for source details.</div>
      <Card style={{ padding: "28px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {velocityData.map((d, i) => { const pct = (d.multiplier / maxMult) * 100; const isHovered = hovered === i; return (
            <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <div style={{ display: "grid", gridTemplateColumns: "172px 1fr 56px", alignItems: "center", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: d.projected ? "#B8C8DA" : "#E2EAF2", lineHeight: 1.3 }}>{d.era}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: d.color, marginTop: 2 }}>{d.period}</div>
                </div>
                <div style={{ height: 36, borderRadius: 6, background: "rgba(148,163,184,0.08)", position: "relative", overflow: "hidden", border: `1px solid ${isHovered ? d.color : d.color + "90"}`, transition: "all 0.15s ease", cursor: "default" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: d.projected ? `repeating-linear-gradient(45deg, ${d.color}CC, ${d.color}CC 6px, ${d.color}66 6px, ${d.color}66 12px)` : isHovered ? `${d.color}EE` : `${d.color}BB`, borderRight: `3px solid ${d.color}`, borderRadius: "0 4px 4px 0", transition: "all 0.3s ease", boxShadow: isHovered ? `0 0 24px ${d.color}80` : `0 0 10px ${d.color}30` }} />
                  {d.projected && <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: d.color, fontWeight: 600, letterSpacing: 0.5 }}>ESTIMATED</div>}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 700, color: d.color, textAlign: "right" }}>{d.multiplier}&times;</div>
              </div>
              {isHovered && (
                <div style={{ marginTop: 8, marginLeft: 186, padding: "10px 14px", background: `${d.color}08`, border: `1px solid ${d.color}18`, borderRadius: 8, animation: "fadeIn 0.15s ease" }}>
                  <div style={{ fontSize: 15, color: "#E2EAF2", lineHeight: 1.55, marginBottom: d.source ? 6 : 0 }}>{d.description}</div>
                  {d.source && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#B8C8DA" }}>{d.source}</div>}
                </div>
              )}
            </div>
          ); })}
        </div>
        <div style={{ marginTop: 28, padding: "18px 20px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.18)", borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 14 }}>
          <span style={{ color: "#3B82F6", fontSize: 16, flexShrink: 0, marginTop: 1 }}>{"\u25C6"}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#3B82F6", marginBottom: 6 }}>The urgency case</div>
            <span style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.7 }}>A team with access to Opus 4.6 Agent Teams today ships roughly <strong style={{ color: "#FFFFFF" }}>7&times; the output</strong> of a team working without AI assistance &mdash; compared to <strong style={{ color: "#FFFFFF" }}>1.25&times; with Copilot alone</strong>. The gap between organizations using advanced AI tooling and those still on basic autocomplete is not incremental. It is structural, and it compounds every sprint.</span>
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
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#D0DAE6" }}>Assessment Framework</span>
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 700, color: "#FFFFFF", margin: "0 0 8px", lineHeight: 1.15 }}>AI Knowledge Levels</h1>
        <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 48px", maxWidth: 660, lineHeight: 1.6 }}>A five-level framework for assessing AI literacy &mdash; from effective prompting to LLM customization.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 4 }}>
          {levels.map((l, i) => (
            <div key={l.level} onClick={() => setActiveLevel(activeLevel === i ? null : i)} style={{ background: activeLevel === i ? `${l.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activeLevel === i ? l.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: l.color, opacity: activeLevel === i ? 1 : 0.4 }} />
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: l.color, fontWeight: 600, marginBottom: 6 }}>Level {l.level}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", marginBottom: 4, lineHeight: 1.3 }}>{l.title}</div>
              <div style={{ fontSize: 14, color: "#B8C8DA" }}>{l.subtitle}</div>
            </div>
          ))}
        </div>
        {selected && (
          <div style={{ margin: "12px 0 0", background: `${selected.color}08`, border: `1px solid ${selected.color}20`, borderRadius: 12, padding: "28px 28px 24px", animation: "fadeIn 0.2s ease" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: `${selected.color}15`, border: `1px solid ${selected.color}30`, marginBottom: 20 }}>
              <span style={{ fontSize: 15, color: selected.color }}>{"\u2726"}</span>
              <span style={{ fontSize: 15, color: selected.color, fontWeight: 500 }}>{selected.analogy}</span>
            </div>
            <p style={{ fontSize: 17, color: "#F0F4F8", lineHeight: 1.7, margin: "0 0 24px", maxWidth: 740 }}>{selected.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <Card><SectionHeader label="Expected Competencies" /><DotList items={selected.competencies} color={selected.color} /></Card>
              <Card>
                <SectionHeader label="Interview Assessment" />
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {selected.interview.map((item, i) => (
                    <div key={i} style={{ padding: "14px 16px", background: `${selected.color}08`, border: `1px solid ${selected.color}18`, borderRadius: 8 }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 500, color: selected.color, marginBottom: 4, letterSpacing: 0.5 }}>{item.type}</div>
                      <div style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.5 }}>{item.desc}</div>
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
              <span style={{ fontSize: 16, color: "#E2EAF2" }}>{r.role}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: "#F0F4F8", fontWeight: 600 }}>{r.levels}</span>
              <div style={{ height: 6, borderRadius: 3, background: "rgba(148,163,184,0.08)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(r.bar / 5) * 100}%`, borderRadius: 3, background: `linear-gradient(90deg, ${levels[0].color}, ${levels[Math.min(Math.round(r.bar) - 1, 4)].color})`, opacity: 0.7 }} />
              </div>
            </div>
          ))}
        </Card>
        <div style={{ marginTop: 32, padding: "16px 20px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span style={{ color: "#3B82F6", fontSize: 16, marginTop: 1 }}>{"\u25C6"}</span>
          <span style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.6 }}><strong style={{ color: "#FFFFFF" }}>Level 2 is the floor.</strong>{" "}Every role should target at least Level 2 &mdash; the ability to structure AI projects, design personas, and engineer context. Levels are cumulative: a Level 4 candidate demonstrates all prior competencies.</span>
        </div>
      </div>
      <div style={{ height: 64 }} />
    </>
  );
}

// ============================================================
// NOVA + X-RAY DATA
// ============================================================

const novaXrayProjects = [
  { id: "xray", name: "X-Ray", tagline: "Customer-facing drug pricing transparency", color: "#3B82F6", status: "Building", statusColor: "#F59E0B", description: "Customer-facing solution that delivers full drug pricing transparency and net cost recovery visibility to practices. Shows the complete cost walk from WAC through discounts and rebates to net price, then layers in reimbursement to reveal per-drug NCR. Built on the same shared data infrastructure as Nova.", capabilities: ["WAC-to-net-price cost walk per drug", "Net cost recovery (NCR) calculation", "Reimbursement vs. net price comparison", "Real-time rebate feed integration", "Customer-facing and field rep views", "Designed for practice-level conversations"], dataInputs: ["Distribution Pricing & Rebates", "GPO Rebates"], intelligenceUsed: ["Machine Learning", "AI Prompting Tools", "Agents"], impact: "Gives practices and field reps full visibility into drug economics \u2014 pricing transparency that drives competitive market response and enables data-driven drug decisions at the point of care." },
  { id: "nova", name: "Nova 2.0", tagline: "Internal pricing intelligence engine \u2014 $6\u201312M identified upside", color: "#10B981", status: "In dev", statusColor: "#3B82F6", description: "Replaces the Excel-based pricing model end-to-end. Automates buy/sell economics across WAC, contract price, VCD, FFS, GPO admin fees, and OIDs. Phase 1 (competitive bid comparison) is live. Phase 3 adds AI deal recommendations. Phase 4 deploys small-account autonomy and field enablement.", capabilities: ["System of record for pricing \u2014 replaces Excel", "Automated buy/sell economics (WAC, VCD, FFS, OIDs)", "Real-time what-if scenario modeling", "SOX-compliant approval workflows", "Drug-level and account-level P&L", "AI deal recommendations (Phase 3)", "LLM pricing guidance chat (Phase 3)"], dataInputs: ["Distribution Pricing & Rebates", "GPO Rebates", "Customer & Account Data"], intelligenceUsed: ["Machine Learning", "AI Prompting Tools"], impact: "$6\u201312M upside through improved pricing efficiency. Compresses analyst time per deal and systematically protects margin on every renewal." },
];

const phases = [
  { id: 1, label: "Phase 1", title: "Competitive Bid Comparison", status: "Complete", statusColor: "#10B981", color: "#3B82F6", summary: "Live tool for comparing competitive bids across accounts. The foundation that proved the pricing automation concept.", highlights: ["Competitive bid comparison tool is live and in use", "Validated the data model and user workflow", "Established the engineering pattern for subsequent phases"] },
  { id: 2, label: "Phase 2", title: "Shared Data Plumbing (X-Ray)", status: "In progress", statusColor: "#F59E0B", color: "#3B82F6", summary: "Standing up the unified economics layer via X-Ray. Engineering capacity is dedicated here to land a workable POC. This becomes Nova 2.0\u2019s pricing-engine backbone.", highlights: ["Net price / cost recovery dashboard in active build", "Definitions + data discovery completed", "Pricing model fully decomposed", "GVI rebate feed integration in progress", "POC target: dashboard + economics waterfall in ~2 weeks"] },
  { id: 3, label: "Phase 3", title: "Guided Deal Intelligence", status: "Planned", statusColor: "#A8B8CC", color: "#8B5CF6", summary: "Activating the data foundation Phase 2 built. A pricing engine that learns, recommends, and scales \u2014 compressing analyst time per deal and protecting margin on every renewal.", highlights: ["AI-generated pricing recommendations by product and account", "LLM conversational pricing guidance grounded in live P&L", "Multi-scenario generation \u2014 compare 2\u20133 deal structures side-by-side", "Win/loss learning loops that improve the model with every deal cycle", "Optimization logic anchored to deterministic output \u2014 no black box"] },
  { id: 4, label: "Phase 4", title: "Scaling the Platform", status: "Future", statusColor: "#A8B8CC", color: "#EC4899", summary: "Extending Nova from an internal pricing engine to an enterprise-grade platform \u2014 deploying intelligence to field teams, enabling small-account self-service, and unlocking M&A deal modeling.", highlights: ["Small account autonomy: pricing rules by specialty and risk tier eliminate routine escalations", "Field enablement: reps run live pricing conversations without a laptop", "M&A floor analysis: automated profitability floor for acquisition targets", "LLM analyst intelligence: Nova evolves from pricing engine to pricing strategist", "Institutional pricing knowledge becomes a durable, scalable org asset"] },
];

const novaXrayIntelligence = [
  { id: "ml", title: "Machine Learning", subtitle: "Pattern recognition", color: "#8B5CF6", capabilities: ["Predictive pricing models", "Win / loss signal learning", "Margin forecasting", "Anomaly detection on deal economics", "Learning loops on deal outcomes"], usedBy: ["Nova 2.0", "X-Ray"] },
  { id: "prompting", title: "AI Prompting Tools", subtitle: "LLM interfaces", color: "#3B82F6", capabilities: ["Natural language to SQL", "Conversational Q&A on live P&L data", "Explainable, grounded pricing answers", "Document extraction & synthesis", "Pricing guidance chat"], usedBy: ["Nova 2.0", "X-Ray"] },
  { id: "agents", title: "Agents", subtitle: "Automated workflows", color: "#F59E0B", capabilities: ["Deal orchestration pipelines", "Multi-step data acquisition", "Scheduled monitoring & alerting", "Approval workflow automation", "Rebate feed ingestion"], usedBy: ["Nova 2.0", "X-Ray"] },
];

const novaXrayData = [
  { id: "pricing", title: "Distribution Pricing & Rebates", color: "#EC4899", items: ["WAC \u2014 wholesale acquisition cost", "Contract price", "OID discounts", "FFS distribution fees", "Buy-side rebates", "Net cost recovery", "Margin waterfall"] },
  { id: "gpo", title: "GPO Rebates", color: "#F59E0B", items: ["Manufacturer rebates", "Tier qualification logic", "GPO admin fees", "Rebate tier thresholds", "Contract compliance", "GVI rebate feeds", "Back-end economics"] },
  { id: "account", title: "Customer & Account Data", color: "#A78BFA", items: ["Practice demographics", "Account tier & segment", "Contract history", "Renewal dates & terms", "GPO affiliation", "Field rep assignments", "Retention risk signals"] },
];

// ============================================================
// NOVA + X-RAY PAGE
// ============================================================

function NovaXrayPage() {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [activeDataBucket, setActiveDataBucket] = useState<number | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const selectedProject = activeProject !== null ? novaXrayProjects[activeProject] : null;
  const selectedPhase = activePhase !== null ? phases[activePhase] : null;
  const selectedBucket = activeDataBucket !== null ? novaXrayData[activeDataBucket] : null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
      <h1 style={{ fontSize: 42, fontWeight: 700, color: "#FFFFFF", margin: "0 0 8px", lineHeight: 1.15 }}>Nova + X-Ray</h1>
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 6px", maxWidth: 780, lineHeight: 1.6 }}>Two applications, one shared data foundation</p>
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 48px", lineHeight: 1.6 }}>Nova and X-Ray are built on the same underlying data infrastructure. X-Ray delivers drug pricing transparency and net cost recovery visibility to customers. Nova powers internal pricing intelligence for analysts and field teams.</p>

      <SectionHeader label="The Platform" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 4 }}>
        {novaXrayProjects.map((p, i) => (
          <div key={p.id} onClick={() => setActiveProject(activeProject === i ? null : i)} style={{ background: activeProject === i ? `${p.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activeProject === i ? p.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "22px 20px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: p.color, opacity: activeProject === i ? 1 : 0.4 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: p.color }}>{p.name}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: p.statusColor, background: `${p.statusColor}15`, border: `1px solid ${p.statusColor}30`, borderRadius: 4, padding: "2px 7px", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{p.status}</span>
            </div>
            <div style={{ fontSize: 16, color: "#D0DAE6", lineHeight: 1.5 }}>{p.tagline}</div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div style={{ margin: "12px 0 0", background: `${selectedProject.color}08`, border: `1px solid ${selectedProject.color}20`, borderRadius: 12, padding: "28px 28px 24px", animation: "fadeIn 0.2s ease" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedProject.color, marginBottom: 6 }}>Project overview</div>
            <p style={{ fontSize: 17, color: "#E2EAF2", margin: 0, lineHeight: 1.65 }}>{selectedProject.description}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 14 }}>Capabilities</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {selectedProject.capabilities.map((c, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: selectedProject.color, marginTop: 7, flexShrink: 0, boxShadow: `0 0 6px ${selectedProject.color}40` }} /><span style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.5 }}>{c}</span></div>))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 12 }}>Data inputs</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{selectedProject.dataInputs.map((d, i) => (<span key={i} style={{ fontSize: 14, color: "#D0DAE6", background: "rgba(148,163,184,0.08)", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 6, padding: "4px 10px" }}>{d}</span>))}</div>
              </div>
              <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 12 }}>Intelligence used</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{selectedProject.intelligenceUsed.map((d, i) => (<span key={i} style={{ fontSize: 14, color: selectedProject.color, background: `${selectedProject.color}12`, border: `1px solid ${selectedProject.color}25`, borderRadius: 6, padding: "4px 10px" }}>{d}</span>))}</div>
              </div>
            </div>
          </div>
          <div style={{ padding: "14px 18px", background: `${selectedProject.color}0A`, border: `1px solid ${selectedProject.color}18`, borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 12 }}>
            <span style={{ color: selectedProject.color, fontSize: 16, marginTop: 1 }}>{"\u25C6"}</span>
            <div><div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: selectedProject.color, marginBottom: 4 }}>Business impact</div><span style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.6 }}>{selectedProject.impact}</span></div>
          </div>
        </div>
      )}

      {/* X-RAY DASHBOARD PREVIEW */}
      <div style={{ margin: "48px 0 0" }}>
        <SectionHeader label="X-Ray Dashboard &mdash; Drug Economics View" />
        <div style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: "12px 12px 0 0", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #10B981" }}>
          <div><div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", letterSpacing: 0.3 }}>KEYTRUDA 25MG/ML 4ML SDV 2/PAC</div><div style={{ fontSize: 14, color: "#B8C8DA", marginTop: 2 }}>Central Arkansas Radiation Therapy Institute</div></div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: "#10B981", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 6, padding: "4px 12px" }}>Onmark</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 1fr", gap: 0, background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.12)", borderTop: "none", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
          {/* Col 1: Drug Info */}
          <div style={{ padding: "24px", borderRight: "1px solid rgba(148,163,184,0.08)" }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}><div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#3B82F6" }}>&bull; Drug Information</div><div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#F59E0B" }}>&bull; Contract Details</div></div>
            {[{ label: "Drug Name", value: "KEYTRUDA 25MG/ML 4ML SDV 2/PAC" }, { label: "Generic Name", value: "PEMBROLIZUMAB" }, { label: "NDC", value: "00006-3026-04" }, { label: "Drug Type", value: "Brand" }, { label: "Manufacturer", value: "MERCK HUMAN HEALTH DIVISION" }, { label: "Inventory Type", value: "Injectables" }, { label: "CMS Units Per Package", value: "200" }].map((row, i) => (<div key={i} style={{ marginBottom: 12 }}><div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA" }}>{row.label}</div><div style={{ fontSize: 16, color: "#E2EAF2", fontWeight: 500, marginTop: 2 }}>{row.value}</div></div>))}
            <div style={{ borderTop: "1px solid rgba(148,163,184,0.1)", paddingTop: 12, marginTop: 4 }}>
              {[{ label: "Contract Effective Dates", value: "Jun 30, 2021 \u2013 Jun 29, 2026" }, { label: "GPO Affiliation", value: "Onmark" }, { label: "GPO Contract Type", value: "\u2014" }, { label: "GPO Rebate Basis", value: "Contract Price" }].map((row, i) => (<div key={i} style={{ marginBottom: 12 }}><div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA" }}>{row.label}</div><div style={{ fontSize: 16, color: "#E2EAF2", fontWeight: 500, marginTop: 2 }}>{row.value}</div></div>))}
            </div>
          </div>

          {/* Col 2: Donut */}
          <div style={{ padding: "24px", borderRight: "1px solid rgba(148,163,184,0.08)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA", alignSelf: "flex-start", marginBottom: 16 }}>&bull; Net Price Breakdown</div>
            <div style={{ position: "relative", width: 220, height: 220, margin: "8px 0 20px" }}>
              <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                {(() => { const cxD = 100, cyD = 100, r = 80, r2 = 55, total = 12272; const segments = [{ value: 11320.98, color: "#1E3A5F", label: "Net Price", pct: "92.25%" }, { value: 369.39, color: "#F59E0B", label: "Contract Discount", pct: "3.01%" }, { value: 59.51, color: "#3B82F6", label: "Distributor Discount", pct: "0.48%" }, { value: 522.12, color: "#10B981", label: "Rebates & Incentives", pct: "4.25%" }]; let angle = -90; return segments.map((seg, i) => { const sweep = (seg.value / total) * 360; const startRad = (angle * Math.PI) / 180; const endRad = ((angle + sweep) * Math.PI) / 180; const largeArc = sweep > 180 ? 1 : 0; const x1o = cxD + r * Math.cos(startRad), y1o = cyD + r * Math.sin(startRad); const x2o = cxD + r * Math.cos(endRad), y2o = cyD + r * Math.sin(endRad); const x1i = cxD + r2 * Math.cos(endRad), y1i = cyD + r2 * Math.sin(endRad); const x2i = cxD + r2 * Math.cos(startRad), y2i = cyD + r2 * Math.sin(startRad); const d = `M ${x1o} ${y1o} A ${r} ${r} 0 ${largeArc} 1 ${x2o} ${y2o} L ${x1i} ${y1i} A ${r2} ${r2} 0 ${largeArc} 0 ${x2i} ${y2i} Z`; const isHovered = hoveredSegment === i; angle += sweep; return <path key={i} d={d} fill={seg.color} opacity={hoveredSegment !== null && !isHovered ? 0.4 : 1} style={{ transition: "opacity 0.2s ease, transform 0.2s ease", cursor: "pointer", transformOrigin: "100px 100px", transform: isHovered ? "scale(1.04)" : "scale(1)" }} onMouseEnter={() => setHoveredSegment(i)} onMouseLeave={() => setHoveredSegment(null)} />; }); })()}
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none", transition: "all 0.2s ease" }}>
                {hoveredSegment !== null ? (<><div style={{ fontSize: 12, color: [{ c: "#1E3A5F" }, { c: "#F59E0B" }, { c: "#3B82F6" }, { c: "#10B981" }][hoveredSegment].c, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5, fontWeight: 600 }}>{["Net Price", "Contract Discount", "Distributor Discount", "Rebates & Incentives"][hoveredSegment]}</div><div style={{ fontSize: 20, fontWeight: 700, color: "#FFFFFF", marginTop: 2 }}>{["$11,320.98", "-$369.39", "-$59.51", "-$522.12"][hoveredSegment]}</div><div style={{ fontSize: 12, color: "#B8C8DA" }}>{["92.25%", "3.01%", "0.48%", "4.25%"][hoveredSegment]} of WAC</div></>) : (<><div style={{ fontSize: 12, color: "#B8C8DA", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5 }}>NET PRICE</div><div style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", marginTop: 2 }}>$11,320.98</div><div style={{ fontSize: 12, color: "#B8C8DA" }}>per unit</div></>)}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", padding: "0 8px" }}>
              {[{ color: "#1E3A5F", label: "WAC (Base)", value: "$12,272" }, { color: "#F59E0B", label: "Contract Discount", value: "-$369.39" }, { color: "#3B82F6", label: "Distributor Discount", value: "-$59.51" }, { color: "#10B981", label: "Rebates & Incentives", value: "-$522.12" }].map((item, i) => (
                <div key={i} onMouseEnter={() => setHoveredSegment(i)} onMouseLeave={() => setHoveredSegment(null)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "4px 6px", borderRadius: 6, background: hoveredSegment === i ? `${item.color}18` : "transparent", transition: "background 0.2s ease" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0 }} /><span style={{ fontSize: 15, color: hoveredSegment === i ? "#FFFFFF" : "#D0DAE6", transition: "color 0.2s ease" }}>{item.label}</span></div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#E2EAF2", fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Price Waterfall */}
          <div style={{ padding: "24px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA", marginBottom: 16 }}>&bull; Price Waterfall &mdash; Cost Walk to Net Price</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <div style={{ padding: "12px 16px", background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: "8px 8px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF" }}>WAC Price</div><div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 2 }}>Wholesale Acquisition Cost &mdash; starting point</div></div><span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", fontFamily: "'JetBrains Mono', monospace" }}>$12,272</span></div>
              <div style={{ padding: "12px 16px", background: "rgba(15,23,42,0.4)", border: "1px solid rgba(148,163,184,0.06)", borderTop: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF" }}>Contract Price</div><div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 2 }}>GPO / McKesson negotiated price</div></div><div style={{ textAlign: "right" }}><span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", fontFamily: "'JetBrains Mono', monospace" }}>$11,902.61</span><div style={{ fontSize: 13, color: "#F59E0B", fontFamily: "'JetBrains Mono', monospace" }}>3.01%</div></div></div>
              <div style={{ padding: "6px 16px", background: "rgba(236,72,153,0.06)", borderLeft: "2px solid #EC4899", marginTop: 8 }}><span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#EC4899" }}>Distributor Pricing</span></div>
              <div style={{ padding: "12px 16px", background: "rgba(15,23,42,0.4)", border: "1px solid rgba(148,163,184,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF" }}>Distributor Discount</div><div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 2 }}>Invoice markdown applied at distribution</div></div><div style={{ textAlign: "right" }}><span style={{ fontSize: 16, fontWeight: 700, color: "#EF4444", fontFamily: "'JetBrains Mono', monospace" }}>-$59.51</span><div style={{ fontSize: 13, color: "#B8C8DA", fontFamily: "'JetBrains Mono', monospace" }}>0.50%</div></div></div>
              <div style={{ padding: "12px 16px", background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF" }}>Invoice Price</div><div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 2 }}>As billed on invoice</div></div><span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", fontFamily: "'JetBrains Mono', monospace" }}>$11,843.1</span></div>
              <div style={{ padding: "6px 16px", background: "rgba(245,158,11,0.06)", borderLeft: "2px solid #F59E0B", marginTop: 8 }}><span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#F59E0B" }}>Rebates &amp; Incentives</span></div>
              <div style={{ padding: "12px 16px", background: "rgba(15,23,42,0.4)", border: "1px solid rgba(148,163,184,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF" }}>Distributor Rebate</div><div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 2 }}>Annual rebate value</div></div><div style={{ textAlign: "right" }}><span style={{ fontSize: 16, fontWeight: 700, color: "#EF4444", fontFamily: "'JetBrains Mono', monospace" }}>-$171.72</span><div style={{ fontSize: 13, color: "#B8C8DA", fontFamily: "'JetBrains Mono', monospace" }}>1.45%</div></div></div>
              <div style={{ padding: "12px 16px", background: "rgba(15,23,42,0.4)", border: "1px solid rgba(148,163,184,0.06)", borderTop: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF" }}>GPO Rebate / Value</div><div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 2 }}>Quarterly rebate distribution</div></div><div style={{ textAlign: "right" }}><span style={{ fontSize: 16, fontWeight: 700, color: "#EF4444", fontFamily: "'JetBrains Mono', monospace" }}>-$350.39</span><div style={{ fontSize: 13, color: "#B8C8DA", fontFamily: "'JetBrains Mono', monospace" }}>2.94%</div></div></div>
              <div style={{ padding: "14px 16px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "0 0 8px 8px", marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 16, fontWeight: 700, color: "#10B981", letterSpacing: 0.5 }}>NET PRICE / UNIT</span><span style={{ fontSize: 22, fontWeight: 700, color: "#10B981", fontFamily: "'JetBrains Mono', monospace" }}>$11,320.98</span></div>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 12 }}>
          {[{ label: "NET PRICE / UNIT", value: "$11,320.98", sub: "After all discounts & rebates", color: "#FFFFFF", bg: "rgba(15,23,42,0.6)" }, { label: "REIMBURSEMENT / UNIT", value: "$11,945.2", sub: "ASP benchmark", color: "#FFFFFF", bg: "rgba(15,23,42,0.6)" }, { label: "NET COST RECOVERY", value: "$624.22", sub: "Reimbursement minus net price", color: "#10B981", bg: "rgba(16,185,129,0.08)" }, { label: "EFFECTIVE DISCOUNT VS WAC", value: "7.75%", sub: "Combined discount rate", color: "#FFFFFF", bg: "rgba(15,23,42,0.6)" }].map((kpi, i) => (
            <div key={i} style={{ background: kpi.bg, border: `1px solid ${kpi.color === "#10B981" ? "rgba(16,185,129,0.2)" : "rgba(148,163,184,0.12)"}`, borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: kpi.color === "#10B981" ? "#10B981" : "#B8C8DA", marginBottom: 8 }}>{kpi.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: kpi.color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{kpi.value}</div>
              <div style={{ fontSize: 14, color: "#B8C8DA", marginTop: 6 }}>{kpi.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: "12px 16px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ color: "#3B82F6", fontSize: 16, marginTop: 1 }}>{"\u25C6"}</span>
          <span style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.6 }}>X-Ray POC &mdash; real Keytruda economics for a single account. Both X-Ray and Nova are built on the same shared data infrastructure. X-Ray surfaces this view for customers and field reps. Nova consumes the same foundation to generate internal pricing intelligence across the full book of business.</span>
        </div>
      </div>

      {/* PHASE ROADMAP */}
      <div style={{ margin: "48px 0 0" }}>
        <SectionHeader label="Platform Roadmap" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 4 }}>
          {phases.map((phase, i) => (
            <div key={phase.id} onClick={() => setActivePhase(activePhase === i ? null : i)} style={{ background: activePhase === i ? `${phase.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activePhase === i ? phase.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: phase.color, opacity: activePhase === i ? 1 : 0.4 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: phase.color, letterSpacing: 0.5 }}>{phase.label}</span><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: phase.statusColor, background: `${phase.statusColor}15`, border: `1px solid ${phase.statusColor}30`, borderRadius: 4, padding: "2px 7px", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{phase.status}</span></div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.35 }}>{phase.title}</div>
            </div>
          ))}
        </div>
        {selectedPhase && (
          <div style={{ margin: "12px 0 0", background: `${selectedPhase.color}08`, border: `1px solid ${selectedPhase.color}20`, borderRadius: 12, padding: "28px 28px 24px", animation: "fadeIn 0.2s ease" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedPhase.color, marginBottom: 6 }}>{selectedPhase.label} &middot; {selectedPhase.title}</div>
            <p style={{ fontSize: 17, color: "#E2EAF2", margin: "0 0 20px", lineHeight: 1.65, maxWidth: 800 }}>{selectedPhase.summary}</p>
            <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 14 }}>Key highlights</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>{selectedPhase.highlights.map((h, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: selectedPhase.color, marginTop: 7, flexShrink: 0, boxShadow: `0 0 6px ${selectedPhase.color}40` }} /><span style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.5 }}>{h}</span></div>))}</div>
            </div>
          </div>
        )}
      </div>

      {/* DIVIDERS + INTELLIGENCE + DATA */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "32px 40px 20px" }}><div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} /><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#D0DAE6", whiteSpace: "nowrap" }}>builds on</span><div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} /></div>

      <SectionHeader label="Intelligence layer" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 4 }}>
        {novaXrayIntelligence.map((layer) => (
          <div key={layer.id} style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 12, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: layer.color, opacity: 0.5 }} />
            <div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF", marginBottom: 3 }}>{layer.title}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#B8C8DA", marginBottom: 16 }}>{layer.subtitle}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>{layer.capabilities.map((c, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: layer.color, marginTop: 6, flexShrink: 0, opacity: 1 }} /><span style={{ fontSize: 15, color: "#E2EAF2", lineHeight: 1.5 }}>{c}</span></div>))}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{layer.usedBy.map((proj, i) => { const p = novaXrayProjects.find((x) => x.name === proj); return (<span key={i} style={{ fontSize: 13, color: p ? p.color : "#D0DAE6", background: p ? `${p.color}12` : "rgba(148,163,184,0.08)", border: `1px solid ${p ? p.color + "25" : "rgba(148,163,184,0.15)"}`, borderRadius: 5, padding: "2px 8px", fontFamily: "'JetBrains Mono', monospace" }}>{proj}</span>); })}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 40px" }}><div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} /><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#D0DAE6", whiteSpace: "nowrap" }}>powered by</span><div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} /></div>

      <SectionHeader label="Data layer" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {novaXrayData.map((bucket, i) => (
          <div key={bucket.id} onClick={() => setActiveDataBucket(activeDataBucket === i ? null : i)} style={{ background: activeDataBucket === i ? `${bucket.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activeDataBucket === i ? bucket.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "16px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: bucket.color, opacity: activeDataBucket === i ? 1 : 0.35 }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: bucket.color, marginBottom: 10, lineHeight: 1.3, minHeight: 34 }}>{bucket.title}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{bucket.items.slice(0, 3).map((item, j) => (<span key={j} style={{ fontSize: 13, color: "#E2EAF2", background: "rgba(148,163,184,0.10)", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 4, padding: "2px 7px" }}>{item}</span>))}{bucket.items.length > 3 && <span style={{ fontSize: 13, color: "#D0DAE6", padding: "2px 4px" }}>+{bucket.items.length - 3} more</span>}</div>
          </div>
        ))}
      </div>
      {selectedBucket && (
        <div style={{ margin: "12px 0 0", background: `${selectedBucket.color}08`, border: `1px solid ${selectedBucket.color}20`, borderRadius: 12, padding: "24px 28px", animation: "fadeIn 0.2s ease" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedBucket.color, marginBottom: 16 }}>{selectedBucket.title} &mdash; full data inventory</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>{selectedBucket.items.map((item, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 8 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: selectedBucket.color, flexShrink: 0, boxShadow: `0 0 6px ${selectedBucket.color}50` }} /><span style={{ fontSize: 16, color: "#E2EAF2" }}>{item}</span></div>))}</div>
        </div>
      )}
      <div style={{ height: 64 }} />
    </div>
  );
}

// ============================================================
// MERIDIAN DATA
// ============================================================

const meridianPages = [
  { id: "map", name: "Market Map", color: "#3B82F6", description: "Choropleth heatmap across ~2,500 scored ZIP codes. Drill down by ZIP or county, toggle provider overlays, drive-time isochrones, and patient origin heatmaps. The primary decision surface for expansion strategy.", highlights: ["4-domain composite score visualization", "ZIP and county drill-down", "Provider overlay with specialty filters", "Drive-time isochrone rings", "Patient origin heatmaps", "Development pipeline annotations"] },
  { id: "providers", name: "Providers", color: "#8B5CF6", description: "Provider analytics across ~4,500+ oncology physicians and NPs/PAs. Specialty distribution, workforce gap scatter plots, county-level breakdown, and full roster export.", highlights: ["~4,500+ providers across 8 taxonomy groups", "Specialty distribution analysis", "Workforce gap scatter plots", "County-level breakdown", "Roster export for BD teams"] },
  { id: "intelligence", name: "Intelligence", color: "#10B981", description: "Cancer mix analysis by tumor site, payer mix analytics, and 340B competitive exposure mapping. The analytical layer that informs where demand meets financial viability.", highlights: ["Cancer incidence by tumor type", "Payer mix quality scoring", "340B covered entity proximity", "Medicare Advantage penetration", "Revenue-per-unit estimation"] },
  { id: "acquisitions", name: "Acquisitions", color: "#F59E0B", description: "Practice acquisition assessment module. Enter target practice locations, auto-define catchment areas, get an aggregated score roll-up with an Acquire / Investigate / Pass recommendation. Replaces the pre-LOI diligence workflow.", highlights: ["Enter target locations \u2192 auto-catchment definition", "Aggregated strategic fit scoring", "Acquire / Investigate / Pass recommendation", "Provider profiling and competitive landscape", "Replaces weeks of BD legwork"] },
  { id: "consolidation", name: "Consolidation", color: "#EC4899", description: "Facility consolidation modeling. Define source sites and a proposed hub, model combined volume, run capacity planning, and generate breakeven analysis.", highlights: ["Source sites \u2192 proposed hub modeling", "Combined volume projection", "Capacity planning and chair utilization", "Breakeven analysis", "Net-new vs. redistributed volume"] },
  { id: "reports", name: "Reports", color: "#06B6D4", description: "AI-generated market reports with 14 conditional sections, produced in ~30 seconds. Natural language query bar \u2014 ask Meridian anything about a market and get a direct, sourced answer.", highlights: ["14-section AI market reports in ~30 seconds", "Natural language query (\u201CAsk Meridian\u201D)", "Acquisition opportunity reports", "Full methodology transparency", "Excel export for board presentations"] },
  { id: "settings", name: "Settings", color: "#B8C8DA", description: "Scoring weight configuration and scenario management. Adjust domain weights, save scenarios, and compare expansion strategies side-by-side.", highlights: ["Configurable domain weights", "Scenario save and compare", "Quarterly recalibration support", "5-year pro forma projections", "Service line toggle (Med Onc / Rad Onc)"] },
];

const meridianScoring = [
  { domain: "Demand Signal", weight: "35%", direction: "Higher = more demand", color: "#3B82F6", inputs: "Population 55+, cancer incidence by tumor type, 5-year growth" },
  { domain: "Access Gap", weight: "30%", direction: "Higher = worse access (opportunity)", color: "#F59E0B", inputs: "Drive-time to own-network + any-oncology, chair utilization" },
  { domain: "Competitive Density", weight: "20%", direction: "Lower = more opportunity (inverted)", color: "#EC4899", inputs: "Oncologist FTEs/100K, facility count, 340B proximity" },
  { domain: "Financial Viability", weight: "15%", direction: "Higher = better economics", color: "#10B981", inputs: "Payer mix quality, revenue per unit, real estate proxy" },
];

const meridianData = [
  { id: "census", title: "Census ACS (5-yr)", color: "#3B82F6", refresh: "Annual", items: ["Population pyramid", "Income distribution", "Insurance coverage", "Population growth projections"] },
  { id: "cancer", title: "NCI SEER / State Cancer Profiles", color: "#EF4444", refresh: "Annual", items: ["Cancer incidence by tumor site", "Age-adjusted rates", "FL-specific FCDS supplement", "Tumor type distribution"] },
  { id: "providers", title: "NPPES Provider Registry", color: "#8B5CF6", refresh: "Monthly", items: ["~4,500+ oncology providers", "8 taxonomy codes", "Practice locations", "Specialty classification"] },
  { id: "facilities", title: "CMS Provider of Services", color: "#F59E0B", refresh: "Quarterly", items: ["Facility registry", "Facility type and bed count", "Service capabilities", "Geographic distribution"] },
  { id: "340b", title: "340B OPAIS (HRSA)", color: "#EC4899", refresh: "Quarterly", items: ["Covered entity database", "Competitive proximity input", "Contract pharmacy locations", "Entity classification"] },
  { id: "medicare", title: "CMS Medicare / Claims", color: "#10B981", refresh: "Monthly / Quarterly", items: ["MA penetration by county/ZIP", "FFS procedure volumes", "J-code utilization", "Revenue benchmarks"] },
  { id: "geo", title: "Census TIGER + OSRM", color: "#06B6D4", refresh: "Monthly", items: ["ZIP/ZCTA boundary polygons", "County boundaries", "Drive-time matrix (2.16M+ rows)", "Road network routing"] },
];

const meridianIntelligence = [
  { id: "spatial", title: "PostGIS Spatial Analysis", subtitle: "Geographic computation", color: "#3B82F6", capabilities: ["ST_DWithin / ST_Intersects queries", "Centroid-based drive-time modeling", "Catchment area definition", "Provider density calculations", "Isochrone generation"] },
  { id: "claude", title: "Claude API (Sonnet)", subtitle: "AI generation & NL query", color: "#8B5CF6", capabilities: ["14-section market report generation", "Natural language query engine", "Acquisition opportunity reports", "Conditional section logic", "Sourced, explainable answers"] },
  { id: "osrm", title: "OSRM Routing Engine", subtitle: "Drive-time computation", color: "#10B981", capabilities: ["Self-hosted per-state OSM extracts", "Real road network routing", "2.16M+ drive-time matrix rows", "Multi-state coverage", "Not straight-line \u2014 actual roads"] },
  { id: "gravity", title: "Gravity & Scoring Models", subtitle: "Optimization logic", color: "#F59E0B", capabilities: ["Cannibalization estimation", "Net-new vs. redistributed volume", "JSONB config-driven scoring", "Dual service line profiles", "Configurable weight engine"] },
];

// ============================================================
// MERIDIAN PAGE
// ============================================================

function MeridianPage() {
  const [activePage, setActivePage] = useState<number | null>(null);
  const [activeDataSource, setActiveDataSource] = useState<number | null>(null);
  const selectedPage = activePage !== null ? meridianPages[activePage] : null;
  const selectedSource = activeDataSource !== null ? meridianData[activeDataSource] : null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <h1 style={{ fontSize: 42, fontWeight: 700, color: "#FFFFFF", margin: 0, lineHeight: 1.15 }}>Meridian</h1>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: "#10B981", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 4, padding: "3px 10px", letterSpacing: 0.5, marginTop: 12 }}>Live</span>
      </div>
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 6px", maxWidth: 780, lineHeight: 1.6 }}>Oncology Expansion Intelligence Platform</p>
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 12px", maxWidth: 820, lineHeight: 1.6 }}>Scores ~2,500 ZIP codes across 6 southeastern US states to identify optimal oncology clinic expansion opportunities. Turns months of manual market analysis into a 30-second AI-generated board report.</p>
      <div style={{ display: "flex", gap: 16, marginBottom: 48 }}>
        {[{ label: "ZIP codes scored", value: "~2,500" }, { label: "States", value: "6" }, { label: "Providers loaded", value: "4,500+" }, { label: "Build method", value: "Claude Code" }, { label: "E2E tests", value: "~60" }].map((stat, i) => (<div key={i} style={{ display: "flex", alignItems: "baseline", gap: 6 }}><span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</span><span style={{ fontSize: 13, color: "#B8C8DA" }}>{stat.label}</span></div>))}
      </div>

      <SectionHeader label="Application" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 4 }}>
        {meridianPages.slice(0, 4).map((page, i) => (<div key={page.id} onClick={() => setActivePage(activePage === i ? null : i)} style={{ background: activePage === i ? `${page.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activePage === i ? page.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: page.color, opacity: activePage === i ? 1 : 0.4 }} /><div style={{ fontSize: 16, fontWeight: 600, color: page.color, marginBottom: 4 }}>{page.name}</div><div style={{ fontSize: 14, color: "#D0DAE6", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{page.description.split(".")[0]}.</div></div>))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 12, marginBottom: 4 }}>
        {meridianPages.slice(4).map((page, i) => { const idx = i + 4; return (<div key={page.id} onClick={() => setActivePage(activePage === idx ? null : idx)} style={{ background: activePage === idx ? `${page.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activePage === idx ? page.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: page.color, opacity: activePage === idx ? 1 : 0.4 }} /><div style={{ fontSize: 16, fontWeight: 600, color: page.color, marginBottom: 4 }}>{page.name}</div><div style={{ fontSize: 14, color: "#D0DAE6", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{page.description.split(".")[0]}.</div></div>); })}
      </div>

      {selectedPage && (
        <div style={{ margin: "12px 0 0", background: `${selectedPage.color}08`, border: `1px solid ${selectedPage.color}20`, borderRadius: 12, padding: "28px 28px 24px", animation: "fadeIn 0.2s ease" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedPage.color, marginBottom: 6 }}>{selectedPage.name}</div>
          <p style={{ fontSize: 17, color: "#E2EAF2", margin: "0 0 20px", lineHeight: 1.65, maxWidth: 800 }}>{selectedPage.description}</p>
          <div style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 14 }}>Key capabilities</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>{selectedPage.highlights.map((h, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: selectedPage.color, marginTop: 7, flexShrink: 0, boxShadow: `0 0 6px ${selectedPage.color}40` }} /><span style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.5 }}>{h}</span></div>))}</div>
          </div>
        </div>
      )}

      <div style={{ margin: "48px 0 0" }}>
        <SectionHeader label="Scoring Model" />
        <Card style={{ padding: "24px" }}>
          <div style={{ fontSize: 15, color: "#B8C8DA", marginBottom: 20, lineHeight: 1.6 }}>Every ZIP code is scored across 4 domains. Weights are user-configurable. Tier 1 = P90, Tier 2 = P70, remainder = Tier 3. Quarterly recalibration.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {meridianScoring.map((s, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 0, background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 8, overflow: "hidden" }}><div style={{ width: 4, background: s.color, alignSelf: "stretch", flexShrink: 0 }} /><div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 16, flex: 1 }}><div style={{ minWidth: 52, textAlign: "center" }}><span style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.weight}</span></div><div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF", marginBottom: 2 }}>{s.domain}</div><div style={{ fontSize: 14, color: "#B8C8DA" }}>{s.direction}</div></div><div style={{ fontSize: 14, color: "#D0DAE6", maxWidth: 320, lineHeight: 1.4 }}>{s.inputs}</div></div></div>))}
          </div>
        </Card>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "32px 40px 20px" }}><div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} /><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#D0DAE6", whiteSpace: "nowrap" }}>builds on</span><div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} /></div>

      <SectionHeader label="Intelligence layer" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 4 }}>
        {meridianIntelligence.map((layer) => (<div key={layer.id} style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 12, padding: "20px 18px", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: layer.color, opacity: 0.5 }} /><div style={{ fontSize: 17, fontWeight: 600, color: "#FFFFFF", marginBottom: 3 }}>{layer.title}</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#B8C8DA", marginBottom: 14 }}>{layer.subtitle}</div><div style={{ display: "flex", flexDirection: "column", gap: 7 }}>{layer.capabilities.map((c, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: layer.color, marginTop: 6, flexShrink: 0 }} /><span style={{ fontSize: 15, color: "#E2EAF2", lineHeight: 1.5 }}>{c}</span></div>))}</div></div>))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 40px" }}><div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} /><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#D0DAE6", whiteSpace: "nowrap" }}>powered by</span><div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} /></div>

      <SectionHeader label="Data sources" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {meridianData.slice(0, 4).map((source, i) => (<div key={source.id} onClick={() => setActiveDataSource(activeDataSource === i ? null : i)} style={{ background: activeDataSource === i ? `${source.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activeDataSource === i ? source.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "16px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: source.color, opacity: activeDataSource === i ? 1 : 0.35 }} /><div style={{ fontSize: 15, fontWeight: 600, color: source.color, marginBottom: 6, lineHeight: 1.3 }}>{source.title}</div><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#B8C8DA", background: "rgba(148,163,184,0.08)", borderRadius: 4, padding: "2px 6px" }}>{source.refresh}</span></div>))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 12 }}>
        {meridianData.slice(4).map((source, i) => { const idx = i + 4; return (<div key={source.id} onClick={() => setActiveDataSource(activeDataSource === idx ? null : idx)} style={{ background: activeDataSource === idx ? `${source.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activeDataSource === idx ? source.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "16px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: source.color, opacity: activeDataSource === idx ? 1 : 0.35 }} /><div style={{ fontSize: 15, fontWeight: 600, color: source.color, marginBottom: 6, lineHeight: 1.3 }}>{source.title}</div><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#B8C8DA", background: "rgba(148,163,184,0.08)", borderRadius: 4, padding: "2px 6px" }}>{source.refresh}</span></div>); })}
      </div>

      {selectedSource && (
        <div style={{ margin: "12px 0 0", background: `${selectedSource.color}08`, border: `1px solid ${selectedSource.color}20`, borderRadius: 12, padding: "24px 28px", animation: "fadeIn 0.2s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedSource.color }}>{selectedSource.title}</div><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#B8C8DA", background: "rgba(148,163,184,0.1)", borderRadius: 4, padding: "2px 8px" }}>Refresh: {selectedSource.refresh}</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>{selectedSource.items.map((item, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 8 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: selectedSource.color, flexShrink: 0, boxShadow: `0 0 6px ${selectedSource.color}50` }} /><span style={{ fontSize: 16, color: "#E2EAF2" }}>{item}</span></div>))}</div>
        </div>
      )}

      <div style={{ margin: "48px 0 0" }}>
        <SectionHeader label="Technology &amp; Security" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Card style={{ padding: "20px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 14 }}>Stack</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[{ layer: "Frontend", tech: "Next.js 16.2.2 (React 19, Tailwind 4)" }, { layer: "Map", tech: "Mapbox GL JS" }, { layer: "Database", tech: "Supabase PostgreSQL + PostGIS" }, { layer: "AI", tech: "Claude API (Sonnet)" }, { layer: "ETL", tech: "Python pipelines (--state parameterized)" }, { layer: "Drive-Time", tech: "OSRM Docker (per-state OSM extracts)" }, { layer: "Auth", tech: "Supabase Auth \u2014 invite-only, 3 roles" }, { layer: "Deploy", tech: "Vercel (meridianiq.tech)" }].map((row, i) => (<div key={i} style={{ display: "flex", gap: 12 }}><span style={{ fontSize: 14, fontWeight: 600, color: "#B8C8DA", minWidth: 80, fontFamily: "'JetBrains Mono', monospace" }}>{row.layer}</span><span style={{ fontSize: 15, color: "#E2EAF2" }}>{row.tech}</span></div>))}
            </div>
          </Card>
          <Card style={{ padding: "20px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 14 }}>Security &amp; Compliance</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {["Row-level security on all 23 tables with org-scoped isolation", "HIPAA Safe Harbor enforcement (k \u2265 5 anonymity threshold)", "4-tier data classification (Restricted / Confidential / Internal / Public)", "CMS Data Use Agreement compliance for claims data", "Invite-only auth with signups disabled", "Audit logging on claims access, exports, and scenario changes"].map((item, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10B981", marginTop: 7, flexShrink: 0, boxShadow: "0 0 6px rgba(16,185,129,0.4)" }} /><span style={{ fontSize: 15, color: "#E2EAF2", lineHeight: 1.5 }}>{item}</span></div>))}
            </div>
          </Card>
        </div>
      </div>
      <div style={{ height: 64 }} />
    </div>
  );
}

// ============================================================
// SKYNET DATA
// ============================================================

const skynetSections = [
  { id: "overview", label: "Distribution Overview", color: "#3B82F6", description: "Quarterly performance KPIs, purchase volume trajectory, portfolio distribution by therapeutic area, service excellence metrics, and policy & market intelligence from Titan." },
  { id: "clinic", label: "Clinic", color: "#8B5CF6", description: "Total IV drug spend and NCR trends by quarter, top 10 infusion drugs by spend with QoQ change, and CMS ASP pricing file references for reimbursement benchmarking." },
  { id: "mid", label: "MID", color: "#10B981", description: "Medically Integrated Dispensing analytics \u2014 month-over-month and YoY Rx dispenses, gross revenue, gross margin, top 15 drug profitability (revenue vs. NCR), and provider-level performance breakdowns." },
  { id: "biosimilars", label: "Biosimilars", color: "#06B6D4", description: "12-month biosimilar adoption trend against 95% target, drug mix by therapeutic category with rebate tracking, and savings opportunities across 7 drug classes with adoption trajectory." },
  { id: "inventory", label: "Inventory", color: "#EC4899", description: "Days inventory on hand vs. Lynx practice averages and aspirational benchmarks, non-billable waste tracking per provider with recommended levels, and recoverable billing error identification." },
  { id: "gpo", label: "GPO", color: "#F59E0B", description: "Active GPO memberships (Onmark Oncology, Onmark United, State Societies, CHOC, Health System GPO, PACT Monarch), $5.8M+ savings overview, key rebate drivers and detractors, and GPO benefits summary." },
  { id: "insights", label: "Practice Insights", color: "#A78BFA", description: "AI-generated practice-level insights surfaced from cross-section analysis, recommended actions with opportunity sizing, and collaborative site visit tracking and summaries." },
  { id: "value", label: "Value Delivered", color: "#EF4444", description: "Aggregated McKesson partnership value \u2014 total savings across rebates and discounts, service delivery metrics, technology adoption tracking, and quarterly ROI summary across all QBR dimensions." },
];

const skynetKPIs = [
  { label: "Revenue Growth", value: "+12.8%", sub: "vs. last quarter", color: "#10B981" },
  { label: "GPO Benefits", value: "$58.2K", sub: "this quarter", color: "#F59E0B" },
  { label: "On-Time Deliveries", value: "97.2%", sub: "2,847 total deliveries", color: "#3B82F6" },
  { label: "Site Visits", value: "12", sub: "this quarter", color: "#8B5CF6" },
];

const skynetTopDrugs = [
  { rank: 1, name: "Keytruda", type: "IV", category: "Immunotherapy", spend: "$542,800", units: 218, change: "+15%" },
  { rank: 2, name: "Darzalex IV", type: "IV", category: "Immunotherapy", spend: "$428,500", units: 187, change: "+8%" },
  { rank: 3, name: "Revlimid", type: "MID", category: "Immunomodulator", spend: "$386,400", units: 142, change: "+5%" },
  { rank: 4, name: "Opdivo", type: "IV", category: "Immunotherapy", spend: "$295,800", units: 124, change: "+6%" },
  { rank: 5, name: "Neulasta", type: "MID", category: "Supportive Care", spend: "$268,900", units: 432, change: "+12%" },
  { rank: 6, name: "Ibrance", type: "MID", category: "CDK4/6 Inhibitor", spend: "$234,600", units: 98, change: "+9%" },
  { rank: 7, name: "Zarxio", type: "MID", category: "Biosimilar GCSF", spend: "$198,200", units: 624, change: "+18%" },
  { rank: 8, name: "Injectafer", type: "IV", category: "Iron Therapy", spend: "$186,400", units: 312, change: "+22%" },
  { rank: 9, name: "Imfinzi", type: "IV", category: "Immunotherapy", spend: "$164,500", units: 89, change: "+18%" },
  { rank: 10, name: "Zytiga", type: "MID", category: "Hormone Therapy", spend: "$152,300", units: 164, change: "-2%" },
];

const skynetPortfolio = [
  { area: "Oncology \u2014 Infusion", pct: 45, value: "$381.1K", color: "#3B82F6" },
  { area: "Oncology \u2014 Oral", pct: 30, value: "$254.1K", color: "#8B5CF6" },
  { area: "Rheumatology", pct: 25, value: "$211.8K", color: "#A8B8CC" },
];

const skynetGPO = [
  { category: "All Purchase Discounts", value: "$4.73M+", prior: "$4.71M+" },
  { category: "Performance Rebates", value: "$858K+", prior: "$912K" },
  { category: "All Purchase Rebates", value: "$209K+", prior: "$180K+" },
  { category: "Performance Discounts", value: "$59K+", prior: "$105K+" },
];

const skynetDataSources = [
  { name: "Distribution Purchases", color: "#3B82F6", desc: "McKesson invoice and shipment data \u2014 drug-level purchase history, order patterns, delivery performance", refresh: "Daily" },
  { name: "GPO Rebate Feeds", color: "#F59E0B", desc: "Onmark, GVI, and manufacturer rebate files \u2014 performance rebates, purchase rebates, tier qualification", refresh: "Monthly" },
  { name: "MID Claims Data", color: "#10B981", desc: "Practice-level dispensing economics \u2014 Rx volume, gross revenue, gross margin, per-provider performance", refresh: "Monthly" },
  { name: "Biosimilar Programs", color: "#06B6D4", desc: "Adoption rates by drug class, payer preference signals, compliance tracking against contractual targets", refresh: "Weekly" },
  { name: "Lynx Inventory", color: "#EC4899", desc: "On-hand levels, lot tracking, days inventory on hand, non-billable waste, expiry management", refresh: "Daily" },
  { name: "Payer Policies (Titan)", color: "#A78BFA", desc: "Titan-powered coverage intelligence \u2014 formulary changes, step therapy updates, prior auth requirements", refresh: "Real-time" },
];

const skynetBeforeAfter = [
  { dimension: "Data collection", before: "Manual pull from 5+ dashboards", after: "Automated aggregation into unified schema" },
  { dimension: "Update frequency", before: "Quarterly snapshot", after: "Real-time, always current" },
  { dimension: "Delivery format", before: "Static PowerPoint deck", after: "Interactive customer portal" },
  { dimension: "Prep time per QBR", before: "4\u20138 hours per account", after: "< 15 minutes (review only)" },
  { dimension: "Customer interaction", before: "One-way slide presentation", after: "Two-way \u2014 ask any question via natural language" },
  { dimension: "Drill-down capability", before: "Fixed slides, no drill-down", after: "Click any metric to explore underlying data" },
];

// ============================================================
// SKYNET PAGE
// ============================================================

function SkynetPage() {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [activeSource, setActiveSource] = useState<number | null>(null);
  const selectedSection = activeSection !== null ? skynetSections[activeSection] : null;
  const selectedSource = activeSource !== null ? skynetDataSources[activeSource] : null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <h1 style={{ fontSize: 42, fontWeight: 700, color: "#FFFFFF", margin: 0, lineHeight: 1.15 }}>Skynet</h1>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: "#A8B8CC", background: "rgba(168,184,204,0.12)", border: "1px solid rgba(168,184,204,0.25)", borderRadius: 4, padding: "3px 10px", letterSpacing: 0.5, marginTop: 12 }}>Planning</span>
      </div>
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 6px", maxWidth: 780, lineHeight: 1.6 }}>Dynamic QBR Portal</p>
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 12px", maxWidth: 820, lineHeight: 1.6 }}>Replaces the static PowerPoint QBR with a live, interactive customer portal. Pulls data from 6+ disparate sources into a unified schema. Sales reps and customers ask any question in natural language &mdash; converted to SQL on the fly against a live database.</p>
      <div style={{ display: "flex", gap: 16, marginBottom: 48 }}>
        {[{ label: "QBR sections", value: "8" }, { label: "Data sources", value: "6+" }, { label: "Query engine", value: "NL \u2192 SQL" }, { label: "Accounts", value: "200+" }].map((stat, i) => (<div key={i} style={{ display: "flex", alignItems: "baseline", gap: 6 }}><span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</span><span style={{ fontSize: 13, color: "#B8C8DA" }}>{stat.label}</span></div>))}
      </div>

      <SectionHeader label="Dashboard Preview" />
      <div style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: "12px 12px 0 0", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><div style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>Springfield Medical Center</div><div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 2 }}>Q1 2026 &middot; Powered by your McKesson partnership</div></div>
        <span style={{ fontSize: 12, color: "#B8C8DA", fontFamily: "'JetBrains Mono', monospace" }}>Data Last Refreshed: Feb 28, 2026</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
        {skynetKPIs.map((kpi, i) => (<div key={i} style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(148,163,184,0.08)", padding: "20px", borderLeft: i === 0 ? "1px solid rgba(148,163,184,0.12)" : "none", borderRight: "1px solid rgba(148,163,184,0.12)" }}><div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA", marginBottom: 8 }}>{kpi.label}</div><div style={{ fontSize: 28, fontWeight: 700, color: kpi.color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{kpi.value}</div><div style={{ fontSize: 14, color: "#B8C8DA", marginTop: 6 }}>{kpi.sub}</div></div>))}
      </div>
      <div style={{ display: "flex", gap: 0, background: "rgba(15,23,42,0.4)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: "0 0 12px 12px", overflow: "hidden", marginBottom: 4 }}>
        {skynetSections.map((sec, i) => (<button key={sec.id} onClick={() => setActiveSection(activeSection === i ? null : i)} style={{ flex: 1, padding: "12px 4px", background: activeSection === i ? `${sec.color}12` : "transparent", border: "none", borderBottom: activeSection === i ? `2px solid ${sec.color}` : "2px solid transparent", cursor: "pointer", outline: "none", transition: "all 0.2s ease" }}><span style={{ fontSize: 12, fontWeight: activeSection === i ? 600 : 500, color: activeSection === i ? sec.color : "#B8C8DA", letterSpacing: 0.3 }}>{sec.label}</span></button>))}
      </div>
      {selectedSection && (<div style={{ margin: "12px 0 0", background: `${selectedSection.color}08`, border: `1px solid ${selectedSection.color}20`, borderRadius: 12, padding: "24px 28px", animation: "fadeIn 0.2s ease" }}><div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: `${selectedSection.color}15`, border: `1px solid ${selectedSection.color}30`, marginBottom: 16 }}><span style={{ fontSize: 13, color: selectedSection.color }}>{"\u25C8"}</span><span style={{ fontSize: 13, color: selectedSection.color, fontWeight: 500 }}>{selectedSection.label}</span></div><p style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.65, margin: 0 }}>{selectedSection.description}</p></div>)}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 28 }}>
        <Card>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", marginBottom: 4 }}>Purchase Volume Trajectory</div>
          <div style={{ fontSize: 14, color: "#B8C8DA", marginBottom: 20 }}>6-month trend with McKesson partnership</div>
          <svg viewBox="0 0 420 140" style={{ width: "100%", height: 140 }}>
            {[0, 1, 2, 3].map(i => (<line key={i} x1={40} y1={10 + i * 40} x2={400} y2={10 + i * 40} stroke="rgba(148,163,184,0.08)" strokeWidth={1} />))}
            <text x={35} y={15} fill="#B8C8DA" fontSize={10} textAnchor="end" fontFamily="JetBrains Mono">$1M</text>
            <text x={35} y={55} fill="#B8C8DA" fontSize={10} textAnchor="end" fontFamily="JetBrains Mono">$750K</text>
            <text x={35} y={95} fill="#B8C8DA" fontSize={10} textAnchor="end" fontFamily="JetBrains Mono">$500K</text>
            <text x={35} y={135} fill="#B8C8DA" fontSize={10} textAnchor="end" fontFamily="JetBrains Mono">$250K</text>
            {["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].map((m, i) => (<text key={m} x={70 + i * 62} y={135} fill="#B8C8DA" fontSize={10} textAnchor="middle" fontFamily="JetBrains Mono">{m}</text>))}
            <polyline points="70,42 132,40 194,37 256,34 318,32 380,30" fill="none" stroke="#B8C8DA" strokeWidth={1.5} strokeDasharray="4,4" opacity={0.5} />
            <polyline points="70,44 132,40 194,42 256,34 318,30 380,26" fill="none" stroke="#3B82F6" strokeWidth={2} />
            {[[70, 44], [132, 40], [194, 42], [256, 34], [318, 30], [380, 26]].map(([cx, cy], i) => (<circle key={i} cx={cx} cy={cy} r={4} fill="#3B82F6" stroke="#141B2D" strokeWidth={2} />))}
          </svg>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 16, height: 2, background: "#3B82F6", borderRadius: 1 }} /><span style={{ fontSize: 12, color: "#B8C8DA" }}>Actual</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 16, height: 2, background: "#B8C8DA", borderRadius: 1, opacity: 0.5 }} /><span style={{ fontSize: 12, color: "#B8C8DA" }}>Expected</span></div>
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", marginBottom: 4 }}>Portfolio Distribution</div>
          <div style={{ fontSize: 14, color: "#B8C8DA", marginBottom: 20 }}>Product mix by therapeutic area</div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <svg viewBox="0 0 120 120" style={{ width: 120, height: 120, flexShrink: 0, transform: "rotate(-90deg)" }}>
              <circle cx={60} cy={60} r={48} fill="none" stroke="#3B82F6" strokeWidth={18} strokeDasharray={`${0.45 * 301.59} ${0.55 * 301.59}`} strokeDashoffset={0} />
              <circle cx={60} cy={60} r={48} fill="none" stroke="#8B5CF6" strokeWidth={18} strokeDasharray={`${0.30 * 301.59} ${0.70 * 301.59}`} strokeDashoffset={`${-0.45 * 301.59}`} />
              <circle cx={60} cy={60} r={48} fill="none" stroke="#A8B8CC" strokeWidth={18} strokeDasharray={`${0.25 * 301.59} ${0.75 * 301.59}`} strokeDashoffset={`${-0.75 * 301.59}`} />
            </svg>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
              {skynetPortfolio.map((p, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color }} /><span style={{ fontSize: 14, color: "#E2EAF2" }}>{p.area}</span></div><div style={{ textAlign: "right" }}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>{p.value}</span><span style={{ fontSize: 12, color: "#B8C8DA", marginLeft: 8 }}>{p.pct}%</span></div></div>))}
            </div>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 28 }}>
        <SectionHeader label="Top 10 Drugs by Spend" />
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 60px 20px 1fr 100px 70px 80px", padding: "14px 20px", borderBottom: "1px solid rgba(148,163,184,0.1)", background: "rgba(15,23,42,0.3)" }}>
            {["#", "Drug Name", "Type", "", "Category", "Q3 Spend", "Units", "vs Prior"].map((h, i) => (<span key={i} style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#B8C8DA" }}>{h}</span>))}
          </div>
          {skynetTopDrugs.map((drug, i) => (<div key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr 60px 20px 1fr 100px 70px 80px", padding: "12px 20px", borderBottom: i < 9 ? "1px solid rgba(148,163,184,0.06)" : "none", alignItems: "center" }}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#B8C8DA" }}>{drug.rank}</span><span style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>{drug.name}</span><span style={{ fontSize: 12, color: drug.type === "IV" ? "#3B82F6" : "#10B981", background: drug.type === "IV" ? "rgba(59,130,246,0.12)" : "rgba(16,185,129,0.12)", border: `1px solid ${drug.type === "IV" ? "rgba(59,130,246,0.25)" : "rgba(16,185,129,0.25)"}`, borderRadius: 4, padding: "2px 8px", textAlign: "center", fontWeight: 600 }}>{drug.type}</span><span /><span style={{ fontSize: 13, color: "#D0DAE6" }}>{drug.category}</span><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: "#FFFFFF" }}>{drug.spend}</span><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#B8C8DA" }}>{drug.units}</span><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: drug.change.startsWith("+") ? "#10B981" : "#EF4444" }}>{drug.change}</span></div>))}
          <div style={{ padding: "14px 20px", background: "rgba(59,130,246,0.06)", borderTop: "1px solid rgba(59,130,246,0.12)", display: "flex", alignItems: "flex-start", gap: 10 }}><span style={{ color: "#3B82F6", fontSize: 14, marginTop: 1 }}>{"\u25C6"}</span><span style={{ fontSize: 14, color: "#E2EAF2", lineHeight: 1.6 }}><strong style={{ color: "#FFFFFF" }}>Portfolio Insight:</strong> Top 10 drugs account for $2.86M in quarterly spend. Immunotherapy drugs (Keytruda, Opdivo) represent 36% of top 10 spend, reflecting this practice&apos;s specialty focus.</span></div>
        </Card>
      </div>

      <div style={{ marginTop: 28 }}>
        <SectionHeader label="GPO Savings Overview" />
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 700, color: "#F59E0B" }}>$5.8M+</span><span style={{ fontSize: 15, color: "#D0DAE6" }}>Performance rebates, purchase rebates, and discounts</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {skynetGPO.map((g, i) => (<div key={i} style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 10, padding: "16px" }}><div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "#B8C8DA", marginBottom: 8, lineHeight: 1.3 }}>{g.category}</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: "#F59E0B", lineHeight: 1 }}>{g.value}</div><div style={{ fontSize: 12, color: "#B8C8DA", marginTop: 6 }}>vs Q2 &apos;25: {g.prior}</div></div>))}
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 28 }}>
        <SectionHeader label="Natural Language Query Engine" />
        <div style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "28px 28px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 10, marginBottom: 20 }}><span style={{ fontSize: 16, color: "#EF4444" }}>{"\u2756"}</span><span style={{ fontSize: 15, color: "#B8C8DA", fontStyle: "italic" }}>Ask anything &mdash; &quot;Show me Keytruda spend trend over the last 4 quarters&quot;</span></div>
          <div style={{ fontSize: 15, color: "#D0DAE6", lineHeight: 1.65, marginBottom: 16 }}>The customer or sales rep types a plain-English question. An LLM trained on the database schema converts it to SQL, executes against live data, and returns a formatted answer with optional visualizations.</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["What are my top 5 drugs by NCR?", "Compare Q3 vs Q4 biosimilar adoption", "Which providers have the highest waste?", "Show GPO rebate trend by quarter"].map((q, i) => (<span key={i} style={{ fontSize: 13, color: "#EF4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 20, padding: "6px 14px", cursor: "pointer" }}>{q}</span>))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <SectionHeader label="Before &amp; After" />
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 20px", borderBottom: "1px solid rgba(148,163,184,0.1)", background: "rgba(15,23,42,0.3)" }}><span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#B8C8DA" }}>Dimension</span><span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#EF4444" }}>Static PowerPoint QBR</span><span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#10B981" }}>Skynet Dynamic Portal</span></div>
          {skynetBeforeAfter.map((row, i) => (<div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 20px", borderBottom: i < skynetBeforeAfter.length - 1 ? "1px solid rgba(148,163,184,0.06)" : "none", alignItems: "center" }}><span style={{ fontSize: 14, fontWeight: 600, color: "#E2EAF2" }}>{row.dimension}</span><span style={{ fontSize: 14, color: "#B8C8DA" }}>{row.before}</span><span style={{ fontSize: 14, color: "#10B981" }}>{row.after}</span></div>))}
        </Card>
      </div>

      <div style={{ marginTop: 28 }}>
        <SectionHeader label="Intelligence Layer" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[{ title: "AI Prompting Tools", subtitle: "LLM interfaces", color: "#3B82F6", capabilities: ["Natural language to SQL", "Conversational Q&A on live data", "Portfolio insight generation", "Cross-section trend detection", "Payer policy summaries (via Titan)"] }, { title: "Machine Learning", subtitle: "Pattern recognition", color: "#8B5CF6", capabilities: ["Recommended actions scoring", "Biosimilar adoption forecasting", "Anomaly detection on spend shifts", "Provider performance clustering", "GPO tier optimization signals"] }, { title: "Agents", subtitle: "Automated workflows", color: "#F59E0B", capabilities: ["Scheduled data aggregation", "Multi-source pipeline orchestration", "QBR auto-assembly", "Payer surveillance feed (Titan)", "Alert generation on threshold breaches"] }].map((layer) => (<div key={layer.title} style={{ background: "rgba(15,23,42,0.6)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 12, padding: "20px 18px", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: layer.color, opacity: 0.5 }} /><div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF", marginBottom: 3 }}>{layer.title}</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#B8C8DA", marginBottom: 16 }}>{layer.subtitle}</div><div style={{ display: "flex", flexDirection: "column", gap: 7 }}>{layer.capabilities.map((c, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: layer.color, marginTop: 7, flexShrink: 0, opacity: 1 }} /><span style={{ fontSize: 14, color: "#E2EAF2", lineHeight: 1.5 }}>{c}</span></div>))}</div></div>))}
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <SectionHeader label="Data Sources" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 4 }}>
          {skynetDataSources.map((src, i) => (<div key={i} onClick={() => setActiveSource(activeSource === i ? null : i)} style={{ background: activeSource === i ? `${src.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activeSource === i ? src.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: src.color, opacity: activeSource === i ? 1 : 0.35 }} /><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}><div style={{ fontSize: 14, fontWeight: 600, color: src.color }}>{src.name}</div><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: "#10B981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 4, padding: "2px 7px" }}>{src.refresh}</span></div><div style={{ fontSize: 13, color: "#D0DAE6", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{src.desc.split("\u2014")[0]}.</div></div>))}
        </div>
        {selectedSource && (<div style={{ margin: "12px 0 0", background: `${selectedSource.color}08`, border: `1px solid ${selectedSource.color}20`, borderRadius: 12, padding: "24px 28px", animation: "fadeIn 0.2s ease" }}><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedSource.color, marginBottom: 8 }}>{selectedSource.name}</div><p style={{ fontSize: 15, color: "#E2EAF2", margin: 0, lineHeight: 1.65 }}>{selectedSource.desc}</p></div>)}
      </div>

      <div style={{ marginTop: 28, padding: "16px 20px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 12 }}><span style={{ color: "#EF4444", fontSize: 16, marginTop: 1 }}>{"\u25C6"}</span><span style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.6 }}>Skynet replaces the single most time-consuming sales deliverable at McKesson Specialty Health. Every QBR today requires 4&ndash;8 hours of manual data gathering and PowerPoint assembly per account. With 200+ accounts on quarterly cycles, that&apos;s 800&ndash;1,600 hours per quarter of rep time redirected from selling to slide-building.</span></div>
      <div style={{ height: 64 }} />
    </div>
  );
}

// ============================================================
// BOLT PAAS DATA
// ============================================================

const BOLT_COLOR = "#8B5CF6";

const boltBeforeAfter = [
  { dimension: "Who builds", before: "Engineering team", after: "Certified business owners & product people" },
  { dimension: "Idea \u2192 Prototype", before: "8\u201312 weeks", after: "1\u20132 weeks" },
  { dimension: "Idea \u2192 Production", before: "~6 months", after: "2\u20134 weeks" },
  { dimension: "Handoffs", before: "4+ (business \u2192 product \u2192 eng \u2192 QA)", after: "1 (builder \u2192 code review)" },
  { dimension: "Investment approval", before: "Business case required", after: "Not required for prototypes" },
  { dimension: "Domain context", before: "Lost in translation across handoffs", after: "Builder IS the domain expert" },
  { dimension: "Backlog dependency", before: "Competes for engineering capacity", after: "Independent \u2014 no queue" },
  { dimension: "Production platform", before: "Varies by team and project", after: "Standardized on Bolt (AWS)" },
];

const boltCertModules = [
  { id: "env", title: "Environment Setup", color: "#3B82F6", icon: "\uD83D\uDD27", skills: ["GitHub repo creation & branch strategy", "Supabase project provisioning & RLS setup", "Vercel project creation & deployment", "Claude Code installation & CLAUDE.md configuration", "Connecting GitHub \u2192 Vercel auto-deploy pipeline"] },
  { id: "build", title: "Core Build Skills", color: "#8B5CF6", icon: "\u26A1", skills: ["Prompt engineering for code generation", "PR best practices \u2014 small, atomic, descriptive", "Database schema design & migrations", "Testing fundamentals \u2014 build verification, basic E2E", "Reading and evaluating AI-generated code"] },
  { id: "compliance", title: "Bolt Compliance", color: "#10B981", icon: "\uD83D\uDEE1", skills: ["App structure requirements for Bolt migration", "Shared auth integration patterns", "Data layer conventions & naming standards", "Security baseline \u2014 RLS policies, no secrets in code", "Code review readiness checklist"] },
  { id: "ops", title: "Operational Readiness", color: "#F59E0B", icon: "\uD83D\uDE80", skills: ["Environment variables & secrets management", "Error handling & logging patterns", "Performance basics \u2014 query optimization, caching", "Documentation standards for handoff", "Monitoring & alerting fundamentals"] },
];

const boltArchLayers = [
  { id: "builder", title: "Builder Environment", color: "#8B5CF6", items: ["Claude AI", "Claude Code", "GitHub", "Vercel (prototype)"] },
  { id: "gate", title: "Migration Gate", color: "#F59E0B", items: ["Engineer Review", "AI Review Agent", "Bolt Compliance Scan", "Security Check"] },
  { id: "bolt", title: "Bolt Platform \u2014 AWS", color: "#3B82F6", items: ["Shared Auth", "Data Services", "Monitoring", "Production Hosting"] },
];

const boltPlatformTools = [
  { name: "GitHub", color: "#B8C8DA", desc: "Version control & collaboration \u2014 all builder code lives here. PRs trigger review workflows and Vercel preview deploys.", role: "Source of truth" },
  { name: "Supabase", color: "#10B981", desc: "PostgreSQL database with row-level security, auth, edge functions, and real-time subscriptions. Provisioned per project with managed migrations.", role: "Database & auth" },
  { name: "Vercel", color: "#3B82F6", desc: "Prototype hosting with instant preview deploys on every PR. Auto-deploys from main branch. Zero-config for Next.js.", role: "Prototype hosting" },
  { name: "Claude Code", color: "#8B5CF6", desc: "Terminal-native AI coding agent. Reads, writes, tests, and commits code from natural language instructions. The primary build tool for certified builders.", role: "Build tool" },
  { name: "Bolt / AWS", color: "#F59E0B", desc: "Production platform with shared services \u2014 authentication, data layer, monitoring, and compliance guardrails. Where approved apps run at scale.", role: "Production platform" },
  { name: "AI Review Agent", color: "#EF4444", desc: "Automated code review powered by Claude Code. Scans for Bolt compliance, security issues, and best practice violations before human review.", role: "Quality gate" },
];

// ============================================================
// BOLT PAAS PAGE
// ============================================================

function BoltPaaSPage() {
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [activeTool, setActiveTool] = useState<number | null>(null);
  const selectedModule = activeModule !== null ? boltCertModules[activeModule] : null;
  const selectedTool = activeTool !== null ? boltPlatformTools[activeTool] : null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
      {/* HERO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <h1 style={{ fontSize: 42, fontWeight: 700, color: "#FFFFFF", margin: 0, lineHeight: 1.15 }}>Bolt PaaS</h1>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: "#F59E0B", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 4, padding: "3px 10px", letterSpacing: 0.5, marginTop: 12 }}>Building</span>
      </div>
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 6px", maxWidth: 780, lineHeight: 1.6 }}>Business-Led Application Platform</p>
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 12px", maxWidth: 820, lineHeight: 1.6 }}>Empowers business owners and product people to build production software using Claude Code and Claude AI. Certified builders create prototypes independently, then migrate approved applications to Bolt &mdash; McKesson&apos;s governed AWS platform with shared services.</p>
      <div style={{ display: "flex", gap: 16, marginBottom: 48 }}>
        {[{ label: "Faster", value: "12\u00D7" }, { label: "Build model", value: "Business-led" }, { label: "Platform", value: "AWS" }, { label: "Quality gate", value: "AI + Human" }].map((stat, i) => (<div key={i} style={{ display: "flex", alignItems: "baseline", gap: 6 }}><span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</span><span style={{ fontSize: 13, color: "#B8C8DA" }}>{stat.label}</span></div>))}
      </div>

      {/* VELOCITY SHIFT VISUAL — COMBINED */}
      <Card style={{ padding: "32px 28px", marginBottom: 4 }}>
        {/* Traditional SDLC */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#B8C8DA", marginBottom: 16 }}>Traditional SDLC</div>
          <svg viewBox="0 0 920 130" style={{ width: "100%", display: "block" }}>
            {[
              { x: 0, w: 160, label: "Requirements", sub: "Business \u2192 Product", weeks: "3\u20134 wks", icon: "M6 3h12v2H6zm0 4h12v1H6zm0 3h8v1H6z" },
              { x: 184, w: 160, label: "Business Case", sub: "Investment approval", weeks: "4\u20136 wks", icon: "M4 5h16v2H4zm2 4h12v6H6z" },
              { x: 368, w: 160, label: "Prototyping", sub: "Product \u2192 Eng", weeks: "4\u20136 wks", icon: "M4 4h16v12H4zm2 2v8h12V6z" },
              { x: 552, w: 190, label: "Build & Test", sub: "Engineering + QA", weeks: "8\u201312 wks", icon: "M7 3l-4 8h6l-2 7 9-10h-6l4-5z" },
              { x: 766, w: 154, label: "Deploy", sub: "Stabilization", weeks: "2\u20134 wks", icon: "M12 2L4 7v6l8 5 8-5V7z" },
            ].map((s, i) => (
              <g key={i}>
                <rect x={s.x} y={0} width={s.w} height={80} rx={10} fill="rgba(148,163,184,0.06)" stroke="rgba(148,163,184,0.15)" strokeWidth={1} />
                {/* Icon top-right */}
                <g transform={`translate(${s.x + s.w - 30}, 8)`} opacity={0.3}>
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d={s.icon} fill="#B8C8DA" /></svg>
                </g>
                <text x={s.x + s.w / 2} y={36} textAnchor="middle" fontSize="15" fontWeight="600" fill="#FFFFFF" fontFamily="DM Sans, sans-serif">{s.label}</text>
                <text x={s.x + s.w / 2} y={58} textAnchor="middle" fontSize="13" fill="#B8C8DA" fontFamily="JetBrains Mono, monospace">{s.sub}</text>
                <text x={s.x + s.w / 2} y={104} textAnchor="middle" fontSize="13" fontWeight="600" fill="#D0DAE6" fontFamily="JetBrains Mono, monospace">{s.weeks}</text>
                {i < 4 && (
                  <g>
                    <line x1={s.x + s.w + 4} y1={40} x2={s.x + s.w + 20} y2={40} stroke="rgba(148,163,184,0.25)" strokeWidth={1.5} />
                    <path d={`M${s.x + s.w + 16} 36 L${s.x + s.w + 22} 40 L${s.x + s.w + 16} 44`} fill="none" stroke="rgba(148,163,184,0.25)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                )}
              </g>
            ))}
            <rect x={0} y={120} width={920} height={6} rx={3} fill="rgba(148,163,184,0.15)" />
          </svg>
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: "#B8C8DA", letterSpacing: 0.5 }}>{"~6 months \u00B7 4+ handoffs \u00B7 Investment approval required"}</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "8px 0 28px" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: BOLT_COLOR, fontWeight: 600, letterSpacing: 1 }}>VS</span>
          <div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} />
        </div>

        {/* Builder-Led with Bolt */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: BOLT_COLOR }}>Builder-led with Bolt</div>
          </div>
          <div style={{ display: "flex", gap: 0, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <svg viewBox="0 0 700 130" style={{ width: "100%", display: "block" }}>
                {[
                  { x: 0, w: 220, label: "Build Prototype", sub: "Builder + Claude Code", weeks: "1\u20132 wks", color: BOLT_COLOR, icon: "M7 3l-4 8h6l-2 7 9-10h-6l4-5z" },
                  { x: 240, w: 180, label: "Iterate", sub: "User feedback, live", weeks: "1\u20132 wks", color: BOLT_COLOR, icon: "M12 4V1L8 5l4 4V6c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z" },
                  { x: 440, w: 130, label: "AI Review", sub: "AI + engineer", weeks: "2\u20133 days", color: "#F59E0B", icon: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 15l-5-5 1.4-1.4L11 14.2l7.6-7.6L20 8l-9 9z" },
                  { x: 590, w: 110, label: "Bolt Deploy", sub: "Git \u2192 AWS", weeks: "1\u20132 days", color: "#3B82F6", icon: "M12 2l-7 7h4v6h6v-6h4z" },
                ].map((s, i) => (
                  <g key={i}>
                    <rect x={s.x} y={0} width={s.w} height={80} rx={10} fill={`${s.color}0C`} stroke={`${s.color}35`} strokeWidth={1} />
                    <rect x={s.x} y={0} width={s.w} height={3} rx={1.5} fill={s.color} opacity={0.6} />
                    {/* Icon top-right */}
                    <g transform={`translate(${s.x + s.w - 30}, 10)`} opacity={0.5}>
                      <svg width="18" height="18" viewBox="0 0 24 24"><path d={s.icon} fill={s.color} /></svg>
                    </g>
                    <text x={s.x + s.w / 2} y={36} textAnchor="middle" fontSize="15" fontWeight="600" fill="#FFFFFF" fontFamily="DM Sans, sans-serif">{s.label}</text>
                    <text x={s.x + s.w / 2} y={58} textAnchor="middle" fontSize="13" fill="#D0DAE6" fontFamily="JetBrains Mono, monospace">{s.sub}</text>
                    <text x={s.x + s.w / 2} y={104} textAnchor="middle" fontSize="13" fontWeight="600" fill={s.color} fontFamily="JetBrains Mono, monospace">{s.weeks}</text>
                    {i < 3 && (
                      <g>
                        <line x1={s.x + s.w + 4} y1={40} x2={s.x + s.w + 16} y2={40} stroke={`${s.color}50`} strokeWidth={1.5} />
                        <path d={`M${s.x + s.w + 12} 36 L${s.x + s.w + 18} 40 L${s.x + s.w + 12} 44`} fill="none" stroke={`${s.color}50`} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                    )}
                  </g>
                ))}
                <rect x={0} y={120} width={700} height={6} rx={3} fill={`${BOLT_COLOR}08`} />
                <rect x={0} y={120} width={200} height={6} rx={3} fill={`${BOLT_COLOR}40`} />
              </svg>
              <div style={{ textAlign: "center", marginTop: 10 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: BOLT_COLOR, letterSpacing: 0.5 }}>{"2\u20134 weeks \u00B7 1 handoff \u00B7 No investment approval needed"}</span>
              </div>
            </div>

            {/* 12× Badge */}
            <div style={{ width: 140, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 8 }}>
              <div style={{ width: 110, height: 110, borderRadius: "50%", background: `${BOLT_COLOR}15`, border: `2px solid ${BOLT_COLOR}50`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${BOLT_COLOR}20` }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 36, fontWeight: 700, color: BOLT_COLOR, lineHeight: 1 }}>12&times;</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: "#D0DAE6", letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>Faster</span>
              </div>
              <span style={{ fontSize: 12, color: "#B8C8DA", marginTop: 10, textAlign: "center", lineHeight: 1.3 }}>Idea to production</span>
            </div>
          </div>
        </div>
      </Card>

      {/* BEFORE & AFTER TABLE */}
      <div style={{ marginTop: 28 }}>
        <SectionHeader label="Before &amp; After" />
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 20px", borderBottom: "1px solid rgba(148,163,184,0.1)", background: "rgba(15,23,42,0.3)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#B8C8DA" }}>Dimension</span>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#EF4444" }}>Traditional SDLC</span>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#10B981" }}>Bolt PaaS</span>
          </div>
          {boltBeforeAfter.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 20px", borderBottom: i < boltBeforeAfter.length - 1 ? "1px solid rgba(148,163,184,0.06)" : "none", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#E2EAF2" }}>{row.dimension}</span>
              <span style={{ fontSize: 14, color: "#B8C8DA" }}>{row.before}</span>
              <span style={{ fontSize: 14, color: "#10B981" }}>{row.after}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* PLATFORM ARCHITECTURE */}
      <div style={{ marginTop: 28 }}>
        <SectionHeader label="Platform Architecture" />
        <Card style={{ padding: "28px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {boltArchLayers.map((layer, i) => (
              <div key={layer.id}>
                <div style={{ background: `${layer.color}0A`, border: `1px solid ${layer.color}25`, borderRadius: i === 0 ? "12px 12px 0 0" : i === 2 ? "0 0 12px 12px" : 0, padding: "20px 24px", position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: layer.color, borderRadius: i === 0 ? "12px 0 0 0" : i === 2 ? "0 0 0 12px" : 0 }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: layer.color, marginBottom: 4 }}>{layer.title}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {layer.items.map((item, j) => (
                          <span key={j} style={{ fontSize: 14, color: "#E2EAF2", background: `${layer.color}12`, border: `1px solid ${layer.color}25`, borderRadius: 6, padding: "4px 12px" }}>{item}</span>
                        ))}
                      </div>
                    </div>
                    {i === 1 && (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <span style={{ fontSize: 20, color: `${layer.color}80` }}>{"\u2191"}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: layer.color, letterSpacing: 0.5 }}>review gate</span>
                        <span style={{ fontSize: 20, color: `${layer.color}80` }}>{"\u2193"}</span>
                      </div>
                    )}
                  </div>
                </div>
                {i < 2 && (
                  <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
                    <span style={{ fontSize: 18, color: "rgba(148,163,184,0.3)" }}>{"\u25BC"}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* FULL STACK BUILDER CERTIFICATION */}
      <div style={{ marginTop: 28 }}>
        <SectionHeader label="Full Stack Builder Certification" />
        <div style={{ padding: "20px 24px", background: `${BOLT_COLOR}08`, border: `1px solid ${BOLT_COLOR}20`, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: `${BOLT_COLOR}25`, border: `1px solid ${BOLT_COLOR}40`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 16px ${BOLT_COLOR}30` }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L4.5 13H12L11 22L19.5 11H12L13 2Z" fill={BOLT_COLOR} stroke="#FFFFFF" strokeWidth="1" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>Certified Full Stack Builder</div>
              <div style={{ fontSize: 14, color: "#B8C8DA" }}>Production-ready applications meeting Bolt migration standards</div>
            </div>
          </div>
          <p style={{ fontSize: 15, color: "#D0DAE6", lineHeight: 1.6, margin: 0 }}>
            Business owners and product people complete a structured certification program that covers environment setup, core build skills, Bolt compliance requirements, and operational readiness. Certified builders can independently create, iterate, and prepare applications for Bolt migration.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 4 }}>
          {boltCertModules.map((mod, i) => (
            <div key={mod.id} onClick={() => setActiveModule(activeModule === i ? null : i)} style={{ background: activeModule === i ? `${mod.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activeModule === i ? mod.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: mod.color, opacity: activeModule === i ? 1 : 0.4 }} />
              <div style={{ fontSize: 18, marginBottom: 8 }}>{mod.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: mod.color, marginBottom: 4 }}>{mod.title}</div>
              <div style={{ fontSize: 13, color: "#B8C8DA" }}>{mod.skills.length} skills</div>
            </div>
          ))}
        </div>
        {selectedModule && (
          <div style={{ margin: "12px 0 0", background: `${selectedModule.color}08`, border: `1px solid ${selectedModule.color}20`, borderRadius: 12, padding: "24px 28px", animation: "fadeIn 0.2s ease" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedModule.color, marginBottom: 16 }}>{selectedModule.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {selectedModule.skills.map((skill, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: selectedModule.color, marginTop: 7, flexShrink: 0, boxShadow: `0 0 6px ${selectedModule.color}40` }} />
                  <span style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.5 }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PLATFORM COMPONENTS */}
      <div style={{ marginTop: 28 }}>
        <SectionHeader label="Platform Components" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 4 }}>
          {boltPlatformTools.map((tool, i) => (
            <div key={i} onClick={() => setActiveTool(activeTool === i ? null : i)} style={{ background: activeTool === i ? `${tool.color}14` : "rgba(15,23,42,0.6)", border: `1px solid ${activeTool === i ? tool.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: tool.color, opacity: activeTool === i ? 1 : 0.35 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: tool.color }}>{tool.name}</div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#B8C8DA", background: "rgba(148,163,184,0.08)", borderRadius: 4, padding: "2px 7px" }}>{tool.role}</span>
              </div>
              <div style={{ fontSize: 13, color: "#D0DAE6", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{tool.desc.split(".")[0]}.</div>
            </div>
          ))}
        </div>
        {selectedTool && (
          <div style={{ margin: "12px 0 0", background: `${selectedTool.color}08`, border: `1px solid ${selectedTool.color}20`, borderRadius: 12, padding: "24px 28px", animation: "fadeIn 0.2s ease" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedTool.color, marginBottom: 8 }}>{selectedTool.name}</div>
            <p style={{ fontSize: 15, color: "#E2EAF2", margin: 0, lineHeight: 1.65 }}>{selectedTool.desc}</p>
          </div>
        )}
      </div>

      {/* BOTTOM CALLOUT */}
      <div style={{ marginTop: 28, padding: "20px 24px", background: `${BOLT_COLOR}08`, border: `1px solid ${BOLT_COLOR}20`, borderRadius: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            "Applications are built by business owners in weeks, avoiding long engineering backlogs",
            "Bolt doesn\u2019t replace engineering. It redirects engineering from routine tools to platform, guardrails, and governance",
            "Domain experts build faster because they ARE the requirements. No handoff, no translation loss",
            "The code review gate ensures production quality. AI review agent + engineer review = governed, not ungoverned",
            "The result: 12\u00D7 faster time to production, zero increase in engineering headcount",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ color: BOLT_COLOR, fontSize: 14, marginTop: 2, flexShrink: 0 }}>{"\u25C6"}</span>
              <span style={{ fontSize: 15, color: "#E2EAF2", lineHeight: 1.55 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 64 }} />
    </div>
  );
}

// ============================================================
// MAIN APP — TAB NAVIGATION
// ============================================================

const pages = [
  { id: "glide", label: "Glide Stack", icon: "\u25C8" },
  { id: "novaxray", label: "Nova + X-Ray", icon: "\u25CA" },
  { id: "meridian", label: "Meridian", icon: "\u25CE" },
  { id: "skynet", label: "Skynet", icon: "\u2756" },
  { id: "bolt", label: "Bolt PaaS", icon: "\u26A1" },
  { id: "timeline", label: "AI Evolution", icon: "\u25C6" },
  { id: "framework", label: "Knowledge Levels", icon: "\u2726" },
];

export default function App() {
  const [activePage, setActivePage] = useState("glide");
  return (
    <div style={{ minHeight: "100vh", background: "#141B2D", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } } * { box-sizing: border-box; }`}</style>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(11,15,26,0.9)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(148,163,184,0.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {pages.map((page) => { const isActive = activePage === page.id; return (
              <button key={page.id} onClick={() => setActivePage(page.id)} style={{ background: isActive ? "rgba(59,130,246,0.12)" : "transparent", border: isActive ? "1px solid rgba(59,130,246,0.25)" : "1px solid transparent", borderRadius: 8, padding: "8px 16px", cursor: "pointer", outline: "none", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s ease" }} onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(148,163,184,0.06)"; }} onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                <span style={{ fontSize: 15, color: isActive ? "#3B82F6" : "#B8C8DA" }}>{page.icon}</span>
                <span style={{ fontSize: 15, fontWeight: isActive ? 600 : 500, color: isActive ? "#F0F4F8" : "#D0DAE6", transition: "color 0.2s ease" }}>{page.label}</span>
              </button>
            ); })}
          </div>
          <span style={{ fontSize: 14, color: "#B8C8DA", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.3 }}>Dan Lodder &middot; May 2026</span>
        </div>
      </nav>
      <div key={activePage} style={{ animation: "fadeIn 0.3s ease" }}>
        {activePage === "glide" && <GlideStackPage />}
        {activePage === "novaxray" && <NovaXrayPage />}
        {activePage === "meridian" && <MeridianPage />}
        {activePage === "skynet" && <SkynetPage />}
        {activePage === "bolt" && <BoltPaaSPage />}
        {activePage === "timeline" && <TimelinePage />}
        {activePage === "framework" && <FrameworkPage />}
      </div>
    </div>
  );
}
