import type { Market, SectorKey, EsgReadiness } from "../types";
import type { CommonProps } from "./types";
import { SECTORS, SECTOR_KEYS, ESG_READINESS_IT, ESG_READINESS_EN } from "../constants";


type SiteGeoKey="italia"|"europa"|"nordamerica"|"sudamerica"|"asia"|"africa"|"australia";
type SiteRowKey="uffici"|"ops"|"datacenter"|"altro";
type SiteTable=Record<SiteRowKey,Record<SiteGeoKey,number>>;

// ── CsSiteMap ──────────────────────────────────────────────────────────────
// Planisfero SVG semplificato con icone sedi per area geografica
const GEO_ANCHORS: Record<SiteGeoKey,{cx:number,cy:number}> = {
  italia:     {cx:52,  cy:38},
  europa:     {cx:49,  cy:33},
  nordamerica:{cx:19,  cy:36},
  sudamerica: {cx:28,  cy:63},
  asia:       {cx:72,  cy:37},
  africa:     {cx:50,  cy:58},
  australia:  {cx:80,  cy:67},
};

function IconUffici({x,y,size=14}:{x:number,y:number,size?:number}){
  const h=size,w=size*0.7;
  return <g transform={`translate(${x-w/2},${y-h})`}>
    <rect x={0} y={h*0.25} width={w} height={h*0.75} fill="#c8e6f5" stroke="#4a90b8" strokeWidth={0.8} rx={1}/>
    <rect x={w*0.1} y={0} width={w*0.8} height={h*0.3} fill="#a0cfe8" stroke="#4a90b8" strokeWidth={0.7} rx={1}/>
    <rect x={w*0.3} y={h*0.5} width={w*0.4} height={h*0.5} fill="#7ab8d8" rx={0.5}/>
    <rect x={w*0.05} y={h*0.35} width={w*0.22} height={h*0.22} fill="#7ab8d8" rx={0.5}/>
    <rect x={w*0.73} y={h*0.35} width={w*0.22} height={h*0.22} fill="#7ab8d8" rx={0.5}/>
  </g>;
}
function IconOps({x,y,size=14}:{x:number,y:number,size?:number}){
  const h=size,w=size*0.9;
  return <g transform={`translate(${x-w/2},${y-h})`}>
    <rect x={0} y={h*0.35} width={w} height={h*0.65} fill="#c8f0dd" stroke="#3a9e6a" strokeWidth={0.8} rx={1}/>
    <polygon points={`0,${h*0.35} ${w/2},0 ${w},${h*0.35}`} fill="#a0dfc0" stroke="#3a9e6a" strokeWidth={0.7}/>
    <rect x={w*0.15} y={h*0.55} width={w*0.22} height={h*0.45} fill="#3a9e6a" rx={0.5}/>
    <rect x={w*0.63} y={h*0.55} width={w*0.22} height={h*0.45} fill="#3a9e6a" rx={0.5}/>
    <rect x={w*0.35} y={h*0.15} width={w*0.3} height={h*0.2} fill="#3a9e6a" rx={1}/>
  </g>;
}
function IconDatacenter({x,y,size=14}:{x:number,y:number,size?:number}){
  const h=size,w=size*0.75;
  return <g transform={`translate(${x-w/2},${y-h})`}>
    <rect x={0} y={0} width={w} height={h} fill="#e8d8f8" stroke="#7b50c8" strokeWidth={0.8} rx={1.5}/>
    {[0.15,0.38,0.61].map((fy,i)=><g key={i}>
      <rect x={w*0.08} y={h*fy} width={w*0.84} height={h*0.18} fill="#c8a8f0" rx={0.5}/>
      <circle cx={w*0.8} cy={h*(fy+0.09)} r={2} fill="#7b50c8"/>
    </g>)}
  </g>;
}
function IconAltro({x,y,size=13}:{x:number,y:number,size?:number}){
  return <g>
    <circle cx={x} cy={y-size*0.5} r={size*0.45} fill="#f5e8c8" stroke="#c8922a" strokeWidth={0.8}/>
    <line x1={x} y1={y-size*0.05} x2={x} y2={y} stroke="#c8922a" strokeWidth={1.2}/>
  </g>;
}

