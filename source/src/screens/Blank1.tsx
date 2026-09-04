import { useState } from "react";
import type { CommonProps } from "./types";

interface Props extends CommonProps {
  p10SlideIdx: number;
  setP10SlideIdx: React.Dispatch<React.SetStateAction<number>>;
  P10_SLIDES: string[];
  onDownloadPptx?: (lang: "it"|"en") => void;
  onRefreshAndView?: (lang: "it"|"en") => Promise<void>;
}

export function Blank1({language,profile,setLanguage,setScreen,reset,renderTrustBar,p10SlideIdx,setP10SlideIdx,P10_SLIDES}:Props){
  return(
    <main style={{display:"flex",flexDirection:"column",height:"1080px",background:"var(--bg)",overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:"4px",background:"#3b82f4",zIndex:100}}/>
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL QUEST</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"12px",padding:"12px 0 20px",width:"100%",flex:1,minHeight:0}}>
        <div style={{position:"relative",width:"100%",maxWidth:"none",flex:1,minHeight:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <img src="./slide-education-1.png" alt="Education slide 1" style={{width:"100%",height:"100%",objectFit:"contain",borderRadius:"10px",boxShadow:"0 4px 32px rgba(0,0,0,.5)",display:"block"}}/>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"20px",marginTop:"4px",flexShrink:0}}>
          <button className="introBackBtn" onClick={()=>setScreen("questIntro")}>← {language==="it"?"Indietro":"Back"}</button>
          <button style={{background:"#1a56db",color:"#fff",border:"none",borderRadius:"8px",padding:"14px 36px",fontWeight:700,cursor:"pointer",fontSize:"16px",letterSpacing:".04em"}} onClick={()=>{setP10SlideIdx(0);setScreen("p10Slideshow");}}>▶ {language==="it"?"Presentazione IT":"Presentation IT"}</button>
          <button style={{background:"#0f3460",color:"#fff",border:"none",borderRadius:"8px",padding:"14px 36px",fontWeight:700,cursor:"pointer",fontSize:"16px",letterSpacing:".04em"}} onClick={()=>{setP10SlideIdx(0);setLanguage("en");setScreen("p10Slideshow");}}>▶ Presentation EN</button>
          <button className="actionButton approachIntroCta" onClick={()=>setScreen("approach")}>{language==="it"?"Avanti":"Next"} <b>→</b></button>
        </div>
      </section>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"4px",background:"#3b82f4",zIndex:100}}/>
    </main>
  );
}

export function IlTuoReport({language,profile,setLanguage,setScreen,reset,renderTrustBar,p10SlideIdx,setP10SlideIdx,P10_SLIDES,onDownloadPptx,onRefreshAndView}:Props){
  const isIt = language === "it";
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string|null>(null);

  const handleRefresh = async (lang: "it"|"en") => {
    if (!onRefreshAndView) return;
    setRefreshing(true);
    setRefreshError(null);
    setLanguage(lang);
    try {
      await onRefreshAndView(lang);
      setScreen("reportSlideshowPng");
    } catch(e:any) {
      setRefreshError(isIt ? "Errore aggiornamento slide. Riprova." : "Slide update failed. Please retry.");
    } finally {
      setRefreshing(false);
    }
  };

  return(
    <main style={{display:"flex",flexDirection:"column",height:"1080px",background:"var(--bg)",overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:"4px",background:"#3b82f4",zIndex:100}}/>
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {isIt?"IL TUO REPORT":"YOUR REPORT"}</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"12px",padding:"12px 0 20px",width:"100%",flex:1,minHeight:0}}>
        <h1 style={{margin:"0 0 4px",fontSize:"clamp(28px,3vw,44px)",fontWeight:520,letterSpacing:"-.05em",color:"#b5c9c1",flexShrink:0}}>
          {isIt?"Il tuo report":"Your report"}
        </h1>
        <div style={{position:"relative",width:"100%",maxWidth:"none",flex:1,minHeight:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <img src="./logica-report-finale.png" alt={isIt?"Anteprima report":"Report preview"} style={{width:"100%",height:"100%",objectFit:"contain",borderRadius:"10px",boxShadow:"0 4px 32px rgba(0,0,0,.5)",display:"block"}}/>
        </div>
        {refreshError&&<p style={{color:"#ff7777",fontSize:"13px",margin:0}}>{refreshError}</p>}
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginTop:"4px",flexShrink:0,flexWrap:"wrap",justifyContent:"center"}}>
          <button className="introBackBtn" onClick={()=>setScreen("priorityMatrix")}>← {isIt?"Indietro":"Back"}</button>

          {/* Scarica PPTX */}
          {onDownloadPptx&&<>
            <button style={{background:"#0d5c3a",color:"#39efb4",border:"1px solid #39efb4",borderRadius:"8px",padding:"12px 24px",fontWeight:700,cursor:"pointer",fontSize:"15px",letterSpacing:".04em"}}
              onClick={()=>onDownloadPptx("it")}>↓ {isIt?"Scarica IT":"Download IT"}</button>
            <button style={{background:"#0d3a2a",color:"#39efb4",border:"1px solid #39efb4",borderRadius:"8px",padding:"12px 24px",fontWeight:700,cursor:"pointer",fontSize:"15px",letterSpacing:".04em"}}
              onClick={()=>onDownloadPptx("en")}>↓ Download EN</button>
          </>}

          {/* Scarica e visualizza — aggiorna i PNG e apre il slideshow */}
          {onRefreshAndView&&<>
            <button
              disabled={refreshing}
              style={{background:refreshing?"#1a3a2a":"#1a56db",color:"#fff",border:"none",borderRadius:"8px",padding:"12px 24px",fontWeight:700,cursor:refreshing?"not-allowed":"pointer",fontSize:"15px",letterSpacing:".04em",opacity:refreshing?0.7:1}}
              onClick={()=>handleRefresh("it")}>
              {refreshing?"⏳ "+( isIt?"Generando…":"Generating…"):"▶ "+(isIt?"Genera e visualizza IT":"Generate & view IT")}
            </button>
            <button
              disabled={refreshing}
              style={{background:refreshing?"#0f2040":"#0f3460",color:"#fff",border:"none",borderRadius:"8px",padding:"12px 24px",fontWeight:700,cursor:refreshing?"not-allowed":"pointer",fontSize:"15px",letterSpacing:".04em",opacity:refreshing?0.7:1}}
              onClick={()=>handleRefresh("en")}>
              {refreshing?"⏳ Generating…":"▶ Generate & view EN"}
            </button>
          </>}

          <button className="actionButton approachIntroCta" onClick={()=>setScreen("chapterOneSummary")}>{isIt?"Avanti":"Next"} <b>→</b></button>
        </div>
      </section>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"4px",background:"#3b82f4",zIndex:100}}/>
    </main>
  );
}
