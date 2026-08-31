import type { CommonProps } from "./types";

interface Props extends CommonProps {
  t: Record<string, any>;
}

export function ApproachIntro({language,setLanguage,setScreen,reset,goBack,t}:Props){
  return(
    <main className="approachIntroScreen">
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="approachIntroBody approachIntroBodyStack">
        <img src="./logica-macro.png" className="approachIntroHeroImg" alt="Dalle priorità alle decisioni"/>
        <div className="approachIntroStackContent">
          <div className="approachIntroStackLeft">
            <button className="introBackBtn" onClick={()=>goBack()}>← {language==="it"?"Indietro":"Back"}</button>
            <h1 className="approachIntroTitle">{t.approachIntroTitle}</h1>
            <div className="approachIntroText">{(t.approachIntroBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div>
          </div>
          <div className="approachIntroStackRight">
            <img src="./step-6.svg" className="approachIntroStackBadge" alt="Step 6"/>
            <button className="actionButton approachIntroCta" onClick={()=>setScreen("approachSteps")}>{t.approachIntroCta}<b>→</b></button>
          </div>
        </div>
      </section>
    </main>
  );
}

export function ApproachSteps({language,setLanguage,setScreen,reset,goBack,t}:Props){
  return(
    <main className="approachIntroScreen" style={{position:"relative"}}>
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="approachIntroBody approachIntroBodyStack">
        <img src="./logica-obiettivi.png" className="approachIntroHeroImg" alt="Obiettivi di business ESG"/>
        <div className="approachIntroStackContent">
          <div className="approachIntroStackLeft">
            <button className="introBackBtn" onClick={()=>goBack()}>← {language==="it"?"Indietro":"Back"}</button>
            <h1 className="approachIntroTitle">{t.approachStepsTitle}</h1>
            <div className="approachIntroText">{(t.approachStepsBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div>
            <p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachStepsExample as string}</p>
          </div>
          <div className="approachIntroStackRight">
            <img src="./step-1.svg" className="approachIntroStackBadge" alt="Step 1"/>
            <button className="actionButton approachIntroCta" onClick={()=>setScreen("approachData")}>{t.approachStepsCta}<b>→</b></button>
          </div>
        </div>
      </section>
    </main>
  );
}

export function ApproachData({language,setLanguage,setScreen,reset,goBack,t}:Props){
  return(
    <main className="approachIntroScreen" style={{position:"relative"}}>
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="approachIntroBody approachIntroBodyStack">
        <img src="./logica-issue.png" className="approachIntroHeroImg" alt="Criticità dati ESG"/>
        <div className="approachIntroStackContent">
          <div className="approachIntroStackLeft">
            <button className="introBackBtn" onClick={()=>goBack()}>← {language==="it"?"Indietro":"Back"}</button>
            <h1 className="approachIntroTitle">{t.approachDataTitle}</h1>
            <div className="approachIntroText">{(t.approachDataBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div>
            <p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachDataExample as string}</p>
          </div>
          <div className="approachIntroStackRight">
            <img src="./step-2.svg" className="approachIntroStackBadge" alt="Step 2"/>
            <button className="actionButton approachIntroCta" onClick={()=>setScreen("approachDecisions")}>{t.approachDataCta}<b>→</b></button>
          </div>
        </div>
      </section>
    </main>
  );
}

export function ApproachDecisions({language,setLanguage,setScreen,reset,goBack,t}:Props){
  return(
    <main className="approachIntroScreen" style={{position:"relative"}}>
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="approachIntroBody approachIntroBodyStack">
        <img src="./logica-decisionali.png" className="approachIntroHeroImg" alt="Sfide decisionali ESG"/>
        <div className="approachIntroStackContent">
          <div className="approachIntroStackLeft">
            <button className="introBackBtn" onClick={()=>goBack()}>← {language==="it"?"Indietro":"Back"}</button>
            <h1 className="approachIntroTitle">{t.approachDecisionsTitle}</h1>
            <div className="approachIntroText">{(t.approachDecisionsBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div>
            <p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachDecisionsExample as string}</p>
          </div>
          <div className="approachIntroStackRight">
            <img src="./step-3.svg" className="approachIntroStackBadge" alt="Step 3"/>
            <button className="actionButton approachIntroCta" onClick={()=>setScreen("approachRoadmap")}>{t.approachDecisionsCta}<b>→</b></button>
          </div>
        </div>
      </section>
    </main>
  );
}

export function ApproachRoadmap({language,setLanguage,setScreen,reset,goBack,t}:Props){
  return(
    <main className="approachIntroScreen">
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="approachIntroBody approachIntroBodyStack">
        <img src="./logica-road-elementi.png" className="approachIntroHeroImg" alt="Roadmap ESG"/>
        <div className="approachIntroStackContent">
          <div className="approachIntroStackLeft">
            <button className="introBackBtn" onClick={()=>goBack()}>← {language==="it"?"Indietro":"Back"}</button>
            <h1 className="approachIntroTitle">{t.approachRoadmapTitle}</h1>
            <div className="approachIntroText">{(t.approachRoadmapBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div>
            <p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachRoadmapExample as string}</p>
          </div>
          <div className="approachIntroStackRight">
            <img src="./step-4.svg" className="approachIntroStackBadge" alt="Step 4"/>
            <button className="actionButton approachIntroCta" onClick={()=>setScreen("approachTrust")}>{t.approachRoadmapCta}<b>→</b></button>
          </div>
        </div>
      </section>
    </main>
  );
}

export function ApproachTrust({language,setLanguage,setScreen,reset,goBack,t}:Props){
  return(
    <main className="approachIntroScreen">
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="approachIntroBody approachIntroBodyStack">
        <img src="./logica-game-fiducia.png" className="approachIntroHeroImg" alt="Game fiducia stakeholder"/>
        <div className="approachIntroStackContent">
          <div className="approachIntroStackLeft">
            <button className="introBackBtn" onClick={()=>goBack()}>← {language==="it"?"Indietro":"Back"}</button>
            <h1 className="approachIntroTitle">{t.approachTrustTitle}</h1>
            <div className="approachIntroText">{(t.approachTrustBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div>
            <p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachTrustExample as string}</p>
          </div>
          <div className="approachIntroStackRight">
            <img src="./step-5.svg" className="approachIntroStackBadge" alt="Step 5"/>
            <button className="actionButton approachIntroCta" onClick={()=>setScreen("approachReport")}>{t.approachTrustCta}<b>→</b></button>
          </div>
        </div>
      </section>
    </main>
  );
}

export function ApproachReport({language,setLanguage,setScreen,reset,goBack,t}:Props){
  return(
    <main className="approachIntroScreen">
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="approachIntroBody approachIntroBodyStack">
        <img src="./logica-report-finale.png" className="approachIntroHeroImg" alt="Report finale ESG"/>
        <div className="approachIntroStackContent">
          <div className="approachIntroStackLeft">
            <button className="introBackBtn" onClick={()=>goBack()}>← {language==="it"?"Indietro":"Back"}</button>
            <h1 className="approachIntroTitle">{t.approachReportTitle}</h1>
            <div className="approachIntroText">{(t.approachReportBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div>
            <p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachReportExample as string}</p>
          </div>
          <div className="approachIntroStackRight">
            <img src="./step-6.svg" className="approachIntroStackBadge" alt="Step 6"/>
            <button className="actionButton approachIntroCta" onClick={()=>setScreen("intro")}>{t.approachReportCta}<b>→</b></button>
          </div>
        </div>
      </section>
    </main>
  );
}
