import { useState } from "react";
import type { CommonProps } from "./types";
import type { Priority } from "../types";

type SiteGeoKey = "italia"|"europa"|"nordamerica"|"sudamerica"|"asia"|"africa"|"australia";
type SiteRowKey = "uffici"|"ops"|"datacenter"|"altro";
type SiteTable = Record<SiteRowKey, Record<SiteGeoKey, number>>;

interface PrioItem { rank: number; name: string; detail: string; note?: string; }
interface CritItem { rank: number; label: string; priority: string; rel: number; crit: number; tier: "high"|"medium"|"low"; }

export interface ReportData {
  companyName: string;
  sectorLabel: string;
  marketLabel: string;
  revenue: number;
  dimUnit: string;
  employees: number;
  maturityTitle: string;
  maturityDesc: string;
  csrdLabel: string;
  csrdSub: string;
  csrdNote?: string;
  prioIntroText: string;
  prioItems: PrioItem[];
  critItems: CritItem[];
  isIt: boolean;
  geoDistrib: Record<string, number>;
  siteTable: SiteTable;
  workshopDate: string;
  consultantName: string;
  companyLogo?: string;
  participantRole?: string;
  participantCompany?: string;
}

interface Props extends CommonProps {
  data: ReportData;
}

const GEO_LABELS: Record<SiteGeoKey,{it:string,en:string}> = {
  italia:{it:"Italia",en:"Italy"}, europa:{it:"Europa",en:"Europe"},
  nordamerica:{it:"Nord America",en:"North America"}, sudamerica:{it:"Sud America",en:"South America"},
  asia:{it:"Asia",en:"Asia"}, africa:{it:"Africa",en:"Africa"}, australia:{it:"Australia",en:"Australia"},
};
const GEO_KEYS: SiteGeoKey[] = ["italia","europa","nordamerica","sudamerica","asia","africa","australia"];
const SITE_ROWS: SiteRowKey[] = ["uffici","ops","datacenter","altro"];

const PRIO_ICONS: Record<string, string> = {
  customers:"./obj-customers.png", compliance:"./obj-compliance.png",
  credit:"./obj-credit.png", efficiency:"./obj-efficiency.png",
  supply:"./obj-supply.png", reputation:"./obj-reputation.png",
};

// Slide wrapper — proporzioni 16:9 scalate via CSS transform
function Slide({ children, bg="#fff" }: { children: React.ReactNode; bg?: string }) {
  return (
    <div style={{
      width:"1280px", height:"720px", background:bg,
      position:"relative", overflow:"hidden",
      fontFamily:"'Segoe UI',system-ui,sans-serif",
      color:"#1a3a2a", flexShrink:0,
    }}>
      {children}
    </div>
  );
}

// ── Slide 1 — Cover ────────────────────────────────────────────────────────────
function Slide1({ d }: { d: ReportData }) {
  const isIt = d.isIt;
  const date = d.workshopDate ? new Date(d.workshopDate).toLocaleDateString(isIt?"it-IT":"en-GB",{year:"numeric",month:"long",day:"numeric"}) : "";
  return (
    <Slide>
      <img src="./report-slide-1.png" alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
      <div style={{position:"absolute",inset:0,background:"rgba(255,255,255,.18)"}}/>
      {/* Logo azienda */}
      {d.companyLogo && <img src={d.companyLogo} alt="logo" style={{position:"absolute",top:28,right:36,height:52,maxWidth:160,objectFit:"contain",background:"rgba(255,255,255,.85)",borderRadius:6,padding:"4px 8px"}}/>}
      {/* IBM Envizi label */}
      <div style={{position:"absolute",top:28,left:40,fontWeight:700,fontSize:18,color:"#0a3a2a",letterSpacing:".04em"}}>IBM Envizi</div>
      {/* Title */}
      <div style={{position:"absolute",top:160,left:40,right:300}}>
        <div style={{fontSize:52,fontWeight:400,color:"#0a3a2a",lineHeight:1.2,letterSpacing:"-.01em"}}>
          {isIt?`Il percorso ESG di ${d.companyName}`:`The ESG journey of ${d.companyName}`}
        </div>
      </div>
      {/* Subtitle block */}
      <div style={{position:"absolute",top:400,left:40,fontSize:18,color:"#1a4a3a",lineHeight:1.7}}>
        <div>{isIt?"Sintesi workshop Envizi Quest":"Envizi Quest workshop summary"}{date?` · ${date}`:""}</div>
        {d.consultantName&&<div>IBM Envizi Team · {d.consultantName}</div>}
        {d.participantRole&&d.participantCompany&&<div>{d.participantRole} · {d.participantCompany}</div>}
      </div>
      {/* Footer */}
      <div style={{position:"absolute",bottom:18,left:40,fontSize:12,color:"rgba(10,40,25,.5)",letterSpacing:".08em"}}>
        {isIt?"Incontro di lavoro":"Working session"} · {new Date().getFullYear()}
      </div>
    </Slide>
  );
}