const ICON_MAP:{[K in SiteRowKey]:(props:{x:number,y:number})=>JSX.Element}={
  uffici:(p)=><IconUffici {...p}/>,
  ops:(p)=><IconOps {...p}/>,
  datacenter:(p)=><IconDatacenter {...p}/>,
  altro:(p)=><IconAltro {...p}/>,
};

function CsSiteMap({siteTable,siteRowDefs,isIt}:{
  siteTable:SiteTable,
  siteRowDefs:{key:SiteRowKey,label:{it:string,en:string}}[],
  isIt:boolean,
}){
  // Per ogni area geo, raccoglie i tipi di sede presenti (count>0)
  const activeByGeo:(SiteGeoKey)[]=(Object.keys(GEO_ANCHORS) as SiteGeoKey[]).filter(g=>
    (["uffici","ops","datacenter","altro"] as SiteRowKey[]).some(r=>(siteTable[r][g]??0)>0)
  );
  const rowsWithData=(["uffici","ops","datacenter","altro"] as SiteRowKey[]).filter(r=>
    (Object.keys(GEO_ANCHORS) as SiteGeoKey[]).some(g=>(siteTable[r][g]??0)>0)
  );
  // Offset orizzontale per impilare icone diverse sulla stessa area
  const iconOffset=10;
  return (
    <div className="csSiteMapWrap">
      <svg viewBox="0 0 110 80" className="csSiteMapSvg" xmlns="http://www.w3.org/2000/svg">
        {/* Oceani */}
        <rect x={0} y={0} width={110} height={80} fill="#d4eaf7" rx={3}/>
        {/* Continenti — path semplificati */}
        {/* Europa */}
        <path d="M44,22 L52,20 L56,24 L54,30 L50,32 L46,30 L43,26 Z" fill="#dde8c8" stroke="#a8c080" strokeWidth={0.4}/>
        {/* Africa */}
        <path d="M44,34 L52,32 L56,36 L55,50 L50,58 L44,56 L40,48 L41,38 Z" fill="#e8ddc8" stroke="#c0a870" strokeWidth={0.4}/>
        {/* Asia */}
        <path d="M56,18 L80,16 L88,22 L86,38 L78,44 L64,42 L56,36 L54,28 Z" fill="#d8e8c0" stroke="#90b870" strokeWidth={0.4}/>
        {/* Australia */}
        <path d="M74,58 L86,56 L88,62 L84,68 L76,70 L72,65 Z" fill="#e8d8c0" stroke="#b8a070" strokeWidth={0.4}/>
        {/* Nord America */}
        <path d="M6,16 L26,14 L30,22 L28,36 L22,42 L12,40 L6,32 Z" fill="#c8d8e8" stroke="#80a0c0" strokeWidth={0.4}/>
        {/* Sud America */}
        <path d="M20,44 L32,42 L36,50 L34,64 L28,70 L20,68 L16,58 Z" fill="#d0e0c8" stroke="#90b080" strokeWidth={0.4}/>
        {/* Groenlandia/isole */}
        <ellipse cx={38} cy={14} rx={5} ry={3} fill="#e4eef8" stroke="#b0c8d8" strokeWidth={0.3}/>
        {/* Linea equatore */}
        <line x1={0} y1={44} x2={110} y2={44} stroke="#b8d0c0" strokeWidth={0.25} strokeDasharray="2,2"/>
        {/* Griglia leggera */}
        {[20,40,60,80,100].map(x=><line key={x} x1={x} y1={0} x2={x} y2={80} stroke="#c0d8e8" strokeWidth={0.2} strokeDasharray="1,3"/>)}
        {[20,40,60].map(y=><line key={y} x1={0} y1={y} x2={110} y2={y} stroke="#c0d8e8" strokeWidth={0.2} strokeDasharray="1,3"/>)}
        {/* Icone sedi per geo-area */}
        {(Object.keys(GEO_ANCHORS) as SiteGeoKey[]).map(g=>{
          const rows=(["uffici","ops","datacenter","altro"] as SiteRowKey[]).filter(r=>(siteTable[r][g]??0)>0);
          if(rows.length===0)return null;
          const {cx,cy}=GEO_ANCHORS[g];
          const total=rows.length;
          return rows.map((r,i)=>{
            const ox=(i-(total-1)/2)*iconOffset;
            const Icon=ICON_MAP[r];
            const count=siteTable[r][g]??0;
            return <g key={`${g}-${r}`}>
              <Icon x={cx+ox} y={cy}/>
              <text x={cx+ox} y={cy+3} textAnchor="middle" fontSize={4} fill="#1a3a2a" fontWeight="700">{count}</text>
            </g>;
          });
        })}
        {/* Legenda */}
        {rowsWithData.length>0&&<g>
          {rowsWithData.map((r,i)=>{
            const label=isIt?siteRowDefs.find(d=>d.key===r)!.label.it:siteRowDefs.find(d=>d.key===r)!.label.en;
            const Icon=ICON_MAP[r];
            return <g key={r} transform={`translate(2,${66+i*5})`}>
              <Icon x={4} y={4}/>
              <text x={10} y={3.5} fontSize={3.5} fill="#2a4a3a">{label}</text>
            </g>;
          })}
        </g>}
      </svg>
      {activeByGeo.length===0&&<p className="csSiteMapEmpty">{isIt?"Inserisci sedi nella tabella per visualizzare la mappa":"Enter locations in the table to display the map"}</p>}
    </div>
  );
}

