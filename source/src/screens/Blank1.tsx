import type { CommonProps } from "./types";

interface Props extends CommonProps {
  p10SlideIdx: number;
  setP10SlideIdx: React.Dispatch<React.SetStateAction<number>>;
  P10_SLIDES: string[];
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
