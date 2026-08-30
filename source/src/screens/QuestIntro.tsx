import type { CommonProps } from "./types";

interface Props extends CommonProps {
  name: string;
}

export function QuestIntro({language,profile,setLanguage,setScreen,reset,renderTrustBar,name}:Props){
  const t_cta = language==="it"?"Inizia →":"Start →";
  return(
    <main className="questIntroScreen">
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL QUEST</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="questIntroBody">
        <img src={`./characters/${profile}-neutral.png`} className="questIntroProfileImg" alt={name}/>
        <h1 className="questIntroTitle">{language==="it"?"Introduzione al Quest":"Introduction to the Quest"}</h1>
        <button className="actionButton questIntroCta" onClick={()=>setScreen("blank1")}>{t_cta}<b>→</b></button>
      </section>
    </main>
  );
}
