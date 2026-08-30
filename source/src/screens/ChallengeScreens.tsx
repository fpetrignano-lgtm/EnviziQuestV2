import type { Screen } from "../types";
import type { CommonProps } from "./types";

interface SeparatorProps extends CommonProps {
  num: number;
  nextScreen: Screen;
}

function ChallengeSeparator({language,setLanguage,setScreen,reset,goBack,renderTrustBar,num,nextScreen}:SeparatorProps){
  const isIt=language==="it";
  return(
    <main style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#07110e",position:"relative"}}>
      <header className="missionNav" style={{position:"fixed",top:0,left:0,right:0}}>
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> SFIDE</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <h1 style={{fontSize:"clamp(72px,12vw,160px)",fontWeight:800,letterSpacing:"-.04em",color:"#f2fff9",margin:0,lineHeight:1}}>{isIt?`Sfida ${num}`:`Challenge ${num}`}</h1>
      <div style={{width:"min(340px,80vw)",margin:"36px auto 0"}}>{renderTrustBar()}</div>
      <div style={{display:"flex",gap:"12px",marginTop:"32px"}}>
        <button className="secondaryAction" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button>
        <button className="secondaryAction" onClick={()=>setScreen("chapterMap")}>⌂ {isIt?"Indice":"Index"}</button>
        <button className="actionButton" style={{marginTop:0}} onClick={()=>setScreen(nextScreen)}>{isIt?"Avanti →":"Next →"}</button>
      </div>
    </main>
  );
}

interface CompleteProps extends CommonProps {
  num: number;
  nextScreen: Screen;
}

function ChallengeComplete({language,setLanguage,setScreen,reset,goBack,renderTrustBar,num,nextScreen}:CompleteProps){
  const isIt=language==="it";
  const isLast=num===6;
  const nextLabel=isLast?(isIt?"Vai al riepilogo →":"Go to summary →"):(isIt?`Inizia la Sfida ${num+1} →`:`Start Challenge ${num+1} →`);
  const titleText=isLast
    ?(isIt?"Hai completato\ntutte le sfide!":"You completed\nall challenges!")
    :(isIt?`Hai completato\nla Sfida ${num}`:`You completed\nChallenge ${num}`);
  return(
    <main style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#07110e",position:"relative"}}>
      <header className="missionNav" style={{position:"fixed",top:0,left:0,right:0}}>
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> SFIDE</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"24px"}}>
        <p style={{margin:0,font:`700 14px var(--font-geist-mono)`,letterSpacing:".2em",color:"#39efb4",textTransform:"uppercase"}}>{isIt?`Sfida ${num} completata`:`Challenge ${num} completed`}</p>
        <h1 style={{fontSize:"clamp(60px,10vw,140px)",fontWeight:800,letterSpacing:"-.04em",color:"#f2fff9",margin:0,lineHeight:1}}>{titleText}</h1>
        <div style={{width:"min(340px,80vw)",margin:"8px auto 0"}}>{renderTrustBar()}</div>
        <div style={{display:"flex",gap:"12px",marginTop:"8px"}}>
          <button className="secondaryAction" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button>
          <button className="actionButton" style={{marginTop:0}} onClick={()=>setScreen(nextScreen)}>{nextLabel}</button>
        </div>
      </div>
    </main>
  );
}

// ── Named exports for each challenge number ──────────────────────────────────

export function ChallengeSeparator1(p:Omit<SeparatorProps,"num"|"nextScreen">){
  return <ChallengeSeparator {...p} num={1} nextScreen="missionCard1"/>;
}
export function ChallengeSeparator2(p:Omit<SeparatorProps,"num"|"nextScreen">){
  return <ChallengeSeparator {...p} num={2} nextScreen="missionCard2"/>;
}
export function ChallengeSeparator3(p:Omit<SeparatorProps,"num"|"nextScreen">){
  return <ChallengeSeparator {...p} num={3} nextScreen="missionCard3"/>;
}
export function ChallengeSeparator4(p:Omit<SeparatorProps,"num"|"nextScreen">){
  return <ChallengeSeparator {...p} num={4} nextScreen="missionCard4"/>;
}
export function ChallengeSeparator5(p:Omit<SeparatorProps,"num"|"nextScreen">){
  return <ChallengeSeparator {...p} num={5} nextScreen="missionCard5"/>;
}
export function ChallengeSeparator6(p:Omit<SeparatorProps,"num"|"nextScreen">){
  return <ChallengeSeparator {...p} num={6} nextScreen="missionCard6"/>;
}

export function ChallengeComplete1(p:Omit<CompleteProps,"num"|"nextScreen">){
  return <ChallengeComplete {...p} num={1} nextScreen="challengeSeparator2"/>;
}
export function ChallengeComplete2(p:Omit<CompleteProps,"num"|"nextScreen">){
  return <ChallengeComplete {...p} num={2} nextScreen="challengeSeparator3"/>;
}
export function ChallengeComplete3(p:Omit<CompleteProps,"num"|"nextScreen">){
  return <ChallengeComplete {...p} num={3} nextScreen="challengeSeparator4"/>;
}
export function ChallengeComplete4(p:Omit<CompleteProps,"num"|"nextScreen">){
  return <ChallengeComplete {...p} num={4} nextScreen="challengeSeparator5"/>;
}
export function ChallengeComplete5(p:Omit<CompleteProps,"num"|"nextScreen">){
  return <ChallengeComplete {...p} num={5} nextScreen="challengeSeparator6"/>;
}
export function ChallengeComplete6(p:Omit<CompleteProps,"num"|"nextScreen">){
  return <ChallengeComplete {...p} num={6} nextScreen="summary"/>;
}
