import type { Screen } from "../types";
import type { CommonProps } from "./types";

const CHAPTER_MAP_ITEMS: {labelIt:string,labelEn:string,screen:Screen,icon:string}[] = [
  {labelIt:"Introduzione al Quest",labelEn:"Introduction to the Quest",screen:"questIntro",icon:"01"},
  {labelIt:"La presentazione Envizi",labelEn:"Envizi Presentation",screen:"blank1",icon:"02"},
  {labelIt:"Dalle priorità alle decisioni",labelEn:"From priorities to decisions",screen:"approachIntro",icon:"03"},
  {labelIt:"Profilo azienda",labelEn:"Company profile",screen:"companySetup",icon:"04"},
  {labelIt:"Priorità ESG",labelEn:"ESG Priorities",screen:"priorities",icon:"05"},
  {labelIt:"Mappa dei dati",labelEn:"Data map",screen:"priorityData",icon:"06"},
  {labelIt:"Mission Hub",labelEn:"Mission Hub",screen:"roadmapPreview",icon:"07"},
  {labelIt:"Missione 01 · Data Foundation",labelEn:"Mission 01 · Data Foundation",screen:"challengeSeparator1",icon:"M1"},
  {labelIt:"Missione 02 · Energy",labelEn:"Mission 02 · Energy",screen:"challengeSeparator2",icon:"M2"},
  {labelIt:"Missione 03 · Supply Chain",labelEn:"Mission 03 · Supply Chain",screen:"challengeSeparator3",icon:"M3"},
  {labelIt:"Missione 04 · Reporting",labelEn:"Mission 04 · Reporting",screen:"challengeSeparator4",icon:"M4"},
  {labelIt:"Missione 05 · Net Zero",labelEn:"Mission 05 · Net Zero",screen:"challengeSeparator5",icon:"M5"},
  {labelIt:"Missione 06 · Frameworks",labelEn:"Mission 06 · Frameworks",screen:"challengeSeparator6",icon:"M6"},
  {labelIt:"Riepilogo finale",labelEn:"Final summary",screen:"summary",icon:"✓"},
];

interface Props extends CommonProps {
  name: string;
}

export function ChapterMap({language,profile,setLanguage,setScreen,reset,renderTrustBar,name}:Props){
  return(
    <main style={{display:"flex",flexDirection:"column",height:"100dvh",background:"var(--bg)",overflow:"hidden"}}>
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL QUEST</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section style={{flex:1,display:"flex",flexDirection:"row",alignItems:"stretch",padding:"24px 32px 20px",gap:"36px",overflow:"hidden",boxSizing:"border-box"}}>
        {/* colonna sinistra: foto profilo */}
        <div style={{flexShrink:0,width:"400px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"16px"}}>
          <img src={`./characters/${profile}-neutral.png`} alt={name} style={{width:"400px",height:"400px",objectFit:"contain",borderRadius:"50%",display:"block"}}/>
          <span style={{fontWeight:700,fontSize:"32px",textAlign:"center",lineHeight:1.3}}>{name}<br/><small style={{fontWeight:400,fontSize:"24px",color:"var(--muted)"}}>ESG Manager</small></span>
        </div>
        {/* colonna destra: titolo + griglia a due colonne */}
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:"16px",minWidth:0}}>
          <div>
            <small style={{letterSpacing:".14em",fontSize:"24px",color:"var(--muted)",textTransform:"uppercase",fontWeight:700}}>{language==="it"?"ENVIZI QUEST · MAPPA DEI CAPITOLI":"ENVIZI QUEST · CHAPTER MAP"}</small>
            <h1 style={{fontSize:"clamp(56px,5vw,104px)",fontWeight:800,margin:"6px 0 4px",lineHeight:1.1}}>{language==="it"?"L'Esperienza Envizi Quest":"The Envizi Quest Experience"}</h1>
            <p style={{color:"var(--muted)",fontSize:"30px",lineHeight:1.5,margin:0}}>{language==="it"?"Salta direttamente al capitolo che ti interessa o procedi dall'inizio.":"Jump directly to the chapter you want or proceed from the beginning."}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",flex:1,alignContent:"start"}}>
            {CHAPTER_MAP_ITEMS.map((ch)=>(
              <button key={ch.screen} onClick={()=>setScreen(ch.screen)} style={{display:"flex",alignItems:"center",gap:"14px",background:"var(--surface,#1a1a2e)",border:"1px solid var(--border,rgba(255,255,255,.1))",borderRadius:"10px",padding:"12px 16px",cursor:"pointer",textAlign:"left",transition:"border-color .15s",color:"inherit"}}
                onMouseEnter={e=>(e.currentTarget.style.borderColor="var(--accent,#39efb4)")}
                onMouseLeave={e=>(e.currentTarget.style.borderColor="var(--border,rgba(255,255,255,.1))")}>
                <span style={{minWidth:"40px",height:"40px",borderRadius:"8px",background:"var(--accent,#39efb4)",color:"#000",fontWeight:800,fontSize:"14px",display:"flex",alignItems:"center",justifyContent:"center",letterSpacing:".04em",flexShrink:0}}>{ch.icon}</span>
                <span style={{fontWeight:600,fontSize:"30px",lineHeight:1.3}}>{language==="it"?ch.labelIt:ch.labelEn}</span>
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:"12px",paddingBottom:"4px"}}>
            <button className="introBackBtn" style={{fontSize:"26px",padding:"12px 24px"}} onClick={()=>setScreen("approach")}>← {language==="it"?"Indietro":"Back"}</button>
            <button className="actionButton approachIntroCta" style={{fontSize:"26px",padding:"14px 36px"}} onClick={()=>setScreen("questIntro")}>{language==="it"?"Inizia dall'inizio":"Start from the beginning"} <b>→</b></button>
          </div>
        </div>
      </section>
    </main>
  );
}