// ── Slide 2 — Company profile ──────────────────────────────────────────────────
function Slide2({ d }: { d: ReportData }) {
  const isIt = d.isIt;
  const totalSedi = GEO_KEYS.reduce((s,g)=>s+SITE_ROWS.reduce((ss,r)=>ss+(d.siteTable[r][g]??0),0),0);
  const uffici = GEO_KEYS.reduce((s,g)=>s+(d.siteTable.uffici[g]??0),0);
  const ops = GEO_KEYS.reduce((s,g)=>s+(d.siteTable.ops[g]??0),0);
  const dc = GEO_KEYS.reduce((s,g)=>s+(d.siteTable.datacenter[g]??0),0);
  const altro = GEO_KEYS.reduce((s,g)=>s+(d.siteTable.altro[g]??0),0);
  const activeGeos = GEO_KEYS.filter(g=>SITE_ROWS.some(r=>(d.siteTable[r][g]??0)>0));
  const geoLine = activeGeos.map(g=>{
    const n=GEO_KEYS.filter(k=>k===g).reduce((s)=>s+SITE_ROWS.reduce((ss,r)=>ss+(d.siteTable[r][g]??0),0),0);
    const tot=SITE_ROWS.reduce((ss,r)=>ss+(d.siteTable[r][g]??0),0);
    return `${isIt?GEO_LABELS[g].it:GEO_LABELS[g].en} ${tot}`;
  }).join(" · ");
  return (
    <Slide bg="#fff">
      {d.companyLogo && <img src={d.companyLogo} alt="logo" style={{position:"absolute",top:24,right:32,height:48,maxWidth:140,objectFit:"contain"}}/>}
      <div style={{padding:"40px 48px 0"}}>
        <div style={{fontSize:32,fontWeight:600,color:"#1a7a4a",marginBottom:32,maxWidth:700,lineHeight:1.3}}>
          {isIt?`${d.companyName} ha avviato il percorso ESG`:`${d.companyName} has started its ESG journey`}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 60px"}}>
          {/* left col */}
          <div style={{fontSize:17,color:"#1a3a2a",lineHeight:1.9,display:"flex",flexDirection:"column",gap:4}}>
            <p style={{margin:0}}>{isIt?`${d.companyName} è un ${d.sectorLabel.toLowerCase()} presente a livello ${d.marketLabel}.`:`${d.companyName} is a ${d.sectorLabel.toLowerCase()} operating at ${d.marketLabel} level.`}</p>
            <p style={{margin:0}}>{isIt?`Nell'ultimo esercizio ha registrato ${d.revenue} ${d.dimUnit}.`:`In the last financial year it reported ${d.revenue} ${d.dimUnit}.`}</p>
            <p style={{margin:0}}>{isIt?`L'organizzazione occupa ${d.employees.toLocaleString()} dipendenti.`:`The organisation employs ${d.employees.toLocaleString()} employees.`}</p>
            <p style={{margin:0,color:d.csrdLabel.includes("non")||d.csrdLabel.includes("Not")?"#888":"#c05000"}}>{d.csrdLabel} — {d.csrdSub}</p>
            {d.csrdNote&&<p style={{margin:0,fontStyle:"italic",color:"#557"}}>{d.csrdNote}</p>}
            <div style={{marginTop:16,fontSize:17,lineHeight:1.9}}>
              <p style={{margin:0}}><strong>{isIt?"Sedi totali":"Total locations"}:</strong> {totalSedi||"—"}</p>
              {uffici>0&&<p style={{margin:0}}>{isIt?"di cui uffici":"of which offices"}: {uffici}</p>}
              {ops>0&&<p style={{margin:0}}>{isIt?"sedi operative":"operational sites"}: {ops}</p>}
              {dc>0&&<p style={{margin:0}}>Data center: {dc}</p>}
              {altro>0&&<p style={{margin:0}}>{isIt?"altri siti":"other sites"}: {altro}</p>}
              {geoLine&&<p style={{margin:"4px 0 0",fontSize:15,color:"#557"}}>{geoLine}</p>}
            </div>
          </div>
          {/* right col — geo map cards */}
          <div>
            <div style={{fontSize:14,fontWeight:600,color:"#1a7a4a",marginBottom:8,letterSpacing:".06em",textTransform:"uppercase"}}>{isIt?"Distribuzione geografica":"Geographic distribution"}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {activeGeos.map(g=>{
                const tot=SITE_ROWS.reduce((s,r)=>s+(d.siteTable[r][g]??0),0);
                return (
                  <div key={g} style={{border:"1.5px solid #c8e4d0",borderRadius:8,padding:"6px 10px",background:"#f4faf6",minWidth:80,textAlign:"center"}}>
                    <img src={`./mappe/${g}.png`} alt={g} style={{width:64,height:48,objectFit:"contain",display:"block",margin:"0 auto 4px"}}/>
                    <div style={{fontSize:12,fontWeight:700,color:"#1a7a4a",textTransform:"uppercase",letterSpacing:".05em"}}>{isIt?GEO_LABELS[g].it:GEO_LABELS[g].en}</div>
                    <div style={{fontSize:13,color:"#335"}}>{tot} {isIt?"sedi":"sites"}</div>
                  </div>
                );
              })}
            </div>
            {/* maturity */}
            <div style={{marginTop:24,padding:"14px 16px",background:"#eef8f2",borderLeft:"4px solid #1a7a4a",borderRadius:4}}>
              <div style={{fontWeight:700,color:"#1a7a4a",fontSize:15,marginBottom:4}}>{d.maturityTitle}</div>
              <div style={{fontSize:14,color:"#2a4a3a",lineHeight:1.6}}>{d.maturityDesc}</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{position:"absolute",bottom:14,left:0,right:0,textAlign:"center",fontSize:13,color:"#8aaa98",letterSpacing:".08em"}}>IBM Envizi Quest</div>
    </Slide>
  );
}

