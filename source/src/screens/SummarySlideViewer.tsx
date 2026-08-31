import React, { useState } from "react";
import type { Priority } from "../types";
import { generateSummaryPptx, type SummaryPptxData } from "../generateSummaryPptx";

interface Props {
  data: SummaryPptxData;
  language: "it" | "en";
  onClose?: () => void;
}

export function SummarySlideViewer({ data, language, onClose }: Props) {
  const [idx, setIdx] = useState(0);
  const isIt = language === "it";
  const total = 3;

  const slides = [
    <Slide1 data={data} isIt={isIt} />,
    <Slide2 data={data} isIt={isIt} />,
    <Slide3 data={data} isIt={isIt} />,
  ];

  return (
    <main style={{ background: "#000", display: "grid", gridTemplateRows: "auto 1fr auto", height: "100%", overflow: "hidden" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", background: "rgba(0,0,0,.85)", zIndex: 10, flexShrink: 0 }}>
        <span style={{ color: "#39efb4", fontSize: "13px", fontWeight: 700, fontFamily: "monospace" }}>
          e· Envizi Impact Quest
        </span>
        <span style={{ color: "#c9e8dc", fontSize: "13px", fontWeight: 700 }}>{idx + 1} / {total}</span>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            style={{ background: "rgba(57,239,180,.12)", border: "1px solid rgba(57,239,180,.5)", color: "#39efb4", borderRadius: "6px", padding: "6px 16px", fontWeight: 700, cursor: "pointer", fontSize: "13px" }}
            onClick={() => generateSummaryPptx(data)}
          >
            ↓ {isIt ? "Scarica PowerPoint" : "Download PowerPoint"}
          </button>
          {onClose && (
            <button style={{ background: "transparent", border: "1px solid #39efb4", color: "#39efb4", borderRadius: "4px", padding: "4px 10px", cursor: "pointer", fontSize: "13px" }} onClick={onClose}>
              ✕ {isIt ? "Chiudi" : "Close"}
            </button>
          )}
        </div>
      </header>

      <section style={{ display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#07110e", padding: "16px" }}>
        <div style={{ width: "100%", maxWidth: "1650px", aspectRatio: "16/9", background: "#07110e", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 40px rgba(0,0,0,.7)", position: "relative" }}>
          {slides[idx]}
        </div>
      </section>

      <footer style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", padding: "12px 20px", background: "rgba(0,0,0,.85)", flexShrink: 0 }}>
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
          style={{ background: "transparent", border: "none", cursor: idx === 0 ? "not-allowed" : "pointer", opacity: idx === 0 ? 0.2 : 1 }}>
          <svg width="36" height="54" viewBox="0 0 36 54"><polygon points="34,2 2,27 34,52" fill="white" /></svg>
        </button>
        <div style={{ display: "flex", gap: "6px" }}>
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} onClick={() => setIdx(i)} style={{ width: "8px", height: "8px", borderRadius: "50%", background: i === idx ? "#39efb4" : "#3a6a58", border: i === idx ? "none" : "1px solid #39efb4", cursor: "pointer", display: "inline-block" }} />
          ))}
        </div>
        <button onClick={() => setIdx(i => Math.min(total - 1, i + 1))} disabled={idx === total - 1}
          style={{ background: "transparent", border: "none", cursor: idx === total - 1 ? "not-allowed" : "pointer", opacity: idx === total - 1 ? 0.2 : 1 }}>
          <svg width="36" height="54" viewBox="0 0 36 54"><polygon points="2,2 34,27 2,52" fill="white" /></svg>
        </button>
      </footer>
    </main>
  );
}

// ── slide shell ───────────────────────────────────────────────────────────────
function SlideShell({ label, companyName, children }: { label: string; companyName: string; children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "#07110e", display: "flex", flexDirection: "column", fontFamily: "Arial, sans-serif", position: "absolute", inset: 0 }}>
      {/* header bar */}
      <div style={{ background: "#061009", padding: "6px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ color: "#39efb4", fontFamily: "monospace", fontSize: "clamp(18px,2vw,24px)", fontWeight: 700 }}>e· Envizi Impact Quest</span>
        <span style={{ color: "#39efb4", fontFamily: "monospace", fontSize: "clamp(16px,1.8vw,22px)", fontWeight: 700, letterSpacing: "0.1em" }}>{label}</span>
        <span style={{ color: "#f2fff9", fontFamily: "monospace", fontSize: "clamp(16px,1.8vw,22px)", fontWeight: 700 }}>{companyName.toUpperCase()}</span>
      </div>
      {/* content */}
      <div style={{ flex: 1, padding: "clamp(16px,3vw,40px) clamp(24px,4vw,56px)", overflow: "hidden", display: "flex", flexDirection: "column", gap: "clamp(8px,1.6vw,20px)" }}>
        {children}
      </div>
    </div>
  );
}

// ── SLIDE 1 ───────────────────────────────────────────────────────────────────
function Slide1({ data, isIt }: { data: SummaryPptxData; isIt: boolean }) {
  const tags = [
    data.sectorLabel, data.marketLabel,
    `${data.revenue} ${data.dimUnit}`,
    `${data.employees.toLocaleString()} ${isIt ? "dipendenti" : "employees"}`,
    ...(data.plants > 0 ? [`${data.plants} ${isIt ? "stabilimenti" : "plants"}`] : []),
    ...(data.offices > 0 ? [`${data.offices} ${isIt ? "uffici" : "offices"}`] : []),
  ];
  return (
    <SlideShell label={isIt ? "01 · PROFILO AZIENDA" : "01 · COMPANY PROFILE"} companyName={data.companyName}>
      {/* company name */}
      <div style={{ fontSize: "clamp(40px,8vw,104px)", fontWeight: 800, color: "#f2fff9", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "clamp(4px,0.6vw,8px)" }}>
        {data.companyName}
      </div>
      {/* tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {tags.map((tag, i) => (
          <span key={i} style={{ fontFamily: "monospace", fontSize: "clamp(14px,1.7vw,22px)", fontWeight: 700, color: "#39efb4", background: "#0d2218", border: "1px solid #2a5040", borderRadius: "100px", padding: "3px 10px" }}>{tag}</span>
        ))}
      </div>
      {/* maturity */}
      <div style={{ background: "#0a1c14", border: "1px solid #2a5040", borderRadius: "8px", padding: "clamp(12px,2vw,28px)", flex: "0 0 auto" }}>
        <div style={{ fontFamily: "monospace", fontSize: "clamp(14px,1.6vw,20px)", color: "#39efb4", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>{isIt ? "Maturità ESG" : "ESG Maturity"}</div>
        <div style={{ fontSize: "clamp(20px,2.8vw,36px)", fontWeight: 700, color: "#f2fff9", marginBottom: "4px" }}>{data.maturityTitle}</div>
        <div style={{ fontSize: "clamp(16px,2vw,26px)", color: "#d0f0e4", lineHeight: 1.5 }}>{data.maturityDesc}</div>
      </div>
      {/* csrd */}
      <div style={{ background: "#091510", border: `1px solid ${data.csrdLabel.startsWith("Soggett") || data.csrdLabel.startsWith("Subject") ? "#39efb4" : "#6a9e88"}`, borderRadius: "8px", padding: "clamp(10px,1.6vw,20px) clamp(16px,2.4vw,32px)" }}>
        <div style={{ fontSize: "clamp(18px,2.2vw,28px)", fontWeight: 700, color: "#f2fff9" }}>{data.csrdLabel}</div>
        <div style={{ fontSize: "clamp(14px,1.8vw,22px)", color: "#d0f0e4", marginTop: "2px" }}>{data.csrdSub}</div>
      </div>
      {data.csrdNote && (
        <div style={{ fontSize: "clamp(14px,1.7vw,22px)", color: "#d0f0e4", fontStyle: "italic" }}>✎ {data.csrdNote}</div>
      )}
    </SlideShell>
  );
}

// ── SLIDE 2 ───────────────────────────────────────────────────────────────────
function Slide2({ data, isIt }: { data: SummaryPptxData; isIt: boolean }) {
  const plain = data.prioIntroText.replace(/<[^>]+>/g, "");
  return (
    <SlideShell label={isIt ? "02 · OBIETTIVI PRIORITARI" : "02 · PRIORITY OBJECTIVES"} companyName={data.companyName}>
      <div style={{ fontSize: "clamp(14px,1.8vw,22px)", color: "#e0f5ec", lineHeight: 1.5, flexShrink: 0 }}>{plain}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(6px,1vw,12px)", flex: 1, overflow: "hidden" }}>
        {data.prioItems.map(item => (
          <div key={item.rank} style={{ background: "#0c1e18", border: "1px solid #1e3a2e", borderRadius: "6px", padding: "clamp(8px,1.4vw,18px) clamp(16px,2.4vw,28px)", display: "flex", alignItems: "center", gap: "clamp(12px,1.8vw,28px)", flex: "1 1 0", minHeight: 0 }}>
            <span style={{ fontFamily: "monospace", fontSize: "clamp(22px,3.2vw,44px)", fontWeight: 700, color: "#f2fff9", flexShrink: 0 }}>{String(item.rank).padStart(2, "0")}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "clamp(18px,2.2vw,28px)", fontWeight: 700, color: "#f2fff9" }}>{item.name}</div>
              <div style={{ fontSize: "clamp(14px,1.7vw,20px)", color: "#a8d5c0", marginTop: "2px" }}>{item.detail}</div>
              {item.note && <div style={{ fontSize: "clamp(12px,1.5vw,18px)", color: "#7aaa8e", fontStyle: "italic", marginTop: "2px" }}>✎ {item.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}

// ── SLIDE 3 ───────────────────────────────────────────────────────────────────
function Slide3({ data, isIt }: { data: SummaryPptxData; isIt: boolean }) {
  return (
    <SlideShell label={isIt ? "03 · AREE CRITICHE PRINCIPALI" : "03 · TOP CRITICAL AREAS"} companyName={data.companyName}>
      <div style={{ fontSize: "clamp(16px,2vw,26px)", color: "#f2fff9", flexShrink: 0, marginBottom: "clamp(4px,0.6vw,8px)" }}>
        {isIt ? "Ordinate per Rilevanza + Criticità" : "Sorted by Relevance + Criticality"}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(6px,0.8vw,10px)", flex: 1, overflow: "hidden" }}>
        {data.critItems.map(item => (
          <div key={item.rank} style={{ background: "#0c1e18", border: "1px solid #1e3a2e", borderRadius: "6px", padding: "clamp(6px,1vw,14px) clamp(16px,2.4vw,28px)", display: "flex", alignItems: "center", gap: "clamp(12px,1.6vw,24px)", flex: "1 1 0", minHeight: 0 }}>
            <span style={{ fontFamily: "monospace", fontSize: "clamp(20px,2.8vw,40px)", fontWeight: 700, color: "#f2fff9", flexShrink: 0, width: "2ch" }}>{String(item.rank).padStart(2, "0")}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "clamp(16px,2vw,26px)", fontWeight: 700, color: "#f2fff9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.label}</div>
              <div style={{ fontSize: "clamp(12px,1.5vw,18px)", color: "#6a9e88", fontFamily: "monospace", marginTop: "1px" }}>{item.priority}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px", width: "38%", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ flex: 1, height: "clamp(8px,1.2vw,16px)", background: "#0d2018", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: `${item.rel * 10}%`, height: "100%", background: "#39efb4", borderRadius: "2px" }} />
                </div>
                <span style={{ fontFamily: "monospace", fontSize: "clamp(12px,1.5vw,18px)", color: "#39efb4", fontWeight: 700, width: "3ch", textAlign: "right" }}>{item.rel}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ flex: 1, height: "clamp(8px,1.2vw,16px)", background: "#0d2018", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ width: `${item.crit * 10}%`, height: "100%", background: "#f5c542", borderRadius: "2px" }} />
                </div>
                <span style={{ fontFamily: "monospace", fontSize: "clamp(12px,1.5vw,18px)", color: "#f5c542", fontWeight: 700, width: "3ch", textAlign: "right" }}>{item.crit}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "monospace", fontSize: "clamp(10px,1.3vw,16px)", color: "#39efb4" }}>● {isIt ? "RIL." : "REL."}</span>
                <span style={{ fontFamily: "monospace", fontSize: "clamp(10px,1.3vw,16px)", color: "#f5c542" }}>● {isIt ? "CRIT." : "CRIT."}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
