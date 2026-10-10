"use client";
import React, { useState, useEffect, useRef } from "react";

// ============================================================
// SHARED STYLES & COMPONENTS
// ============================================================

const PRACTICE_NAME = "PracticeIQ";

const FONT_LINK = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";

const SectionHeader = ({ label }: { label: string }) => (
  <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#E2EAF2", marginBottom: 16 }}>
    {label}
  </div>
);

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.1)", borderRadius: 12, padding: 24, ...style }}>
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
  { id: "prompting", title: "AI Prompting Tools", subtitle: "LLM interfaces", color: "#3B82F6", capabilities: ["Natural language to SQL", "Conversational Q&A on live data", "RAG \u2014 retrieval-augmented generation", "Document extraction & synthesis", "Explainable, grounded answers", "Pricing guidance chat"], usedBy: [PRACTICE_NAME, "Nova 2.0", "Titan", "X-Ray"] },
  { id: "agents", title: "Agents", subtitle: "Automated workflows", color: "#F59E0B", capabilities: ["24/7 payer policy surveillance", "Automated document extraction", "Deal orchestration pipelines", "Multi-step data acquisition", "Scheduled monitoring & alerting", "Approval workflow automation"], usedBy: ["Titan", "Nova 2.0", "X-Ray"] },
];

const projects = [
  { id: "titan", name: "Titan", tagline: "Payer policy intelligence", color: "#F59E0B", status: "Live", statusColor: "#10B981", description: "Eliminates the quarterly manual grind for payer policy tracking. Continuously monitors formularies, step therapy requirements, and preferred drug lists across oncology drugs and biosimilars \u2014 delivering verified, real-time coverage intelligence to prevent claim denials.", capabilities: ["24/7 automated payer surveillance", "Formulary & step therapy extraction", "Preferred drug list monitoring", "Audit-ready governance trail", "Real-time API + clean UI delivery"], dataInputs: ["Payer Policy Surveillance", "Biosimilar Utilization"], intelligenceUsed: ["Agents", "AI Prompting Tools"], impact: "Removes administrative barriers for cancer patients \u2014 ensures the right drug is verified before treatment, not after a denial." },
  { id: "nova", name: "Nova 2.0", tagline: "AI pricing engine", color: "#10B981", status: "Pilot", statusColor: "#8B5CF6", description: "Replaces the Excel-based pricing model end-to-end. Automates buy/sell economics across WAC, contract price, VCD, FFS, GPO admin fees, and OIDs. Phase 3 adds AI deal recommendations. Phase 4 deploys small-account autonomy and field enablement. Estimated $6\u201312M upside.", capabilities: ["Automated WAC / GPO / OID waterfall", "Real-time what-if scenario modeling", "AI deal recommendations (Phase 3)", "SOX-compliant approval workflows", "Drug-level and account-level P&L", "LLM pricing guidance chat"], dataInputs: ["Distribution Pricing & Rebates", "GPO Rebates", "Customer & Account Data"], intelligenceUsed: ["Machine Learning", "AI Prompting Tools"], impact: "$6\u201312M upside through improved pricing efficiency. Compresses analyst time per deal and systematically protects margin on every renewal." },
  { id: "xray", name: "X-Ray", tagline: "Drug pricing transparency", color: "#3B82F6", status: "Pilot", statusColor: "#8B5CF6", description: "Customer-facing solution delivering full drug pricing transparency and net cost recovery visibility to practices. Shows the complete cost walk from WAC through discounts and rebates to net price, then layers in reimbursement to reveal per-drug NCR. Built on the same shared data infrastructure as Nova.", capabilities: ["WAC-to-net-price cost walk per drug", "Net cost recovery (NCR) calculation", "Reimbursement vs. net price comparison", "Customer-facing and field rep views", "Real-time rebate feed integration"], dataInputs: ["Distribution Pricing & Rebates", "GPO Rebates"], intelligenceUsed: ["Machine Learning", "AI Prompting Tools", "Agents"], impact: "Gives practices and field reps full visibility into drug economics \u2014 pricing transparency that drives competitive market response and enables data-driven drug decisions at the point of care." },
  { id: "skynet", name: PRACTICE_NAME, tagline: "Dynamic QBR portal", color: "#EF4444", status: "Pilot", statusColor: "#8B5CF6", description: "Replaces the static PowerPoint QBR process. Pulls data from disparate sources into a unified schema and delivers it through a dynamic, interactive customer portal. The rep or customer can ask any question in natural language \u2014 converted to SQL on the fly against a live database.", capabilities: ["Automated data aggregation from all sources", "Dynamic customer-facing portal", "Natural language to SQL query engine", "Real-time distribution purchase analytics", "GPO rebate, PMID, biosimilar reporting", "Technology adoption tracking"], dataInputs: ["GPO Rebates", "MID Data", "Biosimilar Utilization", "Customer & Account Data"], intelligenceUsed: ["AI Prompting Tools"], impact: "Moves from a static PowerPoint deck with manual data gathering to a live customer experience. Eliminates hours of rep prep time per QBR cycle." },
  { id: "savingsiq", name: "SavingsIQ", tagline: "GPO rebate modeling", color: "#A3E635", status: "Prototype", statusColor: "#F59E0B", description: "Replaces the multi-tab Excel workbook GPO analysts use to estimate rebate outcomes. Models rebate value for GPO prospects and members across contract programs, checks every assumed rate against contract ceilings, compares scenarios side by side, and keeps a full audit trail.", capabilities: ["Scenario comparison across contract programs", "Three-state contract ceiling check", "Native program resolution", "Append-only assumption audit trail", "Reconciled to the legacy workbook"], dataInputs: ["GPO Rebates", "Distribution Pricing & Rebates"], intelligenceUsed: [], impact: "Turns a three-week, cross-functional spreadsheet exercise into a live, defensible economic comparison for competitive GPO pursuits." },
  { id: "retentioniq", name: "RetentionIQ", tagline: "Patient retention", color: "#F472B6", status: "Building", statusColor: "#F59E0B", description: "Finds patients falling behind on scheduled treatment, shows staff why each one is at risk, and helps coordinators reach the patient and record what happened. Built first for retina practices; oncology is next.", capabilities: ["Daily at-risk worklist", "Explained risk factors on every flag", "Call outcome and barrier logging", "Retention trends by physician", "Configurable expected treatment intervals"], dataInputs: ["Practice scheduling & treatment history"], intelligenceUsed: [], impact: "Turns quiet gaps in care into a daily, explained outreach list so fewer patients are lost to follow-up." },
];

// ============================================================
// SHARED NAV TYPE
// ============================================================

type Navigate = (id: string) => void;

const CrossLink = ({ label, target, onNavigate, color = "#3B82F6" }: { label: string; target: string; onNavigate: Navigate; color?: string }) => (
  <button onClick={() => onNavigate(target)} style={{ background: `${color}10`, border: `1px solid ${color}35`, borderRadius: 8, padding: "10px 16px", cursor: "pointer", outline: "none", display: "inline-flex", alignItems: "center", gap: 10, transition: "all 0.2s ease" }}>
    <span style={{ fontSize: 15, fontWeight: 600, color }}>{label}</span>
    <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7 H11 M7.5 3.5 L11 7 L7.5 10.5" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </button>
);

// ============================================================
// DATA DOMAINS (shown on Data Platform)
// ============================================================

function DataDomainsSection() {
  const [activeDataBucket, setActiveDataBucket] = useState<number | null>(null);
  const selectedBucket = activeDataBucket !== null ? dataLayer[activeDataBucket] : null;
  return (
    <div>
      <SectionHeader label="Data Domains" />
      <p style={{ fontSize: 15, color: "#D0DAE6", margin: "-6px 0 16px", lineHeight: 1.6, maxWidth: 820 }}>The eight data domains the Glide Platform unifies. Click any domain to see its full inventory.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {dataLayer.map((bucket, i) => (
          <div key={bucket.id} onClick={() => setActiveDataBucket(activeDataBucket === i ? null : i)} style={{ background: activeDataBucket === i ? `${bucket.color}14` : "rgba(16,34,66,0.6)", border: `1px solid ${activeDataBucket === i ? bucket.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "16px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
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
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedBucket.color, marginBottom: 16 }}>{selectedBucket.title + " — full data inventory"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
            {selectedBucket.items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: selectedBucket.color, flexShrink: 0 }} />
                <span style={{ fontSize: 16, color: "#E2EAF2" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SOLUTIONS OVERVIEW PAGE (former Glide Stack applications grid)
// ============================================================

const solutionPageIds: Record<string, string> = { titan: "titan", nova: "novaxray", xray: "novaxray", skynet: "skynet", savingsiq: "savingsiq", retentioniq: "retentioniq" };

function SolutionsOverviewPage({ onNavigate }: { onNavigate: Navigate }) {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const selectedProject = activeProject !== null ? projects[activeProject] : null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
      <h1 style={{ fontSize: 42, fontWeight: 700, color: "#FFFFFF", margin: "0 0 8px", lineHeight: 1.15 }}>Solutions</h1>
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 6px", maxWidth: 720, lineHeight: 1.6 }}>Oncology and multi-specialty applications built on the Glide Platform</p>
      <p style={{ fontSize: 15, color: "#D0DAE6", margin: "0 0 48px", lineHeight: 1.5 }}>Click any application for a summary, or open its full page.</p>

      <SectionHeader label="Applications" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 4 }}>
        {projects.map((p, i) => (
          <div key={p.id} onClick={() => setActiveProject(activeProject === i ? null : i)} style={{ background: activeProject === i ? `${p.color}14` : "rgba(16,34,66,0.6)", border: `1px solid ${activeProject === i ? p.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
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
            <div style={{ background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 14 }}>Capabilities</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {selectedProject.capabilities.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: selectedProject.color, marginTop: 7, flexShrink: 0 }} />
                    <span style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.5 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 12 }}>Data inputs</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selectedProject.dataInputs.map((d, i) => (<span key={i} style={{ fontSize: 14, color: "#D0DAE6", background: "rgba(148,163,184,0.08)", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 6, padding: "4px 10px" }}>{d}</span>))}
                </div>
              </div>
              <div style={{ background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 12 }}>Intelligence used</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selectedProject.intelligenceUsed.map((d, i) => (<span key={i} style={{ fontSize: 14, color: selectedProject.color, background: `${selectedProject.color}12`, border: `1px solid ${selectedProject.color}25`, borderRadius: 6, padding: "4px 10px" }}>{d}</span>))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, color: "#E2EAF2", lineHeight: 1.6, flex: 1, minWidth: 280 }}>{selectedProject.impact}</span>
            {solutionPageIds[selectedProject.id] && <CrossLink label={"Open " + selectedProject.name} target={solutionPageIds[selectedProject.id]} onNavigate={onNavigate} color={selectedProject.color} />}
          </div>
        </div>
      )}

      <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <CrossLink label="Built on Bolt PaaS" target="bolt" onNavigate={onNavigate} color={BOLT_COLOR} />
        <CrossLink label="Powered by the Data Platform" target="dataplatform" onNavigate={onNavigate} color="#10B981" />
      </div>
      <div style={{ height: 64 }} />
    </div>
  );
}

// ============================================================
// TITAN DATA
// ============================================================

const titanStages = [
  { id: "surveillance", stage: "Surveillance", nickname: "The 24/7 Guardian", color: "#3B82F6", desc: "Continuous, automated monitoring of payer policies for specific oncology drugs and biosimilars, around the clock." },
  { id: "acquisition", stage: "Acquisition", nickname: "Instant Answers", color: "#8B5CF6", desc: "AI reads messy policy documents and extracts the updates that matter, without the manual digging." },
  { id: "synthesis", stage: "Synthesis", nickname: "Noise into Knowledge", color: "#EC4899", desc: "Structures complex rules, identifying preferred drugs and step therapy requirements automatically." },
  { id: "governance", stage: "Governance", nickname: "Audit-Ready", color: "#F59E0B", desc: "Every policy is verified and traceable, so practices act on accurate, current coverage information." },
  { id: "execution", stage: "Execution", nickname: "At Your Fingertips", color: "#10B981", desc: "Delivered through a clean user interface and a real-time API, ending the quarterly grind." },
];

const titanBeforeAfter = [
  { dimension: "Monitoring", before: "Policies checked once a quarter; mid-quarter changes missed", after: "Continuous 24/7 surveillance of drugs and biosimilars" },
  { dimension: "Finding updates", before: "Hours spent digging through messy documents", after: "AI reads and extracts policy updates instantly" },
  { dimension: "Data freshness", before: "Often out of date by the time it was compiled", after: "Rules structured automatically: preferred drugs, step therapy" },
  { dimension: "Confidence", before: "Treatment decisions made hoping policies hadn’t shifted", after: "Verified, audit-ready policy information" },
  { dimension: "Sharing", before: "Slow, fragmented hand-offs between teams", after: "Clean UI plus a real-time API" },
];

// ============================================================
// TITAN PAGE
// ============================================================

// (TitanPage moved to the modern solution pages below)

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

// (TimelinePage moved to the modern Roadmap / AI Literacy pages)

// ============================================================
// COMPUTE GROWTH CHART
// ============================================================

// (ComputeGrowthChart moved to the modern Roadmap / AI Literacy pages)

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

// (VelocityChart moved to the modern Roadmap / AI Literacy pages)

// ============================================================
// FRAMEWORK PAGE
// ============================================================

// (FrameworkPage moved to the modern Roadmap / AI Literacy pages)

// ============================================================
// NOVA + X-RAY DATA
// ============================================================

const novaXrayProjects = [
  { id: "xray", name: "X-Ray", tagline: "Customer-facing drug pricing transparency", color: "#3B82F6", status: "Pilot", statusColor: "#8B5CF6", description: "Customer-facing solution that delivers full drug pricing transparency and net cost recovery visibility to practices. Shows the complete cost walk from WAC through discounts and rebates to net price, then layers in reimbursement to reveal per-drug NCR. Built on the same shared data infrastructure as Nova.", capabilities: ["WAC-to-net-price cost walk per drug", "Net cost recovery (NCR) calculation", "Reimbursement vs. net price comparison", "Real-time rebate feed integration", "Customer-facing and field rep views", "Designed for practice-level conversations"], dataInputs: ["Distribution Pricing & Rebates", "GPO Rebates"], intelligenceUsed: ["Machine Learning", "AI Prompting Tools", "Agents"], impact: "Gives practices and field reps full visibility into drug economics \u2014 pricing transparency that drives competitive market response and enables data-driven drug decisions at the point of care." },
  { id: "nova", name: "Nova 2.0", tagline: "Internal pricing intelligence engine \u2014 $6\u201312M identified upside", color: "#10B981", status: "Pilot", statusColor: "#8B5CF6", description: "Replaces the Excel-based pricing model end-to-end. Automates buy/sell economics across WAC, contract price, VCD, FFS, GPO admin fees, and OIDs. Phase 1 (competitive bid comparison) is live. Phase 3 adds AI deal recommendations. Phase 4 deploys small-account autonomy and field enablement.", capabilities: ["System of record for pricing \u2014 replaces Excel", "Automated buy/sell economics (WAC, VCD, FFS, OIDs)", "Real-time what-if scenario modeling", "SOX-compliant approval workflows", "Drug-level and account-level P&L", "AI deal recommendations (Phase 3)", "LLM pricing guidance chat (Phase 3)"], dataInputs: ["Distribution Pricing & Rebates", "GPO Rebates", "Customer & Account Data"], intelligenceUsed: ["Machine Learning", "AI Prompting Tools"], impact: "$6\u201312M upside through improved pricing efficiency. Compresses analyst time per deal and systematically protects margin on every renewal." },
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

// (NovaXrayPage moved to the modern solution pages below)

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

// (MeridianPage moved to the modern solution pages below)

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

// (SkynetPage moved to the modern solution pages below)

// ============================================================
// BOLT PAAS DATA
// ============================================================

const BOLT_COLOR = "#2DD4BF";

const boltBeforeAfter = [
  { dimension: "Who builds", before: "Engineering team", after: "Certified business owners & product people" },
  { dimension: "Idea \u2192 Prototype", before: "8\u201312 weeks", after: "1\u20132 weeks" },
  { dimension: "Handoffs", before: "4+ (business \u2192 product \u2192 eng \u2192 QA)", after: "1 (builder \u2192 code review)" },
  { dimension: "Investment approval", before: "Business case required", after: "Not required for prototypes" },
  { dimension: "Domain context", before: "Lost in translation across handoffs", after: "Builder IS the domain expert" },
  { dimension: "Backlog dependency", before: "Competes for engineering capacity", after: "Independent \u2014 no queue" },
  { dimension: "Production platform", before: "Varies by team and project", after: "Standardized on Bolt (AWS)" },
];

const boltCertModules = [
  { id: "env", title: "Environment Setup", color: BOLT_COLOR, icon: "\uD83D\uDD27", skills: ["GitHub repo creation & branch strategy", "Supabase project provisioning & RLS setup", "Vercel project creation & deployment", "Claude Code installation & CLAUDE.md configuration", "Connecting GitHub \u2192 Vercel auto-deploy pipeline"] },
  { id: "build", title: "Core Build Skills", color: BOLT_COLOR, icon: "\u26A1", skills: ["Prompt engineering for code generation", "PR best practices \u2014 small, atomic, descriptive", "Database schema design & migrations", "Testing fundamentals \u2014 build verification, basic E2E", "Reading and evaluating AI-generated code"] },
  { id: "compliance", title: "Bolt Compliance", color: BOLT_COLOR, icon: "\uD83D\uDEE1", skills: ["App structure requirements for Bolt migration", "Shared auth integration patterns", "Data layer conventions & naming standards", "Security baseline \u2014 RLS policies, no secrets in code", "Code review readiness checklist"] },
  { id: "ops", title: "Operational Readiness", color: BOLT_COLOR, icon: "\uD83D\uDE80", skills: ["Environment variables & secrets management", "Error handling & logging patterns", "Performance basics \u2014 query optimization, caching", "Documentation standards for handoff", "Monitoring & alerting fundamentals"] },
];

type EngCell = "bolt" | "partner" | "shared";

const ENG_STYLES: Record<EngCell, { bg: string; text: string; label: string }> = {
  bolt: { bg: "rgba(59,130,246,0.30)", text: "#FFFFFF", label: "Bolt" },
  partner: { bg: "rgba(245,158,11,0.26)", text: "#FFFFFF", label: "Partner" },
  shared: { bg: "rgba(184,200,218,0.16)", text: "#FFFFFF", label: "Shared" },
};

const boltEngagementRoles = ["Business Owner", "Product Builder", "App Engineer", "Platform Engineer"];

const boltEngagementModels: { id: string; name: string; abbr: string; desc: string; cells: EngCell[]; examples: string[] }[] = [
  { id: "ownership", name: "Product Ownership", abbr: "", desc: "Bolt owns the product end to end, from vision to platform.", cells: ["bolt", "bolt", "bolt", "bolt"], examples: ["Lynx", "Glide RI", "RetentionIQ"] },
  { id: "paas", name: "Product as a Service", abbr: "PaaS", desc: "The business owns the product vision; Bolt builds, engineers, and runs it.", cells: ["partner", "bolt", "bolt", "bolt"], examples: ["SavingsIQ", "NOVA", "PracticeIQ"] },
  { id: "daas", name: "Development as a Service", abbr: "DaaS", desc: "Partner and Bolt build together; Bolt engineers and runs it.", cells: ["partner", "shared", "bolt", "bolt"], examples: ["Strategy", "GPO", "Other partner apps"] },
  { id: "iaas", name: "Infrastructure as a Service", abbr: "IaaS", desc: "The partner team builds and engineers its own app; Bolt provides the platform.", cells: ["partner", "partner", "partner", "bolt"], examples: ["Generics Team"] },
];

// ============================================================
// BOLT PAAS PAGE
// ============================================================

const boltStack = [
  { id: "build", step: "Build", note: "Where certified builders work", color: "#3B82F6", items: [
    { name: "Claude Code", desc: "Terminal-native AI coding agent and the primary build tool for certified builders. Reads, writes, tests and commits code from plain-language instructions." },
    { name: "GitHub", desc: "Version control and collaboration. All builder code lives here, and every pull request triggers the review workflow." },
    { name: "PostgreSQL", desc: "Relational database with row-level security, provisioned per project with managed migrations." },
  ] },
  { id: "gate", step: "Review Gate", note: "Nothing reaches production unreviewed", color: "#F59E0B", items: [
    { name: "AI Review Agent", desc: "Automated review that scans for Bolt compliance, security issues and best-practice violations before a human looks at the code." },
    { name: "Engineer Review", desc: "A Bolt engineer reviews and approves every application before it moves to production." },
    { name: "Security Scan", desc: "Checks for secrets in code, row-level security policies and Bolt standards." },
  ] },
  { id: "run", step: "Run on Bolt", note: "McKesson's governed AWS platform", color: BOLT_COLOR, items: [
    { name: "Shared Auth", desc: "One sign-in and permission model shared by every Bolt application." },
    { name: "Monitoring", desc: "Shared logging, alerting and performance monitoring for every app on the platform." },
    { name: "Production Hosting", desc: "Approved applications run at scale on AWS with compliance guardrails built in." },
  ] },
];

const BOLT_CSS = `
@keyframes boltFlow { 0% { top: -6px; opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { top: calc(100% - 6px); opacity: 0; } }
@keyframes boltGlow { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.9; } }
@keyframes boltFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes boltRise { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@keyframes boltFlip { from { opacity: 0; transform: perspective(700px) rotateX(-90deg); } to { opacity: 1; transform: none; } }
@keyframes boltFlash { 0% { box-shadow: 0 0 0 0 rgba(45,212,191,0.75); } 100% { box-shadow: 0 0 0 28px rgba(45,212,191,0); } }
@keyframes boltPop { 0% { transform: scale(0.6); opacity: 0; } 70% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
@keyframes boltBlink { 50% { opacity: 0; } }
@keyframes boltIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes boltGrowX { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes boltPulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
.bolt-range { -webkit-appearance: none; appearance: none; background: transparent; }
.bolt-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 4px; height: 48px; }
.bolt-range::-moz-range-thumb { width: 4px; height: 48px; border: 0; }
@media (max-width: 720px) { .bolt-split { flex-direction: column; } .bolt-split-pane { width: 100% !important; } .bolt-split-inner { min-width: 0 !important; } .bolt-split-handle, .bolt-split-input, .bolt-split-hint { display: none !important; } }
@keyframes boltTileGlow { 0%, 22%, 100% { box-shadow: none; border-color: rgba(45,212,191,0.25); background: rgba(45,212,191,0.07); } 8% { box-shadow: 0 0 18px rgba(45,212,191,0.45); border-color: #2DD4BF; background: rgba(45,212,191,0.2); } }
@media (max-width: 760px) { .bolt-harness, .bolt-next { grid-template-columns: 1fr !important; } .bolt-harness-arrow { transform: rotate(90deg); justify-self: center; } .bolt-harness-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; } }
@keyframes dpDash { to { stroke-dashoffset: -17; } }
@keyframes dpDashRev { to { stroke-dashoffset: -20; } }
@keyframes dpSpin { to { transform: rotate(360deg); } }
@media (max-width: 760px) { .dp-hub { display: none !important; } .dp-hub-grid { display: grid !important; } .dp-reuse { grid-template-columns: 1fr !important; } .dp-reuse-gutter-wrap { display: none; } }
@keyframes siqGlow { 0%, 18%, 100% { box-shadow: none; border-color: rgba(163,230,53,0.25); } 7% { box-shadow: 0 0 18px rgba(163,230,53,0.4); border-color: #A3E635; } }
@media (max-width: 760px) { .siq-legs { grid-template-columns: 1fr !important; } }
@keyframes solGlow { 0%, 18%, 100% { box-shadow: none; } 7% { box-shadow: 0 0 18px var(--sol); border-color: var(--sol); } }
@keyframes titanScan { from { top: 0; } to { top: 100%; } }
@keyframes litDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes litUp { from { transform: scaleY(0.15); opacity: 0; } to { transform: none; opacity: 1; } }
@media (max-width: 760px) { .lit-3col { grid-template-columns: 1fr !important; } .lit-flow { grid-template-columns: 1fr !important; } .lit-flow-arrow { flex-direction: row !important; gap: 10px !important; padding: 2px 0; } .lit-flow-svg { transform: rotate(90deg); width: 34px; } }
@media (max-width: 760px) { .xray-grid { grid-template-columns: 1fr !important; } }
@media (prefers-reduced-motion: reduce) { .bolt-anim { animation: none !important; transition: none !important; } }
`;

type BoltGlyph = "bolt" | "layers" | "people" | "cert" | "briefcase" | "code" | "app" | "server" | "chart" | "trend" | "target" | "box" | "shield" | "eye" | "repeat" | "check" | "list" | "link" | "commit" | "person" | "db" | "pulse" | "sliders";

const BOLT_GLYPHS: Record<BoltGlyph, string> = {
  bolt: "M13 2 4.5 13H12l-1 9 8.5-11H12l1-9Z",
  layers: "m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5m-18 4 9 5 9-5",
  people: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 10a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7.5M22 21a7 7 0 0 0-4.5-6.5",
  cert: "M12 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-3 0-1.5 7 4.5-2.5 4.5 2.5L15 14",
  briefcase: "M4 8h16v11H4V8Zm5 0V5h6v3m-11 5h16",
  code: "m8 8-4 4 4 4m8-8 4 4-4 4m-2.5-10-3 12",
  app: "M4 5h16v14H4V5Zm0 4h16M7 7h.01M9.5 7h.01",
  server: "M4 4h16v6H4V4Zm0 10h16v6H4v-6ZM7.5 7h.01M7.5 17h.01",
  chart: "M4 20h16M7 16v-5m5 5V6m5 10v-8",
  trend: "m3 17 6-6 4 4 8-8m-6 0h6v6",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  box: "m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 9 8-4.5M12 12v9m0-9L4 7.5",
  shield: "M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Zm-3 9 2 2 4-4",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  repeat: "M4 12a8 8 0 0 1 13.7-5.7L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.7L4 15.5M4 20v-4.5h4.5",
  check: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-4-9 3 3 5-6",
  list: "M10 6h10M10 12h10M10 18h10M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2",
  link: "M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1",
  commit: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 12h6m6 0h6",
  person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0",
  db: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  pulse: "M3 12h4l3-8 4 16 3-8h4",
  sliders: "M4 7h10m4 0h2M4 17h4m4 0h8M16 5v4M10 15v4",
};

function BoltGlyphIcon({ kind, size = 22, color = BOLT_COLOR }: { kind: BoltGlyph; size?: number; color?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path d={BOLT_GLYPHS[kind]} fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const prefersReducedMotion = () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useInViewOnce<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined" || prefersReducedMotion()) { setInView(true); return; }
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

function useCountUp(active: boolean, duration = 1400) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!active) { setProgress(0); return; }
    if (prefersReducedMotion()) { setProgress(1); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const x = Math.min(1, (now - start) / duration);
      setProgress(1 - Math.pow(1 - x, 3));
      if (x < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, duration]);
  return progress;
}

// Fades and lifts content in the first time it scrolls into view
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.1);
  return (
    <div ref={ref} className="bolt-anim" style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(28px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(.2,.7,.2,1) ${delay}s` }}>
      {children}
    </div>
  );
}

const srOnly: React.CSSProperties = { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0 };

// Hero KPIs that count up when they appear
function BoltKpis({ big = false }: { big?: boolean }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.2);
  const p = useCountUp(inView, 1500);
  const kpis = [
    { shown: `${Math.round(2 * p)}–${Math.round(4 * p)} weeks`, final: "2–4 weeks", label: "Idea to production", sub: `vs. ~6 months; up to ${Math.round(12 * p)}× faster`, subFinal: "vs. ~6 months; up to 12× faster", fade: false },
    { shown: `${Math.round(p)} handoff`, final: "1 handoff", label: "Builder to code review", sub: "vs. 4+ matrix teams", subFinal: "vs. 4+ matrix teams", fade: false },
    { shown: `${Math.round(9 * p)} apps`, final: "9 apps", label: "In under 6 months", sub: "Built on Bolt since April 2026", subFinal: "Built on Bolt since April 2026", fade: false },
  ];
  return (
    <div ref={ref} style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${big ? 300 : 250}px), 1fr))`, gap: big ? 18 : 12 }}>
      {kpis.map((k, i) => (
        <div key={k.label} style={{ background: "rgba(16,34,66,0.6)", border: "1px solid rgba(45,212,191,0.3)", borderRadius: 12, padding: big ? "30px 32px" : "22px 24px", boxShadow: inView ? "0 0 32px rgba(45,212,191,0.08)" : "none", transition: "box-shadow 1s ease" }}>
          <span style={srOnly}>{k.final + ". " + k.label + ". " + k.subFinal}</span>
          <p aria-hidden="true" style={{ fontSize: big ? 52 : 30, fontWeight: 700, letterSpacing: -0.6, color: BOLT_COLOR, margin: 0, lineHeight: 1.15, fontVariantNumeric: "tabular-nums", opacity: k.fade ? p : 1, transform: k.fade ? `scale(${0.85 + 0.15 * p})` : "none", transformOrigin: "left center" }}>{k.shown}</p>
          <p aria-hidden="true" style={{ color: "#FFFFFF", fontSize: big ? 22 : 17, fontWeight: 600, margin: "10px 0 3px" }}>{k.label}</p>
          <p aria-hidden="true" style={{ fontSize: big ? 19 : 16, color: "#B8C8DA", margin: 0, fontVariantNumeric: "tabular-nums" }}>{i === 0 ? k.sub : k.subFinal}</p>
        </div>
      ))}
    </div>
  );
}

const shipStations: { name: string; sub: string; icon: BoltGlyph }[] = [
  { name: "Build", sub: "Builder + Claude Code", icon: "code" },
  { name: "AI Review", sub: "Automated checks", icon: "bolt" },
  { name: "Engineer Review", sub: "Human approval", icon: "people" },
  { name: "Run on Bolt", sub: "Production on AWS", icon: "server" },
];
const shipChecks = [{ label: "Security scan", at: 24 }, { label: "Bolt compliance", at: 28 }, { label: "Row-level security", at: 32 }];
const SHIP_END = 56;

const CheckMark = ({ on }: { on: boolean }) => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" fill={on ? "rgba(45,212,191,0.18)" : "none"} stroke={on ? BOLT_COLOR : "rgba(184,200,218,0.35)"} strokeWidth="1.6" />
    {on && <path d="m7.5 12.5 3 3 6-7" fill="none" stroke={BOLT_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);

// Live, illustrative walk of one app from idea to production
function BoltShipDemo({ autoStart = false, big = false, trigger = 0 }: { autoStart?: boolean; big?: boolean; trigger?: number }) {
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => { if (!trigger) return; setT(0); setRunning(true); }, [trigger]);
  useEffect(() => {
    if (!autoStart) return;
    const id = window.setTimeout(() => { setT(0); setRunning(true); }, 700);
    return () => window.clearTimeout(id);
  }, [autoStart]);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setT((v) => Math.min(SHIP_END, v + 1)), prefersReducedMotion() ? 60 : 170);
    return () => window.clearInterval(id);
  }, [running]);
  useEffect(() => { if (t >= SHIP_END) setRunning(false); }, [t]);
  const ship = () => { setT(0); setRunning(true); };
  const reset = () => { setRunning(false); setT(0); };

  const started = t > 0;
  const station = t < 20 ? 0 : t < 32 ? 1 : t < 40 ? 2 : 3;
  const day = !started ? 0 : t < 20 ? 1 + Math.floor((t / 20) * 6.99) : t < 32 ? 8 : t < 40 ? (t < 36 ? 9 : 10) : Math.min(14, 11 + Math.floor(((t - 40) / 12) * 3.99));
  const approved = t >= 38;
  const deployed = t >= 48;
  const done = t >= 52;
  const week = Math.max(1, Math.ceil(day / 7));
  const status = !started ? "Press Ship an app to follow one app from idea to production." : done ? "Live on Bolt in 14 days. The traditional path is still in week 2 of requirements." : station === 0 ? "Building with Claude Code" : station === 1 ? "AI review running automated checks" : station === 2 ? (approved ? "Engineer approved" : "Engineer reviewing the code") : "Deploying to Bolt";
  const fs = big ? 1.2 : 1;

  return (
    <Card style={{ padding: big ? "28px 32px" : "clamp(16px, 2.5vw, 24px)", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h3 style={{ margin: 0, fontSize: 20 * fs, color: "#FFFFFF" }}>Ship an app</h3>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#93C5FD", border: "1px solid rgba(147,197,253,0.4)", borderRadius: 5, padding: "2px 8px" }}>Illustrative</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, minHeight: 46 }}>
          <span aria-hidden="true" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28 * fs, fontWeight: 700, color: started ? BOLT_COLOR : "rgba(184,200,218,0.5)", fontVariantNumeric: "tabular-nums", minWidth: 130 * fs, textAlign: "right" }}>{"Day " + day}</span>
          {!running && <BoltButton onClick={ship} style={{ background: BOLT_COLOR, color: "#0B1A33", borderColor: BOLT_COLOR }}><span>{done ? "Ship another" : "Ship an app"}</span><BoltIcon kind="arrow" /></BoltButton>}
          {started && !running && <BoltButton onClick={reset} style={{ background: "transparent" }}><span>Reset</span></BoltButton>}
        </div>
      </div>

      <p style={{ margin: "0 0 10px", fontSize: 15 * fs, fontWeight: 600, color: BOLT_COLOR }}>With Bolt</p>
      <div style={{ position: "relative", paddingTop: 36 }}>
        <div aria-hidden="true" style={{ position: "absolute", left: "12.5%", right: "12.5%", top: 63, height: 2, background: "rgba(184,200,218,0.18)" }}>
          <div className="bolt-anim" style={{ height: "100%", width: `${started ? (station / 3) * 100 : 0}%`, background: BOLT_COLOR, transition: "width 0.6s ease" }} />
        </div>
        <div aria-hidden="true" className="bolt-anim" style={{ position: "absolute", top: 0, left: `${station * 25 + 12.5}%`, transform: "translateX(-50%)", transition: "left 0.6s cubic-bezier(.2,.7,.2,1)", zIndex: 2, opacity: started ? 1 : 0 }}>
          <div key={deployed ? "live" : "moving"} style={{ display: "flex", alignItems: "center", gap: 6, background: deployed ? BOLT_COLOR : "#1E3A8A", color: deployed ? "#0B1A33" : "#FFFFFF", border: `1px solid ${deployed ? BOLT_COLOR : "#60A5FA"}`, borderRadius: 8, padding: "4px 10px", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", animation: deployed ? "boltFlash 1.1s ease-out 2" : undefined }}>
            <BoltGlyphIcon kind="app" size={15} color={deployed ? "#0B1A33" : "#FFFFFF"} />{deployed ? "Live" : "New app"}
          </div>
        </div>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10 }}>
          {shipStations.map((st, i) => {
            const active = started && station === i && !done;
            const complete = started && (station > i || done);
            return (
              <li key={st.name} style={{ textAlign: "center", padding: "0 4px" }}>
                <div style={{ width: 56, height: 56, margin: "0 auto", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, background: complete ? "rgba(45,212,191,0.18)" : "#0F2342", border: `2px solid ${active || complete ? BOLT_COLOR : "rgba(184,200,218,0.3)"}`, boxShadow: active ? `0 0 22px ${BOLT_COLOR}66` : "none", transition: "all 0.4s ease" }}>
                  <BoltGlyphIcon kind={st.icon} size={24} color={active || complete ? BOLT_COLOR : "#B8C8DA"} />
                </div>
                <p style={{ margin: "12px 0 2px", fontSize: 16 * fs, fontWeight: 700, color: "#FFFFFF" }}>{st.name}</p>
                <p style={{ margin: 0, fontSize: 14 * fs, color: "#B8C8DA" }}>{st.sub}</p>
                <div style={{ marginTop: 12, minHeight: 74, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  {i === 0 && (
                    <div style={{ width: "80%", height: 6, borderRadius: 3, background: "rgba(184,200,218,0.15)", overflow: "hidden" }}>
                      <div className="bolt-anim" style={{ height: "100%", width: `${Math.min(1, t / 20) * 100}%`, background: BOLT_COLOR, transition: "width 0.2s linear" }} />
                    </div>
                  )}
                  {i === 1 && shipChecks.map((c) => (
                    <span key={c.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14 * fs, color: t >= c.at ? "#E2EAF2" : "#7F93AE" }}><CheckMark on={t >= c.at} />{c.label}</span>
                  ))}
                  {i === 2 && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 15 * fs, fontWeight: 600, color: approved ? BOLT_COLOR : "#7F93AE" }}>
                      <CheckMark on={approved} />{approved ? "Approved" : "Pending"}
                    </span>
                  )}
                  {i === 3 && (
                    <span key={deployed ? "on" : "off"} className="bolt-anim" style={{ fontSize: 15 * fs, fontWeight: 700, color: deployed ? BOLT_COLOR : "#7F93AE", animation: deployed ? "boltPop 0.5s ease-out both" : undefined }}>{deployed ? "In production" : "Waiting"}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(184,200,218,0.16)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
          <span style={{ fontSize: 15 * fs, fontWeight: 600, color: "#B8C8DA" }}>Traditional, same {day || 14} days</span>
          <span style={{ fontSize: 15 * fs, color: "#B8C8DA" }}>{started ? `Week ${week} of ~26 · still in Requirements` : "~26 weeks to production"}</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: "rgba(184,200,218,0.12)", overflow: "hidden" }}>
          <div className="bolt-anim" style={{ height: "100%", width: `${(day / 182) * 100}%`, background: "#B8C8DA", transition: "width 0.2s linear" }} />
        </div>
      </div>
      <p aria-live="polite" style={{ margin: "14px 0 0", fontSize: 15 * fs, color: done ? BOLT_COLOR : "#D0DAE6", fontWeight: done ? 700 : 400 }}>{status}</p>
    </Card>
  );
}

// Isometric stack: Applications on Bolt on the Data Platform
type HeroLayer = "apps" | "bolt" | "data";

function BoltHeroStack({ onLayer, autoExplode = false, maxWidth = 370, litLayer }: { onLayer?: (layer: HeroLayer) => void; autoExplode?: boolean; maxWidth?: number; litLayer?: HeroLayer }) {
  const [hover, setHover] = useState(false);
  const [focusLayer, setFocusLayer] = useState<HeroLayer | null>(null);
  const [auto, setAuto] = useState(false);
  useEffect(() => {
    if (!autoExplode) return;
    const id = window.setTimeout(() => setAuto(true), 900);
    return () => window.clearTimeout(id);
  }, [autoExplode]);
  const [motionOk, setMotionOk] = useState(false);
  useEffect(() => { setMotionOk(!prefersReducedMotion()); }, []);
  const exploded = hover || auto || focusLayer !== null;
  const cx = 112, w = 84, h = 34, t = 10;
  const slab = (y: number, color: string, lit: boolean, t: number = 10) => (
    <g>
      <polygon points={`${cx - w},${y} ${cx},${y + h} ${cx},${y + h + t} ${cx - w},${y + t}`} fill={color} fillOpacity={0.16} stroke={color} strokeOpacity={0.5} />
      <polygon points={`${cx},${y + h} ${cx + w},${y} ${cx + w},${y + t} ${cx},${y + h + t}`} fill={color} fillOpacity={0.26} stroke={color} strokeOpacity={0.5} />
      <polygon points={`${cx},${y - h} ${cx + w},${y} ${cx},${y + h} ${cx - w},${y}`} fill={color} fillOpacity={lit ? 0.38 : 0.22} stroke={color} strokeWidth={lit ? 2.2 : 1.4} />
    </g>
  );
  // Map square face coords (-1..1) onto a slab's isometric top face
  const face = (y: number) => `matrix(${w / 2}, ${h / 2}, ${-w / 2}, ${h / 2}, ${cx}, ${y})`;
  const BOLT_CYAN = "#22D3EE";
  const boltSlab = (y: number, isLit: boolean) => (
    <g>
      {slab(y, BOLT_CYAN, isLit)}
      <g transform={face(y)}>
        <g className="bolt-anim" style={{ animation: "boltPulse 3.2s ease-in-out infinite" }}>
          {["M -0.92 -0.32 H -0.42", "M 0.42 0.32 H 0.92", "M -0.32 0.92 V 0.42", "M 0.32 -0.92 V -0.42", "M -0.92 0.4 H -0.55 V 0.62", "M 0.92 -0.4 H 0.55 V -0.62"].map((d) => (
            <path key={d} d={d} fill="none" stroke={BOLT_CYAN} strokeOpacity={0.75} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
          ))}
          {[[-0.42, -0.32], [0.42, 0.32], [-0.32, 0.42], [0.32, -0.42], [-0.55, 0.62], [0.55, -0.62]].map(([u, v]) => <circle key={`${u}${v}`} cx={u} cy={v} r={0.05} fill={BOLT_CYAN} />)}
        </g>
      </g>
      <ellipse cx={cx} cy={y} rx={22} ry={9} fill={BOLT_CYAN} fillOpacity={0.25} />
      <g transform={`translate(${cx - 12.5}, ${y - 21}) scale(1.05)`} style={{ filter: `drop-shadow(0 0 6px ${BOLT_CYAN})` }}>
        <path d="M13 2 4.5 13H12l-1 9 8.5-11H12l1-9Z" fill={BOLT_CYAN} fillOpacity={isLit ? 0.95 : 0.8} stroke="#ECFEFF" strokeWidth={1.3} strokeLinejoin="round" />
      </g>
    </g>
  );
  const DATA_GREEN = "#10B981";
  const dataSlab = (y: number, isLit: boolean) => (
    <g>
      {slab(y + 14, DATA_GREEN, false, 4)}
      {slab(y + 7, DATA_GREEN, false, 4)}
      {slab(y, DATA_GREEN, isLit, 4)}
      <g transform={face(y)}>
        {dataLayer.map((d, k) => {
          const col = k % 4, row = Math.floor(k / 4);
          const u = -0.78 + col * 0.4, v = -0.42 + row * 0.46;
          return <rect key={d.id} x={u} y={v} width={0.3} height={0.36} rx={0.05} fill={d.color} fillOpacity={isLit ? 0.75 : 0.55} stroke={d.color} strokeWidth={0.8} vectorEffect="non-scaling-stroke" className="bolt-anim" style={{ animation: `boltPulse 4s ease-in-out ${k * 0.5}s infinite` }} />;
        })}
      </g>
    </g>
  );
  const cube = (x: number, y: number) => {
    const cw = 16, ch = 8, ct = 16;
    return (
      <g key={`${x}-${y}`}>
        <polygon points={`${x - cw},${y} ${x},${y + ch} ${x},${y + ch + ct} ${x - cw},${y + ct}`} fill="#3B82F6" fillOpacity={0.35} stroke="#3B82F6" />
        <polygon points={`${x},${y + ch} ${x + cw},${y} ${x + cw},${y + ct} ${x},${y + ch + ct}`} fill="#3B82F6" fillOpacity={0.55} stroke="#3B82F6" />
        <polygon points={`${x},${y - ch} ${x + cw},${y} ${x},${y + ch} ${x - cw},${y}`} fill="#93C5FD" fillOpacity={0.7} stroke="#3B82F6" />
      </g>
    );
  };
  const layers: { id: HeroLayer; y: number; dy: number; title: string; sub: string; color: string; action: string }[] = [
    { id: "apps", y: 62, dy: -22, title: "Applications", sub: "Built by the business", color: "#60A5FA", action: "Open Solutions" },
    { id: "bolt", y: 126, dy: 0, title: "Bolt Platform", sub: "Build fast with AI", color: "#22D3EE", action: "See how it works" },
    { id: "data", y: 190, dy: 20, title: "Data Platform", sub: "Governed data", color: "#34D399", action: "Open Data Platform" },
  ];
  const interactive = !!onLayer;
  const layerProps = (l: (typeof layers)[number]) => interactive ? {
    role: "button" as const, tabIndex: 0, "aria-label": `${l.title}: ${l.action}`,
    onClick: () => onLayer && onLayer(l.id),
    onKeyDown: (e: React.KeyboardEvent<SVGGElement>) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (onLayer) onLayer(l.id); } },
    onFocus: () => setFocusLayer(l.id), onBlur: () => setFocusLayer(null),
    style: { cursor: "pointer", outline: "none", transform: `translateY(${exploded ? l.dy : 0}px)`, transition: "transform 0.55s cubic-bezier(.2,.7,.2,1)" } as React.CSSProperties,
  } : { style: { transform: `translateY(${exploded ? l.dy : 0}px)`, transition: "transform 0.55s cubic-bezier(.2,.7,.2,1)" } as React.CSSProperties };
  const lit = (id: HeroLayer) => focusLayer === id || litLayer === id;
  return (
    <svg role={interactive ? "group" : "img"} aria-label="Applications built on the Bolt platform, which runs on the Data Platform" viewBox="0 -20 370 290" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ width: "100%", maxWidth, height: "auto", display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id="boltHeroGlow" cx="35%" cy="55%" r="55%">
          <stop offset="0%" stopColor={BOLT_COLOR} stopOpacity={0.28} />
          <stop offset="100%" stopColor={BOLT_COLOR} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse className="bolt-anim" cx={112} cy={140} rx={108} ry={100} fill="url(#boltHeroGlow)" style={{ animation: "boltGlow 5s ease-in-out infinite" }} />
      {[layers[2], layers[1], layers[0]].map((l) => (
        <g key={l.id} {...layerProps(l)}>
          {l.id === "apps" ? (
            <g className="bolt-anim" style={{ animation: exploded ? undefined : "boltFloat 4s ease-in-out infinite" }}>
              {cube(80, 54)}{cube(112, 40)}{cube(144, 54)}{cube(112, 68)}
            </g>
          ) : l.id === "bolt" ? boltSlab(l.y, lit("bolt")) : dataSlab(l.y, lit("data"))}
          <line x1={cx + w + 4} y1={l.y} x2={212} y2={l.y} stroke={l.color} strokeOpacity={exploded ? 0.9 : 0.5} strokeDasharray="3 3" />
          <text x={218} y={l.y - 2} fontSize={14} fontWeight={700} fill="#FFFFFF" fontFamily="DM Sans, sans-serif">{l.title}</text>
          <text x={218} y={l.y + 15} fontSize={12} fill={exploded && interactive ? l.color : "#B8C8DA"} fontFamily="DM Sans, sans-serif">{exploded && interactive ? l.action + " →" : l.sub}</text>
        </g>
      ))}
      {motionOk && (
        <g aria-hidden="true" style={{ pointerEvents: "none", filter: `drop-shadow(0 0 4px ${BOLT_COLOR})` }}>
          {[-34, 18, -10, 30, -22, 6, 40, -40].map((dx, i) => (
            <circle key={i} cx={cx + dx} cy={212} r={i % 3 === 0 ? 3.6 : 2.7} fill="#34D399" opacity={0}>
              <animate attributeName="cy" values="196;126;46" keyTimes="0;0.5;1" dur="3.6s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur="3.6s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
              <animate attributeName="fill" values="#34D399;#2DD4BF;#93C5FD" keyTimes="0;0.5;1" dur="3.6s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      )}
    </svg>
  );
}

// Certification seal: one ring segment lights up per module explored
function BoltBuilderSeal({ visited }: { visited: number[] }) {
  const r = 54, c = 2 * Math.PI * r, seg = c / 4, gap = 10;
  const done = visited.length === 4;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", width: 140, height: 140 }}>
        <svg aria-hidden="true" viewBox="0 0 140 140" width={140} height={140} style={{ filter: done ? `drop-shadow(0 0 14px ${BOLT_COLOR}88)` : "none", transition: "filter 0.4s ease" }}>
          <circle cx={70} cy={70} r={64} fill="rgba(16,34,66,0.8)" stroke="rgba(184,200,218,0.18)" />
          <g transform="rotate(-90 70 70)">
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cx={70} cy={70} r={r} fill="none" stroke={visited.includes(i) ? BOLT_COLOR : "rgba(184,200,218,0.22)"} strokeWidth={7} strokeLinecap="round" strokeDasharray={`${seg - gap} ${c - (seg - gap)}`} strokeDashoffset={-(i * seg + gap / 2)} style={{ transition: "stroke 0.4s ease" }} />
            ))}
          </g>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <BoltGlyphIcon kind="bolt" size={30} color={done ? BOLT_COLOR : "#D0DAE6"} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: 1.2, color: done ? BOLT_COLOR : "#B8C8DA" }}>{"BUILDER"}</span>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 15, color: done ? BOLT_COLOR : "#B8C8DA", textAlign: "center", fontWeight: done ? 700 : 400 }} aria-live="polite">{done ? "Certified Full Stack Builder" : visited.length + " of 4 modules explored"}</p>
    </div>
  );
}

function BoltSealAuto() {
  const [visited, setVisited] = useState<number[]>([]);
  useEffect(() => {
    let i = 0;
    const id = window.setInterval(() => { i += 1; setVisited([0, 1, 2, 3].slice(0, i)); if (i >= 4) window.clearInterval(id); }, prefersReducedMotion() ? 10 : 550);
    return () => window.clearInterval(id);
  }, []);
  return <BoltBuilderSeal visited={visited} />;
}

// Drag-the-timeline: both paths on one 26-week axis. Phase lengths are midpoints of the stage timings in the full comparison.
type TlPhase = { name: string; from: number; to: number };
const TL_MAX = 26;
const BOLT_LIVE = 3.6;
const tlTrad: TlPhase[] = [
  { name: "Requirements", from: 0, to: 3.5 },
  { name: "Business Case", from: 3.5, to: 8.5 },
  { name: "Prototyping", from: 8.5, to: 13.5 },
  { name: "Build & Test", from: 13.5, to: 23 },
  { name: "Deploy", from: 23, to: 26 },
];
const tlBolt: TlPhase[] = [
  { name: "Build prototype", from: 0, to: 1.5 },
  { name: "Iterate", from: 1.5, to: 3 },
  { name: "AI + Engineer Review", from: 3, to: 3.4 },
  { name: "Bolt Deploy", from: 3.4, to: BOLT_LIVE },
  { name: "In production", from: BOLT_LIVE, to: TL_MAX },
];
const tlPhaseName = (phases: TlPhase[], w: number) => (phases.find((p) => w < p.to) || phases[phases.length - 1]).name;
const MONO = "'JetBrains Mono', monospace";

function BoltTimeBar({ big = false }: { big?: boolean }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.4);
  const [week, setWeek] = useState(0);
  const [manual, setManual] = useState(false);
  const [sweep, setSweep] = useState(0);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!inView || manual) return;
    if (prefersReducedMotion()) { setWeek(TL_MAX); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const x = Math.min(1, (now - start) / 4200);
      setWeek((x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2) * TL_MAX);
      if (x < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, manual, sweep]);
  const replay = () => { setManual(false); setWeek(0); setSweep((s) => s + 1); };

  const wk = week <= 0 ? 0 : Math.ceil(week - 0.01);
  const tradLive = week >= TL_MAX - 0.01;
  const boltLive = week >= BOLT_LIVE;
  const boltWeeks = Math.floor(week - BOLT_LIVE);
  const tradStatus = week <= 0 ? "Not started" : tradLive ? "Live in production" : tlPhaseName(tlTrad, week);
  const boltStatus = week <= 0 ? "Not started" : !boltLive ? tlPhaseName(tlBolt, week) : boltWeeks < 1 ? "Live in production" : `Live · ${boltWeeks} week${boltWeeks === 1 ? "" : "s"} in production`;
  const H = big ? 30 : 24;
  const pct = (w: number) => `${(w / TL_MAX) * 100}%`;

  const lane = (phases: TlPhase[], color: string, status: string, live: boolean) => (
    <div style={{ height: H + 32 }}>
      <div style={{ position: "relative", height: H }}>
        {phases.map((p, i) => {
          const fill = Math.max(0, Math.min(1, (week - p.from) / (p.to - p.from)));
          const widthPct = ((p.to - p.from) / TL_MAX) * 100;
          const prod = p.name === "In production";
          return (
            <div key={p.name} style={{ position: "absolute", top: 0, bottom: 0, left: `calc(${pct(p.from)} + 1px)`, width: `calc(${widthPct}% - 2px)`, borderRadius: 5, background: "rgba(184,200,218,0.07)", border: "1px solid rgba(184,200,218,0.14)", overflow: "hidden", boxSizing: "border-box" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: prod ? `repeating-linear-gradient(135deg, ${color}66 0 8px, ${color}33 8px 16px)` : color, opacity: prod ? 1 : i % 2 ? 0.72 : 0.95 }} />
              {widthPct > 9 && <span style={{ position: "relative", display: "block", padding: "0 8px", lineHeight: `${H - 2}px`, fontSize: big ? 14 : 12.5, fontWeight: 600, color: prod ? "#E2EAF2" : fill > 0.45 ? "#0B1A33" : "#B8C8DA", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</span>}
            </div>
          );
        })}
      </div>
      <p style={{ margin: "7px 0 0", fontSize: big ? 16 : 14.5, fontWeight: live ? 700 : 500, color: live ? color : "#D0DAE6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{status}</p>
    </div>
  );

  return (
    <div ref={ref} style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
          <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: big ? 34 : 26, fontWeight: 700, color: "#FFFFFF", fontVariantNumeric: "tabular-nums", minWidth: big ? 170 : 128 }}>{"Week " + wk}</span>
          <span style={{ fontSize: big ? 17 : 15, color: "#B8C8DA" }}>Drag the timeline to compare</span>
        </div>
        <button type="button" onClick={replay} style={{ background: "transparent", border: "1px solid rgba(184,200,218,0.35)", borderRadius: 8, cursor: "pointer", color: "#D0DAE6", fontSize: 14, fontWeight: 600, fontFamily: "inherit", padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24"><path d="M7 4v16l13-8L7 4Z" fill="currentColor" /></svg>
          Play
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(88px, 140px) minmax(0, 1fr)", gap: "0 16px" }}>
        <div aria-hidden="true">
          {([["Traditional", "#FFFFFF"], ["With Bolt", BOLT_COLOR]] as const).map(([label, color]) => (
            <div key={label} style={{ height: H + 32, lineHeight: `${H}px`, fontSize: big ? 19 : 17, fontWeight: 600, color }}>{label}</div>
          ))}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ position: "relative", borderRadius: 6, outline: focused ? "3px solid #FFFFFF" : "none", outlineOffset: 8 }}>
            <div aria-hidden="true">
              {lane(tlTrad, "#B8C8DA", tradStatus, tradLive)}
              {lane(tlBolt, BOLT_COLOR, boltStatus, boltLive)}
            </div>
            <div aria-hidden="true" style={{ position: "absolute", top: -8, height: 2 * H + 32 + 16, left: pct(week), width: 2, marginLeft: -1, background: "#FFFFFF", boxShadow: "0 0 10px rgba(255,255,255,0.55)", pointerEvents: "none" }}>
              <span style={{ position: "absolute", top: -10, left: -9, width: 20, height: 20, boxSizing: "border-box", borderRadius: "50%", background: BOLT_COLOR, border: "3px solid #FFFFFF", boxShadow: `0 0 16px ${BOLT_COLOR}` }} />
            </div>
            <input
              type="range" className="bolt-range" min={0} max={TL_MAX} step={0.5}
              value={Math.round(week * 2) / 2}
              onChange={(ev) => { setManual(true); setWeek(Number(ev.target.value)); }}
              onFocus={(ev) => setFocused(ev.currentTarget.matches(":focus-visible"))} onBlur={() => setFocused(false)}
              aria-label="Weeks since kickoff"
              aria-valuetext={`Week ${wk}. Traditional: ${tradStatus}. With Bolt: ${boltStatus}.`}
              style={{ position: "absolute", left: 0, right: 0, top: -14, width: "100%", height: `calc(100% + 14px)`, margin: 0, opacity: 0, cursor: "ew-resize" }}
            />
          </div>
          <div aria-hidden="true" style={{ position: "relative", height: 18, marginTop: 2 }}>
            {[0, 4, 8, 12, 16, 20, 26].map((w) => (
              <span key={w} style={{ position: "absolute", left: pct(w), transform: w === 0 ? "none" : w === TL_MAX ? "translateX(-100%)" : "translateX(-50%)", fontSize: 12, color: "#7F93AE", fontFamily: MONO, whiteSpace: "nowrap" }}>{w === TL_MAX ? "26 wk" : "" + w}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        <p className="bolt-anim" style={{ margin: 0, fontSize: big ? 18 : 16, fontWeight: 700, color: BOLT_COLOR, opacity: tradLive ? 1 : 0, transition: "opacity 0.5s ease" }}>{"Same 26 weeks: the Bolt app has been live for about 22 of them."}</p>
        <p style={{ margin: 0, fontSize: 13, color: "#7F93AE" }}>{"Illustrative: midpoints of the stage timings below"}</p>
      </div>
    </div>
  );
}

// Before/after split: drag the divider between today's handoff chain and the Bolt path
function BoltSplitCompare() {
  const [pos, setPos] = useState(50);
  const [anim, setAnim] = useState(false);
  const [focused, setFocused] = useState(false);
  const touched = useRef(false);
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.4);
  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    setAnim(true);
    const steps: [number, number][] = [[350, 68], [1150, 34], [1950, 50], [2700, -1]];
    const ids = steps.map(([ms, v]) => window.setTimeout(() => { if (v < 0) setAnim(false); else if (!touched.current) setPos(v); }, ms));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [inView]);
  const ease = "cubic-bezier(.4,0,.2,1)";
  const [trad, bolt] = boltProcessPaths;
  const stats = [
    [{ v: "~6 months", l: "idea to production" }, { v: "4+", l: "handoffs" }],
    [{ v: "2–4 weeks", l: "idea to production" }, { v: "1", l: "handoff" }],
  ];
  const pane = (isBolt: boolean) => {
    const path = isBolt ? bolt : trad;
    const color = isBolt ? BOLT_COLOR : "#B8C8DA";
    return (
      <div className="bolt-split-inner" style={{ width: "100%", minWidth: 340, flexShrink: 0, boxSizing: "border-box", padding: "clamp(18px, 2.5vw, 28px)" }}>
        <p style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color, margin: "0 0 6px" }}>{isBolt ? "With Bolt" : "Today"}</p>
        <h3 style={{ fontSize: 19, color: "#FFFFFF", margin: 0 }}>{path.title}</h3>
        <div style={{ display: "flex", gap: 28, margin: "14px 0 18px", flexWrap: "wrap" }}>
          {stats[isBolt ? 1 : 0].map((s) => (
            <div key={s.l}><div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1.1, letterSpacing: -0.4 }}>{s.v}</div><div style={{ fontSize: 14, color: "#B8C8DA", marginTop: 2 }}>{s.l}</div></div>
          ))}
        </div>
        <ol aria-label={path.title + " stages"} style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {path.steps.map((step, i) => {
            const handoff = i > 0 && (!isBolt || step.name === "AI + Engineer Review");
            return (
              <li key={step.name}>
                {i > 0 && (
                  <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: 10, height: 26, paddingLeft: 12 }}>
                    <span style={{ width: 2, alignSelf: "stretch", background: handoff ? "repeating-linear-gradient(#F59E0B 0 4px, transparent 4px 8px)" : color, opacity: handoff ? 1 : 0.7 }} />
                    {handoff && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: "#FBBF24", border: "1px solid rgba(245,158,11,0.5)", background: "rgba(245,158,11,0.12)", borderRadius: 5, padding: "1px 7px" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24"><path d="M4 8h14m-4-4 4 4-4 4M20 16H6m4-4-4 4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Handoff
                      </span>
                    )}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span aria-hidden="true" style={{ width: 26, height: 26, flexShrink: 0, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${color}`, color, fontSize: 13, fontWeight: 700, fontFamily: MONO }}>{i + 1}</span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 16, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.3 }}>{step.name}</span>
                    <span style={{ display: "block", fontSize: 14, color: "#B8C8DA", lineHeight: 1.35 }}>{step.owner}</span>
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  };
  return (
    <div ref={ref}>
      <div className="bolt-split" style={{ position: "relative", display: "flex", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(184,200,218,0.2)", outline: focused ? "3px solid #FFFFFF" : "none", outlineOffset: 3 }}>
        <div className="bolt-split-pane bolt-anim" style={{ width: `${pos}%`, overflow: "hidden", display: "flex", background: "linear-gradient(160deg, rgba(184,200,218,0.10), rgba(16,34,66,0.55))", transition: anim ? `width 0.7s ${ease}` : "none" }}>{pane(false)}</div>
        <div className="bolt-split-pane bolt-anim" style={{ width: `${100 - pos}%`, overflow: "hidden", display: "flex", justifyContent: "flex-end", background: "linear-gradient(160deg, rgba(45,212,191,0.06), rgba(45,212,191,0.16))", transition: anim ? `width 0.7s ${ease}` : "none" }}>{pane(true)}</div>
        <div className="bolt-split-handle bolt-anim" aria-hidden="true" style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 0, pointerEvents: "none", transition: anim ? `left 0.7s ${ease}` : "none" }}>
          <span style={{ position: "absolute", top: 0, bottom: 0, left: -1, width: 2, background: `linear-gradient(rgba(45,212,191,0.1), ${BOLT_COLOR}, rgba(45,212,191,0.1))` }} />
          <span style={{ position: "absolute", top: "50%", left: -23, width: 46, height: 46, marginTop: -23, boxSizing: "border-box", borderRadius: "50%", background: "#0B1A33", border: `2px solid ${BOLT_COLOR}`, boxShadow: `0 0 20px ${BOLT_COLOR}88`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24"><path d="m9 7-5 5 5 5m6-10 5 5-5 5" fill="none" stroke={BOLT_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>
        <input
          type="range" className="bolt-range bolt-split-input" min={18} max={82} step={1} value={pos}
          onChange={(ev) => { touched.current = true; setAnim(false); setPos(Number(ev.target.value)); }}
          onFocus={(ev) => setFocused(ev.currentTarget.matches(":focus-visible"))} onBlur={() => setFocused(false)}
          aria-label="Divider between traditional development and Bolt"
          aria-valuetext={`${pos}% traditional, ${100 - pos}% Bolt`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", margin: 0, opacity: 0, cursor: "ew-resize" }}
        />
      </div>
      <p className="bolt-split-hint" style={{ margin: "10px 0 0", textAlign: "center", fontSize: 14, color: "#7F93AE" }}>{"Drag the divider to compare"}</p>
    </div>
  );
}

// "Built live": a scripted Claude Code session, then the app it produced
const BUILD_PROMPT = "Build a dashboard that tracks payer denials across our oncology practices by payer and reason, with a CSV export for the billing team. Use the Bolt app template.";
const BUILD_LINES: { kind: "info" | "add" | "ok"; text: string }[] = [
  { kind: "info", text: "Reading CLAUDE.md and the Bolt app template" },
  { kind: "info", text: "Plan: 2 pages, 2 tables, 1 export" },
  { kind: "add", text: "supabase/migrations/001_denials.sql" },
  { kind: "add", text: "src/app/denials/page.tsx" },
  { kind: "add", text: "src/components/DenialsByPayer.tsx" },
  { kind: "add", text: "src/app/api/export/route.ts" },
  { kind: "info", text: "Adding row-level security policies" },
  { kind: "ok", text: "Build passed · 14 tests passed" },
  { kind: "ok", text: "Pull request opened for Bolt review" },
];
const CHAR_MS = 20;
const TYPE_END = BUILD_PROMPT.length * CHAR_MS;
const buildLineAt = (i: number) => TYPE_END + 450 + i * 430;
const BUILD_DONE = buildLineAt(BUILD_LINES.length - 1) + 600;
const BUILD_END = BUILD_DONE + 2000;
const sampleDenials = [{ payer: "Payer A", n: 42 }, { payer: "Payer B", n: 31 }, { payer: "Payer C", n: 24 }, { payer: "Payer D", n: 18 }, { payer: "Other", n: 13 }];

function BoltLiveBuild({ autoStart = false, big = false, onShip }: { autoStart?: boolean; big?: boolean; onShip?: () => void }) {
  const [e, setE] = useState(0);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (!autoStart) return;
    const id = window.setTimeout(() => setRun((r) => r + 1), 600);
    return () => window.clearTimeout(id);
  }, [autoStart]);
  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) { setE(BUILD_END); return; }
    setE(0);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => { const v = now - start; setE(v); if (v < BUILD_END) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run]);
  const started = run > 0;
  const typing = started && e < TYPE_END;
  const typed = BUILD_PROMPT.slice(0, Math.min(BUILD_PROMPT.length, Math.floor(e / CHAR_MS)));
  const shown = started ? BUILD_LINES.filter((_, i) => e >= buildLineAt(i)) : [];
  const done = started && e >= BUILD_DONE;
  const fs = big ? 1.12 : 1;
  const paneMin = big ? 380 : 340;

  return (
    <Card style={{ padding: big ? "26px 30px" : "clamp(16px, 2.5vw, 24px)" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h3 style={{ margin: 0, fontSize: 20 * fs, color: "#FFFFFF" }}>Build an app</h3>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#93C5FD", border: "1px solid rgba(147,197,253,0.4)", borderRadius: 5, padding: "2px 8px" }}>{"Illustrative · sped up"}</span>
        </div>
        <div style={{ minHeight: 44, display: "flex", alignItems: "center" }}>
          {(!started || done) && <BoltButton onClick={() => setRun((r) => r + 1)} style={started ? { background: "transparent" } : { background: BOLT_COLOR, color: "#0B1A33", borderColor: BOLT_COLOR }}><span>{started ? "Replay" : "Start building"}</span>{!started && <BoltIcon kind="arrow" />}</BoltButton>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))", gap: 16 }}>
        <div style={{ background: "#050D1C", border: "1px solid rgba(184,200,218,0.18)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: paneMin }}>
          <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 14px", borderBottom: "1px solid rgba(184,200,218,0.12)", background: "rgba(16,34,66,0.7)" }}>
            {["#F87171", "#FBBF24", "#34D399"].map((c) => <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.8 }} />)}
            <span style={{ marginLeft: 8, fontFamily: MONO, fontSize: 12.5, color: "#7F93AE" }}>{"claude · denials-tracker"}</span>
          </div>
          <div style={{ padding: "16px 18px", fontFamily: MONO, fontSize: 13.5 * fs, lineHeight: 1.7, color: "#D0DAE6", flex: 1 }}>
            {!started ? (
              <p style={{ margin: 0, color: "#7F93AE" }}>{"Press Start building to watch a business owner build with Claude Code."}</p>
            ) : (
              <>
                <p style={{ margin: "0 0 12px", color: "#FFFFFF", fontWeight: 500 }}>
                  <span style={{ color: BOLT_COLOR, fontWeight: 700 }}>{"> "}</span>{typed}
                  {typing && <span className="bolt-anim" style={{ display: "inline-block", width: 8, height: "1.05em", verticalAlign: "text-bottom", background: BOLT_COLOR, marginLeft: 2, animation: "boltBlink 1s steps(1) infinite" }} />}
                </p>
                {shown.map((l, i) => {
                  const latest = i === shown.length - 1 && !done;
                  return (
                    <div key={l.text} className="bolt-anim" style={{ display: "flex", gap: 10, alignItems: "flex-start", animation: "boltIn 0.35s ease-out both" }}>
                      <span aria-hidden="true" style={{ width: 16, flexShrink: 0, display: "inline-flex", justifyContent: "center", paddingTop: 5 }}>
                        {l.kind === "ok" ? (
                          <svg width="14" height="14" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke={BOLT_COLOR} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        ) : l.kind === "add" ? (
                          <svg width="12" height="12" viewBox="0 0 24 24"><path d="M12 4v16M4 12h16" fill="none" stroke="#86EFAC" strokeWidth="3" strokeLinecap="round" /></svg>
                        ) : (
                          <span className="bolt-anim" style={{ width: 8, height: 8, marginTop: 3, borderRadius: "50%", background: latest ? BOLT_COLOR : "#7F93AE", animation: latest ? "boltPulse 0.9s ease-in-out infinite" : undefined }} />
                        )}
                      </span>
                      <span style={{ color: l.kind === "add" ? "#86EFAC" : l.kind === "ok" ? BOLT_COLOR : "#D0DAE6", fontWeight: l.kind === "ok" ? 700 : 400, wordBreak: "break-word" }}>{l.kind === "add" ? "Created " + l.text : l.text}</span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        <div style={{ minHeight: paneMin, display: "flex" }}>
          {!done ? (
            <div style={{ flex: 1, borderRadius: 12, border: "1.5px dashed rgba(184,200,218,0.28)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "#7F93AE", textAlign: "center", padding: 20 }}>
              <span className="bolt-anim" style={{ display: "inline-flex", animation: started ? "boltPulse 1.4s ease-in-out infinite" : undefined }}><BoltGlyphIcon kind="app" size={36} color={started ? BOLT_COLOR : "#7F93AE"} /></span>
              <span style={{ fontSize: 15 * fs }}>{started ? "Building the app..." : "The app appears here when the build finishes"}</span>
            </div>
          ) : (
            <div className="bolt-anim" style={{ flex: 1, borderRadius: 12, overflow: "hidden", background: "#F8FAFC", color: "#0F172A", boxShadow: `0 0 0 1px rgba(45,212,191,0.5), 0 18px 48px rgba(0,0,0,0.35)`, animation: "boltFlip 0.7s ease-out both" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 16px", background: "#0F2A52", color: "#FFFFFF" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15 * fs, fontWeight: 700 }}><BoltGlyphIcon kind="app" size={18} color="#93C5FD" />Payer Denials</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: "#0F2A52", background: "#FDE68A", borderRadius: 4, padding: "2px 7px" }}>Sample data</span>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, marginBottom: 16 }}>
                  {[{ l: "Open denials", v: "128" }, { l: "Top payer", v: "Payer A" }, { l: "Export", v: "CSV ready" }].map((tile, i) => (
                    <div key={tile.l} className="bolt-anim" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 8, padding: "10px 12px", animation: `boltIn 0.4s ease-out ${0.35 + i * 0.1}s both` }}>
                      <div style={{ fontSize: 12, color: "#64748B" }}>{tile.l}</div>
                      <div style={{ fontSize: 18 * fs, fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tile.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 8 }}>Denials by payer</div>
                <div style={{ display: "grid", gap: 7 }}>
                  {sampleDenials.map((d, i) => (
                    <div key={d.payer} style={{ display: "grid", gridTemplateColumns: "64px 1fr 30px", alignItems: "center", gap: 8, fontSize: 13 }}>
                      <span style={{ color: "#475569" }}>{d.payer}</span>
                      <span style={{ height: 12, borderRadius: 3, background: "#E2E8F0", overflow: "hidden" }}>
                        <span className="bolt-anim" style={{ display: "block", height: "100%", width: `${(d.n / 42) * 100}%`, background: i === 0 ? "#2563EB" : "#60A5FA", transformOrigin: "left center", animation: `boltGrowX 0.7s cubic-bezier(.2,.7,.2,1) ${0.6 + i * 0.09}s both` }} />
                      </span>
                      <span style={{ color: "#0F172A", fontWeight: 600, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{d.n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 16, minHeight: 44 }}>
        <p aria-live="polite" style={{ margin: 0, fontSize: 15 * fs, color: done ? BOLT_COLOR : "#D0DAE6", fontWeight: done ? 700 : 400 }}>
          {done ? "Built and in review. A plain-English request became a working app and a pull request." : started ? "Claude Code is building from a plain-English request" : "One request in plain English. Claude Code does the build."}
        </p>
        {done && onShip && (
          <BoltButton onClick={onShip} className="bolt-anim" style={{ background: BOLT_COLOR, color: "#0B1A33", borderColor: BOLT_COLOR, animation: "boltPop 0.45s ease-out both" }}><span>Ship this app</span><BoltIcon kind="arrow" /></BoltButton>
        )}
      </div>
    </Card>
  );
}

// ---- Proof: real growth and snapshot figures from the Bolt briefing (as of Sep 22, 2026) ----
const proofMilestones: { day: string; date: string; title: string; detail: string; burst?: boolean; now?: boolean }[] = [
  { day: "Day 0", date: "Apr 12", title: "Platform born", detail: "Contracts · shell · core services" },
  { day: "Day 36", date: "May 18", title: "Meridian", detail: "2nd business domain" },
  { day: "Day 66", date: "Jun 17", title: "Infrastructure", detail: "Terraform IaC formalized" },
  { day: "Day 94", date: "Jul 15", title: "Nova", detail: "3rd business domain" },
  { day: "Days 119–127", date: "Aug 9–17", title: "SavingsIQ · RetentionIQ · " + PRACTICE_NAME, detail: "Three domains in nine days", burst: true },
  { day: "Day 163", date: "Sep 22", title: "9 applications", detail: "Production hardening", now: true },
];

function BoltProofTimeline({ big = false }: { big?: boolean }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.3);
  const n = proofMilestones.length;
  const dur = 2.8;
  const seg = dur / (n - 1) / 2;
  const at = (pos: number) => 0.2 + (pos / (n - 1)) * dur;
  const segStyle = (start: number): React.CSSProperties => ({ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, background: BOLT_COLOR, transformOrigin: "left center", transform: inView ? "scaleX(1)" : "scaleX(0)", transition: `transform ${seg}s linear ${start}s` });
  return (
    <div ref={ref} style={{ overflowX: "auto", paddingBottom: 4 }}>
      <ol aria-label="Bolt growth timeline, April to September 2026" style={{ listStyle: "none", margin: 0, padding: 0, minWidth: 760, display: "grid", gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {proofMilestones.map((m, i) => {
          const color = m.now ? "#F59E0B" : BOLT_COLOR;
          const lit = at(i);
          const dot = (size: number, key: string, delay: number) => (
            <span key={key} className="bolt-anim" style={{ width: size, height: size, boxSizing: "border-box", borderRadius: "50%", background: color, border: "3px solid #0B1A33", boxShadow: `0 0 0 2px ${color}, 0 0 14px ${color}88`, flexShrink: 0, ...(inView ? { animation: `boltPop 0.5s ease-out ${delay}s both${m.now ? `, boltFlash 1.4s ease-out ${delay + 0.5}s 3` : ""}` } : { opacity: 0 }) }} />
          );
          return (
            <li key={m.day} style={{ textAlign: "center", padding: "0 6px" }}>
              <p className="bolt-anim" style={{ margin: 0, fontFamily: MONO, fontSize: big ? 15 : 13, fontWeight: 700, letterSpacing: 0.4, color, whiteSpace: "nowrap", ...(inView ? { animation: `boltIn 0.4s ease-out ${lit}s both` } : { opacity: 0 }) }}>{m.day}</p>
              <p className="bolt-anim" style={{ margin: "2px 0 0", fontFamily: MONO, fontSize: big ? 14 : 12.5, color: "#B8C8DA", ...(inView ? { animation: `boltIn 0.4s ease-out ${lit}s both` } : { opacity: 0 }) }}>{m.date}</p>
              <div style={{ position: "relative", height: 28, margin: "10px 0 12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {i > 0 && <span aria-hidden="true" style={{ position: "absolute", left: 0, right: "50%", top: 12.5, height: 3, background: "rgba(184,200,218,0.15)", overflow: "hidden" }}><span className="bolt-anim" style={segStyle(at(i - 0.5))} /></span>}
                {i < n - 1 && <span aria-hidden="true" style={{ position: "absolute", left: "50%", right: 0, top: 12.5, height: 3, background: "rgba(184,200,218,0.15)", overflow: "hidden" }}><span className="bolt-anim" style={segStyle(lit)} /></span>}
                <span style={{ position: "relative", display: "inline-flex", gap: 6, alignItems: "center", background: "transparent" }}>
                  {m.burst ? [0, 1, 2].map((k) => dot(14, String(k), lit + k * 0.18)) : dot(m.now ? 24 : 18, "d", lit)}
                </span>
              </div>
              <p className="bolt-anim" style={{ margin: 0, fontSize: big ? 18 : 16, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3, ...(inView ? { animation: `boltIn 0.45s ease-out ${lit + 0.1}s both` } : { opacity: 0 }) }}>{m.title}</p>
              <p className="bolt-anim" style={{ margin: "4px 0 0", fontSize: big ? 15 : 14, color: "#B8C8DA", lineHeight: 1.4, ...(inView ? { animation: `boltIn 0.45s ease-out ${lit + 0.15}s both` } : { opacity: 0 }) }}>{m.detail}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function BoltSnapshot({ big = false, tilesOnly = false, cardsOnly = false }: { big?: boolean; tilesOnly?: boolean; cardsOnly?: boolean }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.25);
  const p = useCountUp(inView, 1700);
  const fmt = (v: number) => Math.round(v * p).toLocaleString("en-US");
  const tiles: { icon: BoltGlyph; shown: string; final: string; label: string }[] = [
    { icon: "app", shown: fmt(9), final: "9", label: "Applications" },
    { icon: "list", shown: fmt(74), final: "74", label: "Features" },
    { icon: "link", shown: fmt(392), final: "392", label: "API endpoints" },
    { icon: "code", shown: "~" + fmt(613) + "K", final: "~613K", label: "Lines of code" },
    { icon: "commit", shown: fmt(5279), final: "5,279", label: "Commits" },
  ];
  return (
    <div ref={ref}>
      {!cardsOnly && <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${big ? 180 : 160}px), 1fr))`, gap: 12 }}>
        {tiles.map((t) => (
          <li key={t.label} style={{ background: "rgba(16,34,66,0.6)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 12, padding: big ? "20px 22px" : "18px 20px" }}>
            <span aria-hidden="true" style={{ display: "inline-flex", width: 38, height: 38, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.35)" }}><BoltGlyphIcon kind={t.icon} size={19} /></span>
            <span style={srOnly}>{t.final + " " + t.label}</span>
            <p aria-hidden="true" style={{ margin: "12px 0 2px", fontSize: big ? 38 : 32, fontWeight: 700, letterSpacing: -0.6, color: "#FFFFFF", lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>{t.shown}</p>
            <p aria-hidden="true" style={{ margin: 0, fontSize: big ? 17 : 15, color: "#B8C8DA" }}>{t.label}</p>
          </li>
        ))}
      </ul>}
      {!tilesOnly && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: 12, marginTop: cardsOnly ? 0 : 12 }}>
          <div style={{ background: "rgba(16,34,66,0.6)", border: "1px solid rgba(184,200,218,0.2)", borderRadius: 12, padding: "22px 24px" }}>
            <p style={{ margin: 0, fontFamily: MONO, fontSize: 13, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: BOLT_COLOR }}>{"Contribution concentration"}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", marginTop: 10 }}>
              <span style={srOnly}>{"90% of platform and application delivery was produced by 3 engineers. 13 engineers contributed overall."}</span>
              <span aria-hidden="true" style={{ fontSize: 56, fontWeight: 700, color: "#F59E0B", letterSpacing: -1, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{Math.round(90 * p) + "%"}</span>
              <span aria-hidden="true" style={{ flex: "1 1 200px", fontSize: 16, color: "#E2EAF2", lineHeight: 1.5 }}>{"of platform and application delivery was produced by 3 engineers"}</span>
            </div>
            <div aria-hidden="true" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(184,200,218,0.16)", alignItems: "center" }}>
              {Array.from({ length: 13 }, (_, k) => (
                <span key={k} className="bolt-anim" style={{ display: "inline-flex", width: 30, height: 30, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: k < 3 ? "rgba(245,158,11,0.18)" : "rgba(184,200,218,0.06)", border: `1px solid ${k < 3 ? "#F59E0B" : "rgba(184,200,218,0.22)"}`, boxShadow: k < 3 && inView ? "0 0 12px rgba(245,158,11,0.45)" : "none", transition: `box-shadow 0.6s ease ${1.6 + k * 0.1}s`, ...(inView ? { animation: `boltPop 0.4s ease-out ${0.2 + k * 0.06}s both` } : { opacity: 0 }) }}>
                  <BoltGlyphIcon kind="person" size={16} color={k < 3 ? "#F59E0B" : "#7F93AE"} />
                </span>
              ))}
              <span style={{ marginLeft: 6, fontSize: 14, color: "#B8C8DA" }}>{"13 engineers contributed overall"}</span>
            </div>
          </div>
          <div style={{ background: "linear-gradient(160deg, rgba(45,212,191,0.10), rgba(16,34,66,0.7))", border: `1px solid ${BOLT_COLOR}55`, borderRadius: 12, padding: "22px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ margin: 0, fontFamily: MONO, fontSize: 13, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: BOLT_COLOR }}>{"The takeaway"}</p>
            <p style={{ margin: "10px 0 0", fontSize: 22, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3 }}>{"Bolt is no longer a prototype."}</p>
            <p style={{ margin: "8px 0 0", fontSize: 16, color: "#D0DAE6", lineHeight: 1.6 }}>{"A multi-application platform entering production hardening. As it scales, the priority shifts from creation to reliability."}</p>
          </div>
        </div>
      )}
      <p style={{ margin: "10px 0 0", fontSize: 13, color: "#7F93AE" }}>{"As of September 22, 2026 · ~1,008 merged pull requests"}</p>
    </div>
  );
}

// ---- The harness is the product ----
const harnessLayers = ["Architecture", "Frontend", "API", "Domain services", "Domain databases", "Security + RBAC", "Quality + V&V", "Logging + audit"];
const harnessProps: { label: string; icon: BoltGlyph }[] = [
  { label: "Consistent", icon: "check" },
  { label: "Secure", icon: "shield" },
  { label: "Observable", icon: "eye" },
  { label: "Repeatable", icon: "repeat" },
];

function BoltHarness({ hideIntro = false }: { hideIntro?: boolean }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.3);
  const arrow = (
    <span aria-hidden="true" className="bolt-harness-arrow" style={{ alignSelf: "center", display: "inline-flex", width: 30, height: 30, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.4)" }}>
      <svg className="bolt-anim" width="16" height="16" viewBox="0 0 24 24" style={{ animation: inView ? "boltPulse 1.6s ease-in-out infinite" : undefined }}><path d="M4 12h16m-6-6 6 6-6 6" fill="none" stroke={BOLT_COLOR} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );
  return (
    <div ref={ref}>
      <div style={hideIntro ? srOnly : { marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 20, color: "#FFFFFF" }}>The harness is the product</h3>
        <p style={{ margin: "6px 0 0", fontSize: 16, color: "#D0DAE6", lineHeight: 1.55, maxWidth: 820 }}>{"Every app inherits the same enterprise layers by default, so builders start from governed software, not a blank page."}</p>
      </div>
      <div className="bolt-harness" style={{ display: "grid", gridTemplateColumns: "minmax(120px, 0.75fr) auto minmax(0, 3.2fr) auto minmax(120px, 0.75fr)", gap: 12, alignItems: "stretch" }}>
        <div style={{ background: "#071226", border: "1px solid rgba(184,200,218,0.25)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center" }}>
          <span aria-hidden="true" style={{ display: "inline-flex", width: 46, height: 46, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: "rgba(45,212,191,0.18)" }}><BoltGlyphIcon kind="target" size={24} /></span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.25 }}>Human intent</span>
          <span style={{ fontSize: 13, color: "#B8C8DA", lineHeight: 1.35 }}>A request in plain English</span>
        </div>
        {arrow}
        <ul aria-label="Harness layers every app inherits" className="bolt-harness-grid" style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
          {harnessLayers.map((layer, i) => (
            <li key={layer} className="bolt-anim" style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: 58, padding: "8px 10px", borderRadius: 10, background: "rgba(45,212,191,0.07)", border: "1px solid rgba(45,212,191,0.25)", fontSize: 15, fontWeight: 600, color: "#E2EAF2", lineHeight: 1.3, ...(inView ? { animation: `boltIn 0.4s ease-out ${i * 0.06}s both, boltTileGlow 4.8s ease-in-out ${0.8 + i * 0.3}s infinite` } : { opacity: 0 }) }}>{layer}</li>
          ))}
        </ul>
        {arrow}
        <div style={{ background: "linear-gradient(160deg, rgba(245,158,11,0.28), rgba(245,158,11,0.12))", border: "1px solid rgba(245,158,11,0.6)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center" }}>
          <span aria-hidden="true" style={{ display: "inline-flex", width: 46, height: 46, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: "#0B1A33" }}><BoltGlyphIcon kind="box" size={24} color="#FBBF24" /></span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.25 }}>Enterprise software</span>
          <span style={{ fontSize: 13, color: "#FDE68A", lineHeight: 1.35 }}>Governed by default</span>
        </div>
      </div>
      <ul style={{ listStyle: "none", margin: "12px 0 0", padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))", gap: 10 }}>
        {harnessProps.map((prop, i) => (
          <li key={prop.label} className="bolt-anim" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, background: "rgba(16,34,66,0.6)", border: "1px solid rgba(184,200,218,0.2)", fontSize: 17, fontWeight: 700, color: "#FFFFFF", ...(inView ? { animation: `boltPop 0.45s ease-out ${0.7 + i * 0.12}s both` } : { opacity: 0 }) }}>
            <span aria-hidden="true" style={{ display: "inline-flex", width: 34, height: 34, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: "rgba(45,212,191,0.14)" }}><BoltGlyphIcon kind={prop.icon} size={18} /></span>
            {prop.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---- What comes next: extending intent beyond the application layer ----
const harnessToday = ["Architecture", "Frontend", "APIs", "Domain services", "Domain data", "Security + RBAC", "Quality", "Logging + audit"];
const harnessNext: { label: string; icon: BoltGlyph }[] = [
  { label: "Infrastructure", icon: "server" },
  { label: "Data platform", icon: "db" },
  { label: "SRE + observability", icon: "pulse" },
  { label: "Release automation", icon: "repeat" },
  { label: "Resilience + DR", icon: "shield" },
  { label: "Continuous controls", icon: "sliders" },
];
const intentStages = [
  { label: "Application intent", when: "Today", color: BOLT_COLOR },
  { label: "System intent", when: "Next", color: "#F59E0B" },
  { label: "Operational intent", when: "Future", color: "#93C5FD" },
];

function BoltNext({ big = false }: { big?: boolean }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.3);
  const fs = big ? 1.12 : 1;
  const chip = (text: string, color: string) => <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color, border: `1px solid ${color}88`, borderRadius: 5, padding: "2px 8px" }}>{text}</span>;
  return (
    <div ref={ref}>
      <div className="bolt-next" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1.15fr)", gap: 16, alignItems: "stretch" }}>
        <div style={{ background: "rgba(16,34,66,0.6)", border: "1px solid rgba(184,200,218,0.2)", borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 18 * fs, color: "#FFFFFF" }}>Harness layers today</h3>{chip("In use", BOLT_COLOR)}
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px 14px" }}>
            {harnessToday.map((layer) => (
              <li key={layer} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15 * fs, color: "#D0DAE6" }}>
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke={BOLT_COLOR} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>{layer}
              </li>
            ))}
          </ul>
        </div>
        <span aria-hidden="true" className="bolt-harness-arrow" style={{ alignSelf: "center", display: "inline-flex", width: 40, height: 40, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: "#071226", border: `1px solid ${BOLT_COLOR}88` }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M4 12h16m-6-6 6 6-6 6" fill="none" stroke={BOLT_COLOR} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <div style={{ background: "linear-gradient(160deg, rgba(45,212,191,0.10), #071226)", border: `1px solid ${BOLT_COLOR}55`, borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 18 * fs, color: "#FFFFFF" }}>Harness layers next</h3>{chip("Roadmap", "#FBBF24")}
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))", gap: 10 }}>
            {harnessNext.map((item, i) => (
              <li key={item.label} className="bolt-anim" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: "rgba(45,212,191,0.06)", border: "1px solid rgba(45,212,191,0.22)", fontSize: 16 * fs, fontWeight: 600, color: "#FFFFFF", ...(inView ? { animation: `boltRise 0.55s cubic-bezier(.2,.7,.2,1) ${0.3 + i * 0.15}s both` } : { opacity: 0 }) }}>
                <span aria-hidden="true" style={{ display: "inline-flex", width: 32, height: 32, flexShrink: 0, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: "rgba(45,212,191,0.18)" }}><BoltGlyphIcon kind={item.icon} size={17} /></span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ position: "relative", marginTop: 28, padding: "0 4%" }}>
        <div aria-hidden="true" style={{ position: "absolute", left: "19.3%", right: "19.3%", top: 11, height: 3, borderRadius: 2, background: "rgba(184,200,218,0.15)", overflow: "hidden" }}>
          <span className="bolt-anim" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "100%", background: `linear-gradient(90deg, ${BOLT_COLOR}, #F59E0B 50%, rgba(147,197,253,0.4))`, transformOrigin: "left center", transform: inView ? "scaleX(1)" : "scaleX(0)", transition: "transform 2.2s cubic-bezier(.4,0,.2,1) 1.2s" }} />
        </div>
        <ol aria-label="Progression of intent" style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", position: "relative" }}>
          {intentStages.map((s, i) => (
            <li key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
              <span aria-hidden="true" className="bolt-anim" style={{ width: 24, height: 24, boxSizing: "border-box", borderRadius: "50%", background: i === 2 ? "#0B1A33" : s.color, border: `3px solid ${i === 2 ? s.color : "#0B1A33"}`, boxShadow: `0 0 0 2px ${s.color}${i === 2 ? "55" : ""}, 0 0 14px ${s.color}66`, ...(inView ? { animation: `boltPop 0.45s ease-out ${1.2 + i * 1.0}s both` } : { opacity: 0 }) }} />
              <span style={{ fontSize: 16 * fs, fontWeight: 700, color: "#FFFFFF" }}>{s.label}</span>
              <span style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: s.color }}>{s.when}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// Certification track: seal + module cards. In presenter mode the seal fills itself.
function BoltBuilders({ autoFill = false }: { autoFill?: boolean }) {
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [visitedModules, setVisitedModules] = useState<number[]>([]);
  const idp = autoFill ? "p-" : "";
  useEffect(() => {
    if (!autoFill) return;
    let i = 0;
    const id = window.setInterval(() => { i += 1; setVisitedModules((v) => Array.from(new Set([...v, ...[0, 1, 2, 3].slice(0, i)]))); if (i >= 4) window.clearInterval(id); }, prefersReducedMotion() ? 10 : 550);
    return () => window.clearInterval(id);
  }, [autoFill]);
  return (
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ flex: "0 0 auto", margin: "0 auto", paddingTop: 4 }}><BoltBuilderSeal visited={visitedModules} /></div>
        <ol style={{ flex: "1 1 600px", listStyle: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 185px), 1fr))", gap: 12, margin: 0, padding: 0, alignItems: "start" }}>
          {boltCertModules.map((module, index) => {
            const expanded = activeModule === index;
            return (
              <li key={module.id} style={{ background: "rgba(16,34,66,0.6)", border: `1px solid ${expanded ? BOLT_COLOR : "rgba(184,200,218,0.3)"}`, borderRadius: 10 }}>
                <BoltButton id={`${idp}bolt-module-${module.id}`} aria-expanded={expanded} aria-controls={`${idp}bolt-module-${module.id}-skills`} onClick={() => { setActiveModule(expanded ? null : index); setVisitedModules((v) => v.includes(index) ? v : [...v, index]); }} style={{ width: "100%", minHeight: 174, border: "none", padding: 20, background: expanded ? "rgba(45,212,191,0.08)" : "transparent", display: "flex", flexDirection: "column", alignItems: "stretch", gap: 12 }}>
                  <span style={{ color: BOLT_COLOR, fontSize: 24, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>{"0" + (index + 1)}</span>
                  <span style={{ fontSize: 18, color: "#FFFFFF", flex: 1 }}>{module.title}</span>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#B8C8DA", fontSize: 16, fontWeight: 400 }}><span>{(expanded ? "Hide " : "View ") + module.skills.length + " skills"}</span><BoltIcon expanded={expanded} /></span>
                </BoltButton>
                <div id={`${idp}bolt-module-${module.id}-skills`} role="region" aria-labelledby={`${idp}bolt-module-${module.id}`} hidden={!expanded} style={{ padding: "0 20px 20px" }}><ul style={{ borderTop: "1px solid rgba(184,200,218,0.2)", padding: "16px 0 0 18px", margin: 0, display: "grid", gap: 12 }}>{module.skills.map((skill) => <li key={skill} style={{ fontSize: 16, lineHeight: 1.5, color: "#E2EAF2" }}>{skill}</li>)}</ul></div>
              </li>
            );
          })}
        </ol>
        </div>
  );
}

function BoltPresenter({ onExit, onNavigate, deck = "bolt" }: { onExit: () => void; onNavigate: Navigate; deck?: "bolt" | "data" }) {
  const [scene, setScene] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [mouse, setMouse] = useState({ x: -999, y: -999 });
  const [origin, setOrigin] = useState("50% 50%");
  const mouseRef = useRef({ x: -999, y: -999 });
  const liveRef = useRef({ spot: false, zoom: false });
  liveRef.current = { spot, zoom };
  const originFor = (x: number, y: number) => {
    const outer = stageRef.current, inner = zoomRef.current;
    if (!outer || !inner) return "50% 50%";
    const r = outer.getBoundingClientRect();
    return `${x - r.left + outer.scrollLeft - inner.offsetLeft}px ${y - r.top + outer.scrollTop - inner.offsetTop}px`;
  };
  const onMove = (ev: React.MouseEvent) => {
    mouseRef.current = { x: ev.clientX, y: ev.clientY };
    if (liveRef.current.spot) setMouse({ x: ev.clientX, y: ev.clientY });
    if (liveRef.current.zoom) setOrigin(originFor(ev.clientX, ev.clientY));
  };
  const rise = (delay: number): React.CSSProperties => ({ animation: `boltRise 0.7s cubic-bezier(.2,.7,.2,1) ${delay}s both` });
  const eyebrow = (text: string) => <p className="bolt-anim" style={{ ...rise(0), fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 600, letterSpacing: 1.6, textTransform: "uppercase", color: BOLT_COLOR, margin: "0 0 14px" }}>{text}</p>;
  const title = (text: string) => <h2 className="bolt-anim" style={{ ...rise(0.08), fontSize: "clamp(36px, 4.6vw, 60px)", lineHeight: 1.1, letterSpacing: -1, color: "#FFFFFF", margin: "0 0 32px" }}>{text}</h2>;
  const boltScenes: { id: string; render: () => React.ReactNode }[] = [
    { id: "title", render: () => (
      <div style={{ display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 520px" }}>
          {eyebrow("Glide Platform · Application layer")}
          <h2 className="bolt-anim" style={{ ...rise(0.08), fontSize: "clamp(44px, 6vw, 80px)", lineHeight: 1.05, letterSpacing: -1.5, color: "#FFFFFF", margin: 0 }}>Build in weeks,<br />not months.</h2>
          <p className="bolt-anim" style={{ ...rise(0.2), fontSize: 24, lineHeight: 1.5, color: "#D0DAE6", margin: "24px 0 0", maxWidth: 620 }}>{"Business experts, product owners and engineers build with Claude Code and ship on McKesson’s governed AWS platform."}</p>
        </div>
        <div className="bolt-anim" style={{ ...rise(0.3), flex: "0 1 460px" }}><BoltHeroStack autoExplode maxWidth={460} /></div>
      </div>
    ) },
    { id: "speed", render: () => (
      <div>
        {eyebrow("01 · Why")}
        {title("From ~6 months to 2–4 weeks")}
        <div className="bolt-anim" style={rise(0.15)}><BoltKpis big /></div>
        <div className="bolt-anim" style={{ ...rise(0.3), marginTop: 36 }}><BoltTimeBar big /></div>
      </div>
    ) },
    { id: "handoffs", render: () => (
      <div>
        {eyebrow("01 · Why")}
        {title("Business expertise, fewer handoffs")}
        <div className="bolt-anim" style={rise(0.15)}><BoltSplitCompare /></div>
      </div>
    ) },
    { id: "proof", render: () => (
      <div>
        {eyebrow("02 · Proof")}
        {title("Nine applications in under 6 months")}
        <div className="bolt-anim" style={rise(0.15)}><BoltProofTimeline big /></div>
        <div className="bolt-anim" style={{ ...rise(0.3), marginTop: 28 }}><BoltSnapshot big tilesOnly /></div>
      </div>
    ) },
    { id: "team", render: () => (
      <div>
        {eyebrow("02 · Proof")}
        {title("Built by a concentrated core team")}
        <div className="bolt-anim" style={rise(0.15)}><BoltSnapshot big cardsOnly /></div>
      </div>
    ) },
    { id: "stack", render: () => (
      <div>
        {eyebrow("03 · How")}
        {title("Build. Review. Run on Bolt.")}
        <div className="bolt-anim" style={rise(0.15)}><BoltStackDiagram onNavigate={onNavigate} /></div>
      </div>
    ) },
    { id: "harness", render: () => (
      <div>
        {eyebrow("03 · How")}
        {title("The harness is the product")}
        <p className="bolt-anim" style={{ ...rise(0.12), fontSize: 22, lineHeight: 1.5, color: "#D0DAE6", margin: "-12px 0 28px", maxWidth: 900 }}>{"Every app inherits the same enterprise layers by default, so builders start from governed software, not a blank page."}</p>
        <div className="bolt-anim" style={rise(0.2)}><BoltHarness hideIntro /></div>
      </div>
    ) },
    { id: "build", render: () => (
      <div>
        {eyebrow("Live demo")}
        {title("Watch a business owner build")}
        <div className="bolt-anim" style={rise(0.15)}><BoltLiveBuild autoStart big onShip={() => setScene((v) => v + 1)} /></div>
      </div>
    ) },
    { id: "ship", render: () => (
      <div>
        {eyebrow("Live demo")}
        {title("Then ship it")}
        <div className="bolt-anim" style={rise(0.15)}><BoltShipDemo autoStart big /></div>
      </div>
    ) },
    { id: "who", render: () => (
      <div>
        {eyebrow("04 · Who")}
        <h2 className="bolt-anim" style={{ ...rise(0.08), fontSize: "clamp(32px, 3.6vw, 48px)", lineHeight: 1.1, letterSpacing: -0.8, color: "#FFFFFF", margin: "0 0 24px" }}>Choose the ownership. Bolt runs the platform.</h2>
        <div className="bolt-anim" style={rise(0.15)}><BoltEngagementMatrix compact /></div>
      </div>
    ) },
    { id: "builders", render: () => (
      <div>
        {eyebrow("05 · Builders")}
        {title("Four steps to Full Stack Builder certification")}
        <div className="bolt-anim" style={rise(0.15)}><BoltBuilders autoFill /></div>
      </div>
    ) },
    { id: "next", render: () => (
      <div>
        {eyebrow("06 · What's next")}
        {title("From code generation to a full operating model")}
        <div className="bolt-anim" style={rise(0.15)}><BoltNext big /></div>
      </div>
    ) },
    { id: "close", render: () => (
      <div style={{ textAlign: "center", maxWidth: 980, margin: "0 auto" }}>
        <div className="bolt-anim" style={{ ...rise(0), display: "inline-flex", marginBottom: 28 }}><BoltGlyphIcon kind="bolt" size={64} /></div>
        <h2 className="bolt-anim" style={{ ...rise(0.1), fontSize: "clamp(40px, 5.4vw, 72px)", lineHeight: 1.1, letterSpacing: -1.2, color: "#FFFFFF", margin: 0 }}>Domain experts build the tools.</h2>
        <p className="bolt-anim" style={{ ...rise(0.3), fontSize: 28, lineHeight: 1.5, color: BOLT_COLOR, margin: "24px 0 0" }}>Engineers own the platform, guardrails and review gate.</p>
      </div>
    ) },
  ];
  const dataScenes: { id: string; render: () => React.ReactNode }[] = [
    { id: "title", render: () => (
      <div style={{ display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 520px" }}>
          {eyebrow("Glide Platform · Data layer")}
          <h2 className="bolt-anim" style={{ ...rise(0.08), fontSize: "clamp(44px, 5.6vw, 76px)", lineHeight: 1.05, letterSpacing: -1.5, color: "#FFFFFF", margin: 0 }}>{"Enterprise data,"}<br />{"turned into capabilities."}</h2>
          <p className="bolt-anim" style={{ ...rise(0.2), fontSize: 24, lineHeight: 1.5, color: "#D0DAE6", margin: "24px 0 0", maxWidth: 640 }}>{"A governed foundation where data products, analytics and AI are built once, reused everywhere and inherit enterprise controls by default."}</p>
        </div>
        <div className="bolt-anim" style={{ ...rise(0.3), flex: "0 1 460px" }}><BoltHeroStack autoExplode litLayer="data" maxWidth={460} /></div>
      </div>
    ) },
    { id: "foundation", render: () => (
      <div>
        {eyebrow("Data Platform")}
        {title("Transforming enterprise data into business capabilities through intent")}
        <div className="bolt-anim" style={rise(0.15)}><DpHeroTiles big /></div>
      </div>
    ) },
    { id: "why", render: () => (<div>{eyebrow("01 · Why")}{title("Value trapped in silos")}<div className="bolt-anim" style={rise(0.15)}><DpRelayCompare /></div></div>) },
    { id: "domains", render: () => (<div>{eyebrow("02 · Domains")}{title("A connected enterprise data foundation")}<div className="bolt-anim" style={rise(0.15)}><DpDomainHub big /></div></div>) },
    { id: "reuse", render: () => (<div>{eyebrow("03 · Reuse")}{title("Build once, use everywhere")}<div className="bolt-anim" style={rise(0.15)}><DpReuse /></div></div>) },
    { id: "trust", render: () => (<div>{eyebrow("04 · Trust")}{title("Governance, compliance and legal by design")}<div className="bolt-anim" style={rise(0.15)}><DpTrust /></div></div>) },
    { id: "intent", render: () => (<div>{eyebrow("05 · Intent")}{title("One request, apps and data")}<div className="bolt-anim" style={rise(0.15)}><DpIntentDemo autoStart big /></div></div>) },
    { id: "flywheel", render: () => (<div>{eyebrow("06 · Flywheel")}{title("Value that compounds")}<div className="bolt-anim" style={rise(0.15)}><DpFlywheel /></div></div>) },
    { id: "close", render: () => (
      <div style={{ textAlign: "center", maxWidth: 1000, margin: "0 auto" }}>
        <div className="bolt-anim" style={{ ...rise(0), display: "inline-flex", marginBottom: 28 }}><BoltGlyphIcon kind="db" size={64} color={DP_COLOR} /></div>
        <h2 className="bolt-anim" style={{ ...rise(0.1), fontSize: "clamp(38px, 5vw, 66px)", lineHeight: 1.1, letterSpacing: -1.2, color: "#FFFFFF", margin: 0 }}>{"A connected, governed healthcare intelligence ecosystem."}</h2>
        <p className="bolt-anim" style={{ ...rise(0.3), fontSize: 28, lineHeight: 1.5, color: DP_COLOR, margin: "24px 0 0" }}>{"Ideas become applications, data products and AI through one experience."}</p>
      </div>
    ) },
  ];
  const scenes = deck === "data" ? dataScenes : boltScenes;
  const last = scenes.length - 1;
  useEffect(() => {
    boxRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    const onFs = () => { if (!document.fullscreenElement) onExit(); };
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("fullscreenchange", onFs);
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
    };
  }, [onExit]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); setScene((v) => Math.min(last, v + 1)); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); setScene((v) => Math.max(0, v - 1)); }
      else if (e.key === "Home") setScene(0);
      else if (e.key === "End") setScene(last);
      else if (e.key === "l" || e.key === "L") { if (!e.repeat) { setMouse(mouseRef.current); setSpot(true); } }
      else if (e.key === "z" || e.key === "Z") { if (!e.repeat) { setOrigin(originFor(mouseRef.current.x, mouseRef.current.y)); setZoom((z) => !z); } }
      else if (e.key === "Escape") { if (liveRef.current.zoom) setZoom(false); else onExit(); }
    };
    const onUp = (e: KeyboardEvent) => { if (e.key === "l" || e.key === "L") setSpot(false); };
    const onBlurWin = () => setSpot(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlurWin);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onUp); window.removeEventListener("blur", onBlurWin); };
  }, [last, onExit]);
  useEffect(() => { setZoom(false); }, [scene]);
  return (
    <div ref={boxRef} onMouseMove={onMove} role="dialog" aria-modal="true" aria-label={deck === "data" ? "Data Platform presentation" : "Bolt PaaS presentation"} tabIndex={-1} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "radial-gradient(ellipse at 70% 20%, #12305A 0%, #0B1A33 55%, #071021 100%)", color: "#E2EAF2", display: "flex", flexDirection: "column", outline: "none", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(184,200,218,0.14) 1px, transparent 1.2px)", backgroundSize: "26px 26px", WebkitMaskImage: "radial-gradient(ellipse at 75% 25%, black 0%, transparent 70%)", maskImage: "radial-gradient(ellipse at 75% 25%, black 0%, transparent 70%)" }} />
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 32px" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 16, fontWeight: 600, color: "#B8C8DA" }}><BoltGlyphIcon kind={deck === "data" ? "db" : "bolt"} size={20} color={deck === "data" ? DP_COLOR : BOLT_COLOR} />{deck === "data" ? "Data Platform" : "Bolt PaaS"}</span>
        <BoltButton onClick={onExit} aria-label="Exit presentation" style={{ background: "transparent", padding: "8px 12px" }}><span style={{ fontSize: 14, fontWeight: 500, color: "#B8C8DA" }}>Esc</span><BoltIcon kind="close" /></BoltButton>
      </div>
      <div ref={stageRef} style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", overflowY: zoom ? "hidden" : "auto", overflowX: "hidden" }}>
        <div ref={zoomRef} style={{ width: "100%", transform: zoom ? "scale(1.8)" : "none", transformOrigin: origin, transition: "transform 0.35s cubic-bezier(.2,.7,.2,1)" }}>
          <div key={scenes[scene].id} style={{ width: "100%", maxWidth: 1240, margin: "0 auto", padding: "8px 48px 32px", boxSizing: "border-box" }}>{scenes[scene].render()}</div>
        </div>
      </div>
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 1001, pointerEvents: "none", opacity: spot ? 1 : 0, transition: "opacity 0.2s ease", background: `radial-gradient(circle at ${mouse.x}px ${mouse.y}px, transparent 0, transparent 130px, rgba(2,6,16,0.86) 190px)` }} />
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px 24px", gap: 16 }}>
        <BoltButton onClick={() => setScene((v) => Math.max(0, v - 1))} disabled={scene === 0} aria-label="Previous scene" style={{ background: "transparent", opacity: scene === 0 ? 0.35 : 1, padding: "8px 12px" }}><span style={{ display: "inline-flex", transform: "rotate(180deg)" }}><BoltIcon kind="arrow" /></span></BoltButton>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {scenes.map((sc, i) => (
            <button key={sc.id} type="button" aria-label={`Go to scene ${i + 1}`} aria-current={i === scene ? "step" : undefined} onClick={() => setScene(i)} style={{ width: i === scene ? 30 : 10, height: 10, borderRadius: 5, border: "none", padding: 0, cursor: "pointer", background: i === scene ? BOLT_COLOR : "rgba(184,200,218,0.35)", transition: "width 0.3s ease, background 0.3s ease" }} />
          ))}
          <span style={{ marginLeft: 12, fontSize: 14, color: "#7F93AE", fontVariantNumeric: "tabular-nums" }}>{`${scene + 1} / ${scenes.length} · ← → navigate · hold L spotlight · Z zoom`}</span>
        </div>
        <BoltButton onClick={() => setScene((v) => Math.min(last, v + 1))} disabled={scene === last} aria-label="Next scene" style={{ background: "transparent", opacity: scene === last ? 0.35 : 1, padding: "8px 12px" }}><BoltIcon kind="arrow" /></BoltButton>
      </div>
    </div>
  );
}

const SectionTitle = ({ num, label, title, sub, color, icon }: { num: string; label: string; title: string; sub?: string; color: string; icon?: BoltGlyph }) => (
  <header style={{ marginBottom: 24, display: "flex", gap: 18, alignItems: "flex-start" }}>
    {icon && (
      <span aria-hidden="true" style={{ flexShrink: 0, width: 52, height: 52, borderRadius: 14, display: "inline-flex", alignItems: "center", justifyContent: "center", background: `${color}1A`, border: `1px solid ${color}59`, boxShadow: `0 0 24px ${color}1F` }}>
        <BoltGlyphIcon kind={icon} size={26} color={color} />
      </span>
    )}
    <div>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color, margin: "0 0 8px" }}>{num + " / " + label}</p>
      <h2 id={`bolt-${num}-title`} tabIndex={-1} style={{ fontSize: "clamp(26px, 3vw, 30px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.25, margin: 0 }}>{title}</h2>
      {sub && <p style={{ fontSize: 17, color: "#D0DAE6", margin: "10px 0 0", lineHeight: 1.6, maxWidth: 850 }}>{sub}</p>}
    </div>
  </header>
);

const boltSections = [
  { id: "why", label: "Why" },
  { id: "proof", label: "Proof" },
  { id: "how", label: "How" },
  { id: "who", label: "Roles" },
  { id: "builders", label: "Builders" },
  { id: "next", label: "Next" },
];

// Stable controls retain focus when their disclosure state changes.
function BoltButton({ children, style, onFocus, onBlur, onPointerEnter, onPointerLeave, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <button {...props} type="button"
      onFocus={(event) => { setFocused(true); onFocus?.(event); }}
      onBlur={(event) => { setFocused(false); onBlur?.(event); }}
      onPointerEnter={(event) => { setHovered(true); onPointerEnter?.(event); }}
      onPointerLeave={(event) => { setHovered(false); onPointerLeave?.(event); }}
      style={{ fontFamily: "inherit", fontSize: 16, fontWeight: 600, lineHeight: 1.45, color: "#E2EAF2", cursor: "pointer", minHeight: 44, background: "rgba(16,34,66,0.6)", border: "1px solid rgba(184,200,218,0.45)", borderRadius: 8, padding: "10px 14px", display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: 12, textAlign: "left", ...style, outline: focused ? "3px solid #FFFFFF" : "3px solid transparent", outlineOffset: 3, boxShadow: hovered ? `inset 0 0 0 1px ${BOLT_COLOR}` : style?.boxShadow }}>
      {children}
    </button>
  );
}

function BoltIcon({ kind = "chevron", expanded = false }: { kind?: "chevron" | "arrow" | "close" | "down"; expanded?: boolean }) {
  return (
    <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0, transform: kind === "chevron" && expanded ? "rotate(180deg)" : undefined }}>
      <path d={kind === "down" ? "M12 4v16m-6-6 6 6 6-6" : kind === "arrow" ? "M4 12h16m-6-6 6 6-6 6" : kind === "close" ? "m6 6 12 12M18 6 6 18" : "m6 9 6 6 6-6"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const boltProcessPaths = [
  { id: "traditional", title: "Traditional development", note: "4+ handoffs across teams", steps: [
    { name: "Requirements", owner: "Business to Product", time: "3–4 weeks" },
    { name: "Business Case", owner: "Investment approval", time: "4–6 weeks" },
    { name: "Prototyping", owner: "Product to Engineering", time: "4–6 weeks" },
    { name: "Build & Test", owner: "Engineering + QA", time: "8–12 weeks" },
    { name: "Deploy", owner: "Stabilization", time: "2–4 weeks" },
  ] },
  { id: "bolt", title: "Builder-led with Bolt", note: "Builder owns the work through review", steps: [
    { name: "Build Prototype", owner: "Builder + Claude Code", time: "1–2 weeks" },
    { name: "Iterate", owner: "Live user feedback", time: "1–2 weeks" },
    { name: "AI + Engineer Review", owner: "Production review gate", time: "2–3 days" },
    { name: "Bolt Deploy", owner: "Git to AWS", time: "1–2 days" },
  ] },
];

function BoltStackDiagram({ onNavigate }: { onNavigate: Navigate }) {
  const [activeTile, setActiveTile] = useState<string | null>(null);
  const renderTile = (id: string, name: string, panelId: string) => (
    <BoltButton key={id} id={`bolt-tile-${id}`} aria-expanded={activeTile === id} aria-controls={panelId} onClick={() => setActiveTile(activeTile === id ? null : id)} style={{ color: activeTile === id ? "#FFFFFF" : "#E2EAF2", borderColor: activeTile === id ? BOLT_COLOR : "rgba(184,200,218,0.45)", background: activeTile === id ? "rgba(45,212,191,0.12)" : "rgba(16,34,66,0.6)" }}>
      <span>{name}</span><BoltIcon expanded={activeTile === id} />
    </BoltButton>
  );
  return (
    <Card style={{ padding: "8px clamp(16px, 2.5vw, 24px) 20px" }}>
      <div style={{ position: "relative", paddingLeft: 30 }}>
      <div aria-hidden="true" style={{ position: "absolute", left: 9, top: 30, bottom: 30, width: 2, borderRadius: 1, background: `linear-gradient(#3B82F6, #F59E0B, ${BOLT_COLOR}, #10B981)`, opacity: 0.55 }}>
        <span className="bolt-anim" style={{ position: "absolute", left: -5, width: 12, height: 12, borderRadius: "50%", background: BOLT_COLOR, boxShadow: `0 0 12px ${BOLT_COLOR}`, animation: "boltFlow 3.6s ease-in-out infinite" }} />
      </div>
      {boltStack.map((layer, index) => {
        const selectedItem = layer.items.find((item, itemIndex) => activeTile === `${layer.id}-${itemIndex}`);
        const selectedIntel = layer.id === "run" ? intelligenceLayer.find((item) => activeTile === `intel-${item.id}`) : undefined;
        const selected = selectedItem || selectedIntel;
        const panelId = `bolt-stack-${layer.id}-detail`;
        return (
          <div key={layer.id} style={{ padding: "24px 0", borderBottom: "1px solid rgba(184,200,218,0.16)" }}>
            <div style={{ display: "flex", gap: "20px 28px", flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ flex: "0 1 225px", display: "flex", gap: 12 }}>
                <span aria-hidden="true" style={{ color: BOLT_COLOR, fontSize: 16, fontFamily: "'JetBrains Mono', monospace", paddingTop: 2 }}>{"0" + (index + 1)}</span>
                <div><h3 style={{ fontSize: 20, lineHeight: 1.3, color: "#FFFFFF", margin: 0 }}>{layer.step}</h3><p style={{ fontSize: 16, lineHeight: 1.5, color: "#B8C8DA", margin: "6px 0 0" }}>{layer.note}</p></div>
              </div>
              <div style={{ flex: "1 1 460px", minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{layer.items.map((item, itemIndex) => renderTile(`${layer.id}-${itemIndex}`, item.name, panelId))}</div>
                {layer.id === "run" && (
                  <div style={{ marginTop: 18 }}>
                    <p style={{ color: "#B8C8DA", fontSize: 15, margin: "0 0 8px" }}>Intelligence Services</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{intelligenceLayer.map((item) => renderTile(`intel-${item.id}`, item.title, panelId))}</div>
                  </div>
                )}
              </div>
            </div>
            <div id={panelId} hidden={!selected} role="region" aria-labelledby={selected ? `bolt-tile-${activeTile}` : undefined} style={{ marginTop: 18, borderLeft: `3px solid ${BOLT_COLOR}`, padding: "4px 0 4px 18px", color: "#E2EAF2", fontSize: 16, lineHeight: 1.6 }}>
              {selectedItem && <p style={{ margin: 0 }}>{selectedItem.desc}</p>}
              {selectedIntel && <><ul style={{ margin: 0, paddingLeft: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: "6px 28px" }}>{selectedIntel.capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul><p style={{ margin: "12px 0 0", color: "#B8C8DA" }}>{"Used by: " + selectedIntel.usedBy.join(", ")}</p></>}
            </div>
          </div>
        );
      })}
      <BoltButton onClick={() => onNavigate("dataplatform")} style={{ width: "100%", marginTop: 20, background: "rgba(45,212,191,0.08)", borderColor: BOLT_COLOR, color: BOLT_COLOR, padding: "16px 18px" }}>
        <span style={{ display: "flex", gap: "4px 16px", alignItems: "baseline", flexWrap: "wrap" }}><span style={{ color: "#FFFFFF", fontSize: 18 }}>Data Platform foundation</span><span style={{ fontWeight: 400, color: "#D0DAE6", fontSize: 16 }}>Eight governed data domains</span></span><BoltIcon kind="arrow" />
      </BoltButton>
      </div>
    </Card>
  );
}

// Where partner work hands off to Bolt, in role columns (shared counts as half)
const engBoundary = (cells: EngCell[]) => cells.reduce((n, c) => n + (c === "partner" ? 1 : c === "shared" ? 0.5 : 0), 0);

function BoltEngagementMatrix({ compact = false }: { compact?: boolean }) {
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [scrollFocused, setScrollFocused] = useState(false);
  const [hoverRole, setHoverRole] = useState<number | null>(null);
  const [revealRef, inView] = useInViewOnce<HTMLDivElement>(0.3);
  const [motionOk, setMotionOk] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const [geo, setGeo] = useState<{ w: number; h: number; rows: { top: number; bottom: number }[] } | null>(null);
  useEffect(() => { setMotionOk(!prefersReducedMotion()); }, []);
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      const wr = wrap.getBoundingClientRect();
      const rows = rowRefs.current.map((r) => {
        if (!r) return { top: 0, bottom: 0 };
        const b = r.getBoundingClientRect();
        return { top: b.top - wr.top, bottom: b.bottom - wr.top };
      });
      setGeo({ w: wr.width, h: wr.height, rows });
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(wrap);
    return () => ro?.disconnect();
  }, [activeModel]);
  const handoffPath = (() => {
    if (!geo || geo.rows.length !== boltEngagementModels.length) return "";
    const x = (k: number) => geo.w * (0.24 + 0.135 * k);
    const pts = boltEngagementModels.map((m) => x(engBoundary(m.cells)));
    let d = `M ${pts[0]} ${geo.rows[0].top + 6}`;
    pts.forEach((px, i) => {
      if (i > 0) d += ` M ${pts[i - 1]} ${geo.rows[i].top} H ${px}`;
      d += ` V ${i < pts.length - 1 ? geo.rows[i].bottom : geo.rows[i].bottom - 6}`;
    });
    return d;
  })();
  const flipIn = (delay: number): React.CSSProperties => inView ? { animation: `boltFlip 0.55s ease-out ${delay}s both` } : { opacity: 0 };
  const teamColor = (cell: EngCell) => cell === "bolt" ? "#3B82F6" : cell === "partner" ? "#F59E0B" : "rgba(184,200,218,0.5)";
  const toggleModel = (id: string) => setActiveModel((current) => current === id ? null : id);

  return (
    <div ref={revealRef} style={{ minWidth: 0, maxWidth: "100%", background: "rgba(16,34,66,0.5)", border: "1px solid rgba(184,200,218,0.16)", borderRadius: 16, overflow: "hidden" }}>
      <p id="bolt-engagement-help" style={compact ? srOnly : { margin: 0, padding: "20px 24px 8px", fontSize: 16, lineHeight: 1.5, color: "#B8C8DA" }}>
        Select a model for responsibilities. Scroll the table sideways on smaller screens.
      </p>
      <div
        role="region"
        aria-label="Engagement model responsibilities"
        aria-describedby="bolt-engagement-help"
        tabIndex={0}
        onFocus={(event) => { if (event.target === event.currentTarget) setScrollFocused(true); }}
        onBlur={() => setScrollFocused(false)}
        style={{ overflowX: "auto", maxWidth: "100%", padding: "0 16px", outline: scrollFocused ? `3px solid ${BOLT_COLOR}` : "none", outlineOffset: -3 }}
      >
        <div ref={wrapRef} style={{ position: "relative", minWidth: 960 }}>
        {handoffPath && (
          <svg aria-hidden="true" width={geo ? geo.w : 0} height={geo ? geo.h : 0} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", overflow: "visible", zIndex: 0 }}>
            <defs>
              <linearGradient id="boltHandoffGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="55%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
            <path d={handoffPath} fill="none" stroke="#F59E0B" strokeOpacity={0.18} strokeWidth={10} strokeLinejoin="round" pathLength={1} strokeDasharray="1" className="bolt-anim" style={{ strokeDashoffset: inView ? 0 : 1, transition: "stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1) 0.9s" }} />
            <path d={handoffPath} fill="none" stroke="url(#boltHandoffGrad)" strokeWidth={2.5} strokeLinejoin="round" pathLength={1} strokeDasharray="1" className="bolt-anim" style={{ strokeDashoffset: inView ? 0 : 1, transition: "stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1) 0.9s", filter: "drop-shadow(0 0 4px rgba(245,158,11,0.7))" }} />
            {motionOk && inView && (
              <circle r={5} fill="#FFFFFF" opacity={0} style={{ filter: `drop-shadow(0 0 6px ${BOLT_COLOR})` }}>
                <set attributeName="opacity" to="1" begin="2.8s" />
                <animateMotion dur="5s" begin="2.8s" repeatCount="indefinite" path={handoffPath} />
              </circle>
            )}
          </svg>
        )}
        <table style={{ position: "relative", zIndex: 1, width: "100%", tableLayout: "fixed", borderCollapse: "collapse", fontSize: 16, lineHeight: 1.45, textAlign: "left" }}>
          <caption style={compact ? srOnly : { textAlign: "left", color: "#E2EAF2", fontSize: 16, fontWeight: 600, padding: "12px 8px 16px" }}>Role ownership by engagement model</caption>
          <colgroup>
            <col style={{ width: "24%" }} />
            {boltEngagementRoles.map((role) => <col key={role} style={{ width: "13.5%" }} />)}
            <col style={{ width: "22%" }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" style={{ padding: "12px 8px", color: "#B8C8DA", fontWeight: 600, borderBottom: "1px solid rgba(184,200,218,0.24)" }}>Engagement model</th>
              {boltEngagementRoles.map((role, roleIndex) => <th key={role} scope="col" onMouseEnter={() => setHoverRole(roleIndex)} onMouseLeave={() => setHoverRole(null)} style={{ padding: "12px 8px", color: hoverRole === roleIndex ? "#FFFFFF" : "#B8C8DA", fontWeight: 600, textAlign: "center", borderBottom: "1px solid rgba(184,200,218,0.24)", verticalAlign: "bottom", background: hoverRole === roleIndex ? "rgba(45,212,191,0.07)" : "transparent", transition: "background 0.2s ease, color 0.2s ease" }}><span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}><span aria-hidden="true" className="bolt-anim" style={{ width: 40, height: 40, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(16,34,66,0.9)", border: `1px solid ${hoverRole === roleIndex ? BOLT_COLOR : "rgba(184,200,218,0.35)"}`, boxShadow: hoverRole === roleIndex ? `0 0 16px ${BOLT_COLOR}66` : "none", transform: hoverRole === roleIndex ? "translateY(-3px)" : "none", transition: "all 0.25s ease" }}><BoltGlyphIcon kind={(["briefcase", "code", "app", "server"] as BoltGlyph[])[roleIndex]} size={20} color="#D0DAE6" /></span><span style={{ display: "block", lineHeight: 1.35 }}>{role.split(" ").map((word) => <span key={word} style={{ display: "block" }}>{word}</span>)}</span></span></th>)}
              <th scope="col" style={{ padding: "12px 12px", color: "#B8C8DA", fontWeight: 600, borderBottom: "1px solid rgba(184,200,218,0.24)" }}>Examples</th>
            </tr>
          </thead>
          {boltEngagementModels.map((model, mi) => {
            const isActive = activeModel === model.id;
            const detailId = `bolt-engagement-detail-${model.id}`;
            const triggerId = `bolt-engagement-trigger-${model.id}`;
            return (
              <tbody key={model.id}>
                <tr ref={(el) => { rowRefs.current[mi] = el; }} onClick={() => toggleModel(model.id)} style={{ cursor: "pointer", background: isActive ? "rgba(45,212,191,0.08)" : "transparent", borderBottom: isActive ? "none" : "1px solid rgba(184,200,218,0.13)" }}>
                  <th scope="row" style={{ padding: "12px 4px", fontWeight: 600, textAlign: "left", verticalAlign: "middle" }}>
                    <BoltButton
                      id={triggerId}
                      type="button"
                      aria-expanded={isActive}
                      aria-controls={detailId}
                      onClick={(event) => { event.stopPropagation(); toggleModel(model.id); }}
                      style={{ width: "100%", padding: "10px 8px", borderColor: isActive ? BOLT_COLOR : "rgba(184,200,218,0.25)", background: "transparent", color: "#FFFFFF", textAlign: "left" }}
                    >
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                        <span style={{ display: "block", fontSize: 16, lineHeight: 1.35 }}>
                          {model.name}
                          {model.abbr && <span style={{ display: "block", marginTop: 4, color: "#B8C8DA", fontSize: 15, fontWeight: 400 }}>{model.abbr}</span>}
                        </span>
                        <BoltIcon kind="chevron" expanded={isActive} />
                      </span>
                    </BoltButton>
                  </th>
                  {model.cells.map((cell, index) => (
                    <td key={boltEngagementRoles[index]} onMouseEnter={() => setHoverRole(index)} onMouseLeave={() => setHoverRole(null)} style={{ padding: "16px 6px", textAlign: "center", verticalAlign: "middle", background: hoverRole === index ? "rgba(45,212,191,0.07)" : "transparent", transition: "background 0.2s ease" }}>
                      <span className="bolt-anim" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, minWidth: 76, boxSizing: "border-box", padding: "7px 9px", borderRadius: 7, background: cell === "bolt" ? "rgba(23,42,82,0.92)" : cell === "partner" ? "rgba(58,44,24,0.92)" : "rgba(40,54,78,0.92)", border: `1.5px solid ${teamColor(cell)}`, fontSize: 16, fontWeight: 700, color: ENG_STYLES[cell].text, boxShadow: hoverRole === index || isActive ? `0 0 14px ${teamColor(cell)}66` : "none", ...flipIn(0.15 + mi * 0.18 + index * 0.07) }}>
                        {cell === "shared" && <span aria-hidden="true" style={{ display: "inline-flex", width: 14, height: 14, borderRadius: 3, overflow: "hidden", flexShrink: 0 }}><span style={{ width: "50%", background: "#3B82F6" }} /><span style={{ width: "50%", background: "#F59E0B" }} /></span>}
                        {ENG_STYLES[cell].label}
                      </span>
                    </td>
                  ))}
                  <td style={{ padding: "16px 12px", color: "#D0DAE6", fontSize: 16, verticalAlign: "middle" }}>{model.examples.join(", ")}</td>
                </tr>
                <tr id={detailId} hidden={!isActive}>
                  <td colSpan={6} style={{ padding: "4px 12px 24px", background: "rgba(45,212,191,0.08)", borderBottom: "1px solid rgba(184,200,218,0.2)" }}>
                    <div role="region" aria-labelledby={triggerId} className="bolt-anim" style={{ padding: "16px 16px 0", borderTop: "1px solid rgba(45,212,191,0.28)", animation: isActive ? "boltIn 0.35s ease-out both" : undefined }}>
                      <p style={{ margin: "0 0 18px", fontSize: 17, lineHeight: 1.6, color: "#E2EAF2" }}>{model.desc}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                        {(["partner", "bolt"] as EngCell[]).map((side) => {
                          const roles = boltEngagementRoles.flatMap((role, index) => model.cells[index] === side ? [role] : model.cells[index] === "shared" ? [`${role} (shared)`] : []);
                          return (
                            <div key={side} style={{ flex: "1 1 260px", borderLeft: `3px solid ${teamColor(side)}`, paddingLeft: 16 }}>
                              <div style={{ color: "#FFFFFF", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{side === "bolt" ? "Bolt team provides" : "Partner team provides"}</div>
                              {roles.length === 0 ? <p style={{ margin: 0, fontSize: 16, color: "#D0DAE6" }}>Nothing. Bolt covers every role.</p> : <ul style={{ margin: 0, paddingLeft: 20, color: "#D0DAE6", fontSize: 16, lineHeight: 1.7 }}>{roles.map((role) => <li key={role}>{role}</li>)}</ul>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
        </div>
      </div>
      <p style={{ margin: 0, padding: "16px 24px 20px", color: "#B8C8DA", fontSize: 15, lineHeight: 1.6 }}>
        <strong style={{ color: "#E2EAF2" }}>Bolt</strong>{" = Bolt team provides · "}<strong style={{ color: "#E2EAF2" }}>Partner</strong>{" = Partner team provides · "}<strong style={{ color: "#E2EAF2" }}>Shared</strong>{" = both teams provide · "}<svg aria-hidden="true" width="26" height="10" style={{ verticalAlign: "middle", marginRight: 6 }}><path d="M1 5h24" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" /></svg><strong style={{ color: "#E2EAF2" }}>Handoff line</strong>{" = partner work to the left, Bolt to the right"}
      </p>
    </div>
  );
}


function BoltPaaSPage({ onNavigate }: { onNavigate: Navigate }) {
  const [showCompare, setShowCompare] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const [shipTrigger, setShipTrigger] = useState(0);
  const shipBuiltApp = () => {
    setShipTrigger((n) => n + 1);
    document.getElementById("bolt-ship-demo")?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
  };
  const exitPresenter = React.useCallback(() => setPresenting(false), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (presenting || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "p" || e.key === "P") { e.preventDefault(); setPresenting(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [presenting]);
  const sectionStyle: React.CSSProperties = { marginTop: 56, paddingTop: 48, borderTop: "1px solid rgba(184,200,218,0.16)", scrollMarginTop: 84 };
  const jump = (id: string, index: number) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    document.getElementById(`bolt-0${index + 1}-title`)?.focus({ preventScroll: true });
  };
  return (
    <main id="bolt-page" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px clamp(16px, 2.5vw, 24px) 48px", color: "#E2EAF2", fontSize: 16, lineHeight: 1.5 }}>
      <style>{BOLT_CSS}</style>
      <header style={{ position: "relative" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: -40, left: 0, right: 0, height: 380, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(184,200,218,0.22) 1px, transparent 1.2px)", backgroundSize: "22px 22px", WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 75% 35%, black 10%, transparent 75%)", maskImage: "radial-gradient(ellipse 70% 80% at 75% 35%, black 10%, transparent 75%)" }} />
        <div style={{ position: "relative", display: "flex", gap: "16px 32px", alignItems: "center", flexWrap: "wrap", marginBottom: 24 }}>
          <div style={{ flex: "1 1 480px", minWidth: 0 }}>
            <p style={{ margin: "0 0 8px", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase", color: BOLT_COLOR }}>{"Glide Platform · Application layer"}</p>
            <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "clamp(34px, 4vw, 44px)", letterSpacing: -0.8, fontWeight: 700, color: "#FFFFFF", margin: 0, lineHeight: 1.15 }}>Bolt PaaS</h1>
              <BoltButton onClick={() => setPresenting(true)} aria-keyshortcuts="P" style={{ background: "rgba(45,212,191,0.12)", borderColor: BOLT_COLOR, color: BOLT_COLOR, padding: "6px 14px", minHeight: 38 }}>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24"><path d="M7 4v16l13-8L7 4Z" fill="currentColor" /></svg>
                <span>Present</span><span style={{ fontSize: 12, fontWeight: 500, color: "#B8C8DA", border: "1px solid rgba(184,200,218,0.35)", borderRadius: 4, padding: "0 5px" }}>P</span>
              </BoltButton>
            </div>
            <p style={{ fontSize: 22, color: "#FFFFFF", fontWeight: 600, margin: "14px 0 0", maxWidth: 640, lineHeight: 1.4 }}>{"Turning business intent into governed enterprise software."}</p>
            <p style={{ fontSize: 18, color: "#D0DAE6", margin: "10px 0 0", maxWidth: 640, lineHeight: 1.55 }}>{"Business experts, product owners and engineers build with Claude Code and ship on McKesson’s governed AWS platform."}</p>
          </div>
          <div style={{ flex: "0 1 370px", minWidth: 260, marginLeft: "auto" }}>
            <BoltHeroStack onLayer={(layer) => layer === "apps" ? onNavigate("solutions") : layer === "data" ? onNavigate("dataplatform") : jump("how", 2)} />
          </div>
        </div>
        <BoltKpis />
        <nav aria-label="Bolt page sections" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
          {boltSections.map((section, index) => <BoltButton key={section.id} onClick={() => jump(section.id, index)} style={{ background: "transparent", padding: "8px 14px" }}><span style={{ color: BOLT_COLOR, fontFamily: "'JetBrains Mono', monospace" }}>{"0" + (index + 1)}</span><span>{section.label}</span><BoltIcon kind="down" /></BoltButton>)}
        </nav>
      </header>

      <section id="why" aria-labelledby="bolt-01-title" style={sectionStyle}>
        <SectionTitle icon="bolt" num="01" label="Why" title="Business expertise, fewer handoffs" sub="The people who know the business build the software. Engineers own the production review gate." color={BOLT_COLOR} />
        <Reveal><BoltTimeBar /></Reveal>
        <Reveal delay={0.1}><BoltSplitCompare /></Reveal>
        <BoltButton id="bolt-comparison-trigger" aria-expanded={showCompare} aria-controls="bolt-comparison" onClick={() => setShowCompare(!showCompare)} style={{ marginTop: 12, color: BOLT_COLOR, background: "transparent" }}><span>{showCompare ? "Hide timing & full comparison" : "Show timing & full comparison"}</span><BoltIcon expanded={showCompare} /></BoltButton>
        <div id="bolt-comparison" hidden={!showCompare} role="region" aria-labelledby="bolt-comparison-trigger" style={{ marginTop: 16 }}>
          <Card style={{ padding: "clamp(16px, 2.5vw, 24px)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))", gap: 28, marginBottom: 24 }}>
              {boltProcessPaths.map((path) => <div key={path.id}><h3 style={{ fontSize: 18, color: "#FFFFFF", margin: "0 0 12px" }}>{path.title + ": stage timing"}</h3><dl style={{ margin: 0 }}>{path.steps.map((step) => <div key={step.name} style={{ display: "flex", gap: 12, justifyContent: "space-between", padding: "6px 0" }}><dt style={{ color: "#D0DAE6" }}>{step.name}</dt><dd style={{ color: "#E2EAF2", margin: 0, whiteSpace: "nowrap" }}>{step.time}</dd></div>)}</dl></div>)}
            </div>
            <div role="region" aria-label="Full development comparison, scroll horizontally if needed" tabIndex={0} style={{ overflowX: "auto", padding: 4 }}>
              <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse", textAlign: "left", fontSize: 16 }}>
                <caption style={{ textAlign: "left", color: "#FFFFFF", fontSize: 18, fontWeight: 700, paddingBottom: 12 }}>Full comparison</caption>
                <thead><tr>{["Dimension", "Traditional development", "Bolt PaaS"].map((label) => <th key={label} scope="col" style={{ width: "33.33%", color: "#FFFFFF", borderBottom: "1px solid #B8C8DA", padding: "12px 12px 12px 0" }}>{label}</th>)}</tr></thead>
                <tbody>{boltBeforeAfter.map((row) => <tr key={row.dimension}><th scope="row" style={{ fontWeight: 600, padding: "14px 16px 14px 0", borderBottom: "1px solid rgba(184,200,218,0.16)", verticalAlign: "top" }}>{row.dimension}</th><td style={{ color: "#B8C8DA", padding: "14px 16px 14px 0", borderBottom: "1px solid rgba(184,200,218,0.16)", verticalAlign: "top" }}>{row.before}</td><td style={{ color: "#E2EAF2", padding: "14px 0", borderBottom: "1px solid rgba(184,200,218,0.16)", verticalAlign: "top" }}>{row.after}</td></tr>)}</tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      <section id="proof" aria-labelledby="bolt-02-title" style={sectionStyle}>
        <SectionTitle icon="chart" num="02" label="Proof" title="Nine applications in under 6 months" sub="The harness and the first business domain launched together in April 2026, then Bolt expanded across business domains and infrastructure." color={BOLT_COLOR} />
        <Reveal><Card style={{ padding: "clamp(18px, 2.5vw, 26px) clamp(12px, 2vw, 20px)" }}><BoltProofTimeline /></Card></Reveal>
        <div style={{ height: 16 }} />
        <Reveal delay={0.05}><BoltSnapshot /></Reveal>
      </section>

      <section id="how" aria-labelledby="bolt-03-title" style={sectionStyle}>
        <SectionTitle icon="layers" num="03" label="How" title="Build. Review. Run on Bolt." sub="A business owner describes the app in plain English and Claude Code builds it. Every release passes AI, engineer and security review before production." color={BOLT_COLOR} />
        <Reveal><BoltHarness /></Reveal>
        <div style={{ height: 28 }} />
        <Reveal><BoltLiveBuild onShip={shipBuiltApp} /></Reveal>
        <div style={{ height: 20 }} />
        <div id="bolt-ship-demo" style={{ scrollMarginTop: 90 }}><Reveal><BoltShipDemo trigger={shipTrigger} /></Reveal></div>
        <div style={{ height: 20 }} />
        <Reveal delay={0.05}><BoltStackDiagram onNavigate={onNavigate} /></Reveal>
      </section>

      <section id="who" aria-labelledby="bolt-04-title" style={sectionStyle}>
        <SectionTitle icon="people" num="04" label="Who" title="Choose the ownership. Bolt runs the platform." sub="Four engagement models, from Bolt-owned products to partner-built apps. Select a model to see responsibilities." color={BOLT_COLOR} />
        <Reveal><BoltEngagementMatrix /></Reveal>
      </section>

      <section id="builders" aria-labelledby="bolt-05-title" style={sectionStyle}>
        <SectionTitle icon="cert" num="05" label="Builders" title="Four steps to Full Stack Builder certification" sub="From environment setup to operational readiness. Open each module to explore its skills." color={BOLT_COLOR} />
        <Reveal><BoltBuilders /></Reveal>
      </section>

      <section id="next" aria-labelledby="bolt-06-title" style={sectionStyle}>
        <SectionTitle icon="trend" num="06" label="What's next" title="From code generation to a full operating model" sub="The next advantage comes from extending intent beyond the application layer." color={BOLT_COLOR} />
        <Reveal><BoltNext /></Reveal>
      </section>

      <footer style={{ marginTop: 48, paddingTop: 28, borderTop: "1px solid rgba(184,200,218,0.25)", display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ flex: "1 1 530px", fontSize: 18, color: "#D0DAE6", margin: 0, lineHeight: 1.6 }}><strong style={{ color: "#FFFFFF" }}>Domain experts build the tools.</strong>{" Engineers own the platform, guardrails and review gate."}</p>
        <BoltButton onClick={() => onNavigate("dataplatform")} style={{ color: BOLT_COLOR, borderColor: BOLT_COLOR }}><span>Explore the Data Platform</span><BoltIcon kind="arrow" /></BoltButton>
      </footer>
      {presenting && <BoltPresenter onExit={exitPresenter} onNavigate={(id) => { exitPresenter(); onNavigate(id); }} />}
    </main>
  );
}

// ============================================================
// MPTS ROADMAP DATA
// ============================================================

const ROADMAP_COLORS = {
  legacy: "#EF4444",
  intermediate: "#F59E0B",
  bolt: "#10B981",
  tool: "#8B5CF6",
};

const portfolioTiers = [
  {
    id: "legacy",
    title: "Legacy",
    subtitle: "Large codebases, monolith architecture",
    color: ROADMAP_COLORS.legacy,
    apps: [
      { name: "Lynx Mobile", desc: "Specialty drug inventory management", users: "360+ practices, 1,600 sites", age: "~20 years", migration: "180+ days", target: "bolt", complexity: "HIGH", icon: "\uD83D\uDCE6" },
      { name: "RetinaOS", desc: "Retina clinical workflow & inventory", users: "Retina practices", age: "Established", migration: "180+ days", target: "bolt", complexity: "MEDIUM", icon: "\uD83D\uDC41" },
      { name: "Glide Health", desc: "Revenue cycle intelligence with ML/AI", users: "Oncology & multispecialty", age: "Established", migration: "90\u2013180 days", target: "bolt", complexity: "MEDIUM", icon: "\uD83D\uDCCA" },
      { name: "Regimen Profiler", desc: "Treatment cost & reimbursement estimator", users: "Oncology practices", age: "Established", migration: "180+ days", target: "bolt", complexity: "MEDIUM", icon: "\uD83D\uDC8A" },
      { name: "Customer Center", desc: "Online drug ordering platform", users: "All specialty practices", age: "Established", migration: "180+ days", target: "bolt", complexity: "HIGH", icon: "\uD83D\uDED2" },
    ],
  },
  {
    id: "intermediate",
    title: "Intermediate",
    subtitle: "AI-powered, smaller codebases",
    color: ROADMAP_COLORS.intermediate,
    apps: [
      { name: "Titan", desc: "Payer policy intelligence", status: "Live", migration: "0\u201390 days", target: "bolt", complexity: "LOW", icon: "\uD83D\uDEE1" },
      { name: "Nova 2.0", desc: "Internal pricing intelligence engine", status: "Pilot", migration: "90\u2013180 days", target: "bolt", complexity: "MEDIUM", icon: "\uD83D\uDCB0" },
      { name: "X-Ray", desc: "Drug pricing transparency", status: "Pilot", migration: "90\u2013180 days", target: "bolt", complexity: "MEDIUM", icon: "\uD83D\uDD0D" },
      { name: PRACTICE_NAME, desc: "Dynamic QBR portal", status: "Pilot", migration: "0\u201390 days", target: "bolt", complexity: "LOW", icon: "\uD83D\uDCCB" },
    ],
  },
  {
    id: "bolt",
    title: "Bolt PaaS",
    subtitle: "Greenfield \u2014 builder-led on AWS",
    color: ROADMAP_COLORS.bolt,
    apps: [
      { name: "Meridian", desc: "Oncology expansion intelligence platform", status: "Migrating", migration: "In progress", target: "native", complexity: "\u2014", icon: "\uD83C\uDF0E" },
      { name: "Axiom", desc: "GPO rebate reconciliation \u2014 pharma manufacturer vs. McKesson", status: "Building", migration: "Native", target: "native", complexity: "\u2014", icon: "\uD83D\uDCB1" },
      { name: "New Projects", desc: "Built by certified builders using Claude Code", status: "Ready", migration: "Native", target: "native", complexity: "\u2014", icon: "\u26A1" },
    ],
  },
];

const migrationPaths = [
  {
    id: "int-to-bolt",
    title: "Intermediate \u2192 Bolt",
    subtitle: "Near-term migrations",
    color: ROADMAP_COLORS.intermediate,
    timeline: "0\u2013180 days",
    apps: "Titan, " + PRACTICE_NAME + " (first wave) \u2192 Nova, X-Ray (second wave)",
    description: "Smaller, modern codebases with minimal legacy dependencies. Git-based pull into Bolt with engineer + AI review gate. Titan and " + PRACTICE_NAME + " move first (lowest complexity), followed by Nova and X-Ray once the shared data layer is stable.",
    tools: ["Claude Code", "Bolt PaaS", "AI Review Agent"],
    steps: ["Provision Bolt environment", "Code review gate (AI + engineer)", "Migrate auth to Bolt shared auth", "DNS cutover, keep Vercel as rollback"],
  },
  {
    id: "legacy-incremental",
    title: "Legacy \u2192 Incremental Modernization",
    subtitle: "Understand, extract, migrate module by module",
    color: ROADMAP_COLORS.legacy,
    timeline: "90\u2013365+ days",
    apps: "Glide Health (first), then Regimen Profiler, RetinaOS",
    description: "Index the legacy codebase with Sourcegraph to give developers full cross-repo context. Extract microservices one module at a time using Claude Code with Sourcegraph context. Each extracted module deploys to Bolt independently. Lower risk, longer timeline, builds internal capability.",
    tools: ["Sourcegraph Cody", "Claude Code", "Bolt PaaS"],
    steps: ["Deploy Sourcegraph \u2014 index full codebase", "Map dependencies and business logic", "Identify extraction boundaries", "Extract modules \u2192 Bolt, one at a time", "Decommission legacy module when Bolt replacement is stable"],
  },
  {
    id: "legacy-rewrite",
    title: "Legacy \u2192 Autonomous Rewrite",
    subtitle: "Large-scale AI-driven modernization",
    color: "#EC4899",
    timeline: "180\u2013365+ days",
    apps: "Lynx Mobile, Customer Center",
    description: "For the largest, most complex monoliths where incremental extraction is too slow. Blitzy reverse-engineers the full codebase, builds a knowledge graph, and coordinates thousands of AI agents to autonomously generate the modernized codebase. Higher cost, faster timeline, requires significant validation infrastructure.",
    tools: ["Blitzy", "Sourcegraph Cody", "Claude Code", "Bolt PaaS"],
    steps: ["Sourcegraph indexes codebase for baseline understanding", "Blitzy reverse-engineers and builds knowledge graph", "Autonomous code generation (days\u2013weeks of inference)", "Human validation + test suite execution", "Staged migration to Bolt with rollback"],
  },
];

const aiToolsRoadmap = [
  { name: "GitHub Copilot", status: "Approved", color: "#B8C8DA", tiers: ["Legacy", "Intermediate", "Bolt"], desc: "File-level autocomplete. Currently the only approved AI coding tool. Provides value everywhere but insufficient for large codebase reasoning.", limitation: "Cannot see beyond the open file" },
  { name: "Claude Code", status: "Pending AI Council", color: "#8B5CF6", tiers: ["Intermediate", "Bolt", "Legacy"], desc: "Terminal-native AI coding agent. Project-level reasoning, agentic workflows, full-file generation. The primary build tool for Bolt and the key unlock for developer productivity across all tiers.", limitation: "Needs Sourcegraph for legacy codebase context" },
  { name: "Sourcegraph Cody", status: "Evaluate", color: "#3B82F6", tiers: ["Legacy"], desc: "Codebase-aware context retrieval across large, multi-repository architectures. Makes Claude Code effective against monoliths by providing cross-repo context for every prompt. $59/user/month.", limitation: "Context layer, not a build tool on its own" },
  { name: "Blitzy", status: "Evaluate", color: "#EC4899", tiers: ["Legacy"], desc: "Autonomous enterprise code generation. Reverse-engineers codebases (1M\u2013100M+ LOC), builds knowledge graphs, coordinates 3,000+ AI agents. For Lynx-scale modernization. $250K+ evaluation.", limitation: "High cost, requires validation infrastructure" },
];

const timelineBands = [
  {
    id: "now",
    label: "0\u201390 Days",
    title: "Foundation",
    color: ROADMAP_COLORS.bolt,
    actions: [
      "Secure AI Council approval for Claude Code / Codex",
      "Begin Bolt migration for Titan and " + PRACTICE_NAME + " (lowest complexity)",
      "Pilot Sourcegraph on Lynx codebase with 10\u201320 developers",
      "Complete Full Stack Builder certification program v1",
      "First new project built natively on Bolt",
    ],
  },
  {
    id: "next",
    label: "90\u2013180 Days",
    title: "Acceleration",
    color: ROADMAP_COLORS.intermediate,
    actions: [
      "Titan and " + PRACTICE_NAME + " running on Bolt",
      "Begin Nova and X-Ray Bolt migration assessment",
      "Glide Health modernization feasibility study (Sourcegraph)",
      "Expand Claude Code access to full engineering team",
      "Second wave of certified builders operational",
    ],
  },
  {
    id: "later",
    label: "180+ Days",
    title: "Transformation",
    color: ROADMAP_COLORS.legacy,
    actions: [
      "All intermediate apps running on Bolt",
      "Lynx modernization decision: incremental vs. autonomous rewrite",
      "Evaluate Blitzy POC on a contained Lynx module",
      "Assess RetinaOS, Regimen Profiler, Customer Center for Bolt",
      "New projects built exclusively on Bolt by certified builders",
    ],
  },
];

// ============================================================
// MPTS ROADMAP PAGE
// ============================================================

// (MptsRoadmapPage moved to the modern Roadmap / AI Literacy pages)

// ============================================================
// VALUE DATA
// ============================================================

const valueProjects = [
  { name: "Nova 2.0", color: "#10B981", desc: "Internal pricing intelligence engine replacing Excel-based pricing models. Automates buy/sell economics across WAC, contract price, VCD, FFS, GPO admin fees, and OIDs with AI deal recommendations.", customerValue: "$2.3M", sdlcValue: "$1.5M", customerRaw: 2300000, sdlcRaw: 1500000, status: "Pilot" },
  { name: "X-Ray", color: "#3B82F6", desc: "Customer-facing drug pricing transparency. Delivers the complete cost walk from WAC through discounts and rebates to net price, with per-drug net cost recovery visibility for practices and field reps.", customerValue: "$1.3M", sdlcValue: "$1.0M", customerRaw: 1300000, sdlcRaw: 1000000, status: "Pilot" },
  { name: "Titan", color: "#F59E0B", desc: "Payer policy intelligence. Automated 24/7 surveillance of formularies, step therapy requirements, and preferred drug lists across oncology drugs and biosimilars.", customerValue: "$1.25M", sdlcValue: "$1.5M", customerRaw: 1250000, sdlcRaw: 1500000, status: "Live" },
  { name: PRACTICE_NAME, color: "#EF4444", desc: "Dynamic QBR portal replacing static PowerPoint decks. Pulls data from 6+ sources into a unified schema with natural language query engine for reps and customers.", customerValue: "$1.2M", sdlcValue: "$2.2M", customerRaw: 1200000, sdlcRaw: 2200000, status: "Pilot" },
  { name: "Meridian", color: "#8B5CF6", desc: "Oncology expansion intelligence platform. Scores ~2,500 ZIP codes across 6 states to identify optimal clinic expansion opportunities with AI-generated market reports.", customerValue: "$1M", sdlcValue: "$750K", customerRaw: 1000000, sdlcRaw: 750000, status: "Live" },
  { name: "Axiom", color: "#06B6D4", desc: "GPO rebate reconciliation engine. Compares quarterly GPO rebate data from pharma manufacturers against McKesson rebate records to identify discrepancies and accelerate dispute resolution.", customerValue: "$750K", sdlcValue: "$1.0M", customerRaw: 750000, sdlcRaw: 1000000, status: "Building" },
];

// ============================================================
// VALUE PAGE
// ============================================================

// (ValuePage moved to the modern Roadmap / AI Literacy pages)

// ============================================================
// DATA PLATFORM PAGE (placeholder until content arrives)
// ============================================================

// ============================================================
// DATA PLATFORM PAGE (Provider Solutions Data Platform)
// ============================================================

const DP_COLOR = "#34D399";

const dpSections = [
  { id: "dp-why", label: "Why" },
  { id: "dp-domains", label: "Domains" },
  { id: "dp-reuse", label: "Reuse" },
  { id: "dp-trust", label: "Trust" },
  { id: "dp-intent", label: "Intent" },
  { id: "dp-flywheel", label: "Flywheel" },
];

const dpRelay = ["Business requirement", "Application teams", "Data engineering teams", "Infrastructure teams", "Security reviews", "Governance reviews", "Compliance reviews", "Analytics development", "Deployment", "Business outcome"];
const dpIntentOutputs = ["Applications", "Data products", "Infrastructure", "AI & analytics", "Security controls", "Governance controls", "Compliance controls", "Operational services"];

// Generic drag-to-compare split (same interaction as the Bolt page)
function SplitCompareShell({ left, right, accent, label }: { left: React.ReactNode; right: React.ReactNode; accent: string; label: string }) {
  const [pos, setPos] = useState(50);
  const [anim, setAnim] = useState(false);
  const [focused, setFocused] = useState(false);
  const touched = useRef(false);
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.4);
  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    setAnim(true);
    const steps: [number, number][] = [[350, 68], [1150, 34], [1950, 50], [2700, -1]];
    const ids = steps.map(([ms, v]) => window.setTimeout(() => { if (v < 0) setAnim(false); else if (!touched.current) setPos(v); }, ms));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [inView]);
  const ease = "cubic-bezier(.4,0,.2,1)";
  const wrap = (node: React.ReactNode) => <div className="bolt-split-inner" style={{ width: "100%", minWidth: 340, flexShrink: 0, boxSizing: "border-box", padding: "clamp(18px, 2.5vw, 28px)" }}>{node}</div>;
  return (
    <div ref={ref}>
      <div className="bolt-split" style={{ position: "relative", display: "flex", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(184,200,218,0.2)", outline: focused ? "3px solid #FFFFFF" : "none", outlineOffset: 3 }}>
        <div className="bolt-split-pane bolt-anim" style={{ width: `${pos}%`, overflow: "hidden", display: "flex", background: "linear-gradient(160deg, rgba(184,200,218,0.10), rgba(16,34,66,0.55))", transition: anim ? `width 0.7s ${ease}` : "none" }}>{wrap(left)}</div>
        <div className="bolt-split-pane bolt-anim" style={{ width: `${100 - pos}%`, overflow: "hidden", display: "flex", justifyContent: "flex-end", background: `linear-gradient(160deg, ${accent}0F, ${accent}29)`, transition: anim ? `width 0.7s ${ease}` : "none" }}>{wrap(right)}</div>
        <div className="bolt-split-handle bolt-anim" aria-hidden="true" style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 0, pointerEvents: "none", transition: anim ? `left 0.7s ${ease}` : "none" }}>
          <span style={{ position: "absolute", top: 0, bottom: 0, left: -1, width: 2, background: `linear-gradient(transparent, ${accent}, transparent)` }} />
          <span style={{ position: "absolute", top: "50%", left: -23, width: 46, height: 46, marginTop: -23, boxSizing: "border-box", borderRadius: "50%", background: "#0B1A33", border: `2px solid ${accent}`, boxShadow: `0 0 20px ${accent}88`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24"><path d="m9 7-5 5 5 5m6-10 5 5-5 5" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>
        <input
          type="range" className="bolt-range bolt-split-input" min={18} max={82} step={1} value={pos}
          onChange={(ev) => { touched.current = true; setAnim(false); setPos(Number(ev.target.value)); }}
          onFocus={(ev) => setFocused(ev.currentTarget.matches(":focus-visible"))} onBlur={() => setFocused(false)}
          aria-label={label} aria-valuetext={`${pos}% today, ${100 - pos}% new model`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", margin: 0, opacity: 0, cursor: "ew-resize" }}
        />
      </div>
      <p className="bolt-split-hint" style={{ margin: "10px 0 0", textAlign: "center", fontSize: 14, color: "#7F93AE" }}>{"Drag the divider to compare"}</p>
    </div>
  );
}

function DpRelayCompare() {
  const eyebrowStyle = (color: string): React.CSSProperties => ({ fontFamily: MONO, fontSize: 13, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color, margin: "0 0 6px" });
  const left = (
    <div>
      <p style={eyebrowStyle("#B8C8DA")}>{"Today"}</p>
      <h3 style={{ fontSize: 19, color: "#FFFFFF", margin: "0 0 4px" }}>A relay across separate teams</h3>
      <p style={{ fontSize: 14, color: "#B8C8DA", margin: "0 0 14px" }}>{"Each capability crosses every team, platform and review in turn."}</p>
      <ol aria-label="Traditional delivery chain" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {dpRelay.map((step, i) => {
          const ends = i === 0 || i === dpRelay.length - 1;
          return (
            <li key={step}>
              {i > 0 && <div aria-hidden="true" style={{ width: 2, height: 10, marginLeft: 12, background: "repeating-linear-gradient(#F59E0B 0 3px, transparent 3px 6px)" }} />}
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 10px", borderRadius: 7, background: ends ? "rgba(184,200,218,0.12)" : "rgba(184,200,218,0.05)", border: "1px solid rgba(184,200,218,0.16)" }}>
                <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: 12, color: "#7F93AE", minWidth: 16 }}>{i + 1}</span>
                <span style={{ fontSize: 15, fontWeight: ends ? 700 : 500, color: ends ? "#FFFFFF" : "#D0DAE6" }}>{step}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
  const right = (
    <div>
      <p style={eyebrowStyle(DP_COLOR)}>{"With Bolt + Data Platform"}</p>
      <h3 style={{ fontSize: 19, color: "#FFFFFF", margin: "0 0 4px" }}>One intent layer</h3>
      <p style={{ fontSize: 14, color: "#B8C8DA", margin: "0 0 14px" }}>{"Business intent is translated into everything the outcome needs, together."}</p>
      <div style={{ padding: "10px 14px", borderRadius: 9, background: "#071226", border: "1px solid rgba(184,200,218,0.25)", fontSize: 15, fontWeight: 700, color: "#FFFFFF", display: "flex", alignItems: "center", gap: 10 }}><BoltGlyphIcon kind="target" size={18} color={DP_COLOR} />Business intent</div>
      <div aria-hidden="true" style={{ width: 2, height: 14, marginLeft: 22, background: DP_COLOR }} />
      <div style={{ padding: "10px 14px", borderRadius: 9, background: "rgba(45,212,191,0.14)", border: `1px solid ${BOLT_COLOR}`, fontSize: 15, fontWeight: 700, color: "#FFFFFF", display: "flex", alignItems: "center", gap: 10 }}><BoltGlyphIcon kind="bolt" size={18} />Bolt intent layer</div>
      <div aria-hidden="true" style={{ width: 2, height: 14, marginLeft: 22, background: DP_COLOR }} />
      <ul aria-label="Delivered together" style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 6 }}>
        {dpIntentOutputs.map((o) => <li key={o} style={{ padding: "6px 10px", borderRadius: 7, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.3)", fontSize: 14, fontWeight: 600, color: "#E2EAF2" }}>{o}</li>)}
      </ul>
      <div aria-hidden="true" style={{ width: 2, height: 14, marginLeft: 22, background: DP_COLOR }} />
      <div style={{ padding: "10px 14px", borderRadius: 9, background: "linear-gradient(160deg, rgba(245,158,11,0.28), rgba(245,158,11,0.12))", border: "1px solid rgba(245,158,11,0.6)", fontSize: 15, fontWeight: 700, color: "#FFFFFF", display: "flex", alignItems: "center", gap: 10 }}><BoltGlyphIcon kind="box" size={18} color="#FBBF24" />Business outcome</div>
    </div>
  );
  return <SplitCompareShell left={left} right={right} accent={DP_COLOR} label="Divider between today's delivery relay and the intent-driven model" />;
}

// Hub and spoke: the eight governed domains around one foundation
function DpDomainHub({ big = false }: { big?: boolean }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.3);
  const [active, setActive] = useState<number>(0);
  const n = dataLayer.length;
  const H = big ? 500 : 540;
  const pos = dataLayer.map((_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: 50 + Math.cos(a) * 38, y: 50 + Math.sin(a) * 40 };
  });
  const sel = dataLayer[active];
  return (
    <div ref={ref}>
      <div className="dp-hub" style={{ position: "relative", height: H }}>
        <svg aria-hidden="true" viewBox={`0 0 1000 ${H}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
          {pos.map((p, i) => (
            <g key={i}>
              <line x1={500} y1={H / 2} x2={p.x * 10} y2={(p.y * H) / 100} stroke={dataLayer[i].color} strokeOpacity={i === active ? 0.9 : 0.3} strokeWidth={i === active ? 2.5 : 1.5} vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1" className="bolt-anim" style={{ strokeDashoffset: inView ? 0 : 1, transition: `stroke-dashoffset 0.9s ease ${0.2 + i * 0.1}s, stroke-opacity 0.3s ease` }} />
              {inView && <line x1={p.x * 10} y1={(p.y * H) / 100} x2={500} y2={H / 2} stroke={dataLayer[i].color} strokeWidth={3} vectorEffect="non-scaling-stroke" strokeDasharray="3 14" strokeLinecap="round" className="bolt-anim" style={{ animation: `dpDash 1.6s linear ${1.2 + i * 0.15}s infinite`, opacity: i === active ? 1 : 0.55 }} />}
            </g>
          ))}
        </svg>
        <div className="bolt-anim" style={{ position: "absolute", left: "50%", top: "50%", width: big ? 190 : 210, height: big ? 190 : 210, marginLeft: big ? -95 : -105, marginTop: big ? -95 : -105, borderRadius: "50%", background: "radial-gradient(circle, #124236, #071226 72%)", border: `2px solid ${DP_COLOR}`, boxShadow: `0 0 40px ${DP_COLOR}44`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 20, boxSizing: "border-box", ...(inView ? { animation: "boltPop 0.6s ease-out both" } : { opacity: 0 }) }}>
          <BoltGlyphIcon kind="db" size={30} color={DP_COLOR} />
          <span style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF", marginTop: 8, lineHeight: 1.25 }}>Governed data foundation</span>
          <span style={{ fontSize: 13, color: "#B8C8DA", marginTop: 4 }}>{"Shared by every app"}</span>
        </div>
        {dataLayer.map((d, i) => (
          <div key={d.id} style={{ position: "absolute", left: `${pos[i].x}%`, top: `${pos[i].y}%`, transform: "translate(-50%, -50%)" }}>
          <button type="button" onClick={() => setActive(i)} aria-pressed={i === active} className="bolt-anim" style={{ display: "block", width: big ? 196 : 206, padding: "10px 12px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", textAlign: "left", background: i === active ? `linear-gradient(${d.color}33, ${d.color}33), #0E2140` : "#0E2140", border: `1.5px solid ${i === active ? d.color : d.color + "66"}`, boxShadow: i === active ? `0 0 20px ${d.color}55` : "none", transition: "background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease", ...(inView ? { animation: `boltPop 0.45s ease-out ${0.3 + i * 0.1}s both` } : { opacity: 0 }) }}>
            <span style={{ display: "block", fontSize: big ? 15 : 15, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.25 }}>{d.title}</span>
            <span style={{ display: "block", fontSize: 12.5, color: d.color, marginTop: 3, fontWeight: 600 }}>{d.items.length + " data sets"}</span>
          </button>
          </div>
        ))}
      </div>
      <ul className="dp-hub-grid" style={{ listStyle: "none", margin: 0, padding: 0, display: "none", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
        {dataLayer.map((d, i) => (
          <li key={d.id}><button type="button" onClick={() => setActive(i)} aria-pressed={i === active} style={{ width: "100%", textAlign: "left", fontFamily: "inherit", padding: "10px 12px", borderRadius: 10, cursor: "pointer", background: i === active ? `${d.color}2A` : "#0E2140", border: `1.5px solid ${i === active ? d.color : d.color + "66"}`, color: "#FFFFFF", fontSize: 14, fontWeight: 700 }}>{d.title}</button></li>
        ))}
      </ul>
      <div aria-live="polite" key={sel.id} className="bolt-anim" style={{ marginTop: 14, borderRadius: 12, padding: "18px 22px", background: `${sel.color}12`, border: `1px solid ${sel.color}44`, animation: "boltIn 0.35s ease-out both" }}>
        <p style={{ margin: "0 0 12px", fontFamily: MONO, fontSize: 13, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: sel.color }}>{sel.title}</p>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {sel.items.map((it, k) => <li key={it} className="bolt-anim" style={{ fontSize: 15, color: "#E2EAF2", padding: "6px 12px", borderRadius: 999, background: "rgba(16,34,66,0.7)", border: `1px solid ${sel.color}55`, animation: `boltPop 0.35s ease-out ${k * 0.05}s both` }}>{it}</li>)}
        </ul>
      </div>
    </div>
  );
}

// Build once, reuse everywhere: domains feed reusable data products that power many capabilities
const dpCapabilities = ["Revenue Intelligence", "Practice Performance Optimization", "Provider Network Analytics", "Retention & Engagement Solutions", "Care Coordination Insights", "Referral Intelligence", "Capacity Planning", "Predictive AI Solutions", "Operational Command Centers", "Executive Performance Dashboards"];
const dpConsumers = ["Applications", "Workflows", "Analytics", "Reporting", "AI models", "Operational decisions", "Customer experiences"];

function DpReuse() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.25);
  const ROW = 44, GAP = 8;
  const leftN = dataLayer.length, rightN = dpCapabilities.length;
  const Hh = Math.max(leftN, rightN) * (ROW + GAP) - GAP;
  const offL = (Hh - (leftN * (ROW + GAP) - GAP)) / 2;
  const offR = (Hh - (rightN * (ROW + GAP) - GAP)) / 2;
  const yL = (i: number) => offL + i * (ROW + GAP) + ROW / 2;
  const yR = (i: number) => offR + i * (ROW + GAP) + ROW / 2;
  const mid = Hh / 2;
  const gutter = (side: "l" | "r") => (
    <svg aria-hidden="true" className="dp-reuse-gutter" width="100%" height={Hh} viewBox={`0 0 100 ${Hh}`} preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      {(side === "l" ? dataLayer.map((_, i) => yL(i)) : dpCapabilities.map((_, i) => yR(i))).map((y, i) => {
        const d = side === "l" ? `M 0 ${y} C 50 ${y}, 50 ${mid}, 100 ${mid}` : `M 0 ${mid} C 50 ${mid}, 50 ${y}, 100 ${y}`;
        const color = side === "l" ? dataLayer[i].color : DP_COLOR;
        const delay = side === "l" ? 0.2 + i * 0.06 : 1.0 + i * 0.06;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke={color} strokeOpacity={0.4} strokeWidth={1.5} vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1" className="bolt-anim" style={{ strokeDashoffset: inView ? 0 : 1, transition: `stroke-dashoffset 0.8s ease ${delay}s` }} />
            {inView && <path d={d} fill="none" stroke={color} strokeWidth={2.5} vectorEffect="non-scaling-stroke" strokeDasharray="2 18" strokeLinecap="round" className="bolt-anim" style={{ animation: `dpDashRev 1.8s linear ${delay + 0.8}s infinite` }} />}
          </g>
        );
      })}
    </svg>
  );
  const chip = (text: string, color: string, delay: number, key: string) => (
    <li key={key} className="bolt-anim" style={{ height: ROW, boxSizing: "border-box", display: "flex", alignItems: "center", gap: 10, padding: "0 12px", borderRadius: 9, background: "#0E2140", border: `1px solid ${color}66`, fontSize: 14, fontWeight: 600, color: "#E2EAF2", lineHeight: 1.2, ...(inView ? { animation: `boltIn 0.4s ease-out ${delay}s both` } : { opacity: 0 }) }}>
      <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />{text}
    </li>
  );
  return (
    <div ref={ref}>
      <div className="dp-reuse" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(40px, 0.45fr) minmax(200px, 0.9fr) minmax(40px, 0.45fr) minmax(0, 1.15fr)", alignItems: "start" }}>
        <div>
          <p style={{ margin: "0 0 10px", fontFamily: MONO, fontSize: 12.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA" }}>{"Governed domains"}</p>
          <ul style={{ listStyle: "none", margin: 0, padding: `${offL}px 0`, display: "grid", gap: GAP }}>{dataLayer.map((d, i) => chip(d.title, d.color, 0.1 + i * 0.05, d.id))}</ul>
        </div>
        <div className="dp-reuse-gutter-wrap" style={{ paddingTop: 30 }}>{gutter("l")}</div>
        <div style={{ paddingTop: 30, height: Hh + 30, boxSizing: "border-box", display: "flex", alignItems: "center" }}>
          <div className="bolt-anim" style={{ width: "100%", borderRadius: 14, padding: "20px 18px", textAlign: "center", background: "radial-gradient(circle at 50% 30%, rgba(52,211,153,0.25), #071226 75%)", border: `2px solid ${DP_COLOR}`, boxShadow: `0 0 36px ${DP_COLOR}33`, ...(inView ? { animation: "boltPop 0.6s ease-out 0.7s both" } : { opacity: 0 }) }}>
            <BoltGlyphIcon kind="layers" size={30} color={DP_COLOR} />
            <p style={{ margin: "8px 0 4px", fontSize: 18, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.25 }}>Reusable data products</p>
            <p style={{ margin: "0 0 12px", fontSize: 13.5, color: "#B8C8DA", lineHeight: 1.45 }}>{"Built once, governed once, used by many"}</p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center" }}>
              {dpConsumers.map((c) => <li key={c} style={{ fontSize: 12, color: "#D0DAE6", padding: "3px 8px", borderRadius: 999, border: "1px solid rgba(52,211,153,0.35)" }}>{c}</li>)}
            </ul>
          </div>
        </div>
        <div className="dp-reuse-gutter-wrap" style={{ paddingTop: 30 }}>{gutter("r")}</div>
        <div>
          <p style={{ margin: "0 0 10px", fontFamily: MONO, fontSize: 12.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA" }}>{"Business capabilities"}</p>
          <ul style={{ listStyle: "none", margin: 0, padding: `${offR}px 0`, display: "grid", gap: GAP }}>{dpCapabilities.map((c, i) => chip(c, DP_COLOR, 1.2 + i * 0.06, c))}</ul>
        </div>
      </div>
    </div>
  );
}

// Governance, compliance and legal by design
const dpControls: { title: string; icon: BoltGlyph; color: string; items: string[] }[] = [
  { title: "Security", icon: "shield", color: "#60A5FA", items: ["Authentication and authorization", "Role-based access controls", "Least-privilege access", "Audit logging and monitoring"] },
  { title: "Compliance", icon: "check", color: DP_COLOR, items: ["HIPAA controls", "PHI protection", "Data retention policies", "Regulatory requirements"] },
  { title: "Legal", icon: "briefcase", color: "#FBBF24", items: ["Data-sharing restrictions", "Consent management", "Contractual obligations", "Approved usage controls"] },
  { title: "Governance", icon: "eye", color: "#A78BFA", items: ["Data lineage", "Data quality monitoring", "Metadata management", "Data cataloging", "Stewardship workflows", "Ownership and accountability"] },
];

function DpTrust() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.25);
  return (
    <div ref={ref}>
      <div className="bolt-anim" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 14, ...(inView ? { animation: "boltIn 0.45s ease-out both" } : { opacity: 0 }) }}>
        {["Data products", "AI solutions", "Applications"].map((t) => (
          <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 999, background: "#071226", border: `1px solid ${DP_COLOR}77`, fontSize: 15, fontWeight: 700, color: "#FFFFFF" }}><BoltGlyphIcon kind={t === "Applications" ? "app" : t === "AI solutions" ? "bolt" : "db"} size={16} color={DP_COLOR} />{t}</span>
        ))}
        <span style={{ fontSize: 15, color: "#B8C8DA" }}>{"automatically inherit"}</span>
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))", gap: 12 }}>
        {dpControls.map((g, gi) => (
          <li key={g.title} className="bolt-anim" style={{ borderRadius: 14, padding: "18px 18px 16px", background: `linear-gradient(170deg, ${g.color}18, rgba(16,34,66,0.7) 60%)`, border: `1px solid ${g.color}55`, borderTop: `3px solid ${g.color}`, ...(inView ? { animation: `boltRise 0.6s cubic-bezier(.2,.7,.2,1) ${0.2 + gi * 0.15}s both` } : { opacity: 0 }) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span aria-hidden="true" style={{ display: "inline-flex", width: 36, height: 36, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: `${g.color}22` }}><BoltGlyphIcon kind={g.icon} size={19} color={g.color} /></span>
              <h3 style={{ margin: 0, fontSize: 18, color: "#FFFFFF" }}>{g.title}</h3>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
              {g.items.map((it, k) => (
                <li key={it} className="bolt-anim" style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14.5, color: "#D0DAE6", lineHeight: 1.35, ...(inView ? { animation: `boltIn 0.35s ease-out ${0.7 + gi * 0.15 + k * 0.12}s both` } : { opacity: 0 }) }}>
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 2 }}><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke={g.color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>{it}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className="bolt-anim" style={{ margin: "14px 0 0", fontSize: 16, color: DP_COLOR, fontWeight: 700, textAlign: "center", ...(inView ? { animation: "boltIn 0.5s ease-out 2.2s both" } : { opacity: 0 }) }}>{"Innovation scales without increasing enterprise risk."}</p>
    </div>
  );
}

// One request, apps and data: the intent layer orchestrates both
const DP_PROMPT = "Create a provider revenue optimization solution that identifies reimbursement leakage, predicts denials, surfaces provider performance trends, and alerts practice administrators.";
const dpAppOutputs = ["User experiences", "APIs", "Business services", "Workflows", "Operational databases"];
const dpDataOutputs = ["Data models", "Pipelines", "Data products", "AI-ready datasets", "Governance policies", "Security controls", "Analytics assets"];
const DP_CHAR = 16;
const DP_TYPE_END = DP_PROMPT.length * DP_CHAR;
const DP_STEP = 260;
const dpOutAt = (i: number) => DP_TYPE_END + 900 + i * DP_STEP;
const DP_DONE = dpOutAt(Math.max(dpAppOutputs.length, dpDataOutputs.length)) + 400;
const DP_END = DP_DONE + 1500;

function DpIntentDemo({ autoStart = false, big = false }: { autoStart?: boolean; big?: boolean }) {
  const [e, setE] = useState(0);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (!autoStart) return;
    const id = window.setTimeout(() => setRun((r) => r + 1), 600);
    return () => window.clearTimeout(id);
  }, [autoStart]);
  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) { setE(DP_END); return; }
    setE(0);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => { const v = now - start; setE(v); if (v < DP_END) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run]);
  const started = run > 0;
  const typing = started && e < DP_TYPE_END;
  const typed = DP_PROMPT.slice(0, Math.min(DP_PROMPT.length, Math.floor(e / DP_CHAR)));
  const layerOn = started && e >= DP_TYPE_END + 300;
  const done = started && e >= DP_DONE;
  const fs = big ? 1.1 : 1;
  const lane = (title: string, sub: string, items: string[], color: string, icon: BoltGlyph) => (
    <div style={{ borderRadius: 14, padding: "16px 18px", background: "rgba(16,34,66,0.6)", border: `1px solid ${color}55` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}><BoltGlyphIcon kind={icon} size={20} color={color} /><h4 style={{ margin: 0, fontSize: 17 * fs, color: "#FFFFFF" }}>{title}</h4></div>
      <p style={{ margin: "0 0 12px", fontSize: 13.5, color: "#B8C8DA" }}>{sub}</p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: 7 }}>
        {items.map((it, i) => {
          const on = started && e >= dpOutAt(i);
          return (
            <li key={it} className="bolt-anim" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 11px", borderRadius: 999, fontSize: 14 * fs, fontWeight: 600, color: on ? "#FFFFFF" : "#7F93AE", background: on ? `${color}26` : "rgba(184,200,218,0.05)", border: `1px solid ${on ? color : "rgba(184,200,218,0.18)"}`, boxShadow: on ? `0 0 12px ${color}44` : "none", transition: "all 0.35s ease" }}>
              {on && <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}{it}
            </li>
          );
        })}
      </ul>
    </div>
  );
  return (
    <Card style={{ padding: big ? "24px 28px" : "clamp(16px, 2.5vw, 24px)" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h3 style={{ margin: 0, fontSize: 20 * fs, color: "#FFFFFF" }}>One request, apps and data</h3>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#93C5FD", border: "1px solid rgba(147,197,253,0.4)", borderRadius: 5, padding: "2px 8px" }}>{"Illustrative · sped up"}</span>
        </div>
        <div style={{ minHeight: 44, display: "flex", alignItems: "center" }}>
          {(!started || done) && <BoltButton onClick={() => setRun((r) => r + 1)} style={started ? { background: "transparent" } : { background: DP_COLOR, color: "#0B1A33", borderColor: DP_COLOR }}><span>{started ? "Replay" : "Run the request"}</span>{!started && <BoltIcon kind="arrow" />}</BoltButton>}
        </div>
      </div>
      <div style={{ background: "#050D1C", border: "1px solid rgba(184,200,218,0.18)", borderRadius: 12, padding: "14px 18px", fontFamily: MONO, fontSize: 14 * fs, lineHeight: 1.65, color: "#FFFFFF", minHeight: 74 }}>
        <span style={{ color: DP_COLOR, fontWeight: 700 }}>{"> "}</span>
        {started ? typed : <span style={{ color: "#7F93AE" }}>{"Press Run the request to see one business request become an app and its data, together."}</span>}
        {typing && <span className="bolt-anim" style={{ display: "inline-block", width: 8, height: "1.05em", verticalAlign: "text-bottom", background: DP_COLOR, marginLeft: 2, animation: "boltBlink 1s steps(1) infinite" }} />}
      </div>
      <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
        <span className="bolt-anim" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 999, fontSize: 16 * fs, fontWeight: 700, color: "#FFFFFF", background: layerOn ? "rgba(45,212,191,0.18)" : "rgba(184,200,218,0.05)", border: `1.5px solid ${layerOn ? BOLT_COLOR : "rgba(184,200,218,0.25)"}`, boxShadow: layerOn ? `0 0 26px ${BOLT_COLOR}55` : "none", transition: "all 0.4s ease", animation: layerOn && !done ? "boltPulse 1.2s ease-in-out infinite" : undefined }}>
          <BoltGlyphIcon kind="bolt" size={18} color={layerOn ? BOLT_COLOR : "#7F93AE"} />Bolt intent layer
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 12 }}>
        {lane("Application layer", "Bolt translates intent into", dpAppOutputs, BOLT_COLOR, "app")}
        {lane("Data layer", "The Data Platform translates intent into", dpDataOutputs, DP_COLOR, "db")}
      </div>
      <p aria-live="polite" style={{ margin: "14px 0 0", fontSize: 15 * fs, fontWeight: done ? 700 : 400, color: done ? DP_COLOR : "#D0DAE6" }}>
        {done ? "One request. The app and its governed data arrive together, with controls already applied." : started ? "Orchestrating application and data capabilities" : "Business experts describe the outcome, not the implementation."}
      </p>
    </Card>
  );
}

// The flywheel: every new capability compounds the platform
const dpFlywheel = [
  { label: "New applications", sub: "Every new application enriches the data platform" },
  { label: "Richer data domains", sub: "Every new data domain strengthens the application platform" },
  { label: "Reusable capabilities", sub: "Every new capability becomes a reusable enterprise asset" },
];
const dpBenefits = ["Faster time-to-market", "Lower development and operating cost", "Reuse across solutions and business units", "Faster AI and advanced analytics adoption", "Consistent governance, compliance and legal", "Connected enterprise insights", "Greater business agility", "Enhanced customer value", "Sustainable differentiation"];

function DpFlywheel() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.3);
  const [motionOk, setMotionOk] = useState(false);
  useEffect(() => { setMotionOk(!prefersReducedMotion()); }, []);
  const R = 120, C = 160;
  const nodes = dpFlywheel.map((_, i) => { const a = (i / 3) * Math.PI * 2 - Math.PI / 2; return { x: C + Math.cos(a) * R, y: C + Math.sin(a) * R }; });
  const circle = `M ${C} ${C - R} A ${R} ${R} 0 1 1 ${C - 0.01} ${C - R}`;
  return (
    <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: 28, alignItems: "center" }}>
      <div style={{ position: "relative", maxWidth: 460, width: "100%", margin: "0 auto" }}>
        <svg viewBox="-130 -40 580 390" style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }} role="img" aria-label="Flywheel: new applications enrich data domains, which create reusable capabilities, which speed up new applications">
          <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(184,200,218,0.15)" strokeWidth={10} />
          <circle cx={C} cy={C} r={R} fill="none" stroke={DP_COLOR} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="0.28 0.053" className="bolt-anim" style={{ transformOrigin: `${C}px ${C}px`, animation: inView ? "dpSpin 9s linear infinite" : undefined, opacity: inView ? 0.85 : 0, transition: "opacity 0.6s ease" }} />
          {motionOk && inView && (
            <circle r={7} fill="#FFFFFF" style={{ filter: `drop-shadow(0 0 8px ${DP_COLOR})` }}>
              <animateMotion dur="4.5s" repeatCount="indefinite" path={circle} />
            </circle>
          )}
          <text x={C} y={C - 6} textAnchor="middle" fontSize={21} fontWeight={700} fill="#FFFFFF" fontFamily="DM Sans, sans-serif">{"Compounding"}</text>
          <text x={C} y={C + 20} textAnchor="middle" fontSize={21} fontWeight={700} fill={DP_COLOR} fontFamily="DM Sans, sans-serif">{"value"}</text>
          {nodes.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={14} fill="#0B1A33" stroke={DP_COLOR} strokeWidth={3} />
              <text x={i === 0 ? p.x : i === 1 ? p.x - 6 : p.x + 6} y={i === 0 ? p.y - 26 : p.y + 42} textAnchor={i === 0 ? "middle" : i === 1 ? "start" : "end"} fontSize={20} fontWeight={700} fill="#FFFFFF" fontFamily="DM Sans, sans-serif">{dpFlywheel[i].label}</text>
            </g>
          ))}
        </svg>
      </div>
      <div>
        <ul style={{ listStyle: "none", margin: "0 0 18px", padding: 0, display: "grid", gap: 10 }}>
          {dpFlywheel.map((f, i) => (
            <li key={f.label} className="bolt-anim" style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 17, color: "#FFFFFF", fontWeight: 600, lineHeight: 1.4, ...(inView ? { animation: `boltIn 0.45s ease-out ${0.3 + i * 0.25}s both` } : { opacity: 0 }) }}>
              <span aria-hidden="true" style={{ fontFamily: MONO, color: DP_COLOR, fontSize: 15, paddingTop: 2 }}>{"0" + (i + 1)}</span>{f.sub + "."}
            </li>
          ))}
        </ul>
        <p style={{ margin: "0 0 10px", fontFamily: MONO, fontSize: 12.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA" }}>{"Benefits"}</p>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {dpBenefits.map((b, i) => <li key={b} className="bolt-anim" style={{ fontSize: 14, color: "#E2EAF2", padding: "6px 12px", borderRadius: 999, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.3)", ...(inView ? { animation: `boltPop 0.4s ease-out ${1.1 + i * 0.08}s both` } : { opacity: 0 }) }}>{b}</li>)}
        </ul>
      </div>
    </div>
  );
}

function DpHeroTiles({ big = false }: { big?: boolean }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.2);
  const tiles: { icon: BoltGlyph; head: string; label: string; sub: string }[] = [
    { icon: "db", head: "One foundation", label: "Governed domains", sub: "Shared by every application" },
    { icon: "repeat", head: "Built once", label: "Reusable data products", sub: "Power apps, analytics and AI" },
    { icon: "shield", head: "Controls by default", label: "Inherited, not reviewed in", sub: "Security, compliance, legal, governance" },
  ];
  return (
    <div ref={ref} style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${big ? 300 : 250}px), 1fr))`, gap: big ? 18 : 12 }}>
      {tiles.map((t, i) => (
        <div key={t.head} className="bolt-anim" style={{ background: "rgba(16,34,66,0.6)", border: `1px solid ${DP_COLOR}4D`, borderRadius: 12, padding: big ? "28px 30px" : "22px 24px", boxShadow: inView ? `0 0 32px ${DP_COLOR}14` : "none", transition: "box-shadow 1s ease", ...(inView ? { animation: `boltRise 0.6s cubic-bezier(.2,.7,.2,1) ${i * 0.12}s both` } : { opacity: 0 }) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BoltGlyphIcon kind={t.icon} size={big ? 30 : 24} color={DP_COLOR} />
            <p style={{ fontSize: big ? 40 : 28, fontWeight: 700, letterSpacing: -0.5, color: DP_COLOR, margin: 0, lineHeight: 1.15 }}>{t.head}</p>
          </div>
          <p style={{ color: "#FFFFFF", fontSize: big ? 21 : 17, fontWeight: 600, margin: "10px 0 3px" }}>{t.label}</p>
          <p style={{ fontSize: big ? 18 : 15.5, color: "#B8C8DA", margin: 0 }}>{t.sub}</p>
        </div>
      ))}
    </div>
  );
}

function DataPlatformPage({ onNavigate }: { onNavigate: Navigate }) {
  const [presenting, setPresenting] = useState(false);
  const exitPresenter = React.useCallback(() => setPresenting(false), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (presenting || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "p" || e.key === "P") { e.preventDefault(); setPresenting(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [presenting]);
  const sectionStyle: React.CSSProperties = { marginTop: 56, paddingTop: 48, borderTop: "1px solid rgba(184,200,218,0.16)", scrollMarginTop: 84 };
  const jump = (id: string, index: number) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    document.getElementById(`bolt-0${index + 1}-title`)?.focus({ preventScroll: true });
  };
  return (
    <main id="dp-page" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px clamp(16px, 2.5vw, 24px) 48px", color: "#E2EAF2", fontSize: 16, lineHeight: 1.5 }}>
      <style>{BOLT_CSS}</style>
      <header style={{ position: "relative" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: -40, left: 0, right: 0, height: 380, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(184,200,218,0.22) 1px, transparent 1.2px)", backgroundSize: "22px 22px", WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 75% 35%, black 10%, transparent 75%)", maskImage: "radial-gradient(ellipse 70% 80% at 75% 35%, black 10%, transparent 75%)" }} />
        <div style={{ position: "relative", display: "flex", gap: "16px 32px", alignItems: "center", flexWrap: "wrap", marginBottom: 24 }}>
          <div style={{ flex: "1 1 480px", minWidth: 0 }}>
            <p style={{ margin: "0 0 8px", fontFamily: MONO, fontSize: 13, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase", color: DP_COLOR }}>{"Glide Platform · Data layer"}</p>
            <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "clamp(34px, 4vw, 44px)", letterSpacing: -0.8, fontWeight: 700, color: "#FFFFFF", margin: 0, lineHeight: 1.15 }}>Data Platform</h1>
              <BoltButton onClick={() => setPresenting(true)} aria-keyshortcuts="P" style={{ background: `${DP_COLOR}1F`, borderColor: DP_COLOR, color: DP_COLOR, padding: "6px 14px", minHeight: 38 }}>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24"><path d="M7 4v16l13-8L7 4Z" fill="currentColor" /></svg>
                <span>Present</span><span style={{ fontSize: 12, fontWeight: 500, color: "#B8C8DA", border: "1px solid rgba(184,200,218,0.35)", borderRadius: 4, padding: "0 5px" }}>P</span>
              </BoltButton>
            </div>
            <p style={{ fontSize: 22, color: "#FFFFFF", fontWeight: 600, margin: "14px 0 0", maxWidth: 640, lineHeight: 1.4 }}>{"Transforming enterprise data into business capabilities through intent."}</p>
            <p style={{ fontSize: 18, color: "#D0DAE6", margin: "10px 0 0", maxWidth: 640, lineHeight: 1.55 }}>{"A governed foundation where data products, analytics and AI are built once, reused everywhere and inherit enterprise controls by default."}</p>
          </div>
          <div style={{ flex: "0 1 370px", minWidth: 260, marginLeft: "auto" }}>
            <BoltHeroStack litLayer="data" onLayer={(layer) => layer === "apps" ? onNavigate("solutions") : layer === "bolt" ? onNavigate("bolt") : jump("dp-domains", 1)} />
          </div>
        </div>
        <DpHeroTiles />
        <nav aria-label="Data Platform page sections" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
          {dpSections.map((section, index) => <BoltButton key={section.id} onClick={() => jump(section.id, index)} style={{ background: "transparent", padding: "8px 14px" }}><span style={{ color: DP_COLOR, fontFamily: MONO }}>{"0" + (index + 1)}</span><span>{section.label}</span><BoltIcon kind="down" /></BoltButton>)}
        </nav>
      </header>

      <section id="dp-why" aria-labelledby="bolt-01-title" style={sectionStyle}>
        <SectionTitle icon="layers" num="01" label="Why" title="Value trapped in silos" sub="Clinical, financial, operational, commercial and provider data sits in disconnected systems. Turning it into value has meant many specialized teams, long implementations and separate reviews." color={DP_COLOR} />
        <Reveal><DpRelayCompare /></Reveal>
      </section>

      <section id="dp-domains" aria-labelledby="bolt-02-title" style={sectionStyle}>
        <SectionTitle icon="db" num="02" label="Domains" title="A connected enterprise data foundation" sub="Governed domains are reusable enterprise assets, not project-specific datasets. They draw on application databases and enterprise analytical environments. Select a domain to see what it holds." color={DP_COLOR} />
        <Reveal><DpDomainHub /></Reveal>
      </section>

      <section id="dp-reuse" aria-labelledby="bolt-03-title" style={sectionStyle}>
        <SectionTitle icon="repeat" num="03" label="Reuse" title="Build once, use everywhere" sub="Instead of a separate warehouse, pipeline, report, API and app for every initiative, teams build governed data products once and reuse them across solutions." color={DP_COLOR} />
        <Reveal><DpReuse /></Reveal>
      </section>

      <section id="dp-trust" aria-labelledby="bolt-04-title" style={sectionStyle}>
        <SectionTitle icon="shield" num="04" label="Trust" title="Governance, compliance and legal by design" sub="Healthcare innovation has to balance speed with trust. Controls are built into the platform, so every product inherits them instead of waiting on separate reviews." color={DP_COLOR} />
        <Reveal><DpTrust /></Reveal>
      </section>

      <section id="dp-intent" aria-labelledby="bolt-05-title" style={sectionStyle}>
        <SectionTitle icon="target" num="05" label="Intent" title="One intent layer for apps and data" sub="Bolt translates business intent into the application. The Data Platform applies the same idea to data. Both are created through one experience and inherit the same controls." color={DP_COLOR} />
        <Reveal><DpIntentDemo /></Reveal>
      </section>

      <section id="dp-flywheel" aria-labelledby="bolt-06-title" style={sectionStyle}>
        <SectionTitle icon="trend" num="06" label="Flywheel" title="Value that compounds" sub="Every application, data domain and capability makes the next one faster and more valuable." color={DP_COLOR} />
        <Reveal><DpFlywheel /></Reveal>
      </section>

      <footer style={{ marginTop: 48, paddingTop: 28, borderTop: "1px solid rgba(184,200,218,0.25)", display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ flex: "1 1 530px", fontSize: 18, color: "#D0DAE6", margin: 0, lineHeight: 1.6 }}><strong style={{ color: "#FFFFFF" }}>{"A connected, governed healthcare intelligence ecosystem."}</strong>{" Business teams turn ideas into applications, data products and AI through one experience."}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <BoltButton onClick={() => onNavigate("bolt")} style={{ color: BOLT_COLOR, borderColor: BOLT_COLOR }}><span>Explore Bolt PaaS</span><BoltIcon kind="arrow" /></BoltButton>
          <BoltButton onClick={() => onNavigate("solutions")} style={{ color: "#93C5FD", borderColor: "#60A5FA" }}><span>See the Solutions</span><BoltIcon kind="arrow" /></BoltButton>
        </div>
      </footer>
      {presenting && <BoltPresenter deck="data" onExit={exitPresenter} onNavigate={(id) => { exitPresenter(); onNavigate(id); }} />}
    </main>
  );
}

// ============================================================
// SAVINGSIQ PAGE (GPO rebate modeling engine)
// ============================================================

const SIQ_COLOR = "#A3E635";

const siqSections = [
  { id: "siq-why", label: "Why" },
  { id: "siq-how", label: "How" },
  { id: "siq-try", label: "Try it" },
  { id: "siq-trust", label: "Trust" },
  { id: "siq-next", label: "Next" },
];

function SiqCompare() {
  const eb = (c: string): React.CSSProperties => ({ fontFamily: MONO, fontSize: 13, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: c, margin: "0 0 6px" });
  const row = (text: string, good: boolean) => (
    <li key={text} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 15, color: good ? "#E2EAF2" : "#D0DAE6", lineHeight: 1.4 }}>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 2 }}>{good ? <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke={SIQ_COLOR} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M7 7l10 10M17 7 7 17" fill="none" stroke="#F87171" strokeWidth="2.4" strokeLinecap="round" />}</svg>{text}
    </li>
  );
  const stat = (v: string, l: string, c: string) => <div><div style={{ fontSize: 28, fontWeight: 700, color: c, lineHeight: 1.1 }}>{v}</div><div style={{ fontSize: 14, color: "#B8C8DA", marginTop: 2 }}>{l}</div></div>;
  const left = (
    <div>
      <p style={eb("#B8C8DA")}>{"Today"}</p>
      <h3 style={{ fontSize: 19, color: "#FFFFFF", margin: 0 }}>A multi-tab Excel workbook</h3>
      <div style={{ display: "flex", gap: 28, margin: "14px 0 18px", flexWrap: "wrap" }}>{stat("~3 weeks", "of cross-functional effort", "#B8C8DA")}{stat("Static", "spreadsheet output", "#B8C8DA")}</div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
        {["Tier logic lives in analysts' heads", "Contract terms read and calculated by hand", "One answer per spreadsheet; scenarios are copies", "Rate changes overwrite earlier numbers", "Hard to check against the source"].map((t) => row(t, false))}
      </ul>
    </div>
  );
  const right = (
    <div>
      <p style={eb(SIQ_COLOR)}>{"With SavingsIQ"}</p>
      <h3 style={{ fontSize: 19, color: "#FFFFFF", margin: 0 }}>A validated modeling engine</h3>
      <div style={{ display: "flex", gap: 28, margin: "14px 0 18px", flexWrap: "wrap" }}>{stat("Live", "economic comparison", SIQ_COLOR)}{stat("Side by side", "scenarios", SIQ_COLOR)}</div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
        {["Contract rules encoded once, applied every time", "Every rate checked against its contract ceiling", "Compare programs side by side and see the delta", "Every assumption kept in a full audit trail", "Reconciled to the legacy workbook"].map((t) => row(t, true))}
      </ul>
    </div>
  );
  return <SplitCompareShell left={left} right={right} accent={SIQ_COLOR} label="Divider between the Excel workbook and SavingsIQ" />;
}

// How it works: six steps that light in sequence
const siqSteps: { title: string; sub: string; icon: BoltGlyph }[] = [
  { title: "Purchase data", sub: "Usage, spend, contract price and WAC by NDC", icon: "db" },
  { title: "Program resolution", sub: "Each product mapped to its contract program", icon: "link" },
  { title: "Rate assumption", sub: "Analyst sets a rebate rate per product and scenario", icon: "person" },
  { title: "Ceiling check", sub: "Rate validated against contract-derived ceilings", icon: "shield" },
  { title: "Rebate value", sub: "Quarterly and annual value, with quantity overrides", icon: "chart" },
  { title: "Compare & export", sub: "Scenarios side by side, delta, export and audit trail", icon: "repeat" },
];

function SiqPipeline({ big = false }: { big?: boolean }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.3);
  return (
    <div ref={ref}>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))", gap: 10 }}>
        {siqSteps.map((st, i) => (
          <li key={st.title} className="bolt-anim" style={{ position: "relative", borderRadius: 12, padding: big ? "18px 16px" : "16px 14px", background: "rgba(163,230,53,0.06)", border: "1px solid rgba(163,230,53,0.25)", ...(inView ? { animation: `boltIn 0.4s ease-out ${i * 0.08}s both, siqGlow 6s ease-in-out ${0.8 + i * 0.45}s infinite` } : { opacity: 0 }) }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span aria-hidden="true" style={{ display: "inline-flex", width: 34, height: 34, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: "rgba(163,230,53,0.14)" }}><BoltGlyphIcon kind={st.icon} size={18} color={SIQ_COLOR} /></span>
              <span style={{ fontFamily: MONO, fontSize: 13, color: SIQ_COLOR }}>{"0" + (i + 1)}</span>
            </div>
            <p style={{ margin: 0, fontSize: big ? 18 : 16, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3 }}>{st.title}</p>
            <p style={{ margin: "4px 0 0", fontSize: big ? 15 : 14, color: "#B8C8DA", lineHeight: 1.45 }}>{st.sub}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Interactive: drag a rate and watch the ceiling check respond (illustrative numbers)
const SIQ_SPEND = 1200000;
const SIQ_AGG = 12;
const SIQ_IND = 20;

function SiqCeilingDemo({ big = false }: { big?: boolean }) {
  const [rate, setRate] = useState(9);
  const [focused, setFocused] = useState(false);
  const state = rate <= SIQ_AGG ? "OK" : rate <= SIQ_IND ? "REVIEW" : "ERROR";
  const meta = {
    OK: { color: "#4ADE80", text: "At or below the aggregate ceiling." },
    REVIEW: { color: "#FBBF24", text: "Above the aggregate ceiling, but individual contract terms could justify it. Rationale required." },
    ERROR: { color: "#F87171", text: "Above every ceiling, with no contract pathway to support it." },
  }[state];
  const MAX = 30;
  const pct = (v: number) => `${(v / MAX) * 100}%`;
  const value = Math.round((SIQ_SPEND * rate) / 100);
  const fs = big ? 1.12 : 1;
  return (
    <Card style={{ padding: big ? "24px 28px" : "clamp(16px, 2.5vw, 24px)" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h3 style={{ margin: 0, fontSize: 20 * fs, color: "#FFFFFF" }}>Set a rebate rate</h3>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#93C5FD", border: "1px solid rgba(147,197,253,0.4)", borderRadius: 5, padding: "2px 8px" }}>{"Illustrative product"}</span>
        </div>
        <span style={{ fontSize: 14 * fs, color: "#B8C8DA" }}>{"Annual spend $1.2M · aggregate ceiling 12% · individual terms to 20%"}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 24, alignItems: "center" }}>
        <div>
          <div style={{ position: "relative", height: 34, borderRadius: 8, overflow: "hidden", background: "rgba(184,200,218,0.08)", outline: focused ? "3px solid #FFFFFF" : "none", outlineOffset: 4 }}>
            <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: pct(SIQ_AGG), background: "rgba(74,222,128,0.18)" }} />
            <div aria-hidden="true" style={{ position: "absolute", left: pct(SIQ_AGG), top: 0, bottom: 0, width: pct(SIQ_IND - SIQ_AGG), background: "rgba(251,191,36,0.18)" }} />
            <div aria-hidden="true" style={{ position: "absolute", left: pct(SIQ_IND), top: 0, bottom: 0, right: 0, background: "rgba(248,113,113,0.14)" }} />
            <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: pct(rate), borderRadius: 4, background: meta.color, transition: "width 0.15s ease, background 0.3s ease", boxShadow: `0 0 14px ${meta.color}88` }} />
            {[SIQ_AGG, SIQ_IND].map((c) => <div key={c} aria-hidden="true" style={{ position: "absolute", left: pct(c), top: 0, bottom: 0, width: 2, background: "#FFFFFF", opacity: 0.7 }} />)}
            <input type="range" className="bolt-range" min={0} max={MAX} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} onFocus={(ev) => setFocused(ev.currentTarget.matches(":focus-visible"))} onBlur={() => setFocused(false)} aria-label="Assumed rebate rate" aria-valuetext={`${rate}% rebate rate: ${state}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", margin: 0, opacity: 0, cursor: "ew-resize" }} />
          </div>
          <div aria-hidden="true" style={{ position: "relative", height: 34, marginTop: 6, fontSize: 12.5, color: "#B8C8DA" }}>
            <span style={{ position: "absolute", left: 0 }}>{"0%"}</span>
            <span style={{ position: "absolute", left: pct(SIQ_AGG), transform: "translateX(-50%)", textAlign: "center", lineHeight: 1.3 }}>{"12%"}<br />{"aggregate"}</span>
            <span style={{ position: "absolute", left: pct(SIQ_IND), transform: "translateX(-50%)", textAlign: "center", lineHeight: 1.3 }}>{"20%"}<br />{"individual"}</span>
            <span style={{ position: "absolute", right: 0 }}>{"30%"}</span>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: 14, color: "#7F93AE" }}>{"Drag the bar to change the analyst's assumed rate."}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ borderRadius: 12, padding: "16px 18px", background: "rgba(16,34,66,0.7)", border: "1px solid rgba(184,200,218,0.2)" }}>
            <div style={{ fontSize: 13, color: "#B8C8DA" }}>{"Assumed rate"}</div>
            <div style={{ fontSize: 34 * fs, fontWeight: 700, color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>{rate.toFixed(1) + "%"}</div>
            <div style={{ fontSize: 14, color: "#B8C8DA", marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{"≈ $" + value.toLocaleString("en-US") + " / yr"}</div>
          </div>
          <div aria-live="polite" style={{ borderRadius: 12, padding: "16px 18px", background: `${meta.color}14`, border: `1.5px solid ${meta.color}`, boxShadow: `0 0 20px ${meta.color}33`, transition: "all 0.3s ease" }}>
            <div style={{ fontSize: 13, color: "#B8C8DA" }}>{"Ceiling check"}</div>
            <div key={state} className="bolt-anim" style={{ fontSize: 30 * fs, fontWeight: 800, color: meta.color, letterSpacing: 0.5, animation: "boltPop 0.35s ease-out both" }}>{state}</div>
            <div style={{ fontSize: 13.5, color: "#E2EAF2", marginTop: 2, lineHeight: 1.4 }}>{meta.text}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Interactive: switch the scenario's program and watch which products move
const siqBook: { name: string; native: "Standard" | "Differentiated"; std: number; diff: number }[] = [
  { name: "Product A", native: "Standard", std: 182000, diff: 182000 },
  { name: "Product B", native: "Standard", std: 96000, diff: 96000 },
  { name: "Product C", native: "Differentiated", std: 0, diff: 141000 },
  { name: "Product D", native: "Differentiated", std: 0, diff: 88000 },
  { name: "Product E", native: "Differentiated", std: 0, diff: 57000 },
];

function SiqScenarioDemo({ big = false }: { big?: boolean }) {
  const [diff, setDiff] = useState(false);
  const total = (d: boolean) => siqBook.reduce((s, p) => s + (d ? p.diff : p.std), 0);
  const max = Math.max(...siqBook.map((p) => p.diff));
  const fmt = (v: number) => "$" + Math.round(v / 1000).toLocaleString("en-US") + "K";
  const fs = big ? 1.1 : 1;
  const tab = (on: boolean, label: string, val: boolean) => (
    <button type="button" aria-pressed={on} onClick={() => setDiff(val)} style={{ fontFamily: "inherit", fontSize: 15 * fs, fontWeight: 700, padding: "8px 16px", borderRadius: 8, cursor: "pointer", border: `1.5px solid ${on ? SIQ_COLOR : "rgba(184,200,218,0.3)"}`, background: on ? "rgba(163,230,53,0.16)" : "transparent", color: on ? "#FFFFFF" : "#B8C8DA", transition: "all 0.2s ease" }}>{label}</button>
  );
  return (
    <Card style={{ padding: big ? "24px 28px" : "clamp(16px, 2.5vw, 24px)" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h3 style={{ margin: 0, fontSize: 20 * fs, color: "#FFFFFF" }}>Compare scenarios</h3>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#93C5FD", border: "1px solid rgba(147,197,253,0.4)", borderRadius: 5, padding: "2px 8px" }}>{"Illustrative book"}</span>
        </div>
        <div role="group" aria-label="Scenario program" style={{ display: "flex", gap: 8 }}>{tab(!diff, "Standard baseline", false)}{tab(diff, "Differentiated program", true)}</div>
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
        {siqBook.map((p) => {
          const v = diff ? p.diff : p.std;
          const moves = p.native === "Differentiated";
          return (
            <li key={p.name} style={{ display: "grid", gridTemplateColumns: "minmax(150px, 0.9fr) minmax(0, 2fr) 70px", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 15 * fs, color: "#FFFFFF", fontWeight: 600 }}>{p.name}<span style={{ display: "block", fontSize: 12.5, fontWeight: 500, color: moves ? SIQ_COLOR : "#7F93AE" }}>{moves ? "Differentiated-native · moves" : "Standard-native · stays put"}</span></span>
              <span style={{ height: 14, borderRadius: 4, background: "rgba(184,200,218,0.08)", overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", width: `${(v / max) * 100}%`, borderRadius: 4, background: moves ? SIQ_COLOR : "#93A9C2", transition: "width 0.6s cubic-bezier(.2,.7,.2,1)" }} />
              </span>
              <span style={{ fontSize: 15 * fs, fontWeight: 700, color: v ? "#FFFFFF" : "#7F93AE", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{v ? fmt(v) : "$0"}</span>
            </li>
          );
        })}
      </ul>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline", marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(184,200,218,0.16)" }}>
        <span aria-live="polite" style={{ fontSize: 17 * fs, color: "#FFFFFF", fontWeight: 700 }}>{"Annual rebate value: " + fmt(total(diff))}</span>
        <span style={{ fontSize: 16 * fs, fontWeight: 700, color: diff ? SIQ_COLOR : "#7F93AE", transition: "color 0.3s ease" }}>{diff ? "+" + fmt(total(true) - total(false)) + " vs Standard" : "Switch the program to see the delta"}</span>
      </div>
      <p style={{ margin: "10px 0 0", fontSize: 13.5, color: "#B8C8DA", lineHeight: 1.5 }}>{"Standard-native products keep their Standard terms in every scenario. Only products native to a differentiated program change, which is what makes the comparison honest."}</p>
    </Card>
  );
}

// Trust: append-only history, tenant isolation, reconciliation, test net
function SiqTrust() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.3);
  const cards: { title: string; icon: BoltGlyph; text: string }[] = [
    { title: "Nothing is overwritten", icon: "list", text: "Every rate change closes the old assumption and opens a new one. History is append-only, so every number can be traced." },
    { title: "Isolation in the database", icon: "shield", text: "Each customer's data is fenced off by the database itself, not just the app, which is what cleared multi-tenant approval." },
    { title: "Reconciled to the workbook", icon: "check", text: "A reconciliation harness compares outputs with the legacy Excel workbook, with zero unexplained differences." },
    { title: "A real test net", icon: "code", text: "132 automated unit and integration tests plus 24 end-to-end tests guard the calculation engine." },
  ];
  return (
    <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: 16, alignItems: "start" }}>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 12 }}>
        {cards.map((c, i) => (
          <li key={c.title} className="bolt-anim" style={{ borderRadius: 12, padding: "16px 16px", background: "rgba(16,34,66,0.6)", border: "1px solid rgba(163,230,53,0.25)", ...(inView ? { animation: `boltRise 0.55s cubic-bezier(.2,.7,.2,1) ${i * 0.12}s both` } : { opacity: 0 }) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}><BoltGlyphIcon kind={c.icon} size={20} color={SIQ_COLOR} /><h3 style={{ margin: 0, fontSize: 16.5, color: "#FFFFFF" }}>{c.title}</h3></div>
            <p style={{ margin: 0, fontSize: 14.5, color: "#D0DAE6", lineHeight: 1.5 }}>{c.text}</p>
          </li>
        ))}
      </ul>
      <div style={{ borderRadius: 14, padding: "18px 20px", background: "#071226", border: "1px solid rgba(184,200,218,0.2)" }}>
        <p style={{ margin: "0 0 12px", fontFamily: MONO, fontSize: 12.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA" }}>{"Assumption history · Product C"}</p>
        {[
          { v: "14.0%", when: "Initial assumption", closed: true, d: 0.4 },
          { v: "16.5%", when: "Revised after contract review", closed: true, d: 1.0 },
          { v: "18.0%", when: "Current · rationale recorded", closed: false, d: 1.6 },
        ].map((r) => (
          <div key={r.v} className="bolt-anim" style={{ display: "grid", gridTemplateColumns: "70px 1fr auto", gap: 12, alignItems: "center", padding: "10px 12px", marginBottom: 8, borderRadius: 9, background: r.closed ? "rgba(184,200,218,0.05)" : "rgba(163,230,53,0.12)", border: `1px solid ${r.closed ? "rgba(184,200,218,0.18)" : SIQ_COLOR}`, ...(inView ? { animation: `boltIn 0.45s ease-out ${r.d}s both` } : { opacity: 0 }) }}>
            <span style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: r.closed ? "#B8C8DA" : "#FFFFFF", textDecoration: r.closed ? "line-through" : "none" }}>{r.v}</span>
            <span style={{ fontSize: 14, color: r.closed ? "#B8C8DA" : "#E2EAF2" }}>{r.when}</span>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: r.closed ? "#7F93AE" : SIQ_COLOR }}>{r.closed ? "Closed" : "Open"}</span>
          </div>
        ))}
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "#7F93AE" }}>{"Illustrative history. Older rows are closed, never deleted."}</p>
      </div>
    </div>
  );
}

// What's built and what's next, plus the three-leg target architecture
const siqBuilt = ["Scenario modeling across programs", "Quantity assumptions with proportional scaling", "Native program resolution", "Three-state ceiling check", "Append-only assumption history", "Tenant isolation", "Reconciliation harness", "Analyst workspace and CSV export"];
const siqNext = ["Contract tier ingestion from the contract tracker", "Product-share analysis", "Growth-assumption assist", "Clinical guardrails", "Pricing integration with Nova", "Member mode for retention and QBRs", "Auto-tiering", "Customer-facing experience"];
const siqLegs: { title: string; sub: string; icon: BoltGlyph; color: string }[] = [
  { title: "Pricing, NDC and volume", sub: "From Nova", icon: "db", color: "#10B981" },
  { title: "Manufacturer contract terms", sub: "From the contract tracker", icon: "briefcase", color: "#FBBF24" },
  { title: "Modeling layer", sub: "SavingsIQ: scenarios, assumptions, ceilings", icon: "chart", color: SIQ_COLOR },
];

function SiqNext() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.25);
  const list = (title: string, chip: string, chipColor: string, items: string[], done: boolean) => (
    <div style={{ borderRadius: 14, padding: "20px 22px", background: done ? "rgba(16,34,66,0.6)" : "linear-gradient(160deg, rgba(163,230,53,0.08), #071226)", border: `1px solid ${done ? "rgba(184,200,218,0.2)" : "rgba(163,230,53,0.35)"}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 18, color: "#FFFFFF" }}>{title}</h3>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: chipColor, border: `1px solid ${chipColor}88`, borderRadius: 5, padding: "2px 8px" }}>{chip}</span>
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
        {items.map((it, i) => (
          <li key={it} className="bolt-anim" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "#E2EAF2", ...(inView ? { animation: `boltIn 0.35s ease-out ${(done ? 0.1 : 0.6) + i * 0.08}s both` } : { opacity: 0 }) }}>
            {done
              ? <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke={SIQ_COLOR} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              : <span aria-hidden="true" style={{ width: 9, height: 9, margin: "0 3.5px", borderRadius: "50%", border: `2px solid ${SIQ_COLOR}`, flexShrink: 0 }} />}
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div ref={ref}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: 14 }}>
        {list("Built and validated", "Prototype", SIQ_COLOR, siqBuilt, true)}
        {list("Next on Bolt", "Roadmap", "#FBBF24", siqNext, false)}
      </div>
      <div style={{ marginTop: 22 }}>
        <p style={{ margin: "0 0 12px", fontFamily: MONO, fontSize: 12.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA" }}>{"Target state: three legs, one comparison"}</p>
        <div className="siq-legs" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr)) auto minmax(180px, 0.9fr)", gap: 12, alignItems: "stretch" }}>
          {siqLegs.map((l, i) => (
            <div key={l.title} className="bolt-anim" style={{ borderRadius: 12, padding: "14px 16px", background: "rgba(16,34,66,0.6)", border: `1px solid ${l.color}66`, borderTop: `3px solid ${l.color}`, ...(inView ? { animation: `boltRise 0.5s cubic-bezier(.2,.7,.2,1) ${1.0 + i * 0.15}s both` } : { opacity: 0 }) }}>
              <BoltGlyphIcon kind={l.icon} size={20} color={l.color} />
              <p style={{ margin: "8px 0 2px", fontSize: 15.5, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3 }}>{l.title}</p>
              <p style={{ margin: 0, fontSize: 13.5, color: "#B8C8DA" }}>{l.sub}</p>
            </div>
          ))}
          <span aria-hidden="true" className="bolt-harness-arrow" style={{ alignSelf: "center", display: "inline-flex", width: 34, height: 34, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: "rgba(163,230,53,0.14)", border: `1px solid ${SIQ_COLOR}88` }}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M4 12h16m-6-6 6 6-6 6" fill="none" stroke={SIQ_COLOR} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <div className="bolt-anim" style={{ borderRadius: 12, padding: "14px 16px", background: "linear-gradient(160deg, rgba(163,230,53,0.22), rgba(163,230,53,0.08))", border: `1.5px solid ${SIQ_COLOR}`, display: "flex", flexDirection: "column", justifyContent: "center", ...(inView ? { animation: "boltPop 0.5s ease-out 1.6s both" } : { opacity: 0 }) }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>{"The economic comparison"}</p>
            <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "#E2EAF2" }}>{"What a practice earns with McKesson versus its incumbent"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SiqHeroTiles() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.2);
  const tiles = [
    { head: "~3 weeks", label: "Today, per comparison", sub: "Cross-functional effort, static spreadsheet" },
    { head: "Traceable", label: "Every assumption", sub: "Who changed what, when and why" },
    { head: "Reconciled", label: "To the legacy workbook", sub: "Zero unexplained differences" },
  ];
  return (
    <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))", gap: 12 }}>
      {tiles.map((t, i) => (
        <div key={t.head} className="bolt-anim" style={{ background: "rgba(16,34,66,0.6)", border: `1px solid ${SIQ_COLOR}4D`, borderRadius: 12, padding: "22px 24px", ...(inView ? { animation: `boltRise 0.6s cubic-bezier(.2,.7,.2,1) ${i * 0.12}s both` } : { opacity: 0 }) }}>
          <p style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5, color: SIQ_COLOR, margin: 0, lineHeight: 1.15 }}>{t.head}</p>
          <p style={{ color: "#FFFFFF", fontSize: 17, fontWeight: 600, margin: "10px 0 3px" }}>{t.label}</p>
          <p style={{ fontSize: 15.5, color: "#B8C8DA", margin: 0 }}>{t.sub}</p>
        </div>
      ))}
    </div>
  );
}

function SavingsIQPage({ onNavigate }: { onNavigate: Navigate }) {
  const sectionStyle: React.CSSProperties = { marginTop: 56, paddingTop: 48, borderTop: "1px solid rgba(184,200,218,0.16)", scrollMarginTop: 84 };
  const jump = (id: string, index: number) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    document.getElementById(`bolt-0${index + 1}-title`)?.focus({ preventScroll: true });
  };
  return (
    <main id="siq-page" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px clamp(16px, 2.5vw, 24px) 48px", color: "#E2EAF2", fontSize: 16, lineHeight: 1.5 }}>
      <style>{BOLT_CSS}</style>
      <header style={{ position: "relative", marginBottom: 8 }}>
        <div aria-hidden="true" style={{ position: "absolute", top: -40, left: 0, right: 0, height: 320, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(184,200,218,0.2) 1px, transparent 1.2px)", backgroundSize: "22px 22px", WebkitMaskImage: "radial-gradient(ellipse 60% 80% at 80% 30%, black 10%, transparent 75%)", maskImage: "radial-gradient(ellipse 60% 80% at 80% 30%, black 10%, transparent 75%)" }} />
        <div style={{ position: "relative", maxWidth: 760 }}>
          <p style={{ margin: "0 0 8px", fontFamily: MONO, fontSize: 13, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase", color: SIQ_COLOR }}>{"Solutions · GPO rebate modeling"}</p>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "clamp(34px, 4vw, 44px)", letterSpacing: -0.8, fontWeight: 700, color: "#FFFFFF", margin: 0, lineHeight: 1.15 }}>SavingsIQ</h1>
            <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: "#F59E0B", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 4, padding: "3px 8px" }}>{"Prototype"}</span>
          </div>
          <p style={{ fontSize: 22, color: "#FFFFFF", fontWeight: 600, margin: "14px 0 0", lineHeight: 1.4 }}>{"Turning weeks of rebate analysis into a live economic comparison."}</p>
          <p style={{ fontSize: 18, color: "#D0DAE6", margin: "10px 0 0", lineHeight: 1.55 }}>{"Models pharmaceutical rebate value for GPO prospects and members across oncology and multispecialty contract programs, so McKesson can show a practice what it earns with us versus its incumbent."}</p>
        </div>
        <div style={{ marginTop: 24 }}><SiqHeroTiles /></div>
        <nav aria-label="SavingsIQ page sections" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
          {siqSections.map((section, index) => <BoltButton key={section.id} onClick={() => jump(section.id, index)} style={{ background: "transparent", padding: "8px 14px" }}><span style={{ color: SIQ_COLOR, fontFamily: MONO }}>{"0" + (index + 1)}</span><span>{section.label}</span><BoltIcon kind="down" /></BoltButton>)}
        </nav>
      </header>

      <section id="siq-why" aria-labelledby="bolt-01-title" style={sectionStyle}>
        <SectionTitle icon="briefcase" num="01" label="Why" title="The deciding artifact takes three weeks" sub="When McKesson competes for an oncology practice, the deciding artifact is an economic comparison. Today it takes weeks of cross-functional work and lands as a static spreadsheet." color={SIQ_COLOR} />
        <Reveal><SiqCompare /></Reveal>
      </section>

      <section id="siq-how" aria-labelledby="bolt-02-title" style={sectionStyle}>
        <SectionTitle icon="layers" num="02" label="How" title="From purchase data to a defensible number" sub="Contract rules that lived in analysts' heads are encoded once and applied every time." color={SIQ_COLOR} />
        <Reveal><SiqPipeline /></Reveal>
      </section>

      <section id="siq-try" aria-labelledby="bolt-03-title" style={sectionStyle}>
        <SectionTitle icon="target" num="03" label="Try it" title="Every rate is checked. Every scenario is honest." sub="Two rules that took subject-matter experts to get right: a three-state ceiling check, and a program rule that only moves the products a program actually covers." color={SIQ_COLOR} />
        <Reveal><SiqCeilingDemo /></Reveal>
        <div style={{ height: 16 }} />
        <Reveal><SiqScenarioDemo /></Reveal>
      </section>

      <section id="siq-trust" aria-labelledby="bolt-04-title" style={sectionStyle}>
        <SectionTitle icon="shield" num="04" label="Trust" title="Built to be audited" sub="Pricing guarantees can depend on these numbers, so the engine is designed to be traceable, isolated and tested." color={SIQ_COLOR} />
        <Reveal><SiqTrust /></Reveal>
      </section>

      <section id="siq-next" aria-labelledby="bolt-05-title" style={sectionStyle}>
        <SectionTitle icon="trend" num="05" label="Next" title="From prototype to platform" sub="A working, validated prototype built with Claude Code, now handed to the Bolt team to build out. Customer-facing use follows compliance approval." color={SIQ_COLOR} />
        <Reveal><SiqNext /></Reveal>
      </section>

      <footer style={{ marginTop: 48, paddingTop: 28, borderTop: "1px solid rgba(184,200,218,0.25)", display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ flex: "1 1 480px", fontSize: 18, color: "#D0DAE6", margin: 0, lineHeight: 1.6 }}><strong style={{ color: "#FFFFFF" }}>{"A competitive differentiator for GPO."}</strong>{" Prototyped with Claude Code, carried forward on Bolt."}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <BoltButton onClick={() => onNavigate("bolt")} style={{ color: BOLT_COLOR, borderColor: BOLT_COLOR }}><span>Bolt PaaS</span><BoltIcon kind="arrow" /></BoltButton>
          <BoltButton onClick={() => onNavigate("dataplatform")} style={{ color: DP_COLOR, borderColor: DP_COLOR }}><span>Data Platform</span><BoltIcon kind="arrow" /></BoltButton>
          <BoltButton onClick={() => onNavigate("solutions")} style={{ color: "#93C5FD", borderColor: "#60A5FA" }}><span>All Solutions</span><BoltIcon kind="arrow" /></BoltButton>
        </div>
      </footer>
    </main>
  );
}

// ============================================================
// SOLUTION PAGE KIT
// ============================================================

// ============================================================
// SOLUTION PAGE KIT — shared modern layout for every solution page
// ============================================================

const solSectionStyle: React.CSSProperties = { marginTop: 56, paddingTop: 48, borderTop: "1px solid rgba(184,200,218,0.16)", scrollMarginTop: 84 };
const solVar = (color: string) => ({ "--sol": color } as React.CSSProperties);

function solJump(id: string, index: number) {
  document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
  document.getElementById(`bolt-0${index + 1}-title`)?.focus({ preventScroll: true });
}

function SolPage({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <main id={id} style={{ maxWidth: 1100, margin: "0 auto", padding: "40px clamp(16px, 2.5vw, 24px) 48px", color: "#E2EAF2", fontSize: 16, lineHeight: 1.5 }}>
      <style>{BOLT_CSS}</style>
      {children}
    </main>
  );
}

type SolTile = { head: string; label: string; sub: string };

function SolHero({ eyebrow, name, status, statusColor = "#B8C8DA", color, line1, line2, tiles, sections, visual }: { eyebrow: string; name: string; status?: string; statusColor?: string; color: string; line1: string; line2: string; tiles: SolTile[]; sections: { id: string; label: string }[]; visual?: React.ReactNode }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.2);
  return (
    <header style={{ position: "relative", marginBottom: 8 }}>
      <div aria-hidden="true" style={{ position: "absolute", top: -40, left: 0, right: 0, height: 320, pointerEvents: "none", backgroundImage: "radial-gradient(rgba(184,200,218,0.2) 1px, transparent 1.2px)", backgroundSize: "22px 22px", WebkitMaskImage: "radial-gradient(ellipse 60% 80% at 80% 30%, black 10%, transparent 75%)", maskImage: "radial-gradient(ellipse 60% 80% at 80% 30%, black 10%, transparent 75%)" }} />
      <div style={{ position: "relative", display: "flex", gap: "16px 32px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 520px", minWidth: 0, maxWidth: visual ? undefined : 780 }}>
          <p style={{ margin: "0 0 8px", fontFamily: MONO, fontSize: 13, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase", color }}>{eyebrow}</p>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "clamp(34px, 4vw, 44px)", letterSpacing: -0.8, fontWeight: 700, color: "#FFFFFF", margin: 0, lineHeight: 1.15 }}>{name}</h1>
            {status && <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: statusColor, background: `${statusColor}1F`, border: `1px solid ${statusColor}55`, borderRadius: 4, padding: "3px 8px" }}>{status}</span>}
          </div>
          <p style={{ fontSize: 22, color: "#FFFFFF", fontWeight: 600, margin: "14px 0 0", lineHeight: 1.4 }}>{line1}</p>
          <p style={{ fontSize: 18, color: "#D0DAE6", margin: "10px 0 0", lineHeight: 1.55 }}>{line2}</p>
        </div>
        {visual && <div style={{ flex: "0 1 380px", minWidth: 260, marginLeft: "auto" }}>{visual}</div>}
      </div>
      <div ref={ref} style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))", gap: 12 }}>
        {tiles.map((t, i) => (
          <div key={t.head + t.label} className="bolt-anim" style={{ background: "rgba(16,34,66,0.6)", border: `1px solid ${color}4D`, borderRadius: 12, padding: "22px 24px", boxShadow: inView ? `0 0 32px ${color}14` : "none", transition: "box-shadow 1s ease", ...(inView ? { animation: `boltRise 0.6s cubic-bezier(.2,.7,.2,1) ${i * 0.12}s both` } : { opacity: 0 }) }}>
            <p style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5, color, margin: 0, lineHeight: 1.15 }}>{t.head}</p>
            <p style={{ color: "#FFFFFF", fontSize: 17, fontWeight: 600, margin: "10px 0 3px" }}>{t.label}</p>
            <p style={{ fontSize: 15.5, color: "#B8C8DA", margin: 0 }}>{t.sub}</p>
          </div>
        ))}
      </div>
      <nav aria-label={`${name} page sections`} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
        {sections.map((section, index) => <BoltButton key={section.id} onClick={() => solJump(section.id, index)} style={{ background: "transparent", padding: "8px 14px" }}><span style={{ color, fontFamily: MONO }}>{"0" + (index + 1)}</span><span>{section.label}</span><BoltIcon kind="down" /></BoltButton>)}
      </nav>
    </header>
  );
}

function SolSection({ id, num, label, title, sub, icon, color, children }: { id: string; num: string; label: string; title: string; sub?: string; icon: BoltGlyph; color: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`bolt-${num}-title`} style={solSectionStyle}>
      <SectionTitle icon={icon} num={num} label={label} title={title} sub={sub} color={color} />
      <Reveal>{children}</Reveal>
    </section>
  );
}

// Drag-to-compare built from a before/after table
function SolSplit({ rows, color, todayTitle, newTitle, newLabel, label }: { rows: { dimension: string; before: string; after: string }[]; color: string; todayTitle: string; newTitle: string; newLabel: string; label: string }) {
  const eb = (c: string): React.CSSProperties => ({ fontFamily: MONO, fontSize: 13, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: c, margin: "0 0 6px" });
  const list = (good: boolean) => (
    <ul style={{ listStyle: "none", margin: "14px 0 0", padding: 0, display: "grid", gap: 12 }}>
      {rows.map((r) => (
        <li key={r.dimension} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 3 }}>{good ? <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M7 7l10 10M17 7 7 17" fill="none" stroke="#F87171" strokeWidth="2.4" strokeLinecap="round" />}</svg>
          <span style={{ minWidth: 0 }}>
            <span style={{ display: "block", fontSize: 12.5, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: "#7F93AE" }}>{r.dimension}</span>
            <span style={{ display: "block", fontSize: 15, color: good ? "#E2EAF2" : "#D0DAE6", lineHeight: 1.4 }}>{good ? r.after : r.before}</span>
          </span>
        </li>
      ))}
    </ul>
  );
  const left = <div><p style={eb("#B8C8DA")}>{"Today"}</p><h3 style={{ fontSize: 19, color: "#FFFFFF", margin: 0 }}>{todayTitle}</h3>{list(false)}</div>;
  const right = <div><p style={eb(color)}>{newLabel}</p><h3 style={{ fontSize: 19, color: "#FFFFFF", margin: 0 }}>{newTitle}</h3>{list(true)}</div>;
  return <SplitCompareShell left={left} right={right} accent={color} label={label} />;
}

// Steps that light in sequence
function SolSteps({ steps, color, big = false }: { steps: { title: string; sub: string; icon?: BoltGlyph; nick?: string }[]; color: string; big?: boolean }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.3);
  return (
    <div ref={ref} style={solVar(color)}>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${steps.length > 5 ? 160 : 180}px), 1fr))`, gap: 10 }}>
        {steps.map((st, i) => (
          <li key={st.title} className="bolt-anim" style={{ borderRadius: 12, padding: big ? "18px 16px" : "16px 14px", background: `${color}0F`, border: `1px solid ${color}40`, ...(inView ? { animation: `boltIn 0.4s ease-out ${i * 0.08}s both, solGlow 6s ease-in-out ${0.8 + i * 0.45}s infinite` } : { opacity: 0 }) }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span aria-hidden="true" style={{ display: "inline-flex", width: 34, height: 34, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: `${color}24` }}><BoltGlyphIcon kind={st.icon || "bolt"} size={18} color={color} /></span>
              <span style={{ fontFamily: MONO, fontSize: 13, color }}>{"0" + (i + 1)}</span>
            </div>
            <p style={{ margin: 0, fontSize: big ? 18 : 16, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3 }}>{st.title}</p>
            {st.nick && <p style={{ margin: "2px 0 0", fontSize: 13.5, fontWeight: 600, color }}>{st.nick}</p>}
            <p style={{ margin: "6px 0 0", fontSize: big ? 15 : 14, color: "#B8C8DA", lineHeight: 1.45 }}>{st.sub}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Selectable tabs with an animated detail panel
function SolTabs({ items, color }: { items: { name: string; color?: string; status?: string; statusColor?: string; description: string; highlights: string[] }[]; color: string }) {
  const [active, setActive] = useState(0);
  const sel = items[active];
  const c = sel.color || color;
  return (
    <div>
      <div role="tablist" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {items.map((it, i) => {
          const on = i === active;
          const ic = it.color || color;
          return (
            <button key={it.name} type="button" role="tab" aria-selected={on} onClick={() => setActive(i)} style={{ fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 700, padding: "9px 14px", borderRadius: 9, cursor: "pointer", border: `1.5px solid ${on ? ic : "rgba(184,200,218,0.25)"}`, background: on ? `${ic}22` : "rgba(16,34,66,0.6)", color: on ? "#FFFFFF" : "#D0DAE6", boxShadow: on ? `0 0 16px ${ic}44` : "none", transition: "all 0.2s ease" }}>
              <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: ic }} />{it.name}
              {it.status && <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: it.statusColor || "#B8C8DA", border: `1px solid ${(it.statusColor || "#B8C8DA")}66`, borderRadius: 4, padding: "1px 6px" }}>{it.status}</span>}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" key={sel.name} className="bolt-anim" style={{ marginTop: 12, borderRadius: 14, padding: "20px 24px", background: `linear-gradient(160deg, ${c}14, rgba(16,34,66,0.65) 60%)`, border: `1px solid ${c}55`, animation: "boltIn 0.35s ease-out both" }}>
        <p style={{ margin: "0 0 14px", fontSize: 17, color: "#E2EAF2", lineHeight: 1.6, maxWidth: 860 }}>{sel.description}</p>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "8px 20px" }}>
          {sel.highlights.map((h, k) => (
            <li key={h} className="bolt-anim" style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 15, color: "#E2EAF2", lineHeight: 1.45, animation: `boltIn 0.3s ease-out ${0.08 + k * 0.05}s both` }}>
              <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 3 }}><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke={c} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>{h}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Glide Platform connections: intelligence services, data domains, extra card
function SolPlatform({ color, intelligence, data, extra, onNavigate }: { color: string; intelligence: string[]; data: string[]; extra?: { title: string; text: string; label: string; target: string; linkColor: string }; onNavigate: Navigate }) {
  const card = (title: string, body: React.ReactNode, link: React.ReactNode) => (
    <div style={{ borderRadius: 14, padding: "18px 20px", background: "rgba(16,34,66,0.6)", border: "1px solid rgba(184,200,218,0.2)", display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ margin: 0, fontFamily: MONO, fontSize: 12.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA" }}>{title}</p>
      <div style={{ flex: 1 }}>{body}</div>
      <div>{link}</div>
    </div>
  );
  const chips = (items: string[], colorFor: (s: string) => string) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {items.map((d) => { const cc = colorFor(d); return <span key={d} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, color: "#E2EAF2", background: `${cc}1A`, border: `1px solid ${cc}55`, borderRadius: 999, padding: "5px 12px" }}><span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: cc }} />{d}</span>; })}
    </div>
  );
  const domainColor = (name: string) => (dataLayer.find((d) => d.title === name) || { color: DP_COLOR }).color;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 12 }}>
      {intelligence.length > 0 && card("Built on Bolt · intelligence services", chips(intelligence, () => color), <BoltButton onClick={() => onNavigate("bolt")} style={{ color: BOLT_COLOR, borderColor: BOLT_COLOR, padding: "8px 14px" }}><span>Bolt PaaS</span><BoltIcon kind="arrow" /></BoltButton>)}
      {data.length > 0 && card("Data Platform · governed domains", chips(data, domainColor), <BoltButton onClick={() => onNavigate("dataplatform")} style={{ color: DP_COLOR, borderColor: DP_COLOR, padding: "8px 14px" }}><span>Data Platform</span><BoltIcon kind="arrow" /></BoltButton>)}
      {extra && card(extra.title, <p style={{ margin: 0, fontSize: 15.5, color: "#E2EAF2", lineHeight: 1.55 }}>{extra.text}</p>, <BoltButton onClick={() => onNavigate(extra.target)} style={{ color: extra.linkColor, borderColor: extra.linkColor, padding: "8px 14px" }}><span>{extra.label}</span><BoltIcon kind="arrow" /></BoltButton>)}
    </div>
  );
}

function SolFooter({ strong, text, onNavigate, cta = { label: "All Solutions", target: "solutions", color: "#93C5FD" } }: { strong: string; text: string; onNavigate: Navigate; cta?: { label: string; target: string; color: string } }) {
  return (
    <footer style={{ marginTop: 48, paddingTop: 28, borderTop: "1px solid rgba(184,200,218,0.25)", display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
      <p style={{ flex: "1 1 480px", fontSize: 18, color: "#D0DAE6", margin: 0, lineHeight: 1.6 }}><strong style={{ color: "#FFFFFF" }}>{strong}</strong>{" " + text}</p>
      <BoltButton onClick={() => onNavigate(cta.target)} style={{ color: cta.color, borderColor: cta.color }}><span>{cta.label}</span><BoltIcon kind="arrow" /></BoltButton>
    </footer>
  );
}


// ============================================================
// TITAN PAGE (modern)
// ============================================================

const TITAN_COLOR = "#F59E0B";
const titanStepIcons: BoltGlyph[] = ["eye", "list", "layers", "shield", "app"];

function TitanDetectDemo() {
  const [detected, setDetected] = useState(false);
  const rows = [{ k: "Payer", v: "Sample Commercial Plan" }, { k: "Drug class", v: "Long-acting G-CSF" }, { k: "Preferred", v: "Biosimilar products (Appendix B)" }, { k: "Step therapy", v: "Required before reference product" }, { k: "Exception", v: "Clinical exception allowed" }, { k: "Effective", v: "First of next month" }];
  return (
    <Card style={{ padding: "clamp(16px, 2.5vw, 24px)" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h3 style={{ margin: 0, fontSize: 20, color: "#FFFFFF" }}>Policy change detected</h3>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#93C5FD", border: "1px solid rgba(147,197,253,0.4)", borderRadius: 5, padding: "2px 8px" }}>{"Illustrative"}</span>
        </div>
        <BoltButton onClick={() => setDetected(!detected)} style={detected ? { background: "transparent" } : { background: TITAN_COLOR, color: "#0B1A33", borderColor: TITAN_COLOR }}><span>{detected ? "Reset" : "Run detection"}</span>{!detected && <BoltIcon kind="arrow" />}</BoltButton>
      </div>
      <div className="bolt-harness" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)", gap: 12, alignItems: "stretch" }}>
        <div style={{ background: "#071226", border: "1px solid rgba(184,200,218,0.2)", borderRadius: 12, padding: "16px 18px", position: "relative", overflow: "hidden" }}>
          <p style={{ margin: "0 0 10px", fontSize: 12.5, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA" }}>{"Payer policy document (excerpt)"}</p>
          <p style={{ margin: 0, fontFamily: MONO, fontSize: 13.5, color: "#B8C8DA", lineHeight: 1.75 }}>{"Sample Commercial Plan, Medical Drug Policy, Section 4.2 (revised). Coverage of reference long-acting G-CSF products requires documented trial and failure of a preferred biosimilar unless a clinical exception applies. Preferred products are listed in Appendix B. Changes take effect on the first day of the following month."}</p>
          {detected && <span aria-hidden="true" className="bolt-anim" style={{ position: "absolute", left: 0, right: 0, height: 40, background: `linear-gradient(transparent, ${TITAN_COLOR}33, transparent)`, animation: "titanScan 1.2s ease-in-out 1 both" }} />}
        </div>
        <span aria-hidden="true" className="bolt-harness-arrow" style={{ alignSelf: "center", display: "inline-flex", width: 36, height: 36, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: detected ? `${TITAN_COLOR}2A` : "rgba(184,200,218,0.06)", border: `1px solid ${detected ? TITAN_COLOR : "rgba(184,200,218,0.25)"}`, transition: "all 0.3s ease" }}>
          <svg width="16" height="16" viewBox="0 0 24 24"><path d="M4 12h16m-6-6 6 6-6 6" fill="none" stroke={detected ? TITAN_COLOR : "#7F93AE"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        <div aria-live="polite" style={{ background: detected ? `${TITAN_COLOR}10` : "rgba(16,34,66,0.5)", border: `1px solid ${detected ? TITAN_COLOR + "66" : "rgba(184,200,218,0.15)"}`, borderRadius: 12, padding: "16px 18px", transition: "all 0.3s ease" }}>
          <p style={{ margin: "0 0 12px", fontSize: 12.5, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: detected ? TITAN_COLOR : "#B8C8DA" }}>{"Structured coverage rule"}</p>
          {detected ? (
            <div style={{ display: "grid", gap: 9 }}>
              {rows.map((row, i) => (
                <div key={row.k} className="bolt-anim" style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 10, animation: `boltIn 0.35s ease-out ${0.9 + i * 0.15}s both` }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: "#B8C8DA" }}>{row.k}</span>
                  <span style={{ fontSize: 15, color: "#FFFFFF" }}>{row.v}</span>
                </div>
              ))}
            </div>
          ) : <p style={{ margin: 0, fontSize: 15, color: "#B8C8DA" }}>{"Run detection to see Titan turn the document into a structured coverage rule."}</p>}
        </div>
      </div>
      <p style={{ margin: "12px 0 0", fontSize: 13, color: "#7F93AE" }}>{"Illustrative payer and policy text. Not a real policy."}</p>
    </Card>
  );
}

function TitanPage({ onNavigate }: { onNavigate: Navigate }) {
  const sections = [{ id: "ti-why", label: "Why" }, { id: "ti-how", label: "How" }, { id: "ti-see", label: "See it" }, { id: "ti-platform", label: "Platform" }];
  return (
    <SolPage id="titan-page">
      <SolHero eyebrow="Solutions · Payer policy intelligence" name="Titan" status="Live" statusColor="#10B981" color={TITAN_COLOR}
        line1="The right drug, verified before treatment, not after a denial."
        line2="Titan continuously monitors formularies, step therapy requirements and preferred drug lists across oncology drugs and biosimilars, ending the quarterly manual grind of tracking payer policy."
        tiles={[{ head: "24/7", label: "Payer surveillance", sub: "Oncology drugs and biosimilars" }, { head: "Structured", label: "Formulary + step therapy", sub: "Rules extracted automatically" }, { head: "UI + API", label: "Delivered where needed", sub: "Clean interface and real-time API" }]}
        sections={sections} />
      <SolSection id="ti-why" num="01" label="Why" title="Policy changes don't wait for the quarter" sub="Payer policies shift mid-quarter. Checking them by hand means treatment decisions are made on information that may already be out of date." icon="eye" color={TITAN_COLOR}>
        <SolSplit rows={titanBeforeAfter} color={TITAN_COLOR} todayTitle="Quarterly, manual policy checks" newTitle="Continuous, verified coverage intelligence" newLabel="With Titan" label="Divider between manual policy tracking and Titan" />
      </SolSection>
      <SolSection id="ti-how" num="02" label="How" title="From messy documents to verified rules" sub="Five stages run continuously, so practices act on current coverage information." icon="layers" color={TITAN_COLOR}>
        <SolSteps color={TITAN_COLOR} steps={titanStages.map((s, i) => ({ title: s.stage, nick: s.nickname, sub: s.desc, icon: titanStepIcons[i] }))} />
      </SolSection>
      <SolSection id="ti-see" num="03" label="See it" title="A policy update, structured in seconds" sub="Titan reads the revised policy and turns it into a rule a practice can act on." icon="target" color={TITAN_COLOR}>
        <TitanDetectDemo />
      </SolSection>
      <SolSection id="ti-platform" num="04" label="Platform" title="On the Glide Platform" sub="Titan runs on Bolt, draws on governed data domains, and feeds other solutions." icon="link" color={TITAN_COLOR}>
        <SolPlatform color={TITAN_COLOR} intelligence={["Agents", "AI Prompting Tools"]} data={["Payer Policy Surveillance", "Biosimilar Utilization"]} extra={{ title: "Feeds", text: "Titan's payer policy intelligence is a live data source for " + PRACTICE_NAME + "'s partnership reviews.", label: PRACTICE_NAME, target: "skynet", linkColor: "#F87171" }} onNavigate={onNavigate} />
      </SolSection>
      <SolFooter strong="Removes administrative barriers for cancer patients." text="The right drug is verified before treatment, not after a denial." onNavigate={onNavigate} />
    </SolPage>
  );
}

// ============================================================
// NOVA + X-RAY PAGE (modern)
// ============================================================

const NOVA_COLOR = "#34D399";

function XrayEconomics() {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  return (
    <div>
      <div style={{ background: "rgba(16,34,66,0.8)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: "12px 12px 0 0", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", borderBottom: "2px solid #10B981" }}>
        <div><div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", letterSpacing: 0.3 }}>{"KEYTRUDA 25MG/ML 4ML SDV 2/PAC"}</div><div style={{ fontSize: 14, color: "#B8C8DA", marginTop: 2 }}>{"Sample oncology practice"}</div></div>
        <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: "#10B981", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 6, padding: "4px 12px" }}>{"Onmark"}</span>
      </div>
      <div className="xray-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)", gap: 0, background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.12)", borderTop: "none", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
        <div style={{ padding: "24px", borderRight: "1px solid rgba(148,163,184,0.08)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA", alignSelf: "flex-start", marginBottom: 16 }}>{"Net price breakdown"}</div>
          <div style={{ position: "relative", width: 220, height: 220, margin: "8px 0 20px" }}>
            <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", overflow: "visible" }}>
              {(() => { const cxD = 100, cyD = 100, r = 80, r2 = 55, total = 12272; const segments = [{ value: 11320.98, color: "#1E3A5F" }, { value: 369.39, color: "#F59E0B" }, { value: 59.51, color: "#3B82F6" }, { value: 522.12, color: "#10B981" }]; let angle = -90; return segments.map((seg, i) => { const sweep = (seg.value / total) * 360; const startRad = (angle * Math.PI) / 180; const endRad = ((angle + sweep) * Math.PI) / 180; const largeArc = sweep > 180 ? 1 : 0; const x1o = cxD + r * Math.cos(startRad), y1o = cyD + r * Math.sin(startRad); const x2o = cxD + r * Math.cos(endRad), y2o = cyD + r * Math.sin(endRad); const x1i = cxD + r2 * Math.cos(endRad), y1i = cyD + r2 * Math.sin(endRad); const x2i = cxD + r2 * Math.cos(startRad), y2i = cyD + r2 * Math.sin(startRad); const d = `M ${x1o} ${y1o} A ${r} ${r} 0 ${largeArc} 1 ${x2o} ${y2o} L ${x1i} ${y1i} A ${r2} ${r2} 0 ${largeArc} 0 ${x2i} ${y2i} Z`; const isHovered = hoveredSegment === i; angle += sweep; return <path key={i} d={d} fill={seg.color} opacity={hoveredSegment !== null && !isHovered ? 0.4 : 1} style={{ transition: "opacity 0.2s ease, transform 0.2s ease", cursor: "pointer", transformOrigin: "100px 100px", transform: isHovered ? "scale(1.04)" : "scale(1)" }} onMouseEnter={() => setHoveredSegment(i)} onMouseLeave={() => setHoveredSegment(null)} />; }); })()}
            </svg>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
              {hoveredSegment !== null ? (<><div style={{ fontSize: 12, color: ["#93A9C2", "#F59E0B", "#3B82F6", "#10B981"][hoveredSegment], fontFamily: MONO, fontWeight: 600 }}>{["Net Price", "Contract Discount", "Distributor Discount", "Rebates & Incentives"][hoveredSegment]}</div><div style={{ fontSize: 20, fontWeight: 700, color: "#FFFFFF", marginTop: 2 }}>{["$11,320.98", "-$369.39", "-$59.51", "-$522.12"][hoveredSegment]}</div><div style={{ fontSize: 12, color: "#B8C8DA" }}>{["92.25%", "3.01%", "0.48%", "4.25%"][hoveredSegment] + " of WAC"}</div></>) : (<><div style={{ fontSize: 12, color: "#B8C8DA", fontFamily: MONO }}>{"NET PRICE"}</div><div style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", marginTop: 2 }}>{"$11,320.98"}</div><div style={{ fontSize: 12, color: "#B8C8DA" }}>{"per unit"}</div></>)}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
            {[{ color: "#1E3A5F", label: "WAC (base)", value: "$12,272" }, { color: "#F59E0B", label: "Contract discount", value: "-$369.39" }, { color: "#3B82F6", label: "Distributor discount", value: "-$59.51" }, { color: "#10B981", label: "Rebates & incentives", value: "-$522.12" }].map((item, i) => (
              <div key={item.label} onMouseEnter={() => setHoveredSegment(i)} onMouseLeave={() => setHoveredSegment(null)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "4px 6px", borderRadius: 6, background: hoveredSegment === i ? `${item.color}22` : "transparent" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: item.color }} /><span style={{ fontSize: 15, color: "#D0DAE6" }}>{item.label}</span></div>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#E2EAF2", fontFamily: MONO }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "24px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA", marginBottom: 16 }}>{"Price waterfall: cost walk to net price"}</div>
          {[
            { k: "WAC price", s: "Wholesale acquisition cost, the starting point", v: "$12,272", p: "", neg: false },
            { k: "Contract price", s: "GPO / McKesson negotiated price", v: "$11,902.61", p: "3.01%", neg: false },
            { k: "Distributor discount", s: "Invoice markdown applied at distribution", v: "-$59.51", p: "0.50%", neg: true },
            { k: "Invoice price", s: "As billed on invoice", v: "$11,843.10", p: "", neg: false },
            { k: "Distributor rebate", s: "Annual rebate value", v: "-$171.72", p: "1.45%", neg: true },
            { k: "GPO rebate / value", s: "Quarterly rebate distribution", v: "-$350.39", p: "2.94%", neg: true },
          ].map((row, i) => (
            <div key={row.k} className="bolt-anim" style={{ padding: "11px 14px", background: i % 2 ? "rgba(16,34,66,0.4)" : "rgba(16,34,66,0.6)", border: "1px solid rgba(148,163,184,0.08)", borderTop: i ? "none" : undefined, borderRadius: i === 0 ? "8px 8px 0 0" : 0, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, animation: `boltIn 0.35s ease-out ${i * 0.08}s both` }}>
              <div><div style={{ fontSize: 15.5, fontWeight: 600, color: "#FFFFFF" }}>{row.k}</div><div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 2 }}>{row.s}</div></div>
              <div style={{ textAlign: "right" }}><span style={{ fontSize: 15.5, fontWeight: 700, color: row.neg ? "#F87171" : "#FFFFFF", fontFamily: MONO }}>{row.v}</span>{row.p && <div style={{ fontSize: 12.5, color: "#B8C8DA", fontFamily: MONO }}>{row.p}</div>}</div>
            </div>
          ))}
          <div style={{ padding: "13px 14px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "0 0 8px 8px", marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 15.5, fontWeight: 700, color: "#10B981" }}>{"NET PRICE / UNIT"}</span><span style={{ fontSize: 22, fontWeight: 700, color: "#10B981", fontFamily: MONO }}>{"$11,320.98"}</span></div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: 12, marginTop: 12 }}>
        {[{ label: "Net price / unit", value: "$11,320.98", sub: "After all discounts & rebates", hi: false }, { label: "Reimbursement / unit", value: "$11,945.20", sub: "ASP benchmark", hi: false }, { label: "Net cost recovery", value: "$624.22", sub: "Reimbursement minus net price", hi: true }, { label: "Effective discount vs WAC", value: "7.75%", sub: "Combined discount rate", hi: false }].map((kpi) => (
          <div key={kpi.label} style={{ background: kpi.hi ? "rgba(16,185,129,0.1)" : "rgba(16,34,66,0.6)", border: `1px solid ${kpi.hi ? "rgba(16,185,129,0.3)" : "rgba(148,163,184,0.12)"}`, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", color: kpi.hi ? "#10B981" : "#B8C8DA", marginBottom: 8 }}>{kpi.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: kpi.hi ? "#10B981" : "#FFFFFF", fontFamily: MONO, lineHeight: 1 }}>{kpi.value}</div>
            <div style={{ fontSize: 13.5, color: "#B8C8DA", marginTop: 6 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NovaXrayPage({ onNavigate }: { onNavigate: Navigate }) {
  const sections = [{ id: "nx-two", label: "Two apps" }, { id: "nx-see", label: "See it" }, { id: "nx-road", label: "Roadmap" }, { id: "nx-platform", label: "Platform" }];
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.3);
  return (
    <SolPage id="novaxray-page">
      <SolHero eyebrow="Solutions · Pricing intelligence" name="Nova + X-Ray" status="Pilot" statusColor="#A78BFA" color={NOVA_COLOR}
        line1="Two applications, one shared view of drug economics."
        line2="X-Ray shows practices the full cost walk from WAC to net price and net cost recovery. Nova turns the same foundation into internal pricing intelligence for analysts and field teams."
        tiles={[{ head: "X-Ray", label: "Customer-facing transparency", sub: "WAC to net price, drug by drug" }, { head: "Nova 2.0", label: "Internal pricing engine", sub: "Replaces the Excel pricing model" }, { head: "One foundation", label: "Shared economics layer", sub: "Both built on the same data" }]}
        sections={sections} />
      <SolSection id="nx-two" num="01" label="Two apps" title="Built once, used two ways" sub="X-Ray and Nova share one economics layer, so customers and analysts see the same numbers." icon="layers" color={NOVA_COLOR}>
        <div ref={ref}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: 12 }}>
            {novaXrayProjects.map((p, i) => (
              <div key={p.id} className="bolt-anim" style={{ borderRadius: 14, padding: "20px 22px", background: `linear-gradient(165deg, ${p.color}16, rgba(16,34,66,0.7) 55%)`, border: `1px solid ${p.color}55`, borderTop: `3px solid ${p.color}`, ...(inView ? { animation: `boltRise 0.55s cubic-bezier(.2,.7,.2,1) ${i * 0.15}s both` } : { opacity: 0 }) }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <h3 style={{ margin: 0, fontSize: 21, color: "#FFFFFF" }}>{p.name}</h3>
                  <span style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 600, color: "#A78BFA", border: "1px solid rgba(167,139,250,0.45)", borderRadius: 4, padding: "2px 7px" }}>{p.status}</span>
                </div>
                <p style={{ margin: "4px 0 12px", fontSize: 14.5, fontWeight: 600, color: p.color }}>{p.id === "nova" ? "Internal pricing intelligence engine" : p.tagline}</p>
                <p style={{ margin: "0 0 14px", fontSize: 15, color: "#D0DAE6", lineHeight: 1.55 }}>{p.description}</p>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 7 }}>
                  {p.capabilities.map((c) => <li key={c} style={{ display: "flex", gap: 9, fontSize: 14.5, color: "#E2EAF2", lineHeight: 1.45 }}><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 3 }}><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke={p.color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>{c}</li>)}
                </ul>
                <p style={{ margin: "14px 0 0", padding: "10px 12px", borderRadius: 8, background: `${p.color}12`, fontSize: 14.5, color: "#E2EAF2", lineHeight: 1.5 }}>{p.impact}</p>
              </div>
            ))}
          </div>
          <div className="bolt-anim" style={{ marginTop: 12, borderRadius: 12, padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, background: "rgba(16,185,129,0.08)", border: "1px dashed rgba(52,211,153,0.5)", ...(inView ? { animation: "boltIn 0.5s ease-out 0.5s both" } : { opacity: 0 }) }}>
            <BoltGlyphIcon kind="db" size={20} color={NOVA_COLOR} />
            <span style={{ fontSize: 15.5, fontWeight: 600, color: "#E2EAF2" }}>{"Shared economics layer: pricing, rebates and account data"}</span>
          </div>
        </div>
      </SolSection>
      <SolSection id="nx-see" num="02" label="See it" title="The full cost walk for one drug" sub="X-Ray proof of concept: drug economics for a single account. Hover the chart to explore each component." icon="chart" color={NOVA_COLOR}>
        <XrayEconomics />
      </SolSection>
      <SolSection id="nx-road" num="03" label="Roadmap" title="From bid comparison to pricing strategist" sub="Four phases, each building on the data foundation the last one laid." icon="trend" color={NOVA_COLOR}>
        <SolTabs color={NOVA_COLOR} items={phases.map((ph) => ({ name: ph.label + " · " + ph.title, color: ph.color, status: ph.status, statusColor: ph.statusColor, description: ph.summary, highlights: ph.highlights }))} />
      </SolSection>
      <SolSection id="nx-platform" num="04" label="Platform" title="On the Glide Platform" sub="Both apps draw on the same intelligence services and governed data domains." icon="link" color={NOVA_COLOR}>
        <SolPlatform color={NOVA_COLOR} intelligence={novaXrayIntelligence.map((l) => l.title)} data={novaXrayData.map((d) => d.title)} onNavigate={onNavigate} />
      </SolSection>
      <SolFooter strong="Pricing transparency for practices, pricing intelligence for McKesson." text="One foundation, two audiences." onNavigate={onNavigate} />
    </SolPage>
  );
}

// ============================================================
// MERIDIAN PAGE (modern)
// ============================================================

const MERIDIAN_COLOR = "#A78BFA";

const meridianBeforeAfter = [
  { dimension: "Market analysis", before: "Months of manual analysis per market", after: "AI-generated, 14-section board report in about 30 seconds" },
  { dimension: "Coverage", before: "A handful of markets studied at a time", after: "~2,500 ZIP codes scored on four domains" },
  { dimension: "Acquisition diligence", before: "Weeks of business-development legwork before an LOI", after: "Acquire / Investigate / Pass recommendation from target locations" },
  { dimension: "Questions", before: "Ad hoc data requests to analysts", after: "Ask Meridian in plain English for a sourced answer" },
];

const meridianZips = [
  { name: "ZIP A", scores: [88, 72, 40, 64] },
  { name: "ZIP B", scores: [62, 90, 70, 48] },
  { name: "ZIP C", scores: [75, 55, 85, 80] },
  { name: "ZIP D", scores: [50, 68, 60, 92] },
];

function MeridianScoreDemo() {
  const [w, setW] = useState([35, 30, 20, 15]);
  const total = w.reduce((a, b) => a + b, 0) || 1;
  const scored = meridianZips.map((z) => ({ ...z, score: Math.round(z.scores.reduce((s, v, i) => s + v * w[i], 0) / total) })).sort((a, b) => b.score - a.score);
  const order = meridianZips.map((z) => scored.findIndex((s) => s.name === z.name));
  const ROW = 52;
  return (
    <Card style={{ padding: "clamp(16px, 2.5vw, 24px)" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 20, color: "#FFFFFF" }}>Tune the scoring model</h3>
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#93C5FD", border: "1px solid rgba(147,197,253,0.4)", borderRadius: 5, padding: "2px 8px" }}>{"Illustrative ZIPs"}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 24 }}>
        <div style={{ display: "grid", gap: 14 }}>
          {meridianScoring.map((s, i) => (
            <label key={s.domain} style={{ display: "block" }}>
              <span style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 600, color: "#FFFFFF" }}><span>{s.domain}</span><span style={{ fontFamily: MONO, color: s.color }}>{Math.round((w[i] / total) * 100) + "%"}</span></span>
              <span style={{ display: "block", fontSize: 13, color: "#B8C8DA", margin: "2px 0 6px" }}>{s.direction}</span>
              <input type="range" min={0} max={60} value={w[i]} onChange={(e) => { const v = Number(e.target.value); setW((cur) => cur.map((x, k) => (k === i ? v : x))); }} aria-label={`${s.domain} weight`} style={{ width: "100%", accentColor: s.color }} />
            </label>
          ))}
          <BoltButton onClick={() => setW([35, 30, 20, 15])} style={{ background: "transparent", justifySelf: "start", padding: "6px 12px", minHeight: 36 }}><span>Reset to default weights</span></BoltButton>
        </div>
        <div>
          <p style={{ margin: "0 0 10px", fontFamily: MONO, fontSize: 12.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA" }}>{"Composite ranking"}</p>
          <div style={{ position: "relative", height: meridianZips.length * ROW }}>
            {meridianZips.map((z, i) => {
              const s = scored[order[i]];
              const tier = order[i] === 0 ? "Tier 1" : order[i] === 1 ? "Tier 2" : "Tier 3";
              return (
                <div key={z.name} className="bolt-anim" style={{ position: "absolute", left: 0, right: 0, top: order[i] * ROW, height: ROW - 8, transition: "top 0.5s cubic-bezier(.2,.7,.2,1)", display: "grid", gridTemplateColumns: "28px 64px minmax(0, 1fr) 46px 64px", alignItems: "center", gap: 10, padding: "0 12px", borderRadius: 10, background: order[i] === 0 ? `${MERIDIAN_COLOR}22` : "rgba(16,34,66,0.6)", border: `1px solid ${order[i] === 0 ? MERIDIAN_COLOR : "rgba(184,200,218,0.18)"}` }}>
                  <span style={{ fontFamily: MONO, fontSize: 13, color: "#B8C8DA" }}>{"#" + (order[i] + 1)}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF" }}>{z.name}</span>
                  <span style={{ height: 10, borderRadius: 4, background: "rgba(184,200,218,0.1)", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: `${s.score}%`, background: MERIDIAN_COLOR, transition: "width 0.4s ease" }} /></span>
                  <span style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: "#FFFFFF", textAlign: "right" }}>{s.score}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: order[i] === 0 ? MERIDIAN_COLOR : "#B8C8DA", textAlign: "right" }}>{tier}</span>
                </div>
              );
            })}
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 13.5, color: "#B8C8DA", lineHeight: 1.5 }}>{"Shift the weights and the ranking re-sorts. In Meridian, weights are configurable, scenarios can be saved and compared, and tiers are recalibrated quarterly."}</p>
        </div>
      </div>
    </Card>
  );
}

function MeridianPage({ onNavigate }: { onNavigate: Navigate }) {
  const sections = [{ id: "me-why", label: "Why" }, { id: "me-score", label: "Scoring" }, { id: "me-modules", label: "Modules" }, { id: "me-under", label: "Under the hood" }, { id: "me-trust", label: "Trust" }];
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.2);
  return (
    <SolPage id="meridian-page">
      <SolHero eyebrow="Solutions · Oncology expansion intelligence" name="Meridian" status="Live" statusColor="#10B981" color={MERIDIAN_COLOR}
        line1="Months of market analysis, turned into a 30-second board report."
        line2="Meridian scores ZIP codes across six southeastern states to find the best places to expand oncology services, assess acquisitions and model consolidation."
        tiles={[{ head: "~2,500", label: "ZIP codes scored", sub: "Across 6 southeastern states" }, { head: "4,500+", label: "Oncology providers", sub: "Loaded from the national registry" }, { head: "~30 sec", label: "AI market report", sub: "14 sections, fully sourced" }]}
        sections={sections} />
      <SolSection id="me-why" num="01" label="Why" title="Expansion decisions, made in days instead of months" sub="Where to open, acquire or consolidate used to take months of manual analysis." icon="target" color={MERIDIAN_COLOR}>
        <SolSplit rows={meridianBeforeAfter} color={MERIDIAN_COLOR} todayTitle="Manual market analysis" newTitle="Scored, explainable market intelligence" newLabel="With Meridian" label="Divider between manual market analysis and Meridian" />
      </SolSection>
      <SolSection id="me-score" num="02" label="Scoring" title="Every ZIP code, scored on four domains" sub="Demand, access, competition and financial viability combine into one composite score." icon="chart" color={MERIDIAN_COLOR}>
        <MeridianScoreDemo />
      </SolSection>
      <SolSection id="me-modules" num="03" label="Modules" title="Seven modules, one decision surface" sub="From the market map to AI-generated reports." icon="app" color={MERIDIAN_COLOR}>
        <SolTabs color={MERIDIAN_COLOR} items={meridianPages.map((p) => ({ name: p.name, color: p.color, description: p.description, highlights: p.highlights }))} />
      </SolSection>
      <SolSection id="me-under" num="04" label="Under the hood" title="Spatial analysis, real drive times and AI" sub="Public data sources refreshed on a schedule, combined with routing, scoring and generation engines." icon="layers" color={MERIDIAN_COLOR}>
        <div ref={ref}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))", gap: 12 }}>
            {meridianIntelligence.map((l, i) => (
              <div key={l.id} className="bolt-anim" style={{ borderRadius: 12, padding: "16px 18px", background: "rgba(16,34,66,0.6)", border: `1px solid ${l.color}55`, borderTop: `3px solid ${l.color}`, ...(inView ? { animation: `boltRise 0.5s cubic-bezier(.2,.7,.2,1) ${i * 0.1}s both` } : { opacity: 0 }) }}>
                <p style={{ margin: 0, fontSize: 16.5, fontWeight: 700, color: "#FFFFFF" }}>{l.title}</p>
                <p style={{ margin: "2px 0 10px", fontFamily: MONO, fontSize: 12.5, color: "#B8C8DA" }}>{l.subtitle}</p>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 }}>{l.capabilities.map((c) => <li key={c} style={{ display: "flex", gap: 8, fontSize: 14, color: "#E2EAF2", lineHeight: 1.45 }}><span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: "50%", background: l.color, marginTop: 7, flexShrink: 0 }} />{c}</li>)}</ul>
              </div>
            ))}
          </div>
          <p style={{ margin: "20px 0 10px", fontFamily: MONO, fontSize: 12.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA" }}>{"Data sources"}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {meridianData.map((d, i) => (
              <span key={d.id} className="bolt-anim" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, color: "#E2EAF2", background: `${d.color}14`, border: `1px solid ${d.color}55`, borderRadius: 999, padding: "6px 12px", ...(inView ? { animation: `boltPop 0.35s ease-out ${0.5 + i * 0.07}s both` } : { opacity: 0 }) }}>
                <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: d.color }} />{d.title}<span style={{ fontFamily: MONO, fontSize: 11.5, color: "#B8C8DA" }}>{d.refresh}</span>
              </span>
            ))}
          </div>
        </div>
      </SolSection>
      <SolSection id="me-trust" num="05" label="Trust" title="Built for sensitive healthcare data" sub="Claims data and provider information are handled under strict controls." icon="shield" color={MERIDIAN_COLOR}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 12 }}>
          {["Row-level security on all 23 tables with org-scoped isolation", "HIPAA Safe Harbor enforcement (k ≥ 5 anonymity threshold)", "4-tier data classification (Restricted / Confidential / Internal / Public)", "CMS Data Use Agreement compliance for claims data", "Invite-only access with signups disabled", "Audit logging on claims access, exports and scenario changes"].map((item) => (
            <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", borderRadius: 12, padding: "14px 16px", background: "rgba(16,34,66,0.6)", border: "1px solid rgba(167,139,250,0.3)" }}>
              <BoltGlyphIcon kind="shield" size={18} color={MERIDIAN_COLOR} /><span style={{ fontSize: 15, color: "#E2EAF2", lineHeight: 1.45 }}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}><SolPlatform color={MERIDIAN_COLOR} intelligence={["Claude API (Sonnet)", "Spatial analysis", "Routing engine", "Scoring models"]} data={[]} onNavigate={onNavigate} /></div>
      </SolSection>
      <SolFooter strong="Expansion strategy, grounded in data." text="Where demand, access, competition and economics meet." onNavigate={onNavigate} />
    </SolPage>
  );
}

// ============================================================
// PRACTICEIQ PAGE (modern; formerly Skynet)
// ============================================================

const PIQ_COLOR = "#F87171";

const piqQuestions: { q: string; a: string; rows: { k: string; v: string; pct: number }[] }[] = [
  { q: "What are my top 5 drugs by NCR?", a: "Top 5 drugs by net cost recovery this quarter", rows: [{ k: "Keytruda", v: "$41.2K", pct: 100 }, { k: "Darzalex IV", v: "$28.7K", pct: 70 }, { k: "Opdivo", v: "$19.4K", pct: 47 }, { k: "Imfinzi", v: "$11.8K", pct: 29 }, { k: "Injectafer", v: "$9.6K", pct: 23 }] },
  { q: "Compare Q3 vs Q4 biosimilar adoption", a: "Biosimilar adoption by quarter", rows: [{ k: "Q3", v: "81%", pct: 81 }, { k: "Q4", v: "88%", pct: 88 }, { k: "Target", v: "95%", pct: 95 }] },
  { q: "Which providers have the highest waste?", a: "Non-billable waste by provider, this quarter", rows: [{ k: "Provider 1", v: "$6.1K", pct: 100 }, { k: "Provider 2", v: "$4.3K", pct: 70 }, { k: "Provider 3", v: "$2.9K", pct: 48 }] },
  { q: "Show GPO rebate trend by quarter", a: "Performance rebates by quarter", rows: [{ k: "Q1", v: "$198K", pct: 74 }, { k: "Q2", v: "$212K", pct: 79 }, { k: "Q3", v: "$231K", pct: 86 }, { k: "Q4", v: "$268K", pct: 100 }] },
];

function PiqAskDemo() {
  const [active, setActive] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (active === null) return;
    const q = piqQuestions[active].q;
    setReady(false);
    if (prefersReducedMotion()) { setTyped(q); setReady(true); return; }
    let i = 0;
    setTyped("");
    const id = window.setInterval(() => { i += 1; setTyped(q.slice(0, i)); if (i >= q.length) { window.clearInterval(id); window.setTimeout(() => setReady(true), 450); } }, 22);
    return () => window.clearInterval(id);
  }, [active]);
  const sel = active !== null ? piqQuestions[active] : null;
  return (
    <Card style={{ padding: "clamp(16px, 2.5vw, 24px)" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 20, color: "#FFFFFF" }}>Ask anything</h3>
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#93C5FD", border: "1px solid rgba(147,197,253,0.4)", borderRadius: 5, padding: "2px 8px" }}>{"Illustrative answers"}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#071226", border: `1px solid ${PIQ_COLOR}55`, borderRadius: 10, minHeight: 50, fontFamily: MONO, fontSize: 14.5, color: "#FFFFFF" }}>
        <BoltGlyphIcon kind="target" size={18} color={PIQ_COLOR} />
        {sel ? typed : <span style={{ color: "#7F93AE" }}>{"Pick a question below to see it answered from live data"}</span>}
        {sel && !ready && <span className="bolt-anim" style={{ display: "inline-block", width: 8, height: "1.05em", background: PIQ_COLOR, animation: "boltBlink 1s steps(1) infinite" }} />}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "12px 0" }}>
        {piqQuestions.map((p, i) => <button key={p.q} type="button" onClick={() => setActive(i)} aria-pressed={active === i} style={{ fontFamily: "inherit", fontSize: 14, color: active === i ? "#FFFFFF" : PIQ_COLOR, background: active === i ? `${PIQ_COLOR}2A` : `${PIQ_COLOR}10`, border: `1px solid ${PIQ_COLOR}66`, borderRadius: 999, padding: "7px 14px", cursor: "pointer" }}>{p.q}</button>)}
      </div>
      <div aria-live="polite" style={{ minHeight: 150 }}>
        {sel && ready && (
          <div key={sel.q} className="bolt-anim" style={{ borderRadius: 12, padding: "16px 18px", background: "rgba(16,34,66,0.6)", border: "1px solid rgba(184,200,218,0.2)", animation: "boltIn 0.35s ease-out both" }}>
            <p style={{ margin: "0 0 4px", fontSize: 12.5, fontFamily: MONO, color: "#7F93AE" }}>{"Plain English → SQL → live data"}</p>
            <p style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>{sel.a}</p>
            <div style={{ display: "grid", gap: 8 }}>
              {sel.rows.map((r, k) => (
                <div key={r.k} style={{ display: "grid", gridTemplateColumns: "120px minmax(0, 1fr) 64px", gap: 10, alignItems: "center", fontSize: 14 }}>
                  <span style={{ color: "#E2EAF2" }}>{r.k}</span>
                  <span style={{ height: 10, borderRadius: 4, background: "rgba(184,200,218,0.1)", overflow: "hidden" }}><span className="bolt-anim" style={{ display: "block", height: "100%", width: `${r.pct}%`, background: PIQ_COLOR, transformOrigin: "left center", animation: `boltGrowX 0.6s cubic-bezier(.2,.7,.2,1) ${k * 0.08}s both` }} /></span>
                  <span style={{ fontFamily: MONO, fontWeight: 700, color: "#FFFFFF", textAlign: "right" }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function PracticeDashboard() {
  const [activeSection, setActiveSection] = useState(0);
  const sec = skynetSections[activeSection];
  return (
    <div>
      <div style={{ background: "rgba(16,34,66,0.75)", border: "1px solid rgba(148,163,184,0.15)", borderRadius: "12px 12px 0 0", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div><div style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>{"Springfield Medical Center"}</div><div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 2 }}>{"Q1 2026 · Powered by your McKesson partnership"}</div></div>
        <span style={{ fontSize: 12, color: "#B8C8DA", fontFamily: MONO }}>{"Sample practice · illustrative data"}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))" }}>
        {skynetKPIs.map((kpi) => (<div key={kpi.label} style={{ background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.1)", padding: "18px 20px" }}><div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA", marginBottom: 8 }}>{kpi.label}</div><div style={{ fontSize: 28, fontWeight: 700, color: kpi.color, fontFamily: MONO, lineHeight: 1 }}>{kpi.value}</div><div style={{ fontSize: 13.5, color: "#B8C8DA", marginTop: 6 }}>{kpi.sub}</div></div>))}
      </div>
      <div role="tablist" style={{ display: "flex", flexWrap: "wrap", background: "rgba(16,34,66,0.4)", border: "1px solid rgba(148,163,184,0.12)", borderTop: "none", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
        {skynetSections.map((s, i) => (<button key={s.id} type="button" role="tab" aria-selected={activeSection === i} onClick={() => setActiveSection(i)} style={{ flex: "1 1 120px", fontFamily: "inherit", padding: "12px 8px", background: activeSection === i ? `${s.color}18` : "transparent", border: "none", borderBottom: `2px solid ${activeSection === i ? s.color : "transparent"}`, cursor: "pointer", fontSize: 13, fontWeight: activeSection === i ? 700 : 500, color: activeSection === i ? "#FFFFFF" : "#B8C8DA" }}>{s.label}</button>))}
      </div>
      <div role="tabpanel" key={sec.id} className="bolt-anim" style={{ margin: "12px 0 0", background: `${sec.color}10`, border: `1px solid ${sec.color}44`, borderRadius: 12, padding: "16px 20px", animation: "boltIn 0.3s ease-out both" }}>
        <p style={{ margin: 0, fontSize: 15.5, color: "#E2EAF2", lineHeight: 1.6 }}><strong style={{ color: sec.color }}>{sec.label + ": "}</strong>{sec.description}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: 12, marginTop: 12 }}>
        <Card>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", marginBottom: 4 }}>{"Top 10 drugs by spend"}</div>
          <div style={{ fontSize: 13.5, color: "#B8C8DA", marginBottom: 12 }}>{"Quarter spend and change vs prior quarter"}</div>
          <div style={{ display: "grid", gap: 6 }}>
            {skynetTopDrugs.map((d, i) => { const max = 542800; const val = Number(d.spend.replace(/[$,]/g, "")); return (
              <div key={d.name} style={{ display: "grid", gridTemplateColumns: "100px minmax(0, 1fr) 76px 48px", gap: 8, alignItems: "center", fontSize: 13.5 }}>
                <span style={{ color: "#FFFFFF", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</span>
                <span style={{ height: 8, borderRadius: 4, background: "rgba(184,200,218,0.1)", overflow: "hidden" }}><span className="bolt-anim" style={{ display: "block", height: "100%", width: `${(val / max) * 100}%`, background: d.type === "IV" ? "#3B82F6" : "#10B981", transformOrigin: "left center", animation: `boltGrowX 0.6s ease ${i * 0.05}s both` }} /></span>
                <span style={{ fontFamily: MONO, color: "#E2EAF2", textAlign: "right" }}>{d.spend}</span>
                <span style={{ fontFamily: MONO, fontWeight: 700, color: d.change.startsWith("+") ? "#34D399" : "#F87171", textAlign: "right" }}>{d.change}</span>
              </div>
            ); })}
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 12.5, color: "#B8C8DA" }}><span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: "#3B82F6", marginRight: 6 }} />{"IV"}</span><span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: "#10B981", marginRight: 6 }} />{"MID"}</span></div>
        </Card>
        <Card>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", marginBottom: 4 }}>{"GPO savings overview"}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, margin: "6px 0 14px" }}><span style={{ fontFamily: MONO, fontSize: 32, fontWeight: 700, color: "#F59E0B" }}>{"$5.8M+"}</span><span style={{ fontSize: 14.5, color: "#D0DAE6" }}>{"Rebates and discounts"}</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {skynetGPO.map((g) => (<div key={g.category} style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, padding: "12px 14px" }}><div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "#B8C8DA", marginBottom: 6 }}>{g.category}</div><div style={{ fontFamily: MONO, fontSize: 19, fontWeight: 700, color: "#F59E0B", lineHeight: 1 }}>{g.value}</div><div style={{ fontSize: 12, color: "#B8C8DA", marginTop: 5 }}>{"Prior: " + g.prior}</div></div>))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function SkynetPage({ onNavigate }: { onNavigate: Navigate }) {
  const sections = [{ id: "pq-why", label: "Why" }, { id: "pq-see", label: "See it" }, { id: "pq-ask", label: "Ask" }, { id: "pq-platform", label: "Platform" }];
  return (
    <SolPage id="practiceiq-page">
      <SolHero eyebrow="Solutions · Dynamic QBR portal" name={PRACTICE_NAME} status="Pilot" statusColor="#A78BFA" color={PIQ_COLOR}
        line1="The quarterly business review, live instead of a static deck."
        line2="Brings data from six-plus sources into one interactive customer portal. Reps and practices explore any metric and ask questions in plain English, answered from live data."
        tiles={[{ head: "4–8 hrs → 15 min", label: "QBR prep per account", sub: "Review instead of build" }, { head: "6+", label: "Data sources unified", sub: "Purchases, GPO, MID, inventory, policy" }, { head: "Ask anything", label: "Plain English to SQL", sub: "Answers from live data" }]}
        sections={sections} />
      <SolSection id="pq-why" num="01" label="Why" title="From slide-building back to selling" sub="Every QBR used to mean hours of manual data gathering and PowerPoint assembly per account." icon="briefcase" color={PIQ_COLOR}>
        <SolSplit rows={skynetBeforeAfter} color={PIQ_COLOR} todayTitle="Static PowerPoint QBR" newTitle="A live, interactive customer portal" newLabel={"With " + PRACTICE_NAME} label={"Divider between the static QBR and " + PRACTICE_NAME} />
      </SolSection>
      <SolSection id="pq-see" num="02" label="See it" title="Eight sections, one partnership view" sub="Select a section to see what it covers. Sample practice and illustrative data." icon="chart" color={PIQ_COLOR}>
        <PracticeDashboard />
      </SolSection>
      <SolSection id="pq-ask" num="03" label="Ask" title="Ask the portal, not an analyst" sub="A plain-English question is converted to SQL, run against live data, and returned as an answer." icon="target" color={PIQ_COLOR}>
        <PiqAskDemo />
      </SolSection>
      <SolSection id="pq-platform" num="04" label="Platform" title="On the Glide Platform" sub="Powered by Bolt intelligence services and data from across the partnership, including Titan." icon="link" color={PIQ_COLOR}>
        <SolPlatform color={PIQ_COLOR} intelligence={["AI Prompting Tools", "Machine Learning", "Agents"]} data={["Distribution Pricing & Rebates", "GPO Rebates", "MID Data", "Biosimilar Utilization", "Inventory Management", "Payer Policy Surveillance"]} extra={{ title: "Fed by", text: "Titan's payer policy intelligence powers the policy and market section of every review.", label: "Titan", target: "titan", linkColor: TITAN_COLOR }} onNavigate={onNavigate} />
      </SolSection>
      <SolFooter strong="Hundreds of rep hours a quarter, redirected from slide-building to selling." text={"With 200+ accounts on quarterly cycles, " + PRACTICE_NAME + " turns QBR prep from hours into minutes."} onNavigate={onNavigate} />
    </SolPage>
  );
}

// ============================================================
// RETENTIONIQ PAGE
// ============================================================

const RIQ_COLOR = "#F472B6";

const riqBeforeAfter = [
  { dimension: "Finding at-risk patients", before: "Someone runs reports and works lists by hand", after: "A daily worklist of patients slipping out of care" },
  { dimension: "Missed appointments", before: "Often no follow-up", after: "Flagged automatically against the expected treatment interval" },
  { dimension: "Why a patient is at risk", before: "Unclear without digging through records", after: "Each flag explained with its risk factors" },
  { dimension: "Outreach", before: "Calls tracked in notes or spreadsheets", after: "Call outcome and barrier logged in one place" },
  { dimension: "Oversight", before: "Little visibility into retention trends", after: "Trends, at-risk breakdowns and lost-to-follow-up by physician" },
];

const riqSteps: { title: string; sub: string; icon: BoltGlyph }[] = [
  { title: "Expected interval", sub: "Administrators set treatment intervals by disease and drug", icon: "sliders" },
  { title: "Compare visits", sub: "Actual visits checked against each patient's interval", icon: "repeat" },
  { title: "Flag and explain", sub: "Patients slipping out of care flagged, with the reasons why", icon: "eye" },
  { title: "Worklist", sub: "Coordinators work a daily queue of at-risk patients", icon: "list" },
  { title: "Reach out and log", sub: "Call the patient, record the outcome and any barrier", icon: "person" },
  { title: "Watch the trend", sub: "Retention and lost-to-follow-up tracked over time", icon: "chart" },
];

const riqFactors = ["Overdue for injection", "No next visit booked", "Missed last visit", "Lengthening interval"];
const riqPatientsSeed: { id: string; init: string; factor: number; overdue: number }[] = [
  { id: "RX-1042", init: "J.M.", factor: 0, overdue: 21 }, { id: "RX-1187", init: "A.T.", factor: 0, overdue: 16 }, { id: "RX-1203", init: "L.K.", factor: 0, overdue: 9 },
  { id: "RX-1311", init: "D.P.", factor: 1, overdue: 12 }, { id: "RX-1350", init: "S.R.", factor: 1, overdue: 7 },
  { id: "RX-1422", init: "M.B.", factor: 2, overdue: 14 }, { id: "RX-1478", init: "C.W.", factor: 2, overdue: 6 },
  { id: "RX-1519", init: "E.H.", factor: 3, overdue: 5 },
];

function RetentionDemo() {
  const [factor, setFactor] = useState<number | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [outcome, setOutcome] = useState("Scheduled");
  const [barrier, setBarrier] = useState("Transportation");
  const [toast, setToast] = useState<string | null>(null);
  const remaining = riqPatientsSeed.filter((p) => !done.includes(p.id));
  const list = remaining.filter((p) => factor === null || p.factor === factor).sort((a, b) => b.overdue - a.overdue);
  const current = remaining.find((p) => p.id === open) || null;
  const saveNext = () => {
    if (!current) return;
    const nextList = list.filter((p) => p.id !== current.id);
    setDone((d) => [...d, current.id]);
    setToast(`${current.init} logged: ${outcome}${barrier !== "None" ? " · " + barrier : ""}`);
    window.setTimeout(() => setToast(null), 2200);
    setOpen(nextList.length ? nextList[0].id : null);
    setOutcome("Scheduled"); setBarrier("Transportation");
  };
  const reset = () => { setFactor(null); setDone([]); setOpen(null); setToast(null); };
  const sel: React.CSSProperties = { fontFamily: "inherit", fontSize: 14, color: "#FFFFFF", background: "#071226", border: "1px solid rgba(184,200,218,0.35)", borderRadius: 8, padding: "8px 10px", width: "100%" };
  return (
    <Card style={{ padding: "clamp(16px, 2.5vw, 24px)" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 20, color: "#FFFFFF" }}>A coordinator's morning</h3>
        <BoltButton onClick={reset} style={{ background: "transparent", padding: "6px 12px", minHeight: 36 }}><span>Reset</span></BoltButton>
      </div>
      <div role="note" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "rgba(147,197,253,0.1)", border: "1px solid rgba(147,197,253,0.4)", fontSize: 13.5, fontWeight: 600, color: "#BFDBFE", marginBottom: 14 }}>
        <BoltGlyphIcon kind="shield" size={16} color="#93C5FD" />{"Illustrative: no real patient data. Initials and synthetic IDs only; risk factor names are examples."}
      </div>
      <p style={{ margin: "0 0 8px", fontFamily: MONO, fontSize: 12.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA" }}>{"1 · Pick a risk factor"}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {riqFactors.map((f, i) => { const n = remaining.filter((p) => p.factor === i).length; const on = factor === i; return (
          <button key={f} type="button" aria-pressed={on} onClick={() => { setFactor(on ? null : i); setOpen(null); }} style={{ fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, padding: "8px 12px", borderRadius: 9, cursor: "pointer", border: `1.5px solid ${on ? RIQ_COLOR : "rgba(184,200,218,0.3)"}`, background: on ? `${RIQ_COLOR}22` : "rgba(16,34,66,0.6)", color: "#FFFFFF" }}>
            {f}<span key={n} className="bolt-anim" style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: "#0B1A33", background: on ? RIQ_COLOR : "#B8C8DA", borderRadius: 999, padding: "1px 8px", animation: "boltPop 0.35s ease-out both" }}>{n}</span>
          </button>
        ); })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 14 }}>
        <div>
          <p style={{ margin: "0 0 8px", fontFamily: MONO, fontSize: 12.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA" }}>{"2 · Worklist · " + list.length + " at risk"}</p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 }}>
            {list.map((p) => (
              <li key={p.id}>
                <button type="button" onClick={() => setOpen(p.id)} aria-pressed={open === p.id} style={{ width: "100%", fontFamily: "inherit", display: "grid", gridTemplateColumns: "54px 76px minmax(0, 1fr) auto", gap: 8, alignItems: "center", textAlign: "left", padding: "9px 12px", borderRadius: 9, cursor: "pointer", border: `1px solid ${open === p.id ? RIQ_COLOR : "rgba(184,200,218,0.2)"}`, background: open === p.id ? `${RIQ_COLOR}1A` : "rgba(16,34,66,0.6)", color: "#FFFFFF", fontSize: 14 }}>
                  <span style={{ fontWeight: 700 }}>{p.init}</span>
                  <span style={{ fontFamily: MONO, fontSize: 12.5, color: "#B8C8DA" }}>{p.id}</span>
                  <span style={{ color: "#D0DAE6", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{riqFactors[p.factor]}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: p.overdue >= 14 ? "#F87171" : "#FBBF24", whiteSpace: "nowrap" }}>{p.overdue + "d overdue"}</span>
                </button>
              </li>
            ))}
            {list.length === 0 && <li style={{ fontSize: 15, color: "#34D399", fontWeight: 700, padding: "10px 4px" }}>{"Worklist clear for this factor."}</li>}
          </ul>
        </div>
        <div>
          <p style={{ margin: "0 0 8px", fontFamily: MONO, fontSize: 12.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA" }}>{"3 · Patient · log the call"}</p>
          {current ? (
            <div key={current.id} className="bolt-anim" style={{ borderRadius: 12, padding: "14px 16px", background: "rgba(16,34,66,0.7)", border: `1px solid ${RIQ_COLOR}66`, animation: "boltIn 0.3s ease-out both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}><span style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>{current.init}</span><span style={{ fontFamily: MONO, fontSize: 12.5, color: "#B8C8DA" }}>{current.id}</span></div>
              <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: RIQ_COLOR }}>{"Why flagged"}</p>
              <ul style={{ margin: "0 0 12px", paddingLeft: 18, fontSize: 14, color: "#E2EAF2", lineHeight: 1.6 }}>
                <li>{riqFactors[current.factor]}</li>
                <li>{current.overdue + " days past expected treatment interval"}</li>
              </ul>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                <label style={{ fontSize: 12.5, color: "#B8C8DA" }}>{"Outcome"}<select value={outcome} onChange={(e) => setOutcome(e.target.value)} style={{ ...sel, marginTop: 4 }}>{["Scheduled", "No answer", "Left message", "Declined"].map((o) => <option key={o}>{o}</option>)}</select></label>
                <label style={{ fontSize: 12.5, color: "#B8C8DA" }}>{"Barrier"}<select value={barrier} onChange={(e) => setBarrier(e.target.value)} style={{ ...sel, marginTop: 4 }}>{["Transportation", "Cost", "Scheduling", "Health", "None"].map((o) => <option key={o}>{o}</option>)}</select></label>
              </div>
              <BoltButton onClick={saveNext} style={{ width: "100%", justifyContent: "center", background: RIQ_COLOR, color: "#0B1A33", borderColor: RIQ_COLOR }}><span>{"Save & Next"}</span><BoltIcon kind="arrow" /></BoltButton>
            </div>
          ) : (
            <div style={{ borderRadius: 12, padding: "16px", border: "1.5px dashed rgba(184,200,218,0.3)", fontSize: 14.5, color: "#7F93AE", minHeight: 120, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>{list.length ? "Open the most overdue patient to see why they were flagged." : "Pick another risk factor, or reset."}</div>
          )}
          <p aria-live="polite" style={{ margin: "10px 0 0", minHeight: 22, fontSize: 14, fontWeight: 700, color: "#34D399" }}>{toast}</p>
        </div>
      </div>
    </Card>
  );
}

function RetentionIQPage({ onNavigate }: { onNavigate: Navigate }) {
  const sections = [{ id: "rq-why", label: "Why" }, { id: "rq-how", label: "How" }, { id: "rq-try", label: "Try it" }, { id: "rq-who", label: "Who" }, { id: "rq-status", label: "Status" }];
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.25);
  return (
    <SolPage id="retentioniq-page">
      <SolHero eyebrow="Solutions · Patient retention" name="RetentionIQ" status="Building" statusColor="#F59E0B" color={RIQ_COLOR}
        line1="Find the patient who's slipping past their treatment window before they're lost to follow-up."
        line2="RetentionIQ finds patients falling behind on scheduled treatment, shows staff why each one is at risk, and helps them reach the patient and record what happened. Built first for retina practices; oncology is next."
        tiles={[{ head: "Retina first", label: "Oncology next", sub: "Scheduled-treatment specialties" }, { head: "Explained", label: "Every flag has a reason", sub: "Risk factors, not a black box" }, { head: "Customer-facing", label: "Used by practices directly", sub: "Coordinators and administrators" }]}
        sections={sections} />
      <SolSection id="rq-why" num="01" label="Why" title="Patients fall through the cracks quietly" sub="A missed appointment with no follow-up, or a visit that never gets booked, becomes a gap in care." icon="eye" color={RIQ_COLOR}>
        <SolSplit rows={riqBeforeAfter} color={RIQ_COLOR} todayTitle="Reports and manual lists" newTitle="A daily worklist with reasons" newLabel="With RetentionIQ" label="Divider between manual follow-up and RetentionIQ" />
      </SolSection>
      <SolSection id="rq-how" num="02" label="How" title="From expected interval to outreach" sub="Each patient's actual visits are compared with their expected treatment interval, refreshed nightly." icon="repeat" color={RIQ_COLOR}>
        <SolSteps color={RIQ_COLOR} steps={riqSteps} />
      </SolSection>
      <SolSection id="rq-try" num="03" label="Try it" title="Work the list, watch it shrink" sub="Pick a risk factor, open the most overdue patient, log the call and move to the next." icon="target" color={RIQ_COLOR}>
        <RetentionDemo />
      </SolSection>
      <SolSection id="rq-who" num="04" label="Who" title="Built for the people who keep patients in care" sub="Two roles, four features." icon="people" color={RIQ_COLOR}>
        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: 12 }}>
          {[{ role: "Care coordinators", text: "Work a daily list of at-risk patients, call them, and log outcomes.", feats: [{ n: "Worklist", d: "Daily queue with counts, filters, location scope and a risk badge on each patient" }, { n: "Patient detail", d: "Why they were flagged, visit and treatment history, do-not-call, call log and Save & Next" }] },
            { role: "Practice administrators", text: "Watch retention trends and set the expected treatment intervals.", feats: [{ n: "Admin overview", d: "Retention trends, at-risk breakdowns and lost-to-follow-up by physician; click a factor to filter the worklist" }, { n: "Admin config", d: "Expected intervals at global, disease and drug-code level, applied at the next nightly refresh" }] }].map((r, i) => (
            <div key={r.role} className="bolt-anim" style={{ borderRadius: 14, padding: "18px 20px", background: `linear-gradient(165deg, ${RIQ_COLOR}14, rgba(16,34,66,0.7) 55%)`, border: `1px solid ${RIQ_COLOR}55`, ...(inView ? { animation: `boltRise 0.55s cubic-bezier(.2,.7,.2,1) ${i * 0.15}s both` } : { opacity: 0 }) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><BoltGlyphIcon kind="person" size={20} color={RIQ_COLOR} /><h3 style={{ margin: 0, fontSize: 18, color: "#FFFFFF" }}>{r.role}</h3></div>
              <p style={{ margin: "6px 0 12px", fontSize: 15, color: "#D0DAE6" }}>{r.text}</p>
              {r.feats.map((f) => <div key={f.n} style={{ borderRadius: 10, padding: "10px 12px", background: "rgba(7,18,38,0.7)", border: "1px solid rgba(184,200,218,0.15)", marginBottom: 8 }}><p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#FFFFFF" }}>{f.n}</p><p style={{ margin: "2px 0 0", fontSize: 14, color: "#B8C8DA", lineHeight: 1.45 }}>{f.d}</p></div>)}
            </div>
          ))}
        </div>
      </SolSection>
      <SolSection id="rq-status" num="05" label="Status" title="Building on Bolt" sub="The screens are built; the connection to practice data is next." icon="trend" color={RIQ_COLOR}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))", gap: 12 }}>
          {[{ k: "Screens", v: "All four features built on the platform, running on sample data", c: "#34D399", s: "Built" }, { k: "Services", v: "Worklist and patient-detail services scaffolded", c: "#FBBF24", s: "In progress" }, { k: "Practice data feed", v: "Connection from the practice's system not yet built", c: "#93A9C2", s: "Next" }, { k: "Oncology", v: "Next specialty after retina", c: "#93A9C2", s: "Roadmap" }].map((x) => (
            <div key={x.k} style={{ borderRadius: 12, padding: "16px 18px", background: "rgba(16,34,66,0.6)", border: `1px solid ${x.c}55`, borderTop: `3px solid ${x.c}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}><p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>{x.k}</p><span style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 600, color: x.c, border: `1px solid ${x.c}77`, borderRadius: 4, padding: "1px 6px" }}>{x.s}</span></div>
              <p style={{ margin: "6px 0 0", fontSize: 14.5, color: "#D0DAE6", lineHeight: 1.5 }}>{x.v}</p>
            </div>
          ))}
        </div>
        <p style={{ margin: "14px 0 0", fontSize: 14.5, color: "#B8C8DA", lineHeight: 1.6 }}>{"RetentionIQ handles identified patient data under HIPAA, so it inherits the platform's security, access and audit controls."}</p>
        <div style={{ marginTop: 16 }}><SolPlatform color={RIQ_COLOR} intelligence={["Bolt Product Ownership"]} data={[]} onNavigate={onNavigate} /></div>
      </SolSection>
      <SolFooter strong="Keeping patients in care." text="A missed treatment window is a care gap, so RetentionIQ leads with the patient." onNavigate={onNavigate} />
    </SolPage>
  );
}


// ============================================================
// ROADMAP + AI LITERACY PAGES (modern)
// ============================================================

const EVO_COLOR = "#818CF8";
const LEVELS_COLOR = "#C084FC";
const ROADMAP_COLOR = "#38BDF8";
const VALUE_COLOR = "#FACC15";

const litLabel = (c = "#B8C8DA"): React.CSSProperties => ({ margin: 0, fontFamily: MONO, fontSize: 12.5, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: c });
const litPanel = (c: string): React.CSSProperties => ({ borderRadius: 16, padding: "clamp(16px, 2.5vw, 26px)", background: `linear-gradient(160deg, ${c}1A, rgba(16,34,66,0.7) 55%)`, border: `1px solid ${c}55` });

function LitMark({ good, color }: { good: boolean; color: string }) {
  return (
    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 4 }}>
      {good ? <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M7 7l10 10M17 7 7 17" fill="none" stroke="#F87171" strokeWidth="2.4" strokeLinecap="round" />}
    </svg>
  );
}

function LitCallout({ color, title, children }: { color: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 16, borderRadius: 12, padding: "16px 18px", borderLeft: `3px solid ${color}`, background: `${color}10`, border: `1px solid ${color}40`, borderLeftWidth: 3 }}>
      <p style={litLabel(color)}>{title}</p>
      <div style={{ margin: "6px 0 0", fontSize: 16, color: "#E2EAF2", lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

// ---------------- AI EVOLUTION ----------------

function EraExplorer() {
  const [idx, setIdx] = useState(eras.length - 1);
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.1);
  const era = eras[idx];
  const pct = (idx / (eras.length - 1)) * 100;
  return (
    <div>
      <div ref={ref} style={{ position: "relative" }}>
        <div aria-hidden="true" style={{ position: "absolute", left: "12.5%", right: "12.5%", top: 25, height: 3, borderRadius: 2, background: "rgba(184,200,218,0.18)" }}>
          <div className="bolt-anim" style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: `linear-gradient(90deg, ${eras[0].color}, ${era.color})`, transition: "width 0.5s cubic-bezier(.4,0,.2,1)", transformOrigin: "left", ...(inView ? { animation: "boltGrowX 0.9s ease-out both" } : { transform: "scaleX(0)" }) }} />
        </div>
        <div role="tablist" aria-label="AI eras" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6 }}>
          {eras.map((e, i) => {
            const on = i === idx;
            const past = i <= idx;
            return (
              <button key={e.id} type="button" role="tab" aria-selected={on} onClick={() => setIdx(i)} style={{ fontFamily: "inherit", background: "transparent", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "4px 2px 8px", color: "#FFFFFF" }}>
                <span aria-hidden="true" style={{ height: 52, display: "flex", alignItems: "center" }}>
                  <span className="bolt-anim" style={{ width: on ? 42 : 30, height: on ? 42 : 30, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: past ? e.color : "#0B1A33", border: `2px solid ${e.color}`, boxShadow: on ? `0 0 0 6px ${e.color}2E, 0 0 26px ${e.color}88` : "none", transition: "all 0.3s ease", fontFamily: MONO, fontSize: 13, fontWeight: 700, color: past ? "#0B1A33" : e.color, ...(inView ? { animation: `boltPop 0.5s ease-out ${0.2 + i * 0.15}s both` } : { opacity: 0 }) }}>{String(i + 1)}</span>
                </span>
                <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: e.color }}>{e.years}</span>
                <span style={{ fontSize: "clamp(13px, 1.5vw, 16px)", fontWeight: on ? 700 : 500, color: on ? "#FFFFFF" : "#B8C8DA", textAlign: "center", lineHeight: 1.25 }}>{e.title}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div role="tabpanel" key={era.id} className="bolt-anim" style={{ ...litPanel(era.color), marginTop: 12, animation: "boltIn 0.35s ease-out both" }}>
        <p style={litLabel(era.color)}>{era.tagline}</p>
        <p style={{ margin: "8px 0 18px", fontSize: 17, color: "#E2EAF2", lineHeight: 1.65, maxWidth: 900 }}>{era.summary}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 12 }}>
          {[{ t: "What it could do", items: era.capabilities, good: true }, { t: "What it couldn't do yet", items: era.limitations, good: false }].map((col) => (
            <div key={col.t} style={{ borderRadius: 12, padding: "14px 16px", background: "rgba(7,18,38,0.6)", border: "1px solid rgba(184,200,218,0.15)" }}>
              <p style={litLabel(col.good ? era.color : "#B8C8DA")}>{col.t}</p>
              <ul style={{ listStyle: "none", margin: "10px 0 0", padding: 0, display: "grid", gap: 8 }}>
                {col.items.map((it, k) => <li key={it} className="bolt-anim" style={{ display: "flex", gap: 9, fontSize: 15, color: "#E2EAF2", lineHeight: 1.45, animation: `boltIn 0.3s ease-out ${0.08 + k * 0.05}s both` }}><LitMark good={col.good} color={era.color} />{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p style={{ ...litLabel(), margin: "20px 0 8px" }}>{"Key milestones"}</p>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))", gap: 6 }}>
          {era.milestones.map((m, k) => (
            <li key={m.date + m.event} className="bolt-anim" style={{ display: "flex", gap: 12, alignItems: "baseline", padding: "9px 12px", borderRadius: 9, background: m.highlight ? `${era.color}1C` : "rgba(7,18,38,0.35)", border: `1px solid ${m.highlight ? era.color + "66" : "rgba(184,200,218,0.1)"}`, animation: `boltIn 0.3s ease-out ${0.1 + k * 0.05}s both` }}>
              <span style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 600, color: era.color, minWidth: 68, whiteSpace: "nowrap" }}>{m.date}</span>
              <span style={{ fontSize: 15, color: m.highlight ? "#FFFFFF" : "#D0DAE6", fontWeight: m.highlight ? 600 : 400, lineHeight: 1.4 }}>{m.event}</span>
            </li>
          ))}
        </ol>
        <LitCallout color={era.color} title="What it meant for enterprise">{era.enterprise}</LitCallout>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 16 }}>
          <BoltButton disabled={idx === 0} onClick={() => setIdx(idx - 1)} style={{ background: "transparent", opacity: idx === 0 ? 0.4 : 1 }}><span>{"Previous era"}</span></BoltButton>
          <BoltButton disabled={idx === eras.length - 1} onClick={() => setIdx(idx + 1)} style={{ background: "transparent", opacity: idx === eras.length - 1 ? 0.4 : 1 }}><span>{"Next era"}</span><BoltIcon kind="arrow" /></BoltButton>
        </div>
      </div>
    </div>
  );
}

function EvoVelocity() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.1);
  const [sel, setSel] = useState(4);
  const max = 15;
  const d = velocityData[sel];
  return (
    <div ref={ref}>
      <div style={{ display: "grid", gap: 6 }}>
        {velocityData.map((v, i) => {
          const on = i === sel;
          return (
            <button key={v.era} type="button" aria-pressed={on} onClick={() => setSel(i)} onMouseEnter={() => setSel(i)} style={{ fontFamily: "inherit", textAlign: "left", cursor: "pointer", display: "grid", gridTemplateColumns: "minmax(110px, 200px) minmax(0, 1fr) 52px", gap: 12, alignItems: "center", padding: "8px 10px", borderRadius: 10, border: `1px solid ${on ? v.color : "transparent"}`, background: on ? `${v.color}14` : "transparent", color: "#FFFFFF", transition: "all 0.2s ease" }}>
              <span>
                <span style={{ display: "block", fontSize: 14.5, fontWeight: 600, color: v.projected ? "#B8C8DA" : "#FFFFFF", lineHeight: 1.25 }}>{v.era}</span>
                <span style={{ fontFamily: MONO, fontSize: 12, color: v.color }}>{v.period}</span>
              </span>
              <span style={{ position: "relative", height: 26, borderRadius: 6, background: "rgba(184,200,218,0.08)", overflow: "hidden" }}>
                <span className="bolt-anim" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(v.multiplier / max) * 100}%`, borderRadius: 6, background: v.projected ? `repeating-linear-gradient(45deg, ${v.color}CC 0 6px, ${v.color}55 6px 12px)` : `linear-gradient(90deg, ${v.color}77, ${v.color})`, boxShadow: on ? `0 0 18px ${v.color}88` : "none", transformOrigin: "left", ...(inView ? { animation: `boltGrowX 0.9s cubic-bezier(.2,.7,.2,1) ${0.1 + i * 0.12}s both` } : { transform: "scaleX(0)" }) }} />
              </span>
              <span style={{ fontFamily: MONO, fontSize: 17, fontWeight: 700, color: v.color, textAlign: "right" }}>{v.multiplier + "×"}</span>
            </button>
          );
        })}
      </div>
      <div key={sel} aria-live="polite" className="bolt-anim" style={{ marginTop: 10, borderRadius: 12, padding: "14px 16px", background: `${d.color}12`, border: `1px solid ${d.color}55`, animation: "boltIn 0.3s ease-out both" }}>
        <p style={{ margin: 0, fontSize: 16, color: "#E2EAF2", lineHeight: 1.6 }}>{d.description}</p>
        {d.source && <p style={{ margin: "6px 0 0", fontFamily: MONO, fontSize: 12.5, color: "#B8C8DA", lineHeight: 1.5 }}>{d.source}</p>}
      </div>
      <LitCallout color={EVO_COLOR} title="The urgency case">
        {"A team on multi-agent tooling ships roughly "}<strong style={{ color: "#FFFFFF" }}>{"7× the output"}</strong>{" of a team without AI assistance, against "}<strong style={{ color: "#FFFFFF" }}>{"1.25× with autocomplete alone"}</strong>{". The gap is not incremental. It is structural, and it compounds every sprint."}
      </LitCallout>
    </div>
  );
}

function EvoNumbers() {
  const [col, setCol] = useState(eras.length - 1);
  return (
    <div style={{ overflowX: "auto", borderRadius: 14, border: "1px solid rgba(184,200,218,0.18)", background: "rgba(16,34,66,0.55)" }}>
      <div style={{ minWidth: 640 }}>
        <div style={{ display: "grid", gridTemplateColumns: "190px repeat(4, minmax(0, 1fr))", padding: "12px 18px", borderBottom: "1px solid rgba(184,200,218,0.12)" }}>
          <span />
          {eras.map((e, i) => <button key={e.id} type="button" aria-pressed={col === i} onClick={() => setCol(i)} onMouseEnter={() => setCol(i)} style={{ fontFamily: MONO, fontSize: 13.5, fontWeight: 700, color: col === i ? e.color : "#B8C8DA", background: col === i ? `${e.color}1A` : "transparent", border: "none", borderRadius: 6, padding: "4px 0", cursor: "pointer" }}>{e.years}</button>)}
        </div>
        {stats.map((s, si) => (
          <div key={s.label} style={{ display: "grid", gridTemplateColumns: "190px repeat(4, minmax(0, 1fr))", padding: "12px 18px", borderBottom: si < stats.length - 1 ? "1px solid rgba(184,200,218,0.07)" : "none", alignItems: "center" }}>
            <span style={{ fontSize: 15, color: "#D0DAE6" }}>{s.label}</span>
            {s.values.map((v, vi) => <span key={vi} style={{ textAlign: "center", fontSize: col === vi ? 16.5 : 15, fontWeight: col === vi ? 700 : 400, color: col === vi ? eras[vi].color : "#E2EAF2", transition: "all 0.2s ease" }}>{v}</span>)}
          </div>
        ))}
      </div>
    </div>
  );
}

function EvoCompute() {
  const [active, setActive] = useState(0);
  const metrics = [
    { id: "tokens", label: "Tokens per watt", unit: "Relative throughput index (Nov 2022 = 1×)", source: "Sources: MLCommons MLPerf Inference benchmarks (2022–2025), Anthropic efficiency disclosures", color: "#8B5CF6", base: "Expected hardware gains", line: "Actual tokens per watt", moores: [{ x: 0, y: 1 }, { x: 12, y: 1.4 }, { x: 24, y: 2 }, { x: 36, y: 2.8 }, { x: 40, y: 3.2 }], ai: [{ x: 0, y: 1 }, { x: 8, y: 3 }, { x: 16, y: 8 }, { x: 24, y: 18 }, { x: 32, y: 35 }, { x: 40, y: 60 }], callout: "Tokens per watt has improved ~60× since 2022, driven by newer hardware, inference optimization and model distillation. Hardware improvements alone would have delivered ~3×." },
    { id: "flops", label: "Training compute", unit: "Relative FLOP index, log scale (Nov 2022 = 1×)", source: "Sources: Epoch AI Training Compute Database (2024), OpenAI scaling law papers, Anthropic model cards", color: "#F59E0B", base: "Moore’s Law expectation", line: "Frontier model training FLOP", moores: [{ x: 0, y: 1 }, { x: 12, y: 1.4 }, { x: 24, y: 2 }, { x: 36, y: 2.8 }, { x: 40, y: 3.2 }], ai: [{ x: 0, y: 1 }, { x: 6, y: 3 }, { x: 14, y: 10 }, { x: 22, y: 30 }, { x: 30, y: 80 }, { x: 40, y: 200 }], callout: "Training compute for frontier models has grown ~200× since GPT-3.5, doubling roughly every 6 months against every 24 months under Moore’s Law." },
  ];
  const m = metrics[active];
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.1);
  const W = 900, H = 280, P = { t: 40, r: 24, b: 40, l: 64 };
  const iw = W - P.l - P.r, ih = H - P.t - P.b;
  const ys = [...m.moores, ...m.ai].map((p) => p.y);
  const lo = Math.log10(Math.min(...ys) * 0.8), hi = Math.log10(Math.max(...ys) * 1.15);
  const cx = (x: number) => P.l + (x / 40) * iw;
  const cy = (y: number) => P.t + ih - ((Math.log10(y) - lo) / (hi - lo)) * ih;
  const path = (pts: { x: number; y: number }[]) => pts.map((p, i) => `${i ? "L" : "M"} ${cx(p.x).toFixed(1)} ${cy(p.y).toFixed(1)}`).join(" ");
  const area = path(m.ai) + ` L ${cx(40).toFixed(1)} ${(P.t + ih).toFixed(1)} L ${cx(0).toFixed(1)} ${(P.t + ih).toFixed(1)} Z`;
  const ticks = [1, 2, 3, 5, 10, 20, 50, 100, 200].filter((v) => v >= Math.min(...ys) * 0.7 && v <= Math.max(...ys) * 1.3);
  const xl = [{ x: 0, l: "Nov '22" }, { x: 10, l: "Sep '23" }, { x: 20, l: "Jul '24" }, { x: 30, l: "May '25" }, { x: 40, l: "Mar '26" }];
  const last = m.ai[m.ai.length - 1];
  return (
    <div ref={ref}>
      <div role="tablist" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {metrics.map((mm, i) => <button key={mm.id} type="button" role="tab" aria-selected={active === i} onClick={() => setActive(i)} style={{ fontFamily: "inherit", fontSize: 15, fontWeight: 700, padding: "9px 14px", borderRadius: 9, cursor: "pointer", border: `1.5px solid ${active === i ? mm.color : "rgba(184,200,218,0.25)"}`, background: active === i ? `${mm.color}22` : "rgba(16,34,66,0.6)", color: "#FFFFFF" }}>{mm.label}</button>)}
      </div>
      <div style={{ ...litPanel(m.color), padding: "18px 18px 16px" }}>
        <p style={{ margin: "0 0 4px", fontFamily: MONO, fontSize: 12.5, color: "#B8C8DA" }}>{m.unit}</p>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={m.callout} style={{ display: "block", overflow: "visible" }}>
          <defs><linearGradient id={`evo-area-${m.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={m.color} stopOpacity="0.35" /><stop offset="100%" stopColor={m.color} stopOpacity="0" /></linearGradient></defs>
          {ticks.map((v) => <g key={v}><line x1={P.l} x2={W - P.r} y1={cy(v)} y2={cy(v)} stroke="rgba(184,200,218,0.1)" /><text x={P.l - 10} y={cy(v)} textAnchor="end" dominantBaseline="central" fontSize="12" fill="#B8C8DA" fontFamily="JetBrains Mono, monospace">{v + "×"}</text></g>)}
          {xl.map((l) => <text key={l.x} x={cx(l.x)} y={H - 10} textAnchor="middle" fontSize="12" fill="#B8C8DA" fontFamily="JetBrains Mono, monospace">{l.l}</text>)}
          <g key={m.id}>
            <path d={area} fill={`url(#evo-area-${m.id})`} className="bolt-anim" style={inView ? { animation: "boltIn 1s ease-out 0.6s both" } : { opacity: 0 }} />
            <path d={path(m.moores)} fill="none" stroke="#A8B8CC" strokeWidth="2" strokeDasharray="6 5" className="bolt-anim" style={inView ? { animation: "boltIn 0.6s ease-out both" } : { opacity: 0 }} />
            <path d={path(m.ai)} fill="none" stroke={m.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" className="bolt-anim" style={inView ? { animation: "litDraw 1.4s cubic-bezier(.4,0,.2,1) both" } : { strokeDashoffset: 1 }} />
            {m.ai.map((p, i) => <circle key={i} cx={cx(p.x)} cy={cy(p.y)} r="5" fill="#0B1A33" stroke={m.color} strokeWidth="2.5" className="bolt-anim" style={{ transformBox: "fill-box", transformOrigin: "center", ...(inView ? { animation: `boltPop 0.4s ease-out ${0.2 + i * 0.22}s both` } : { opacity: 0 }) }} />)}
            <text x={cx(last.x) - 10} y={cy(last.y) - 14} textAnchor="end" fontSize="22" fontWeight="700" fill={m.color} fontFamily="JetBrains Mono, monospace" className="bolt-anim" style={inView ? { animation: "boltIn 0.5s ease-out 1.4s both" } : { opacity: 0 }}>{last.y + "×"}</text>
          </g>
          <line x1={P.l + 4} x2={P.l + 30} y1={14} y2={14} stroke="#A8B8CC" strokeWidth="2" strokeDasharray="6 5" />
          <text x={P.l + 38} y={18} fontSize="13" fill="#D0DAE6" fontFamily="DM Sans, sans-serif">{m.base}</text>
          <line x1={P.l + 250} x2={P.l + 276} y1={14} y2={14} stroke={m.color} strokeWidth="3" />
          <text x={P.l + 284} y={18} fontSize="13" fontWeight="600" fill={m.color} fontFamily="DM Sans, sans-serif">{m.line}</text>
        </svg>
        <p style={{ margin: "12px 0 0", fontSize: 16, color: "#E2EAF2", lineHeight: 1.6 }}>{m.callout}</p>
        <p style={{ margin: "6px 0 0", fontFamily: MONO, fontSize: 12, color: "#B8C8DA" }}>{m.source}</p>
      </div>
    </div>
  );
}

function TimelinePage({ onNavigate }: { onNavigate: Navigate }) {
  const sections = [{ id: "ev-eras", label: "Eras" }, { id: "ev-speed", label: "Velocity" }, { id: "ev-numbers", label: "Numbers" }, { id: "ev-compute", label: "Compute" }];
  return (
    <SolPage id="evolution-page">
      <SolHero eyebrow="AI Literacy · How we got here" name="The Evolution of AI" color={EVO_COLOR}
        line1="From a chat window to directing teams of AI agents in four years."
        line2="How AI moved from a curiosity to a production platform, era by era: what each generation could do, what it couldn't yet, and what it meant for enterprises like McKesson."
        tiles={[{ head: "4 eras", label: "Chat to orchestration", sub: "Nov 2022 to today" }, { head: "Structural", label: "The productivity gap", sub: "Teams on agentic tools pull ahead every sprint" }, { head: "Adoption", label: "Is the advantage now", sub: "Everyone has frontier models; speed of use differs" }]}
        sections={sections} />
      <SolSection id="ev-eras" num="01" label="Eras" title="Four eras, each faster than the last" sub="Pick an era, or step through them in order." icon="layers" color={EVO_COLOR}>
        <EraExplorer />
      </SolSection>
      <SolSection id="ev-speed" num="02" label="Velocity" title="Developer output, multiplied" sub="Output relative to a developer working without AI. Select a bar for the source behind it." icon="trend" color={EVO_COLOR}>
        <EvoVelocity />
      </SolSection>
      <SolSection id="ev-numbers" num="03" label="Numbers" title="The numbers tell the story" sub="Adoption, context, investment and jobs across the four eras." icon="chart" color={EVO_COLOR}>
        <EvoNumbers />
      </SolSection>
      <SolSection id="ev-compute" num="04" label="Compute" title="Outrunning Moore's Law" sub="AI efficiency and training compute have grown far faster than chip improvements alone would predict." icon="pulse" color={EVO_COLOR}>
        <EvoCompute />
      </SolSection>
      <SolFooter strong="The model is no longer the moat." text="How fast an organization puts AI to work is. The next step is knowing where each person stands." onNavigate={onNavigate} cta={{ label: "Knowledge Levels", target: "framework", color: LEVELS_COLOR }} />
    </SolPage>
  );
}

// ---------------- KNOWLEDGE LEVELS ----------------

function LevelLadder() {
  const [sel, setSel] = useState(1);
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.1);
  const L = levels[sel];
  return (
    <div>
      <div ref={ref} role="tablist" aria-label="Knowledge levels" style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 8, alignItems: "end", minHeight: 240 }}>
        {levels.map((l, i) => {
          const on = i === sel;
          return (
            <button key={l.level} type="button" role="tab" aria-selected={on} onClick={() => setSel(i)} className="bolt-anim" style={{ fontFamily: "inherit", cursor: "pointer", height: 100 + i * 34, borderRadius: "12px 12px 6px 6px", border: `1.5px solid ${on ? l.color : l.color + "55"}`, background: on ? `linear-gradient(180deg, ${l.color}55, ${l.color}14)` : `linear-gradient(180deg, ${l.color}24, rgba(16,34,66,0.6))`, boxShadow: on ? `0 0 26px ${l.color}66` : "none", padding: "12px 10px", display: "flex", flexDirection: "column", textAlign: "left", color: "#FFFFFF", transformOrigin: "bottom", transition: "box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease", ...(inView ? { animation: `litUp 0.6s cubic-bezier(.2,.7,.2,1) ${i * 0.12}s both` } : { opacity: 0 }) }}>
              <span style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: l.color }}>{"Level " + l.level}</span>
              <span style={{ fontSize: "clamp(13px, 1.6vw, 17px)", fontWeight: 700, lineHeight: 1.2, marginTop: 4 }}>{l.title}</span>
            </button>
          );
        })}
      </div>
      <div role="tabpanel" key={L.level} className="bolt-anim" style={{ ...litPanel(L.color), marginTop: 12, animation: "boltIn 0.35s ease-out both" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={litLabel(L.color)}>{"Level " + L.level + " · " + L.subtitle}</p>
            <h3 style={{ margin: "4px 0 0", fontSize: 24, color: "#FFFFFF" }}>{L.title}</h3>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, color: L.color, background: `${L.color}18`, border: `1px solid ${L.color}55`, borderRadius: 999, padding: "6px 14px" }}><BoltGlyphIcon kind="target" size={16} color={L.color} />{L.analogy}</span>
        </div>
        <p style={{ margin: "12px 0 16px", fontSize: 17, color: "#E2EAF2", lineHeight: 1.65, maxWidth: 880 }}>{L.description}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 12 }}>
          <div style={{ borderRadius: 12, padding: "14px 16px", background: "rgba(7,18,38,0.6)", border: "1px solid rgba(184,200,218,0.15)" }}>
            <p style={litLabel(L.color)}>{"Expected competencies"}</p>
            <ul style={{ listStyle: "none", margin: "10px 0 0", padding: 0, display: "grid", gap: 8 }}>
              {L.competencies.map((c, k) => <li key={c} className="bolt-anim" style={{ display: "flex", gap: 9, fontSize: 15, color: "#E2EAF2", lineHeight: 1.45, animation: `boltIn 0.3s ease-out ${0.08 + k * 0.05}s both` }}><LitMark good color={L.color} />{c}</li>)}
            </ul>
          </div>
          <div style={{ borderRadius: 12, padding: "14px 16px", background: "rgba(7,18,38,0.6)", border: "1px solid rgba(184,200,218,0.15)" }}>
            <p style={litLabel(L.color)}>{"Interview prompts"}</p>
            <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
              {L.interview.map((q, k) => (
                <div key={q.type} className="bolt-anim" style={{ borderRadius: 10, padding: "10px 12px", background: `${L.color}10`, border: `1px solid ${L.color}33`, animation: `boltIn 0.3s ease-out ${0.12 + k * 0.08}s both` }}>
                  <p style={{ margin: 0, fontFamily: MONO, fontSize: 12.5, fontWeight: 600, color: L.color }}>{q.type}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 15, color: "#E2EAF2", lineHeight: 1.45 }}>{q.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LevelSelfCheck() {
  const items = levels.map((l) => l.competencies.slice(0, 2));
  const [checked, setChecked] = useState<string[]>([]);
  let reached = 0;
  for (let i = 0; i < levels.length; i++) { if (items[i].some((c) => checked.includes(c))) reached = i + 1; else break; }
  const L = reached > 0 ? levels[reached - 1] : null;
  const next = reached < levels.length ? levels[reached] : null;
  const toggle = (c: string) => setChecked((cur) => cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: 14, alignItems: "start" }}>
      <div style={{ display: "grid", gap: 10 }}>
        {levels.map((l, i) => (
          <fieldset key={l.level} style={{ margin: 0, borderRadius: 12, padding: "10px 14px 12px", border: `1px solid ${l.color}40`, background: "rgba(16,34,66,0.55)" }}>
            <legend style={{ padding: "0 6px", fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: l.color }}>{"Level " + l.level + " · " + l.title}</legend>
            {items[i].map((c) => {
              const on = checked.includes(c);
              return (
                <label key={c} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 4px", cursor: "pointer", fontSize: 15, color: on ? "#FFFFFF" : "#D0DAE6", lineHeight: 1.45 }}>
                  <input type="checkbox" checked={on} onChange={() => toggle(c)} style={{ marginTop: 4, width: 17, height: 17, accentColor: l.color, flexShrink: 0 }} />{c}
                </label>
              );
            })}
          </fieldset>
        ))}
      </div>
      <div aria-live="polite" style={{ position: "sticky", top: 84, ...litPanel(L ? L.color : LEVELS_COLOR) }}>
        <p style={litLabel(L ? L.color : "#B8C8DA")}>{"Your level"}</p>
        <div aria-hidden="true" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 5, margin: "12px 0 14px" }}>
          {levels.map((l, i) => <span key={l.level} style={{ height: 10, borderRadius: 5, background: i < reached ? l.color : "rgba(184,200,218,0.14)", boxShadow: i === reached - 1 ? `0 0 14px ${l.color}` : "none", transition: "all 0.35s ease" }} />)}
        </div>
        <p key={reached} className="bolt-anim" style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#FFFFFF", animation: "boltIn 0.3s ease-out both" }}>{L ? "Level " + L.level + ": " + L.title : "Not yet placed"}</p>
        <p style={{ margin: "6px 0 0", fontSize: 15.5, color: "#D0DAE6", lineHeight: 1.55 }}>{L ? L.analogy + "." : "Tick the statements that describe you today. Levels build on each other, so start from Level 1."}</p>
        {next && <div style={{ marginTop: 14, borderRadius: 10, padding: "10px 12px", background: "rgba(7,18,38,0.6)", border: `1px solid ${next.color}44` }}>
          <p style={litLabel(next.color)}>{"Next: Level " + next.level}</p>
          <p style={{ margin: "4px 0 0", fontSize: 15, color: "#E2EAF2", lineHeight: 1.45 }}>{next.competencies[0]}</p>
        </div>}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 14 }}>
          <span style={{ fontSize: 13, color: "#7F93AE" }}>{"A quick self-check, not an assessment."}</span>
          <BoltButton onClick={() => setChecked([])} style={{ background: "transparent", padding: "6px 12px", minHeight: 36 }}><span>{"Reset"}</span></BoltButton>
        </div>
      </div>
    </div>
  );
}

function LevelRoles() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.1);
  return (
    <div ref={ref} style={{ borderRadius: 14, padding: "18px clamp(14px, 2vw, 22px)", background: "rgba(16,34,66,0.55)", border: "1px solid rgba(184,200,218,0.18)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(110px, 38%) minmax(0, 1fr)", gap: 14, marginBottom: 8 }}>
        <span />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}>{levels.map((l) => <span key={l.level} style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: l.color, textAlign: "center" }}>{"L" + l.level}</span>)}</div>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {roleMapping.map((r, i) => {
          const [a, b] = r.levels.split("–").map(Number);
          return (
            <div key={r.role} style={{ display: "grid", gridTemplateColumns: "minmax(110px, 38%) minmax(0, 1fr)", gap: 14, alignItems: "center" }}>
              <span style={{ fontSize: 15.5, color: "#E2EAF2", lineHeight: 1.35 }}>{r.role}</span>
              <div style={{ position: "relative", height: 30, borderRadius: 8, background: "repeating-linear-gradient(90deg, rgba(184,200,218,0.07) 0 calc(20% - 2px), transparent calc(20% - 2px) 20%)" }}>
                <div className="bolt-anim" style={{ position: "absolute", top: 3, bottom: 3, left: `${((a - 1) / 5) * 100}%`, width: `${((b - a + 1) / 5) * 100}%`, borderRadius: 7, background: `linear-gradient(90deg, ${levels[a - 1].color}, ${levels[b - 1].color})`, boxShadow: `0 0 16px ${levels[b - 1].color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 13, fontWeight: 700, color: "#0B1A33", transformOrigin: "left", ...(inView ? { animation: `boltGrowX 0.7s cubic-bezier(.2,.7,.2,1) ${0.1 + i * 0.12}s both` } : { transform: "scaleX(0)" }) }}>{r.levels}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FrameworkPage({ onNavigate }: { onNavigate: Navigate }) {
  const sections = [{ id: "kl-levels", label: "Levels" }, { id: "kl-check", label: "Self-check" }, { id: "kl-roles", label: "Roles" }];
  return (
    <SolPage id="levels-page">
      <SolHero eyebrow="AI Literacy · Assessment framework" name="AI Knowledge Levels" color={LEVELS_COLOR}
        line1="Five levels, from writing a good prompt to customizing the model itself."
        line2="A shared yardstick for AI skills at McKesson: what each level can do, how to test for it in an interview, and the level each role should aim for."
        tiles={[{ head: "5 levels", label: "AI User to AI Architect", sub: "Cumulative: each includes the last" }, { head: "Level 2", label: "The floor for every role", sub: "Structure projects and engineer context" }, { head: "Testable", label: "Interview prompts per level", sub: "Three practical questions each" }]}
        sections={sections} />
      <SolSection id="kl-levels" num="01" label="Levels" title="Climb one level at a time" sub="Select a level to see its competencies and how to test for them." icon="trend" color={LEVELS_COLOR}>
        <LevelLadder />
      </SolSection>
      <SolSection id="kl-check" num="02" label="Self-check" title="Where are you today?" sub="Tick what you can already do. Your level is the highest one you reach without skipping a step." icon="check" color={LEVELS_COLOR}>
        <LevelSelfCheck />
      </SolSection>
      <SolSection id="kl-roles" num="03" label="Roles" title="Target levels by role" sub="The range each role should reach." icon="people" color={LEVELS_COLOR}>
        <LevelRoles />
        <LitCallout color={LEVELS_COLOR} title="Level 2 is the floor">{"Every role should reach at least Level 2: structuring AI projects, designing personas and engineering context. Levels are cumulative, so a Level 4 candidate demonstrates everything below it."}</LitCallout>
      </SolSection>
      <SolFooter strong="Skills set the pace." text="The AI Evolution page shows why the pace matters." onNavigate={onNavigate} cta={{ label: "AI Evolution", target: "timeline", color: EVO_COLOR }} />
    </SolPage>
  );
}

// ---------------- MPTS ROADMAP ----------------

function RoadmapFlow() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.1);
  const node = (t: (typeof portfolioTiers)[number], i: number) => (
    <div className="bolt-anim" style={{ borderRadius: 14, padding: "16px 18px", background: `linear-gradient(160deg, ${t.color}22, rgba(16,34,66,0.7) 60%)`, border: `1px solid ${t.color}66`, borderTop: `3px solid ${t.color}`, ...(inView ? { animation: `boltRise 0.55s cubic-bezier(.2,.7,.2,1) ${i * 0.25}s both` } : { opacity: 0 }) }}>
      <p style={{ margin: 0, fontSize: 19, fontWeight: 700, color: t.color }}>{t.title}</p>
      <p style={{ margin: "2px 0 8px", fontSize: 14, color: "#D0DAE6" }}>{t.subtitle}</p>
      <p style={{ margin: 0, fontSize: 13.5, color: "#B8C8DA", lineHeight: 1.45 }}>{t.apps.map((a) => a.name).join(", ")}</p>
    </div>
  );
  const arrow = (top: string, bottom: string, from: string, to: string, i: number) => (
    <div className="lit-flow-arrow" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, minWidth: 96 }}>
      <span style={{ fontFamily: MONO, fontSize: 12, color: "#D0DAE6", whiteSpace: "nowrap" }}>{top}</span>
      <svg aria-hidden="true" width="88" height="20" viewBox="0 0 88 20" className="lit-flow-svg">
        <defs><linearGradient id={`rmf-${i}`} x1="0" x2="1"><stop offset="0%" stopColor={from} /><stop offset="100%" stopColor={to} /></linearGradient></defs>
        <line x1="2" y1="10" x2="78" y2="10" stroke={`url(#rmf-${i})`} strokeWidth="3" strokeDasharray="7 5" className="bolt-anim" style={{ animation: "dpDash 0.9s linear infinite" }} />
        <path d="M76 4 84 10 76 16" fill="none" stroke={to} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: MONO, fontSize: 12, color: "#B8C8DA", whiteSpace: "nowrap" }}>{bottom}</span>
    </div>
  );
  const [lg, im, bo] = portfolioTiers;
  return (
    <div ref={ref} className="lit-flow" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr)", gap: 8, alignItems: "stretch" }}>
      {node(lg, 0)}{arrow("Sourcegraph", "+ Blitzy", lg.color, im.color, 0)}{node(im, 1)}{arrow("Claude Code", "+ review gate", im.color, bo.color, 1)}{node(bo, 2)}
    </div>
  );
}

function RoadmapPortfolio() {
  const [sel, setSel] = useState<string | null>(null);
  const all = portfolioTiers.flatMap((t) => t.apps.map((a) => ({ ...a, tier: t })));
  const cur = all.find((a) => a.name === sel) || null;
  const cx: Record<string, string> = { HIGH: "#F87171", MEDIUM: "#FBBF24", LOW: "#34D399" };
  return (
    <div>
      <div className="lit-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        {portfolioTiers.map((t) => (
          <div key={t.id} style={{ borderRadius: 14, padding: "14px", background: "rgba(16,34,66,0.55)", border: `1px solid ${t.color}44` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: t.color }}>{t.title}</p>
              <span style={{ fontFamily: MONO, fontSize: 12, color: "#B8C8DA" }}>{t.apps.length + (t.apps.length === 1 ? " app" : " apps")}</span>
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              {t.apps.map((a) => {
                const on = sel === a.name;
                return (
                  <button key={a.name} type="button" aria-pressed={on} onClick={() => setSel(on ? null : a.name)} style={{ fontFamily: "inherit", textAlign: "left", cursor: "pointer", borderRadius: 10, padding: "10px 12px", border: `1px solid ${on ? t.color : "rgba(184,200,218,0.16)"}`, background: on ? `${t.color}1F` : "rgba(7,18,38,0.5)", boxShadow: on ? `0 0 16px ${t.color}44` : "none", color: "#FFFFFF", transition: "all 0.2s ease" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, flexShrink: 0 }} /><span style={{ fontSize: 15, fontWeight: 700 }}>{a.name}</span></span>
                    <span style={{ display: "block", fontSize: 13.5, color: "#B8C8DA", lineHeight: 1.35, marginTop: 3 }}>{a.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div aria-live="polite" style={{ marginTop: 12 }}>
        {cur ? (
          <div key={cur.name} className="bolt-anim" style={{ ...litPanel(cur.tier.color), animation: "boltIn 0.3s ease-out both" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "space-between", alignItems: "baseline" }}>
              <h3 style={{ margin: 0, fontSize: 22, color: "#FFFFFF" }}>{cur.name}</h3>
              <span style={litLabel(cur.tier.color)}>{cur.tier.title + " tier"}</span>
            </div>
            <p style={{ margin: "6px 0 14px", fontSize: 16, color: "#D0DAE6" }}>{cur.desc}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))", gap: 10 }}>
              {[
                "users" in cur && cur.users ? { k: "Users", v: cur.users } : null,
                "age" in cur && cur.age ? { k: "Age", v: cur.age } : null,
                "status" in cur && cur.status ? { k: "Status", v: cur.status } : null,
                { k: cur.target === "native" ? "On Bolt" : "Bolt migration", v: cur.migration },
              ].filter((x): x is { k: string; v: string } => x !== null).map((x) => (
                <div key={x.k} style={{ borderRadius: 10, padding: "10px 12px", background: "rgba(7,18,38,0.6)", border: "1px solid rgba(184,200,218,0.15)" }}>
                  <p style={litLabel()}>{x.k}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 600, color: "#FFFFFF" }}>{x.v}</p>
                </div>
              ))}
              {cur.complexity in cx && <div style={{ borderRadius: 10, padding: "10px 12px", background: "rgba(7,18,38,0.6)", border: `1px solid ${cx[cur.complexity]}55` }}>
                <p style={litLabel()}>{"Complexity"}</p>
                <p style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 700, color: cx[cur.complexity] }}>{cur.complexity}</p>
              </div>}
            </div>
          </div>
        ) : (
          <div style={{ borderRadius: 12, padding: 16, border: "1.5px dashed rgba(184,200,218,0.28)", fontSize: 15, color: "#7F93AE", textAlign: "center" }}>{"Select any application to see its users, migration window and complexity."}</div>
        )}
      </div>
    </div>
  );
}

function RoadmapPaths() {
  const [sel, setSel] = useState(0);
  const p = migrationPaths[sel];
  return (
    <div>
      <div role="tablist" className="lit-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
        {migrationPaths.map((m, i) => {
          const on = i === sel;
          return (
            <button key={m.id} type="button" role="tab" aria-selected={on} onClick={() => setSel(i)} style={{ fontFamily: "inherit", textAlign: "left", cursor: "pointer", borderRadius: 12, padding: "14px 16px", border: `1.5px solid ${on ? m.color : "rgba(184,200,218,0.2)"}`, background: on ? `${m.color}1F` : "rgba(16,34,66,0.6)", boxShadow: on ? `0 0 20px ${m.color}44` : "none", color: "#FFFFFF", transition: "all 0.2s ease" }}>
              <span style={{ display: "block", fontSize: 16, fontWeight: 700, color: on ? "#FFFFFF" : m.color }}>{m.title}</span>
              <span style={{ display: "block", fontSize: 13.5, color: "#B8C8DA", marginTop: 3, lineHeight: 1.35 }}>{m.subtitle}</span>
              <span style={{ display: "block", fontFamily: MONO, fontSize: 12.5, color: m.color, marginTop: 8 }}>{m.timeline}</span>
            </button>
          );
        })}
      </div>
      <div role="tabpanel" key={p.id} className="bolt-anim" style={{ ...litPanel(p.color), marginTop: 12, animation: "boltIn 0.35s ease-out both" }}>
        <p style={litLabel(p.color)}>{"Applications: " + p.apps}</p>
        <p style={{ margin: "8px 0 16px", fontSize: 16.5, color: "#E2EAF2", lineHeight: 1.65, maxWidth: 900 }}>{p.description}</p>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${p.steps.length > 4 ? 170 : 200}px), 1fr))`, gap: 8 }}>
          {p.steps.map((s, k) => (
            <li key={s} className="bolt-anim" style={{ borderRadius: 10, padding: "12px 12px", background: "rgba(7,18,38,0.6)", border: `1px solid ${p.color}44`, animation: `boltIn 0.35s ease-out ${0.1 + k * 0.1}s both` }}>
              <span style={{ display: "inline-flex", width: 24, height: 24, borderRadius: "50%", alignItems: "center", justifyContent: "center", background: `${p.color}2E`, fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: p.color }}>{String(k + 1)}</span>
              <p style={{ margin: "8px 0 0", fontSize: 14.5, color: "#E2EAF2", lineHeight: 1.4 }}>{s}</p>
            </li>
          ))}
        </ol>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14, alignItems: "center" }}>
          <span style={litLabel()}>{"Tools"}</span>
          {p.tools.map((t) => <span key={t} style={{ fontSize: 14, color: "#FFFFFF", background: `${p.color}1F`, border: `1px solid ${p.color}55`, borderRadius: 999, padding: "4px 12px" }}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}

function RoadmapTools() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.1);
  const sc = (s: string) => s === "Approved" ? "#34D399" : s === "Pending AI Council" ? "#FBBF24" : "#60A5FA";
  return (
    <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 12 }}>
      {aiToolsRoadmap.map((t, i) => (
        <div key={t.name} className="bolt-anim" style={{ borderRadius: 14, padding: "16px 16px", background: `linear-gradient(165deg, ${t.color}16, rgba(16,34,66,0.7) 55%)`, border: `1px solid ${t.color}55`, borderTop: `3px solid ${t.color}`, display: "flex", flexDirection: "column", gap: 10, ...(inView ? { animation: `boltRise 0.55s cubic-bezier(.2,.7,.2,1) ${i * 0.1}s both` } : { opacity: 0 }) }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#FFFFFF" }}>{t.name}</p>
            <span style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 600, color: sc(t.status), border: `1px solid ${sc(t.status)}77`, background: `${sc(t.status)}14`, borderRadius: 4, padding: "1px 6px", whiteSpace: "nowrap" }}>{t.status}</span>
          </div>
          <p style={{ margin: 0, fontSize: 14.5, color: "#D0DAE6", lineHeight: 1.5, flex: 1 }}>{t.desc}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>{t.tiers.map((x) => <span key={x} style={{ fontSize: 12, color: "#E2EAF2", background: "rgba(184,200,218,0.1)", borderRadius: 4, padding: "2px 7px" }}>{x}</span>)}</div>
          <p style={{ margin: 0, fontSize: 13.5, color: "#B8C8DA", borderTop: "1px solid rgba(184,200,218,0.12)", paddingTop: 8 }}>{"Limitation: " + t.limitation}</p>
        </div>
      ))}
    </div>
  );
}

function RoadmapTimeline() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.1);
  return (
    <div ref={ref}>
      <div aria-hidden="true" style={{ height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${timelineBands.map((b) => b.color).join(", ")})`, transformOrigin: "left", marginBottom: 12, ...(inView ? { animation: "boltGrowX 1.2s cubic-bezier(.4,0,.2,1) both" } : { transform: "scaleX(0)" }) }} />
      <div className="lit-3col" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        {timelineBands.map((b, i) => (
          <div key={b.id} className="bolt-anim" style={{ borderRadius: 14, padding: "16px 16px", background: "rgba(16,34,66,0.6)", border: `1px solid ${b.color}55`, ...(inView ? { animation: `boltRise 0.55s cubic-bezier(.2,.7,.2,1) ${0.2 + i * 0.3}s both` } : { opacity: 0 }) }}>
            <p style={litLabel(b.color)}>{b.label}</p>
            <p style={{ margin: "3px 0 10px", fontSize: 19, fontWeight: 700, color: "#FFFFFF" }}>{b.title}</p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
              {b.actions.map((a) => <li key={a} style={{ display: "flex", gap: 9, fontSize: 14.5, color: "#E2EAF2", lineHeight: 1.45 }}><LitMark good color={b.color} />{a}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function MptsRoadmapPage({ onNavigate }: { onNavigate: Navigate }) {
  const sections = [{ id: "rm-portfolio", label: "Portfolio" }, { id: "rm-paths", label: "Paths" }, { id: "rm-tools", label: "Tooling" }, { id: "rm-timeline", label: "Timeline" }];
  return (
    <SolPage id="roadmap-page">
      <SolHero eyebrow="Roadmap · Application portfolio" name="MPTS Roadmap" status="Building" statusColor="#F59E0B" color={ROADMAP_COLOR}
        line1="Every application has a path to Bolt. The question is sequence, not whether."
        line2="A three-tier view of the applications MPTS manages, where each one is headed, and the tools and timelines that get it there."
        tiles={[{ head: "3 tiers", label: "Legacy, Intermediate, Bolt", sub: "Where every application sits today" }, { head: "3 paths", label: "Migrate, modernize or rewrite", sub: "Matched to codebase size and risk" }, { head: "1 gate", label: "AI Council tool approval", sub: "Unlocks the whole roadmap" }]}
        sections={sections} />
      <SolSection id="rm-portfolio" num="01" label="Portfolio" title="Three tiers, one direction" sub="Applications move left to right as tooling and the platform mature. Select any application for detail." icon="layers" color={ROADMAP_COLOR}>
        <RoadmapFlow />
        <div style={{ marginTop: 14 }}><RoadmapPortfolio /></div>
      </SolSection>
      <SolSection id="rm-paths" num="02" label="Paths" title="Three ways to get to Bolt" sub="The route depends on how big and how old the codebase is." icon="repeat" color={ROADMAP_COLOR}>
        <RoadmapPaths />
      </SolSection>
      <SolSection id="rm-tools" num="03" label="Tooling" title="The AI tools each path needs" sub="Approval status sets the pace of the whole roadmap." icon="code" color={ROADMAP_COLOR}>
        <RoadmapTools />
      </SolSection>
      <SolSection id="rm-timeline" num="04" label="Timeline" title="Foundation, acceleration, transformation" sub="What happens in each window." icon="trend" color={ROADMAP_COLOR}>
        <RoadmapTimeline />
        <LitCallout color={ROADMAP_COLOR} title="What it comes down to">
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 }}>
            {["Every application in the portfolio has a path to Bolt; the question is sequence, not whether", "Intermediate apps move first because they are smaller, modern and prove the migration pattern", "Legacy modernization needs new tooling (Sourcegraph, Blitzy), which needs AI Council tool expansion", "The AI Council decision is the single gate: approve tool expansion and the whole roadmap accelerates"].map((t) => <li key={t} style={{ display: "flex", gap: 9 }}><LitMark good color={ROADMAP_COLOR} />{t}</li>)}
          </ul>
        </LitCallout>
      </SolSection>
      <SolFooter strong="Sequence, not whether." text="The Value page shows what the portfolio is worth along the way." onNavigate={onNavigate} cta={{ label: "Value", target: "value", color: VALUE_COLOR }} />
    </SolPage>
  );
}

// ---------------- VALUE ----------------

const fmtM = (v: number) => `$${(v / 1000000).toFixed(2)}M`;
const valueTotals = { customer: valueProjects.reduce((s, p) => s + p.customerRaw, 0), sdlc: valueProjects.reduce((s, p) => s + p.sdlcRaw, 0) };
const VALUE_CUST = "#34D399";
const VALUE_SDLC = "#60A5FA";

function ValueBoard() {
  const [metric, setMetric] = useState<"customer" | "sdlc" | "both">("both");
  const [open, setOpen] = useState<string | null>(null);
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.1);
  const score = (p: (typeof valueProjects)[number]) => metric === "customer" ? p.customerRaw : metric === "sdlc" ? p.sdlcRaw : p.customerRaw + p.sdlcRaw;
  const rows = [...valueProjects].sort((a, b) => score(b) - score(a));
  const max = Math.max(...valueProjects.map((p) => metric === "both" ? p.customerRaw + p.sdlcRaw : Math.max(p.customerRaw, p.sdlcRaw)));
  const opts: { id: "customer" | "sdlc" | "both"; label: string; c: string }[] = [{ id: "both", label: "Combined", c: VALUE_COLOR }, { id: "customer", label: "Customer value", c: VALUE_CUST }, { id: "sdlc", label: "SDLC value", c: VALUE_SDLC }];
  const sc = (s: string) => s === "Live" ? "#34D399" : "#FBBF24";
  return (
    <div ref={ref}>
      <div role="radiogroup" aria-label="Rank by" style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <span style={litLabel()}>{"Rank by"}</span>
        {opts.map((o) => <button key={o.id} type="button" role="radio" aria-checked={metric === o.id} onClick={() => setMetric(o.id)} style={{ fontFamily: "inherit", fontSize: 14.5, fontWeight: 700, padding: "8px 14px", borderRadius: 9, cursor: "pointer", border: `1.5px solid ${metric === o.id ? o.c : "rgba(184,200,218,0.25)"}`, background: metric === o.id ? `${o.c}22` : "rgba(16,34,66,0.6)", color: "#FFFFFF" }}>{o.label}</button>)}
      </div>
      <div key={metric} style={{ display: "grid", gap: 8 }}>
        {rows.map((p, i) => {
          const on = open === p.name;
          const seg = (v: number, c: string, d: number) => <span className="bolt-anim" style={{ display: "block", height: "100%", width: `${(v / max) * 100}%`, background: `linear-gradient(90deg, ${c}88, ${c})`, transformOrigin: "left", ...(inView ? { animation: `boltGrowX 0.8s cubic-bezier(.2,.7,.2,1) ${d}s both` } : { transform: "scaleX(0)" }) }} />;
          return (
            <div key={p.name} className="bolt-anim" style={{ borderRadius: 12, border: `1px solid ${on ? p.color : "rgba(184,200,218,0.16)"}`, background: on ? `${p.color}12` : "rgba(16,34,66,0.55)", animation: `boltIn 0.35s ease-out ${i * 0.06}s both` }}>
              <button type="button" aria-expanded={on} onClick={() => setOpen(on ? null : p.name)} style={{ fontFamily: "inherit", width: "100%", textAlign: "left", cursor: "pointer", background: "transparent", border: "none", color: "#FFFFFF", display: "grid", gridTemplateColumns: "minmax(110px, 170px) minmax(0, 1fr) auto", gap: 14, alignItems: "center", padding: "12px 14px" }}>
                <span>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span aria-hidden="true" style={{ width: 4, height: 22, borderRadius: 2, background: p.color }} /><span style={{ fontSize: 16, fontWeight: 700 }}>{p.name}</span></span>
                  <span style={{ fontFamily: MONO, fontSize: 11.5, fontWeight: 600, color: sc(p.status), marginLeft: 12 }}>{p.status}</span>
                </span>
                <span style={{ display: "grid", gap: 4 }}>
                  {metric === "both" ? (
                    <span style={{ display: "flex", height: 16, borderRadius: 5, overflow: "hidden", background: "rgba(184,200,218,0.07)" }}>{seg(p.customerRaw, VALUE_CUST, 0.1 + i * 0.08)}{seg(p.sdlcRaw, VALUE_SDLC, 0.3 + i * 0.08)}</span>
                  ) : (
                    <span style={{ display: "flex", height: 16, borderRadius: 5, overflow: "hidden", background: "rgba(184,200,218,0.07)" }}>{seg(metric === "customer" ? p.customerRaw : p.sdlcRaw, metric === "customer" ? VALUE_CUST : VALUE_SDLC, 0.1 + i * 0.08)}</span>
                  )}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 15.5, fontWeight: 700, textAlign: "right", whiteSpace: "nowrap", color: metric === "customer" ? VALUE_CUST : metric === "sdlc" ? VALUE_SDLC : "#FFFFFF" }}>{fmtM(score(p))}</span>
              </button>
              {on && <div className="bolt-anim" style={{ padding: "0 14px 14px", animation: "boltIn 0.25s ease-out both" }}>
                <p style={{ margin: "0 0 10px", fontSize: 15, color: "#D0DAE6", lineHeight: 1.55 }}>{p.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  <span style={{ fontSize: 14, color: "#B8C8DA" }}>{"Customer value "}<strong style={{ fontFamily: MONO, color: VALUE_CUST }}>{p.customerValue}</strong></span>
                  <span style={{ fontSize: 14, color: "#B8C8DA" }}>{"SDLC value "}<strong style={{ fontFamily: MONO, color: VALUE_SDLC }}>{p.sdlcValue}</strong></span>
                </div>
              </div>}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 10, flexWrap: "wrap" }}>
        {[{ c: VALUE_CUST, l: "Annual customer value" }, { c: VALUE_SDLC, l: "SDLC value" }].map((x) => <span key={x.l} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#B8C8DA" }}><span style={{ width: 16, height: 8, borderRadius: 4, background: x.c }} />{x.l}</span>)}
        <span style={{ fontSize: 13.5, color: "#7F93AE" }}>{"Select a row for detail."}</span>
      </div>
    </div>
  );
}

function ValueMix() {
  const [hover, setHover] = useState<string | null>(null);
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.1);
  const bars: { label: string; total: number; key: "customerRaw" | "sdlcRaw"; c: string }[] = [{ label: "Annual customer value", total: valueTotals.customer, key: "customerRaw", c: VALUE_CUST }, { label: "SDLC value", total: valueTotals.sdlc, key: "sdlcRaw", c: VALUE_SDLC }];
  return (
    <div ref={ref} style={{ display: "grid", gap: 18 }}>
      {bars.map((b, bi) => (
        <div key={b.label}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ fontSize: 15.5, fontWeight: 600, color: "#FFFFFF" }}>{b.label}</span>
            <span style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: b.c }}>{fmtM(b.total)}</span>
          </div>
          <div style={{ display: "flex", height: 40, borderRadius: 10, overflow: "hidden", gap: 2, transformOrigin: "left", ...(inView ? { animation: `boltGrowX 1s cubic-bezier(.4,0,.2,1) ${bi * 0.25}s both` } : { transform: "scaleX(0)" }) }}>
            {valueProjects.map((p) => {
              const share = p[b.key] / b.total;
              const dim = hover !== null && hover !== p.name;
              return (
                <button key={p.name} type="button" onMouseEnter={() => setHover(p.name)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(p.name)} onBlur={() => setHover(null)} aria-label={`${p.name}: ${Math.round(share * 100)}% of ${b.label}`} style={{ flex: `${share} 1 0`, minWidth: 0, border: "none", cursor: "default", background: p.color, opacity: dim ? 0.3 : 1, transition: "opacity 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: "#0B1A33", overflow: "hidden", whiteSpace: "nowrap", padding: 0 }}>{share >= 0.11 ? Math.round(share * 100) + "%" : ""}</button>
              );
            })}
          </div>
        </div>
      ))}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
        {valueProjects.map((p) => <span key={p.name} onMouseEnter={() => setHover(p.name)} onMouseLeave={() => setHover(null)} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, color: hover === p.name ? "#FFFFFF" : "#D0DAE6", fontWeight: hover === p.name ? 700 : 400 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: p.color }} />{p.name}</span>)}
      </div>
    </div>
  );
}

function ValueTotals() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>(0.4);
  const t = useCountUp(inView, 1600);
  const cells = [{ v: valueTotals.customer, l: "Annual customer value", s: "Revenue impact, cost avoidance, efficiency gains", c: VALUE_CUST }, { v: valueTotals.sdlc, l: "SDLC value", s: "Traditional development cost that AI tooling compresses", c: VALUE_SDLC }, { v: valueTotals.customer + valueTotals.sdlc, l: "Combined portfolio value", s: "Total measurable impact across " + valueProjects.length + " applications", c: VALUE_COLOR }];
  return (
    <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 12 }}>
      {cells.map((c) => (
        <div key={c.l} style={{ borderRadius: 14, padding: "22px 22px", textAlign: "center", background: `linear-gradient(165deg, ${c.c}1A, rgba(16,34,66,0.7) 60%)`, border: `1px solid ${c.c}55`, boxShadow: inView ? `0 0 30px ${c.c}1F` : "none", transition: "box-shadow 1s ease" }}>
          <p style={{ margin: 0, fontFamily: MONO, fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 700, color: c.c, lineHeight: 1.1 }}>{fmtM(c.v * t)}</p>
          <p style={{ margin: "10px 0 2px", fontSize: 16, fontWeight: 600, color: "#FFFFFF" }}>{c.l}</p>
          <p style={{ margin: 0, fontSize: 14, color: "#B8C8DA" }}>{c.s}</p>
        </div>
      ))}
    </div>
  );
}

function ValuePage({ onNavigate }: { onNavigate: Navigate }) {
  const sections = [{ id: "va-apps", label: "By application" }, { id: "va-mix", label: "Mix" }, { id: "va-total", label: "Totals" }];
  return (
    <SolPage id="value-page">
      <SolHero eyebrow="Roadmap · Portfolio value" name="Value" color={VALUE_COLOR}
        line1="What the portfolio is worth to customers, and what it would cost to build the old way."
        line2="Annual customer value is the business impact each application delivers. SDLC value is the cost to build and maintain it with traditional development: the investment AI-powered development compresses."
        tiles={[{ head: fmtM(valueTotals.customer), label: "Annual customer value", sub: "Across " + valueProjects.length + " applications" }, { head: fmtM(valueTotals.sdlc), label: "SDLC value", sub: "Traditional build-and-maintain cost" }, { head: fmtM(valueTotals.customer + valueTotals.sdlc), label: "Combined", sub: "Total measurable impact" }]}
        sections={sections} />
      <SolSection id="va-apps" num="01" label="By application" title="Where the value sits" sub="Re-rank the portfolio by customer value, SDLC value, or both." icon="chart" color={VALUE_COLOR}>
        <ValueBoard />
      </SolSection>
      <SolSection id="va-mix" num="02" label="Mix" title="Each application's share" sub="How the totals split across the portfolio. Hover an application to isolate it." icon="sliders" color={VALUE_COLOR}>
        <ValueMix />
      </SolSection>
      <SolSection id="va-total" num="03" label="Totals" title="The portfolio in three numbers" icon="target" color={VALUE_COLOR}>
        <ValueTotals />
      </SolSection>
      <SolFooter strong="Value compounds with speed." text="The roadmap shows the order in which each application gets there." onNavigate={onNavigate} cta={{ label: "MPTS Roadmap", target: "roadmap", color: ROADMAP_COLOR }} />
    </SolPage>
  );
}

// ============================================================
// MAIN APP — TAB NAVIGATION
// ============================================================

const navGroups = [
  { label: "Glide Platform", items: [
    { id: "bolt", label: "Bolt PaaS", desc: "Build fast with AI" },
    { id: "dataplatform", label: "Data Platform", desc: "Governed data foundation" },
  ]},
  { label: "Solutions", items: [
    { id: "solutions", label: "Overview" },
    { id: "titan", label: "Titan" },
    { id: "novaxray", label: "Nova + X-Ray" },
    { id: "meridian", label: "Meridian" },
    { id: "skynet", label: PRACTICE_NAME },
    { id: "savingsiq", label: "SavingsIQ" },
    { id: "retentioniq", label: "RetentionIQ" },
  ]},
  { label: "Roadmap", items: [
    { id: "roadmap", label: "MPTS Roadmap", desc: "Portfolio and paths to Bolt" },
    { id: "value", label: "Value", desc: "What the portfolio delivers" },
  ]},
  { label: "AI Literacy", items: [
    { id: "timeline", label: "AI Evolution", desc: "Four years of AI, era by era" },
    { id: "framework", label: "Knowledge Levels", desc: "Five-level AI skills framework" },
  ]},
];

export default function App() {
  const [activePage, setActivePage] = useState("bolt");
  const navigate: Navigate = (id) => { setActivePage(id); setOpenMenu(null); if (typeof window !== "undefined") window.scrollTo(0, 0); };
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#0B1A33", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } } * { box-sizing: border-box; } @media (max-width: 760px) { .app-nav { padding: 0 6px !important; } .app-nav-by { display: none !important; } .app-nav-btn { padding: 8px 7px !important; gap: 4px !important; } .app-nav-btn > span { font-size: 14px !important; } .app-nav-btn > svg { display: none; } .app-nav-groups { gap: 0 !important; } .app-nav-groups > div:nth-child(n+3) .app-nav-menu { left: auto !important; right: 0; } .app-nav-menu { min-width: 190px !important; max-width: calc(100vw - 12px); } .app-nav-menu span { white-space: normal !important; } }`}</style>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(7,16,33,0.95)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(148,163,184,0.08)" }}>
        <div className="app-nav" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div className="app-nav-groups" style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {navGroups.map((group) => {
              const isGroupActive = group.items.some(i => i.id === activePage);
              const isOpen = openMenu === group.label;
              return (
                <div key={group.label} style={{ position: "relative", paddingBottom: isOpen ? 4 : 0 }}
                  onMouseEnter={() => setOpenMenu(group.label)}
                  onMouseLeave={() => setOpenMenu(null)}>
                  <button className="app-nav-btn" aria-expanded={isOpen} onClick={() => setOpenMenu(group.label)} style={{
                    background: isGroupActive ? "rgba(59,130,246,0.12)" : "transparent",
                    border: isGroupActive ? "1px solid rgba(59,130,246,0.25)" : "1px solid transparent",
                    borderRadius: 8, padding: "8px 18px", cursor: "pointer", outline: "none",
                    display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s ease",
                  }}>
                    <span style={{ fontSize: 15, fontWeight: isGroupActive ? 600 : 500, color: isGroupActive ? "#F0F4F8" : "#D0DAE6", whiteSpace: "nowrap", transition: "color 0.2s ease" }}>{group.label}</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" style={{ transition: "transform 0.2s ease", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                      <path d="M1.5 3.5 L5 7 L8.5 3.5" fill="none" stroke="#B8C8DA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="app-nav-menu" style={{
                      position: "absolute", top: "100%", left: 0,
                      background: "rgba(7,16,33,0.98)", border: "1px solid rgba(148,163,184,0.12)",
                      borderRadius: 10, padding: "6px", minWidth: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                      animation: "fadeIn 0.15s ease",
                    }}>
                      {group.items.map((item) => {
                        const isActive = activePage === item.id;
                        return (
                          <button key={item.id} onClick={() => navigate(item.id)} style={{
                            display: "block", width: "100%", textAlign: "left",
                            background: isActive ? "rgba(59,130,246,0.12)" : "transparent",
                            border: "none", borderRadius: 6, padding: "10px 14px",
                            cursor: "pointer", outline: "none", transition: "background 0.15s ease",
                          }}
                            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(148,163,184,0.08)"; }}
                            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                            <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 400, color: isActive ? "#3B82F6" : "#E2EAF2", whiteSpace: "nowrap" }}>{item.label}</span>
                            {"desc" in item && item.desc && <span style={{ display: "block", fontSize: 12.5, color: "#94A8C0", marginTop: 2, whiteSpace: "nowrap" }}>{item.desc}</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <span className="app-nav-by" style={{ fontSize: 14, color: "#B8C8DA", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.3, whiteSpace: "nowrap" }}>{"Dan Lodder \u00B7 October 2026"}</span>
        </div>
      </nav>
      <div key={activePage} style={{ animation: "fadeIn 0.3s ease" }}>
        {activePage === "solutions" && <SolutionsOverviewPage onNavigate={navigate} />}
        {activePage === "titan" && <TitanPage onNavigate={navigate} />}
        {activePage === "savingsiq" && <SavingsIQPage onNavigate={navigate} />}
        {activePage === "novaxray" && <NovaXrayPage onNavigate={navigate} />}
        {activePage === "meridian" && <MeridianPage onNavigate={navigate} />}
        {activePage === "skynet" && <SkynetPage onNavigate={navigate} />}
        {activePage === "retentioniq" && <RetentionIQPage onNavigate={navigate} />}
        {activePage === "bolt" && <BoltPaaSPage onNavigate={navigate} />}
        {activePage === "dataplatform" && <DataPlatformPage onNavigate={navigate} />}
        {activePage === "roadmap" && <MptsRoadmapPage onNavigate={navigate} />}
        {activePage === "value" && <ValuePage onNavigate={navigate} />}
        {activePage === "timeline" && <TimelinePage onNavigate={navigate} />}
        {activePage === "framework" && <FrameworkPage onNavigate={navigate} />}
      </div>
    </div>
  );
}
