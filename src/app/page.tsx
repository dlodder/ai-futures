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

const solutionPageIds: Record<string, string> = { titan: "titan", nova: "novaxray", xray: "novaxray", skynet: "skynet" };

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
        <CrossLink label="Built on Bolt PaaS" target="bolt" onNavigate={onNavigate} color="#8B5CF6" />
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

function TitanPage({ onNavigate }: { onNavigate: Navigate }) {
  const [detected, setDetected] = useState(false);
  const TITAN = "#F59E0B";

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
      {/* HERO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <h1 style={{ fontSize: 42, fontWeight: 700, color: "#FFFFFF", margin: 0, lineHeight: 1.15 }}>Titan</h1>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: "#10B981", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 4, padding: "3px 10px", letterSpacing: 0.5, marginTop: 12 }}>Live</span>
      </div>
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 6px", maxWidth: 780, lineHeight: 1.6 }}>Payer Policy Intelligence</p>
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 12px", maxWidth: 820, lineHeight: 1.6 }}>Ends the quarterly manual grind of tracking payer policy changes. Titan continuously monitors formularies, step therapy requirements, and preferred drug lists across oncology drugs and biosimilars, so the right drug is verified before treatment, not after a denial.</p>
      <div style={{ display: "flex", gap: 16, marginBottom: 48, flexWrap: "wrap" }}>
        {[{ label: "Surveillance", value: "24/7" }, { label: "Extracted", value: "Formulary + Step Therapy" }, { label: "Delivery", value: "UI + API" }, { label: "Coverage", value: "Oncology + Biosimilars" }].map((stat, i) => (
          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</span>
            <span style={{ fontSize: 13, color: "#B8C8DA" }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <SectionHeader label="How Titan Works" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 4 }}>
        {titanStages.map((st, i) => (
          <div key={st.id} style={{ background: `${st.color}0C`, border: `1px solid ${st.color}30`, borderRadius: 12, padding: "18px 16px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: st.color, opacity: 0.7 }} />
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: st.color, marginBottom: 6 }}>{"0" + (i + 1)}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", marginBottom: 2 }}>{st.stage}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: st.color, marginBottom: 10 }}>{st.nickname}</div>
            <div style={{ fontSize: 14, color: "#D0DAE6", lineHeight: 1.5 }}>{st.desc}</div>
          </div>
        ))}
      </div>

      {/* POLICY CHANGE DETECTED (ILLUSTRATIVE) */}
      <div style={{ marginTop: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#E2EAF2" }}>Policy Change Detected</div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: "#6BA3D4", background: "rgba(107,163,212,0.12)", border: "1px solid rgba(107,163,212,0.3)", borderRadius: 4, padding: "2px 8px" }}>ILLUSTRATIVE</span>
        </div>
        <Card style={{ padding: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 56px 1fr", gap: 12, alignItems: "stretch" }}>
            <div style={{ background: "rgba(148,163,184,0.06)", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA", marginBottom: 10 }}>Payer policy document (excerpt)</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#B8C8DA", lineHeight: 1.7 }}>
                {"Sample Commercial Plan — Medical Drug Policy, Section 4.2 (revised). Coverage of reference long-acting G-CSF products requires documented trial and failure of a preferred biosimilar unless a clinical exception applies. Preferred products are listed in Appendix B. Changes take effect on the first day of the following month."}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="36" height="24" viewBox="0 0 36 24"><path d="M2 12 H30 M23 5 L31 12 L23 19" fill="none" stroke={detected ? TITAN : "rgba(148,163,184,0.4)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div style={{ background: detected ? `${TITAN}0C` : "rgba(16,34,66,0.4)", border: `1px solid ${detected ? TITAN + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 10, padding: "18px 20px", transition: "all 0.3s ease" }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: detected ? TITAN : "#B8C8DA", marginBottom: 12 }}>Structured rule</div>
              {detected ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "fadeIn 0.3s ease" }}>
                  {[{ k: "Payer", v: "Sample Commercial Plan" }, { k: "Drug class", v: "Long-acting G-CSF" }, { k: "Preferred", v: "Biosimilar products (Appendix B)" }, { k: "Step therapy", v: "Required before reference product" }, { k: "Exception", v: "Clinical exception allowed" }, { k: "Effective", v: "First of next month" }].map((row) => (
                    <div key={row.k} style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "#B8C8DA" }}>{row.k}</span>
                      <span style={{ fontSize: 15, color: "#FFFFFF" }}>{row.v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: 15, color: "#A8B8CC" }}>Run detection to see Titan turn the document into a structured coverage rule.</span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18 }}>
            <button onClick={() => setDetected(!detected)} style={{ background: detected ? "transparent" : `${TITAN}20`, border: `1px solid ${TITAN}60`, borderRadius: 8, padding: "10px 18px", cursor: "pointer", outline: "none", fontSize: 15, fontWeight: 600, color: TITAN }}>{detected ? "Reset" : "Run detection"}</button>
            <span style={{ fontSize: 13, color: "#A8B8CC" }}>Illustrative payer and policy text. Not a real policy.</span>
          </div>
        </Card>
      </div>

      {/* BEFORE & AFTER */}
      <div style={{ marginTop: 28 }}>
        <SectionHeader label="Before & After" />
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", padding: "14px 20px", borderBottom: "1px solid rgba(148,163,184,0.1)", background: "rgba(16,34,66,0.3)" }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#B8C8DA" }}>Dimension</span>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#EF4444" }}>The Old Way</span>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#10B981" }}>With Titan</span>
          </div>
          {titanBeforeAfter.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", padding: "14px 20px", borderBottom: i < titanBeforeAfter.length - 1 ? "1px solid rgba(148,163,184,0.06)" : "none", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#E2EAF2" }}>{row.dimension}</span>
              <span style={{ fontSize: 14, color: "#B8C8DA" }}>{row.before}</span>
              <span style={{ fontSize: 14, color: "#10B981" }}>{row.after}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* PLATFORM CONNECTIONS */}
      <div style={{ marginTop: 28 }}>
        <SectionHeader label="On the Glide Platform" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <Card style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 12 }}>Intelligence services</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {["Agents", "AI Prompting Tools"].map((d) => (<span key={d} style={{ fontSize: 14, color: TITAN, background: `${TITAN}12`, border: `1px solid ${TITAN}25`, borderRadius: 6, padding: "4px 10px" }}>{d}</span>))}
            </div>
            <CrossLink label="Bolt PaaS" target="bolt" onNavigate={onNavigate} color="#8B5CF6" />
          </Card>
          <Card style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 12 }}>Data domains</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {["Payer Policy Surveillance", "Biosimilar Utilization"].map((d) => (<span key={d} style={{ fontSize: 14, color: "#D0DAE6", background: "rgba(148,163,184,0.08)", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 6, padding: "4px 10px" }}>{d}</span>))}
            </div>
            <CrossLink label="Data Platform" target="dataplatform" onNavigate={onNavigate} color="#10B981" />
          </Card>
          <Card style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 12 }}>Feeds</div>
            <p style={{ fontSize: 15, color: "#E2EAF2", margin: "0 0 14px", lineHeight: 1.5 }}>{"Titan’s payer policy intelligence is a live data source for " + PRACTICE_NAME + "’s partnership reviews."}</p>
            <CrossLink label={PRACTICE_NAME} target="skynet" onNavigate={onNavigate} color="#EF4444" />
          </Card>
        </div>
      </div>

      {/* IMPACT CALLOUT */}
      <div style={{ marginTop: 28, padding: "16px 20px", background: `${TITAN}0A`, border: `1px solid ${TITAN}25`, borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ color: TITAN, fontSize: 16, marginTop: 1 }}>{"◆"}</span>
        <span style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.6 }}>Removes administrative barriers for cancer patients. The right drug is verified before treatment, not after a denial.</span>
      </div>
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
            <div key={era.id} onClick={() => setActiveEra(activeEra === i ? null : i)} style={{ background: activeEra === i ? `${era.color}14` : "rgba(16,34,66,0.6)", border: `1px solid ${activeEra === i ? era.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
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
            <div key={l.level} onClick={() => setActiveLevel(activeLevel === i ? null : i)} style={{ background: activeLevel === i ? `${l.color}14` : "rgba(16,34,66,0.6)", border: `1px solid ${activeLevel === i ? l.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
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
          <div key={p.id} onClick={() => setActiveProject(activeProject === i ? null : i)} style={{ background: activeProject === i ? `${p.color}14` : "rgba(16,34,66,0.6)", border: `1px solid ${activeProject === i ? p.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "22px 20px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
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
            <div style={{ background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 14 }}>Capabilities</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {selectedProject.capabilities.map((c, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: selectedProject.color, marginTop: 7, flexShrink: 0, boxShadow: `0 0 6px ${selectedProject.color}40` }} /><span style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.5 }}>{c}</span></div>))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 12 }}>Data inputs</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{selectedProject.dataInputs.map((d, i) => (<span key={i} style={{ fontSize: 14, color: "#D0DAE6", background: "rgba(148,163,184,0.08)", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 6, padding: "4px 10px" }}>{d}</span>))}</div>
              </div>
              <div style={{ background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20, flex: 1 }}>
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
        <div style={{ background: "rgba(16,34,66,0.8)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: "12px 12px 0 0", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #10B981" }}>
          <div><div style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", letterSpacing: 0.3 }}>KEYTRUDA 25MG/ML 4ML SDV 2/PAC</div><div style={{ fontSize: 14, color: "#B8C8DA", marginTop: 2 }}>Central Arkansas Radiation Therapy Institute</div></div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: "#10B981", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 6, padding: "4px 12px" }}>Onmark</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 1fr", gap: 0, background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.12)", borderTop: "none", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
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
              <div style={{ padding: "12px 16px", background: "rgba(16,34,66,0.6)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: "8px 8px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF" }}>WAC Price</div><div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 2 }}>Wholesale Acquisition Cost &mdash; starting point</div></div><span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", fontFamily: "'JetBrains Mono', monospace" }}>$12,272</span></div>
              <div style={{ padding: "12px 16px", background: "rgba(16,34,66,0.4)", border: "1px solid rgba(148,163,184,0.06)", borderTop: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF" }}>Contract Price</div><div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 2 }}>GPO / McKesson negotiated price</div></div><div style={{ textAlign: "right" }}><span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", fontFamily: "'JetBrains Mono', monospace" }}>$11,902.61</span><div style={{ fontSize: 13, color: "#F59E0B", fontFamily: "'JetBrains Mono', monospace" }}>3.01%</div></div></div>
              <div style={{ padding: "6px 16px", background: "rgba(236,72,153,0.06)", borderLeft: "2px solid #EC4899", marginTop: 8 }}><span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#EC4899" }}>Distributor Pricing</span></div>
              <div style={{ padding: "12px 16px", background: "rgba(16,34,66,0.4)", border: "1px solid rgba(148,163,184,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF" }}>Distributor Discount</div><div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 2 }}>Invoice markdown applied at distribution</div></div><div style={{ textAlign: "right" }}><span style={{ fontSize: 16, fontWeight: 700, color: "#EF4444", fontFamily: "'JetBrains Mono', monospace" }}>-$59.51</span><div style={{ fontSize: 13, color: "#B8C8DA", fontFamily: "'JetBrains Mono', monospace" }}>0.50%</div></div></div>
              <div style={{ padding: "12px 16px", background: "rgba(16,34,66,0.6)", border: "1px solid rgba(148,163,184,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF" }}>Invoice Price</div><div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 2 }}>As billed on invoice</div></div><span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", fontFamily: "'JetBrains Mono', monospace" }}>$11,843.1</span></div>
              <div style={{ padding: "6px 16px", background: "rgba(245,158,11,0.06)", borderLeft: "2px solid #F59E0B", marginTop: 8 }}><span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#F59E0B" }}>Rebates &amp; Incentives</span></div>
              <div style={{ padding: "12px 16px", background: "rgba(16,34,66,0.4)", border: "1px solid rgba(148,163,184,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF" }}>Distributor Rebate</div><div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 2 }}>Annual rebate value</div></div><div style={{ textAlign: "right" }}><span style={{ fontSize: 16, fontWeight: 700, color: "#EF4444", fontFamily: "'JetBrains Mono', monospace" }}>-$171.72</span><div style={{ fontSize: 13, color: "#B8C8DA", fontFamily: "'JetBrains Mono', monospace" }}>1.45%</div></div></div>
              <div style={{ padding: "12px 16px", background: "rgba(16,34,66,0.4)", border: "1px solid rgba(148,163,184,0.06)", borderTop: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF" }}>GPO Rebate / Value</div><div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 2 }}>Quarterly rebate distribution</div></div><div style={{ textAlign: "right" }}><span style={{ fontSize: 16, fontWeight: 700, color: "#EF4444", fontFamily: "'JetBrains Mono', monospace" }}>-$350.39</span><div style={{ fontSize: 13, color: "#B8C8DA", fontFamily: "'JetBrains Mono', monospace" }}>2.94%</div></div></div>
              <div style={{ padding: "14px 16px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "0 0 8px 8px", marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 16, fontWeight: 700, color: "#10B981", letterSpacing: 0.5 }}>NET PRICE / UNIT</span><span style={{ fontSize: 22, fontWeight: 700, color: "#10B981", fontFamily: "'JetBrains Mono', monospace" }}>$11,320.98</span></div>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 12 }}>
          {[{ label: "NET PRICE / UNIT", value: "$11,320.98", sub: "After all discounts & rebates", color: "#FFFFFF", bg: "rgba(16,34,66,0.6)" }, { label: "REIMBURSEMENT / UNIT", value: "$11,945.2", sub: "ASP benchmark", color: "#FFFFFF", bg: "rgba(16,34,66,0.6)" }, { label: "NET COST RECOVERY", value: "$624.22", sub: "Reimbursement minus net price", color: "#10B981", bg: "rgba(16,185,129,0.08)" }, { label: "EFFECTIVE DISCOUNT VS WAC", value: "7.75%", sub: "Combined discount rate", color: "#FFFFFF", bg: "rgba(16,34,66,0.6)" }].map((kpi, i) => (
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
            <div key={phase.id} onClick={() => setActivePhase(activePhase === i ? null : i)} style={{ background: activePhase === i ? `${phase.color}14` : "rgba(16,34,66,0.6)", border: `1px solid ${activePhase === i ? phase.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
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
            <div style={{ background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20 }}>
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
          <div key={layer.id} style={{ background: "rgba(16,34,66,0.6)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 12, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
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
          <div key={bucket.id} onClick={() => setActiveDataBucket(activeDataBucket === i ? null : i)} style={{ background: activeDataBucket === i ? `${bucket.color}14` : "rgba(16,34,66,0.6)", border: `1px solid ${activeDataBucket === i ? bucket.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "16px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: bucket.color, opacity: activeDataBucket === i ? 1 : 0.35 }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: bucket.color, marginBottom: 10, lineHeight: 1.3, minHeight: 34 }}>{bucket.title}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{bucket.items.slice(0, 3).map((item, j) => (<span key={j} style={{ fontSize: 13, color: "#E2EAF2", background: "rgba(148,163,184,0.10)", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 4, padding: "2px 7px" }}>{item}</span>))}{bucket.items.length > 3 && <span style={{ fontSize: 13, color: "#D0DAE6", padding: "2px 4px" }}>+{bucket.items.length - 3} more</span>}</div>
          </div>
        ))}
      </div>
      {selectedBucket && (
        <div style={{ margin: "12px 0 0", background: `${selectedBucket.color}08`, border: `1px solid ${selectedBucket.color}20`, borderRadius: 12, padding: "24px 28px", animation: "fadeIn 0.2s ease" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedBucket.color, marginBottom: 16 }}>{selectedBucket.title} &mdash; full data inventory</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>{selectedBucket.items.map((item, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 8 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: selectedBucket.color, flexShrink: 0, boxShadow: `0 0 6px ${selectedBucket.color}50` }} /><span style={{ fontSize: 16, color: "#E2EAF2" }}>{item}</span></div>))}</div>
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
        {meridianPages.slice(0, 4).map((page, i) => (<div key={page.id} onClick={() => setActivePage(activePage === i ? null : i)} style={{ background: activePage === i ? `${page.color}14` : "rgba(16,34,66,0.6)", border: `1px solid ${activePage === i ? page.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: page.color, opacity: activePage === i ? 1 : 0.4 }} /><div style={{ fontSize: 16, fontWeight: 600, color: page.color, marginBottom: 4 }}>{page.name}</div><div style={{ fontSize: 14, color: "#D0DAE6", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{page.description.split(".")[0]}.</div></div>))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 12, marginBottom: 4 }}>
        {meridianPages.slice(4).map((page, i) => { const idx = i + 4; return (<div key={page.id} onClick={() => setActivePage(activePage === idx ? null : idx)} style={{ background: activePage === idx ? `${page.color}14` : "rgba(16,34,66,0.6)", border: `1px solid ${activePage === idx ? page.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: page.color, opacity: activePage === idx ? 1 : 0.4 }} /><div style={{ fontSize: 16, fontWeight: 600, color: page.color, marginBottom: 4 }}>{page.name}</div><div style={{ fontSize: 14, color: "#D0DAE6", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{page.description.split(".")[0]}.</div></div>); })}
      </div>

      {selectedPage && (
        <div style={{ margin: "12px 0 0", background: `${selectedPage.color}08`, border: `1px solid ${selectedPage.color}20`, borderRadius: 12, padding: "28px 28px 24px", animation: "fadeIn 0.2s ease" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedPage.color, marginBottom: 6 }}>{selectedPage.name}</div>
          <p style={{ fontSize: 17, color: "#E2EAF2", margin: "0 0 20px", lineHeight: 1.65, maxWidth: 800 }}>{selectedPage.description}</p>
          <div style={{ background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20 }}>
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
            {meridianScoring.map((s, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 0, background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 8, overflow: "hidden" }}><div style={{ width: 4, background: s.color, alignSelf: "stretch", flexShrink: 0 }} /><div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 16, flex: 1 }}><div style={{ minWidth: 52, textAlign: "center" }}><span style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.weight}</span></div><div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF", marginBottom: 2 }}>{s.domain}</div><div style={{ fontSize: 14, color: "#B8C8DA" }}>{s.direction}</div></div><div style={{ fontSize: 14, color: "#D0DAE6", maxWidth: 320, lineHeight: 1.4 }}>{s.inputs}</div></div></div>))}
          </div>
        </Card>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "32px 40px 20px" }}><div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} /><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#D0DAE6", whiteSpace: "nowrap" }}>builds on</span><div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} /></div>

      <SectionHeader label="Intelligence layer" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 4 }}>
        {meridianIntelligence.map((layer) => (<div key={layer.id} style={{ background: "rgba(16,34,66,0.6)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 12, padding: "20px 18px", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: layer.color, opacity: 0.5 }} /><div style={{ fontSize: 17, fontWeight: 600, color: "#FFFFFF", marginBottom: 3 }}>{layer.title}</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#B8C8DA", marginBottom: 14 }}>{layer.subtitle}</div><div style={{ display: "flex", flexDirection: "column", gap: 7 }}>{layer.capabilities.map((c, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: layer.color, marginTop: 6, flexShrink: 0 }} /><span style={{ fontSize: 15, color: "#E2EAF2", lineHeight: 1.5 }}>{c}</span></div>))}</div></div>))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 40px" }}><div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} /><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#D0DAE6", whiteSpace: "nowrap" }}>powered by</span><div style={{ flex: 1, height: 1, background: "rgba(148,163,184,0.1)" }} /></div>

      <SectionHeader label="Data sources" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {meridianData.slice(0, 4).map((source, i) => (<div key={source.id} onClick={() => setActiveDataSource(activeDataSource === i ? null : i)} style={{ background: activeDataSource === i ? `${source.color}14` : "rgba(16,34,66,0.6)", border: `1px solid ${activeDataSource === i ? source.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "16px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: source.color, opacity: activeDataSource === i ? 1 : 0.35 }} /><div style={{ fontSize: 15, fontWeight: 600, color: source.color, marginBottom: 6, lineHeight: 1.3 }}>{source.title}</div><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#B8C8DA", background: "rgba(148,163,184,0.08)", borderRadius: 4, padding: "2px 6px" }}>{source.refresh}</span></div>))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 12 }}>
        {meridianData.slice(4).map((source, i) => { const idx = i + 4; return (<div key={source.id} onClick={() => setActiveDataSource(activeDataSource === idx ? null : idx)} style={{ background: activeDataSource === idx ? `${source.color}14` : "rgba(16,34,66,0.6)", border: `1px solid ${activeDataSource === idx ? source.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "16px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: source.color, opacity: activeDataSource === idx ? 1 : 0.35 }} /><div style={{ fontSize: 15, fontWeight: 600, color: source.color, marginBottom: 6, lineHeight: 1.3 }}>{source.title}</div><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#B8C8DA", background: "rgba(148,163,184,0.08)", borderRadius: 4, padding: "2px 6px" }}>{source.refresh}</span></div>); })}
      </div>

      {selectedSource && (
        <div style={{ margin: "12px 0 0", background: `${selectedSource.color}08`, border: `1px solid ${selectedSource.color}20`, borderRadius: 12, padding: "24px 28px", animation: "fadeIn 0.2s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedSource.color }}>{selectedSource.title}</div><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#B8C8DA", background: "rgba(148,163,184,0.1)", borderRadius: 4, padding: "2px 8px" }}>Refresh: {selectedSource.refresh}</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>{selectedSource.items.map((item, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 8 }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: selectedSource.color, flexShrink: 0, boxShadow: `0 0 6px ${selectedSource.color}50` }} /><span style={{ fontSize: 16, color: "#E2EAF2" }}>{item}</span></div>))}</div>
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
        <h1 style={{ fontSize: 42, fontWeight: 700, color: "#FFFFFF", margin: 0, lineHeight: 1.15 }}>{PRACTICE_NAME}</h1>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: "#8B5CF6", background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 4, padding: "3px 10px", letterSpacing: 0.5, marginTop: 12 }}>Pilot</span>
      </div>
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 6px", maxWidth: 780, lineHeight: 1.6 }}>Dynamic QBR Portal</p>
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 12px", maxWidth: 820, lineHeight: 1.6 }}>Replaces the static PowerPoint QBR with a live, interactive customer portal. Pulls data from 6+ disparate sources into a unified schema. Sales reps and customers ask any question in natural language &mdash; converted to SQL on the fly against a live database.</p>
      <div style={{ display: "flex", gap: 16, marginBottom: 48 }}>
        {[{ label: "QBR sections", value: "8" }, { label: "Data sources", value: "6+" }, { label: "Query engine", value: "NL \u2192 SQL" }, { label: "Accounts", value: "200+" }].map((stat, i) => (<div key={i} style={{ display: "flex", alignItems: "baseline", gap: 6 }}><span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</span><span style={{ fontSize: 13, color: "#B8C8DA" }}>{stat.label}</span></div>))}
      </div>

      <SectionHeader label="Dashboard Preview" />
      <div style={{ background: "rgba(16,34,66,0.6)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: "12px 12px 0 0", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><div style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF" }}>Springfield Medical Center</div><div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 2 }}>Q1 2026 &middot; Powered by your McKesson partnership</div></div>
        <span style={{ fontSize: 12, color: "#B8C8DA", fontFamily: "'JetBrains Mono', monospace" }}>Data Last Refreshed: Feb 28, 2026</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
        {skynetKPIs.map((kpi, i) => (<div key={i} style={{ background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.08)", padding: "20px", borderLeft: i === 0 ? "1px solid rgba(148,163,184,0.12)" : "none", borderRight: "1px solid rgba(148,163,184,0.12)" }}><div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#B8C8DA", marginBottom: 8 }}>{kpi.label}</div><div style={{ fontSize: 28, fontWeight: 700, color: kpi.color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{kpi.value}</div><div style={{ fontSize: 14, color: "#B8C8DA", marginTop: 6 }}>{kpi.sub}</div></div>))}
      </div>
      <div style={{ display: "flex", gap: 0, background: "rgba(16,34,66,0.4)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: "0 0 12px 12px", overflow: "hidden", marginBottom: 4 }}>
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
            {[[70, 44], [132, 40], [194, 42], [256, 34], [318, 30], [380, 26]].map(([cx, cy], i) => (<circle key={i} cx={cx} cy={cy} r={4} fill="#3B82F6" stroke="#0B1A33" strokeWidth={2} />))}
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
          <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 60px 20px 1fr 100px 70px 80px", padding: "14px 20px", borderBottom: "1px solid rgba(148,163,184,0.1)", background: "rgba(16,34,66,0.3)" }}>
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
        <div style={{ background: "rgba(16,34,66,0.6)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "28px 28px 24px" }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 20px", borderBottom: "1px solid rgba(148,163,184,0.1)", background: "rgba(16,34,66,0.3)" }}><span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#B8C8DA" }}>Dimension</span><span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#EF4444" }}>Static PowerPoint QBR</span><span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#10B981" }}>{PRACTICE_NAME} Dynamic Portal</span></div>
          {skynetBeforeAfter.map((row, i) => (<div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 20px", borderBottom: i < skynetBeforeAfter.length - 1 ? "1px solid rgba(148,163,184,0.06)" : "none", alignItems: "center" }}><span style={{ fontSize: 14, fontWeight: 600, color: "#E2EAF2" }}>{row.dimension}</span><span style={{ fontSize: 14, color: "#B8C8DA" }}>{row.before}</span><span style={{ fontSize: 14, color: "#10B981" }}>{row.after}</span></div>))}
        </Card>
      </div>

      <div style={{ marginTop: 28 }}>
        <SectionHeader label="Intelligence Layer" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[{ title: "AI Prompting Tools", subtitle: "LLM interfaces", color: "#3B82F6", capabilities: ["Natural language to SQL", "Conversational Q&A on live data", "Portfolio insight generation", "Cross-section trend detection", "Payer policy summaries (via Titan)"] }, { title: "Machine Learning", subtitle: "Pattern recognition", color: "#8B5CF6", capabilities: ["Recommended actions scoring", "Biosimilar adoption forecasting", "Anomaly detection on spend shifts", "Provider performance clustering", "GPO tier optimization signals"] }, { title: "Agents", subtitle: "Automated workflows", color: "#F59E0B", capabilities: ["Scheduled data aggregation", "Multi-source pipeline orchestration", "QBR auto-assembly", "Payer surveillance feed (Titan)", "Alert generation on threshold breaches"] }].map((layer) => (<div key={layer.title} style={{ background: "rgba(16,34,66,0.6)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 12, padding: "20px 18px", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: layer.color, opacity: 0.5 }} /><div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF", marginBottom: 3 }}>{layer.title}</div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#B8C8DA", marginBottom: 16 }}>{layer.subtitle}</div><div style={{ display: "flex", flexDirection: "column", gap: 7 }}>{layer.capabilities.map((c, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}><div style={{ width: 4, height: 4, borderRadius: "50%", background: layer.color, marginTop: 7, flexShrink: 0, opacity: 1 }} /><span style={{ fontSize: 14, color: "#E2EAF2", lineHeight: 1.5 }}>{c}</span></div>))}</div></div>))}
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <SectionHeader label="Data Sources" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 4 }}>
          {skynetDataSources.map((src, i) => (<div key={i} onClick={() => setActiveSource(activeSource === i ? null : i)} style={{ background: activeSource === i ? `${src.color}14` : "rgba(16,34,66,0.6)", border: `1px solid ${activeSource === i ? src.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: src.color, opacity: activeSource === i ? 1 : 0.35 }} /><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}><div style={{ fontSize: 14, fontWeight: 600, color: src.color }}>{src.name}</div><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: "#10B981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 4, padding: "2px 7px" }}>{src.refresh}</span></div><div style={{ fontSize: 13, color: "#D0DAE6", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{src.desc.split("\u2014")[0]}.</div></div>))}
        </div>
        {selectedSource && (<div style={{ margin: "12px 0 0", background: `${selectedSource.color}08`, border: `1px solid ${selectedSource.color}20`, borderRadius: 12, padding: "24px 28px", animation: "fadeIn 0.2s ease" }}><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedSource.color, marginBottom: 8 }}>{selectedSource.name}</div><p style={{ fontSize: 15, color: "#E2EAF2", margin: 0, lineHeight: 1.65 }}>{selectedSource.desc}</p></div>)}
      </div>

      <div style={{ marginTop: 28, padding: "16px 20px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 12 }}><span style={{ color: "#EF4444", fontSize: 16, marginTop: 1 }}>{"\u25C6"}</span><span style={{ fontSize: 16, color: "#E2EAF2", lineHeight: 1.6 }}>{PRACTICE_NAME} replaces the single most time-consuming sales deliverable at McKesson Specialty Health. Every QBR today requires 4&ndash;8 hours of manual data gathering and PowerPoint assembly per account. With 200+ accounts on quarterly cycles, that&apos;s 800&ndash;1,600 hours per quarter of rep time redirected from selling to slide-building.</span></div>
      <div style={{ height: 64 }} />
    </div>
  );
}

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
    { name: "Supabase", desc: "PostgreSQL with row-level security, auth and real-time subscriptions, provisioned per project with managed migrations." },
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
    { shown: `${Math.round(9 * p)} apps`, final: "9 apps", label: "In 163 days", sub: "Built on Bolt since April 2026", subFinal: "Built on Bolt since April 2026", fade: false },
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
  const slab = (y: number, color: string, lit: boolean) => (
    <g>
      <polygon points={`${cx - w},${y} ${cx},${y + h} ${cx},${y + h + t} ${cx - w},${y + t}`} fill={color} fillOpacity={0.16} stroke={color} strokeOpacity={0.5} />
      <polygon points={`${cx},${y + h} ${cx + w},${y} ${cx + w},${y + t} ${cx},${y + h + t}`} fill={color} fillOpacity={0.26} stroke={color} strokeOpacity={0.5} />
      <polygon points={`${cx},${y - h} ${cx + w},${y} ${cx},${y + h} ${cx - w},${y}`} fill={color} fillOpacity={lit ? 0.38 : 0.22} stroke={color} strokeWidth={lit ? 2.2 : 1.4} />
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
    { id: "bolt", y: 126, dy: 0, title: "Bolt Platform", sub: "Build fast with AI", color: BOLT_COLOR, action: "See how it works" },
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
          ) : slab(l.y, l.id === "bolt" ? BOLT_COLOR : "#10B981", lit(l.id))}
          <line x1={cx + w + 4} y1={l.y} x2={212} y2={l.y} stroke={l.color} strokeOpacity={exploded ? 0.9 : 0.5} strokeDasharray="3 3" />
          <text x={218} y={l.y - 2} fontSize={14} fontWeight={700} fill="#FFFFFF" fontFamily="DM Sans, sans-serif">{l.title}</text>
          <text x={218} y={l.y + 15} fontSize={12} fill={exploded && interactive ? l.color : "#B8C8DA"} fontFamily="DM Sans, sans-serif">{exploded && interactive ? l.action + " →" : l.sub}</text>
        </g>
      ))}
      {motionOk && (
        <g aria-hidden="true" style={{ pointerEvents: "none", filter: `drop-shadow(0 0 4px ${BOLT_COLOR})` }}>
          {[-34, 18, -10, 30, -22, 6, 40, -40].map((dx, i) => (
            <circle key={i} cx={cx + dx} cy={212} r={i % 3 === 0 ? 3.6 : 2.7} fill="#34D399" opacity={0}>
              <animate attributeName="cy" values="214;126;46" keyTimes="0;0.5;1" dur="3.6s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
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
  { day: "Days 119–127", date: "Aug 9–17", title: "GPO · RetentionIQ · " + PRACTICE_NAME, detail: "Three domains in nine days", burst: true },
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
          {eyebrow("Glide Platform · Bolt PaaS")}
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
        {title("Nine applications in 163 days")}
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
          {eyebrow("Glide Platform · Data Platform")}
          <h2 className="bolt-anim" style={{ ...rise(0.08), fontSize: "clamp(44px, 5.6vw, 76px)", lineHeight: 1.05, letterSpacing: -1.5, color: "#FFFFFF", margin: 0 }}>{"Enterprise data,"}<br />{"turned into capabilities."}</h2>
          <p className="bolt-anim" style={{ ...rise(0.2), fontSize: 24, lineHeight: 1.5, color: "#D0DAE6", margin: "24px 0 0", maxWidth: 640 }}>{"A connected, governed foundation where applications, data products, analytics and AI are built once, reused everywhere, and inherit enterprise controls by default."}</p>
        </div>
        <div className="bolt-anim" style={{ ...rise(0.3), flex: "0 1 460px" }}><BoltHeroStack autoExplode litLayer="data" maxWidth={460} /></div>
      </div>
    ) },
    { id: "foundation", render: () => (
      <div>
        {eyebrow("Provider Solutions Data Platform")}
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
      <span aria-hidden="true" style={{ flexShrink: 0, width: 52, height: 52, borderRadius: 14, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(45,212,191,0.10)", border: "1px solid rgba(45,212,191,0.35)", boxShadow: "0 0 24px rgba(45,212,191,0.12)" }}>
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
            <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "clamp(34px, 4vw, 44px)", letterSpacing: -0.8, fontWeight: 700, color: "#FFFFFF", margin: 0, lineHeight: 1.15 }}>Bolt PaaS</h1>
              <BoltButton onClick={() => setPresenting(true)} aria-keyshortcuts="P" style={{ background: "rgba(45,212,191,0.12)", borderColor: BOLT_COLOR, color: BOLT_COLOR, padding: "6px 14px", minHeight: 38 }}>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24"><path d="M7 4v16l13-8L7 4Z" fill="currentColor" /></svg>
                <span>Present</span><span style={{ fontSize: 12, fontWeight: 500, color: "#B8C8DA", border: "1px solid rgba(184,200,218,0.35)", borderRadius: 4, padding: "0 5px" }}>P</span>
              </BoltButton>
            </div>
            <p style={{ fontSize: 20, color: "#E2EAF2", margin: "14px 0 0", maxWidth: 620, lineHeight: 1.55 }}>{"Business experts, product owners and engineers build with Claude Code and ship on McKesson’s governed AWS platform."}</p>
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
        <SectionTitle icon="chart" num="02" label="Proof" title="Nine applications in 163 days" sub="The harness and the first business domain launched together in April 2026, then Bolt expanded across business domains and infrastructure." color={BOLT_COLOR} />
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

function MptsRoadmapPage() {
  const [activeTier, setActiveTier] = useState<number | null>(null);
  const [activePath, setActivePath] = useState<number | null>(null);
  const [activeTool, setActiveTool] = useState<number | null>(null);

  const selectedTier = activeTier !== null ? portfolioTiers[activeTier] : null;
  const selectedPath = activePath !== null ? migrationPaths[activePath] : null;
  const selectedTool = activeTool !== null ? aiToolsRoadmap[activeTool] : null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
      {/* HERO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <h1 style={{ fontSize: 42, fontWeight: 700, color: "#FFFFFF", margin: 0, lineHeight: 1.15 }}>MPTS Roadmap</h1>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: "#F59E0B", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 4, padding: "3px 10px", letterSpacing: 0.5, marginTop: 12 }}>Building</span>
      </div>
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 6px", maxWidth: 780, lineHeight: 1.6 }}>McKesson Provider Technology Solutions &mdash; Application Portfolio &amp; Migration Strategy</p>
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 12px", maxWidth: 820, lineHeight: 1.6 }}>A three-tier view of every application we manage, where each is headed, and the tools and timelines that get them there.</p>
      <div style={{ display: "flex", gap: 16, marginBottom: 48 }}>
        {[{ label: "Applications", value: "10" }, { label: "Tiers", value: "3" }, { label: "Target velocity", value: "12\u00D7" }, { label: "Platform", value: "Bolt / AWS" }].map((stat, i) => (
          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</span>
            <span style={{ fontSize: 13, color: "#B8C8DA" }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* PORTFOLIO MAP */}
      <SectionHeader label="Application Portfolio" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 4 }}>
        {portfolioTiers.map((tier, ti) => (
          <div key={tier.id} onClick={() => setActiveTier(activeTier === ti ? null : ti)} style={{ cursor: "pointer" }}>
            <div style={{ background: `${tier.color}0C`, border: `1px solid ${tier.color}30`, borderRadius: "12px 12px 0 0", padding: "16px 20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: tier.color, opacity: activeTier === ti ? 1 : 0.5 }} />
              <div style={{ fontSize: 18, fontWeight: 700, color: tier.color }}>{tier.title}</div>
              <div style={{ fontSize: 13, color: "#D0DAE6", marginTop: 2 }}>{tier.subtitle}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#B8C8DA", marginTop: 6 }}>{tier.apps.length} {tier.apps.length === 1 ? "application" : "applications"}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {tier.apps.map((app, ai) => (
                <div key={ai} style={{ background: "rgba(16,34,66,0.6)", border: "1px solid rgba(148,163,184,0.12)", borderTop: ai === 0 ? "none" : "1px solid rgba(148,163,184,0.06)", borderRadius: ai === tier.apps.length - 1 ? "0 0 12px 12px" : 0, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{app.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>{app.name}</div>
                    <div style={{ fontSize: 12, color: "#B8C8DA", lineHeight: 1.3, marginTop: 2 }}>{app.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTier && (
        <div style={{ margin: "12px 0 0", background: `${selectedTier.color}08`, border: `1px solid ${selectedTier.color}20`, borderRadius: 12, padding: "24px 28px", animation: "fadeIn 0.2s ease" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedTier.color, marginBottom: 16 }}>{selectedTier.title} Tier &mdash; {selectedTier.apps.length} applications</div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(selectedTier.apps.length, 3)}, 1fr)`, gap: 12 }}>
            {selectedTier.apps.map((app, i) => (
              <div key={i} style={{ background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{app.icon}</span>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#FFFFFF" }}>{app.name}</div>
                </div>
                <div style={{ fontSize: 14, color: "#D0DAE6", lineHeight: 1.5, marginBottom: 8 }}>{app.desc}</div>
                {"users" in app && app.users && <div style={{ fontSize: 12, color: "#B8C8DA" }}>{app.users}</div>}
                {"status" in app && app.status && <div style={{ fontSize: 12, color: selectedTier.color, marginTop: 4 }}>Status: {app.status}</div>}
                {app.target !== "native" && (
                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12, color: "#B8C8DA" }}>Bolt migration:</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: selectedTier.color }}>{app.migration}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MIGRATION FLOW VISUAL */}
      <div style={{ margin: "48px 0 0" }}>
        <SectionHeader label="Migration Flow" />
        <Card style={{ padding: "28px 24px" }}>
          <svg viewBox="0 0 920 100" style={{ width: "100%", display: "block" }}>
            <rect x={0} y={10} width={260} height={80} rx={12} fill={`${ROADMAP_COLORS.legacy}0C`} stroke={`${ROADMAP_COLORS.legacy}30`} strokeWidth={1} />
            <rect x={0} y={10} width={260} height={3} rx={1.5} fill={ROADMAP_COLORS.legacy} opacity={0.6} />
            <text x={130} y={42} textAnchor="middle" fontSize="16" fontWeight="700" fill={ROADMAP_COLORS.legacy} fontFamily="DM Sans, sans-serif">Legacy</text>
            <text x={130} y={62} textAnchor="middle" fontSize="12" fill="#D0DAE6" fontFamily="JetBrains Mono, monospace">5 applications</text>
            <text x={130} y={80} textAnchor="middle" fontSize="11" fill="#B8C8DA" fontFamily="JetBrains Mono, monospace">Lynx, RetinaOS, Glide, RP, CC</text>
            <line x1={272} y1={50} x2={318} y2={50} stroke="rgba(148,163,184,0.3)" strokeWidth={1.5} />
            <path d="M314 46 L320 50 L314 54" fill="none" stroke="rgba(148,163,184,0.3)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            <text x={296} y={38} textAnchor="middle" fontSize="10" fill="#B8C8DA" fontFamily="JetBrains Mono, monospace">Sourcegraph</text>
            <text x={296} y={68} textAnchor="middle" fontSize="10" fill="#B8C8DA" fontFamily="JetBrains Mono, monospace">+ Blitzy</text>
            <rect x={330} y={10} width={260} height={80} rx={12} fill={`${ROADMAP_COLORS.intermediate}0C`} stroke={`${ROADMAP_COLORS.intermediate}30`} strokeWidth={1} />
            <rect x={330} y={10} width={260} height={3} rx={1.5} fill={ROADMAP_COLORS.intermediate} opacity={0.6} />
            <text x={460} y={42} textAnchor="middle" fontSize="16" fontWeight="700" fill={ROADMAP_COLORS.intermediate} fontFamily="DM Sans, sans-serif">Intermediate</text>
            <text x={460} y={62} textAnchor="middle" fontSize="12" fill="#D0DAE6" fontFamily="JetBrains Mono, monospace">4 applications</text>
            <text x={460} y={80} textAnchor="middle" fontSize="11" fill="#B8C8DA" fontFamily="JetBrains Mono, monospace">Titan, Nova, X-Ray, {PRACTICE_NAME}</text>
            <line x1={602} y1={50} x2={648} y2={50} stroke="rgba(148,163,184,0.3)" strokeWidth={1.5} />
            <path d="M644 46 L650 50 L644 54" fill="none" stroke="rgba(148,163,184,0.3)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            <text x={626} y={38} textAnchor="middle" fontSize="10" fill="#B8C8DA" fontFamily="JetBrains Mono, monospace">Claude Code</text>
            <text x={626} y={68} textAnchor="middle" fontSize="10" fill="#B8C8DA" fontFamily="JetBrains Mono, monospace">+ Review Gate</text>
            <rect x={660} y={10} width={260} height={80} rx={12} fill={`${ROADMAP_COLORS.bolt}0C`} stroke={`${ROADMAP_COLORS.bolt}30`} strokeWidth={1} />
            <rect x={660} y={10} width={260} height={3} rx={1.5} fill={ROADMAP_COLORS.bolt} opacity={0.6} />
            <text x={790} y={42} textAnchor="middle" fontSize="16" fontWeight="700" fill={ROADMAP_COLORS.bolt} fontFamily="DM Sans, sans-serif">Bolt PaaS</text>
            <text x={790} y={62} textAnchor="middle" fontSize="12" fill="#D0DAE6" fontFamily="JetBrains Mono, monospace">Meridian, Axiom + new</text>
            <text x={790} y={80} textAnchor="middle" fontSize="11" fill="#B8C8DA" fontFamily="JetBrains Mono, monospace">{"12\u00D7 faster delivery"}</text>
          </svg>
        </Card>
      </div>

      {/* MIGRATION PATHS */}
      <div style={{ margin: "28px 0 0" }}>
        <SectionHeader label="Migration Paths" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 4 }}>
          {migrationPaths.map((path, i) => (
            <div key={path.id} onClick={() => setActivePath(activePath === i ? null : i)} style={{ background: activePath === i ? `${path.color}14` : "rgba(16,34,66,0.6)", border: `1px solid ${activePath === i ? path.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: path.color, opacity: activePath === i ? 1 : 0.4 }} />
              <div style={{ fontSize: 16, fontWeight: 600, color: path.color, marginBottom: 4 }}>{path.title}</div>
              <div style={{ fontSize: 13, color: "#D0DAE6", marginBottom: 8, lineHeight: 1.4 }}>{path.subtitle}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#B8C8DA" }}>{path.timeline}</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {path.tools.slice(0, 2).map((t, j) => (<span key={j} style={{ fontSize: 11, color: "#D0DAE6", background: "rgba(148,163,184,0.08)", borderRadius: 4, padding: "2px 6px" }}>{t}</span>))}
                  {path.tools.length > 2 && <span style={{ fontSize: 11, color: "#B8C8DA", padding: "2px 4px" }}>+{path.tools.length - 2}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedPath && (
          <div style={{ margin: "12px 0 0", background: `${selectedPath.color}08`, border: `1px solid ${selectedPath.color}20`, borderRadius: 12, padding: "28px 28px 24px", animation: "fadeIn 0.2s ease" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedPath.color, marginBottom: 6 }}>{selectedPath.title}</div>
            <div style={{ fontSize: 14, color: selectedPath.color, marginBottom: 16 }}>Applications: {selectedPath.apps}</div>
            <p style={{ fontSize: 16, color: "#E2EAF2", margin: "0 0 20px", lineHeight: 1.65, maxWidth: 800 }}>{selectedPath.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 14 }}>Migration Steps</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {selectedPath.steps.map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${selectedPath.color}20`, border: `1px solid ${selectedPath.color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: selectedPath.color }}>{i + 1}</span>
                      </div>
                      <span style={{ fontSize: 15, color: "#E2EAF2", lineHeight: 1.5 }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "rgba(16,34,66,0.5)", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 10, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#D0DAE6", marginBottom: 14 }}>Tools Required</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {selectedPath.tools.map((tool, i) => (<span key={i} style={{ fontSize: 14, color: selectedPath.color, background: `${selectedPath.color}12`, border: `1px solid ${selectedPath.color}25`, borderRadius: 6, padding: "6px 14px" }}>{tool}</span>))}
                </div>
                <div style={{ marginTop: 16, padding: "12px 16px", background: `${selectedPath.color}08`, border: `1px solid ${selectedPath.color}15`, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: selectedPath.color, marginBottom: 4 }}>Timeline</div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: "#FFFFFF" }}>{selectedPath.timeline}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI TOOLING LANDSCAPE */}
      <div style={{ margin: "28px 0 0" }}>
        <SectionHeader label="AI Tooling Landscape" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 4 }}>
          {aiToolsRoadmap.map((tool, i) => (
            <div key={i} onClick={() => setActiveTool(activeTool === i ? null : i)} style={{ background: activeTool === i ? `${tool.color}14` : "rgba(16,34,66,0.6)", border: `1px solid ${activeTool === i ? tool.color + "40" : "rgba(148,163,184,0.12)"}`, borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "all 0.2s ease", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: tool.color, opacity: activeTool === i ? 1 : 0.4 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: tool.color }}>{tool.name}</div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: tool.status === "Approved" ? "#10B981" : tool.status === "Pending AI Council" ? "#F59E0B" : "#3B82F6", background: tool.status === "Approved" ? "rgba(16,185,129,0.1)" : tool.status === "Pending AI Council" ? "rgba(245,158,11,0.1)" : "rgba(59,130,246,0.1)", border: `1px solid ${tool.status === "Approved" ? "rgba(16,185,129,0.25)" : tool.status === "Pending AI Council" ? "rgba(245,158,11,0.25)" : "rgba(59,130,246,0.25)"}`, borderRadius: 4, padding: "1px 6px" }}>{tool.status}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {tool.tiers.map((t, j) => (<span key={j} style={{ fontSize: 11, color: "#D0DAE6", background: "rgba(148,163,184,0.08)", borderRadius: 4, padding: "2px 6px" }}>{t}</span>))}
              </div>
            </div>
          ))}
        </div>
        {selectedTool && (
          <div style={{ margin: "12px 0 0", background: `${selectedTool.color}08`, border: `1px solid ${selectedTool.color}20`, borderRadius: 12, padding: "24px 28px", animation: "fadeIn 0.2s ease" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: selectedTool.color, marginBottom: 8 }}>{selectedTool.name}</div>
            <p style={{ fontSize: 16, color: "#E2EAF2", margin: "0 0 12px", lineHeight: 1.65 }}>{selectedTool.desc}</p>
            <div style={{ padding: "10px 14px", background: "rgba(148,163,184,0.06)", border: "1px solid rgba(148,163,184,0.1)", borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: "#B8C8DA" }}>Limitation: {selectedTool.limitation}</span>
            </div>
          </div>
        )}
      </div>

      {/* TIMELINE */}
      <div style={{ margin: "28px 0 0" }}>
        <SectionHeader label="Execution Timeline" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {timelineBands.map((band) => (
            <div key={band.id} style={{ background: "rgba(16,34,66,0.6)", border: "1px solid rgba(148,163,184,0.12)", borderRadius: 12, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: band.color, opacity: 0.5 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: band.color }}>{band.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF", marginTop: 2 }}>{band.title}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {band.actions.map((action, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: band.color, marginTop: 7, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: "#E2EAF2", lineHeight: 1.5 }}>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM CALLOUT */}
      <div style={{ marginTop: 28, padding: "20px 24px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            "Every application in the portfolio has a path to Bolt \u2014 the question is sequence, not whether",
            "Intermediate apps move first because they\u2019re smaller, modern, and prove the migration pattern",
            "Legacy modernization requires new tooling (Sourcegraph, Blitzy) \u2014 which requires AI Council tool expansion",
            "The AI Council decision is the single gate: approve tool expansion and the entire roadmap accelerates",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <span style={{ color: "#10B981", fontSize: 14, marginTop: 2, flexShrink: 0 }}>{"\u25C6"}</span>
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

function ValuePage() {
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const totalCustomer = valueProjects.reduce((sum, p) => sum + p.customerRaw, 0);
  const totalSdlc = valueProjects.reduce((sum, p) => sum + p.sdlcRaw, 0);
  const formatTotal = (v: number) => `$${(v / 1000000).toFixed(2)}M`;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 0" }}>
      {/* HERO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <h1 style={{ fontSize: 42, fontWeight: 700, color: "#FFFFFF", margin: 0, lineHeight: 1.15 }}>Value</h1>
      </div>
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 6px", maxWidth: 780, lineHeight: 1.6 }}>MPTS Application Portfolio &mdash; Business Value &amp; SDLC Investment</p>
      <p style={{ fontSize: 17, color: "#D0DAE6", margin: "0 0 12px", maxWidth: 820, lineHeight: 1.6 }}>Annual Customer Value represents the business impact each application delivers. SDLC Value represents the cost to build and maintain using traditional development methods &mdash; the investment that AI-powered development compresses.</p>
      <div style={{ display: "flex", gap: 24, marginBottom: 48 }}>
        {[
          { label: "Total Annual Customer Value", value: formatTotal(totalCustomer), color: "#10B981" },
          { label: "Total SDLC Value", value: formatTotal(totalSdlc), color: "#3B82F6" },
          { label: "Combined", value: formatTotal(totalCustomer + totalSdlc), color: "#FFFFFF" },
          { label: "Applications", value: "6", color: "#FFFFFF" },
        ].map((stat, i) => (
          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: stat.color, fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</span>
            <span style={{ fontSize: 13, color: "#B8C8DA" }}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* VALUE TABLE */}
      <SectionHeader label="Portfolio Value Summary" />
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 140px 140px", padding: "14px 24px", borderBottom: "1px solid rgba(148,163,184,0.1)", background: "rgba(16,34,66,0.3)" }}>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#B8C8DA" }}>Application</span>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#B8C8DA" }}>Overview</span>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#10B981", textAlign: "right" }}>Annual Customer Value</span>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", color: "#3B82F6", textAlign: "right" }}>SDLC Value</span>
        </div>

        {/* Rows */}
        {valueProjects.map((proj, i) => (
          <div key={i} onClick={() => setActiveRow(activeRow === i ? null : i)} style={{ display: "grid", gridTemplateColumns: "180px 1fr 140px 140px", padding: "16px 24px", borderBottom: i < valueProjects.length - 1 ? "1px solid rgba(148,163,184,0.06)" : "none", alignItems: "center", cursor: "pointer", background: activeRow === i ? `${proj.color}08` : "transparent", transition: "background 0.2s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 4, height: 28, borderRadius: 2, background: proj.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: proj.color }}>{proj.name}</div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: proj.status === "Live" ? "#10B981" : proj.status === "Pilot" || proj.status === "In dev" || proj.status === "Building" ? "#F59E0B" : "#A8B8CC", marginTop: 2 }}>{proj.status}</span>
              </div>
            </div>
            <span style={{ fontSize: 14, color: "#D0DAE6", lineHeight: 1.5, paddingRight: 16 }}>{proj.desc}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 600, color: "#10B981", textAlign: "right" }}>{proj.customerValue}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 600, color: "#3B82F6", textAlign: "right" }}>{proj.sdlcValue}</span>
          </div>
        ))}

        {/* Totals row */}
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 140px 140px", padding: "16px 24px", borderTop: "2px solid rgba(148,163,184,0.15)", background: "rgba(16,34,66,0.3)" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF" }}>Total</span>
          <span style={{ fontSize: 14, color: "#B8C8DA" }}>6 applications</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 700, color: "#10B981", textAlign: "right" }}>{formatTotal(totalCustomer)}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 700, color: "#3B82F6", textAlign: "right" }}>{formatTotal(totalSdlc)}</span>
        </div>
      </Card>

      {/* VALUE BARS */}
      <div style={{ marginTop: 28 }}>
        <SectionHeader label="Value by Application" />
        <Card style={{ padding: "28px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {valueProjects.map((proj, i) => {
              const maxVal = Math.max(...valueProjects.map(p => Math.max(p.customerRaw, p.sdlcRaw)));
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: proj.color }}>{proj.name}</span>
                    <div style={{ display: "flex", gap: 16 }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#10B981" }}>{proj.customerValue}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#3B82F6" }}>{proj.sdlcValue}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ height: 8, borderRadius: 4, background: "rgba(148,163,184,0.06)", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(proj.customerRaw / maxVal) * 100}%`, borderRadius: 4, background: "#10B981", opacity: 0.7, transition: "width 0.5s ease" }} />
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: "rgba(148,163,184,0.06)", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(proj.sdlcRaw / maxVal) * 100}%`, borderRadius: 4, background: "#3B82F6", opacity: 0.7, transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 16, height: 8, borderRadius: 4, background: "#10B981", opacity: 0.7 }} /><span style={{ fontSize: 13, color: "#B8C8DA" }}>Annual Customer Value</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 16, height: 8, borderRadius: 4, background: "#3B82F6", opacity: 0.7 }} /><span style={{ fontSize: 13, color: "#B8C8DA" }}>SDLC Value</span></div>
          </div>
        </Card>
      </div>

      {/* COMBINED VALUE CALLOUT */}
      <div style={{ marginTop: 28, padding: "24px", background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 700, color: "#10B981", lineHeight: 1 }}>{formatTotal(totalCustomer)}</div>
            <div style={{ fontSize: 14, color: "#D0DAE6", marginTop: 8 }}>Annual Customer Value</div>
            <div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 4 }}>Revenue impact, cost avoidance, efficiency gains</div>
          </div>
          <div style={{ textAlign: "center", borderLeft: "1px solid rgba(148,163,184,0.1)", borderRight: "1px solid rgba(148,163,184,0.1)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 700, color: "#3B82F6", lineHeight: 1 }}>{formatTotal(totalSdlc)}</div>
            <div style={{ fontSize: 14, color: "#D0DAE6", marginTop: 8 }}>SDLC Value</div>
            <div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 4 }}>Traditional development cost compressed by AI tooling</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>{formatTotal(totalCustomer + totalSdlc)}</div>
            <div style={{ fontSize: 14, color: "#D0DAE6", marginTop: 8 }}>Combined Portfolio Value</div>
            <div style={{ fontSize: 13, color: "#B8C8DA", marginTop: 4 }}>Total measurable impact across 6 applications</div>
          </div>
        </div>
      </div>

      <div style={{ height: 64 }} />
    </div>
  );
}

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
            <p style={{ margin: "0 0 8px", fontFamily: MONO, fontSize: 13, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase", color: DP_COLOR }}>{"Provider Solutions Data Platform"}</p>
            <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "clamp(34px, 4vw, 44px)", letterSpacing: -0.8, fontWeight: 700, color: "#FFFFFF", margin: 0, lineHeight: 1.15 }}>Data Platform</h1>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", color: DP_COLOR, border: `1px solid ${DP_COLOR}77`, background: `${DP_COLOR}14`, borderRadius: 6, padding: "4px 10px" }}>Available</span>
              <BoltButton onClick={() => setPresenting(true)} aria-keyshortcuts="P" style={{ background: `${DP_COLOR}1F`, borderColor: DP_COLOR, color: DP_COLOR, padding: "6px 14px", minHeight: 38 }}>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24"><path d="M7 4v16l13-8L7 4Z" fill="currentColor" /></svg>
                <span>Present</span><span style={{ fontSize: 12, fontWeight: 500, color: "#B8C8DA", border: "1px solid rgba(184,200,218,0.35)", borderRadius: 4, padding: "0 5px" }}>P</span>
              </BoltButton>
            </div>
            <p style={{ fontSize: 22, color: "#FFFFFF", fontWeight: 600, margin: "14px 0 0", maxWidth: 640, lineHeight: 1.4 }}>{"Transforming enterprise data into business capabilities through intent."}</p>
            <p style={{ fontSize: 18, color: "#D0DAE6", margin: "10px 0 0", maxWidth: 640, lineHeight: 1.55 }}>{"A connected, governed foundation where applications, data products, analytics and AI are built once, reused everywhere, and inherit enterprise controls by default."}</p>
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
  ]},
  { label: "Roadmap", items: [
    { id: "roadmap", label: "MPTS Roadmap" },
    { id: "value", label: "Value" },
  ]},
  { label: "AI Literacy", items: [
    { id: "timeline", label: "AI Evolution" },
    { id: "framework", label: "Knowledge Levels" },
  ]},
];

export default function App() {
  const [activePage, setActivePage] = useState("bolt");
  const navigate: Navigate = (id) => { setActivePage(id); setOpenMenu(null); if (typeof window !== "undefined") window.scrollTo(0, 0); };
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#0B1A33", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } } * { box-sizing: border-box; }`}</style>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(7,16,33,0.95)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(148,163,184,0.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {navGroups.map((group) => {
              const isGroupActive = group.items.some(i => i.id === activePage);
              const isOpen = openMenu === group.label;
              return (
                <div key={group.label} style={{ position: "relative", paddingBottom: isOpen ? 4 : 0 }}
                  onMouseEnter={() => setOpenMenu(group.label)}
                  onMouseLeave={() => setOpenMenu(null)}>
                  <button style={{
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
                    <div style={{
                      position: "absolute", top: "100%", left: 0,
                      background: "rgba(7,16,33,0.98)", border: "1px solid rgba(148,163,184,0.12)",
                      borderRadius: 10, padding: "6px", minWidth: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                      animation: "fadeIn 0.15s ease",
                    }}>
                      {group.items.map((item) => {
                        const isActive = activePage === item.id;
                        return (
                          <button key={item.id} onClick={() => { setActivePage(item.id); setOpenMenu(null); }} style={{
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
          <span style={{ fontSize: 14, color: "#B8C8DA", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.3, whiteSpace: "nowrap" }}>{"Dan Lodder \u00B7 October 2026"}</span>
        </div>
      </nav>
      <div key={activePage} style={{ animation: "fadeIn 0.3s ease" }}>
        {activePage === "solutions" && <SolutionsOverviewPage onNavigate={navigate} />}
        {activePage === "titan" && <TitanPage onNavigate={navigate} />}
        {activePage === "novaxray" && <NovaXrayPage />}
        {activePage === "meridian" && <MeridianPage />}
        {activePage === "skynet" && <SkynetPage />}
        {activePage === "bolt" && <BoltPaaSPage onNavigate={navigate} />}
        {activePage === "dataplatform" && <DataPlatformPage onNavigate={navigate} />}
        {activePage === "roadmap" && <MptsRoadmapPage />}
        {activePage === "value" && <ValuePage />}
        {activePage === "timeline" && <TimelinePage />}
        {activePage === "framework" && <FrameworkPage />}
      </div>
    </div>
  );
}