interface CompanySetupProps extends CommonProps {
  companyName: string;
  setCompanyName: (v: string) => void;
  questName: string;
  companySector: SectorKey;
  setCompanySector: (v: SectorKey) => void;
  companyMarket: Market;
  setCompanyMarket: (v: Market) => void;
  esgReadiness: EsgReadiness;
  setEsgReadiness: (v: EsgReadiness) => void;
  companyDims: [number,number,number,number,number];
  updateCompanyDim: (i: number, v: number) => void;
  siteTable: SiteTable;
  updateSiteCell: (row: SiteRowKey, geo: SiteGeoKey, val: number) => void;
  siteTotalAll: () => number;
  name: string;
  workshopDate: string;
  setWorkshopDate: (v: string) => void;
  consultantName: string;
  setConsultantName: (v: string) => void;
  companyLogo: string;
  setCompanyLogo: (v: string) => void;
  participantRole: string;
  setParticipantRole: (v: string) => void;
  participantCompany: string;
  setParticipantCompany: (v: string) => void;
}

export function CompanySetupScreen({
  language, profile, setLanguage, setScreen, reset,
  companyName, setCompanyName, questName, companySector, setCompanySector,
  companyMarket, setCompanyMarket, esgReadiness, setEsgReadiness,
  companyDims, updateCompanyDim, siteTable, updateSiteCell, siteTotalAll, name,
  workshopDate, setWorkshopDate, consultantName, setConsultantName,
  companyLogo, setCompanyLogo,
  participantRole, setParticipantRole, participantCompany, setParticipantCompany,
}: CompanySetupProps) {
  const isIt = language === "it";
  const sec = SECTORS[companySector];
  const readinessList = isIt ? ESG_READINESS_IT : ESG_READINESS_EN;
  const activeReadiness = readinessList.find(r => r.key === esgReadiness)!;
  const handleSectorChange = (sk: SectorKey) => { setCompanySector(sk); };
  const geoColKeys: SiteGeoKey[] = ["italia","europa","nordamerica","sudamerica","asia","africa","australia"];
  const geoColLabels: Record<SiteGeoKey,{it:string,en:string}> = {
    italia:{it:"Italia",en:"Italy"}, europa:{it:"Europa",en:"Europe"},
    nordamerica:{it:"N. Amer.",en:"N. Amer."}, sudamerica:{it:"S. Amer.",en:"S. Amer."},
    asia:{it:"Asia",en:"Asia"}, africa:{it:"Africa",en:"Africa"},
    australia:{it:"Australia",en:"Australia"},
  };
  const siteRowDefs: {key:SiteRowKey,label:{it:string,en:string}}[] = [
    {key:"uffici",   label:{it:"Sedi uffici",en:"Office locations"}},
    {key:"ops",      label:{it:sec.opsUnit.it.charAt(0).toUpperCase()+sec.opsUnit.it.slice(1),en:sec.opsUnit.en.charAt(0).toUpperCase()+sec.opsUnit.en.slice(1)}},
    {key:"datacenter",label:{it:"Data center",en:"Data centres"}},
    {key:"altro",    label:{it:"Altro",en:"Other"}},
  ];
  const siteTotal = siteTotalAll();
  const dimLabelRevenue = sec.dimUnit;
  const dimLabelEmployees:{it:string,en:string}={it:"dipendenti",en:"employees"};
  return <main className="csScreen" style={{position:"relative"}}><div className="welcomeBlueBar"/>
    <header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {isIt?"LA TUA AZIENDA":"YOUR COMPANY"}</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <div className="csBody">
      <div className="csLeft"><img className="csProfileImg" src={`./characters/${profile}-neutral.png`} alt={name}/><div className="csProfileTag"><span className="statusDot"/><div><small>ESG MANAGER</small><strong>{name}</strong></div></div></div>
      <div className="csRight">
        <p className="eyebrow">{isIt?"RACCONTACI LA TUA AZIENDA":"TELL US ABOUT YOUR COMPANY"}</p>
        <h1 className="csTitle">{isIt?"La tua azienda":"Your company"}</h1>
        <div className="csFormOneCol">
          <div className="csField csFieldName"><label>{isIt?"Nome Azienda":"Company Name"}<span className="csNameHint">{isIt?"· inserisci il nome della tua azienda":"· enter your company name"}</span></label><input className="csInput csInputName" placeholder={isIt?"Es. Acme S.p.A.":"E.g. Acme Ltd"} value={companyName||questName} onChange={e=>setCompanyName(e.target.value)}/></div>
          <div className="csField">
            <label>{isIt?"Logo azienda (opzionale)":"Company logo (optional)"}</label>
            <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
              <label style={{cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"6px",fontSize:"13px",padding:"6px 12px",border:"1px solid #3a6a50",borderRadius:"6px",background:"#f7faf8",color:"#0d3a2a"}}>
                📎 {isIt?"Carica immagine":"Upload image"}
                <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{if(ev.target?.result)setCompanyLogo(ev.target.result as string);};reader.readAsDataURL(file);}}/>
              </label>
              {companyLogo&&(<><img src={companyLogo} alt="logo" style={{height:"36px",maxWidth:"120px",objectFit:"contain",borderRadius:"4px",border:"1px solid #d0e8d8"}}/><button onClick={()=>setCompanyLogo("")} style={{fontSize:"11px",padding:"3px 8px",border:"1px solid #c0d0c8",borderRadius:"4px",background:"#fff",cursor:"pointer",color:"#666"}}>✕ {isIt?"Rimuovi":"Remove"}</button></>)}
            </div>
          </div>
          <div className="csTwoCol">
            <div className="csField"><label>{isIt?"Presenza mercati":"Market presence"}</label>
              <select className="csSelect" value={companyMarket} onChange={e=>setCompanyMarket(e.target.value as Market)}>
                <option value="italia">{isIt?"Solo Italia":"Italy only"}</option>
                <option value="europa">{isIt?"Europa":"Europe"}</option>
                <option value="mondo">{isIt?"Mondo":"Global"}</option>
              </select>
            </div>
            <div className="csField"><label>{isIt?"Settore":"Sector"}</label>
              <select className="csSelect" value={companySector} onChange={e=>handleSectorChange(e.target.value as SectorKey)}>
                {SECTOR_KEYS.map(sk=><option key={sk} value={sk}>{isIt?SECTORS[sk].label.it:SECTORS[sk].label.en}</option>)}
              </select>
            </div>
          </div>
          {/* Dimensioni economiche e persone */}
          <div className="csField">
            <label>{isIt?"Dimensioni organizzazione":"Organisation size"}</label>
            <div className="csDimsGrid">
              <div className="csDimRow"><input className="csDimInput" type="number" min={0} value={companyDims[0]===0?"":companyDims[0]} onChange={e=>updateCompanyDim(0,parseFloat(e.target.value))}/><span className="csDimUnit">{isIt?dimLabelRevenue.it:dimLabelRevenue.en}</span></div>
              <div className="csDimRow"><input className="csDimInput" type="number" min={0} value={companyDims[4]===0?"":companyDims[4]} onChange={e=>updateCompanyDim(4,parseFloat(e.target.value))}/><span className="csDimUnit">{isIt?dimLabelEmployees.it:dimLabelEmployees.en}</span></div>
            </div>
          </div>
          {/* Tabella sedi */}
          <div className="csField">
            <div className="csSiteTotal">{isIt?"Totale sedi":"Total locations"}: <strong>{siteTotal===0?"—":siteTotal}</strong></div>
            <div className="csSiteTableWrap">
              <table className="csSiteTable">
                <thead>
                  <tr>
                    <th className="csSiteThRow">{isIt?"Tipo sede":"Site type"}</th>
                    {geoColKeys.map(g=><th key={g} className="csSiteThGeo">{isIt?geoColLabels[g].it:geoColLabels[g].en}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {siteRowDefs.map(row=>(
                    <tr key={row.key}>
                      <td className="csSiteRowLabel">{isIt?row.label.it:row.label.en}</td>
                      {geoColKeys.map(g=>(
                        <td key={g} className="csSiteCell">
                          <input className="csSiteInput" type="number" min={0}
                            value={(siteTable[row.key][g]??0)===0?"":(siteTable[row.key][g]??0)}
                            onChange={e=>updateSiteCell(row.key,g,parseInt(e.target.value))}/>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="csField"><label>{isIt?"Seleziona il tuo stato attuale dati ESG":"Select your current ESG data status"}</label>
            <select className="csSelect" value={esgReadiness} onChange={e=>setEsgReadiness(e.target.value as EsgReadiness)}>
              {readinessList.map(r=><option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
            <p className="csReadinessDesc">{activeReadiness.desc}</p>
          </div>
          <div className="csFourCol">
            <div className="csField"><label>{isIt?"Data workshop":"Workshop date"}</label><input className="csInput" type="date" value={workshopDate} onChange={e=>setWorkshopDate(e.target.value)}/></div>
            <div className="csField"><label>{isIt?"Nome autore":"Author name"}</label><input className="csInput" type="text" placeholder={isIt?"Es. Mario Rossi":"E.g. John Smith"} value={consultantName} onChange={e=>setConsultantName(e.target.value)}/></div>
            <div className="csField"><label>{isIt?"Ruolo":"Role"}</label><input className="csInput" type="text" placeholder={isIt?"Es. ESG Manager":"E.g. ESG Manager"} value={participantRole} onChange={e=>setParticipantRole(e.target.value)}/></div>
            <div className="csField"><label>{isIt?"Società":"Company"}</label><input className="csInput" type="text" placeholder={isIt?"Es. Acme S.p.A.":"E.g. Acme Ltd"} value={participantCompany} onChange={e=>setParticipantCompany(e.target.value)}/></div>
          </div>
          <button className="actionButton csConfirmBtn" onClick={()=>setScreen("company")}>{isIt?"Entra nell'azienda":"Enter the company"}<b>→</b></button>
        </div>
      </div>
    </div>
  <div className="welcomeBlueBar"/></main>;
}

interface CompanyScreenProps extends CommonProps {
  companyName: string;
  companySector: SectorKey;
  companyMarket: Market;
  esgReadiness: EsgReadiness;
  companyDims: [number,number,number,number,number];
  updateCompanyDim: (i: number, v: number) => void;
  geoDistrib: Record<string,number>;
  displayCompanyName: string;
  csrdConfirmStep: 0|1|2;
  setCsrdConfirmStep: (v: 0|1|2) => void;
  csrdPendingChoice: boolean;
  setCsrdPendingChoice: (v: boolean) => void;
  csrdNote: string;
  setCsrdNote: (v: string) => void;
  csrdNoteOpen: boolean;
  setCsrdNoteOpen: (v: boolean) => void;
  csrdNoteDraft: string;
  setCsrdNoteDraft: (v: string) => void;
  renderTrustBar: () => JSX.Element;
  t: Record<string,any>;
  name: string;
  companyLogo?: string;
}

export function CompanyScreen({
  language, profile, setLanguage, setScreen, reset, renderTrustBar,
  companySector, companyMarket, esgReadiness, companyDims, updateCompanyDim,
  geoDistrib, displayCompanyName,
  csrdConfirmStep, setCsrdConfirmStep, csrdPendingChoice, setCsrdPendingChoice,
  csrdNote, setCsrdNote, csrdNoteOpen, setCsrdNoteOpen, csrdNoteDraft, setCsrdNoteDraft,
  t, name, companyLogo,
}: CompanyScreenProps) {
  const isIt = language === "it";
  const sec = SECTORS[companySector];
  const readinessList = isIt ? ESG_READINESS_IT : ESG_READINESS_EN;
  const activeReadiness = readinessList.find(r => r.key === esgReadiness)!;
  const sectorLabel = isIt ? sec.label.it : sec.label.en;
  const dimVal = companyDims[0]; const opsVal = companyDims[1]; const officesVal = companyDims[2]; const peopleVal = companyDims[4];
  const dimUnit = isIt ? sec.dimUnit.it : sec.dimUnit.en;
  const isMld = sec.dimUnit.it.includes("mld");
  const revenueM = isMld ? dimVal * 1000 : dimVal;
  const csrdAlert = revenueM >= 450 && peopleVal >= 1000;
  const opsUnit = isIt ? sec.opsUnit.it : sec.opsUnit.en;
  const offUnit = isIt ? "sedi uffici" : "office locations";
  const pepUnit = isIt ? "dipendenti" : "employees";
  const companyStoryGen = isIt ? `Un ${sectorLabel.toLowerCase()} da ${dimVal} ${dimUnit}, con ${opsVal} ${opsUnit} e ${officesVal} sedi operative.` : `A ${sectorLabel.toLowerCase()} with ${dimVal} ${dimUnit}, ${opsVal} ${opsUnit} and ${officesVal} operational locations.`;
  const evolvingGen = `${displayCompanyName} — ${activeReadiness.desc}`;
  const geoKeys = ["italia","europa","asia","nordamerica","sudamerica","africa","australia"];
  const geoLabelsShort: Record<string,{it:string,en:string}> = {italia:{it:"ITALIA",en:"ITALY"},europa:{it:"EUROPA",en:"EUROPE"},asia:{it:"ASIA",en:"ASIA"},nordamerica:{it:"N. AMERICA",en:"N. AMERICA"},sudamerica:{it:"S. AMERICA",en:"S. AMERICA"},africa:{it:"AFRICA",en:"AFRICA"},australia:{it:"AUSTRALIA",en:"AUSTRALIA"}};
  const activeGeo = geoKeys.filter(k => (geoDistrib[k] ?? 0) > 0 && (companyMarket === "mondo" || (companyMarket === "europa" && (k === "italia" || k === "europa")) || companyMarket === "italia" && k === "italia"));
  const posMap: Record<string,{left:string,top:string}[]> = {europa:[{left:"48%",top:"38%"},{left:"51%",top:"42%"},{left:"44%",top:"40%"},{left:"53%",top:"36%"}],asia:[{left:"72%",top:"42%"},{left:"75%",top:"46%"},{left:"68%",top:"44%"}],nordamerica:[{left:"18%",top:"40%"},{left:"22%",top:"36%"},{left:"15%",top:"44%"}],sudamerica:[{left:"28%",top:"64%"},{left:"24%",top:"68%"}],africa:[{left:"50%",top:"58%"},{left:"46%",top:"62%"}],australia:[{left:"78%",top:"66%"},{left:"82%",top:"62%"}]};
  return <main className="companyScreen">
    <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> COMPANY PROFILE</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <section className="companyCopy">
      <p className="eyebrow">{t.companyIntro}</p>
      <div style={{display:"flex",alignItems:"center",gap:"14px"}}>
        <h1 style={{margin:0}}>{displayCompanyName}</h1>
        {companyLogo && <img src={companyLogo} alt="logo" style={{height:"48px",maxWidth:"140px",objectFit:"contain",borderRadius:"6px",border:"1px solid #d0e8d8",background:"#fff",padding:"4px"}}/>}
      </div>
      <p className="companySubtitle">{isIt?"Edita con i tuoi valori o prosegui con i default mostrati":"Edit with your values or continue with the defaults shown"}</p>
      <p className="companyLead">{companyStoryGen}</p>
      <div className="companyStats">
        <div><strong>{dimVal}</strong><span>{dimUnit}</span></div>
        <div><strong>{opsVal}</strong><span>{opsUnit}</span></div>
        <div><strong>{officesVal}</strong><span>{offUnit}</span></div>
        <div><strong>{peopleVal.toLocaleString()}</strong><span>{pepUnit}</span></div>
      </div>
      {(()=>{
        if(csrdConfirmStep===2){
          return csrdPendingChoice?(
            <div className="csrdAlert csrdAlertDone"><span className="csrdAlertIcon">⚠</span><div className="csrdAlertBody"><strong>{isIt?"Indicativamente nel perimetro CSRD sulla base dei dati inseriti.":"Indicatively within the CSRD scope based on the data entered."}</strong><span>{isIt?"La valutazione deve essere verificata considerando perimetro societario, consolidamento, fatturato netto e specificità dell'organizzazione.":"This assessment should be verified considering corporate perimeter, consolidation, net revenue and organisational specifics."}</span></div></div>
          ):(
            <div className="csrdAlert csrdAlertOk csrdAlertDone"><span className="csrdAlertIcon">ℹ</span><div className="csrdAlertBody"><strong>{isIt?"Indicativamente fuori dal perimetro CSRD sulla base dei dati inseriti.":"Indicatively outside the CSRD scope based on the data entered."}</strong><span>{isIt?"La valutazione deve essere verificata considerando perimetro societario, consolidamento, fatturato netto e specificità dell'organizzazione.":"This assessment should be verified considering corporate perimeter, consolidation, net revenue and organisational specifics."}</span></div></div>
          );
        }
        if(csrdConfirmStep===1){
          return (
            <div className={`csrdAlert${csrdPendingChoice?"":" csrdAlertOk"}`}>
              <span className="csrdAlertIcon">{csrdPendingChoice?"⚠":"ℹ"}</span>
              <div className="csrdAlertBody">
                <strong>{csrdPendingChoice?(isIt?"Indicativamente nel perimetro CSRD sulla base dei dati inseriti.":"Indicatively within the CSRD scope based on the data entered."):(isIt?"Indicativamente fuori dal perimetro CSRD sulla base dei dati inseriti.":"Indicatively outside the CSRD scope based on the data entered.")}</strong>
                <span>{isIt?"Sicuro?":"Are you sure?"}</span>
              </div>
              <div className="csrdAlertBtns">
                <button className="csrdBtnYes" onClick={()=>setCsrdConfirmStep(2)}>{isIt?"Sì":"Yes"}</button>
                <button className="csrdBtnNo" onClick={()=>setCsrdConfirmStep(0)}>{isIt?"No":"No"}</button>
              </div>
            </div>
          );
        }
        return csrdAlert?(
          <div className="csrdAlert"><span className="csrdAlertIcon">⚠</span><div className="csrdAlertBody"><strong>{isIt?"Indicativamente nel perimetro CSRD sulla base dei dati inseriti.":"Indicatively within the CSRD scope based on the data entered."}</strong><span>{isIt?"Oltre 1.000 dipendenti e €450M di fatturato.":"Over 1,000 employees and €450M revenue."}</span></div><div className="csrdAlertBtns"><button className="csrdBtnYes" onClick={()=>{setCsrdPendingChoice(true);setCsrdConfirmStep(1);}}>{isIt?"Sì, confermo":"Yes, confirm"}</button><button className="csrdBtnNo" onClick={()=>{updateCompanyDim(4,999);setCsrdPendingChoice(false);setCsrdConfirmStep(1);}}>{isIt?"No, correggi":"No, correct"}</button></div></div>
        ):(
          <div className="csrdAlert csrdAlertOk"><span className="csrdAlertIcon">ℹ</span><div className="csrdAlertBody"><strong>{isIt?"Indicativamente fuori dal perimetro CSRD sulla base dei dati inseriti.":"Indicatively outside the CSRD scope based on the data entered."}</strong><span>{isIt?"Meno di 1.000 dipendenti o fatturato sotto €450M.":"Under 1,000 employees or revenue below €450M."}</span></div><div className="csrdAlertBtns"><button className="csrdBtnYes" onClick={()=>{setCsrdPendingChoice(false);setCsrdConfirmStep(1);}}>{isIt?"Sì, confermo":"Yes, confirm"}</button><button className="csrdBtnNo" onClick={()=>{updateCompanyDim(4,10000);setCsrdPendingChoice(true);setCsrdConfirmStep(1);}}>{isIt?"No, correggi":"No, correct"}</button></div></div>
        );
      })()}
      <div className="csrdNoteWrap">
        <button className="csrdNoteToggle" onClick={()=>{if(!csrdNoteOpen){setCsrdNoteDraft(csrdNote);} setCsrdNoteOpen(!csrdNoteOpen);}}>
          {csrdNote&&!csrdNoteOpen&&<span className="csrdNoteDot"/>}
          {isIt?"✏ Seleziona per note o osservazioni · perimetro CSRD":"✏ Select for notes or observations · CSRD scope"}
        </button>
        {csrdNoteOpen&&(
          <div className="csrdNoteBox">
            <textarea className="csrdNoteArea" rows={4} placeholder={isIt?"Aggiungi note sul contesto CSRD di questa azienda...":"Add notes on this company's CSRD context..."} value={csrdNoteDraft} onChange={e=>setCsrdNoteDraft(e.target.value)}/>
            <div className="csrdNoteActions">
              <button className="csrdNoteSave" onClick={()=>{setCsrdNote(csrdNoteDraft);setCsrdNoteOpen(false);}}>{isIt?"Salva":"Save"}</button>
              <button className="csrdNoteCancel" onClick={()=>setCsrdNoteOpen(false)}>{isIt?"Annulla":"Cancel"}</button>
            </div>
            {csrdNote&&<p className="csrdNoteSaved"><span>✓</span>{csrdNote}</p>}
          </div>
        )}
        {csrdNote&&!csrdNoteOpen&&<p className="csrdNoteSavedInline"><span>✓</span>{csrdNote}</p>}
      </div>
      <blockquote>{evolvingGen}</blockquote>
      {csrdConfirmStep===2&&<button className="actionButton" onClick={()=>setScreen("priorities")}>{t.explore}<b>→</b></button>}
    </section>
    <section className="worldMap" aria-label={`${displayCompanyName} footprint`}>
      <div className="mapGrid"/>
      <div className="region americas">AMERICAS</div><div className="region emea">EMEA</div><div className="region apac">APAC</div>
      <div className="mapPoint office milan" title="Milano HQ"><i/><span style={{left:"24px",top:"-46px",bottom:"auto",lineHeight:"1.45"}}><b style={{display:"block",color:"#effff9"}}>HQ · {displayCompanyName}</b><small style={{display:"block",color:"#72f7ca",fontSize:"8px"}}>MILAN</small></span></div>
      {activeGeo.filter(k=>k!=="italia").map(k=>{const pct=geoDistrib[k]??0;const count=Math.max(1,Math.round(pct/10));const positions=posMap[k]||[];return Array.from({length:Math.min(count,positions.length)}).map((_,idx)=><div key={`${k}-${idx}`} className="mapPoint office" style={{left:positions[idx].left,top:positions[idx].top}} title={isIt?geoLabelsShort[k].it:geoLabelsShort[k].en}><i/>{idx===0&&<span>{isIt?geoLabelsShort[k].it:geoLabelsShort[k].en} · {pct}%</span>}</div>);})}
      <div className="mapLegend"><b><i className="officeDot"/> {isIt?"SEDE":"OFFICE"}</b></div>
    </section>
  </main>;
}
