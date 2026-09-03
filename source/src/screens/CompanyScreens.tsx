import type { Market, SectorKey, EsgReadiness } from "../types";
import type { CommonProps } from "./types";
import { SECTORS, SECTOR_KEYS, ESG_READINESS_IT, ESG_READINESS_EN } from "../constants";

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
  setCompanyDims: (v: [number,number,number,number,number]) => void;
  geoDistrib: Record<string,number>;
  setGeoDistrib: (v: Record<string,number>) => void;
  name: string;
  workshopDate: string;
  setWorkshopDate: (v: string) => void;
  consultantName: string;
  setConsultantName: (v: string) => void;
  companyLogo: string;
  setCompanyLogo: (v: string) => void;
}

export function CompanySetupScreen({
  language, profile, setLanguage, setScreen, reset,
  companyName, setCompanyName, questName, companySector, setCompanySector,
  companyMarket, setCompanyMarket, esgReadiness, setEsgReadiness,
  companyDims, updateCompanyDim, setCompanyDims, geoDistrib, setGeoDistrib, name,
  workshopDate, setWorkshopDate, consultantName, setConsultantName,
  companyLogo, setCompanyLogo,
}: CompanySetupProps) {
  const isIt = language === "it";
  const sec = SECTORS[companySector];
  const readinessList = isIt ? ESG_READINESS_IT : ESG_READINESS_EN;
  const activeReadiness = readinessList.find(r => r.key === esgReadiness)!;
  const geoKeys = ["italia","europa","asia","nordamerica","sudamerica","africa","australia"];
  const geoLabels: Record<string,{it:string,en:string}> = {italia:{it:"Italia",en:"Italy"},europa:{it:"Europa",en:"Europe"},asia:{it:"Asia",en:"Asia"},nordamerica:{it:"Nord America",en:"N. America"},sudamerica:{it:"Sud America",en:"S. America"},africa:{it:"Africa",en:"Africa"},australia:{it:"Australia",en:"Australia"}};
  const dimLabelsFull: [{it:string,en:string},{it:string,en:string},{it:string,en:string},{it:string,en:string},{it:string,en:string}] = [sec.dimUnit, sec.opsUnit, {it:"sedi uffici",en:"Office locations"}, {it:"data center",en:"Data centres"}, {it:"dipendenti",en:"Employees"}];
  const handleSectorChange = (sk: SectorKey) => { setCompanySector(sk); setCompanyDims([0,0,0,0,0]); };
  const totalSedi = companyDims[1] + companyDims[2] + companyDims[3];
  const nonItalyKeys = (companyMarket === "mondo" ? geoKeys : ["europa"]).filter(k => k !== "italia");
  const otherSum = nonItalyKeys.reduce((s,k) => s + (geoDistrib[k] ?? 0), 0);
  const italyVal = totalSedi - otherSum;
  const geoError = (companyMarket === "europa" || companyMarket === "mondo") && italyVal < 0;
  const handleGeoChange = (key: string, val: number) => {
    if (key === "italia") return;
    const v = isNaN(val) ? 0 : Math.max(0, val);
    setGeoDistrib((prev: Record<string,number>) => { const next = {...prev,[key]:v}; return next; });
  };
  return <main className="csScreen" style={{position:"relative"}}><div className="welcomeBlueBar"/>
    <header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {isIt?"LA TUA AZIENDA":"YOUR COMPANY"}</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <div className="csBody">
      <div className="csLeft"><img className="csProfileImg" src={`./characters/${profile}-neutral.png`} alt={name}/><div className="csProfileTag"><span className="statusDot"/><div><small>ESG MANAGER</small><strong>{name}</strong></div></div></div>
      <div className="csRight">
        <p className="eyebrow">{isIt?"RACCONTACI LA TUA AZIENDA":"TELL US ABOUT YOUR COMPANY"}</p>
        <h1 className="csTitle">{isIt?"La tua azienda":"Your company"}</h1>
        <div className="csFormTwoCol">
          <div className="csFormLeft">
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
            <div className="csField"><label>{isIt?"Dimensioni organizzazione":"Organisation size"}</label>
              <div className="csDimsGrid">
                {companyDims.map((v,i)=><div key={i} className="csDimRow"><input className="csDimInput" type="number" min={0} value={v===0?"":v} onChange={e=>updateCompanyDim(i,parseFloat(e.target.value))}/><span className="csDimUnit">{isIt?dimLabelsFull[i].it:dimLabelsFull[i].en}</span></div>)}
              </div>
              <div className="csDimTotalRow">
                <input className="csDimInput csDimInputTotal" type="number" readOnly value={(companyDims[1]+companyDims[2]+companyDims[3])===0?"":(companyDims[1]+companyDims[2]+companyDims[3])}/>
                <span className="csDimUnit">{isIt?"sedi totali (calcolato)":"total locations (calculated)"}</span>
              </div>
            </div>
            {(companyMarket==="europa"||companyMarket==="mondo")&&<div className="csField"><label>{isIt?"Distribuzione sedi per paese (n. sedi)":"Location distribution by country (no. of sites)"}</label>
              <div className="csGeoGrid">
                <div className={`csGeoRow${geoError?" csGeoRowError":" csGeoRowItalia"}`}><span>{isIt?"Italia":"Italy"}</span><input className="csDimInput csGeoItalyInput" type="number" readOnly value={italyVal} title={isIt?"Calcolato: sedi totali meno la somma degli altri paesi":"Calculated: total sites minus sum of other countries"}/><span className="csGeoItalyHint">{isIt?"← calcolato":"← auto"}</span></div>
                {nonItalyKeys.map(k=><div key={k} className="csGeoRow"><span>{isIt?geoLabels[k].it:geoLabels[k].en}</span><input className="csDimInput" type="number" min={0} value={(geoDistrib[k]??0)===0?"":(geoDistrib[k]??0)} onChange={e=>handleGeoChange(k,parseInt(e.target.value))}/></div>)}
              </div>
              {geoError&&<p className="csGeoErrorMsg">{isIt?"⚠ Il numero di sedi negli altri paesi supera il totale sedi. Riduci i valori.":"⚠ Sites in other countries exceed total sites. Please reduce the values."}</p>}
            </div>}
          </div>
          <div className="csFormRight">
            <div className="csField"><label>{isIt?"Seleziona il tuo stato attuale dati ESG":"Select your current ESG data status"}</label>
              <select className="csSelect" value={esgReadiness} onChange={e=>setEsgReadiness(e.target.value as EsgReadiness)}>
                {readinessList.map(r=><option key={r.key} value={r.key}>{r.label}</option>)}
              </select>
              <p className="csReadinessDesc">{activeReadiness.desc}</p>
            </div>
            <div className="csTwoCol">
              <div className="csField"><label>{isIt?"Data workshop":"Workshop date"}</label><input className="csInput" type="date" value={workshopDate} onChange={e=>setWorkshopDate(e.target.value)}/></div>
              <div className="csField"><label>{isIt?"Nome consulente":"Consultant name"}</label><input className="csInput" type="text" placeholder={isIt?"Es. Mario Rossi":"E.g. John Smith"} value={consultantName} onChange={e=>setConsultantName(e.target.value)}/></div>
            </div>
            <button className="actionButton csConfirmBtn" disabled={geoError} onClick={()=>setScreen("company")}>{isIt?"Entra nell'azienda":"Enter the company"}<b>→</b></button>
          </div>
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
