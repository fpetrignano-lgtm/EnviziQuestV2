import type { Screen } from "../types";
import type { CommonProps } from "./types";

// Sezioni principali — una per ogni area del Quest
const SECTIONS: { num: string; labelIt: string; labelEn: string; subIt: string; subEn: string; screen: Screen; accent?: boolean }[] = [
  { num: "①", labelIt: "Introduzione",                    labelEn: "Introduction",             subIt: "Come funziona il Quest",                        subEn: "How the Quest works",                         screen: "sectionIntro1" },
  { num: "②", labelIt: "Obiettivi della tua azienda",     labelEn: "Your company's objectives", subIt: "Profilo azienda e priorità ESG",                subEn: "Company profile and ESG priorities",          screen: "sectionIntro2" },
  { num: "③", labelIt: "Sfide di dati",                   labelEn: "Data challenges",           subIt: "Esigenze, criticità e matrice di priorità",     subEn: "Needs, criticalities and priority matrix",    screen: "sectionIntro3" },
  { num: "M1", labelIt: "Sfida 1 · Fabbrica dati ESG",    labelEn: "Challenge 1 · ESG data",    subIt: "Baseline ESG e qualità dei dati",               subEn: "ESG baseline and data quality",               screen: "challengeSeparator1" },
  { num: "M2", labelIt: "Sfida 2 · Energia",              labelEn: "Challenge 2 · Energy",      subIt: "Consumi, anomalie e costi operativi",           subEn: "Consumption, anomalies and operating cost",   screen: "challengeSeparator2" },
  { num: "M3", labelIt: "Sfida 3 · Supply Chain",         labelEn: "Challenge 3 · Supply Chain",subIt: "Fornitori, acquisti e catena del valore",       subEn: "Suppliers, procurement and value chain",      screen: "challengeSeparator3" },
  { num: "M4", labelIt: "Sfida 4 · Reporting",            labelEn: "Challenge 4 · Reporting",   subIt: "GHG reporting, workflow e dashboard",           subEn: "GHG reporting, workflows and dashboards",     screen: "challengeSeparator4" },
  { num: "M5", labelIt: "Sfida 5 · Net Zero",             labelEn: "Challenge 5 · Net Zero",    subIt: "Scenari, investimenti e decarbonizzazione",     subEn: "Scenarios, investment and decarbonisation",   screen: "challengeSeparator5" },
  { num: "M6", labelIt: "Sfida 6 · Framework ESG",        labelEn: "Challenge 6 · ESG Frameworks",subIt: "CSRD, ESRS, GRI, SASB, CDP",                subEn: "CSRD, ESRS, GRI, SASB, CDP",                  screen: "challengeSeparator6" },
  { num: "✓",  labelIt: "Prossimi passi",                 labelEn: "Next steps",                subIt: "Demo, PoC e Business Value Assessment",         subEn: "Demo, PoC and Business Value Assessment",     screen: "sectionOutro", accent: true },
];

interface Props extends CommonProps {
  name: string;
}

export function ChapterMap({ language, profile, setLanguage, setScreen, reset, renderTrustBar, name }: Props) {
  const isIt = language === "it";
  return (
    <main style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "var(--bg)", overflow: "hidden" }}>
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {isIt ? "LA TUA ESPERIENZA" : "YOUR EXPERIENCE"}</div>
        {renderTrustBar()}
        <button className="langMini" onClick={() => setLanguage(language === "it" ? "en" : "it")}>{language === "it" ? "EN" : "IT"}</button>
      </header>

      <section style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "stretch", padding: "20px 28px 16px", gap: "32px", overflow: "hidden", boxSizing: "border-box" }}>

        {/* colonna sinistra: profilo */}
        <div style={{ flexShrink: 0, width: "220px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
          <img src={`./characters/${profile}-neutral.png`} alt={name} style={{ width: "200px", height: "200px", objectFit: "contain", borderRadius: "50%", display: "block" }}/>
          <span style={{ fontWeight: 700, fontSize: "18px", textAlign: "center", lineHeight: 1.3 }}>{name}<br/><small style={{ fontWeight: 400, fontSize: "14px", color: "var(--muted)" }}>ESG Manager</small></span>
        </div>

        {/* colonna destra: titolo + griglia sezioni */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px", minWidth: 0, overflow: "hidden" }}>
          <div>
            <small style={{ letterSpacing: ".14em", fontSize: "24px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
              {isIt ? "ENVIZI QUEST · INDICE" : "ENVIZI QUEST · INDEX"}
            </small>
            <h1 style={{ fontSize: "clamp(56px,6vw,104px)", fontWeight: 800, margin: "4px 0 2px", lineHeight: 1.1 }}>
              {isIt ? "La tua esperienza Envizi Quest" : "Your Envizi Quest experience"}
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "30px", lineHeight: 1.5, margin: 0 }}>
              {isIt ? "Salta direttamente alla sezione che ti interessa." : "Jump directly to the section you want."}
            </p>
          </div>

          {/* griglia sezioni */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", flex: 1, alignContent: "start", overflowY: "auto" }}>
            {SECTIONS.map((s) => (
              <button
                key={s.screen}
                onClick={() => setScreen(s.screen)}
                style={{ display: "flex", alignItems: "center", gap: "12px", background: s.accent ? "rgba(57,239,180,.08)" : "var(--surface,#1a1a2e)", border: `1px solid ${s.accent ? "#39efb4" : "rgba(255,255,255,.1)"}`, borderRadius: "10px", padding: "10px 14px", cursor: "pointer", textAlign: "left", transition: "border-color .15s", color: "inherit" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#39efb4")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = s.accent ? "#39efb4" : "rgba(255,255,255,.1)")}
              >
                <span style={{ minWidth: "52px", height: "52px", borderRadius: "50%", border: "2px solid #39efb4", background: s.accent ? "#39efb4" : "transparent", color: s.accent ? "#000" : "#39efb4", fontWeight: 800, fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: ".02em", flexShrink: 0 }}>
                  {s.num}
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", minWidth: 0 }}>
                  <span style={{ fontWeight: 700, fontSize: "30px", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{isIt ? s.labelIt : s.labelEn}</span>
                  <span style={{ fontSize: "24px", color: "var(--muted)", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{isIt ? s.subIt : s.subEn}</span>
                </div>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", paddingBottom: "4px", flexShrink: 0 }}>
            <button className="introBackBtn" onClick={() => setScreen("blank1")}>← {isIt ? "Indietro" : "Back"}</button>
            <button className="actionButton approachIntroCta" onClick={() => setScreen("sectionIntro1")}>{isIt ? "Inizia dall'inizio" : "Start from the beginning"} <b>→</b></button>
          </div>
        </div>
      </section>
    </main>
  );
}
