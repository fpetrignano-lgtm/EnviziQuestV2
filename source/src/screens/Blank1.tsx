import type { CommonProps } from "./types";

interface Props extends CommonProps {
  p10SlideIdx: number;
  setP10SlideIdx: React.Dispatch<React.SetStateAction<number>>;
  P10_SLIDES: string[];
}

export function Blank1({language,profile,setLanguage,setScreen,reset,renderTrustBar,p10SlideIdx,setP10SlideIdx,P10_SLIDES}:Props){
  return(
    <main style={{display:"flex",flexDirection:"column",minHeight:"100dvh",background:"var(--bg)",overflowY:"auto"}}>
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL QUEST</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"20px",padding:"24px 0 40px",width:"100%"}}>
        <div style={{position:"relative",width:"95%",maxWidth:"1400px"}}>
          <img src="./slide-education-1.png" alt="Education slide 1" style={{width:"100%",borderRadius:"10px",boxShadow:"0 4px 32px rgba(0,0,0,.5)",display:"block"}}/>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"20px",marginTop:"8px"}}>
          <button className="introBackBtn" onClick={()=>setScreen("questIntro")}>← {language==="it"?"Indietro":"Back"}</button>
          <button style={{background:"#1a56db",color:"#fff",border:"none",borderRadius:"8px",padding:"14px 36px",fontWeight:700,cursor:"pointer",fontSize:"16px",letterSpacing:".04em"}} onClick={()=>{setP10SlideIdx(0);setScreen("p10Slideshow");}}>▶ {language==="it"?"Presentazione IT":"Presentation IT"}</button>
          <button style={{background:"#0f3460",color:"#fff",border:"none",borderRadius:"8px",padding:"14px 36px",fontWeight:700,cursor:"pointer",fontSize:"16px",letterSpacing:".04em"}} onClick={()=>{setP10SlideIdx(0);setLanguage("en");setScreen("p10Slideshow");}}>▶ Presentation EN</button>
          <button className="actionButton approachIntroCta" onClick={()=>setScreen("chapterMap")}>{language==="it"?"Avanti":"Next"} <b>→</b></button>
        </div>
      </section>
    </main>
  );
}