// ── Slide 3 — Priorities ───────────────────────────────────────────────────────
function Slide3({ d }: { d: ReportData }) {
  const isIt = d.isIt;
  const top2 = d.prioItems.slice(0,2);
  const titleText = isIt
    ? `La priorità principale di ${d.companyName} è ${top2[0]?.name||"—"}${top2[1]?` seguita da ${top2[1].name}`:""}, evidenziando il valore ESG per il business.`
    : `${d.companyName}'s main priority is ${top2[0]?.name||"—"}${top2[1]?`, followed by ${top2[1].name}`:""},  highlighting ESG value for the business.`;
  const PRIO_KEYS = ["customers","compliance","credit","efficiency","supply","reputation"];
  return (
    <Slide bg="#fff">
      {d.companyLogo && <img src={d.companyLogo} alt="logo" style={{position:"absolute",top:20,right:28,height:44,maxWidth:130,objectFit:"contain"}}/>}
      <div style={{padding:"28px 40px 0"}}>
        <div style={{fontSize:22,fontWeight:600,color:"#1a7a4a",marginBottom:20,maxWidth:880,lineHeight:1.35}}>{titleText}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
          {PRIO_KEYS.map(pk=>{
            const item = d.prioItems.find(p=>p.name.toLowerCase().includes(pk.slice(0,4)))||d.prioItems.find((_,i)=>PRIO_KEYS[i]===pk)||null;
            const rankItem = d.prioItems.find((_,i)=>PRIO_KEYS.indexOf(pk)===i)||null;
            const pi = d.prioItems[PRIO_KEYS.indexOf(pk)]||null;
            const hasNote = pi?.note;
            return (
              <div key={pk} style={{border:"1.5px solid #c8e4d0",borderRadius:10,padding:"10px 12px",background:"#f8fdf9",display:"flex",gap:10,alignItems:"flex-start",minHeight:100}}>
                <img src={PRIO_ICONS[pk]||""} alt={pk} style={{width:44,height:44,objectFit:"contain",flexShrink:0,borderRadius:8}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1a7a4a",marginBottom:4,letterSpacing:".02em"}}>
                    {pi?`${pi.rank}/6  ${pi.name}`:`—`}
                  </div>
                  {hasNote
                    ? <div style={{fontSize:12,color:"#2a4a3a",lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:4,WebkitBoxOrient:"vertical"}}>{pi!.note}</div>
                    : pi?.detail
                      ? <div style={{fontSize:11,color:"#8aaa98",lineHeight:1.4,fontStyle:"italic",overflow:"hidden",display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical"}}>{pi.detail}</div>
                      : <div style={{fontSize:11,color:"#bbb",fontStyle:"italic"}}>{isIt?"(nessuna nota)":"(no note)"}</div>
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{position:"absolute",bottom:14,left:0,right:0,textAlign:"center",fontSize:13,color:"#8aaa98",letterSpacing:".08em"}}>IBM Envizi Quest</div>
    </Slide>
  );
}

// ── Slide 4 — Priority matrix ─────────────────────────────────────────────────
function Slide4({ d }: { d: ReportData }) {
  const isIt = d.isIt;
  const top1 = d.critItems[0];
  const title = isIt
    ? `${d.companyName} mostra le principali esigenze a supporto degli obiettivi di business${top1?` nelle aree ${top1.label}`:""}`
    : `${d.companyName} shows key data needs supporting business objectives${top1?` in the ${top1.label} area`:""}`;
  const MATRIX_SIZE = 320;
  const AXIS_PAD = 36;
  const PLOT_W = MATRIX_SIZE - AXIS_PAD;
  const PLOT_H = MATRIX_SIZE - AXIS_PAD;
  const toX = (r: number) => AXIS_PAD + ((r-1)/9) * PLOT_W;
  const toY = (c: number) => PLOT_H - ((c-1)/9) * PLOT_H;
  const TIER_COLOR: Record<string,string> = { high:"#e05050", medium:"#4a90c8", low:"#aaa" };
  return (
    <Slide bg="#fff">
      {d.companyLogo && <img src={d.companyLogo} alt="logo" style={{position:"absolute",top:20,right:28,height:44,maxWidth:130,objectFit:"contain"}}/>}
      <div style={{padding:"28px 40px 0",display:"grid",gridTemplateColumns:"1fr 340px",gap:32,height:"calc(100% - 50px)"}}>
        {/* left */}
        <div>
          <div style={{fontSize:20,fontWeight:600,color:"#1a7a4a",marginBottom:16,lineHeight:1.4,maxWidth:680}}>{title}</div>
          <div style={{fontSize:14,color:"#2a4a3a",lineHeight:1.8}}>
            {d.critItems.slice(0,12).map((n,i)=>(
              <div key={n.label} style={{display:"flex",gap:8,alignItems:"baseline",marginBottom:2}}>
                <span style={{width:20,height:20,borderRadius:"50%",background:TIER_COLOR[n.tier]||"#aaa",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700,flexShrink:0}}>{i+1}</span>
                <span style={{color:TIER_COLOR[n.tier]||"#555"}}>{n.label}</span>
                <span style={{fontSize:12,color:"#888",marginLeft:"auto",whiteSpace:"nowrap"}}>R:{n.rel} C:{n.crit}</span>
              </div>
            ))}
          </div>
        </div>
        {/* right — matrix */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",paddingTop:8}}>
          <div style={{fontSize:12,fontWeight:700,color:"#1a7a4a",marginBottom:8,letterSpacing:".06em",textTransform:"uppercase"}}>{isIt?"Matrice Rilevanza / Criticità":"Relevance / Criticality Matrix"}</div>
          <svg width={MATRIX_SIZE} height={MATRIX_SIZE} viewBox={`0 0 ${MATRIX_SIZE} ${MATRIX_SIZE}`}>
            {/* quadrants */}
            <rect x={AXIS_PAD} y={0} width={PLOT_W/2} height={PLOT_H/2} fill="rgba(255,200,200,.2)"/>
            <rect x={AXIS_PAD+PLOT_W/2} y={0} width={PLOT_W/2} height={PLOT_H/2} fill="rgba(220,80,80,.18)"/>
            <rect x={AXIS_PAD} y={PLOT_H/2} width={PLOT_W/2} height={PLOT_H/2} fill="rgba(240,248,255,.5)"/>
            <rect x={AXIS_PAD+PLOT_W/2} y={PLOT_H/2} width={PLOT_W/2} height={PLOT_H/2} fill="rgba(220,80,80,.08)"/>
            {/* border */}
            <rect x={AXIS_PAD} y={0} width={PLOT_W} height={PLOT_H} fill="none" stroke="#1a7a4a" strokeWidth={1.5}/>
            <line x1={AXIS_PAD+PLOT_W/2} y1={0} x2={AXIS_PAD+PLOT_W/2} y2={PLOT_H} stroke="#1a7a4a" strokeWidth={1}/>
            <line x1={AXIS_PAD} y1={PLOT_H/2} x2={AXIS_PAD+PLOT_W} y2={PLOT_H/2} stroke="#1a7a4a" strokeWidth={1}/>
            {/* labels */}
            <text x={AXIS_PAD+PLOT_W*0.25} y={14} textAnchor="middle" fontSize={11} fill="#c06060">{isIt?"Migliorare":"Improve"}</text>
            <text x={AXIS_PAD+PLOT_W*0.75} y={14} textAnchor="middle" fontSize={11} fill="#c03030" fontWeight="700">{isIt?"Trasformare":"Transform"}</text>
            <text x={AXIS_PAD+PLOT_W*0.25} y={PLOT_H-4} textAnchor="middle" fontSize={11} fill="#888">{isIt?"Monitorare":"Monitor"}</text>
            <text x={AXIS_PAD+PLOT_W*0.75} y={PLOT_H-4} textAnchor="middle" fontSize={11} fill="#aaa">{isIt?"Mantenere":"Maintain"}</text>
            {/* axis labels */}
            <text x={AXIS_PAD/2} y={PLOT_H/2} textAnchor="middle" fontSize={10} fill="#555" transform={`rotate(-90,${AXIS_PAD/2},${PLOT_H/2})`}>C</text>
            <text x={AXIS_PAD+PLOT_W/2} y={PLOT_H+14} textAnchor="middle" fontSize={10} fill="#555">R</text>
            {/* axis ticks */}
            {[1,5,10].map(v=>(
              <g key={v}>
                <text x={toX(v)+AXIS_PAD*0} y={PLOT_H+12} textAnchor="middle" fontSize={9} fill="#888">{v}</text>
                <text x={AXIS_PAD-4} y={toY(v)+4} textAnchor="end" fontSize={9} fill="#888">{v}</text>
              </g>
            ))}
            {/* dots */}
            {d.critItems.slice(0,15).map((n,i)=>{
              const cx = toX(n.rel);
              const cy = toY(n.crit);
              return (
                <g key={n.label}>
                  <circle cx={cx} cy={cy} r={10} fill={TIER_COLOR[n.tier]||"#aaa"} opacity={.85}/>
                  <text x={cx} y={cy+4} textAnchor="middle" fontSize={9} fill="#fff" fontWeight="700">{i+1}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      <div style={{position:"absolute",bottom:14,left:0,right:0,textAlign:"center",fontSize:13,color:"#8aaa98",letterSpacing:".08em"}}>IBM Envizi Quest</div>
    </Slide>
  );
}

// ── Main slideshow component ──────────────────────────────────────────────────
export function ReportSlideshow({ language, setLanguage, setScreen, reset, data }: Props) {
  const [idx, setIdx] = useState(0);
  const slides = [
    <Slide1 key={0} d={data}/>,
    <Slide2 key={1} d={data}/>,
    <Slide3 key={2} d={data}/>,
    <Slide4 key={3} d={data}/>,
  ];
  // unused bust var removed — slides are React components, not PNGs
  const total = slides.length;
  const isIt = language === "it";

  return (
    <main style={{background:"#000",display:"grid",gridTemplateRows:"auto 1fr auto",height:"100dvh",overflow:"hidden"}}>
      <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px",background:"rgba(0,0,0,.85)",zIndex:10}}>
        <button className="brand brandButton" onClick={reset} style={{color:"#fff"}}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <span style={{color:"#c9e8dc",fontSize:"13px",fontWeight:700}}>{idx+1} / {total}</span>
        <button onClick={()=>setScreen("ilTuoReport")} style={{background:"transparent",border:"1px solid #39efb4",color:"#39efb4",borderRadius:"4px",padding:"4px 10px",cursor:"pointer",fontSize:"13px",fontWeight:700}}>✕ {isIt?"Chiudi":"Close"}</button>
      </header>

      {/* slide area — scala la slide 1280×720 nel viewport */}
      <section style={{display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:"#111",minHeight:0}}>
        <div style={{
          transformOrigin:"center center",
          transform:`scale(${Math.min(
            (typeof window !== "undefined" ? window.innerWidth : 1280) / 1280,
            (typeof window !== "undefined" ? (window.innerHeight - 120) : 720) / 720
          )})`,
          display:"flex",
        }}>
          {slides[idx]}
        </div>
      </section>

      <footer style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"24px",padding:"12px 20px",background:"rgba(0,0,0,.85)"}}>
        <button onClick={()=>setIdx(i=>Math.max(0,i-1))} disabled={idx===0} style={{background:"transparent",border:"none",cursor:idx===0?"not-allowed":"pointer",opacity:idx===0?0.2:1}}>
          <svg width="36" height="54" viewBox="0 0 36 54"><polygon points="34,2 2,27 34,52" fill="white"/></svg>
        </button>
        <div style={{display:"flex",gap:"6px"}}>
          {slides.map((_,i)=><span key={i} onClick={()=>setIdx(i)} style={{width:"8px",height:"8px",borderRadius:"50%",background:i===idx?"#39efb4":"#3a6a58",border:i===idx?"none":"1px solid #39efb4",cursor:"pointer",display:"inline-block"}}/>)}
        </div>
        <button onClick={()=>idx===total-1?setScreen("ilTuoReport"):setIdx(i=>i+1)} style={{background:"transparent",border:"none",cursor:"pointer"}}>
          <svg width="36" height="54" viewBox="0 0 36 54"><polygon points="2,2 34,27 2,52" fill="white"/></svg>
        </button>
      </footer>
    </main>
  );
}
