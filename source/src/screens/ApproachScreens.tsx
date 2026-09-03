import type { CommonProps } from "./types";

interface Props extends CommonProps {
  t: Record<string, any>;
}

export function ApproachIntro({language,setLanguage,setScreen,reset,goBack,t}:Props){
  return(
    <main className="approachIntroScreen" style={{position:"relative"}}><div className="welcomeBlueBar"/>
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="approachIntroBody approachIntroBodyWithImg">
        <div className="approachIntroLeft">
          <h1 className="approachIntroTitle">{t.approachIntroTitle}</h1>
          <div className="approachIntroText">{(t.approachIntroBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div>
        </div>
        <div className="approachIntroRight approachIntroRightWithCta">
          <img src="./step-6.svg" className="approachIntroStepBadge" alt="Step 6"/>
          <img src="./logica-macro.png" className="approachIntroImg" alt="Dalle priorità alle decisioni"/>
          <button className="actionButton approachIntroCta approachIntroCtaRight" onClick={()=>setScreen("approachSteps")}>{t.approachIntroCta}<b>→</b></button>
        </div>
      </section>
      <div className="welcomeBlueBar"/>
    </main>
  );
}

export function ApproachSteps({language,setLanguage,setScreen,reset,goBack,t}:Props){
  return(
    <main className="approachIntroScreen" style={{position:"relative"}}><div className="welcomeBlueBar"/>
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="approachIntroBody approachIntroBodyWithImg">
        <div className="approachIntroLeft">
          <h1 className="approachIntroTitle">{t.approachStepsTitle}</h1>
          <div className="approachIntroText">{(t.approachStepsBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div>
        </div>
        <div className="approachIntroRight">
          <img src="./step-1.svg" className="approachIntroStepBadge" alt="Step 1"/>
          <img src="./logica-obiettivi.png" className="approachIntroImg" alt="Obiettivi di business ESG"/>
          <p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachStepsExample as string}</p>
          <button className="actionButton approachIntroCta" onClick={()=>setScreen("approachData")}>{t.approachStepsCta}<b>→</b></button>
        </div>
      </section>
      <div className="welcomeBlueBar"/>
    </main>
  );
}

export function ApproachData({language,setLanguage,setScreen,reset,goBack,t}:Props){
  return(
    <main className="approachIntroScreen" style={{position:"relative"}}><div className="welcomeBlueBar"/>
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="approachIntroBody approachIntroBodyWithImg">
        <div className="approachIntroLeft">
          <h1 className="approachIntroTitle">{t.approachDataTitle}</h1>
          <div className="approachIntroText">{(t.approachDataBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div>
        </div>
        <div className="approachIntroRight approachIntroRightWithCta">
          <img src="./step-2.svg" className="approachIntroStepBadge" alt="Step 2"/>
          <img src="./logica-issue.png" className="approachIntroImg" alt="Criticità dati ESG"/>
          <p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachDataExample as string}</p>
          <button className="actionButton approachIntroCta approachIntroCtaRight" onClick={()=>setScreen("approachDecisions")}>{t.approachDataCta}<b>→</b></button>
        </div>
      </section>
      <div className="welcomeBlueBar"/>
    </main>
  );
}

export function ApproachDecisions({language,setLanguage,setScreen,reset,goBack,t}:Props){
  return(
    <main className="approachIntroScreen" style={{position:"relative"}}><div className="welcomeBlueBar"/>
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="approachIntroBody approachIntroBodyWithImg">
        <div className="approachIntroLeft">
          <h1 className="approachIntroTitle">{t.approachDecisionsTitle}</h1>
          <div className="approachIntroText">{(t.approachDecisionsBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div>
        </div>
        <div className="approachIntroRight approachIntroRightWithCta">
          <img src="./step-3.svg" className="approachIntroStepBadge" alt="Step 3"/>
          <img src="./logica-decisionali.png" className="approachIntroImg" alt="Sfide decisionali ESG"/>
          <p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachDecisionsExample as string}</p>
          <button className="actionButton approachIntroCta approachIntroCtaRight" onClick={()=>setScreen("approachRoadmap")}>{t.approachDecisionsCta}<b>→</b></button>
        </div>
      </section>
      <div className="welcomeBlueBar"/>
    </main>
  );
}

export function ApproachRoadmap({language,setLanguage,setScreen,reset,goBack,t}:Props){
  return(
    <main className="approachIntroScreen" style={{position:"relative"}}><div className="welcomeBlueBar"/>
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="approachIntroBody approachIntroBodyWithImg">
        <div className="approachIntroLeft">
          <h1 className="approachIntroTitle">{t.approachRoadmapTitle}</h1>
          <div className="approachIntroText">{(t.approachRoadmapBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div>
        </div>
        <div className="approachIntroRight approachIntroRightWithCta">
          <img src="./step-4.svg" className="approachIntroStepBadge" alt="Step 4"/>
          <img src="./logica-road-elementi.png" className="approachIntroImg" alt="Roadmap ESG"/>
          <p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachRoadmapExample as string}</p>
          <button className="actionButton approachIntroCta approachIntroCtaRight" onClick={()=>setScreen("approachTrust")}>{t.approachRoadmapCta}<b>→</b></button>
        </div>
      </section>
      <div className="welcomeBlueBar"/>
    </main>
  );
}

export function ApproachTrust({language,setLanguage,setScreen,reset,goBack,t}:Props){
  return(
    <main className="approachIntroScreen" style={{position:"relative"}}><div className="welcomeBlueBar"/>
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="approachIntroBody approachIntroBodyWithImg">
        <div className="approachIntroLeft">
          <h1 className="approachIntroTitle">{t.approachTrustTitle}</h1>
          <div className="approachIntroText">{(t.approachTrustBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div>
        </div>
        <div className="approachIntroRight approachIntroRightWithCta">
          <img src="./step-5.svg" className="approachIntroStepBadge" alt="Step 5"/>
          <img src="./logica-game-fiducia.png" className="approachIntroImg" alt="Game fiducia stakeholder"/>
          <p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachTrustExample as string}</p>
          <button className="actionButton approachIntroCta approachIntroCtaRight" onClick={()=>setScreen("approachReport")}>{t.approachTrustCta}<b>→</b></button>
        </div>
      </section>
      <div className="welcomeBlueBar"/>
    </main>
  );
}

export function ApproachReport({language,setLanguage,setScreen,reset,goBack,t}:Props){
  return(
    <main className="approachIntroScreen" style={{position:"relative"}}><div className="welcomeBlueBar"/>
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="approachIntroBody approachIntroBodyWithImg">
        <div className="approachIntroLeft">
          <h1 className="approachIntroTitle">{t.approachReportTitle}</h1>
          <div className="approachIntroText">{(t.approachReportBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div>
        </div>
        <div className="approachIntroRight approachIntroRightWithCta">
          <img src="./step-6.svg" className="approachIntroStepBadge" alt="Step 6"/>
          <img src="./logica-report-finale.png" className="approachIntroImg" alt="Report finale ESG"/>
          <p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachReportExample as string}</p>
          <button className="actionButton approachIntroCta approachIntroCtaRight" onClick={()=>setScreen("intro")}>{t.approachReportCta}<b>→</b></button>
        </div>
      </section>
      <div className="welcomeBlueBar"/>
    </main>
  );
}
