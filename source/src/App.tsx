"use client";

import { useEffect, useState } from "react";
import { generateSummaryPptx } from "./generateSummaryPptx";
import type { Language, Profile, Screen, Market, EsgReadiness, SectorKey, Priority, Outcome, DFRating } from "./types";
import { copy } from "./copy";
import { energyModule, supplyChainModule, reportingModule, planningModule, frameworkModule } from "./modules";
import { defaultPriorities, missionCatalog, imageFor, SECTORS, SECTOR_KEYS, DF_REQUIREMENTS, RF_REQUIREMENTS, EF_REQUIREMENTS, SC_REQUIREMENTS, PL_REQUIREMENTS, FR_REQUIREMENTS, ESG_READINESS_IT, ESG_READINESS_EN } from "./constants";

export default function Home(){
  const [language,setLanguage]=useState<Language>("it"); const [profile,setProfile]=useState<Profile|null>(null); const [screen,setScreenState]=useState<Screen>("cover"); const [screenHistory,setScreenHistory]=useState<Screen[]>([]); const [priorities,setPriorities]=useState<Priority[]>(defaultPriorities); const [selectedMission,setSelectedMission]=useState(0); const [negativeChoice,setNegativeChoice]=useState<"form"|"postpone">("form"); const [pendingOutcome,setPendingOutcome]=useState<Outcome>("positive"); const [missionParameters,setMissionParameters]=useState<Record<number,string[]>>({}); const [missionOutcomes,setMissionOutcomes]=useState<Record<number,Outcome>>({}); const [missionOrder,setMissionOrder]=useState<number[]>([0,3,5,2,1,4]); const [trustScore,setTrustScore]=useState(30); const [approachBiz,setApproachBiz]=useState(""); const [approachData,setApproachData]=useState(""); const [contactEmail,setContactEmail]=useState(""); const [asIsRatings,setAsIsRatings]=useState<Record<number,("alto"|"medio"|"basso")[]>>({});
  const [companyName,setCompanyName]=useState("");
  const [companySector,setCompanySector]=useState<SectorKey>("manifatturiero");
  const [companyMarket,setCompanyMarket]=useState<Market>("mondo");
  const [esgReadiness,setEsgReadiness]=useState<EsgReadiness>("primi");
  const [companyDims,setCompanyDims]=useState<[number,number,number,number,number]>([100,3,5,1,500]);
  const [geoDistrib,setGeoDistrib]=useState<Record<string,number>>({italia:70,europa:30,asia:0,nordamerica:0,sudamerica:0,africa:0,australia:0});
  const updateCompanyDim=(i:number,v:number)=>{const next=[...companyDims] as [number,number,number,number,number];next[i]=v;setCompanyDims(next);};
  type DataNeedItem={id:string,priority:Priority,label:string};
  const buildDefaultDataNeeds=(lang:"it"|"en",prioOrder:Priority[]):DataNeedItem[]=>{
    const needs=copy[lang].priorityDataNeeds as Record<Priority,{id:string,label:string}[]>;
    return prioOrder.flatMap(p=>(needs[p]||[]).map(n=>({id:n.id,priority:p,label:n.label})));
  };
  const [dataNeeds,setDataNeeds]=useState<DataNeedItem[]>(()=>buildDefaultDataNeeds("it",defaultPriorities));
  const [topNNeeds,setTopNNeeds]=useState(10);
  const [needRelevance,setNeedRelevance]=useState<Record<string,number>>({});
  const [needCriticality,setNeedCriticality]=useState<Record<string,number>>({});
  const [focusMinR,setFocusMinR]=useState(1);
  const [focusMinC,setFocusMinC]=useState(1);
  const [hoveredPriority,setHoveredPriority]=useState<Priority|null>(null);
  const [pmMissionFilter,setPmMissionFilter]=useState<number|null>(null);
  const [pmFromBriefing,setPmFromBriefing]=useState(false);
  const [pmSelected,setPmSelected]=useState<{id:string,label:string,rel:number,crit:number,color:string}|null>(null);
  const [dfRatings,setDfRatings]=useState<Record<string,DFRating>>(()=>Object.fromEntries(DF_REQUIREMENTS.map(r=>[r.id,"low" as DFRating])));
  const setDfRating=(id:string,val:DFRating)=>setDfRatings(prev=>({...prev,[id]:val}));
  const [rfRatings,setRfRatings]=useState<Record<string,DFRating>>(()=>Object.fromEntries(RF_REQUIREMENTS.map(r=>[r.id,"low" as DFRating])));
  const setRfRating=(id:string,val:DFRating)=>setRfRatings(prev=>({...prev,[id]:val}));
  const [efRatings,setEfRatings]=useState<Record<string,DFRating>>(()=>Object.fromEntries(EF_REQUIREMENTS.map(r=>[r.id,"low" as DFRating])));
  const setEfRating=(id:string,val:DFRating)=>setEfRatings(prev=>({...prev,[id]:val}));
  const [scRatings,setScRatings]=useState<Record<string,DFRating>>(()=>Object.fromEntries(SC_REQUIREMENTS.map(r=>[r.id,"low" as DFRating])));
  const setScRating=(id:string,val:DFRating)=>setScRatings(prev=>({...prev,[id]:val}));
  const [plRatings,setPlRatings]=useState<Record<string,DFRating>>(()=>Object.fromEntries(PL_REQUIREMENTS.map(r=>[r.id,"low" as DFRating])));
  const setPlRating=(id:string,val:DFRating)=>setPlRatings(prev=>({...prev,[id]:val}));
  const [frRatings,setFrRatings]=useState<Record<string,DFRating>>(()=>Object.fromEntries(FR_REQUIREMENTS.map(r=>[r.id,"low" as DFRating])));
  const setFrRating=(id:string,val:DFRating)=>setFrRatings(prev=>({...prev,[id]:val}));
  const [needIncluded,setNeedIncluded]=useState<Record<string,boolean>>(()=>{
    const init:Record<string,boolean>={};
    buildDefaultDataNeeds("it",defaultPriorities).forEach((n)=>{init[n.id]=false;});
    return init;
  });
  const [pdHelpOpen,setPdHelpOpen]=useState(false);
  const toggleNeedIncluded=(id:string)=>setNeedIncluded(prev=>({...prev,[id]:!prev[id]}));
  const isNeedIncluded=(id:string)=>needIncluded[id]??false;
  const [dfFocusId,setDfFocusId]=useState<string|null>(null);
  const [priorityIncluded,setPriorityIncluded]=useState<Record<Priority,boolean>>({credit:true,compliance:true,customers:true,efficiency:true,supply:true,reputation:true});
  const [esgStrategistUnlocked,setEsgStrategistUnlocked]=useState(false);
  const togglePriorityIncluded=(p:Priority)=>setPriorityIncluded(prev=>({...prev,[p]:!prev[p]}));
  const [prioExperience,setPrioExperience]=useState<Record<Priority,string>>({credit:"",compliance:"",customers:"",efficiency:"",supply:"",reputation:""});
  const [prioExpModal,setPrioExpModal]=useState<Priority|null>(null);
  const [prioExpSelected,setPrioExpSelected]=useState<Record<Priority,number>>({credit:-1,compliance:-1,customers:-1,efficiency:-1,supply:-1,reputation:-1});
  const prioDefaultExp:Record<Priority,Record<"it"|"en",[string,string,string]>>={
    credit:{
      it:[
        "Le banche ci chiedono sempre più spesso dati ESG strutturati per rinnovare le linee di credito. Negli ultimi 18 mesi abbiamo ricevuto richieste di rating ESG da 3 istituti diversi. Senza dati verificabili rischiamo condizioni peggiorative sui finanziamenti.",
        "Stiamo lavorando a un'emissione di green bond. Il lead arranger ci ha già richiesto un framework ESG verificabile con dati storici su emissioni ed energia. Non abbiamo ancora un sistema capace di produrre questo livello di evidenza.",
        "Il nostro rating ESG esterno è peggiorato nell'ultimo ciclo di valutazione. Gli analisti ci hanno segnalato la mancanza di dati Scope 2 disaggregati per sede e l'assenza di un processo di assurance. Questo impatta il costo del debito."
      ],
      en:[
        "Banks increasingly ask for structured ESG data to renew credit lines. In the last 18 months we received ESG rating requests from 3 different institutions. Without verifiable data we risk worse financing conditions.",
        "We are working on a green bond issuance. The lead arranger has already asked for a verifiable ESG framework with historical data on emissions and energy. We do not yet have a system capable of producing this level of evidence.",
        "Our external ESG rating worsened in the last assessment cycle. Analysts flagged the lack of disaggregated Scope 2 data by site and the absence of an assurance process. This is affecting our cost of debt."
      ]
    },
    compliance:{
      it:[
        "La CSRD ci tocca direttamente: siamo in scope dal 2026. Il team ESG oggi raccoglie dati manualmente da 8 sistemi diversi e impiega 14 settimane per chiudere il report annuale. Abbiamo bisogno di un sistema unico e auditabile.",
        "Abbiamo ricevuto i primi rilievi dall'auditor ESG: le catene di evidenza per i dati di Scope 1 e 2 non sono ricostruibili in modo indipendente. Se non risolviamo prima del prossimo ciclo rischiamo un'opinione con riserva.",
        "Il nostro settore è sotto osservazione da parte di ESMA per il rischio di greenwashing. Il Compliance Officer ha chiesto al team ESG di dimostrare che ogni dato pubblicato è tracciabile fino alla fonte primaria. Oggi non siamo in grado di farlo."
      ],
      en:[
        "CSRD applies to us directly: we're in scope from 2026. The ESG team today collects data manually from 8 different systems and takes 14 weeks to close the annual report. We need a single, auditable system.",
        "We received the first findings from the ESG auditor: the evidence chains for Scope 1 and 2 data cannot be independently reconstructed. If we don't resolve this before the next cycle we risk a qualified opinion.",
        "Our sector is under scrutiny from ESMA for greenwashing risk. The Compliance Officer has asked the ESG team to demonstrate that every published data point is traceable to its primary source. Today we cannot do that."
      ]
    },
    customers:{
      it:[
        "Tre dei nostri top-10 clienti ci hanno già inviato questionari ESG per la qualifica fornitori. Uno di essi ha inserito soglie minime di performance ambientale nei contratti 2024. Rischiamo di perdere gare se non dimostriamo dati credibili.",
        "Un grande retailer europeo ci ha notificato che dal 2025 tutti i fornitori dovranno dichiarare le emissioni Scope 3 cat. 1 con dati specifici per prodotto. Oggi lavoriamo con stime spend-based che non soddisfano questo requisito.",
        "Siamo entrati nella shortlist per una gara pubblica da €15M. Il capitolato prevede un punteggio tecnico ESG con peso del 20%. Non abbiamo documentazione strutturata per rispondere ai criteri ambientali richiesti."
      ],
      en:[
        "Three of our top-10 customers have already sent us ESG questionnaires for supplier qualification. One of them introduced minimum environmental performance thresholds in 2024 contracts. We risk losing tenders without credible data.",
        "A large European retailer has notified us that from 2025 all suppliers must declare Scope 3 cat. 1 emissions with product-specific data. Today we work with spend-based estimates that do not meet this requirement.",
        "We have been shortlisted for a €15M public tender. The specification includes a technical ESG score with a 20% weighting. We have no structured documentation to respond to the required environmental criteria."
      ]
    },
    efficiency:{
      it:[
        "I costi energetici rappresentano il 18% del costo di produzione. Nel 2023 abbiamo perso €2,1M per la volatilità dei prezzi dell'energia. Abbiamo avviato alcuni progetti di efficienza ma non riusciamo a misurarne il ritorno in modo sistematico.",
        "Abbiamo installato pannelli fotovoltaici e sostituito i compressori negli ultimi due anni. Non siamo però in grado di quantificare i risparmi reali stabilimento per stabilimento: i dati dei contatori non sono integrati in nessun sistema centrale.",
        "Il CFO ha chiesto un piano di decarbonizzazione con NPV e payback per ogni iniziativa. Non disponiamo di una baseline energetica affidabile per sito, né di un sistema che aggreghi consumi, costi e produzioni per calcolare l'intensità emissiva."
      ],
      en:[
        "Energy costs represent 18% of production cost. In 2023 we lost €2.1M due to energy price volatility. We have started some efficiency projects but cannot measure their return systematically.",
        "We have installed photovoltaic panels and replaced compressors over the last two years. However we cannot quantify the actual savings plant by plant: meter data is not integrated into any central system.",
        "The CFO has asked for a decarbonisation plan with NPV and payback for each initiative. We do not have a reliable energy baseline by site, nor a system that aggregates consumption, costs and production to calculate emission intensity."
      ]
    },
    supply:{
      it:[
        "Scope 3 cat. 1 e 2 valgono il 65% della nostra impronta totale. I principali fornitori non inviano dati strutturati: riceviamo PDF e allegati e-mail che non riusciamo a riconciliare. Un cliente chiave ci ha già chiesto un piano di riduzione Scope 3.",
        "Abbiamo 340 fornitori attivi. Per i 50 più rilevanti vorremmo raccogliere dati primari sulle emissioni, ma oggi mandiamo questionari in PDF via e-mail con un tasso di risposta inferiore al 40% e dati non confrontabili tra loro.",
        "Stiamo preparando il bilancio di sostenibilità per la prima volta. La sezione Scope 3 è la più critica: le categorie acquisti, trasporti e uso dei prodotti rappresentano oltre il 70% delle emissioni ma non abbiamo un processo strutturato per raccogliere questi dati."
      ],
      en:[
        "Scope 3 cat. 1 and 2 account for 65% of our total footprint. Key suppliers don't send structured data: we receive PDFs and email attachments we can't reconcile. A key customer has already asked us for a Scope 3 reduction plan.",
        "We have 340 active suppliers. For the 50 most relevant ones we want to collect primary emissions data, but today we send PDF questionnaires by email with a response rate below 40% and data that is not comparable across suppliers.",
        "We are preparing our first sustainability report. The Scope 3 section is the most critical: purchased goods, transport and product use categories account for over 70% of emissions but we have no structured process to collect this data."
      ]
    },
    reputation:{
      it:[
        "Il turnover dei profili ESG, sustainability e HSE è raddoppiato negli ultimi 2 anni. I candidati chiedono sistematicamente se disponiamo di strumenti professionali per la gestione della sostenibilità. La reputazione ESG è diventata un fattore di retention.",
        "Abbiamo perso tre candidati senior in favore di competitor che comunicano obiettivi di Net Zero con dati verificabili. Il nostro employer branding ESG è percepito come generico. I neolaureati STEM chiedono di vedere metriche reali prima di accettare un'offerta.",
        "Il CdA ha approvato un obiettivo pubblico di Net Zero al 2040. Non disponiamo però di un sistema che monitori l'avanzamento delle iniziative di decarbonizzazione e dimostri ai nostri stakeholder che stiamo rispettando il piano."
      ],
      en:[
        "Turnover of ESG, sustainability and HSE profiles has doubled in the last 2 years. Candidates systematically ask whether we have professional sustainability management tools. ESG reputation has become a retention factor.",
        "We have lost three senior candidates to competitors who communicate Net Zero targets with verifiable data. Our ESG employer branding is perceived as generic. STEM graduates ask to see real metrics before accepting an offer.",
        "The Board has approved a public Net Zero target for 2040. However we do not have a system that monitors progress on decarbonisation initiatives and demonstrates to our stakeholders that we are on track."
      ]
    }
  };
  const [userName,setUserName]=useState("");
  const [questName,setQuestName]=useState("");
  const getSavedQuestKeys=():string[]=>{const keys:string[]=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k?.startsWith("envizi-quest-save-"))keys.push(k.replace("envizi-quest-save-",""));}return keys.sort();};
  const saveQuest=(name:string)=>{if(!name.trim())return;const data={userName,language,profile,priorities,missionOrder,missionOutcomes,missionParameters,trustScore,companyName,companySector,companyDims,companyMarket,geoDistrib,esgReadiness,asIsRatings,dataNeeds,screen};localStorage.setItem(`envizi-quest-save-${name.trim()}`,JSON.stringify(data));};
  const loadQuest=(name:string)=>{const raw=localStorage.getItem(`envizi-quest-save-${name}`);if(!raw)return;try{const d=JSON.parse(raw);if(d.userName)setUserName(d.userName);if(d.language)setLanguage(d.language);if(d.profile)setProfile(d.profile);if(d.priorities)setPriorities(d.priorities);if(d.missionOrder)setMissionOrder(d.missionOrder);if(d.missionOutcomes)setMissionOutcomes(d.missionOutcomes);if(d.missionParameters)setMissionParameters(d.missionParameters);if(d.trustScore!=null)setTrustScore(d.trustScore);if(d.companyName!=null)setCompanyName(d.companyName);if(d.companySector)setCompanySector(d.companySector);if(d.companyDims)setCompanyDims(d.companyDims);if(d.companyMarket)setCompanyMarket(d.companyMarket);if(d.geoDistrib)setGeoDistrib(d.geoDistrib);if(d.esgReadiness)setEsgReadiness(d.esgReadiness);if(d.asIsRatings)setAsIsRatings(d.asIsRatings);if(d.dataNeeds)setDataNeeds(d.dataNeeds);setQuestName(name);if(d.screen)setScreenState(d.screen);}catch(e){}};
  const deleteQuest=(name:string)=>{localStorage.removeItem(`envizi-quest-save-${name}`);};
  const downloadQuest=(name:string)=>{
    const raw=localStorage.getItem(`envizi-quest-save-${name}`);
    if(!raw)return;
    const blob=new Blob([raw],{type:"application/json"});
    const filename=`${name}.envizi-quest`;
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download=filename;a.click();
    URL.revokeObjectURL(url);
  };
  const uploadQuestFile=(file:File,overrideName?:string)=>{
    const reader=new FileReader();
    reader.onload=e=>{
      try{
        const d=JSON.parse(e.target?.result as string);
        const key=overrideName||(d.questName||file.name.replace(/\.envizi-quest$/,"").replace(/\.json$/,""));
        if(!key.trim())return;
        if(overrideName===undefined&&userName.trim())d.userName=userName.trim();
        localStorage.setItem(`envizi-quest-save-${key.trim()}`,JSON.stringify(d));
        setScreenState("cover");setTimeout(()=>setScreenState("welcome"),10);
      }catch(err){}
    };
    reader.readAsText(file);
  };
  const openUploadPicker=async()=>{
    // File System Access API — apre dialogo con scelta cartella
    if(typeof (window as any).showOpenFilePicker==="function"){
      try{
        const [handle]=await (window as any).showOpenFilePicker({
          types:[{description:"Envizi Quest",accept:{"application/json":[".envizi-quest",".json"]}}],
          multiple:false
        });
        const file=await handle.getFile();
        uploadQuestFile(file);
        return;
      }catch(e){/* annullato o non supportato */}
    }
    // Fallback: click sull'input nascosto
    document.getElementById("welcomeUploadInput")?.click();
  };
  useEffect(()=>{setDataNeeds(buildDefaultDataNeeds(language,priorities));},[language,priorities]);
  const moveNeed=(index:number,direction:-1|1)=>{const next=[...dataNeeds];const target=index+direction;if(target<0||target>=next.length)return;[next[index],next[target]]=[next[target],next[index]];setDataNeeds(next);};
  const rankNeed=(fromIdx:number,toRank:number)=>{const clamped=Math.max(1,Math.min(dataNeeds.length,toRank));const toIdx=clamped-1;if(toIdx===fromIdx)return;const next=[...dataNeeds];const [item]=next.splice(fromIdx,1);next.splice(toIdx,0,item);setDataNeeds(next);};
  // rank within a priority group: fromIdx is the global index, toRank is 1-based within the group
  const rankNeedInGroup=(id:string,priority:Priority,toRank:number)=>{
    const groupIds=dataNeeds.filter(n=>n.priority===priority).map(n=>n.id);
    const groupSize=groupIds.length;
    const clamped=Math.max(1,Math.min(groupSize,toRank));
    const fromPos=groupIds.indexOf(id);
    if(fromPos===-1||fromPos===clamped-1)return;
    // rebuild flat array: extract item from its current global position, insert at target global position
    const next=[...dataNeeds];
    const fromGlobal=next.findIndex(n=>n.id===id);
    const [item]=next.splice(fromGlobal,1);
    // after removal, find where the target slot is among the same-priority items
    const targetId=groupIds.filter(gid=>gid!==id)[clamped-1];
    const toGlobal=targetId?next.findIndex(n=>n.id===targetId):next.findIndex(n=>n.priority===priority&&next.indexOf(n)>=0);
    const insertAt=toGlobal!==-1?toGlobal+(fromPos<clamped-1?1:0):next.length;
    next.splice(insertAt,0,item);
    setDataNeeds(next);
  };
  const rankPriority=(fromIdx:number,toRank:number)=>{const clamped=Math.max(1,Math.min(priorities.length,toRank));const toIdx=clamped-1;if(toIdx===fromIdx)return;const next=[...priorities];const [item]=next.splice(fromIdx,1);next.splice(toIdx,0,item);setPriorities(next);};
  const needIdToMission:Record<string,number>={
    // M0 — Data Foundation
    "credit-3":0, "compliance-4":0, "compliance-6":0, "compliance-7":0, "reputation-2":0, "reputation-6":0,
    // M1 — Energia
    "efficiency-1":1, "efficiency-2":1, "efficiency-3":1, "efficiency-4":1, "efficiency-6":1,
    // M2 — Supply Chain
    "supply-1":2, "supply-2":2, "supply-3":2, "supply-4":2, "supply-5":2, "supply-6":2, "supply-7":2,
    "customers-1":2, "customers-2":2, "customers-3":2,
    // M3 — Reporting e performance
    "credit-1":3, "credit-2":3, "compliance-1":3, "reputation-3":3, "reputation-7":3,
    "customers-5":3, "customers-6":3, "customers-7":3,
    // M4 — Net Zero
    "credit-4":4, "credit-6":4, "credit-7":4, "efficiency-5":4, "efficiency-7":4, "reputation-5":4,
    // M5 — Framework ESG e disclosure
    "compliance-2":5, "compliance-3":5, "compliance-5":5, "credit-5":5,
    "customers-4":5, "reputation-1":5, "reputation-4":5,
  };
  const needIdToCapability:Record<string,{it:string,en:string}>={
    // M0
    "credit-3":    {it:"Sistema di record centralizzato, record di dettaglio e audit trail Envizi",                                         en:"Centralised system of record, detail records and Envizi audit trail"},
    "compliance-4":{it:"Audit History, record di dettaglio, note e allegati Envizi",                                                        en:"Envizi Audit History, detail records, notes and attachments"},
    "compliance-6":{it:"Data Health Check, Monthly Data Summary, regole di validazione e alert",                                            en:"Data Health Check, Monthly Data Summary, validation rules and alerts"},
    "compliance-7":{it:"Audit report, allegati, report di dettaglio e accesso controllato in Envizi",                                       en:"Audit reports, attachments, detail reports and controlled access in Envizi"},
    "reputation-2":{it:"Social Metrics Account Styles, form e Surveys + Assessments",                                                       en:"Social Metrics Account Styles, forms and Surveys + Assessments"},
    "reputation-6":{it:"Surveys + Assessments con template, scoring, allegati e workflow",                                                  en:"Surveys + Assessments with templates, scoring, attachments and workflow"},
    // M1
    "efficiency-1":{it:"Interval Meter Analytics",                                                                                          en:"Interval Meter Analytics"},
    "efficiency-2":{it:"Utility Bill Analytics",                                                                                            en:"Utility Bill Analytics"},
    "efficiency-3":{it:"Regression modeling e KPI normalization di Utility Bill e Interval Meter Analytics",                                en:"Regression modelling and KPI normalisation in Utility Bill and Interval Meter Analytics"},
    "efficiency-4":{it:"Meter-based alerts di Interval Meter Analytics",                                                                    en:"Meter-based alerts in Interval Meter Analytics"},
    "efficiency-6":{it:"Utility performance management e analisi di intensità di Interval Meter Analytics",                                 en:"Utility performance management and intensity analytics in Interval Meter Analytics"},
    // M2
    "supply-1":    {it:"Supply Chain Intelligence per cat. 1; Scope 3 GHG Accounting per cat. 4",                                          en:"Supply Chain Intelligence for cat. 1; Scope 3 GHG Accounting for cat. 4"},
    "supply-2":    {it:"Surveys + Assessments e supplier engagement portal",                                                                en:"Surveys + Assessments and supplier engagement portal"},
    "supply-3":    {it:"Automated data capture di Supply Chain Intelligence da sistemi ERP e finanziari",                                   en:"Supply Chain Intelligence automated data capture from ERP and financial systems"},
    "supply-4":    {it:"Surveys + Assessments e dati ESG/risk insight raccolti con Supply Chain Intelligence",                              en:"Surveys + Assessments and ESG/risk insight data gathered via Supply Chain Intelligence"},
    "supply-5":    {it:"Workflow e Issues Management di Surveys + Assessments; piani da configurare",                                       en:"Workflow and Issues Management in Surveys + Assessments; plans to configure"},
    "supply-6":    {it:"Dashboard di supplier engagement e controlli di data quality di Supply Chain Intelligence",                         en:"Supplier engagement dashboards and data quality controls in Supply Chain Intelligence"},
    "supply-7":    {it:"Gerarchia dei metodi di calcolo e raccolta di emissioni corporate e PCF in Supply Chain Intelligence",              en:"Calculation method hierarchy and collection of corporate emissions and PCFs in Supply Chain Intelligence"},
    "customers-1": {it:"Scope 3 GHG Accounting; Supply Chain Intelligence per categorie 1 e 2",                                            en:"Scope 3 GHG Accounting; Supply Chain Intelligence for categories 1 and 2"},
    "customers-2": {it:"Surveys + Assessments e supplier engagement di Supply Chain Intelligence",                                          en:"Surveys + Assessments and supplier engagement in Supply Chain Intelligence"},
    "customers-3": {it:"Raccolta e gestione di PCF tramite Supply Chain Intelligence",                                                      en:"PCF collection and management via Supply Chain Intelligence"},
    // M3
    "credit-1":    {it:"Scope 1 & 2 e Scope 3 GHG Accounting + Reporting, alimentati dalla Data Foundation",                              en:"Scope 1 & 2 and Scope 3 GHG Accounting + Reporting, fed by the Data Foundation"},
    "credit-2":    {it:"PowerReports preconfigurati e dashboard personalizzabili",                                                          en:"Pre-configured PowerReports and customisable dashboards"},
    "compliance-1":{it:"Scope 1 & 2 e Scope 3 GHG Accounting + Reporting",                                                                en:"Scope 1 & 2 and Scope 3 GHG Accounting + Reporting"},
    "reputation-3":{it:"PowerReports, dashboard e analisi multi-periodo e multi-sede",                                                      en:"PowerReports, dashboards and multi-period and multi-site analytics"},
    "reputation-7":{it:"Survey Dataset e PowerReports personalizzabili basati su Power BI Embedded",                                       en:"Survey Dataset and customisable PowerReports based on Power BI Embedded"},
    "customers-5": {it:"PowerReports supporta il confronto se vengono forniti benchmark esterni",                                           en:"PowerReports supports comparison where external benchmarks are provided"},
    "customers-6": {it:"PowerReports personalizzabili con filtri per gruppo, sede, periodo e indicatore",                                   en:"Customisable PowerReports with filters by group, site, period and indicator"},
    "customers-7": {it:"Market-based Emissions PowerReport e Scope 1 & 2 GHG Accounting",                                                  en:"Market-based Emissions PowerReport and Scope 1 & 2 GHG Accounting"},
    // M4
    "credit-4":    {it:"Envizi produce KPI, target e scenari a supporto; rating e peer comparison restano esterni",                        en:"Envizi produces supporting KPIs, targets and scenarios; rating and peer comparison remain external"},
    "credit-6":    {it:"Scenario Modeler e Envizi Planning Analytics AddOn",                                                               en:"Scenario Modeler and Envizi Planning Analytics AddOn"},
    "credit-7":    {it:"Sustainability Program Tracking con impatto finanziario, IRR, NPV e risparmi attesi",                               en:"Sustainability Program Tracking with financial impact, IRR, NPV and expected savings"},
    "efficiency-5":{it:"Target Setting + Tracking, dashboard e PowerReports",                                                              en:"Target Setting + Tracking, dashboards and PowerReports"},
    "efficiency-7":{it:"Sustainability Program Tracking e Scenario Modeler per costi, risparmi ed emissioni",                              en:"Sustainability Program Tracking and Scenario Modeler for costs, savings and emissions"},
    "reputation-5":{it:"Target Setting + Tracking, Sustainability Program Tracking e PowerReports",                                        en:"Target Setting + Tracking, Sustainability Program Tracking and PowerReports"},
    // M5
    "compliance-2":{it:"Sustainability Reporting Manager",                                                                                  en:"Sustainability Reporting Manager"},
    "compliance-3":{it:"Framework Library di Sustainability Reporting Manager",                                                             en:"Sustainability Reporting Manager Framework Library"},
    "compliance-5":{it:"Materiality e gap tags in Sustainability Reporting Manager; valutazione non automatica",                            en:"Materiality and gap tags in Sustainability Reporting Manager; assessment not automated"},
    "credit-5":    {it:"Framework Library e workflow di Sustainability Reporting Manager",                                                  en:"Sustainability Reporting Manager Framework Library and workflow"},
    "customers-4": {it:"Risposte, evidenze ed export di Sustainability Reporting Manager; non è un modulo dedicato alle gare",              en:"Sustainability Reporting Manager responses, evidence and exports; not a dedicated tender module"},
    "reputation-1":{it:"Sustainability Reporting Manager + PowerReports personalizzabili",                                                  en:"Sustainability Reporting Manager + customisable PowerReports"},
    "reputation-4":{it:"Export di risposte e report; pubblicazione tramite strumenti esterni",                                             en:"Export of responses and reports; publication via external tools"},
  };
  const missionBadgeLabel=["M0","M1","M2","M3","M4","M5"];
  const topNeeds=dataNeeds.filter(n=>isNeedIncluded(n.id)).map((n,i)=>({...n,rank:i+1}));
  const needsByMissionHub:[number,typeof topNeeds][]=[0,1,2,3,4,5].map(mi=>[mi,topNeeds.filter(n=>(needIdToMission[n.id]??0)===mi)]);
  const focusedNeeds=topNeeds.filter(n=>{const rel=Math.min(needRelevance[n.id]??5,10);const relNorm=rel;const crit=needCriticality[n.id]??5;return relNorm>=focusMinR&&crit>=focusMinC;});
  const needsByMissionHubFocused:[number,typeof topNeeds][]=[0,1,2,3,4,5].map(mi=>[mi,focusedNeeds.filter(n=>(needIdToMission[n.id]??0)===mi)]);
  const t={...copy[language],successText:copy[language].successTextUpdated,negativeTitle:copy[language].formTitleUpdated,negativeText:copy[language].formTextUpdated,postponeTitle:copy[language].asIsTitleUpdated,postponeText:copy[language].asIsTextUpdated,impact:copy[language].impactUpdated}; const name=profile==="marco"?"Marco Rossi":"Luisa Bianchi";
  const displayCompanyName=companyName.trim()||( language==="it"?"La tua azienda":"Your company");
  useEffect(()=>{localStorage.removeItem("envizi-quest-roadmap");localStorage.removeItem("envizi-quest-mission-order");localStorage.removeItem("envizi-quest-mission-parameters");localStorage.removeItem("envizi-quest-trust-score");localStorage.removeItem("envizi-quest-priorities");localStorage.removeItem("envizi-quest-profile");localStorage.removeItem("envizi-quest-mission");},[]);
  const setScreen=(next:Screen)=>{if(next===screen)return;setScreenHistory(history=>[...history,screen]);setScreenState(next)};
  const goBack=()=>{if(!screenHistory.length)return;setScreenState(screenHistory[screenHistory.length-1]);setScreenHistory(screenHistory.slice(0,-1))};
  const start=()=>{if(!profile)return;localStorage.setItem("envizi-quest-profile",JSON.stringify({language,profile}));setScreen("approach")};
  const reset=()=>{setScreenState("onboarding");setScreenHistory([]);setProfile(null);setTrustScore(30);localStorage.removeItem("envizi-quest-trust-score")};
  useEffect(()=>{let button=document.getElementById("envizi-global-back") as HTMLButtonElement|null;if(!button){button=document.createElement("button");button.id="envizi-global-back";button.className="globalBack";button.type="button";document.body.appendChild(button)}button.innerHTML=`← <span>${language==="it"?"Indietro":"Back"}</span>`;button.disabled=!screenHistory.length;button.setAttribute("aria-label",language==="it"?"Torna alla pagina precedente":"Go back one page");const handleBack=()=>goBack();button.addEventListener("click",handleBack);return()=>button?.removeEventListener("click",handleBack)},[language,screenHistory]);
  useEffect(()=>()=>{document.getElementById("envizi-global-back")?.remove()},[]);
  useEffect(()=>{let badge=document.getElementById("envizi-bob-badge");if(!badge){badge=document.createElement("div");badge.id="envizi-bob-badge";badge.className="bobBadge";badge.innerHTML=`<img src="./ibm-bob-logo.svg" alt="IBM Bob"/><span>Sviluppato con IBM Bob</span>`;document.body.appendChild(badge)}return()=>{};},[]);
  useEffect(()=>()=>{document.getElementById("envizi-bob-badge")?.remove()},[]);
  const ALL_SCREENS:Screen[]=["cover","welcome","onboarding","approach","chapterMap","questIntro","blank1","p10Slideshow","approachIntro","approachSteps","approachData","approachDecisions","approachRoadmap","approachTrust","approachReport","intro","separatorNext","approachStepsCopy","companySetup","company","priorities","approachDataCopy","priorityData","priorityMatrix","chapterOneSummary","esgStrategist","challengeSeparator1","missionCard1","introCopy","roadmapPreview","bridge","missions","briefing","missionIntro","introCopy2","asis","compare","trust","tobe","negative","success","milestone","dataFoundation","dfConclusion","challengeComplete1","challengeSeparator2","missionCard2","energyFoundation","energyConclusion","challengeComplete2","challengeSeparator3","missionCard3","supplyFoundation","supplyConclusion","challengeComplete3","challengeSeparator4","missionCard4","planningFoundation","planningConclusion","challengeComplete4","challengeSeparator5","missionCard5","frameworkFoundation","frameworkConclusion","challengeComplete5","challengeSeparator6","missionCard6","reportingFoundation","reportingConclusion","challengeComplete6","summary","nextStep","thankYou"];
  const currentPageNum=ALL_SCREENS.indexOf(screen)+1||1;
  useEffect(()=>{let el=document.getElementById("envizi-page-num");if(!el){el=document.createElement("div");el.id="envizi-page-num";el.className="pageNum";document.body.appendChild(el)}el.textContent=`${String(currentPageNum).padStart(2,"0")} · ${screen}`;el.style.display="flex";},[screen,currentPageNum]);
  useEffect(()=>()=>{document.getElementById("envizi-page-num")?.remove()},[]);

  const [saveBtnOpen,setSaveBtnOpen]=useState(false);
  const [p10SlideIdx,setP10SlideIdx]=useState(0);
  const P10_SLIDES_IT=["./p10-slide-1.png","./p10-slide-2.png","./p10-slide-3.png","./p10-slide-4.png","./p10-slide-5.png","./p10-slide-6.png","./p10-slide-7.png"];
  const P10_SLIDES_EN=["./p10-slide-en-1.png","./p10-slide-en-2.png","./p10-slide-en-3.png","./p10-slide-en-4.png","./p10-slide-en-5.png","./p10-slide-en-6.png","./p10-slide-en-7.png"];
  const P10_SLIDES=language==="it"?P10_SLIDES_IT:P10_SLIDES_EN;
  // 0 = mostra Sì/No iniziale  1 = mostra Sicuro?  2 = confermato definitivamente
  const [csrdConfirmStep,setCsrdConfirmStep]=useState<0|1|2>(0);
  const [csrdPendingChoice,setCsrdPendingChoice]=useState<boolean>(false); // true=soggetta, false=non soggetta
  const [csrdNote,setCsrdNote]=useState("");
  const [csrdNoteOpen,setCsrdNoteOpen]=useState(false);
  const [csrdNoteDraft,setCsrdNoteDraft]=useState("");
  const [prioExpMode,setPrioExpMode]=useState<"scratch"|"scenario">("scratch");
  const [saveBtnName,setSaveBtnName]=useState(questName);
  const renderSaveBtn=(isIt:boolean)=>{
    if(!saveBtnOpen)return <button className="saveBtnTrigger" onClick={()=>setSaveBtnOpen(true)}>{isIt?"💾 Salva progressi":"💾 Save progress"}</button>;
    return <div className="saveBtnBox">
      <input className="saveBtnInput" type="text" placeholder={isIt?"Nome sessione...":"Session name..."} value={saveBtnName} onChange={e=>setSaveBtnName(e.target.value)}/>
      <button className="saveBtnConfirm" onClick={()=>{saveQuest(saveBtnName);setQuestName(saveBtnName);setSaveBtnOpen(false);}} disabled={!saveBtnName.trim()}>{isIt?"Salva":"Save"}</button>
      <button className="saveBtnCancel" onClick={()=>setSaveBtnOpen(false)}>✕</button>
    </div>;
  };
  const move=(index:number,direction:-1|1)=>{const next=[...priorities];const target=index+direction;if(target<0||target>=next.length)return;[next[index],next[target]]=[next[target],next[index]];setPriorities(next)};
  const saveOutcome=(outcome:Outcome)=>{const next={...missionOutcomes,[selectedMission]:outcome};setMissionOutcomes(next);localStorage.setItem("envizi-quest-roadmap",JSON.stringify(next))};
  const moveMission=(position:number,direction:-1|1)=>{const target=position+direction;if(target<0||target>=missionOrder.length)return;const next=[...missionOrder];[next[position],next[target]]=[next[target],next[position]];setMissionOrder(next);localStorage.setItem("envizi-quest-mission-order",JSON.stringify(next))};
  const updateParameter=(index:number,value:string)=>{const values=[...(missionParameters[selectedMission]||["","","",""])];values[index]=value;const next={...missionParameters,[selectedMission]:values};setMissionParameters(next);localStorage.setItem("envizi-quest-mission-parameters",JSON.stringify(next))};
  const extractMetricDefault=(metric:string):string=>{const m=metric.replace(/[€,]/g,"").match(/[\d]+(?:[.,]\d+)?/);return m?m[0].replace(",","."):"";};
  useEffect(()=>{if(screen==="asis"&&!missionParameters[selectedMission]?.some(v=>v)){const items=active.asIsItems;const defaults=items.map(item=>extractMetricDefault(item.metric));const next={...missionParameters,[selectedMission]:defaults};setMissionParameters(next);}},[screen,selectedMission]);
  const trustGainByOutcome=(outcome:Outcome,missionIndex?:number)=>{if(missionIndex===0&&outcome==="positive")return 25;return outcome==="positive"?15:outcome==="warning"?7:0;};
  const calculatedTrustScore=Object.entries(missionOutcomes).reduce((total,[mi,o])=>total+trustGainByOutcome(o as Outcome,Number(mi)),30);
  const trustColor=trustScore>=50?"#39efb4":trustScore>=20?"#ffc07c":"#ff7777";
  const renderTrustBar=()=><div className="trustBar"><span className="trustBarLabel">{t.trustLabel}</span><div className="trustBarTrack"><div className="trustBarFill" style={{width:`${trustScore}%`,background:trustColor}}/></div><span className="trustBarValue" style={{color:trustColor}}>{trustScore}<small>/100</small></span></div>;
  const handleDecision=(outcome:Outcome)=>{const nextOutcomes={...missionOutcomes,[selectedMission]:outcome};saveOutcome(outcome);const nextTrust=Math.min(100,Object.entries(nextOutcomes).reduce((total,[mi,o])=>total+trustGainByOutcome(o as Outcome,Number(mi)),30));setTrustScore(nextTrust);localStorage.setItem("envizi-quest-trust-score",String(nextTrust));if(outcome!=="positive")setNegativeChoice(outcome==="warning"?"form":"postpone");setPendingOutcome(outcome);setScreenHistory(["compare"]);setScreenState("trust")};
  const energy=energyModule[language];
  const supply=supplyChainModule[language];
  const reporting=reportingModule[language];
  const planning=planningModule[language];
  const framework=frameworkModule[language];
  const scenario=selectedMission===1?energy:selectedMission===2?supply:selectedMission===3?reporting:selectedMission===4?planning:selectedMission===5?framework:null;
  const active={briefing:scenario?.briefing||t.briefing,objectiveText:scenario?.objectiveText||t.objectiveText,asIsTitle:scenario?.asIsTitle||t.asIsTitle,asIsIntro:scenario?.asIsIntro||t.asIsIntro,asIsItems:scenario?.asIsItems||t.asIsItems,decisionIntro:scenario?.decisionIntro||t.decisionIntro,optionA:scenario?.optionA||t.optionA,optionADetail:scenario?.optionADetail||t.optionADetail,optionB:scenario?.optionB||t.optionB,optionBDetail:scenario?.optionBDetail||t.optionBDetail,optionC:scenario?.optionC||t.optionC,optionCDetail:scenario?.optionCDetail||t.optionCDetail,successTitle:scenario?.successTitle||t.successTitle,successText:scenario?.successText||t.successText,warningTitle:scenario?.warningTitle||t.negativeTitle,warningText:scenario?.warningText||t.negativeText,criticalTitle:scenario?.criticalTitle||t.postponeTitle,criticalText:scenario?.criticalText||t.postponeText,metricLabels:scenario?.metricLabels||[t.dataQuality,t.reportingTime,t.confidence],enviziValue:selectedMission===1?(language==="it"?"VALORE ENVIZI SBLOCCATO · ENERGY ANALYTICS":"ENVIZI VALUE UNLOCKED · ENERGY ANALYTICS"):selectedMission===2?supply.enviziValue:selectedMission===3?reporting.enviziValue:selectedMission===4?planning.enviziValue:selectedMission===5?framework.enviziValue:t.enviziValue};
  const defaultUnits=language==="it"?["fonti","ore/mese","% errori","settimane"]:["sources","hrs/month","% errors","weeks"];
  const parameterUnits=scenario?.units||defaultUnits;
  const resultValues=scenario?(screen==="success"?scenario.positiveValues:negativeChoice==="form"?scenario.warningValues:scenario.criticalValues):screen==="success"?["+34%","−62%","92/100"]:negativeChoice==="form"?["+8%","−12%","58/100"]:language==="it"?["INVARIATA","INVARIATO","BASSA · INVARIATA"]:["UNCHANGED","UNCHANGED","LOW · UNCHANGED"];
  const decisionLabel=(missionIndex:number,outcome:Outcome)=>missionIndex===1?energy.decisionLabels[outcome]:missionIndex===2?supply.decisionLabels[outcome]:missionIndex===3?reporting.decisionLabels[outcome]:missionIndex===4?planning.decisionLabels[outcome]:missionIndex===5?framework.decisionLabels[outcome]:t.decisionLabels[outcome];
  const outcomeLabel=(missionIndex:number,outcome:Outcome)=>missionIndex===1?energy.outcomeLabels[outcome]:missionIndex===2?supply.outcomeLabels[outcome]:missionIndex===3?reporting.outcomeLabels[outcome]:missionIndex===4?planning.outcomeLabels[outcome]:missionIndex===5?framework.outcomeLabels[outcome]:t.outcomeLabels[outcome];
  const missionItems=(missionIndex:number)=>missionIndex===1?energy.asIsItems:missionIndex===2?supply.asIsItems:missionIndex===3?reporting.asIsItems:missionIndex===4?planning.asIsItems:missionIndex===5?framework.asIsItems:t.asIsItems;
  const missionUnits=(missionIndex:number)=>missionIndex===1?energy.units:missionIndex===2?supply.units:missionIndex===3?reporting.units:missionIndex===4?planning.units:missionIndex===5?framework.units:defaultUnits;
  type TrustIntroEntry={it:string,en:string,sources?:{label:string,url:string}[]};
  const trustIntroByMission:Record<number,TrustIntroEntry>={
    0:{it:"Una base dati auditabile è il fondamento della credibilità ESG. Il CdA e i finanziatori valutano la solidità del dato prima ancora dei numeri: un sistema verificabile trasforma le dichiarazioni in evidenza.",en:"An auditable data foundation is the bedrock of ESG credibility. The Board and financiers assess data integrity before the numbers themselves: a verifiable system turns declarations into evidence."},
    1:{it:"L'energy management è la prova tangibile che l'azienda sta investendo attivamente nella decarbonizzazione. Per il CdA, i dati energetici strutturati dimostrano al contempo impegno climatico e disciplina sui costi operativi.",en:"Energy management is tangible proof that the company is actively investing in decarbonisation. For the Board, structured energy data simultaneously demonstrates climate commitment and operational cost discipline."},
    2:{it:"La copertura dello Scope 3 e il coinvolgimento della supply chain sono oggi indicatori chiave per investitori e clienti. Un inventario credibile della catena del valore segnala governance responsabile e riduce il rischio reputazionale.",en:"Scope 3 coverage and supply-chain engagement are now key indicators for investors and customers. A credible value-chain inventory signals responsible governance and reduces reputational risk."},
    3:{
      it:"Un inventario GHG coerente, trasparente e tracciabile aumenta la fiducia nei dati presentati a CdA, banche, clienti e auditor. La possibilità di confrontare Scope 1, 2 e 3 nel tempo, individuare gli hotspot emissivi e risalire dalle dashboard ai dati e alle metodologie sottostanti rende le performance ESG più comprensibili e difendibili.\n\nAl contrario, report ricostruiti manualmente, KPI non confrontabili e viste diverse tra i vari stakeholder generano dubbi sulla qualità delle informazioni e sulla capacità dell'azienda di governare concretamente i propri obiettivi climatici.",
      en:"A consistent, transparent and traceable GHG inventory increases confidence in the data presented to the Board, banks, clients and auditors. The ability to compare Scope 1, 2 and 3 over time, identify emission hotspots and trace back from dashboards to the underlying data and methodologies makes ESG performance more understandable and defensible.\n\nConversely, manually reconstructed reports, non-comparable KPIs and different views for different stakeholders raise doubts about data quality and the company's ability to concretely govern its climate objectives.",
      sources:[
        {label:"GHG Protocol — Corporate Standard",url:"https://ghgprotocol.org/corporate-standard"},
        {label:"GHG Protocol — Corporate Value Chain Scope 3 Standard",url:"https://ghgprotocol.org/scope-3-standard"}
      ]
    },
    4:{it:"La pianificazione della decarbonizzazione dimostra che l'azienda non si limita a misurare le emissioni, ma lavora per ridurle nel tempo. Scenari quantificati e programmi verificabili sono la prova concreta dell'impegno verso Net Zero.",en:"Decarbonisation planning demonstrates that the company is not merely measuring emissions but working to reduce them over time. Quantified scenarios and verifiable programmes are concrete proof of the commitment to Net Zero."},
    5:{it:"Allineare la disclosure ai framework normativi — CSRD, ESRS, GRI, SASB, CDP — è oggi un requisito di mercato oltre che legale. Un processo governato e tracciabile dimostra che l'azienda non si limita a dichiarare la propria sostenibilità, ma la documenta in modo verificabile.",en:"Aligning disclosure with regulatory frameworks — CSRD, ESRS, GRI, SASB, CDP — is today both a market and legal requirement. A governed, traceable process demonstrates that the company does not merely declare its sustainability but documents it in a verifiable way."}
  };
  const activeTrustEntry=trustIntroByMission[selectedMission]??{it:t.trustIntro,en:t.trustIntro};
  const activeTrustIntro=activeTrustEntry[language];
  const activeTrustSources=activeTrustEntry.sources;
  const TRUST_BAR_W=52,TRUST_BAR_GAP=14,TRUST_CHART_H=110,TRUST_LABEL_H=36,TRUST_SVG_PAD_X=8;
  const trustSteps=([
    {label:'BASE',val:30,isCurrent:false,fill:'#293f38',stroke:'#3d6052',strokeW:'1'},
    ...missionOrder.map((mi,pos)=>{
      const outcome=missionOutcomes[mi]??null;
      const isCurrent=mi===selectedMission;
      let cum=30;for(let p=0;p<=pos;p++){const o=missionOutcomes[missionOrder[p]];if(o)cum=Math.min(100,cum+trustGainByOutcome(o,missionOrder[p]));}
      const chartLabels:{it:string,en:string}[]=[{it:"Fabbrica\ndati",en:"Data\nfactory"},{it:"Energia",en:"Energy"},{it:"Supply\nchain",en:"Supply\nchain"},{it:"Reporting",en:"Reporting"},{it:"Net\nZero",en:"Net\nZero"},{it:"Framework\nESG",en:"ESG\nFramework"}];
      const lbl=language==='it'?chartLabels[mi].it:chartLabels[mi].en;
      const fill=outcome===null?'none':outcome==='positive'?'#39efb4':outcome==='warning'?'#ffc07c':'#ff7777';
      const stroke=outcome===null?'#2e4d41':isCurrent?(outcome==='positive'?'#8affda':outcome==='warning'?'#ffd09c':'#ff9b9b'):(outcome==='positive'?'#39efb4':outcome==='warning'?'#ffc07c':'#ff7777');
      return{label:lbl,val:(outcome!==null?cum:null),isCurrent,fill,stroke,strokeW:isCurrent?'2':'1'};
    })
  ]);
  const trustTotalW=trustSteps.length*(TRUST_BAR_W+TRUST_BAR_GAP)-TRUST_BAR_GAP+TRUST_SVG_PAD_X*2;

  if(screen==="intro"&&profile)return <main className="introScreen" style={{position:"relative"}}><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> YOUR CHALLENGE</div><div className="introNavRight"><button className="introBackBtn" onClick={()=>setScreenState("approachReport")}>← {language==="it"?"Indietro":"Back"}</button><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></div></header><section className="characterStage"><img src={`./characters/${profile}-neutral.png`} alt={name}/><div className="characterTag characterTagRaised"><span className="statusDot"/><div><small>ESG MANAGER</small><strong>{name}</strong></div></div></section><section className="introBody"><p className="eyebrow">{t.introKicker}</p><h1>{t.introTitle}</h1><p className="storyText">{t.introBody}</p><div className="introTrustBox"><p className="introScoreLabel">{t.introScoreLabel}</p>{renderTrustBar()}</div><div style={{marginTop:"18px"}}><p className="eyebrow" style={{letterSpacing:".18em",fontSize:"11px",marginBottom:"8px"}}>{language==="it"?"BADGE SBLOCCATO":"BADGE UNLOCKED"}</p><img src="./immagine/badge/badge-esg-study.svg" alt="ESG Study badge" style={{maxWidth:"420px",width:"100%",height:"auto",display:"block",margin:0}}/></div><div className="introCtaRow"><button className="actionButton questLaunchBtn" onClick={()=>setScreen("separatorNext")}>{t.introStart}<b>→</b><span className="mouseDemo questMouse" aria-hidden="true"><img src="./hand-pointer.svg" alt=""/></span></button></div></section></main>;

  if(screen==="approach"&&profile)return <main className="approachScreen" style={{position:"relative"}}><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> PEOPLE & DATA</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="approachBody"><div className="approachTopTitle"><h1>{t.approachTitle}</h1></div><div className="approachLeft approachVisual"><div className="approachPeopleIntro"><small className="approachSectionLabel">{language==="it"?"FILONE 01 · PERSONE":"TRACK 01 · PEOPLE"}</small><h2>{language==="it"?"La sfida è agire sul cambiamento con le persone: coinvolgimento, formazione, responsabilizzazione.":"The challenge is acting on change with people: engagement, training, accountability."}</h2></div><img className="approachTeamImage" src="./approach-team-scene.png" alt={language==="it"?"Team ESG che discute una dashboard di sostenibilità":"ESG team discussing a sustainability dashboard"}/></div><div className="approachRight"><div className="approachDataIntro"><small className="approachSectionLabel">{language==="it"?"FILONE 02 · DATI":"TRACK 02 · DATA"}</small><h2>{language==="it"?<><span>Il secondo filone è agire</span><br/><span>sulla complessità di oltre 500 tipi di dati ESG.</span></>:<><span>The second track is acting</span><br/><span>on the complexity of 500+ ESG data types.</span></>}</h2></div><img className="approachDataImage" src="./approach-data-scene.png" alt={language==="it"?"Dashboard e dati ESG":"ESG data dashboard"}/></div><div className="approachBottomAction"><div className="approachQuestBox"><span className="approachQuestIcon">🚀</span><div className="approachQuestCalloutParagraphs">{(Array.isArray(t.approachQuestCallout)?t.approachQuestCallout:[t.approachQuestCallout]).map((para,i)=><p key={i}>{para}</p>)}</div></div><button className="actionButton" onClick={()=>setScreen("chapterMap")}>{t.approachQuestCta}</button></div></section></main>;

  const CHAPTER_MAP_ITEMS:{labelIt:string,labelEn:string,screen:Screen,icon:string}[]=[
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
  if(screen==="chapterMap"&&profile)return(
    <main style={{display:"flex",flexDirection:"column",height:"100dvh",background:"var(--bg)",overflow:"hidden"}}>
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> IL QUEST</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section style={{flex:1,display:"flex",flexDirection:"row",alignItems:"stretch",padding:"24px 32px 20px",gap:"36px",overflow:"hidden",boxSizing:"border-box"}}>
        {/* colonna sinistra: foto profilo */}
        <div style={{flexShrink:0,width:"200px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"12px"}}>
          <img src={`./characters/${profile}-neutral.png`} alt={name} style={{width:"200px",height:"200px",objectFit:"contain",borderRadius:"50%",display:"block"}}/>
          <span style={{fontWeight:700,fontSize:"16px",textAlign:"center",lineHeight:1.3}}>{name}<br/><small style={{fontWeight:400,fontSize:"12px",color:"var(--muted)"}}>ESG Manager</small></span>
        </div>
        {/* colonna destra: titolo + griglia a due colonne */}
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:"16px",minWidth:0}}>
          <div>
            <small style={{letterSpacing:".14em",fontSize:"12px",color:"var(--muted)",textTransform:"uppercase",fontWeight:700}}>{language==="it"?"ENVIZI QUEST · MAPPA DEI CAPITOLI":"ENVIZI QUEST · CHAPTER MAP"}</small>
            <h1 style={{fontSize:"clamp(28px,3.5vw,52px)",fontWeight:800,margin:"6px 0 4px",lineHeight:1.1}}>{language==="it"?"L'Esperienza Envizi Quest":"The Envizi Quest Experience"}</h1>
            <p style={{color:"var(--muted)",fontSize:"15px",lineHeight:1.5,margin:0}}>{language==="it"?"Salta direttamente al capitolo che ti interessa o procedi dall'inizio.":"Jump directly to the chapter you want or proceed from the beginning."}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",flex:1,alignContent:"start"}}>
            {CHAPTER_MAP_ITEMS.map((ch)=>(
              <button key={ch.screen} onClick={()=>setScreen(ch.screen)} style={{display:"flex",alignItems:"center",gap:"14px",background:"var(--surface,#1a1a2e)",border:"1px solid var(--border,rgba(255,255,255,.1))",borderRadius:"10px",padding:"12px 16px",cursor:"pointer",textAlign:"left",transition:"border-color .15s",color:"inherit"}}
                onMouseEnter={e=>(e.currentTarget.style.borderColor="var(--accent,#39efb4)")}
                onMouseLeave={e=>(e.currentTarget.style.borderColor="var(--border,rgba(255,255,255,.1))")}>
                <span style={{minWidth:"40px",height:"40px",borderRadius:"8px",background:"var(--accent,#39efb4)",color:"#000",fontWeight:800,fontSize:"14px",display:"flex",alignItems:"center",justifyContent:"center",letterSpacing:".04em",flexShrink:0}}>{ch.icon}</span>
                <span style={{fontWeight:600,fontSize:"15px",lineHeight:1.3}}>{language==="it"?ch.labelIt:ch.labelEn}</span>
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:"12px",paddingBottom:"4px"}}>
            <button className="introBackBtn" onClick={()=>setScreen("approach")}>← {language==="it"?"Indietro":"Back"}</button>
            <button className="actionButton approachIntroCta" onClick={()=>setScreen("questIntro")}>{language==="it"?"Inizia dall'inizio":"Start from the beginning"} <b>→</b></button>
          </div>
        </div>
      </section>
    </main>
  );

  if(screen==="questIntro"&&profile)return <main className="questIntroScreen"><header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> IL QUEST</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="questIntroBody"><img src={`./characters/${profile}-neutral.png`} className="questIntroProfileImg" alt={name}/><h1 className="questIntroTitle">{language==="it"?"Introduzione al Quest":"Introduction to the Quest"}</h1><button className="actionButton questIntroCta" onClick={()=>setScreen("blank1")}>{t.questIntroCta}<b>→</b></button></section></main>;


  if(screen==="blank1"&&profile)return <main style={{display:"flex",flexDirection:"column",minHeight:"100dvh",background:"var(--bg)",overflowY:"auto"}}><header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> IL QUEST</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"20px",padding:"24px 0 40px",width:"100%"}}><div style={{position:"relative",width:"95%",maxWidth:"1400px"}}><img src="./slide-education-1.png" alt="Education slide 1" style={{width:"100%",borderRadius:"10px",boxShadow:"0 4px 32px rgba(0,0,0,.5)",display:"block"}}/></div><div style={{display:"flex",alignItems:"center",gap:"20px",marginTop:"8px"}}><button className="introBackBtn" onClick={()=>setScreen("questIntro")}>← {language==="it"?"Indietro":"Back"}</button><button style={{background:"#1a56db",color:"#fff",border:"none",borderRadius:"8px",padding:"14px 36px",fontWeight:700,cursor:"pointer",fontSize:"16px",letterSpacing:".04em"}} onClick={()=>{setP10SlideIdx(0);setScreen("p10Slideshow");}}>▶ {language==="it"?"Presentazione IT":"Presentation IT"}</button><button style={{background:"#0f3460",color:"#fff",border:"none",borderRadius:"8px",padding:"14px 36px",fontWeight:700,cursor:"pointer",fontSize:"16px",letterSpacing:".04em"}} onClick={()=>{setP10SlideIdx(0);setLanguage("en");setScreen("p10Slideshow");}}>▶ Presentation EN</button><button className="actionButton approachIntroCta" onClick={()=>setScreen("approachIntro")}>{language==="it"?"Avanti":"Next"} <b>→</b></button></div></section></main>;

  if(screen==="p10Slideshow"&&profile)return <main style={{background:"#000",display:"grid",gridTemplateRows:"auto 1fr auto",height:"100dvh",overflow:"hidden"}}><header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px",background:"rgba(0,0,0,.85)",zIndex:10}}><button className="brand brandButton" onClick={reset} style={{color:"#fff"}}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><span style={{color:"#aaa",fontSize:"13px"}}>{p10SlideIdx+1} / {P10_SLIDES.length}</span><button className="langMini" onClick={()=>setScreen("blank1")} style={{background:"transparent",border:"1px solid #555",color:"#ccc",borderRadius:"4px",padding:"4px 10px",cursor:"pointer"}}>✕ {language==="it"?"Chiudi":"Close"}</button></header><section style={{display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:"#000"}}><img src={P10_SLIDES[p10SlideIdx]} alt={`Slide ${p10SlideIdx+1}`} style={{maxWidth:"90%",maxHeight:"90%",width:"90%",objectFit:"contain"}}/></section><footer style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"24px",padding:"12px 20px",background:"rgba(0,0,0,.85)"}}><button onClick={()=>setP10SlideIdx(i=>Math.max(0,i-1))} disabled={p10SlideIdx===0} style={{background:"transparent",border:"none",cursor:p10SlideIdx===0?"not-allowed":"pointer",opacity:p10SlideIdx===0?0.2:1}}><svg width="36" height="54" viewBox="0 0 36 54"><polygon points="34,2 2,27 34,52" fill="white"/></svg></button><div style={{display:"flex",gap:"6px"}}>{P10_SLIDES.map((_,i)=><span key={i} onClick={()=>setP10SlideIdx(i)} style={{width:"8px",height:"8px",borderRadius:"50%",background:i===p10SlideIdx?"#39efb4":"#555",cursor:"pointer",display:"inline-block"}}/>)}</div><button onClick={()=>p10SlideIdx===P10_SLIDES.length-1?setScreen("blank1"):setP10SlideIdx(i=>i+1)} style={{background:"transparent",border:"none",cursor:"pointer"}}><svg width="36" height="54" viewBox="0 0 36 54"><polygon points="2,2 34,27 2,52" fill="white"/></svg></button></footer></main>;

  if(screen==="approachIntro"&&profile)return <main className="approachIntroScreen"><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="approachIntroBody approachIntroBodyWithImg"><div className="approachIntroLeft"><h1 className="approachIntroTitle">{t.approachIntroTitle}</h1><div className="approachIntroText">{(t.approachIntroBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div><button className="actionButton approachIntroCta" onClick={()=>setScreen("approachSteps")}>{t.approachIntroCta}<b>→</b></button></div><div className="approachIntroRight"><img src="./step-6.svg" className="approachIntroStepBadge" alt="Step 6"/><img src="./logica-macro.png" className="approachIntroImg" alt="Dalle priorità alle decisioni"/></div></section></main>;

  if(screen==="approachSteps"&&profile)return <main className="approachIntroScreen" style={{position:"relative"}}><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="approachIntroBody approachIntroBodyWithImg"><div className="approachIntroLeft"><h1 className="approachIntroTitle">{t.approachStepsTitle}</h1><div className="approachIntroText">{(t.approachStepsBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div></div><div className="approachIntroRight"><img src="./step-1.svg" className="approachIntroStepBadge" alt="Step 1"/><img src="./logica-obiettivi.png" className="approachIntroImg" alt="Obiettivi di business ESG"/><p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachStepsExample as string}</p><button className="actionButton approachIntroCta" onClick={()=>setScreen("approachData")}>{t.approachStepsCta}<b>→</b></button></div></section></main>;

  if(screen==="approachData"&&profile)return <main className="approachIntroScreen" style={{position:"relative"}}><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="approachIntroBody approachIntroBodyWithImg"><div className="approachIntroLeft"><h1 className="approachIntroTitle">{t.approachDataTitle}</h1><div className="approachIntroText">{(t.approachDataBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div><button className="actionButton approachIntroCta" onClick={()=>setScreen("approachDecisions")}>{t.approachDataCta}<b>→</b></button></div><div className="approachIntroRight"><img src="./step-2.svg" className="approachIntroStepBadge" alt="Step 2"/><img src="./logica-issue.png" className="approachIntroImg" alt="Criticità dati ESG"/><p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachDataExample as string}</p></div></section></main>;

  if(screen==="approachDecisions"&&profile)return <main className="approachIntroScreen" style={{position:"relative"}}><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="approachIntroBody approachIntroBodyWithImg"><div className="approachIntroLeft"><h1 className="approachIntroTitle">{t.approachDecisionsTitle}</h1><div className="approachIntroText">{(t.approachDecisionsBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div><button className="actionButton approachIntroCta" onClick={()=>setScreen("approachRoadmap")}>{t.approachDecisionsCta}<b>→</b></button></div><div className="approachIntroRight"><img src="./step-3.svg" className="approachIntroStepBadge" alt="Step 3"/><img src="./logica-decisionali.png" className="approachIntroImg" alt="Sfide decisionali ESG"/><p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachDecisionsExample as string}</p></div></section></main>;

  if(screen==="approachRoadmap"&&profile)return <main className="approachIntroScreen"><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="approachIntroBody approachIntroBodyWithImg"><div className="approachIntroLeft"><h1 className="approachIntroTitle">{t.approachRoadmapTitle}</h1><div className="approachIntroText">{(t.approachRoadmapBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div><button className="actionButton approachIntroCta" onClick={()=>setScreen("approachTrust")}>{t.approachRoadmapCta}<b>→</b></button></div><div className="approachIntroRight"><img src="./step-4.svg" className="approachIntroStepBadge" alt="Step 4"/><img src="./logica-road-elementi.png" className="approachIntroImg" alt="Roadmap ESG"/><p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachRoadmapExample as string}</p></div></section></main>;

  if(screen==="approachTrust"&&profile)return <main className="approachIntroScreen"><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="approachIntroBody approachIntroBodyWithImg"><div className="approachIntroLeft"><h1 className="approachIntroTitle">{t.approachTrustTitle}</h1><div className="approachIntroText">{(t.approachTrustBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div><button className="actionButton approachIntroCta" onClick={()=>setScreen("approachReport")}>{t.approachTrustCta}<b>→</b></button></div><div className="approachIntroRight"><img src="./step-5.svg" className="approachIntroStepBadge" alt="Step 5"/><img src="./logica-game-fiducia.png" className="approachIntroImg" alt="Game fiducia stakeholder"/><p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachTrustExample as string}</p></div></section></main>;

  if(screen==="approachReport"&&profile)return <main className="approachIntroScreen"><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="approachIntroBody approachIntroBodyWithImg"><div className="approachIntroLeft"><h1 className="approachIntroTitle">{t.approachReportTitle}</h1><div className="approachIntroText">{(t.approachReportBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div><button className="actionButton approachIntroCta" onClick={()=>setScreen("intro")}>{t.approachReportCta}<b>→</b></button></div><div className="approachIntroRight"><img src="./step-6.svg" className="approachIntroStepBadge" alt="Step 6"/><img src="./logica-report-finale.png" className="approachIntroImg" alt="Report finale ESG"/><p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachReportExample as string}</p></div></section></main>;
  if(screen==="separatorNext"&&profile)return <main className="questIntroScreen"><header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> IL QUEST</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="questIntroBody"><img src={`./characters/${profile}-neutral.png`} className="questIntroProfileImg" alt={name}/><h1 className="questIntroTitle">{language==="it"?"Partiamo dagli obiettivi della tua azienda":"Let's start from your company's objectives"}</h1><button className="actionButton questIntroCta" onClick={()=>setScreen("approachStepsCopy")}>{t.questIntroCta}<b>→</b></button></section></main>;
  if(screen==="approachStepsCopy"&&profile)return <main className="approachIntroScreen"><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="approachIntroBody approachIntroBodyWithImg"><div className="approachIntroLeft"><h1 className="approachIntroTitle">{t.approachStepsTitle}</h1><div className="approachIntroText">{(t.approachStepsBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div></div><div className="approachIntroRight"><img src="./step-1.svg" className="approachIntroStepBadge" alt="Step 1"/><img src="./logica-obiettivi.png" className="approachIntroImg" alt="Obiettivi di business ESG"/><p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachStepsExample as string}</p><button className="actionButton approachIntroCta" onClick={()=>setScreen("companySetup")}>{t.approachStepsCta}<b>→</b></button></div></section></main>;

  const renderMissionHub=(isPreview=false)=>{const completed=Object.keys(missionOutcomes).length;const foundationDone=!!missionOutcomes[0];const hubNeeds=isPreview?needsByMissionHubFocused:needsByMissionHub;return <main className="missionMenuScreen"><header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> MISSION HUB</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="missionMenuIntro"><div><p className="eyebrow">{t.roadmapKicker}</p><h1>{t.roadmapTitle}</h1><p>{t.roadmapIntro}</p><div className="roadmapProgress"><span style={{width:`${completed*(100/6)}%`}}/><b>{t.roadmapProgress}: {completed}/6</b></div>{isPreview&&<button className="actionButton rpPreviewCta" onClick={()=>setScreen("challengeSeparator1")}>{language==="it"?"Avanti →":"Next →"}</button>}{isPreview&&<div className="needsTierLegend"><span style={{color:"#ff4d4d"}}>⬡ {language==="it"?"Alta":"High"}</span><span style={{color:"#7dd3fc"}}>⬡ {language==="it"?"Media":"Medium"}</span><span style={{color:"#9ca3af"}}>⬡ {language==="it"?"Bassa":"Low"}</span></div>}{!isPreview&&<button className="actionButton rpPreviewCta" style={{marginTop:"12px"}} onClick={()=>setScreen("dataFoundation")}>{language==="it"?"Avanti →":"Next →"}</button>}{!isPreview&&completed===6&&<button className="summaryCta" onClick={()=>setScreen("summary")}>{t.summaryCta}<b>→</b></button>}</div><div className="priorityPersona"><img src={`./characters/${profile}-neutral.png`} alt={name}/><span>{name}<small>ESG MANAGER</small></span></div></section><section className="missionCards roadmapCards">{missionOrder.map((missionIndex,position)=>{const m=missionCatalog[missionIndex];const outcome=missionOutcomes[missionIndex];const isLocked=!isPreview&&(!foundationDone&&missionIndex!==0);const isStartHere=!isPreview&&!foundationDone&&missionIndex===0;return <article key={m.value} className={`missionCard ${missionIndex===0?"missionCardFoundation":""} ${outcome?`completed ${outcome}`:""}${isLocked?" missionCardLocked":""}`}><button className="missionCardOpen" disabled={isLocked||isPreview} onClick={()=>{if(isLocked||isPreview)return;setSelectedMission(missionIndex);localStorage.setItem("envizi-quest-mission",String(missionIndex+1));setScreen("briefing")}}>{(()=>{const raw=hubNeeds.find(([mi])=>mi===missionIndex)?.[1]||[];const needs=missionIndex===0?[{id:"__foundation__",label:language==="it"?"Una data foundation solida e tracciabile":"A solid and traceable data foundation"},...raw]:raw;const needsLabel=language==="it"?"Esigenze specifiche":"Specific needs";const legendHigh=language==="it"?"Alta":"High";const legendMid=language==="it"?"Media":"Medium";const legendLow=language==="it"?"Bassa":"Low";return <><div className="missionCardChallengeBox"><div className="missionCardTop"><span>{String(position+1).padStart(2,"0")}</span><i>{outcome?"✓":m.icon}</i></div><h2>{language==="it"?m.it:m.en}</h2></div><div className="missionCardNeedsBox"><small className="missionCardNeedsLabel">{needsLabel}</small>{needs.length>0?needs.map(n=>{const prioIdx=priorities.indexOf((n as any).priority);const relMax=prioIdx===0?10:prioIdx===1?8:prioIdx===2?6:4;const rel=Math.min(needRelevance[n.id]??Math.round(relMax/2),relMax);const relNorm=Math.round((rel/relMax)*10);const crit=needCriticality[n.id]??5;const cap=needIdToCapability[n.id];const capLabel=cap?(language==="it"?cap.it:cap.en):null;const tier=relNorm>7&&crit>7?"red":relNorm>4&&relNorm<=7&&crit>4&&crit<=7?"yellow":relNorm>4||crit>4?"yellow":"green";const tierColor=tier==="red"?"#ff4d4d":tier==="yellow"?"#7dd3fc":"#9ca3af";return <span key={n.id} className="missionCardNeed"><span className="missionCardNeedHeader"><b className="missionCardNeedRank" style={{color:tierColor}}>{("rank" in n)?String((n as any).rank).padStart(2,"0"):""}</b><b className="missionCardNeedName" style={{color:tierColor}}>⬡ {n.label}</b><span className="missionCardNeedRC" style={{color:tierColor}}>R:{relNorm} C:{crit}</span></span>{capLabel&&<span className="missionCardNeedCap" style={{color:tierColor,opacity:.8}}>{capLabel}</span>}</span>}):<span className="missionCardNeed">—</span>}</div></>;})()}{isLocked&&<div className="missionCardLockedOverlay"><span>⊘</span><small>{t.missionLocked}</small></div>}{isStartHere&&<div className="missionCardStartHere"><span>{t.missionStartHere}</span><b>→</b></div>}{outcome&&<div className="missionImpact"><div><small>{t.adoptedDecision}</small><strong>{decisionLabel(missionIndex,outcome)}</strong></div><div><small>{t.expectedImpact}</small><p>{outcomeLabel(missionIndex,outcome)}</p></div></div>}<div className="missionCardBottom"><small>{outcome?`${position+1}/5 · ROADMAP`:isLocked?"🔒":""}</small><b>{outcome?t.missionReview:""}</b></div></button></article>})}</section></main>};

  if(screen==="roadmapPreview"&&profile)return renderMissionHub(true);

  if(screen==="chapterOneSummary"&&profile){
    const isIt=language==="it";
    const sec=SECTORS[companySector];
    const sectorLabel=isIt?sec.label.it:sec.label.en;
    const readinessList=isIt?ESG_READINESS_IT:ESG_READINESS_EN;
    const activeReadiness=readinessList.find(r=>r.key===esgReadiness)!;
    const isCsrd=companyDims[4]>=1000&&companyDims[0]>=450;
    const marketLabels:Record<string,{it:string,en:string}>={italia:{it:"Solo Italia",en:"Italy only"},europa:{it:"Europa",en:"Europe"},mondo:{it:"Globale",en:"Global"}};
    const includedPrios=priorities.filter(p=>priorityIncluded[p]);
    const excludedPrios=priorities.filter(p=>!priorityIncluded[p]);
    // top 7 critical needs sorted by R+C desc
    const priorityColors:Record<Priority,string>={credit:"#39efb4",compliance:"#7c86ff",customers:"#f5c542",efficiency:"#ff8c5a",supply:"#a78bfa",reputation:"#f472b6"};
    const top7=dataNeeds.filter(n=>isNeedIncluded(n.id)).map(n=>{
      const rel=needRelevance[n.id]??5;
      const crit=needCriticality[n.id]??5;
      const tier=rel>7&&crit>7?"high":rel>4||crit>4?"medium":"low";
      return{...n,rel,crit,score:rel+crit,tier};
    }).sort((a,b)=>b.score-a.score).slice(0,7);
    // ── testo descrittivo slide 2 ──
    const prioDescIt=(()=>{
      const names=includedPrios.map(p=>(t.priorityNames as Record<Priority,string>)[p]);
      if(names.length===0)return"Non sono stati selezionati obiettivi per l'analisi.";
      const topName=names[0];
      const restNames=names.slice(1);
      const company=displayCompanyName;
      const matLabel=activeReadiness.label.split("—")[0].trim();
      let txt=`${company} ha definito ${names.length} obiettiv${names.length>1?"i":"o"} prioritari${names.length>1?"":"o"} per la propria strategia ESG. `;
      txt+=`In particolare, la priorità principale è <strong>${topName}</strong>`;
      if(restNames.length>0)txt+=`, seguita da ${restNames.slice(0,-1).join(", ")}${restNames.length>1?" e ":""}<strong>${restNames[restNames.length-1]}</strong>`;
      txt+=`. Il livello di maturità attuale — <em>${matLabel}</em> — indica che ${activeReadiness.desc.charAt(0).toLowerCase()+activeReadiness.desc.slice(1)}`;
      return txt;
    })();
    const prioDescEn=(()=>{
      const names=includedPrios.map(p=>(t.priorityNames as Record<Priority,string>)[p]);
      if(names.length===0)return"No objectives were selected for the analysis.";
      const topName=names[0];
      const restNames=names.slice(1);
      const company=displayCompanyName;
      const matLabel=activeReadiness.label.split("—")[0].trim().replace("–","—").split("—")[0].trim();
      let txt=`${company} has defined ${names.length} priority objective${names.length>1?"s":""} for its ESG strategy. `;
      txt+=`The main priority is <strong>${topName}</strong>`;
      if(restNames.length>0)txt+=`, followed by ${restNames.slice(0,-1).join(", ")}${restNames.length>1?" and ":""}<strong>${restNames[restNames.length-1]}</strong>`;
      txt+=`. The current maturity level — <em>${matLabel}</em> — means that ${activeReadiness.desc.charAt(0).toLowerCase()+activeReadiness.desc.slice(1)}`;
      return txt;
    })();
    return <main className="c1sScreen">
      <header className="missionNav">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {isIt?"RIEPILOGO CAPITOLO 1":"CHAPTER 1 SUMMARY"}</div>
        <div className="c1sNavRow c1sNavRowHeader">
          <button className="c1sDownloadBtn" onClick={()=>{
            const pNames=t.priorityNames as Record<Priority,string>;
            const pDetails=t.priorityDetails as Record<Priority,string>;
            const marketLabelsLocal:Record<string,{it:string,en:string}>={italia:{it:"Solo Italia",en:"Italy only"},europa:{it:"Europa",en:"Europe"},mondo:{it:"Globale",en:"Global"}};
            generateSummaryPptx({
              companyName:displayCompanyName,
              sectorLabel,
              marketLabel:isIt?marketLabelsLocal[companyMarket].it:marketLabelsLocal[companyMarket].en,
              revenue:companyDims[0],
              dimUnit:isIt?sec.dimUnit.it:sec.dimUnit.en,
              employees:companyDims[4],
              plants:companyDims[1],
              offices:companyDims[2],
              maturityTitle:activeReadiness.label,
              maturityDesc:activeReadiness.desc,
              csrdLabel:isCsrd?(isIt?"Soggetta a CSRD":"Subject to CSRD"):(isIt?"Non soggetta a CSRD":"Not subject to CSRD"),
              csrdSub:isCsrd?(isIt?"Oltre 1.000 dipendenti e €450M di fatturato":"Over 1,000 employees and €450M revenue"):(isIt?"Sotto le soglie CSRD":"Below CSRD thresholds"),
              csrdNote:csrdNote||"",
              prioIntroText:isIt?prioDescIt:prioDescEn,
              prioItems:includedPrios.map((p,i)=>({rank:i+1,name:pNames[p],detail:pDetails[p],note:prioExperience[p]||undefined})),
              critItems:top7.map((n,i)=>({rank:i+1,label:n.label,priority:pNames[n.priority],rel:n.rel,crit:n.crit,tier:n.tier})),
              isIt,
            });
          }}>↓ {isIt?"Scarica PowerPoint":"Download PowerPoint"}</button>
          <button className="actionButton c1sNextBtn" onClick={()=>setScreen("esgStrategist")}>{isIt?"Avanti →":"Next →"}</button>
        </div>
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <div className="c1sBody">
        {/* ── SLIDE 1: Azienda ── */}
        <section className="c1sSlide c1sSlideHero">
          <div className="c1sSlideLabel">{isIt?"01 · Profilo azienda":"01 · Company profile"}</div>
          <div className="c1sHeroTop">
            <div className="c1sHeroName">{displayCompanyName}</div>
            <div className="c1sHeroTags">
              <span className="c1sHeroTag">{sectorLabel}</span>
              <span className="c1sHeroTag">{isIt?marketLabels[companyMarket].it:marketLabels[companyMarket].en}</span>
              <span className="c1sHeroTag">{companyDims[0]} {isIt?sec.dimUnit.it:sec.dimUnit.en}</span>
              <span className="c1sHeroTag">{companyDims[4].toLocaleString()} {isIt?"dipendenti":"employees"}</span>
              {companyDims[1]>0&&<span className="c1sHeroTag">{companyDims[1]} {isIt?`stabiliment${companyDims[1]===1?"o":"i"}`:`plant${companyDims[1]===1?"":"s"}`}</span>}
              {companyDims[2]>0&&<span className="c1sHeroTag">{companyDims[2]} {isIt?`uffic${companyDims[2]===1?"io":"i"}`:`office${companyDims[2]===1?"":"s"}`}</span>}
            </div>
          </div>
          <div className="c1sMaturityBlock">
            <div className="c1sMaturityLabel">{isIt?"Maturità ESG":"ESG Maturity"}</div>
            <div className="c1sMaturityTitle">{activeReadiness.label}</div>
            <p className="c1sMaturityDesc">{activeReadiness.desc}</p>
          </div>
          <div className={`c1sCsrdBadge${isCsrd?"":" c1sCsrdBadgeOut"}`}>
            <span className="c1sCsrdIcon">{isCsrd?"⚑":"○"}</span>
            <div>
              <strong>{isCsrd?(isIt?"Soggetta a CSRD":"Subject to CSRD"):(isIt?"Non soggetta a CSRD":"Not subject to CSRD")}</strong>
              <span>{isCsrd?(isIt?"Oltre 1.000 dipendenti e €450M di fatturato":"Over 1,000 employees and €450M revenue"):(isIt?"Sotto le soglie CSRD":"Below CSRD thresholds")}</span>
            </div>
          </div>
          {csrdNote&&<div className="c1sCsrdNote"><span>✎</span><p>{csrdNote}</p></div>}
        </section>
        {/* ── SLIDE 2: Obiettivi inclusi ── */}
        <section className="c1sSlide">
          <div className="c1sSlideLabel">{isIt?"02 · Obiettivi prioritari":"02 · Priority objectives"}</div>
          <p className="c1sPrioIntro" dangerouslySetInnerHTML={{__html:isIt?prioDescIt:prioDescEn}}/>
          <div className="c1sPrioList">
            {includedPrios.map((p,i)=><div key={p} className="c1sPrioItem">
              <div className="c1sPrioRank">{String(i+1).padStart(2,"0")}</div>
              <div className="c1sPrioContent">
                <strong>{(t.priorityNames as Record<Priority,string>)[p]}</strong>
                <span className="c1sPrioDetail">{(t.priorityDetails as Record<Priority,string>)[p]}</span>
                {prioExperience[p]&&<p className="c1sPrioNote">✎ {prioExperience[p]}</p>}
              </div>
            </div>)}
          </div>
        </section>
        {/* ── SLIDE 3: Top 7 aree critiche ── */}
        <section className="c1sSlide">
          <div className="c1sSlideLabel c1sSlideLabelLg">{isIt?"03 · Aree critiche principali":"03 · Top critical areas"}</div>
          <h2 className="c1sSlideSub">{isIt?"Ordinate per Rilevanza + Criticità":"Sorted by Relevance + Criticality"}</h2>
          <div className="c1sCritList">
            {top7.map((n,i)=>{
              return <div key={n.id} className="c1sCritItem">
                <div className="c1sCritRank">{String(i+1).padStart(2,"0")}</div>
                <div className="c1sCritBody">
                  <strong>{n.label}</strong>
                  <div className="c1sCritBars">
                    <div className="c1sCritBarRow">
                      <div className="c1sCritBarTrack"><div className="c1sCritBarFill c1sCritBarRel" style={{width:`${n.rel*10}%`}}/></div>
                    </div>
                    <div className="c1sCritBarFooter">
                      <span className="c1sCritBarFooterRel"><span className="c1sCritBarDot c1sCritBarDotRel"/>  {isIt?"Rilevanza":"Relevance"} <b>{n.rel}</b></span>
                      <span className="c1sCritBarFooterCrit"><span className="c1sCritBarDot c1sCritBarDotCrit"/>  {isIt?"Criticità":"Criticality"} <b>{n.crit}</b></span>
                    </div>
                    <div className="c1sCritBarRow">
                      <div className="c1sCritBarTrack"><div className="c1sCritBarFill c1sCritBarCrit" style={{width:`${n.crit*10}%`}}/></div>
                    </div>
                  </div>
                </div>
              </div>;
            })}
          </div>
        </section>
      </div>
    </main>;
  }

  if(screen==="esgStrategist"&&profile){
    const isIt=language==="it";
    // La matrice è stata compilata se almeno un need ha un valore di rilevanza o criticità impostato
    const matrixDone=Object.keys(needRelevance).length>0||Object.keys(needCriticality).length>0;
    // Al primo render con matrice compilata, sblocca e aggiungi +10 una sola volta
    if(matrixDone&&!esgStrategistUnlocked){
      setEsgStrategistUnlocked(true);
      const next=Math.min(100,trustScore+10);
      setTrustScore(next);
      localStorage.setItem("envizi-quest-trust-score",String(next));
    }
    const trustColor=trustScore>=50?"#39efb4":trustScore>=20?"#ffc07c":"#ff7777";
    return <main className="esgStrScreen">
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> ESG STRATEGIST</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="esgStrBody">
        {/* colonna sinistra: foto profilo */}
        <div className="esgStrStage">
          <img src={`./characters/${profile}${matrixDone?"-success":"-neutral"}.png`} alt={name} className="esgStrProfileImg"/>
          <div className="esgStrPersonaTag">
            <span className="statusDot"/>
            <div><small>ESG MANAGER</small><strong>{name}</strong></div>
          </div>
        </div>
        {/* colonna destra: contenuto condizionale */}
        <div className="esgStrContent">
          {matrixDone?(
            <>
              <p className="eyebrow">{isIt?"LIVELLO SBLOCCATO":"LEVEL UNLOCKED"}</p>
              <img src="./immagine/badge/1.svg" alt="ESG Strategist badge" className="esgStrBadgeImg"/>
              <h1 className="esgStrTitle">{isIt?"Hai sbloccato il livello ESG Strategist!":"You've unlocked the ESG Strategist level!"}</h1>
              <p className="esgStrSub">{isIt?"Hai identificato le esigenze di dati chiave e costruito la tua matrice di priorità. Ora è il momento di trasformare l'analisi in sfide decisionali concrete.":"You have identified key data needs and built your priority matrix. Now it's time to turn the analysis into concrete decision challenges."}</p>
              <div className="esgStrTrustGain">
                <span className="esgStrTrustGainLabel">{isIt?"Punti fiducia":"Trust score"}</span>
                <div className="esgStrTrustBarWrap">
                  <div className="trustBar"><span className="trustBarLabel">{t.trustLabel}</span><div className="trustBarTrack"><div className="trustBarFill" style={{width:`${trustScore}%`,background:trustColor}}/></div><span className="trustBarValue" style={{color:trustColor}}>{trustScore}<small>/100</small></span></div>
                  <span className="esgStrTrustDelta">+10</span>
                </div>
              </div>
            </>
          ):(
            <>
              <p className="eyebrow">{isIt?"LIVELLO BLOCCATO":"LEVEL LOCKED"}</p>
              <div className="esgStrBadgeLocked">★ ESG STRATEGIST</div>
              <h1 className="esgStrTitle esgStrTitleLocked">{isIt?"Livello ESG Strategist non ancora sbloccato":"ESG Strategist level not yet unlocked"}</h1>
              <p className="esgStrSub">{isIt?"Per sbloccare il livello completa l'analisi nella sezione Priority Matrix.":"To unlock this level, complete the analysis in the Priority Matrix section."}</p>
              <div className="esgStrTrustGain">
                <span className="esgStrTrustGainLabel">{isIt?"Punti fiducia":"Trust score"}</span>
                <div className="esgStrTrustBarWrap">
                  <div className="trustBar"><span className="trustBarLabel">{t.trustLabel}</span><div className="trustBarTrack"><div className="trustBarFill" style={{width:`${trustScore}%`,background:trustColor}}/></div><span className="trustBarValue" style={{color:trustColor}}>{trustScore}<small>/100</small></span></div>
                </div>
              </div>
            </>
          )}
          <div className="esgStrActions">
            <button className="secondaryAction" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button>
            <button className="actionButton" onClick={()=>setScreen("roadmapPreview")}>{isIt?"Inizia le sfide →":"Start challenges →"}</button>
          </div>
          {renderSaveBtn(isIt)}
        </div>
      </section>
    </main>;
  }

  if(screen==="challengeSeparator1"&&profile){const isIt=language==="it";return <main style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#07110e",position:"relative"}}><header className="missionNav" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><h1 style={{fontSize:"clamp(72px,12vw,160px)",fontWeight:800,letterSpacing:"-.04em",color:"#f2fff9",margin:0,lineHeight:1}}>{isIt?"Sfida 1":"Challenge 1"}</h1><div style={{width:"min(340px,80vw)",margin:"36px auto 0"}}>{renderTrustBar()}</div><div style={{display:"flex",gap:"12px",marginTop:"32px"}}><button className="secondaryAction" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{marginTop:0}} onClick={()=>setScreen("missionCard1")}>{isIt?"Avanti →":"Next →"}</button></div></main>;}

  if(screen==="missionCard1"&&profile){const isIt=language==="it";const m=missionCatalog[0];const raw=needsByMissionHubFocused.find(([mi])=>mi===0)?.[1]||[];const needs=[...raw,{id:"__foundation__",label:isIt?"Una data foundation solida e tracciabile":"A solid and traceable data foundation"}];const renderNeedsTable=(arr:typeof needs)=><table style={{width:"100%",borderCollapse:"collapse",fontSize:"29px"}}><thead><tr>{[isIt?"Esigenza":"Need",isIt?"Rile. / Crit.":"Rel. / Crit.",isIt?"Capacità Envizi":"Envizi capability"].map(h=><th key={h} style={{textAlign:"left",padding:"6px 10px",color:"#f2fff9",fontWeight:700,letterSpacing:".08em",borderBottom:"1px solid rgba(57,239,180,.35)",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead><tbody>{arr.map(n=>{const prioIdx=priorities.indexOf((n as any).priority);const relMax=prioIdx===0?10:prioIdx===1?8:prioIdx===2?6:4;const rel=Math.min(needRelevance[n.id]??Math.round(relMax/2),relMax);const relNorm=Math.round((rel/relMax)*10);const crit=needCriticality[n.id]??5;const cap=needIdToCapability[n.id];const capLabel=cap?(isIt?cap.it:cap.en):null;const isF=n.id==="__foundation__";const tier=isF?"green":relNorm>7&&crit>7?"red":relNorm>4||crit>4?"yellow":"green";const tc=tier==="red"?"#ff4d4d":tier==="yellow"?"#7dd3fc":"#39efb4";return <tr key={n.id} style={{borderBottom:"1px solid rgba(255,255,255,.08)"}}><td style={{padding:"8px 10px",color:tc,lineHeight:1.35,fontWeight:500,overflow:"hidden",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as "vertical",display:"-webkit-box" as any}}>⬡ {n.label}</td><td style={{padding:"8px 10px",color:tc,whiteSpace:"nowrap",fontFamily:"var(--font-geist-mono)",fontSize:"27px",fontWeight:700}}>{isF?"—":`R:${relNorm} C:${crit}`}</td><td style={{padding:"8px 10px",color:tc,lineHeight:1.35,overflow:"hidden",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as "vertical",display:"-webkit-box" as any}}>{capLabel||"—"}</td></tr>;})}</tbody></table>;return <main className="missionMenuScreen"><header className="missionNav missionNavTrust" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="missionCards roadmapCards" style={{paddingTop:"80px",paddingBottom:"100px",display:"flex",justifyContent:"center",alignItems:"flex-start",minHeight:"100vh",overflowY:"auto"}}><article className="missionCard" style={{maxWidth:"960px",width:"100%",pointerEvents:"none"}}><div className="missionCardChallengeBox"><div className="missionCardTop"><span>01</span><i>{m.icon}</i></div><h2>{isIt?m.it:m.en}</h2></div><div className="missionCardNeedsBox">{needs.length>0?renderNeedsTable(needs):<span className="missionCardNeed">—</span>}</div></article></section><div style={{position:"fixed",bottom:"32px",left:0,right:0,display:"flex",justifyContent:"center",gap:"12px"}}><button className="secondaryAction" onClick={()=>setScreen("challengeSeparator1")}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{width:"auto",marginTop:0,padding:"12px 24px"}} onClick={()=>{setSelectedMission(0);localStorage.setItem("envizi-quest-mission","1");setScreen("briefing");}}>{isIt?"Avanti →":"Next →"}</button></div></main>;}


  if(screen==="introCopy"&&profile)return <main className="introScreen"><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> YOUR CHALLENGE</div><div className="introNavRight"><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></div></header><section className="characterStage"><img src={`./characters/${profile}-neutral.png`} alt={name}/><div className="characterTag characterTagRaised"><span className="statusDot"/><div><small>ESG MANAGER</small><strong>{name}</strong></div></div></section><section className="introBody"><p className="eyebrow">{t.introKicker}</p><h1>{t.introTitle}</h1><p className="storyText">{t.introBody}</p><div className="introTrustBar"><p className="introScoreLabel">{t.introScoreLabel}</p>{renderTrustBar()}</div><div className="introCtaRow"><button className="actionButton questLaunchBtn" onClick={()=>setScreen("roadmapPreview")}>{t.introStart}<b>→</b></button></div></section></main>;

  if(screen==="missions"&&profile){
    if(!!missionOutcomes[0])return renderMissionHub(false);
    const m0=missionCatalog[0];
    const questionBody=(t.mission0QuestionBody as string).replace("COMPANY_NAME",displayCompanyName);
    return <main className="mission0IntroScreen">
      <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> MISSION 01</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
      <section className="m0iStage">
        <img src={`./characters/${profile}-neutral.png`} alt={name} className="m0iProfileImg"/>
        <div className="m0iPersonaTag"><span className="statusDot"/><div><small>ESG MANAGER</small><strong>{name}</strong></div></div>
      </section>
      <section className="m0iContent">
        <div className="m0iMissionBadge"><span>{m0.icon}</span><i>{language==="it"?"MISSIONE 01 · DATA FOUNDATION":"MISSION 01 · DATA FOUNDATION"}</i></div>
        <h1 className="m0iTitle">{language==="it"?m0.it:m0.en}</h1>
        <p className="m0iKicker">{t.mission0QuestionKicker}</p>
        <p className="m0iQuestion">{t.mission0Question}</p>
        <p className="m0iBody">{questionBody}</p>
        <button className="actionButton m0iCta" onClick={()=>{setSelectedMission(0);localStorage.setItem("envizi-quest-mission","1");setScreen("briefing");}}>{t.mission0Cta}<b>→</b></button>
      </section>
    </main>;
  }

  if(screen==="missionIntro"&&profile){const mid=t.missionIntroData[selectedMission]||t.missionIntroData[0];const mBody=(mid.body as string).replace("COMPANY_NAME",displayCompanyName);const activeMission=missionCatalog[selectedMission];return <main className="mission0IntroScreen"><header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {mid.eyebrow}</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="m0iStage"><img src={`./characters/${profile}-neutral.png`} alt={name} className="m0iProfileImg"/><div className="m0iPersonaTag"><span className="statusDot"/><div><small>ESG MANAGER</small><strong>{name}</strong></div></div></section><section className="m0iContent"><div className="m0iMissionBadge"><span>{activeMission.icon}</span><i>{mid.eyebrow}</i></div><h1 className="m0iTitle">{mid.title}</h1><p className="m0iKicker">{mid.kicker}</p><p className="m0iQuestion">{mid.question}</p><p className="m0iBody">{mBody}</p><button className="actionButton m0iCta" onClick={()=>setScreen("introCopy2")}>{mid.cta}<b>→</b></button></section></main>;}



  if(screen==="summary"&&profile)return <main className="summaryScreen"><header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> ESG ROADMAP</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="summaryIntro"><p className="eyebrow">{t.summaryKicker}</p><h1>{t.summaryTitle}</h1><p>{t.summaryIntro}</p><div className="summaryPriorities"><small>{t.topPriorities}</small><div>{priorities.slice(0,3).map((p,i)=><span key={p} className={priorityIncluded[p]?"":"summaryPriorityExcluded"}><b>{String(i+1).padStart(2,"0")}</b>{t.priorityNames[p]}{!priorityIncluded[p]&&<small className="summaryPriorityExcludedNote">{language==="it"?" (escluso dall'analisi)":" (excluded from analysis)"}</small>}</span>)}</div></div>{calculatedTrustScore>=80&&<div className="trustedBadgeSummary">★ {t.trustedLabel}</div>}</section><section className="summaryGrid">{missionOrder.map((missionIndex,position)=>{const m=missionCatalog[missionIndex];const outcome=missionOutcomes[missionIndex];const assignedNeeds=needsByMissionHub.find(([mi])=>mi===missionIndex)?.[1]||[];const displayNeeds=missionIndex===0?[{id:"__foundation__",label:language==="it"?"Una data foundation solida e tracciabile":"A solid and traceable data foundation"},...assignedNeeds]:assignedNeeds;return <article className={`summaryCard ${outcome}`} key={m.value}><div className="summaryCardTitle"><span>{String(position+1).padStart(2,"0")}</span><h2>{language==="it"?m.it:m.en}</h2></div><div><small>{t.adoptedDecision}</small><strong>{outcome?decisionLabel(missionIndex,outcome):"—"}</strong></div><div><small>{t.expectedImpact}</small><p>{outcome?outcomeLabel(missionIndex,outcome):"—"}</p></div><div className="summaryParams"><small>{t.parameters}</small>{displayNeeds.length>0?displayNeeds.map(n=><span key={n.id}>⬡ {n.label}</span>):<span>—</span>}</div></article>})}</section><footer className="summaryActions"><button className="secondaryAction" onClick={reset}>← {t.backStart}</button><button className="actionButton" onClick={()=>setScreen("nextStep")}>{t.nextStep}<b>→</b></button></footer></main>;

  if(screen==="nextStep"&&profile){const top3=priorities.slice(0,3).map((p,i)=>`${i+1}. ${t.priorityNames[p]}`).join(", ");const decisionsLine=missionOrder.map(mi=>{const o=missionOutcomes[mi];return o?`M${mi+1}: ${decisionLabel(mi,o)}`:`M${mi+1}: —`}).join(" | ");const paramsLine=missionOrder.map(mi=>{const vals=missionParameters[mi]||[];const items=missionItems(mi);const units=missionUnits(mi);const filled=items.map((item,i)=>vals[i]?`${item.title}: ${vals[i]} ${units[i]}`:"").filter(Boolean);return filled.length?`[M${mi+1}: ${filled.join(", ")}]`:""}).filter(Boolean).join(" ");const isIt=language==="it";const toEmail=contactEmail.trim()||t.nextContactEmail;const subj=isIt?"Demo IBM Envizi — Envizi Impact Quest":"IBM Envizi Demo — Envizi Impact Quest";const pocSubj=isIt?"Proof of Concept IBM Envizi — Envizi Impact Quest":"IBM Envizi PoC — Envizi Impact Quest";const bvaSubj=isIt?"Business Value Assessment IBM Envizi — Envizi Impact Quest":"IBM Envizi BVA — Envizi Impact Quest";const commonBody=isIt?`%0A%0A— Profilo: ${name} (${profile==="marco"?t.maleRole:t.femaleRole})%0A— Punteggio fiducia finale: ${trustScore}/100%0A— Top 3 priorità: ${top3}%0A— Decisioni: ${decisionsLine}${paramsLine?`%0A— Parametri AS-IS: ${paramsLine}`:""}${approachBiz?`%0A— Esigenze di business: ${approachBiz}`:""}${approachData?`%0A— Sfide sui dati: ${approachData}`:""}%0A%0AIn attesa di un riscontro.`:`%0A%0A— Profile: ${name} (${profile==="marco"?t.maleRole:t.femaleRole})%0A— Final trust score: ${trustScore}/100%0A— Top 3 priorities: ${top3}%0A— Decisions: ${decisionsLine}${paramsLine?`%0A— AS-IS parameters: ${paramsLine}`:""}${approachBiz?`%0A— Business needs: ${approachBiz}`:""}${approachData?`%0A— Data challenges: ${approachData}`:""}%0A%0ALooking forward to your reply.`;const demoBody=isIt?`Ciao,%0A%0AHo completato l'Envizi Impact Quest e vorrei approfondire come IBM Envizi si integra nel nostro contesto con una demo.${commonBody}`:`Hi,%0A%0AI have completed the Envizi Impact Quest and would like to explore how IBM Envizi fits our context with a demo.${commonBody}`;const pocBody=isIt?`Ciao,%0A%0AHo completato l'Envizi Impact Quest e sono interessato a un Proof of Concept con i dati reali della mia organizzazione.${commonBody}`:`Hi,%0A%0AI have completed the Envizi Impact Quest and I am interested in a Proof of Concept with my organisation's real data.${commonBody}`;const bvaBody=isIt?`Ciao,%0A%0AHo completato l'Envizi Impact Quest e vorrei richiedere un Business Value Assessment per quantificare il valore di IBM Envizi per la mia organizzazione.${commonBody}`:`Hi,%0A%0AI have completed the Envizi Impact Quest and would like to request a Business Value Assessment to quantify the value of IBM Envizi for my organisation.${commonBody}`;return <main className="nextStepScreen"><header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> NEXT STEP</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="nextStepBody"><p className="eyebrow">{t.nextKicker}</p><h1>{t.nextTitle}</h1><div className="nextStepCards"><div className="nextStepCard nextStepCardDemo"><small>{t.nextDemoLabel}</small><p>{t.nextDemoIntro}</p><div className="nextDemoEmailRow"><input className="nextDemoEmailInput" type="email" placeholder={t.nextDemoEmailPlaceholder} value={contactEmail} onChange={e=>setContactEmail(e.target.value)}/></div><a className="nextStepBtn primary" href={`mailto:${toEmail}?subject=${subj}&body=${demoBody}`}>{t.nextDemoButton}</a>{!contactEmail.trim()&&<a className="nextDemoFallbackLink" href={`mailto:${t.nextContactEmail}?subject=${subj}&body=${demoBody}`}>{t.nextDemoFallback}</a>}</div><div className="nextStepCard"><small>{t.nextPocLabel}</small><p>{t.nextPocIntro}</p><a className="nextStepBtn primary" href={`mailto:${toEmail||t.nextContactEmail}?subject=${pocSubj}&body=${pocBody}`}>{t.nextPocButton}</a></div><div className="nextStepCard"><small>{t.nextBvaLabel}</small><p>{t.nextBvaIntro}</p><a className="nextStepBtn primary" href={`mailto:${toEmail||t.nextContactEmail}?subject=${bvaSubj}&body=${bvaBody}`}>{t.nextBvaButton}</a></div><div className="nextStepCard"><small>{t.nextSiteLabel}</small><p>{t.nextSiteIntro}</p><a className="nextStepBtn primary" href="https://www.ibm.com/it-it/products/envizi" target="_blank" rel="noreferrer">{t.nextSiteButton}</a></div></div><div className="nextStepContact"><small>{t.nextContactLabel}</small><strong>{t.nextContactName}</strong><span>{t.nextContactRole}</span><a href={`mailto:${t.nextContactEmail}`}>{t.nextContactEmail}</a></div><div className="nextStepActions"><button className="secondaryAction" onClick={reset}>← {t.backStart}</button><button className="actionButton" onClick={()=>setScreen("thankYou")}>{t.nextStep}<b>→</b></button></div></section></main>;}


  if(screen==="milestone"&&profile){
    const isTrusted=missionOutcomes[0]==="positive";
    const isIt=language==="it";
    const milestoneText=isTrusted
      ?(isIt
        ?"Complimenti, hai sbloccato il livello Trusted ESG Data Manager."
        :"Congratulations, you have unlocked the Trusted ESG Data Manager level.")
      :(isIt
        ?"Avviare la digitalizzazione dell\u2019ESG in modo semplice, con moduli per la raccolta dati e senza integrazione delle fonti, pu\u00f2 essere un\u2019ottima decisione per contenere costi e rischi iniziali. Anche in questo contesto IBM Envizi pu\u00f2 diventare fattore critico di successo per la tua iniziativa. Verifica quali requisiti della gestione dati sono comunque importanti per te e il valore di Envizi a supporto."
        :"Starting ESG digitalisation simply, with data collection forms and without source integration, can be an excellent decision to contain initial costs and risks. Even in this context, IBM Envizi can become a critical success factor for your initiative. Check which data management requirements are still important to you and the value Envizi can provide.");
    return (
      <main className="thankYouScreen">
        <header className="missionNav">
          <button className="brand brandButton" onClick={reset}>
            <span className="brandMark">e·</span>
            <span>Envizi<br/>Impact Quest</span>
          </button>
          <div className="missionProgress"><span className="activeDot"/> MILESTONE</div>
          <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
        </header>
        <section className="thankYouBody" style={{display:"grid",gridTemplateColumns:"1fr 1fr",alignItems:"center",gap:"0",padding:"0",overflow:"hidden"}}>
          <div style={{height:"100%",overflow:"hidden"}}>
            <img src={`./characters/${profile}-${isTrusted?"success":"neutral"}.png`} alt={name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block"}}/>
          </div>
          <div style={{padding:"3vw 4vw",display:"flex",flexDirection:"column",gap:"16px"}}>
            <h1 style={{color:isTrusted?"#39efb4":"#ffc07c",fontSize:isTrusted?"clamp(24px,3vw,44px)":"clamp(28px,3vw,40px)",lineHeight:1.5,letterSpacing:"-.02em",margin:0}}>
              {milestoneText}
            </h1>
            <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
              <button className="secondaryAction" onClick={()=>goBack()}>{isIt?"\u2190 Indietro":"\u2190 Back"}</button>
              <button className="actionButton" style={{width:"auto",marginTop:0,padding:"12px 16px"}} onClick={()=>setScreen("dataFoundation")}>{isIt?"Approfondiamo perch\u00e9 Envizi \u2192":"Let\u2019s explore why Envizi \u2192"}</button>
            </div>
            {renderSaveBtn(isIt)}
          </div>
        </section>
      </main>
    );
  }


  if(screen==="thankYou"&&profile)return <main className="thankYouScreen"><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> FINAL</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="thankYouBody"><h1>{t.thankYouTitle}</h1></section></main>;



  // ── ENERGIA E DECARBONIZZAZIONE — Foundation + Conclusion ──────────────────
  if(screen==="challengeComplete1"&&profile){const isIt=language==="it";return <main style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#07110e",position:"relative"}}><header className="missionNav" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"24px"}}><p style={{margin:0,font:`700 14px var(--font-geist-mono)`,letterSpacing:".2em",color:"#39efb4",textTransform:"uppercase"}}>{isIt?"Sfida 1 completata":"Challenge 1 completed"}</p><h1 style={{fontSize:"clamp(60px,10vw,140px)",fontWeight:800,letterSpacing:"-.04em",color:"#f2fff9",margin:0,lineHeight:1}}>{isIt?"Hai completato\nla Sfida 1":"You completed\nChallenge 1"}</h1><div style={{width:"min(340px,80vw)",margin:"8px auto 0"}}>{renderTrustBar()}</div><div style={{display:"flex",gap:"12px",marginTop:"8px"}}><button className="secondaryAction" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{marginTop:0}} onClick={()=>setScreen("challengeSeparator2")}>{isIt?"Inizia la Sfida 2 →":"Start Challenge 2 →"}</button></div></div></main>;}
  // ── SEPARATORI E COMPLETAMENTI SFIDE 2-6 ──────────────────────────────────
  if(screen==="challengeSeparator2"&&profile){const isIt=language==="it";return <main style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#07110e",position:"relative"}}><header className="missionNav" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><h1 style={{fontSize:"clamp(72px,12vw,160px)",fontWeight:800,letterSpacing:"-.04em",color:"#f2fff9",margin:0,lineHeight:1}}>{isIt?"Sfida 2":"Challenge 2"}</h1><div style={{width:"min(340px,80vw)",margin:"36px auto 0"}}>{renderTrustBar()}</div><div style={{display:"flex",gap:"12px",marginTop:"32px"}}><button className="secondaryAction" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{marginTop:0}} onClick={()=>setScreen("missionCard2")}>{isIt?"Avanti →":"Next →"}</button></div></main>;}
  if(screen==="missionCard2"&&profile){const isIt=language==="it";const mi=missionOrder[1];const m=missionCatalog[mi];const needs=needsByMissionHubFocused.find(([x])=>x===mi)?.[1]||[];const renderNeedsTable=(arr:typeof needs)=><table style={{width:"100%",borderCollapse:"collapse",fontSize:"29px"}}><thead><tr>{[isIt?"Esigenza":"Need",isIt?"Rile. / Crit.":"Rel. / Crit.",isIt?"Capacità Envizi":"Envizi capability"].map(h=><th key={h} style={{textAlign:"left",padding:"6px 10px",color:"#f2fff9",fontWeight:700,letterSpacing:".08em",borderBottom:"1px solid rgba(57,239,180,.35)",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead><tbody>{arr.map(n=>{const prioIdx=priorities.indexOf((n as any).priority);const relMax=prioIdx===0?10:prioIdx===1?8:prioIdx===2?6:4;const rel=Math.min(needRelevance[n.id]??Math.round(relMax/2),relMax);const relNorm=Math.round((rel/relMax)*10);const crit=needCriticality[n.id]??5;const cap=needIdToCapability[n.id];const capLabel=cap?(isIt?cap.it:cap.en):null;const tier=relNorm>7&&crit>7?"red":relNorm>4||crit>4?"yellow":"green";const tc=tier==="red"?"#ff4d4d":tier==="yellow"?"#7dd3fc":"#39efb4";return <tr key={n.id} style={{borderBottom:"1px solid rgba(255,255,255,.08)"}}><td style={{padding:"8px 10px",color:tc,lineHeight:1.35,fontWeight:500,overflow:"hidden",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as "vertical",display:"-webkit-box" as any}}>⬡ {n.label}</td><td style={{padding:"8px 10px",color:tc,whiteSpace:"nowrap",fontFamily:"var(--font-geist-mono)",fontSize:"27px",fontWeight:700}}>{`R:${relNorm} C:${crit}`}</td><td style={{padding:"8px 10px",color:tc,lineHeight:1.35,overflow:"hidden",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as "vertical",display:"-webkit-box" as any}}>{capLabel||"—"}</td></tr>;})}</tbody></table>;return <main className="missionMenuScreen"><header className="missionNav missionNavTrust" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="missionCards roadmapCards" style={{paddingTop:"80px",paddingBottom:"100px",display:"flex",justifyContent:"center",alignItems:"flex-start",minHeight:"100vh",overflowY:"auto"}}><article className="missionCard" style={{maxWidth:"960px",width:"100%",pointerEvents:"none"}}><div className="missionCardChallengeBox"><div className="missionCardTop"><span>02</span><i>{m.icon}</i></div><h2>{isIt?m.it:m.en}</h2></div><div className="missionCardNeedsBox">{needs.length>0?renderNeedsTable(needs):<span className="missionCardNeed">—</span>}</div></article></section><div style={{position:"fixed",bottom:"32px",left:0,right:0,display:"flex",justifyContent:"center",gap:"12px"}}><button className="secondaryAction" onClick={()=>setScreen("challengeSeparator2")}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{width:"auto",marginTop:0,padding:"12px 24px"}} onClick={()=>{setSelectedMission(mi);localStorage.setItem("envizi-quest-mission",String(mi+1));setScreen("briefing");}}>{isIt?"Avanti →":"Next →"}</button></div></main>;}
  if(screen==="challengeComplete2"&&profile){const isIt=language==="it";return <main style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#07110e",position:"relative"}}><header className="missionNav" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"24px"}}><p style={{margin:0,font:`700 14px var(--font-geist-mono)`,letterSpacing:".2em",color:"#39efb4",textTransform:"uppercase"}}>{isIt?"Sfida 2 completata":"Challenge 2 completed"}</p><h1 style={{fontSize:"clamp(60px,10vw,140px)",fontWeight:800,letterSpacing:"-.04em",color:"#f2fff9",margin:0,lineHeight:1}}>{isIt?"Hai completato\nla Sfida 2":"You completed\nChallenge 2"}</h1><div style={{width:"min(340px,80vw)",margin:"8px auto 0"}}>{renderTrustBar()}</div><div style={{display:"flex",gap:"12px",marginTop:"8px"}}><button className="secondaryAction" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{marginTop:0}} onClick={()=>setScreen("challengeSeparator3")}>{isIt?"Inizia la Sfida 3 →":"Start Challenge 3 →"}</button></div></div></main>;}
  if(screen==="challengeSeparator3"&&profile){const isIt=language==="it";return <main style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#07110e",position:"relative"}}><header className="missionNav" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><h1 style={{fontSize:"clamp(72px,12vw,160px)",fontWeight:800,letterSpacing:"-.04em",color:"#f2fff9",margin:0,lineHeight:1}}>{isIt?"Sfida 3":"Challenge 3"}</h1><div style={{width:"min(340px,80vw)",margin:"36px auto 0"}}>{renderTrustBar()}</div><div style={{display:"flex",gap:"12px",marginTop:"32px"}}><button className="secondaryAction" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{marginTop:0}} onClick={()=>setScreen("missionCard3")}>{isIt?"Avanti →":"Next →"}</button></div></main>;}
  if(screen==="missionCard3"&&profile){const isIt=language==="it";const mi=missionOrder[2];const m=missionCatalog[mi];const needs=needsByMissionHubFocused.find(([x])=>x===mi)?.[1]||[];const renderNeedsTable=(arr:typeof needs)=><table style={{width:"100%",borderCollapse:"collapse",fontSize:"29px"}}><thead><tr>{[isIt?"Esigenza":"Need",isIt?"Rile. / Crit.":"Rel. / Crit.",isIt?"Capacità Envizi":"Envizi capability"].map(h=><th key={h} style={{textAlign:"left",padding:"6px 10px",color:"#f2fff9",fontWeight:700,letterSpacing:".08em",borderBottom:"1px solid rgba(57,239,180,.35)",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead><tbody>{arr.map(n=>{const prioIdx=priorities.indexOf((n as any).priority);const relMax=prioIdx===0?10:prioIdx===1?8:prioIdx===2?6:4;const rel=Math.min(needRelevance[n.id]??Math.round(relMax/2),relMax);const relNorm=Math.round((rel/relMax)*10);const crit=needCriticality[n.id]??5;const cap=needIdToCapability[n.id];const capLabel=cap?(isIt?cap.it:cap.en):null;const tier=relNorm>7&&crit>7?"red":relNorm>4||crit>4?"yellow":"green";const tc=tier==="red"?"#ff4d4d":tier==="yellow"?"#7dd3fc":"#39efb4";return <tr key={n.id} style={{borderBottom:"1px solid rgba(255,255,255,.08)"}}><td style={{padding:"8px 10px",color:tc,lineHeight:1.35,fontWeight:500,overflow:"hidden",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as "vertical",display:"-webkit-box" as any}}>⬡ {n.label}</td><td style={{padding:"8px 10px",color:tc,whiteSpace:"nowrap",fontFamily:"var(--font-geist-mono)",fontSize:"27px",fontWeight:700}}>{`R:${relNorm} C:${crit}`}</td><td style={{padding:"8px 10px",color:tc,lineHeight:1.35,overflow:"hidden",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as "vertical",display:"-webkit-box" as any}}>{capLabel||"—"}</td></tr>;})}</tbody></table>;return <main className="missionMenuScreen"><header className="missionNav missionNavTrust" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="missionCards roadmapCards" style={{paddingTop:"80px",paddingBottom:"100px",display:"flex",justifyContent:"center",alignItems:"flex-start",minHeight:"100vh",overflowY:"auto"}}><article className="missionCard" style={{maxWidth:"960px",width:"100%",pointerEvents:"none"}}><div className="missionCardChallengeBox"><div className="missionCardTop"><span>03</span><i>{m.icon}</i></div><h2>{isIt?m.it:m.en}</h2></div><div className="missionCardNeedsBox">{needs.length>0?renderNeedsTable(needs):<span className="missionCardNeed">—</span>}</div></article></section><div style={{position:"fixed",bottom:"32px",left:0,right:0,display:"flex",justifyContent:"center",gap:"12px"}}><button className="secondaryAction" onClick={()=>setScreen("challengeSeparator3")}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{width:"auto",marginTop:0,padding:"12px 24px"}} onClick={()=>{setSelectedMission(mi);localStorage.setItem("envizi-quest-mission",String(mi+1));setScreen("briefing");}}>{isIt?"Avanti →":"Next →"}</button></div></main>;}
  if(screen==="challengeComplete3"&&profile){const isIt=language==="it";return <main style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#07110e",position:"relative"}}><header className="missionNav" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"24px"}}><p style={{margin:0,font:`700 14px var(--font-geist-mono)`,letterSpacing:".2em",color:"#39efb4",textTransform:"uppercase"}}>{isIt?"Sfida 3 completata":"Challenge 3 completed"}</p><h1 style={{fontSize:"clamp(60px,10vw,140px)",fontWeight:800,letterSpacing:"-.04em",color:"#f2fff9",margin:0,lineHeight:1}}>{isIt?"Hai completato\nla Sfida 3":"You completed\nChallenge 3"}</h1><div style={{width:"min(340px,80vw)",margin:"8px auto 0"}}>{renderTrustBar()}</div><div style={{display:"flex",gap:"12px",marginTop:"8px"}}><button className="secondaryAction" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{marginTop:0}} onClick={()=>setScreen("challengeSeparator4")}>{isIt?"Inizia la Sfida 4 →":"Start Challenge 4 →"}</button></div></div></main>;}
  if(screen==="challengeSeparator4"&&profile){const isIt=language==="it";return <main style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#07110e",position:"relative"}}><header className="missionNav" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><h1 style={{fontSize:"clamp(72px,12vw,160px)",fontWeight:800,letterSpacing:"-.04em",color:"#f2fff9",margin:0,lineHeight:1}}>{isIt?"Sfida 4":"Challenge 4"}</h1><div style={{width:"min(340px,80vw)",margin:"36px auto 0"}}>{renderTrustBar()}</div><div style={{display:"flex",gap:"12px",marginTop:"32px"}}><button className="secondaryAction" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{marginTop:0}} onClick={()=>setScreen("missionCard4")}>{isIt?"Avanti →":"Next →"}</button></div></main>;}
  if(screen==="missionCard4"&&profile){const isIt=language==="it";const mi=missionOrder[3];const m=missionCatalog[mi];const needs=needsByMissionHubFocused.find(([x])=>x===mi)?.[1]||[];const renderNeedsTable=(arr:typeof needs)=><table style={{width:"100%",borderCollapse:"collapse",fontSize:"29px"}}><thead><tr>{[isIt?"Esigenza":"Need",isIt?"Rile. / Crit.":"Rel. / Crit.",isIt?"Capacità Envizi":"Envizi capability"].map(h=><th key={h} style={{textAlign:"left",padding:"6px 10px",color:"#f2fff9",fontWeight:700,letterSpacing:".08em",borderBottom:"1px solid rgba(57,239,180,.35)",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead><tbody>{arr.map(n=>{const prioIdx=priorities.indexOf((n as any).priority);const relMax=prioIdx===0?10:prioIdx===1?8:prioIdx===2?6:4;const rel=Math.min(needRelevance[n.id]??Math.round(relMax/2),relMax);const relNorm=Math.round((rel/relMax)*10);const crit=needCriticality[n.id]??5;const cap=needIdToCapability[n.id];const capLabel=cap?(isIt?cap.it:cap.en):null;const tier=relNorm>7&&crit>7?"red":relNorm>4||crit>4?"yellow":"green";const tc=tier==="red"?"#ff4d4d":tier==="yellow"?"#7dd3fc":"#39efb4";return <tr key={n.id} style={{borderBottom:"1px solid rgba(255,255,255,.08)"}}><td style={{padding:"8px 10px",color:tc,lineHeight:1.35,fontWeight:500,overflow:"hidden",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as "vertical",display:"-webkit-box" as any}}>⬡ {n.label}</td><td style={{padding:"8px 10px",color:tc,whiteSpace:"nowrap",fontFamily:"var(--font-geist-mono)",fontSize:"27px",fontWeight:700}}>{`R:${relNorm} C:${crit}`}</td><td style={{padding:"8px 10px",color:tc,lineHeight:1.35,overflow:"hidden",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as "vertical",display:"-webkit-box" as any}}>{capLabel||"—"}</td></tr>;})}</tbody></table>;return <main className="missionMenuScreen"><header className="missionNav missionNavTrust" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="missionCards roadmapCards" style={{paddingTop:"80px",paddingBottom:"100px",display:"flex",justifyContent:"center",alignItems:"flex-start",minHeight:"100vh",overflowY:"auto"}}><article className="missionCard" style={{maxWidth:"960px",width:"100%",pointerEvents:"none"}}><div className="missionCardChallengeBox"><div className="missionCardTop"><span>04</span><i>{m.icon}</i></div><h2>{isIt?m.it:m.en}</h2></div><div className="missionCardNeedsBox">{needs.length>0?renderNeedsTable(needs):<span className="missionCardNeed">—</span>}</div></article></section><div style={{position:"fixed",bottom:"32px",left:0,right:0,display:"flex",justifyContent:"center",gap:"12px"}}><button className="secondaryAction" onClick={()=>setScreen("challengeSeparator4")}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{width:"auto",marginTop:0,padding:"12px 24px"}} onClick={()=>{setSelectedMission(mi);localStorage.setItem("envizi-quest-mission",String(mi+1));setScreen("briefing");}}>{isIt?"Avanti →":"Next →"}</button></div></main>;}
  if(screen==="challengeComplete4"&&profile){const isIt=language==="it";return <main style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#07110e",position:"relative"}}><header className="missionNav" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"24px"}}><p style={{margin:0,font:`700 14px var(--font-geist-mono)`,letterSpacing:".2em",color:"#39efb4",textTransform:"uppercase"}}>{isIt?"Sfida 4 completata":"Challenge 4 completed"}</p><h1 style={{fontSize:"clamp(60px,10vw,140px)",fontWeight:800,letterSpacing:"-.04em",color:"#f2fff9",margin:0,lineHeight:1}}>{isIt?"Hai completato\nla Sfida 4":"You completed\nChallenge 4"}</h1><div style={{width:"min(340px,80vw)",margin:"8px auto 0"}}>{renderTrustBar()}</div><div style={{display:"flex",gap:"12px",marginTop:"8px"}}><button className="secondaryAction" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{marginTop:0}} onClick={()=>setScreen("challengeSeparator5")}>{isIt?"Inizia la Sfida 5 →":"Start Challenge 5 →"}</button></div></div></main>;}
  if(screen==="challengeSeparator5"&&profile){const isIt=language==="it";return <main style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#07110e",position:"relative"}}><header className="missionNav" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><h1 style={{fontSize:"clamp(72px,12vw,160px)",fontWeight:800,letterSpacing:"-.04em",color:"#f2fff9",margin:0,lineHeight:1}}>{isIt?"Sfida 5":"Challenge 5"}</h1><div style={{width:"min(340px,80vw)",margin:"36px auto 0"}}>{renderTrustBar()}</div><div style={{display:"flex",gap:"12px",marginTop:"32px"}}><button className="secondaryAction" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{marginTop:0}} onClick={()=>setScreen("missionCard5")}>{isIt?"Avanti →":"Next →"}</button></div></main>;}
  if(screen==="missionCard5"&&profile){const isIt=language==="it";const mi=missionOrder[4];const m=missionCatalog[mi];const needs=needsByMissionHubFocused.find(([x])=>x===mi)?.[1]||[];const renderNeedsTable=(arr:typeof needs)=><table style={{width:"100%",borderCollapse:"collapse",fontSize:"29px"}}><thead><tr>{[isIt?"Esigenza":"Need",isIt?"Rile. / Crit.":"Rel. / Crit.",isIt?"Capacità Envizi":"Envizi capability"].map(h=><th key={h} style={{textAlign:"left",padding:"6px 10px",color:"#f2fff9",fontWeight:700,letterSpacing:".08em",borderBottom:"1px solid rgba(57,239,180,.35)",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead><tbody>{arr.map(n=>{const prioIdx=priorities.indexOf((n as any).priority);const relMax=prioIdx===0?10:prioIdx===1?8:prioIdx===2?6:4;const rel=Math.min(needRelevance[n.id]??Math.round(relMax/2),relMax);const relNorm=Math.round((rel/relMax)*10);const crit=needCriticality[n.id]??5;const cap=needIdToCapability[n.id];const capLabel=cap?(isIt?cap.it:cap.en):null;const tier=relNorm>7&&crit>7?"red":relNorm>4||crit>4?"yellow":"green";const tc=tier==="red"?"#ff4d4d":tier==="yellow"?"#7dd3fc":"#39efb4";return <tr key={n.id} style={{borderBottom:"1px solid rgba(255,255,255,.08)"}}><td style={{padding:"8px 10px",color:tc,lineHeight:1.35,fontWeight:500,overflow:"hidden",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as "vertical",display:"-webkit-box" as any}}>⬡ {n.label}</td><td style={{padding:"8px 10px",color:tc,whiteSpace:"nowrap",fontFamily:"var(--font-geist-mono)",fontSize:"27px",fontWeight:700}}>{`R:${relNorm} C:${crit}`}</td><td style={{padding:"8px 10px",color:tc,lineHeight:1.35,overflow:"hidden",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as "vertical",display:"-webkit-box" as any}}>{capLabel||"—"}</td></tr>;})}</tbody></table>;return <main className="missionMenuScreen"><header className="missionNav missionNavTrust" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="missionCards roadmapCards" style={{paddingTop:"80px",paddingBottom:"100px",display:"flex",justifyContent:"center",alignItems:"flex-start",minHeight:"100vh",overflowY:"auto"}}><article className="missionCard" style={{maxWidth:"960px",width:"100%",pointerEvents:"none"}}><div className="missionCardChallengeBox"><div className="missionCardTop"><span>05</span><i>{m.icon}</i></div><h2>{isIt?m.it:m.en}</h2></div><div className="missionCardNeedsBox">{needs.length>0?renderNeedsTable(needs):<span className="missionCardNeed">—</span>}</div></article></section><div style={{position:"fixed",bottom:"32px",left:0,right:0,display:"flex",justifyContent:"center",gap:"12px"}}><button className="secondaryAction" onClick={()=>setScreen("challengeSeparator5")}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{width:"auto",marginTop:0,padding:"12px 24px"}} onClick={()=>{setSelectedMission(mi);localStorage.setItem("envizi-quest-mission",String(mi+1));setScreen("briefing");}}>{isIt?"Avanti →":"Next →"}</button></div></main>;}
  if(screen==="challengeComplete5"&&profile){const isIt=language==="it";return <main style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#07110e",position:"relative"}}><header className="missionNav" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"24px"}}><p style={{margin:0,font:`700 14px var(--font-geist-mono)`,letterSpacing:".2em",color:"#39efb4",textTransform:"uppercase"}}>{isIt?"Sfida 5 completata":"Challenge 5 completed"}</p><h1 style={{fontSize:"clamp(60px,10vw,140px)",fontWeight:800,letterSpacing:"-.04em",color:"#f2fff9",margin:0,lineHeight:1}}>{isIt?"Hai completato\nla Sfida 5":"You completed\nChallenge 5"}</h1><div style={{width:"min(340px,80vw)",margin:"8px auto 0"}}>{renderTrustBar()}</div><div style={{display:"flex",gap:"12px",marginTop:"8px"}}><button className="secondaryAction" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{marginTop:0}} onClick={()=>setScreen("challengeSeparator6")}>{isIt?"Inizia la Sfida 6 →":"Start Challenge 6 →"}</button></div></div></main>;}
  if(screen==="challengeSeparator6"&&profile){const isIt=language==="it";return <main style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#07110e",position:"relative"}}><header className="missionNav" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><h1 style={{fontSize:"clamp(72px,12vw,160px)",fontWeight:800,letterSpacing:"-.04em",color:"#f2fff9",margin:0,lineHeight:1}}>{isIt?"Sfida 6":"Challenge 6"}</h1><div style={{width:"min(340px,80vw)",margin:"36px auto 0"}}>{renderTrustBar()}</div><div style={{display:"flex",gap:"12px",marginTop:"32px"}}><button className="secondaryAction" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{marginTop:0}} onClick={()=>setScreen("missionCard6")}>{isIt?"Avanti →":"Next →"}</button></div></main>;}
  if(screen==="missionCard6"&&profile){const isIt=language==="it";const mi=missionOrder[5];const m=missionCatalog[mi];const needs=needsByMissionHubFocused.find(([x])=>x===mi)?.[1]||[];const renderNeedsTable=(arr:typeof needs)=><table style={{width:"100%",borderCollapse:"collapse",fontSize:"29px"}}><thead><tr>{[isIt?"Esigenza":"Need",isIt?"Rile. / Crit.":"Rel. / Crit.",isIt?"Capacità Envizi":"Envizi capability"].map(h=><th key={h} style={{textAlign:"left",padding:"6px 10px",color:"#f2fff9",fontWeight:700,letterSpacing:".08em",borderBottom:"1px solid rgba(57,239,180,.35)",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead><tbody>{arr.map(n=>{const prioIdx=priorities.indexOf((n as any).priority);const relMax=prioIdx===0?10:prioIdx===1?8:prioIdx===2?6:4;const rel=Math.min(needRelevance[n.id]??Math.round(relMax/2),relMax);const relNorm=Math.round((rel/relMax)*10);const crit=needCriticality[n.id]??5;const cap=needIdToCapability[n.id];const capLabel=cap?(isIt?cap.it:cap.en):null;const tier=relNorm>7&&crit>7?"red":relNorm>4||crit>4?"yellow":"green";const tc=tier==="red"?"#ff4d4d":tier==="yellow"?"#7dd3fc":"#39efb4";return <tr key={n.id} style={{borderBottom:"1px solid rgba(255,255,255,.08)"}}><td style={{padding:"8px 10px",color:tc,lineHeight:1.35,fontWeight:500,overflow:"hidden",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as "vertical",display:"-webkit-box" as any}}>⬡ {n.label}</td><td style={{padding:"8px 10px",color:tc,whiteSpace:"nowrap",fontFamily:"var(--font-geist-mono)",fontSize:"27px",fontWeight:700}}>{`R:${relNorm} C:${crit}`}</td><td style={{padding:"8px 10px",color:tc,lineHeight:1.35,overflow:"hidden",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as "vertical",display:"-webkit-box" as any}}>{capLabel||"—"}</td></tr>;})}</tbody></table>;return <main className="missionMenuScreen"><header className="missionNav missionNavTrust" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="missionCards roadmapCards" style={{paddingTop:"80px",paddingBottom:"100px",display:"flex",justifyContent:"center",alignItems:"flex-start",minHeight:"100vh",overflowY:"auto"}}><article className="missionCard" style={{maxWidth:"960px",width:"100%",pointerEvents:"none"}}><div className="missionCardChallengeBox"><div className="missionCardTop"><span>06</span><i>{m.icon}</i></div><h2>{isIt?m.it:m.en}</h2></div><div className="missionCardNeedsBox">{needs.length>0?renderNeedsTable(needs):<span className="missionCardNeed">—</span>}</div></article></section><div style={{position:"fixed",bottom:"32px",left:0,right:0,display:"flex",justifyContent:"center",gap:"12px"}}><button className="secondaryAction" onClick={()=>setScreen("challengeSeparator6")}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{width:"auto",marginTop:0,padding:"12px 24px"}} onClick={()=>{setSelectedMission(mi);localStorage.setItem("envizi-quest-mission",String(mi+1));setScreen("briefing");}}>{isIt?"Avanti →":"Next →"}</button></div></main>;}
  if(screen==="challengeComplete6"&&profile){const isIt=language==="it";return <main style={{height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#07110e",position:"relative"}}><header className="missionNav" style={{position:"fixed",top:0,left:0,right:0}}><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> SFIDE</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><div style={{textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:"24px"}}><p style={{margin:0,font:`700 14px var(--font-geist-mono)`,letterSpacing:".2em",color:"#39efb4",textTransform:"uppercase"}}>{isIt?"Sfida 6 completata":"Challenge 6 completed"}</p><h1 style={{fontSize:"clamp(60px,10vw,140px)",fontWeight:800,letterSpacing:"-.04em",color:"#f2fff9",margin:0,lineHeight:1}}>{isIt?"Hai completato\ntutte le sfide!":"You completed\nall challenges!"}</h1><div style={{width:"min(340px,80vw)",margin:"8px auto 0"}}>{renderTrustBar()}</div><div style={{display:"flex",gap:"12px",marginTop:"8px"}}><button className="secondaryAction" onClick={()=>goBack()}>← {isIt?"Indietro":"Back"}</button><button className="actionButton" style={{marginTop:0}} onClick={()=>setScreen("summary")}>{isIt?"Vai al riepilogo →":"Go to summary →"}</button></div></div></main>;}

  if(screen==="energyFoundation"&&profile){
    const isIt=language==="it";
    const allRated=EF_REQUIREMENTS.every(r=>efRatings[r.id]);
    const efScore=Object.values(efRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
    const efPct=Math.min(100,Math.round(efScore));
    const efHighlight=efScore>=35;
    return <main className="dfScreen">
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {isIt?"ENERGIA E DECARBONIZZAZIONE":"ENERGY AND DECARBONISATION"}</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <div className="dfStickyBar">
        <div className="dfStickyLeft">
          <p className="eyebrow">{isIt?"PERCHÉ SELEZIONARE IBM ENVIZI · ENERGY ANALYTICS":"WHY SELECT IBM ENVIZI · ENERGY ANALYTICS"}</p>
          <h1>{isIt?"Quanto contano per te questi requisiti di energy management?":"How important are these energy management requirements for you?"}</h1>
          <p className="dfSubtitle">{isIt?"Basso = non in esame · Medio = in esame per il prossimo passo · Alto = urgente":"Low = not under review · Medium = under review for next step · High = urgent"}</p>
          {efHighlight&&<div className="dfScoreMsg"><span className="dfScoreMsgIcon">⬡</span><p>{isIt?"Molto probabilmente IBM Envizi è la soluzione per le tue esigenze energetiche.":"IBM Envizi is very likely the right solution for your energy management needs."}</p></div>}
        </div>
        <div className="dfStickyRight">
          <div className="dfScoreBox">
            <span className="dfScoreBoxLabel">{isIt?"Punteggio rilevanza":"Relevance score"}</span>
            <strong className={efHighlight?"dfScoreHigh":""}>{efScore}<em>/60</em></strong>
            <div className="dfScoreTrack"><span className="dfScoreFill" style={{width:`${efPct}%`,background:efHighlight?"#39efb4":"#ffc07c"}}/></div>
          </div>
          <button className="actionButton dfContinueBtn" disabled={!allRated} onClick={()=>setScreen("energyConclusion")}>{isIt?"Continua →":"Continue →"}</button>
          {!allRated&&<p className="dfHint">{isIt?"Valuta tutti i requisiti per continuare.":"Rate all requirements to continue."}</p>}
        </div>
      </div>
      <div className="dfColHeaders">
        <div className="dfColH dfColHReq">{isIt?"Requisito · Valutazione":"Requirement · Rating"}</div>
        <div className="dfColH dfColHCap">⬡ {isIt?"Capacità IBM Envizi":"IBM Envizi capability"}</div>
        <div className="dfColH dfColHBen">{isIt?"Beneficio ESG Manager":"ESG Manager benefit"}</div>
      </div>
      <div className="dfGrid">
        {EF_REQUIREMENTS.map((req,i)=>{
          const rating=efRatings[req.id];
          const isActive=rating==="medium"||rating==="high";
          const pts=rating==="high"?10:rating==="medium"?7.5:0;
          return <div key={req.id} className={`dfRow${isActive?" dfRowActive":""}${rating==="low"?" dfRowLow":""}`}>
            <div className="dfRowReq">
              <div className="dfRowReqTop"><span className="dfItemNum">{String(i+1).padStart(2,"0")}</span><p className="dfItemQ">{isIt?req.it:req.en}</p></div>
              <div className="dfRatingGroup">{(["low","medium","high"] as DFRating[]).map(v=><button key={v} className={`dfRatingBtn dfRatingBtn--${v}${rating===v?" dfRatingBtnActive":""}`} onClick={()=>setEfRating(req.id,v)}>{isIt?(v==="low"?"Basso":v==="medium"?"Medio +7,5":"Alto +10"):(v==="low"?"Low":v==="medium"?"Medium +7.5":"High +10")}</button>)}</div>
              {isActive&&<span className={`dfRowPts dfRowPts--${rating}`}>+{pts} pt</span>}
            </div>
            <div className={`dfRowCap${isActive?"":" dfRowColDim"}`}>{isActive?<><span className="dfRowColLabel">⬡ IBM Envizi</span><p>{isIt?req.capIt:req.capEn}</p></>:<span className="dfRowColEmpty">—</span>}</div>
            <div className={`dfRowBen${isActive?"":" dfRowColDim"}`}>{isActive?<><span className="dfRowColLabel">{isIt?"Beneficio":"Benefit"}</span><p>{isIt?req.benIt:req.benEn}</p></>:<span className="dfRowColEmpty">—</span>}</div>
          </div>;
        })}
      </div>
      <footer className="dfFooter">
        <p className="dfSources">{isIt?"Capacità basate su: ":"Capabilities based on: "}<a href="https://www.ibm.com/products/envizi/interval-meter-analytics" target="_blank" rel="noreferrer">Interval Meter Analytics ↗</a>{" · "}<a href="https://www.ibm.com/products/envizi/utility-bill-analytics" target="_blank" rel="noreferrer">Utility Bill Analytics ↗</a></p>
      </footer>
    </main>;
  }

  if(screen==="energyConclusion"&&profile){
    const isIt=language==="it";
    const efScore=Object.values(efRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
    const efPct=Math.min(100,Math.round(efScore));
    const efHighVery=efScore>=50;
    const efHighMaybe=efScore>=30;
    const efHighlight=efHighMaybe;
    const m1outcome=missionOutcomes[1];
    const decisionTaken=m1outcome?(isIt?{positive:"Envizi Utility Bill Analytics + Interval Meter Analytics",warning:"Cruscotto energetico manuale",critical:"Bollette e contatori separati"}[m1outcome]:{positive:"Envizi Utility Bill Analytics + Interval Meter Analytics",warning:"Manual energy dashboard",critical:"Bills and meters kept separate"}[m1outcome]):null;
    const decisionImg=m1outcome==="positive"?"./energy-envizi-analytics.png":m1outcome==="warning"?"./energy-manual-dashboard.png":"./energy-asis-fragmented.png";
    const decisionColor=m1outcome==="positive"?"#39efb4":m1outcome==="warning"?"#ffc07c":"#ff7777";
    const highReqs=EF_REQUIREMENTS.filter(r=>efRatings[r.id]==="high");
    const medReqs=EF_REQUIREMENTS.filter(r=>efRatings[r.id]==="medium");
    const accentColor=efHighVery?"#39efb4":efHighMaybe?"#ffc07c":"#57606a";
    const R=52,cx=64,cy=64,circ=2*Math.PI*R,arcLen=circ*0.75,fillLen=arcLen*(efPct/100);
    return <main className="dfScreen">
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {isIt?"ENERGIA E DECARBONIZZAZIONE":"ENERGY AND DECARBONISATION"}</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <div className="dfConclusionBody">
        <div className="dfcLeft">
          <p className="eyebrow" style={{letterSpacing:".18em",fontSize:"22px"}}>{isIt?"CONCLUSIONI · ENERGIA E DECARBONIZZAZIONE":"CONCLUSIONS · ENERGY AND DECARBONISATION"}</p>
          <h1 className="dfcTitle" style={{fontSize:"clamp(44px,4.4vw,64px)",fontWeight:800,lineHeight:1.1,marginBottom:4}}>{isIt?"La tua scelta per il controllo dell'energia":"Your energy management choice"}</h1>
          <div className="dfcGaugeWrap">
            <svg viewBox="0 0 128 128" className="dfcGaugeSvg">
              <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(57,239,180,.08)" strokeWidth="10" strokeDasharray={`${arcLen} ${circ}`} strokeDashoffset={circ*0.125} strokeLinecap="round"/>
              <circle cx={cx} cy={cy} r={R} fill="none" stroke={accentColor} strokeWidth="10" strokeDasharray={`${fillLen} ${circ}`} strokeDashoffset={circ*0.125} strokeLinecap="round" style={{filter:`drop-shadow(0 0 8px ${accentColor}88)`,transition:"stroke-dasharray .5s"}}/>
              <text x={cx} y={cy-6} textAnchor="middle" fontSize="28" fontWeight="800" fill={accentColor} fontFamily="inherit">{efScore}</text>
              <text x={cx} y={cy+14} textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(200,221,214,.5)" fontFamily="inherit">/60</text>
              <text x={cx} y={cy+30} textAnchor="middle" fontSize="9" fontWeight="700" fill="rgba(200,221,214,.35)" letterSpacing="1" fontFamily="inherit">{isIt?"RILEVANZA":"RELEVANCE"}</text>
            </svg>
            <p className="dfcGaugeVerdict" style={{color:accentColor}}>{efHighVery?(isIt?"Molto probabilmente IBM Envizi è la soluzione per le tue esigenze energetiche.":"IBM Envizi is very likely the right solution for your energy needs."):efHighMaybe?(isIt?"Probabilmente IBM Envizi è la soluzione per le tue esigenze energetiche.":"IBM Envizi is probably the right solution for your energy needs."):(isIt?"Approfondisci con il tuo team IBM.":"Explore further with your IBM team.")}</p>
          </div>
          {decisionTaken&&<div className="dfcDecisionCard" style={{borderColor:decisionColor+"55"}}>
            <img src={decisionImg} alt={decisionTaken} className="dfcDecisionCardImg"/>
            <div className="dfcDecisionCardBody">
              <small className="dfcDecisionCardLabel">{isIt?"DECISIONE ADOTTATA · MISSIONE 02":"DECISION ADOPTED · MISSION 02"}</small>
              <strong className="dfcDecisionCardValue" style={{color:decisionColor}}>{decisionTaken}</strong>
            </div>
          </div>}
          <div className="dfcActions">
            <button className="actionButton dfcActionSecondary" onClick={()=>goBack()}>{isIt?"← Indietro":"← Back"}</button>
            <button className="actionButton" style={{whiteSpace:"nowrap"}} onClick={()=>setScreen("challengeComplete5")}>{isIt?"Completa Sfida 5 →":"Complete Challenge 5 →"}</button>
          </div>
        </div>
        <div className="dfcRight">
          {efHighlight&&<p className="dfcIntroTitle">{isIt?"Perché Envizi risponde alle tue priorità:":"Why Envizi addresses your priorities:"}</p>}
          {([{reqs:highReqs,accent:"#39efb4",label:isIt?"FATTORI MOLTO RILEVANTI":"HIGHLY RELEVANT FACTORS"},{reqs:medReqs,accent:"#ffc07c",label:isIt?"FATTORI MEDIAMENTE RILEVANTI":"MODERATELY RELEVANT FACTORS"}] as {reqs:typeof highReqs,accent:string,label:string}[]).map(({reqs,accent,label})=>reqs.length>0&&<section key={label} className="dfcSection"><p className="dfcSectionLabel" style={{color:accent}}>{label}</p>{reqs.map(r=><div key={r.id} className="dfcHRow" style={{"--dfcAccent":accent} as React.CSSProperties}><p className="dfcHRowTitle">{isIt?r.it:r.en}</p><div className="dfcHChips"><div className="dfcHChip dfcHChipCap"><span className="dfcHChipLabel">{isIt?"Capacità Envizi":"Envizi capability"}</span><p className="dfcHChipText">{isIt?r.capIt:r.capEn}</p></div><div className="dfcHChip dfcHChipBen"><span className="dfcHChipLabel">{isIt?"Beneficio":"Benefit"}</span><p className="dfcHChipText">{isIt?r.benIt:r.benEn}</p></div></div></div>)}</section>)}
        </div>
      </div>
    </main>;
  }

  // ── COINVOLGIMENTO SUPPLY CHAIN — Foundation + Conclusion ───────────────────
  if(screen==="supplyFoundation"&&profile){
    const isIt=language==="it";
    const allRated=SC_REQUIREMENTS.every(r=>scRatings[r.id]);
    const scScore=Object.values(scRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
    const scPct=Math.min(100,Math.round(scScore));
    const scHighlight=scScore>=35;
    return <main className="dfScreen">
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {isIt?"COINVOLGIMENTO SUPPLY CHAIN":"SUPPLY CHAIN ENGAGEMENT"}</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <div className="dfStickyBar">
        <div className="dfStickyLeft">
          <p className="eyebrow">{isIt?"PERCHÉ SELEZIONARE IBM ENVIZI · SUPPLY CHAIN INTELLIGENCE":"WHY SELECT IBM ENVIZI · SUPPLY CHAIN INTELLIGENCE"}</p>
          <h1>{isIt?"Quanto contano per te questi requisiti di supply chain?":"How important are these supply chain requirements for you?"}</h1>
          <p className="dfSubtitle">{isIt?"Basso = non in esame · Medio = in esame per il prossimo passo · Alto = urgente":"Low = not under review · Medium = under review for next step · High = urgent"}</p>
          {scHighlight&&<div className="dfScoreMsg"><span className="dfScoreMsgIcon">⬡</span><p>{isIt?"Molto probabilmente IBM Envizi è la soluzione per le tue esigenze Scope 3 e supply chain.":"IBM Envizi is very likely the right solution for your Scope 3 and supply chain needs."}</p></div>}
        </div>
        <div className="dfStickyRight">
          <div className="dfScoreBox">
            <span className="dfScoreBoxLabel">{isIt?"Punteggio rilevanza":"Relevance score"}</span>
            <strong className={scHighlight?"dfScoreHigh":""}>{scScore}<em>/60</em></strong>
            <div className="dfScoreTrack"><span className="dfScoreFill" style={{width:`${scPct}%`,background:scHighlight?"#39efb4":"#ffc07c"}}/></div>
          </div>
          <button className="actionButton dfContinueBtn" disabled={!allRated} onClick={()=>setScreen("supplyConclusion")}>{isIt?"Continua →":"Continue →"}</button>
          {!allRated&&<p className="dfHint">{isIt?"Valuta tutti i requisiti per continuare.":"Rate all requirements to continue."}</p>}
        </div>
      </div>
      <div className="dfColHeaders">
        <div className="dfColH dfColHReq">{isIt?"Requisito · Valutazione":"Requirement · Rating"}</div>
        <div className="dfColH dfColHCap">⬡ {isIt?"Capacità IBM Envizi":"IBM Envizi capability"}</div>
        <div className="dfColH dfColHBen">{isIt?"Beneficio ESG Manager":"ESG Manager benefit"}</div>
      </div>
      <div className="dfGrid">
        {SC_REQUIREMENTS.map((req,i)=>{
          const rating=scRatings[req.id];
          const isActive=rating==="medium"||rating==="high";
          const pts=rating==="high"?10:rating==="medium"?7.5:0;
          return <div key={req.id} className={`dfRow${isActive?" dfRowActive":""}${rating==="low"?" dfRowLow":""}`}>
            <div className="dfRowReq">
              <div className="dfRowReqTop"><span className="dfItemNum">{String(i+1).padStart(2,"0")}</span><p className="dfItemQ">{isIt?req.it:req.en}</p></div>
              <div className="dfRatingGroup">{(["low","medium","high"] as DFRating[]).map(v=><button key={v} className={`dfRatingBtn dfRatingBtn--${v}${rating===v?" dfRatingBtnActive":""}`} onClick={()=>setScRating(req.id,v)}>{isIt?(v==="low"?"Basso":v==="medium"?"Medio +7,5":"Alto +10"):(v==="low"?"Low":v==="medium"?"Medium +7.5":"High +10")}</button>)}</div>
              {isActive&&<span className={`dfRowPts dfRowPts--${rating}`}>+{pts} pt</span>}
            </div>
            <div className={`dfRowCap${isActive?"":" dfRowColDim"}`}>{isActive?<><span className="dfRowColLabel">⬡ IBM Envizi</span><p>{isIt?req.capIt:req.capEn}</p></>:<span className="dfRowColEmpty">—</span>}</div>
            <div className={`dfRowBen${isActive?"":" dfRowColDim"}`}>{isActive?<><span className="dfRowColLabel">{isIt?"Beneficio":"Benefit"}</span><p>{isIt?req.benIt:req.benEn}</p></>:<span className="dfRowColEmpty">—</span>}</div>
          </div>;
        })}
      </div>
      <footer className="dfFooter">
        <p className="dfSources">{isIt?"Capacità basate su: ":"Capabilities based on: "}<a href="https://www.ibm.com/products/envizi/supply-chain-intelligence" target="_blank" rel="noreferrer">Supply Chain Intelligence ↗</a>{" · "}<a href="https://www.ibm.com/products/envizi/scope-3-ghg-accounting-reporting" target="_blank" rel="noreferrer">Scope 3 GHG Accounting ↗</a></p>
      </footer>
    </main>;
  }

  if(screen==="supplyConclusion"&&profile){
    const isIt=language==="it";
    const scScore=Object.values(scRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
    const scPct=Math.min(100,Math.round(scScore));
    const scHighVery=scScore>=50;
    const scHighMaybe=scScore>=30;
    const scHighlight=scHighMaybe;
    const m2outcome=missionOutcomes[2];
    const decisionTaken=m2outcome?(isIt?{positive:"Envizi Surveys + Assessments e Supply Chain Intelligence",warning:"Portale questionari separato",critical:"E-mail e fogli separati"}[m2outcome]:{positive:"Envizi Surveys + Assessments and Supply Chain Intelligence",warning:"Separate questionnaire portal",critical:"Email and separate spreadsheets"}[m2outcome]):null;
    const decisionImg=m2outcome==="positive"?"./supply-chain-envizi.png":m2outcome==="warning"?"./supply-chain-portal.png":"./supply-chain-asis.png";
    const decisionColor=m2outcome==="positive"?"#39efb4":m2outcome==="warning"?"#ffc07c":"#ff7777";
    const highReqs=SC_REQUIREMENTS.filter(r=>scRatings[r.id]==="high");
    const medReqs=SC_REQUIREMENTS.filter(r=>scRatings[r.id]==="medium");
    const accentColor=scHighVery?"#39efb4":scHighMaybe?"#ffc07c":"#57606a";
    const R=52,cx=64,cy=64,circ=2*Math.PI*R,arcLen=circ*0.75,fillLen=arcLen*(scPct/100);
    return <main className="dfScreen">
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {isIt?"COINVOLGIMENTO SUPPLY CHAIN":"SUPPLY CHAIN ENGAGEMENT"}</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <div className="dfConclusionBody">
        <div className="dfcLeft">
          <p className="eyebrow" style={{letterSpacing:".18em",fontSize:"22px"}}>{isIt?"CONCLUSIONI · SUPPLY CHAIN ENGAGEMENT":"CONCLUSIONS · SUPPLY CHAIN ENGAGEMENT"}</p>
          <h1 className="dfcTitle" style={{fontSize:"clamp(44px,4.4vw,64px)",fontWeight:800,lineHeight:1.1,marginBottom:4}}>{isIt?"La tua scelta per il coinvolgimento della supply chain":"Your supply chain engagement choice"}</h1>
          <div className="dfcGaugeWrap">
            <svg viewBox="0 0 128 128" className="dfcGaugeSvg"><circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(57,239,180,.08)" strokeWidth="10" strokeDasharray={`${arcLen} ${circ}`} strokeDashoffset={circ*0.125} strokeLinecap="round"/><circle cx={cx} cy={cy} r={R} fill="none" stroke={accentColor} strokeWidth="10" strokeDasharray={`${fillLen} ${circ}`} strokeDashoffset={circ*0.125} strokeLinecap="round" style={{filter:`drop-shadow(0 0 8px ${accentColor}88)`,transition:"stroke-dasharray .5s"}}/><text x={cx} y={cy-6} textAnchor="middle" fontSize="28" fontWeight="800" fill={accentColor} fontFamily="inherit">{scScore}</text><text x={cx} y={cy+14} textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(200,221,214,.5)" fontFamily="inherit">/60</text><text x={cx} y={cy+30} textAnchor="middle" fontSize="9" fontWeight="700" fill="rgba(200,221,214,.35)" letterSpacing="1" fontFamily="inherit">{isIt?"RILEVANZA":"RELEVANCE"}</text></svg>
            <p className="dfcGaugeVerdict" style={{color:accentColor}}>{scHighVery?(isIt?"Molto probabilmente IBM Envizi è la soluzione per le tue esigenze Scope 3 e supply chain.":"IBM Envizi is very likely the right solution for your Scope 3 and supply chain needs."):scHighMaybe?(isIt?"Probabilmente IBM Envizi è la soluzione per le tue esigenze Scope 3 e supply chain.":"IBM Envizi is probably the right solution for your Scope 3 and supply chain needs."):(isIt?"Approfondisci con il tuo team IBM.":"Explore further with your IBM team.")}</p>
          </div>
          {decisionTaken&&<div className="dfcDecisionCard" style={{borderColor:decisionColor+"55"}}><img src={decisionImg} alt={decisionTaken} className="dfcDecisionCardImg"/><div className="dfcDecisionCardBody"><small className="dfcDecisionCardLabel">{isIt?"DECISIONE ADOTTATA · MISSIONE 03":"DECISION ADOPTED · MISSION 03"}</small><strong className="dfcDecisionCardValue" style={{color:decisionColor}}>{decisionTaken}</strong></div></div>}
          <div className="dfcActions">
            <button className="actionButton dfcActionSecondary" onClick={()=>goBack()}>{isIt?"← Indietro":"← Back"}</button>
            <button className="actionButton" style={{whiteSpace:"nowrap"}} onClick={()=>setScreen("challengeComplete4")}>{isIt?"Completa Sfida 4 →":"Complete Challenge 4 →"}</button>
          </div>
        </div>
        <div className="dfcRight">
          {scHighlight&&<p className="dfcIntroTitle">{isIt?"Perché Envizi risponde alle tue priorità:":"Why Envizi addresses your priorities:"}</p>}
          {([{reqs:highReqs,accent:"#39efb4",label:isIt?"FATTORI MOLTO RILEVANTI":"HIGHLY RELEVANT FACTORS"},{reqs:medReqs,accent:"#ffc07c",label:isIt?"FATTORI MEDIAMENTE RILEVANTI":"MODERATELY RELEVANT FACTORS"}] as {reqs:typeof highReqs,accent:string,label:string}[]).map(({reqs,accent,label})=>reqs.length>0&&<section key={label} className="dfcSection"><p className="dfcSectionLabel" style={{color:accent}}>{label}</p>{reqs.map(r=><div key={r.id} className="dfcHRow" style={{"--dfcAccent":accent} as React.CSSProperties}><p className="dfcHRowTitle">{isIt?r.it:r.en}</p><div className="dfcHChips"><div className="dfcHChip dfcHChipCap"><span className="dfcHChipLabel">{isIt?"Capacità Envizi":"Envizi capability"}</span><p className="dfcHChipText">{isIt?r.capIt:r.capEn}</p></div><div className="dfcHChip dfcHChipBen"><span className="dfcHChipLabel">{isIt?"Beneficio":"Benefit"}</span><p className="dfcHChipText">{isIt?r.benIt:r.benEn}</p></div></div></div>)}</section>)}
        </div>
      </div>
    </main>;
  }

  // ── ROTTA VERSO NET ZERO — Foundation + Conclusion ──────────────────────────
  if(screen==="planningFoundation"&&profile){
    const isIt=language==="it";
    const allRated=PL_REQUIREMENTS.every(r=>plRatings[r.id]);
    const plScore=Object.values(plRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
    const plPct=Math.min(100,Math.round(plScore));
    const plHighlight=plScore>=35;
    return <main className="dfScreen">
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {isIt?"ROTTA VERSO NET ZERO":"NET ZERO PATHWAY"}</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <div className="dfStickyBar">
        <div className="dfStickyLeft">
          <p className="eyebrow">{isIt?"PERCHÉ SELEZIONARE IBM ENVIZI · PLANNING E SCENARIO MODELER":"WHY SELECT IBM ENVIZI · PLANNING & SCENARIO MODELER"}</p>
          <h1>{isIt?"Quanto contano per te questi requisiti di pianificazione Net Zero?":"How important are these Net Zero planning requirements for you?"}</h1>
          <p className="dfSubtitle">{isIt?"Basso = non in esame · Medio = in esame per il prossimo passo · Alto = urgente":"Low = not under review · Medium = under review for next step · High = urgent"}</p>
          {plHighlight&&<div className="dfScoreMsg"><span className="dfScoreMsgIcon">⬡</span><p>{isIt?"Molto probabilmente IBM Envizi è la soluzione per la tua pianificazione della decarbonizzazione.":"IBM Envizi is very likely the right solution for your decarbonisation planning needs."}</p></div>}
        </div>
        <div className="dfStickyRight">
          <div className="dfScoreBox">
            <span className="dfScoreBoxLabel">{isIt?"Punteggio rilevanza":"Relevance score"}</span>
            <strong className={plHighlight?"dfScoreHigh":""}>{plScore}<em>/60</em></strong>
            <div className="dfScoreTrack"><span className="dfScoreFill" style={{width:`${plPct}%`,background:plHighlight?"#39efb4":"#ffc07c"}}/></div>
          </div>
          <button className="actionButton dfContinueBtn" disabled={!allRated} onClick={()=>setScreen("planningConclusion")}>{isIt?"Continua →":"Continue →"}</button>
          {!allRated&&<p className="dfHint">{isIt?"Valuta tutti i requisiti per continuare.":"Rate all requirements to continue."}</p>}
        </div>
      </div>
      <div className="dfColHeaders">
        <div className="dfColH dfColHReq">{isIt?"Requisito · Valutazione":"Requirement · Rating"}</div>
        <div className="dfColH dfColHCap">⬡ {isIt?"Capacità IBM Envizi":"IBM Envizi capability"}</div>
        <div className="dfColH dfColHBen">{isIt?"Beneficio ESG Manager":"ESG Manager benefit"}</div>
      </div>
      <div className="dfGrid">
        {PL_REQUIREMENTS.map((req,i)=>{
          const rating=plRatings[req.id];
          const isActive=rating==="medium"||rating==="high";
          const pts=rating==="high"?10:rating==="medium"?7.5:0;
          return <div key={req.id} className={`dfRow${isActive?" dfRowActive":""}${rating==="low"?" dfRowLow":""}`}>
            <div className="dfRowReq">
              <div className="dfRowReqTop"><span className="dfItemNum">{String(i+1).padStart(2,"0")}</span><p className="dfItemQ">{isIt?req.it:req.en}</p></div>
              <div className="dfRatingGroup">{(["low","medium","high"] as DFRating[]).map(v=><button key={v} className={`dfRatingBtn dfRatingBtn--${v}${rating===v?" dfRatingBtnActive":""}`} onClick={()=>setPlRating(req.id,v)}>{isIt?(v==="low"?"Basso":v==="medium"?"Medio +7,5":"Alto +10"):(v==="low"?"Low":v==="medium"?"Medium +7.5":"High +10")}</button>)}</div>
              {isActive&&<span className={`dfRowPts dfRowPts--${rating}`}>+{pts} pt</span>}
            </div>
            <div className={`dfRowCap${isActive?"":" dfRowColDim"}`}>{isActive?<><span className="dfRowColLabel">⬡ IBM Envizi</span><p>{isIt?req.capIt:req.capEn}</p></>:<span className="dfRowColEmpty">—</span>}</div>
            <div className={`dfRowBen${isActive?"":" dfRowColDim"}`}>{isActive?<><span className="dfRowColLabel">{isIt?"Beneficio":"Benefit"}</span><p>{isIt?req.benIt:req.benEn}</p></>:<span className="dfRowColEmpty">—</span>}</div>
          </div>;
        })}
      </div>
      <footer className="dfFooter">
        <p className="dfSources">{isIt?"Capacità basate su: ":"Capabilities based on: "}<a href="https://www.ibm.com/products/envizi/scenario-modeler" target="_blank" rel="noreferrer">Scenario Modeler ↗</a>{" · "}<a href="https://www.ibm.com/products/envizi/sustainability-program-tracking" target="_blank" rel="noreferrer">Sustainability Program Tracking ↗</a></p>
      </footer>
    </main>;
  }

  if(screen==="planningConclusion"&&profile){
    const isIt=language==="it";
    const plScore=Object.values(plRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
    const plPct=Math.min(100,Math.round(plScore));
    const plHighVery=plScore>=50;
    const plHighMaybe=plScore>=30;
    const plHighlight=plHighMaybe;
    const m4outcome=missionOutcomes[4];
    const decisionTaken=m4outcome?(isIt?{positive:"Envizi Scenario Modeler + Program Tracking + Planning Analytics",warning:"Portafoglio progetti in foglio e project tool",critical:"Nessun modello di pianificazione"}[m4outcome]:{positive:"Envizi Scenario Modeler + Program Tracking + Planning Analytics",warning:"Project portfolio in spreadsheets and project tool",critical:"No planning model"}[m4outcome]):null;
    const decisionImg=m4outcome==="positive"?"./planning-envizi.png":m4outcome==="warning"?"./planning-intermediate.png":"./planning-asis.png";
    const decisionColor=m4outcome==="positive"?"#39efb4":m4outcome==="warning"?"#ffc07c":"#ff7777";
    const highReqs=PL_REQUIREMENTS.filter(r=>plRatings[r.id]==="high");
    const medReqs=PL_REQUIREMENTS.filter(r=>plRatings[r.id]==="medium");
    const accentColor=plHighVery?"#39efb4":plHighMaybe?"#ffc07c":"#57606a";
    const R=52,cx=64,cy=64,circ=2*Math.PI*R,arcLen=circ*0.75,fillLen=arcLen*(plPct/100);
    return <main className="dfScreen">
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {isIt?"ROTTA VERSO NET ZERO":"NET ZERO PATHWAY"}</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <div className="dfConclusionBody">
        <div className="dfcLeft">
          <p className="eyebrow" style={{letterSpacing:".18em",fontSize:"22px"}}>{isIt?"CONCLUSIONI · ROTTA VERSO NET ZERO":"CONCLUSIONS · NET ZERO PATHWAY"}</p>
          <h1 className="dfcTitle" style={{fontSize:"clamp(44px,4.4vw,64px)",fontWeight:800,lineHeight:1.1,marginBottom:4}}>{isIt?"La tua scelta per il piano di decarbonizzazione":"Your decarbonisation planning choice"}</h1>
          <div className="dfcGaugeWrap">
            <svg viewBox="0 0 128 128" className="dfcGaugeSvg"><circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(57,239,180,.08)" strokeWidth="10" strokeDasharray={`${arcLen} ${circ}`} strokeDashoffset={circ*0.125} strokeLinecap="round"/><circle cx={cx} cy={cy} r={R} fill="none" stroke={accentColor} strokeWidth="10" strokeDasharray={`${fillLen} ${circ}`} strokeDashoffset={circ*0.125} strokeLinecap="round" style={{filter:`drop-shadow(0 0 8px ${accentColor}88)`,transition:"stroke-dasharray .5s"}}/><text x={cx} y={cy-6} textAnchor="middle" fontSize="28" fontWeight="800" fill={accentColor} fontFamily="inherit">{plScore}</text><text x={cx} y={cy+14} textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(200,221,214,.5)" fontFamily="inherit">/60</text><text x={cx} y={cy+30} textAnchor="middle" fontSize="9" fontWeight="700" fill="rgba(200,221,214,.35)" letterSpacing="1" fontFamily="inherit">{isIt?"RILEVANZA":"RELEVANCE"}</text></svg>
            <p className="dfcGaugeVerdict" style={{color:accentColor}}>{plHighVery?(isIt?"Molto probabilmente IBM Envizi è la soluzione per la tua pianificazione della decarbonizzazione.":"IBM Envizi is very likely the right solution for your decarbonisation planning needs."):plHighMaybe?(isIt?"Probabilmente IBM Envizi è la soluzione per la tua pianificazione della decarbonizzazione.":"IBM Envizi is probably the right solution for your decarbonisation planning needs."):(isIt?"Approfondisci con il tuo team IBM.":"Explore further with your IBM team.")}</p>
          </div>
          {decisionTaken&&<div className="dfcDecisionCard" style={{borderColor:decisionColor+"55"}}><img src={decisionImg} alt={decisionTaken} className="dfcDecisionCardImg"/><div className="dfcDecisionCardBody"><small className="dfcDecisionCardLabel">{isIt?"DECISIONE ADOTTATA · MISSIONE 05":"DECISION ADOPTED · MISSION 05"}</small><strong className="dfcDecisionCardValue" style={{color:decisionColor}}>{decisionTaken}</strong></div></div>}
          <div className="dfcActions">
            <button className="actionButton dfcActionSecondary" onClick={()=>goBack()}>{isIt?"← Indietro":"← Back"}</button>
            <button className="actionButton" style={{whiteSpace:"nowrap"}} onClick={()=>setScreen("challengeComplete6")}>{isIt?"Completa Sfida 6 →":"Complete Challenge 6 →"}</button>
          </div>
        </div>
        <div className="dfcRight">
          {plHighlight&&<p className="dfcIntroTitle">{isIt?"Perché Envizi risponde alle tue priorità:":"Why Envizi addresses your priorities:"}</p>}
          {([{reqs:highReqs,accent:"#39efb4",label:isIt?"FATTORI MOLTO RILEVANTI":"HIGHLY RELEVANT FACTORS"},{reqs:medReqs,accent:"#ffc07c",label:isIt?"FATTORI MEDIAMENTE RILEVANTI":"MODERATELY RELEVANT FACTORS"}] as {reqs:typeof highReqs,accent:string,label:string}[]).map(({reqs,accent,label})=>reqs.length>0&&<section key={label} className="dfcSection"><p className="dfcSectionLabel" style={{color:accent}}>{label}</p>{reqs.map(r=><div key={r.id} className="dfcHRow" style={{"--dfcAccent":accent} as React.CSSProperties}><p className="dfcHRowTitle">{isIt?r.it:r.en}</p><div className="dfcHChips"><div className="dfcHChip dfcHChipCap"><span className="dfcHChipLabel">{isIt?"Capacità Envizi":"Envizi capability"}</span><p className="dfcHChipText">{isIt?r.capIt:r.capEn}</p></div><div className="dfcHChip dfcHChipBen"><span className="dfcHChipLabel">{isIt?"Beneficio":"Benefit"}</span><p className="dfcHChipText">{isIt?r.benIt:r.benEn}</p></div></div></div>)}</section>)}
        </div>
      </div>
    </main>;
  }

  // ── FRAMEWORK ESG E DISCLOSURE — Foundation + Conclusion ───────────────────
  if(screen==="frameworkFoundation"&&profile){
    const isIt=language==="it";
    const allRated=FR_REQUIREMENTS.every(r=>frRatings[r.id]);
    const frScore=Object.values(frRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
    const frPct=Math.min(100,Math.round(frScore));
    const frHighlight=frScore>=35;
    return <main className="dfScreen">
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {isIt?"FRAMEWORK ESG E DISCLOSURE":"ESG FRAMEWORKS AND DISCLOSURE"}</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <div className="dfStickyBar">
        <div className="dfStickyLeft">
          <p className="eyebrow">{isIt?"PERCHÉ SELEZIONARE IBM ENVIZI · SUSTAINABILITY REPORTING MANAGER":"WHY SELECT IBM ENVIZI · SUSTAINABILITY REPORTING MANAGER"}</p>
          <h1>{isIt?"Quanto contano per te questi requisiti di gestione framework e disclosure?":"How important are these framework management and disclosure requirements for you?"}</h1>
          <p className="dfSubtitle">{isIt?"Basso = non in esame · Medio = in esame per il prossimo passo · Alto = urgente":"Low = not under review · Medium = under review for next step · High = urgent"}</p>
          {frHighlight&&<div className="dfScoreMsg"><span className="dfScoreMsgIcon">⬡</span><p>{isIt?"Molto probabilmente IBM Envizi è la soluzione per la tua gestione dei framework ESG.":"IBM Envizi is very likely the right solution for your ESG framework management needs."}</p></div>}
        </div>
        <div className="dfStickyRight">
          <div className="dfScoreBox">
            <span className="dfScoreBoxLabel">{isIt?"Punteggio rilevanza":"Relevance score"}</span>
            <strong className={frHighlight?"dfScoreHigh":""}>{frScore}<em>/60</em></strong>
            <div className="dfScoreTrack"><span className="dfScoreFill" style={{width:`${frPct}%`,background:frHighlight?"#39efb4":"#ffc07c"}}/></div>
          </div>
          <button className="actionButton dfContinueBtn" disabled={!allRated} onClick={()=>setScreen("frameworkConclusion")}>{isIt?"Continua →":"Continue →"}</button>
          {!allRated&&<p className="dfHint">{isIt?"Valuta tutti i requisiti per continuare.":"Rate all requirements to continue."}</p>}
        </div>
      </div>
      <div className="dfColHeaders">
        <div className="dfColH dfColHReq">{isIt?"Requisito · Valutazione":"Requirement · Rating"}</div>
        <div className="dfColH dfColHCap">⬡ {isIt?"Capacità IBM Envizi":"IBM Envizi capability"}</div>
        <div className="dfColH dfColHBen">{isIt?"Beneficio ESG Manager":"ESG Manager benefit"}</div>
      </div>
      <div className="dfGrid">
        {FR_REQUIREMENTS.map((req,i)=>{
          const rating=frRatings[req.id];
          const isActive=rating==="medium"||rating==="high";
          const pts=rating==="high"?10:rating==="medium"?7.5:0;
          return <div key={req.id} className={`dfRow${isActive?" dfRowActive":""}${rating==="low"?" dfRowLow":""}`}>
            <div className="dfRowReq">
              <div className="dfRowReqTop"><span className="dfItemNum">{String(i+1).padStart(2,"0")}</span><p className="dfItemQ">{isIt?req.it:req.en}</p></div>
              <div className="dfRatingGroup">{(["low","medium","high"] as DFRating[]).map(v=><button key={v} className={`dfRatingBtn dfRatingBtn--${v}${rating===v?" dfRatingBtnActive":""}`} onClick={()=>setFrRating(req.id,v)}>{isIt?(v==="low"?"Basso":v==="medium"?"Medio +7,5":"Alto +10"):(v==="low"?"Low":v==="medium"?"Medium +7.5":"High +10")}</button>)}</div>
              {isActive&&<span className={`dfRowPts dfRowPts--${rating}`}>+{pts} pt</span>}
            </div>
            <div className={`dfRowCap${isActive?"":" dfRowColDim"}`}>{isActive?<><span className="dfRowColLabel">⬡ IBM Envizi</span><p>{isIt?req.capIt:req.capEn}</p></>:<span className="dfRowColEmpty">—</span>}</div>
            <div className={`dfRowBen${isActive?"":" dfRowColDim"}`}>{isActive?<><span className="dfRowColLabel">{isIt?"Beneficio":"Benefit"}</span><p>{isIt?req.benIt:req.benEn}</p></>:<span className="dfRowColEmpty">—</span>}</div>
          </div>;
        })}
      </div>
      <footer className="dfFooter">
        <p className="dfSources">{isIt?"Capacità basate su: ":"Capabilities based on: "}<a href="https://www.ibm.com/products/envizi/esg-reporting-frameworks" target="_blank" rel="noreferrer">ESG Reporting Frameworks ↗</a>{" · "}<a href="https://www.ibm.com/products/envizi/sustainability-reporting-manager" target="_blank" rel="noreferrer">Sustainability Reporting Manager ↗</a></p>
      </footer>
    </main>;
  }

  if(screen==="frameworkConclusion"&&profile){
    const isIt=language==="it";
    const frScore=Object.values(frRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
    const frPct=Math.min(100,Math.round(frScore));
    const frHighVery=frScore>=50;
    const frHighMaybe=frScore>=30;
    const frHighlight=frHighMaybe;
    const m5outcome=missionOutcomes[5];
    const decisionTaken=m5outcome?(isIt?{positive:"Envizi ESG Reporting Frameworks con gestione integrata dei requisiti",warning:"Tool documentale con template framework",critical:"File locali aggiornati manualmente"}[m5outcome]:{positive:"Envizi ESG Reporting Frameworks with integrated requirements management",warning:"Document management tool with framework templates",critical:"Manually updated local files"}[m5outcome]):null;
    const decisionImg=m5outcome==="positive"?"./framework-envizi.png":m5outcome==="warning"?"./framework-intermediate.png":"./framework-asis.png";
    const decisionColor=m5outcome==="positive"?"#39efb4":m5outcome==="warning"?"#ffc07c":"#ff7777";
    const highReqs=FR_REQUIREMENTS.filter(r=>frRatings[r.id]==="high");
    const medReqs=FR_REQUIREMENTS.filter(r=>frRatings[r.id]==="medium");
    const accentColor=frHighVery?"#39efb4":frHighMaybe?"#ffc07c":"#57606a";
    const R=52,cx=64,cy=64,circ=2*Math.PI*R,arcLen=circ*0.75,fillLen=arcLen*(frPct/100);
    return <main className="dfScreen">
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {isIt?"FRAMEWORK ESG E DISCLOSURE":"ESG FRAMEWORKS AND DISCLOSURE"}</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <div className="dfConclusionBody">
        <div className="dfcLeft">
          <p className="eyebrow" style={{letterSpacing:".18em",fontSize:"22px"}}>{isIt?"CONCLUSIONI · FRAMEWORK ESG E DISCLOSURE":"CONCLUSIONS · ESG FRAMEWORKS AND DISCLOSURE"}</p>
          <h1 className="dfcTitle" style={{fontSize:"clamp(44px,4.4vw,64px)",fontWeight:800,lineHeight:1.1,marginBottom:4}}>{isIt?"La tua scelta per la gestione dei framework ESG":"Your ESG framework management choice"}</h1>
          <div className="dfcGaugeWrap">
            <svg viewBox="0 0 128 128" className="dfcGaugeSvg"><circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(57,239,180,.08)" strokeWidth="10" strokeDasharray={`${arcLen} ${circ}`} strokeDashoffset={circ*0.125} strokeLinecap="round"/><circle cx={cx} cy={cy} r={R} fill="none" stroke={accentColor} strokeWidth="10" strokeDasharray={`${fillLen} ${circ}`} strokeDashoffset={circ*0.125} strokeLinecap="round" style={{filter:`drop-shadow(0 0 8px ${accentColor}88)`,transition:"stroke-dasharray .5s"}}/><text x={cx} y={cy-6} textAnchor="middle" fontSize="28" fontWeight="800" fill={accentColor} fontFamily="inherit">{frScore}</text><text x={cx} y={cy+14} textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(200,221,214,.5)" fontFamily="inherit">/60</text><text x={cx} y={cy+30} textAnchor="middle" fontSize="9" fontWeight="700" fill="rgba(200,221,214,.35)" letterSpacing="1" fontFamily="inherit">{isIt?"RILEVANZA":"RELEVANCE"}</text></svg>
            <p className="dfcGaugeVerdict" style={{color:accentColor}}>{frHighVery?(isIt?"Molto probabilmente IBM Envizi è la soluzione per la tua gestione dei framework ESG.":"IBM Envizi is very likely the right solution for your ESG framework management needs."):frHighMaybe?(isIt?"Probabilmente IBM Envizi è la soluzione per la tua gestione dei framework ESG.":"IBM Envizi is probably the right solution for your ESG framework management needs."):(isIt?"Approfondisci con il tuo team IBM.":"Explore further with your IBM team.")}</p>
          </div>
          {decisionTaken&&<div className="dfcDecisionCard" style={{borderColor:decisionColor+"55"}}><img src={decisionImg} alt={decisionTaken} className="dfcDecisionCardImg"/><div className="dfcDecisionCardBody"><small className="dfcDecisionCardLabel">{isIt?"DECISIONE ADOTTATA · MISSIONE 06":"DECISION ADOPTED · MISSION 06"}</small><strong className="dfcDecisionCardValue" style={{color:decisionColor}}>{decisionTaken}</strong></div></div>}
          <div className="dfcActions">
            <button className="actionButton dfcActionSecondary" onClick={()=>goBack()}>{isIt?"← Indietro":"← Back"}</button>
            <button className="actionButton" style={{whiteSpace:"nowrap"}} onClick={()=>setScreen("challengeComplete3")}>{isIt?"Completa Sfida 3 →":"Complete Challenge 3 →"}</button>
          </div>
        </div>
        <div className="dfcRight">
          {frHighlight&&<p className="dfcIntroTitle">{isIt?"Perché Envizi risponde alle tue priorità:":"Why Envizi addresses your priorities:"}</p>}
          {([{reqs:highReqs,accent:"#39efb4",label:isIt?"FATTORI MOLTO RILEVANTI":"HIGHLY RELEVANT FACTORS"},{reqs:medReqs,accent:"#ffc07c",label:isIt?"FATTORI MEDIAMENTE RILEVANTI":"MODERATELY RELEVANT FACTORS"}] as {reqs:typeof highReqs,accent:string,label:string}[]).map(({reqs,accent,label})=>reqs.length>0&&<section key={label} className="dfcSection"><p className="dfcSectionLabel" style={{color:accent}}>{label}</p>{reqs.map(r=><div key={r.id} className="dfcHRow" style={{"--dfcAccent":accent} as React.CSSProperties}><p className="dfcHRowTitle">{isIt?r.it:r.en}</p><div className="dfcHChips"><div className="dfcHChip dfcHChipCap"><span className="dfcHChipLabel">{isIt?"Capacità Envizi":"Envizi capability"}</span><p className="dfcHChipText">{isIt?r.capIt:r.capEn}</p></div><div className="dfcHChip dfcHChipBen"><span className="dfcHChipLabel">{isIt?"Beneficio":"Benefit"}</span><p className="dfcHChipText">{isIt?r.benIt:r.benEn}</p></div></div></div>)}</section>)}
        </div>
      </div>
    </main>;
  }


  if(screen==="reportingFoundation"&&profile){
    const isIt=language==="it";
    const allRated=RF_REQUIREMENTS.every(r=>rfRatings[r.id]);
    const rfScore=Object.values(rfRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
    const rfPct=Math.min(100,Math.round(rfScore));
    const rfHighlight=rfScore>=35;
    return <main className="dfScreen">
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {isIt?"REPORTING E PERFORMANCE":"REPORTING AND PERFORMANCE"}</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <div className="dfStickyBar">
        <div className="dfStickyLeft">
          <p className="eyebrow">{isIt?"PERCHÉ SELEZIONARE IBM ENVIZI · GHG & REPORTING":"WHY SELECT IBM ENVIZI · GHG & REPORTING"}</p>
          <h1>{isIt?"Quanto contano per te questi requisiti di reporting?":"How important are these reporting requirements for you?"}</h1>
          <p className="dfSubtitle">{isIt?"Basso = non in esame · Medio = in esame per il prossimo passo · Alto = urgente":"Low = not under review · Medium = under review for next step · High = urgent"}</p>
          {rfHighlight&&<div className="dfScoreMsg">
            <span className="dfScoreMsgIcon">⬡</span>
            <p>{isIt?"Molto probabilmente IBM Envizi è la soluzione per le tue esigenze di reporting.":"IBM Envizi is very likely the right solution for your reporting needs."}</p>
          </div>}
        </div>
        <div className="dfStickyRight">
          <div className="dfScoreBox">
            <span className="dfScoreBoxLabel">{isIt?"Punteggio rilevanza":"Relevance score"}</span>
            <strong className={rfHighlight?"dfScoreHigh":""}>{rfScore}<em>/80</em></strong>
            <div className="dfScoreTrack"><span className="dfScoreFill" style={{width:`${rfPct}%`,background:rfHighlight?"#39efb4":"#ffc07c"}}/></div>
          </div>
          <button className="actionButton dfContinueBtn" disabled={!allRated} onClick={()=>setScreen("reportingConclusion")}>{isIt?"Continua →":"Continue →"}</button>
          {!allRated&&<p className="dfHint">{isIt?"Valuta tutti i requisiti per continuare.":"Rate all requirements to continue."}</p>}
        </div>
      </div>
      <div className="dfColHeaders">
        <div className="dfColH dfColHReq">{isIt?"Requisito · Valutazione":"Requirement · Rating"}</div>
        <div className="dfColH dfColHCap">⬡ {isIt?"Capacità IBM Envizi":"IBM Envizi capability"}</div>
        <div className="dfColH dfColHBen">{isIt?"Beneficio ESG Manager":"ESG Manager benefit"}</div>
      </div>
      <div className="dfGrid">
        {RF_REQUIREMENTS.map((req,i)=>{
          const rating=rfRatings[req.id];
          const isActive=rating==="medium"||rating==="high";
          const pts=rating==="high"?10:rating==="medium"?7.5:0;
          return <div key={req.id} className={`dfRow${isActive?" dfRowActive":""}${rating==="low"?" dfRowLow":""}`}>
            <div className="dfRowReq">
              <div className="dfRowReqTop">
                <span className="dfItemNum">{String(i+1).padStart(2,"0")}</span>
                <p className="dfItemQ">{isIt?req.it:req.en}</p>
              </div>
              <div className="dfRatingGroup">
                {(["low","medium","high"] as DFRating[]).map(v=><button key={v} className={`dfRatingBtn dfRatingBtn--${v}${rating===v?" dfRatingBtnActive":""}`} onClick={()=>setRfRating(req.id,v)}>{isIt?(v==="low"?"Basso":v==="medium"?"Medio +7,5":"Alto +10"):(v==="low"?"Low":v==="medium"?"Medium +7.5":"High +10")}</button>)}
              </div>
              {isActive&&<span className={`dfRowPts dfRowPts--${rating}`}>+{pts} pt</span>}
            </div>
            <div className={`dfRowCap${isActive?"":" dfRowColDim"}`}>
              {isActive?<><span className="dfRowColLabel">⬡ IBM Envizi</span><p>{isIt?req.capIt:req.capEn}</p></>:<span className="dfRowColEmpty">—</span>}
            </div>
            <div className={`dfRowBen${isActive?"":" dfRowColDim"}`}>
              {isActive?<><span className="dfRowColLabel">{isIt?"Beneficio":"Benefit"}</span><p>{isIt?req.benIt:req.benEn}</p></>:<span className="dfRowColEmpty">—</span>}
            </div>
          </div>;
        })}
      </div>
      <footer className="dfFooter">
        <p className="dfSources">{isIt?"Capacità basate su: ":"Capabilities based on: "}<a href="https://www.ibm.com/products/envizi/scope-1-2-ghg-accounting-reporting" target="_blank" rel="noreferrer">Scope 1–2 GHG Accounting &amp; Reporting ↗</a>{" · "}<a href="https://www.ibm.com/products/envizi/scope-3-ghg-accounting-reporting" target="_blank" rel="noreferrer">Scope 3 GHG ↗</a>{" · "}<a href="https://www.ibm.com/products/envizi/esg-reporting-frameworks" target="_blank" rel="noreferrer">ESG Reporting Frameworks ↗</a></p>
      </footer>
    </main>;
  }

  if(screen==="reportingConclusion"&&profile){
    const isIt=language==="it";
    const rfScore=Object.values(rfRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
    const rfPct=Math.min(100,Math.round(rfScore));
    const rfHighVery=rfScore>=50;
    const rfHighMaybe=rfScore>=30;
    const rfHighlight=rfHighMaybe;
    const m3outcome=missionOutcomes[3];
    const decisionTaken=m3outcome?(isIt?{positive:"Envizi ESG Reporting Frameworks + GHG Reporting",warning:"Workflow documentale con template",critical:"E-mail, Word e fogli"}[m3outcome]:{positive:"Envizi ESG Reporting Frameworks + GHG Reporting",warning:"Document workflow with templates",critical:"Email, Word and spreadsheets"}[m3outcome]):null;
    const decisionImg=m3outcome==="positive"?"./reporting-envizi.png":m3outcome==="warning"?"./reporting-intermediate.png":"./reporting-asis.png";
    const decisionColor=m3outcome==="positive"?"#39efb4":m3outcome==="warning"?"#ffc07c":"#ff7777";
    const highReqs=RF_REQUIREMENTS.filter(r=>rfRatings[r.id]==="high");
    const medReqs=RF_REQUIREMENTS.filter(r=>rfRatings[r.id]==="medium");
    const accentColor=rfHighVery?"#39efb4":rfHighMaybe?"#ffc07c":"#57606a";
    const R=52,cx=64,cy=64,circ=2*Math.PI*R,arcLen=circ*0.75,fillLen=arcLen*(rfPct/100);
    return <main className="dfScreen">
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> {isIt?"REPORTING E PERFORMANCE":"REPORTING AND PERFORMANCE"}</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <div className="dfConclusionBody">
        <div className="dfcLeft">
          <p className="eyebrow" style={{letterSpacing:".18em",fontSize:"22px"}}>{isIt?"CONCLUSIONI · REPORTING E PERFORMANCE":"CONCLUSIONS · REPORTING AND PERFORMANCE"}</p>
          <h1 className="dfcTitle" style={{fontSize:"clamp(44px,4.4vw,64px)",fontWeight:800,lineHeight:1.1,marginBottom:4}}>{isIt?"La tua scelta per il reporting delle performance ESG":"Your ESG performance reporting choice"}</h1>
          <div className="dfcGaugeWrap">
            <svg viewBox="0 0 128 128" className="dfcGaugeSvg"><circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(57,239,180,.08)" strokeWidth="10" strokeDasharray={`${arcLen} ${circ}`} strokeDashoffset={circ*0.125} strokeLinecap="round"/><circle cx={cx} cy={cy} r={R} fill="none" stroke={accentColor} strokeWidth="10" strokeDasharray={`${fillLen} ${circ}`} strokeDashoffset={circ*0.125} strokeLinecap="round" style={{filter:`drop-shadow(0 0 8px ${accentColor}88)`,transition:"stroke-dasharray .5s"}}/><text x={cx} y={cy-6} textAnchor="middle" fontSize="28" fontWeight="800" fill={accentColor} fontFamily="inherit">{rfScore}</text><text x={cx} y={cy+14} textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(200,221,214,.5)" fontFamily="inherit">/80</text><text x={cx} y={cy+30} textAnchor="middle" fontSize="9" fontWeight="700" fill="rgba(200,221,214,.35)" letterSpacing="1" fontFamily="inherit">{isIt?"RILEVANZA":"RELEVANCE"}</text></svg>
            <p className="dfcGaugeVerdict" style={{color:accentColor}}>{rfHighVery?(isIt?"Molto probabilmente IBM Envizi è la soluzione per le tue esigenze di reporting.":"IBM Envizi is very likely the right solution for your reporting needs."):rfHighMaybe?(isIt?"Probabilmente IBM Envizi è la soluzione per le tue esigenze di reporting.":"IBM Envizi is probably the right solution for your reporting needs."):(isIt?"Approfondisci con il tuo team IBM.":"Explore further with your IBM team.")}</p>
          </div>
          {decisionTaken&&<div className="dfcDecisionCard" style={{borderColor:decisionColor+"55"}}><img src={decisionImg} alt={decisionTaken} className="dfcDecisionCardImg"/><div className="dfcDecisionCardBody"><small className="dfcDecisionCardLabel">{isIt?"DECISIONE ADOTTATA · MISSIONE 04":"DECISION ADOPTED · MISSION 04"}</small><strong className="dfcDecisionCardValue" style={{color:decisionColor}}>{decisionTaken}</strong></div></div>}
          <div className="dfcActions">
            <button className="actionButton dfcActionSecondary" onClick={()=>goBack()}>{isIt?"← Indietro":"← Back"}</button>
            <button className="actionButton" style={{whiteSpace:"nowrap"}} onClick={()=>setScreen("challengeComplete2")}>{isIt?"Completa Sfida 2 →":"Complete Challenge 2 →"}</button>
          </div>
        </div>
        <div className="dfcRight">
          {rfHighlight&&<p className="dfcIntroTitle">{isIt?"Perché Envizi risponde alle tue priorità:":"Why Envizi addresses your priorities:"}</p>}
          {([{reqs:highReqs,accent:"#39efb4",label:isIt?"FATTORI MOLTO RILEVANTI":"HIGHLY RELEVANT FACTORS"},{reqs:medReqs,accent:"#ffc07c",label:isIt?"FATTORI MEDIAMENTE RILEVANTI":"MODERATELY RELEVANT FACTORS"}] as {reqs:typeof highReqs,accent:string,label:string}[]).map(({reqs,accent,label})=>reqs.length>0&&<section key={label} className="dfcSection"><p className="dfcSectionLabel" style={{color:accent}}>{label}</p>{reqs.map(r=><div key={r.id} className="dfcHRow" style={{"--dfcAccent":accent} as React.CSSProperties}><p className="dfcHRowTitle">{isIt?r.it:r.en}</p><div className="dfcHChips"><div className="dfcHChip dfcHChipCap"><span className="dfcHChipLabel">{isIt?"Capacità Envizi":"Envizi capability"}</span><p className="dfcHChipText">{isIt?r.capIt:r.capEn}</p></div><div className="dfcHChip dfcHChipBen"><span className="dfcHChipLabel">{isIt?"Beneficio":"Benefit"}</span><p className="dfcHChipText">{isIt?r.benIt:r.benEn}</p></div></div></div>)}</section>)}
        </div>
      </div>
    </main>;
  }


  if(screen==="dataFoundation"&&profile){
    const isIt=language==="it";
    const allRated=DF_REQUIREMENTS.every(r=>dfRatings[r.id]);
    const dfScore=Object.values(dfRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
    const dfPct=Math.min(100,Math.round(dfScore));
    const dfHighVery=dfScore>=50;
    const dfHighMaybe=dfScore>=30;
    const dfHighlight=dfHighMaybe;
    return <main className="dfScreen">
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> DATA FOUNDATION</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>

      <div className="dfStickyBar">
        <div className="dfStickyLeft">
          <p className="eyebrow">{isIt?"PERCHÉ SELEZIONARE IBM ENVIZI · DATA FOUNDATION":"WHY SELECT IBM ENVIZI · DATA FOUNDATION"}</p>
          <h1>{isIt?"Quanto contano per te questi requisiti di data foundation?":"How important are these data foundation requirements for you?"}</h1>
          <p className="dfSubtitle">{isIt?"Basso = non in esame · Medio = in esame per il prossimo passo · Alto = urgente":"Low = not under review · Medium = under review for next step · High = urgent"}</p>
          {dfHighlight&&<div className="dfScoreMsg">
            <span className="dfScoreMsgIcon">⬡</span>
            <p>{dfHighVery
              ?(isIt?"Molto probabilmente IBM Envizi è la soluzione per la tua azienda.":"IBM Envizi is very likely the right solution for your organisation.")
              :(isIt?"Probabilmente IBM Envizi è la soluzione per la tua azienda.":"IBM Envizi is probably the right solution for your organisation.")
            }</p>
          </div>}
        </div>
        <div className="dfStickyRight">
          <div className="dfScoreBox">
            <span className="dfScoreBoxLabel">{isIt?"Punteggio rilevanza":"Relevance score"}</span>
            <strong className={dfHighlight?"dfScoreHigh":""}>{dfScore}<em>/100</em></strong>
            <div className="dfScoreTrack"><span className="dfScoreFill" style={{width:`${dfPct}%`,background:dfHighVery?"#39efb4":"#ffc07c"}}/></div>
          </div>
          <button className="actionButton dfContinueBtn" disabled={!allRated} onClick={()=>setScreen("dfConclusion")}>{isIt?"Continua →":"Continue →"}</button>
          {!allRated&&<p className="dfHint">{isIt?"Valuta tutti i requisiti per continuare.":"Rate all requirements to continue."}</p>}
        </div>
      </div>
      <div className="dfColHeaders">
        <div className="dfColH dfColHReq">{isIt?"Requisito · Valutazione":"Requirement · Rating"}</div>
        <div className="dfColH dfColHCap">⬡ {isIt?"Capacità IBM Envizi":"IBM Envizi capability"}</div>
        <div className="dfColH dfColHBen">{isIt?"Beneficio ESG Manager":"ESG Manager benefit"}</div>
      </div>
      <div className="dfGrid">
        {DF_REQUIREMENTS.map((req,i)=>{
          const rating=dfRatings[req.id];
          const isActive=rating==="medium"||rating==="high";
          const pts=rating==="high"?10:rating==="medium"?7.5:0;
          return <div key={req.id} className={`dfRow${isActive?" dfRowActive":""}${rating==="low"?" dfRowLow":""}`}>
            <div className="dfRowReq">
              <div className="dfRowReqTop">
                <span className="dfItemNum">{String(i+1).padStart(2,"0")}</span>
                <p className="dfItemQ">{isIt?req.it:req.en}</p>
              </div>
              <div className="dfRatingGroup">
                {(["low","medium","high"] as DFRating[]).map(v=><button key={v} className={`dfRatingBtn dfRatingBtn--${v}${rating===v?" dfRatingBtnActive":""}`} onClick={()=>setDfRating(req.id,v)}>{isIt?(v==="low"?"Basso":v==="medium"?"Medio +7,5":"Alto +10"):(v==="low"?"Low":v==="medium"?"Medium +7.5":"High +10")}</button>)}
              </div>
              {isActive&&<span className={`dfRowPts dfRowPts--${rating}`}>+{pts} pt</span>}
            </div>
            <div className={`dfRowCap${isActive?"":" dfRowColDim"}`}>
              {isActive?<><span className="dfRowColLabel">⬡ IBM Envizi</span><p>{isIt?req.capIt:req.capEn}</p></>:<span className="dfRowColEmpty">—</span>}
            </div>
            <div className={`dfRowBen${isActive?"":" dfRowColDim"}`}>
              {isActive?<><span className="dfRowColLabel">{isIt?"Beneficio":"Benefit"}</span><p>{isIt?req.benIt:req.benEn}</p></>:<span className="dfRowColEmpty">—</span>}
            </div>
          </div>;
        })}
      </div>

      <footer className="dfFooter">
        <p className="dfSources">{isIt?"Capacità basate su: ":"Capabilities based on: "}<a href="https://www.ibm.com/products/envizi/esg-data-management" target="_blank" rel="noreferrer">ESG Data Management ↗</a>{" · "}<a href="https://www.ibm.com/docs/en/envizi-esg-suite?topic=managing-normalizing-data" target="_blank" rel="noreferrer">{isIt?"Normalizzazione dati":"Data normalisation"} ↗</a>{" · "}<a href="https://www.ibm.com/products/envizi/scope-1-2-ghg-accounting-reporting" target="_blank" rel="noreferrer">Scope 1–2 GHG ↗</a></p>
      </footer>
    </main>;
  }


  if(screen==="dfConclusion"&&profile){
    const isIt=language==="it";
    const dfScore=Object.values(dfRatings).reduce((s,v)=>s+(v==="medium"?7.5:v==="high"?10:0),0);
    const dfPct=Math.min(100,Math.round(dfScore));
    const dfHighVery=dfScore>=50;
    const dfHighMaybe=dfScore>=30;
    const dfHighlight=dfHighMaybe;
    // decisione M0 presa
    const m0outcome=missionOutcomes[0];
    const decisionTaken=m0outcome?t.decisionLabels[m0outcome]:null;
    const decisionImg=m0outcome==="positive"?"./envizi-data-automation.png":m0outcome==="warning"?"./envizi-manual-forms.png":"./envizi-spreadsheets-email.png";
    const decisionColor=m0outcome==="positive"?"#39efb4":m0outcome==="warning"?"#ffc07c":"#ff7777";
    // gruppi fattori
    const highReqs=DF_REQUIREMENTS.filter(r=>dfRatings[r.id]==="high");
    const medReqs=DF_REQUIREMENTS.filter(r=>dfRatings[r.id]==="medium");
    const lowReqs=DF_REQUIREMENTS.filter(r=>dfRatings[r.id]==="low");
    return <main className="dfScreen">
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> DATA FOUNDATION</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>

      <div className="dfConclusionBody">

        {/* COLONNA SX */}
        <div className="dfcLeft">
          <p className="eyebrow" style={{letterSpacing:".18em",fontSize:"22px"}}>{isIt?"CONCLUSIONI · DATA FOUNDATION":"CONCLUSIONS · DATA FOUNDATION"}</p>
          <h1 className="dfcTitle" style={{fontSize:"clamp(44px,4.4vw,64px)",fontWeight:800,lineHeight:1.1,marginBottom:4}}>{isIt?"La tua scelta per la gestione dei dati ESG":"Your ESG data management choice"}</h1>

          {/* — score gauge — */}
          <div className="dfcGaugeWrap">
            {(()=>{
              const R=52, cx=64, cy=64;
              const circ=2*Math.PI*R;
              const arcLen=circ*0.75;
              const fillLen=arcLen*(dfPct/100);
              const accentColor=dfHighVery?"#39efb4":dfHighMaybe?"#ffc07c":"#57606a";
              return <svg viewBox="0 0 128 128" className="dfcGaugeSvg">
                <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(57,239,180,.08)" strokeWidth="10"
                  strokeDasharray={`${arcLen} ${circ}`} strokeDashoffset={circ*0.125} strokeLinecap="round"/>
                <circle cx={cx} cy={cy} r={R} fill="none" stroke={accentColor} strokeWidth="10"
                  strokeDasharray={`${fillLen} ${circ}`} strokeDashoffset={circ*0.125} strokeLinecap="round"
                  style={{filter:`drop-shadow(0 0 8px ${accentColor}88)`,transition:"stroke-dasharray .5s"}}/>
                <text x={cx} y={cy-6} textAnchor="middle" fontSize="28" fontWeight="800" fill={accentColor} fontFamily="inherit">{dfScore}</text>
                <text x={cx} y={cy+14} textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(200,221,214,.5)" fontFamily="inherit">/100</text>
                <text x={cx} y={cy+30} textAnchor="middle" fontSize="9" fontWeight="700" fill="rgba(200,221,214,.35)" letterSpacing="1" fontFamily="inherit">{isIt?"RILEVANZA":"RELEVANCE"}</text>
              </svg>;
            })()}
            <p className="dfcGaugeVerdict" style={{color:dfHighVery?"#39efb4":dfHighMaybe?"#ffc07c":"#7a9a90"}}>
              {dfHighVery?(isIt?"Molto probabilmente IBM Envizi è la soluzione per la tua azienda.":"IBM Envizi is very likely the right solution for your organisation.")
                :dfHighMaybe?(isIt?"Probabilmente IBM Envizi è la soluzione per la tua azienda.":"IBM Envizi is probably the right solution for your organisation.")
                :(isIt?"Approfondisci con il tuo team IBM.":"Explore further with your IBM team.")}
            </p>
          </div>

          {/* — decisione adottata — */}
          {decisionTaken&&<div className="dfcDecisionCard" style={{borderColor:decisionColor+"55"}}>
            <img src={decisionImg} alt={decisionTaken} className="dfcDecisionCardImg"/>
            <div className="dfcDecisionCardBody">
              <small className="dfcDecisionCardLabel">{isIt?"DECISIONE ADOTTATA · MISSIONE 01":"DECISION ADOPTED · MISSION 01"}</small>
              <strong className="dfcDecisionCardValue" style={{color:decisionColor}}>{decisionTaken}</strong>
            </div>
          </div>}

          <div className="dfcActions">
            <button className="actionButton dfcActionSecondary" onClick={()=>goBack()}>{isIt?"← Indietro":"← Back"}</button>
            <button className="actionButton" style={{whiteSpace:"nowrap"}} onClick={()=>setScreen("challengeComplete1")}>{isIt?"Prossima sfida →":"Next challenge →"}</button>
          </div>
        </div>

        {/* COLONNA DX — card orizzontali con 4 chip per ogni fattore */}
        <div className="dfcRight">
          {dfHighlight&&<p className="dfcIntroTitle">{isIt?"Perché Envizi risponde alle tue priorità:":"Why Envizi addresses your priorities:"}</p>}

          {([
            {reqs:highReqs,accent:"#39efb4",label:isIt?"FATTORI MOLTO RILEVANTI":"HIGHLY RELEVANT FACTORS"},
            {reqs:medReqs, accent:"#ffc07c",label:isIt?"FATTORI MEDIAMENTE RILEVANTI":"MODERATELY RELEVANT FACTORS"},
          ] as {reqs:typeof highReqs,accent:string,label:string}[]).map(({reqs,accent,label})=>
            reqs.length>0&&<section key={label} className="dfcSection">
              <p className="dfcSectionLabel" style={{color:accent}}>{label}</p>
              {reqs.map(r=><div key={r.id} className="dfcHRow" style={{"--dfcAccent":accent} as React.CSSProperties}>
                <p className="dfcHRowTitle">{isIt?r.it:r.en}</p>
                <div className="dfcHChips">
                  <div className="dfcHChip dfcHChipCrit">
                    <span className="dfcHChipLabel">{isIt?"Criticità tipica":"Typical issue"}</span>
                    <p className="dfcHChipText">{isIt?r.critIt:r.critEn}</p>
                  </div>
                  <div className="dfcHChip dfcHChipCap">
                    <span className="dfcHChipLabel">{isIt?"Capacità Envizi":"Envizi capability"}</span>
                    <p className="dfcHChipText">{isIt?r.capIt:r.capEn}</p>
                  </div>
                  <div className="dfcHChip dfcHChipToBe">
                    <span className="dfcHChipLabel">{isIt?"To-be con Envizi":"To-be with Envizi"}</span>
                    <p className="dfcHChipText">{isIt?r.toBeIt:r.toBeEn}</p>
                  </div>
                  <div className="dfcHChip dfcHChipBen">
                    <span className="dfcHChipLabel">{isIt?"Beneficio":"Benefit"}</span>
                    <p className="dfcHChipText">{isIt?r.benIt:r.benEn}</p>
                  </div>
                </div>
              </div>)}
            </section>
          )}
        </div>

      </div>
    </main>;
  }






  if(screen==="companySetup"&&profile){
    const isIt=language==="it";
    const sec=SECTORS[companySector];
    const readinessList=isIt?ESG_READINESS_IT:ESG_READINESS_EN;
    const activeReadiness=readinessList.find(r=>r.key===esgReadiness)!;
    const geoKeys=["italia","europa","asia","nordamerica","sudamerica","africa","australia"];
    const geoLabels:Record<string,{it:string,en:string}>={italia:{it:"Italia",en:"Italy"},europa:{it:"Europa",en:"Europe"},asia:{it:"Asia",en:"Asia"},nordamerica:{it:"Nord America",en:"N. America"},sudamerica:{it:"Sud America",en:"S. America"},africa:{it:"Africa",en:"Africa"},australia:{it:"Australia",en:"Australia"}};
    const dimLabelsFull:[{it:string,en:string},{it:string,en:string},{it:string,en:string},{it:string,en:string},{it:string,en:string}]=[sec.dimUnit,sec.opsUnit,{it:"sedi uffici",en:"Office locations"},{it:"data center",en:"Data centres"},{it:"dipendenti",en:"Employees"}];
    const handleSectorChange=(sk:SectorKey)=>{setCompanySector(sk);setCompanyDims([...SECTORS[sk].defaults] as [number,number,number,number,number]);};
    const nonItalyKeys=(companyMarket==="mondo"?geoKeys:["europa"]).filter(k=>k!=="italia");
    const otherSum=nonItalyKeys.reduce((s,k)=>s+(geoDistrib[k]??0),0);
    const italyVal=100-otherSum;
    const geoError=(companyMarket==="europa"||companyMarket==="mondo")&&italyVal<0;
    const handleGeoChange=(key:string,val:number)=>{
      if(key==="italia")return;
      const v=isNaN(val)?0:Math.max(0,val);
      setGeoDistrib(prev=>{const next={...prev,[key]:v};const sum=nonItalyKeys.reduce((s,k)=>s+(k===key?v:(next[k]??0)),0);next.italia=100-sum;return next;});
    };
    return <main className="csScreen">
      <header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {isIt?"LA TUA AZIENDA":"YOUR COMPANY"}</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
      <div className="csBody">
        <div className="csLeft"><img className="csProfileImg" src={`./characters/${profile}-neutral.png`} alt={name}/><div className="csProfileTag"><span className="statusDot"/><div><small>ESG MANAGER</small><strong>{name}</strong></div></div></div>
        <div className="csRight">
          <p className="eyebrow">{isIt?"RACCONTACI LA TUA AZIENDA":"TELL US ABOUT YOUR COMPANY"}</p>
          <h1 className="csTitle">{isIt?"La tua azienda":"Your company"}</h1>
          <div className="csFormTwoCol">
            <div className="csFormLeft">
              <div className="csField csFieldName"><label>{isIt?"Nome Azienda":"Company Name"}<span className="csNameHint">{isIt?"· inserisci il nome della tua azienda":"· enter your company name"}</span></label><input className="csInput csInputName" placeholder={isIt?"Es. Acme S.p.A.":"E.g. Acme Ltd"} value={companyName} onChange={e=>setCompanyName(e.target.value)}/></div>
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
                  {companyDims.map((v,i)=><div key={i} className="csDimRow"><input className="csDimInput" type="number" min={0} value={v} onChange={e=>updateCompanyDim(i,parseFloat(e.target.value))}/><span className="csDimUnit">{isIt?dimLabelsFull[i].it:dimLabelsFull[i].en}</span></div>)}
                </div>
              </div>
              {(companyMarket==="europa"||companyMarket==="mondo")&&<div className="csField"><label>{isIt?"Distribuzione sedi (%, totale 100)":"Location distribution (%, total 100)"}</label>
                <div className="csGeoGrid">
                  <div className={`csGeoRow${geoError?" csGeoRowError":" csGeoRowItalia"}`}><span>{isIt?"Italia":"Italy"}</span><input className="csDimInput csGeoItalyInput" type="number" readOnly value={italyVal} title={isIt?"Calcolato automaticamente: 100% meno la somma delle altre regioni":"Calculated automatically: 100% minus the sum of other regions"}/><span>%</span><span className="csGeoItalyHint">{isIt?"← calcolato":"← auto"}</span></div>
                  {nonItalyKeys.map(k=><div key={k} className="csGeoRow"><span>{isIt?geoLabels[k].it:geoLabels[k].en}</span><input className="csDimInput" type="number" min={0} value={geoDistrib[k]??0} onChange={e=>handleGeoChange(k,parseInt(e.target.value))}/><span>%</span></div>)}
                </div>
                {geoError&&<p className="csGeoErrorMsg">{isIt?"⚠ La somma delle altre regioni supera 100%. Riduci i valori.":"⚠ The sum of other regions exceeds 100%. Please reduce the values."}</p>}
              </div>}
            </div>
            <div className="csFormRight">
              <div className="csField"><label>{isIt?"Seleziona il tuo stato attuale dati ESG":"Select your current ESG data status"}</label>
                <select className="csSelect" value={esgReadiness} onChange={e=>setEsgReadiness(e.target.value as EsgReadiness)}>
                  {readinessList.map(r=><option key={r.key} value={r.key}>{r.label}</option>)}
                </select>
                <p className="csReadinessDesc">{activeReadiness.desc}</p>
              </div>
              <button className="actionButton csConfirmBtn" disabled={geoError} onClick={()=>setScreen("company")}>{isIt?"Entra nell'azienda":"Enter the company"}<b>→</b></button>
            </div>
          </div>
        </div>
      </div>
    </main>;
  }

  if(screen==="company"&&profile){
    const isIt=language==="it";
    const sec=SECTORS[companySector];
    const readinessList=isIt?ESG_READINESS_IT:ESG_READINESS_EN;
    const activeReadiness=readinessList.find(r=>r.key===esgReadiness)!;
    const sectorLabel=isIt?sec.label.it:sec.label.en;
    const dimVal=companyDims[0]; const opsVal=companyDims[1]; const officesVal=companyDims[2]; const peopleVal=companyDims[4];
    const dimUnit=isIt?sec.dimUnit.it:sec.dimUnit.en;
    // CSRD check: fatturato in €M
    const isMld=sec.dimUnit.it.includes("mld");
    const revenueM=isMld?dimVal*1000:dimVal;
    const csrdAlert=revenueM>=450&&peopleVal>=1000;
    const opsUnit=isIt?sec.opsUnit.it:sec.opsUnit.en;
    const offUnit=isIt?"sedi uffici":"office locations";
    const pepUnit=isIt?"dipendenti":"employees";
    const companyStoryGen=isIt?`Un ${sectorLabel.toLowerCase()} da ${dimVal} ${dimUnit}, con ${opsVal} ${opsUnit} e ${officesVal} sedi operative.`:`A ${sectorLabel.toLowerCase()} with ${dimVal} ${dimUnit}, ${opsVal} ${opsUnit} and ${officesVal} operational locations.`;
    const evolvingGen=`${displayCompanyName} — ${activeReadiness.desc}`;
    const geoKeys=["italia","europa","asia","nordamerica","sudamerica","africa","australia"];
    const geoLabelsShort:Record<string,{it:string,en:string}>={italia:{it:"ITALIA",en:"ITALY"},europa:{it:"EUROPA",en:"EUROPE"},asia:{it:"ASIA",en:"ASIA"},nordamerica:{it:"N. AMERICA",en:"N. AMERICA"},sudamerica:{it:"S. AMERICA",en:"S. AMERICA"},africa:{it:"AFRICA",en:"AFRICA"},australia:{it:"AUSTRALIA",en:"AUSTRALIA"}};
    const activeGeo=geoKeys.filter(k=>(geoDistrib[k]??0)>0&&(companyMarket==="mondo"||(companyMarket==="europa"&&(k==="italia"||k==="europa"))||companyMarket==="italia"&&k==="italia"));
    const posMap:Record<string,{left:string,top:string}[]>={europa:[{left:"48%",top:"38%"},{left:"51%",top:"42%"},{left:"44%",top:"40%"},{left:"53%",top:"36%"}],asia:[{left:"72%",top:"42%"},{left:"75%",top:"46%"},{left:"68%",top:"44%"}],nordamerica:[{left:"18%",top:"40%"},{left:"22%",top:"36%"},{left:"15%",top:"44%"}],sudamerica:[{left:"28%",top:"64%"},{left:"24%",top:"68%"}],africa:[{left:"50%",top:"58%"},{left:"46%",top:"62%"}],australia:[{left:"78%",top:"66%"},{left:"82%",top:"62%"}]};
    return <main className="companyScreen">
      <header className="missionNav missionNavTrust"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> COMPANY PROFILE</div>{renderTrustBar()}<button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
      <section className="companyCopy">
        <p className="eyebrow">{t.companyIntro}</p>
        <h1>{displayCompanyName}</h1>
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
            // stato finale: solo la frase, nessun bottone
            return csrdPendingChoice?(
              <div className="csrdAlert csrdAlertDone">
                <span className="csrdAlertIcon">⚠</span>
                <div className="csrdAlertBody">
                  <strong>{isIt?"Azienda soggetta a CSRD":"Company subject to CSRD"}</strong>
                  <span>{isIt?"Oltre 1.000 dipendenti e €450M di fatturato.":"Over 1,000 employees and €450M revenue."}</span>
                </div>
              </div>
            ):(
              <div className="csrdAlert csrdAlertOk csrdAlertDone">
                <span className="csrdAlertIcon">ℹ</span>
                <div className="csrdAlertBody">
                  <strong>{isIt?"Azienda non soggetta a CSRD":"Company not subject to CSRD"}</strong>
                  <span>{isIt?"Meno di 1.000 dipendenti o fatturato sotto €450M.":"Under 1,000 employees or revenue below €450M."}</span>
                </div>
              </div>
            );
          }
          if(csrdConfirmStep===1){
            // stato "Sicuro?"
            return (
              <div className={`csrdAlert${csrdPendingChoice?"":" csrdAlertOk"}`}>
                <span className="csrdAlertIcon">{csrdPendingChoice?"⚠":"ℹ"}</span>
                <div className="csrdAlertBody">
                  <strong>{csrdPendingChoice
                    ?(isIt?"Azienda soggetta a CSRD":"Company subject to CSRD")
                    :(isIt?"Azienda non soggetta a CSRD":"Company not subject to CSRD")}
                  </strong>
                  <span>{isIt?"Sicuro?":"Are you sure?"}</span>
                </div>
                <div className="csrdAlertBtns">
                  <button className="csrdBtnYes" onClick={()=>setCsrdConfirmStep(2)}>{isIt?"Sì":"Yes"}</button>
                  <button className="csrdBtnNo" onClick={()=>setCsrdConfirmStep(0)}>{isIt?"No":"No"}</button>
                </div>
              </div>
            );
          }
          // stato 0: mostra Sì confermo / No correggi
          return csrdAlert?(
            <div className="csrdAlert">
              <span className="csrdAlertIcon">⚠</span>
              <div className="csrdAlertBody">
                <strong>{isIt?"Azienda soggetta a CSRD":"Company subject to CSRD"}</strong>
                <span>{isIt?"Oltre 1.000 dipendenti e €450M di fatturato.":"Over 1,000 employees and €450M revenue."}</span>
              </div>
              <div className="csrdAlertBtns">
                <button className="csrdBtnYes" onClick={()=>{setCsrdPendingChoice(true);setCsrdConfirmStep(1);}}>{isIt?"Sì, confermo":"Yes, confirm"}</button>
                <button className="csrdBtnNo" onClick={()=>{updateCompanyDim(4,999);setCsrdPendingChoice(false);setCsrdConfirmStep(1);}}>{isIt?"No, correggi":"No, correct"}</button>
              </div>
            </div>
          ):(
            <div className="csrdAlert csrdAlertOk">
              <span className="csrdAlertIcon">ℹ</span>
              <div className="csrdAlertBody">
                <strong>{isIt?"Azienda non soggetta a CSRD":"Company not subject to CSRD"}</strong>
                <span>{isIt?"Meno di 1.000 dipendenti o fatturato sotto €450M.":"Under 1,000 employees or revenue below €450M."}</span>
              </div>
              <div className="csrdAlertBtns">
                <button className="csrdBtnYes" onClick={()=>{setCsrdPendingChoice(false);setCsrdConfirmStep(1);}}>{isIt?"Sì, confermo":"Yes, confirm"}</button>
                <button className="csrdBtnNo" onClick={()=>{updateCompanyDim(4,10000);setCsrdPendingChoice(true);setCsrdConfirmStep(1);}}>{isIt?"No, correggi":"No, correct"}</button>
              </div>
            </div>
          );
        })()}
        {/* Note / osservazioni CSRD */}
        <div className="csrdNoteWrap">
          <button className="csrdNoteToggle" onClick={()=>{if(!csrdNoteOpen){setCsrdNoteDraft(csrdNote);} setCsrdNoteOpen(o=>!o);}}>
            {csrdNote&&!csrdNoteOpen&&<span className="csrdNoteDot"/>}
            {isIt?"✏ Click per note o osservazioni · perimetro CSRD":"✏ Click for notes or observations · CSRD scope"}
          </button>
          {csrdNoteOpen&&(
            <div className="csrdNoteBox">
              <textarea
                className="csrdNoteArea"
                rows={4}
                placeholder={isIt?"Aggiungi note sul contesto CSRD di questa azienda...":"Add notes on this company's CSRD context..."}
                value={csrdNoteDraft}
                onChange={e=>setCsrdNoteDraft(e.target.value)}
              />
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

  if(screen==="priorities"&&profile){
    const isIt=language==="it";
    const prioImg:Record<Priority,string>={credit:"./obj-credit.png",compliance:"./obj-compliance.png",customers:"./obj-customers.png",efficiency:"./obj-efficiency.png",supply:"./obj-supply.png",reputation:"./obj-reputation.png"};
    return <main className="priorityScreen priorityScreenCards">
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> BUSINESS PRIORITIES</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <div className="prioCardsLayout">
        <div className="prioCardsIntro">
          <p className="eyebrow">{t.priorityKicker}</p>
          <h1>{t.priorityTitle}</h1>
          <p>{(t.priorityIntro as string).replace("COMPANY_NAME",displayCompanyName)}</p>
          <div className="priorityPersona">
            <img src={`./characters/${profile}-neutral.png`} alt={name}/>
            <div><strong>{name}</strong><small>ESG MANAGER</small></div>
          </div>
        </div>
        <div className="prioCardsArea">
          <div className="prioCardGrid">
            {priorities.map((p,i)=>(
              <div key={p} className={`prioCard${i<3?" prioCardTop":""}`}>
                <div className="prioCardRank">{String(i+1).padStart(2,"0")}</div>
                <img className="prioCardImg" src={prioImg[p]} alt={t.priorityNames[p]}/>
                <div className="prioCardBody">
                  <strong className="prioCardName">{t.priorityNames[p]}</strong>
                  <span className="prioCardDetail">{t.priorityDetails[p]}</span>
                  <button className="prioIncludeToggle" onClick={()=>togglePriorityIncluded(p)} aria-pressed={priorityIncluded[p]} title={isIt?"Includi in analisi":"Include in analysis"}>
                    <span className={`prioIncludeDot${priorityIncluded[p]?" prioIncludeDotOn":""}`}/>
                    {isIt?"Includi in analisi":"Include in analysis"}
                  </button>
                  <button className="prioExpLink" onClick={()=>setPrioExpModal(p)}>
                    {prioExperience[p]?<span className="prioExpDot"/>:null}
                    {isIt?"✏ Racconta la tua esperienza":"✏ Share your experience"}
                  </button>
                </div>
                <div className="prioCardMove">
                  <button className="prioMoveBtn" onClick={()=>rankPriority(i,i)} disabled={i===0} aria-label={t.moveUp}>▲</button>
                  <button className="prioMoveBtn" onClick={()=>rankPriority(i,i+2)} disabled={i===priorities.length-1} aria-label={t.moveDown}>▼</button>
                </div>
              </div>
            ))}
          </div>
          <button className="actionButton prioCardsConfirmBtn" onClick={()=>{localStorage.setItem("envizi-quest-priorities",JSON.stringify(priorities));setScreen("approachDataCopy")}}>{t.confirm}<b>→</b></button>
        </div>
      </div>
      {/* ── Experience modal ── */}
      {prioExpModal&&(()=>{
        const p=prioExpModal;
        const phrases=prioDefaultExp[p][language as "it"|"en"];
        const selIdx=prioExpSelected[p];
        // modalMode: "scratch" = testo libero, "scenario" = scegli scenario
        // determiniamo la modalità corrente: se non c'è selezione attiva e il testo salvato
        // non corrisponde a nessuna frase, siamo in scratch; altrimenti in scenario
        const modalMode=prioExpMode;
        const edited=prioExperience[p];

        const scenarioValue=modalMode==="scenario"
          ?(selIdx>=0?(edited!==""?edited:phrases[selIdx]):"")
          :"";
        const currentVal=modalMode==="scratch"?edited:scenarioValue;
        const canSave=currentVal.trim()!==""||
          (modalMode==="scenario"&&selIdx>=0);

        const selectPhrase=(idx:number)=>{
          if(selIdx===idx){
            setPrioExpSelected(prev=>({...prev,[p]:-1}));
            setPrioExperience(prev=>({...prev,[p]:""}));
          } else {
            setPrioExpSelected(prev=>({...prev,[p]:idx}));
            setPrioExperience(prev=>({...prev,[p]:""}));
          }
        };
        const switchMode=(mode:"scratch"|"scenario")=>{
          setPrioExpMode(mode);
          setPrioExpSelected(prev=>({...prev,[p]:-1}));
          setPrioExperience(prev=>({...prev,[p]:""}));
        };
        const exitWithout=()=>{setPrioExpModal(null);setPrioExpMode("scratch");};
        const saveAndExit=()=>{
          if(modalMode==="scenario"&&edited===""&&selIdx>=0)
            setPrioExperience(prev=>({...prev,[p]:phrases[selIdx]}));
          setPrioExpModal(null);
          setPrioExpMode("scratch");
        };

        return <div className="prioExpOverlay" onClick={exitWithout}>
          <div className="prioExpDialog" onClick={e=>e.stopPropagation()}>
            <div className="prioExpDialogHeader">
              <strong>{t.priorityNames[p]}</strong>
            </div>
            {/* ── Tab switcher ── */}
            <div className="prioExpTabs">
              <button
                className={`prioExpTab${modalMode==="scratch"?" prioExpTabActive":""}`}
                onClick={()=>switchMode("scratch")}
              >
                {isIt?"✍ Scrivi da zero":"✍ Write from scratch"}
              </button>
              <button
                className={`prioExpTab${modalMode==="scenario"?" prioExpTabActive":""}`}
                onClick={()=>switchMode("scenario")}
              >
                {isIt?"📋 Scegli uno scenario":"📋 Choose a scenario"}
              </button>
            </div>

            {modalMode==="scratch"&&(
              <>
                <p className="prioExpHint">{isIt?"Descrivi liberamente il contesto o la sfida specifica di questa priorità per la tua azienda.":"Freely describe the context or specific challenge of this priority for your organisation."}</p>
                <textarea
                  className="prioExpTextarea"
                  value={edited}
                  placeholder={isIt?"Scrivi qui il tuo testo…":"Write your text here…"}
                  onChange={e=>setPrioExperience(prev=>({...prev,[p]:e.target.value}))}
                  rows={6}
                  autoFocus
                />
              </>
            )}

            {modalMode==="scenario"&&(
              <>
                <p className="prioExpHint">{isIt?"Seleziona il caso in cui ti riconosci di più, poi rivedi e personalizza la frase.":"Select the case you identify with most, then review and personalise the phrase."}</p>
                <div className="prioExpPhrases">
                  {phrases.map((phrase,idx)=>(
                    <button key={idx} className={`prioExpPhrase${selIdx===idx?" prioExpPhraseActive":""}`} onClick={()=>selectPhrase(idx)}>
                      <span className="prioExpPhraseNum">{String(idx+1).padStart(2,"0")}</span>
                      <span className="prioExpPhraseText">{phrase}</span>
                      {selIdx===idx&&<span className="prioExpPhraseCheck">✓</span>}
                    </button>
                  ))}
                </div>
                <textarea
                  className={`prioExpTextarea${selIdx<0?" prioExpTextareaEmpty":""}`}
                  value={scenarioValue}
                  placeholder={isIt?"Seleziona uno scenario qui sopra per iniziare…":"Select a scenario above to get started…"}
                  onChange={e=>setPrioExperience(prev=>({...prev,[p]:e.target.value}))}
                  disabled={selIdx<0}
                  rows={5}
                />
              </>
            )}

            <div className="prioExpActions">
              <button className="prioExpClear" onClick={exitWithout}>
                {isIt?"Esci senza modifiche":"Exit without saving"}
              </button>
              <button className="actionButton prioExpSave" onClick={saveAndExit} disabled={!canSave}>
                {isIt?"Salva e esci":"Save and exit"}<b>→</b>
              </button>
            </div>
          </div>
        </div>;
      })()}
    </main>;
  }

  if(screen==="approachDataCopy"&&profile)return <main className="approachIntroScreen"><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> IL PERCORSO</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="approachIntroBody approachIntroBodyWithImg"><div className="approachIntroLeft"><h1 className="approachIntroTitle">{t.approachDataTitle}</h1><div className="approachIntroText">{(t.approachDataBody as string[]).map((para,i)=><p key={i}>{para}</p>)}</div><button className="actionButton approachIntroCta" onClick={()=>setScreen("priorityData")}>{t.approachDataCta}<b>→</b></button></div><div className="approachIntroRight"><img src="./step-2.svg" className="approachIntroStepBadge" alt="Step 2"/><img src="./logica-issue.png" className="approachIntroImg" alt="Criticità dati ESG"/><p className="approachIntroImgCaption approachIntroImgCaptionSm">{t.approachDataExample as string}</p></div></section></main>;

  if(screen==="priorityData"&&profile){
    const isIt=language==="it";
    const exportDataNeedsCsv=()=>{
      const missionNames:{[k:number]:{it:string,en:string}}={0:{it:"M1 · Fabbrica dei dati ESG",en:"M1 · ESG data factory"},1:{it:"M2 · Energia e decarbonizzazione",en:"M2 · Energy and decarbonisation"},2:{it:"M3 · Coinvolgimento supply chain",en:"M3 · Supply chain engagement"},3:{it:"M4 · Reporting e performance",en:"M4 · Reporting and performance"},4:{it:"M5 · Rotta verso Net Zero",en:"M5 · Net Zero pathway"},5:{it:"M6 · Framework ESG e disclosure",en:"M6 · ESG frameworks and disclosure"}};
      const esc=(s:string)=>s.includes(",")||s.includes('"')||s.includes("\n")?`"${s.replace(/"/g,'""')}"`:s;
      const headers=isIt
        ?["Rank","Priorità di business","ID","Esigenza di gestione dati ESG","Inclusa","Rilevanza (1-10)","Criticità (1-10)","Priorità (tier)","Missione / Sfida Quest","Modulo IBM Envizi"]
        :["Rank","Business priority","ID","ESG data management need","Included","Relevance (1-10)","Criticality (1-10)","Priority tier","Mission / Quest challenge","IBM Envizi module"];
      const rows:string[][]=[];
      priorities.forEach((p,pi)=>{
        const items=dataNeeds.filter(n=>n.priority===p);
        items.forEach((item,ii)=>{
          const rel=Math.min(needRelevance[item.id]??5,10);
          const crit=needCriticality[item.id]??5;
          const included=isNeedIncluded(item.id);
          const tier=rel>7&&crit>7?(isIt?"Alta":"High"):rel>4||crit>4?(isIt?"Media":"Medium"):(isIt?"Bassa":"Low");
          const mi=needIdToMission[item.id]??null;
          const missionLabel=mi!==null?(isIt?missionNames[mi].it:missionNames[mi].en):(isIt?"Trasversale":"Cross-cutting");
          const cap=needIdToCapability[item.id];
          const capLabel=cap?(isIt?cap.it:cap.en):"";
          rows.push([`${pi+1}.${ii+1}`,isIt?(t.priorityNames as Record<string,string>)[p]:(copy.en.priorityNames as Record<string,string>)[p],item.id,item.label,included?(isIt?"Sì":"Yes"):(isIt?"No":"No"),String(rel),String(crit),tier,missionLabel,capLabel]);
        });
      });
      const csv="\uFEFF"+[headers,...rows].map(r=>r.map(esc).join(",")).join("\n");
      const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url;a.download=`Envizi-Quest-Esigenze-${displayCompanyName.replace(/[^a-zA-Z0-9]/g,"_")||"Export"}.csv`;a.click();
      URL.revokeObjectURL(url);
    };
    return <main className="priorityDataScreen" style={{position:"relative"}}>
      
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> DATA NEEDS</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <div className="pdTopTitle">
        <div className="pdTopTitleRow">
          <h1 className="pdTopTitleText">{isIt?"Dagli obiettivi alle esigenze di gestione dati ESG":"From objectives to ESG data management needs"}</h1>
          <div className="pdHelpWrap">
            <button className="pdHelpBtn" onClick={()=>setPdHelpOpen(o=>!o)} aria-label="Help">?</button>
            {pdHelpOpen&&<div className="pdHelpTooltip">
              <button className="pdHelpClose" onClick={()=>setPdHelpOpen(false)}>✕</button>
              <p>{isIt
                ?"Seleziona gli elementi che intendi valutare: fai click sui cerchi per includerli. Poi assegna un punteggio di rilevanza (quanto è importante per la tua azienda) e un punteggio di criticità (quanto è problematico oggi per la tua azienda)."
                :"Select the items you want to evaluate: click the circles to include them. Then assign a relevance score (how important it is for your organisation) and a criticality score (how problematic it is for your organisation today)."
              }</p>
            </div>}
          </div>
        </div>
      </div>
      <div className="pdBody">
        {/* ── LEFT: all objectives scrollable ── */}
        <div className="pdLeft">
          {/* color tier legend */}
          <div className="pdTierLegend">
            <span><span style={{color:"#ff4d4d"}}>⬡</span> <span style={{color:"#fde047"}}>{isIt?"Alta priorità (R>7 e C>7)":"High priority (R>7 and C>7)"}</span></span>
            <span><span style={{color:"#7dd3fc"}}>⬡</span> <span style={{color:"#fde047"}}>{isIt?"Media priorità (R>4 o C>4)":"Medium priority (R>4 or C>4)"}</span></span>
            <span><span style={{color:"#9ca3af"}}>⬡</span> <span style={{color:"#fde047"}}>{isIt?"Bassa priorità":"Low priority"}</span></span>
          </div>
          {/* sticky column headers */}
          <div className="pdColHeaders">
            <div className="pdColHeaderSpacer"/>
            <div className="pdColHeaderBand pdColHeaderIncl">{isIt?"Includi":"Include"}</div>
            <div className="pdColHeaderBand pdColHeaderRel">{isIt?"Rilevanza":"Relevance"}</div>
            <div className="pdColHeaderBand pdColHeaderCrit">{isIt?"Criticità":"Criticality"}</div>
          </div>
          {priorities.map((p,prioIdx)=>{
            const colItems=dataNeeds.filter(n=>n.priority===p);
            const isSecondary=prioIdx>=3;
            return <div key={p} className={`pdGroup${isSecondary?" pdGroupSecondary":""}`}>
              <div className="pdGroupHeader">
                <span className="pdGroupNum">{String(prioIdx+1).padStart(2,"0")}</span>
                <strong className="pdGroupName"><span className="pdGroupObjLabel">{isIt?"Obiettivo:":"Objective:"}</span> <span className="pdGroupNameUnder">{t.priorityNames[p]}</span></strong>
              </div>
              <div className="pdGroupSubheader">{isIt?"Esigenze di gestione dei dati ESG":"ESG data management needs"}</div>
              {colItems.map((item,posInGroup)=>{
                const rankLabel=`${prioIdx+1}.${posInGroup+1}`;
                const relMax=10;
                const rel=Math.min(needRelevance[item.id]??5,10);
                const crit=needCriticality[item.id]??5;
                const included=isNeedIncluded(item.id);
                const relNorm=rel;
                const tier=relNorm>7&&crit>7?"high":relNorm>4||crit>4?"mid":"low";
                const tierColor=tier==="high"?"#ff4d4d":tier==="mid"?"#7dd3fc":"#9ca3af";
                return <div key={item.id} className={`pdRow${included?"":" pdRowDimmed"}`}>
                  <div className="pdRowLeft" style={{color:included?tierColor:"#ffffff"}}>
                    <span className="pdRowCode">{rankLabel}</span>
                    <span className="pdRowLabel">{item.label}</span>
                  </div>
                  <div className="pdColIncl">
                    <button
                      className={`pdInclBtn${included?" pdInclBtnOn":""}`}
                      style={{"--incl-color":included?tierColor:"#4a7060"} as React.CSSProperties}
                      onClick={()=>toggleNeedIncluded(item.id)}
                      aria-label={included?(isIt?"Escludi dalla valutazione":"Exclude from assessment"):(isIt?"Includi nella valutazione":"Include in assessment")}
                    />
                  </div>
                  <div className="pdRowBand" style={{"--rel-max":relMax} as React.CSSProperties}>
                    <input type="range" min={1} max={relMax} value={rel}
                      style={{"--v":rel,"--vmax":relMax-1} as React.CSSProperties}
                      onChange={e=>setNeedRelevance(v=>({...v,[item.id]:Number(e.target.value)}))}
                      className="pdScoreSlider pdSliderRel"
                      disabled={!included}/>
                    <span className="pdBandVal pdBandValRel" style={{opacity:included?1:0.3}}>{rel}<span className="pdBandMax">/{relMax}</span></span>
                  </div>
                  <div className="pdRowBand">
                    <input type="range" min={1} max={10} value={crit}
                      style={{"--v":crit} as React.CSSProperties}
                      onChange={e=>setNeedCriticality(v=>({...v,[item.id]:Number(e.target.value)}))}
                      className="pdScoreSlider pdSliderCrit"
                      disabled={!included}/>
                    <span className="pdBandVal pdBandValCrit" style={{opacity:included?1:0.3}}>{crit}</span>
                  </div>
                </div>;
              })}
            </div>;
          })}
        </div>
        {/* ── RIGHT: sticky panel ── */}
        <div className="pdRight">
          <p className="eyebrow">{t.priorityDataKicker}</p>
          <p className="pdRightIntro">{t.priorityDataIntro}</p>
          <div className="pdPersona">
            <img src={`./characters/${profile}-neutral.png`} alt={name}/>
            <div><strong>{name}</strong><small>ESG MANAGER</small></div>
          </div>
          <div className="pdScoreLegend">
            <div className="pdScoreLegendRow"><span className="pdLegendDot pdLegendRel"/>
              <div><strong>{isIt?"Rilevanza":"Relevance"}</strong><small>{isIt?"1 = poco rilevante · 10 = molto rilevante":"1 = low relevance · 10 = very relevant"}</small></div>
            </div>
            <div className="pdScoreLegendRow"><span className="pdLegendDot pdLegendCrit"/>
              <div><strong>{isIt?"Criticità":"Criticality"}</strong><small>{isIt?"1 = poco problematico · 10 = molto problematico":"1 = low severity · 10 = very critical"}</small></div>
            </div>
          </div>
          <button className="secondaryAction pdExportBtn" style={{marginBottom:"10px",fontSize:"clamp(14px,1.2vw,16px)",padding:"12px 16px",width:"100%"}} onClick={exportDataNeedsCsv}>↓ {isIt?"Esporta in Excel / CSV":"Export to Excel / CSV"}</button>
          <button className="actionButton pdConfirmBtn" onClick={()=>setScreen("priorityMatrix")}>{t.priorityDataCta}<b>→</b></button>
        </div>
      </div>
    </main>;
  }


  if(screen==="priorityMatrix"&&profile){
    const isIt=language==="it";
    const MATRIX_W=800; // horizontal plot area
    const MATRIX_H=380; // shorter vertical plot area
    const PAD_L=38;     // left padding (y-axis labels)
    const PAD_B=58;     // bottom padding (x-axis labels + legend)
    const VW=MATRIX_W+PAD_L;
    const VH=MATRIX_H+PAD_B;
    const priorityColors:Record<Priority,string>={
      credit:"#39efb4",compliance:"#7c86ff",customers:"#f5c542",
      efficiency:"#ff8c5a",supply:"#a78bfa",reputation:"#f472b6"
    };
    // collect only the included needs
    const allNeeds=dataNeeds.filter(n=>isNeedIncluded(n.id)).map((n)=>{
      const prioIdx=priorities.indexOf(n.priority);
      const rel=Math.min(needRelevance[n.id]??5,10);
      const crit=needCriticality[n.id]??5;
      const relNorm=rel;
      const tierColor=relNorm>7&&crit>7?"#ff4d4d":relNorm>4||crit>4?"#7dd3fc":"#9ca3af";
      return {...n,rel,relNorm,crit,prioIdx,color:tierColor};
    });
    // x = Rilevanza (1-10), y = Criticità (1-10)
    const toX=(v:number)=>PAD_L+(v-1)/(10-1)*MATRIX_W;
    const toY=(v:number)=>(10-v)/(10-1)*MATRIX_H;
    const gridVals=[1,2,3,4,5,6,7,8,9,10];
    // zoom: viewport della zona [focusMinR..10] x [focusMinC..10]
    const zoomF=focusMinR; // R e C sono sempre uguali
    const vbX=zoomF>1?toX(zoomF)-PAD_L/2:0;
    const vbY=zoomF>1?toY(10):0;          // top invariato
    const vbW=zoomF>1?(PAD_L+MATRIX_W)-vbX:VW;
    const vbH=zoomF>1?(toY(zoomF)+PAD_B)-vbY:VH;
    return <main className="pmScreen" style={{position:"relative"}}>
      
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> PRIORITY MATRIX</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <div className="pmBody">
        <div className="pmLeft">
          <p className="eyebrow">{isIt?"Matrice di Priorità":"Priority Matrix"}</p>
          <h1 className="pmTitle">{isIt?"Rilevanza vs Criticità":"Relevance vs Criticality"}</h1>
          {/* tier color legend */}
          <div className="pmTierLegend">
            <div className="pmTierLegendItem"><span className="pmTierDot" style={{background:"#ff4d4d"}}/><span style={{color:"#fde047"}}>{isIt?"Alta priorità":"High priority"}</span><small>{isIt?"R>7 e C>7":"R>7 and C>7"}</small></div>
            <div className="pmTierLegendItem"><span className="pmTierDot" style={{background:"#7dd3fc"}}/><span style={{color:"#fde047"}}>{isIt?"Media priorità":"Medium priority"}</span><small>{isIt?"R>4 o C>4":"R>4 or C>4"}</small></div>
            <div className="pmTierLegendItem"><span className="pmTierDot" style={{background:"#9ca3af"}}/><span style={{color:"#fde047"}}>{isIt?"Bassa priorità":"Low priority"}</span></div>
          </div>
          {/* objectives filter list */}
          <div className="pmObjList">
            <p className="pmObjListLabel">{isIt?"Filtra per obiettivo":"Filter by objective"}</p>
            {priorities.map((p,pi)=><div key={p} className={`pmObjItem${hoveredPriority===p?" pmObjItemActive":""}`} onMouseEnter={()=>setHoveredPriority(p)} onMouseLeave={()=>setHoveredPriority(null)}><span className="pmObjRank">{pi+1}</span><span>{t.priorityNames[p]}</span></div>)}
          </div>
          {/* mission (capability) filter list */}
          <div className="pmObjList" style={{marginTop:"14px"}}>
            <p className="pmObjListLabel">{isIt?"Filtra per capacità richiesta":"Filter by required capability"}</p>
            {missionCatalog.map((m,mi)=>{
              const active=pmMissionFilter===mi;
              return <div key={mi} className={`pmObjItem${active?" pmObjItemActive":""}`} onClick={()=>setPmMissionFilter(active?null:mi)} style={{cursor:"pointer"}}>
                <span className="pmObjRank">{mi}</span>
                <span>{isIt?m.it:m.en}</span>
              </div>;
            })}
          </div>
        </div>
        <div className="pmPlotWrap">
          <h2 className="pmMatrixTitle">{isIt?"Esigenze di gestione dei dati ESG: Priorità di intervento":"ESG data management needs: Intervention priorities"}</h2>
          <div className="pmMatrixSpacer"><div className="pmMatrixSpacerLine"/><div className="pmMatrixSpacerLine"/><div className="pmMatrixSpacerLine"/></div>
          {pmFromBriefing
            ? <button className="actionButton pmCta" onClick={()=>{setPmFromBriefing(false);setScreen("asis");}}>{isIt?"Continua verso l'AS-IS →":"Continue to AS-IS →"}</button>
            : <button className="actionButton pmCta" onClick={()=>setScreen("chapterOneSummary")}>{isIt?"Inizia le sfide →":"Start challenges →"}<b>→</b></button>
          }
          <svg className="pmSvg" viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`} preserveAspectRatio="xMidYMid meet" style={{transition:"viewBox .35s"}}>
            {/* dashed grid */}
            {gridVals.map(v=><g key={v}>
              <line x1={toX(v)} y1={0} x2={toX(v)} y2={MATRIX_H} stroke="rgba(255,255,255,.55)" strokeWidth="1.5" strokeDasharray="5 5"/>
              <line x1={PAD_L} y1={toY(v)} x2={PAD_L+MATRIX_W} y2={toY(v)} stroke="rgba(255,255,255,.55)" strokeWidth="1.5" strokeDasharray="5 5"/>
              <text x={toX(v)} y={MATRIX_H+16} textAnchor="middle" fontSize="12" fill="#7ecfb8" fontFamily="monospace" fontWeight="700">{v}</text>
              <text x={PAD_L-8} y={toY(v)+5} textAnchor="end" fontSize="12" fill="#7ecfb8" fontFamily="monospace" fontWeight="700">{v}</text>
            </g>)}
            {/* trasversale label at (10,10) — visible only when a mission filter is active */}
            {pmMissionFilter!==null&&(()=>{
              const tx=toX(10); const ty=toY(10);
              const lbl=isIt?"Esigenza trasversale":"Cross-cutting need";
              const lbl2=isIt?"a tutte le sfide":"across all challenges";
              const bw=Math.max(lbl.length,lbl2.length)*5.6+16;
              const bh=28;
              return <g>
                <rect x={tx-bw/2} y={ty-bh/2} width={bw} height={bh} rx="4" fill="rgba(7,17,14,.88)" stroke="#f5c542" strokeWidth="1" strokeOpacity="0.7"/>
                <text x={tx} y={ty-3} textAnchor="middle" fontSize="7" fill="#f5c542" fontFamily="monospace" fontWeight="700">{lbl}</text>
                <text x={tx} y={ty+8} textAnchor="middle" fontSize="7" fill="#f5c542" fontFamily="monospace" fontWeight="700">{lbl2}</text>
              </g>;
            })()}
            {/* axis label x */}
            <text x={PAD_L+MATRIX_W/2} y={MATRIX_H+36} textAnchor="middle" fontSize="12" fill="#c2d8cf" fontFamily="monospace" fontWeight="700" letterSpacing="3">{isIt?"RILEVANZA":"RELEVANCE"}</text>
            {/* R / C legend */}
            <text x={PAD_L+MATRIX_W} y={MATRIX_H+52} textAnchor="end" fontSize="9" fill="rgba(255,255,255,.85)" fontFamily="monospace" fontWeight="700">{isIt?"R = Rilevanza (1–10)   ·   C = Criticità (1–10)":"R = Relevance (1–10)   ·   C = Criticality (1–10)"}</text>
            <text x={10} y={MATRIX_H/2} textAnchor="middle" fontSize="12" fill="#c2d8cf" fontFamily="monospace" fontWeight="700" letterSpacing="3" transform={`rotate(-90,10,${MATRIX_H/2})`}>{isIt?"CRITICITÀ":"CRITICALITY"}</text>
            {/* quadrant highlight */}
            <rect x={toX(5.5)} y={0} width={PAD_L+MATRIX_W-toX(5.5)} height={MATRIX_H/2} fill="rgba(57,239,180,.04)"/>
            {(()=>{
              // ── label layout with force repulsion ──
              const FONT=7.5; const LINE_H=9; const MAX_LINES=3;
              const CHAR_W=FONT*0.52; const PAD_X=6; const PAD_Y=4;
              // pre-compute lines for every need
              const maxChars=Math.floor((MATRIX_W/9-PAD_X*2)/CHAR_W);
              const needMeta=allNeeds.map(n=>{
                const words=n.label.split(" ");
                const lines:string[]=[]; let cur="";
                for(const w of words){
                  const test=cur?cur+" "+w:w;
                  if(test.length<=maxChars)cur=test;
                  else{if(cur)lines.push(cur);cur=w;}
                }
                if(cur)lines.push(cur);
                const vis=lines.slice(0,MAX_LINES);
                const bw=Math.max(...vis.map(l=>l.length))*CHAR_W+PAD_X*2;
                const bh=vis.length*LINE_H+PAD_Y*2+8; // +8 for score line at bottom
                const prioIdx=priorities.indexOf(n.priority);
                const posInGroup=dataNeeds.filter(d=>d.priority===n.priority).findIndex(d=>d.id===n.id);
                return {n,vis,bw,bh,
                  ox:toX(n.relNorm),oy:toY(n.crit), // anchor (grid point)
                  lx:toX(n.relNorm),ly:toY(n.crit),  // label centre (mutable)
                  rankLabel:`${prioIdx+1}.${posInGroup+1}`,
                };
              });
              // iterative repulsion (50 passes)
              for(let iter=0;iter<50;iter++){
                for(let i=0;i<needMeta.length;i++){
                  for(let j=i+1;j<needMeta.length;j++){
                    const a=needMeta[i],b=needMeta[j];
                    const overX=Math.max(0,(a.bw+b.bw)/2-Math.abs(a.lx-b.lx));
                    const overY=Math.max(0,(a.bh+b.bh)/2-Math.abs(a.ly-b.ly));
                    if(overX>0&&overY>0){
                      const push=Math.min(overX,overY)*0.5;
                      const dx=a.lx-b.lx||0.1, dy=a.ly-b.ly||0.1;
                      const d=Math.sqrt(dx*dx+dy*dy)||1;
                      a.lx+=push*dx/d; a.ly+=push*dy/d;
                      b.lx-=push*dx/d; b.ly-=push*dy/d;
                    }
                  }
                  // keep within SVG bounds
                  const m=needMeta[i];
                  m.lx=Math.max(PAD_L+m.bw/2+2,Math.min(PAD_L+MATRIX_W-m.bw/2-2,m.lx));
                  m.ly=Math.max(m.bh/2+2,Math.min(MATRIX_H-m.bh/2-2,m.ly));
                }
              }
              return needMeta.map(({n,vis,bw,bh,ox,oy,lx,ly,rankLabel})=>{
                const moved=Math.abs(lx-ox)>4||Math.abs(ly-oy)>4;
                const inFocus=n.relNorm>=focusMinR&&n.crit>=focusMinC;
                const nMission=needIdToMission[n.id]??-1; // -1 = trasversale
                const isTransversal=nMission===-1;
                const missionMatch=pmMissionFilter===null||isTransversal||nMission===pmMissionFilter;
                const visible=(hoveredPriority?n.priority===hoveredPriority:inFocus)&&missionMatch;
                // compute arrow: from nearest box edge toward anchor point
                const dx=ox-lx, dy=oy-ly, dist=Math.sqrt(dx*dx+dy*dy)||1;
                const ux=dx/dist, uy=dy/dist;
                const ex=lx+ux*(bw/2), ey=ly+uy*(bh/2); // exit point on box edge
                const ax=ox-ux*5, ay=oy-uy*5;
                // trasversali: bordo tratteggiato + badge
                const boxStrokeDash=isTransversal&&pmMissionFilter!==null?"4 2":undefined;
                const boxStrokeW=isTransversal&&pmMissionFilter!==null?1.4:0.8;
                return <g key={n.id} className="pmDot" opacity={visible?1:0.1} onClick={()=>setPmSelected({id:n.id,label:n.label,rel:n.relNorm,crit:n.crit,color:n.color})} style={{cursor:"pointer"}}>
                  {/* label box */}
                  <rect x={lx-bw/2} y={ly-bh/2} width={bw} height={bh} rx="3" fill="#07110e" fillOpacity="0.82" stroke={n.color} strokeWidth={boxStrokeW} strokeOpacity="0.7" strokeDasharray={boxStrokeDash}/>
                  <text fontFamily="sans-serif" fontSize={FONT} fill={n.color} fontWeight="600">
                    {vis.map((line,i)=><tspan key={i} x={lx} y={ly-bh/2+PAD_Y+(i+0.85)*LINE_H} textAnchor="middle">{line}</tspan>)}
                  </text>
                  <text x={lx-bw/2+3} y={ly-bh/2+8} fontSize="6" fill={n.color} fontFamily="monospace" fontWeight="700" opacity="0.65">{rankLabel}</text>
                  {isTransversal&&pmMissionFilter!==null&&<text x={lx+bw/2-3} y={ly-bh/2+8} fontSize="5.5" fill="#f5c542" fontFamily="monospace" fontWeight="700" textAnchor="end" opacity="0.9">TRASV.</text>}
                  <text x={lx} y={ly+bh/2-3} fontSize="7" fill={n.color} fontFamily="monospace" fontWeight="700" opacity="1" textAnchor="middle">{`R${n.relNorm} · C${n.crit}`}</text>
                </g>;
              });
            })()}
          </svg>
          {pmSelected&&<div className="pmPopoverOverlay" onClick={()=>setPmSelected(null)}>
            <div className="pmPopover" onClick={e=>e.stopPropagation()}>
              <button className="pmPopoverClose" onClick={()=>setPmSelected(null)}>✕</button>
              <p className="pmPopoverLabel" style={{color:pmSelected.color}}>{pmSelected.label}</p>
              <div className="pmPopoverScores">
                <div className="pmPopoverScore"><span className="pmPopoverScoreKey">{isIt?"Rilevanza":"Relevance"}</span><span className="pmPopoverScoreVal" style={{color:pmSelected.color}}>{pmSelected.rel}<span className="pmPopoverScoreMax">/10</span></span></div>
                <div className="pmPopoverScore"><span className="pmPopoverScoreKey">{isIt?"Criticità":"Criticality"}</span><span className="pmPopoverScoreVal" style={{color:pmSelected.color}}>{pmSelected.crit}<span className="pmPopoverScoreMax">/10</span></span></div>
              </div>
            </div>
          </div>}
          <div className="pmFocusBar">
            <span className="pmFocusLabel">{isIt?"Focalizza su elementi con":"Focus on needs with"}</span>
            <span className="pmFocusGroup">
              <span className="pmFocusKey">R ≥ &amp; C ≥</span>
              <span className="pmFocusStepper">
                <button className="pmFocusBtn" onClick={()=>{const v=Math.min(10,focusMinR+1);setFocusMinR(v);setFocusMinC(v);}} disabled={focusMinR>=10}>▲</button>
                <span className="pmFocusVal">{focusMinR}</span>
                <button className="pmFocusBtn" onClick={()=>{const v=Math.max(1,focusMinR-1);setFocusMinR(v);setFocusMinC(v);}} disabled={focusMinR<=1}>▼</button>
              </span>
            </span>
            <span className="pmFocusHint">{isIt?"(1 = nessun filtro · 10 = solo il massimo)":"(1 = no filter · 10 = max only)"}</span>
          </div>
        </div>
      </div>
    </main>;
  }


  if(screen==="bridge"&&profile){
    const top5=topNeeds;
    const missions=t.bridgeMissions as {num:string,label:string,need:string}[];
    // group top5 needs by destination mission (fallback → data foundation)
    const needsByMission:Record<number,typeof top5>=Object.fromEntries([0,1,2,3,4,5].map(i=>[i,[]]));
    top5.forEach((n,rank)=>{
      const mi=needIdToMission[n.id]??0;
      needsByMission[mi].push({...n,_rank:rank+1} as typeof top5[0] & {_rank:number});
    });
    return <main className="bridgeScreen">
      <header className="missionNav missionNavTrust">
        <button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button>
        <div className="missionProgress"><span className="activeDot"/> THE QUEST</div>
        {renderTrustBar()}
        <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
      </header>
      <section className="bridgeIntroBar">
        <div>
          <p className="eyebrow">{t.bridgeKicker}</p>
          <h1>{t.bridgeTitle}</h1>
          <p className="bridgeIntroText">{t.bridgeIntro}</p>
        </div>
        <button className="actionButton bridgeCta" onClick={()=>setScreen("missions")}>{t.bridgeCta}<b>→</b></button>
      </section>
      <section className="bridgeMapping">
        {/* Riquadro prerequisito — missione 0 */}
        {(()=>{
          const m=missions[0];
          const assigned=(needsByMission[0]||[]) as (typeof top5[0] & {_rank:number})[];
          const hasNeeds=assigned.length>0;
          return <div className="bridgePrereqBlock">
            <div className="bridgeBlockLabel">{(t as any).bridgePrereqLabel}</div>
            <div className={`bridgeMapRow bridgeMapRowPrereq${hasNeeds?"":" bridgeMapRowEmpty"}`}>
              <div className="bridgeMapNeedsCol">
                {hasNeeds ? assigned.map(n=>(
                  <div key={n.id} className="bridgeMapNeed">
                    <span className="bridgeMapNeedRank">{String(n._rank).padStart(2,"0")}</span>
                    <div>
                      <small>{language==="it"?"LA TUA ESIGENZA":"YOUR DATA NEED"}</small>
                      <strong>{n.label}</strong>
                      <span className="bridgeMapNeedPrio">{t.priorityNames[n.priority]}</span>
                    </div>
                  </div>
                )) : (
                  <div className="bridgeMapNeedEmpty">
                    <span className="bridgeMapNeedEmptyDash">—</span>
                    <small>{language==="it"?"Nessuna esigenza prioritaria assegnata":"No priority need assigned"}</small>
                  </div>
                )}
              </div>
              <div className="bridgeMapConnector">
                <span className={`bridgeMapConnectorLine${hasNeeds?"":" empty"}`}/>
                <span className={`bridgeMapConnectorArrow${hasNeeds?"":" empty"}`}>▶</span>
              </div>
              <div className={`bridgeMapMission${hasNeeds?"":" bridgeMapMissionEmpty"}`}>
                <span className="bridgeMapMissionNum">{m.num}</span>
                <div>
                  <small>{language==="it"?"SFIDA DELLA QUEST":"QUEST CHALLENGE"}</small>
                  <strong className="bridgeMapMissionTitle">{m.label}</strong>
                  <p className="bridgeMapMissionNeed">{m.need}</p>
                </div>
              </div>
            </div>
          </div>;
        })()}
        {/* Riquadro capacità ulteriori — missioni 1–4 */}
        <div className="bridgeCapBlock">
          <div className="bridgeBlockLabel">{(t as any).bridgeCapLabel}</div>
          {missions.slice(1).map((m,idx)=>{
            const mi=idx+1;
            const assigned=(needsByMission[mi]||[]) as (typeof top5[0] & {_rank:number})[];
            const hasNeeds=assigned.length>0;
            return <div key={m.num} className={`bridgeMapRow${hasNeeds?"":" bridgeMapRowEmpty"}`}>
              <div className="bridgeMapNeedsCol">
                {hasNeeds ? assigned.map(n=>(
                  <div key={n.id} className="bridgeMapNeed">
                    <span className="bridgeMapNeedRank">{String(n._rank).padStart(2,"0")}</span>
                    <div>
                      <small>{language==="it"?"LA TUA ESIGENZA":"YOUR DATA NEED"}</small>
                      <strong>{n.label}</strong>
                      <span className="bridgeMapNeedPrio">{t.priorityNames[n.priority]}</span>
                    </div>
                  </div>
                )) : (
                  <div className="bridgeMapNeedEmpty">
                    <span className="bridgeMapNeedEmptyDash">—</span>
                    <small>{language==="it"?"Nessuna esigenza prioritaria assegnata":"No priority need assigned"}</small>
                  </div>
                )}
              </div>
              <div className="bridgeMapConnector">
                <span className={`bridgeMapConnectorLine${hasNeeds?"":" empty"}`}/>
                <span className={`bridgeMapConnectorArrow${hasNeeds?"":" empty"}`}>▶</span>
              </div>
              <div className={`bridgeMapMission${hasNeeds?"":" bridgeMapMissionEmpty"}`}>
                <span className="bridgeMapMissionNum">{m.num}</span>
                <div>
                  <small>{language==="it"?"SFIDA DELLA QUEST":"QUEST CHALLENGE"}</small>
                  <strong className="bridgeMapMissionTitle">{m.label}</strong>
                  <p className="bridgeMapMissionNeed">{m.need}</p>
                </div>
              </div>
            </div>;
          })}
        </div>
      </section>
    </main>;
  }

  if(screen==="compare"&&profile){
    const missionImgs={
      positive:["./envizi-data-automation.png","./energy-envizi-analytics.png","./supply-chain-envizi.png","./reporting-envizi.png","./planning-envizi.png","./framework-envizi.png"],
      warning:["./envizi-manual-forms.png","./energy-manual-dashboard.png","./supply-chain-portal.png","./reporting-intermediate.png","./planning-intermediate.png","./framework-intermediate.png"],
      critical:["./envizi-spreadsheets-email.png","./energy-asis-fragmented.png","./supply-chain-asis.png","./reporting-asis.png","./planning-asis.png","./framework-asis.png"]
    };
    const m0=selectedMission===0;
    const isIt=language==="it";
    const options=[
      {key:"critical" as Outcome,label:"C",title:active.optionC,detail:active.optionCDetail,img:missionImgs.critical[selectedMission],
        solutionTag:m0?(isIt?"IBM Envizi Servizio Gestito":"IBM Envizi Managed Service"):undefined,
        solutionDetail:m0?(isIt?"Sperimenta con un nostro partner la gestione dei dati ESG.":"Experience ESG data management with one of our partners."):undefined},
      {key:"warning" as Outcome,label:"B",title:active.optionB,detail:active.optionBDetail,img:missionImgs.warning[selectedMission],
        solutionTag:m0?(isIt?"IBM Envizi Standard":"IBM Envizi Standard"):undefined,
        solutionDetail:m0?(isIt?"Modulo Data Foundation. Semplicità e velocità pronti per evolvere con i tuoi bisogni.":"Data Foundation Module. Simplicity and speed, ready to evolve with your needs."):undefined},
      {key:"positive" as Outcome,label:"A",title:active.optionA,tag:(active as any).optionATag as string|undefined,detail:active.optionADetail,img:missionImgs.positive[selectedMission],
        solutionTag:m0?(isIt?"IBM Envizi Premium":"IBM Envizi Premium"):undefined,
        solutionDetail:m0?(isIt?"Modulo Data Foundation e Connettori. Automazione e Affidabilità a portata di mano.":"Data Foundation Module and Connectors. Automation and Reliability at your fingertips."):undefined},
    ];
    const currentRatings=asIsRatings[selectedMission]||(active.asIsItems.map(()=>"alto" as "alto"|"medio"|"basso"));
    const ratingVal={"alto":25,"medio":12,"basso":0};
    const totalCrit=currentRatings.reduce((s,r)=>s+ratingVal[r],0);
    const critLevel=totalCrit<=25?"bassa":totalCrit<=50?"media":"alta";
    const critColor=critLevel==="alta"?"#ff6b6b":critLevel==="media"?"#f5c542":"#39efb4";
    const critLabel=language==="it"
      ?{alta:"CRITICITÀ ALTA",media:"CRITICITÀ MEDIA",bassa:"CRITICITÀ BASSA"}
      :{alta:"HIGH CRITICALITY",media:"MEDIUM CRITICALITY",bassa:"LOW CRITICALITY"};
    // badge appears only on the card whose outcome matches the criticality level
    const critOnCard={"alta":"positive","media":"warning","bassa":"critical"} as Record<string,string>;
    return <main className="compareScreen"><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {t.mission} <b>{String(selectedMission+1).padStart(2,"0")}</b><i>/</i>06</div><button className="introBackBtn" onClick={()=>{setScreenHistory(h=>h.filter(s=>s!=="compare"));setScreenState("asis");}}>← {language==="it"?"Indietro":"Back"}</button><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header>
    <section className="compareBody">
      <h1>{language==="it"?"Scegli la strada":"Choose your path"}</h1>
      <p className="compareHint">{language==="it"?"Clicca sull'immagine per selezionare la tua scelta e proseguire.":"Click an image to make your choice and continue."}</p>
      <div className="compareGrid">
        {options.map(opt=>{
          return <div key={opt.key} className="compareCardWrap">
            <article className={`compareCard ${opt.key}`} onClick={()=>handleDecision(opt.key)}>
            {/* RIGA 1 — titolo soluzione */}
            <div className="compareSolution">
              <strong>{opt.title}</strong>
              {opt.key==="positive"&&(opt as any).tag&&<span className="compareSolutionTag">{(opt as any).tag}</span>}
            </div>
            {/* RIGA 2 — immagine */}
            <div className="compareImg">
              <img src={opt.img} alt={opt.title}/>
              <div className="compareImgOverlay"><span>{language==="it"?"Scegli →":"Select →"}</span></div>
            </div>
            {/* RIGA 3 — commento scenario */}
            <div className="compareRowTop">
              <p className="compareDetail">{opt.detail}</p>
            </div>
          </article>
          </div>;
        })}
      </div>
      {/* riga PoC — solo colonna 2 (warning), solo missione 0 */}
      {m0&&<div className="compareGrid compareGridSolutions">
        <div/>
        <div className="comparePocBox">
          <span className="comparePocBoxTag">{isIt?"Envizi Proof of Concept":"Envizi Proof of Concept"}</span>
          <p className="comparePocBoxDetail">{isIt?"Verifica con un test drive la copertura dei tuoi bisogni.":"Verify your needs coverage with a test drive."}</p>
        </div>
        <div/>
      </div>}
      {/* riga box soluzioni — stessa griglia 3 col, allineata sotto */}
      {options.some(o=>(o as any).solutionTag)&&<div className="compareGrid compareGridSolutions">
        {options.map(opt=>(
          <div key={opt.key}>
            {(opt as any).solutionTag&&<div className="compareSolutionBox">
              <span className="compareSolutionBoxTag">{(opt as any).solutionTag}</span>
              <p className="compareSolutionBoxDetail">{(opt as any).solutionDetail}</p>
            </div>}
          </div>
        ))}
      </div>}
    </section></main>;
  }

  if(screen==="tobe"&&profile){
    const tobeDeltas:{[mi:number]:{positive:(number|null)[],warning:(number|null)[],critical:(number|null)[]}}={
      0:{positive:[0.83,0.38,0.17,0.10],warning:[0.92,0.72,0.78,0.60],critical:[1,1,1,1]},
      1:{positive:[0.82,0.88,0.13,0.18],warning:[0.93,0.95,0.48,0.55],critical:[1,1,1,1]},
      2:{positive:[null,0.62,null,0.12],warning:[null,0.80,null,0.45],critical:[null,1,null,1]},
      3:{positive:[0.33,0.21,0.12,0.28],warning:[0.72,0.65,0.55,0.60],critical:[1,1,1,1]},
      4:{positive:[null,null,3.2,0.55],warning:[null,null,1.8,0.75],critical:[null,null,1,1]},
      5:{positive:[null,0.26,0.12,0.22],warning:[null,0.70,0.52,0.61],critical:[null,1,1,1]},
    };
    const items=missionItems(selectedMission);
    const units=missionUnits(selectedMission);
    const userVals=missionParameters[selectedMission]||[];
    const deltas=tobeDeltas[selectedMission]?.[pendingOutcome]||items.map(()=>null);
    const outcomeColor=pendingOutcome==="positive"?"#39efb4":pendingOutcome==="warning"?"#ffc07c":"#ff7777";
    const outcomeLabel2=pendingOutcome==="positive"?(language==="it"?"Scelta A — Envizi":"Option A — Envizi"):pendingOutcome==="warning"?(language==="it"?"Scelta B — Soluzione intermedia":"Option B — Intermediate"):language==="it"?"Scelta C — Rimandare":"Option C — Postpone";
    return <main className="tobeScreen"><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {t.mission} <b>{String(selectedMission+1).padStart(2,"0")}</b><i>/</i>06</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="tobeBody"><div className="tobeIntro"><p className="eyebrow">{t.tobeKicker}</p><h1>{t.tobeTitle}</h1><p className="tobeSubtitle">{t.tobeSubtitle}</p><div className="tobeChoiceBadge" style={{borderColor:outcomeColor,color:outcomeColor}}>{outcomeLabel2}</div></div><div className="tobeGrid">{items.map((item,i)=>{const raw=userVals[i]?parseFloat(userVals[i]):null;const factor=deltas[i];const hasDelta=factor!==null&&factor!==1;const tobeVal=raw!==null&&factor!==null?raw*factor:null;const isImprovement=factor!==null&&factor<1;const isWorse=factor!==null&&factor>1;const deltaSign=isImprovement?"↓":isWorse?"↑":"—";const deltaColor=isImprovement?outcomeColor:isWorse?"#ff7777":"#7a9a90";return <article key={item.title} className={`tobeCard${hasDelta?" tobeCardChanged":""}`}><div className="tobeCardHeader"><span className="tobeCardNum">{String(i+1).padStart(2,"0")}</span><strong>{item.title}</strong></div><div className="tobeRow"><div className="tobeCol"><small>{t.tobeAsIs}</small><b>{raw!==null?`${raw} ${units[i]}`:item.metric}</b></div><div className="tobeArrow" style={{color:deltaColor}}>{deltaSign}</div><div className="tobeCol tobeColNew"><small>{t.tobeToBe}</small><b style={{color:tobeVal!==null?outcomeColor:undefined}}>{tobeVal!==null?`${tobeVal%1===0?tobeVal:tobeVal.toFixed(1)} ${units[i]}`:factor===1?(language==="it"?"Invariato":"Unchanged"):(language==="it"?"n.d.":"n/a")}</b></div></div>{hasDelta&&tobeVal!==null&&raw!==null&&<div className="tobeDeltaBar"><span className="tobeDeltaLabel" style={{color:deltaColor}}>{t.tobeDelta}: {isImprovement?"-":"+"}{Math.abs(Math.round((1-factor)*100))}%</span></div>}</article>; })}</div><div className="tobeDisclaimer"><span>⚠</span><p>{t.tobeDisclaimer}</p></div><button className="actionButton" onClick={()=>setScreen(pendingOutcome==="positive"?"success":"negative")}>{t.tobeCta}<b>→</b></button></section></main>;
  }






  if(screen==="introCopy2"&&profile)return <main className="introScreen"><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> YOUR CHALLENGE</div><div className="introNavRight"><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></div></header><section className="characterStage"><img src={`./characters/${profile}-neutral.png`} alt={name}/><div className="characterTag characterTagRaised"><span className="statusDot"/><div><small>ESG MANAGER</small><strong>{name}</strong></div></div></section><section className="introBody"><p className="eyebrow">{t.introKicker}</p><h1>{t.introTitle}</h1><p className="storyText">{t.introBody}</p><div className="introTrustBox"><p className="introScoreLabel">{t.introScoreLabel}</p>{renderTrustBar()}</div><div className="introCtaRow"><button className="actionButton questLaunchBtn" onClick={()=>setScreen("asis")}>{t.introStart}<b>→</b></button></div></section></main>;


  if(screen!=="onboarding"&&profile){const result=screen==="negative"||screen==="success";return <main className={`missionScreen mission-${selectedMission} ${screen} ${screen==="negative"?(negativeChoice==="form"?"formOutcome":"asIsOutcome"):""}`}><header className="missionNav"><button className="brand brandButton" onClick={reset}><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></button><div className="missionProgress"><span className="activeDot"/> {t.mission} <b>{String(selectedMission+1).padStart(2,"0")}</b><i>/</i>06</div><button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button></header><section className="characterStage"><img src={imageFor(profile,screen)} alt={`${name} · ${screen}`}/><div className="characterTag"><span className="statusDot"/><div><small>ESG MANAGER</small><strong>{name}</strong></div></div>{screen==="trust"&&<button className="actionButton trustStageCta" onClick={()=>setScreen(selectedMission===0?"milestone":selectedMission===1?"energyFoundation":selectedMission===2?"supplyFoundation":selectedMission===3?"reportingFoundation":selectedMission===4?"planningFoundation":selectedMission===5?"frameworkFoundation":"missions")}>{t.trustContinue}<b>→</b></button>}</section><section className="missionContent"><div className="missionLabel"><span>{t.mission} {String(selectedMission+1).padStart(2,"0")}</span><i>90 DAYS</i></div>
    {screen==="briefing"&&(()=>{const effects=(t.crossEffects[selectedMission]||[]).filter(e=>{const o=missionOutcomes[e.from];return o&&(e[o as keyof typeof e] as string|null)!==null});return<><h1>{language==="it"?missionCatalog[selectedMission].it:missionCatalog[selectedMission].en}</h1><div className="companyChip"><strong>{displayCompanyName}</strong><span>{t.companyFacts}</span></div>{effects.length>0&&<div className="crossEffectBanners">{effects.map(e=>{const o=missionOutcomes[e.from] as Outcome;const msg=e[o as keyof typeof e] as string;return<div key={e.from} className={`crossEffectBanner ${o}`}><span className="crossEffectIcon">{o==="positive"?"✓":"!"}</span><p><strong>{t.crossEffectLabel} · {language==="it"?missionCatalog[e.from].it:missionCatalog[e.from].en}:</strong> {msg}</p></div>})}</div>}<p className="storyText">{(active.briefing as string).replace("COMPANY_NAME",displayCompanyName).replace("PLANTS_COUNT",String(companyDims[1]))}</p><div className="objectiveBox"><small>{t.objective}</small><p>{active.objectiveText}</p></div><button className="actionButton" onClick={()=>{if(selectedMission===0){setPmMissionFilter(0);setPmFromBriefing(true);setScreen("asis");}else{setScreen("missionIntro");}}}>{t.analyse}<b>→</b></button></>;})()}
    {screen==="asis"&&(()=>{const ratingVal={"alto":25,"medio":12,"basso":0};const currentRatings=asIsRatings[selectedMission]||(active.asIsItems.map(()=>"alto" as "alto"|"medio"|"basso"));const total=currentRatings.reduce((s,r)=>s+ratingVal[r],0);const totalColor=total<=25?"#39efb4":total<=50?"#f5c542":"#ff6b6b";const totalLabel=language==="it"?(total<=25?"BASSA":total<=50?"MEDIA":"ALTA"):(total<=25?"LOW":total<=50?"MEDIUM":"HIGH");const setRating=(i:number,v:"alto"|"medio"|"basso")=>{const next=[...currentRatings];next[i]=v;setAsIsRatings({...asIsRatings,[selectedMission]:next});};return<><div className="asisHeader"><div><p className="resultEyebrow">{t.asIsKicker}</p><h1>{active.asIsTitle}</h1></div></div><p className="storyText asisIntroText">{(active.asIsIntro as string).replace("COMPANY_NAME",displayCompanyName)}</p><div className="asIsRatingGrid">{active.asIsItems.map((item,i)=>{const r=currentRatings[i];return<article key={item.title} className={`asIsRatingCard asIsRating-${r}`}><div className="asIsRatingCardTop"><h2>{item.title}</h2><p>{item.detail}</p></div><div className="asIsRatingButtons"><button className={`asIsRatingBtn${r==="alto"?" asIsRatingBtnActive asIsRatingBtnAlto":""}`} onClick={()=>setRating(i,"alto")}>{language==="it"?"Alto":"High"}</button><button className={`asIsRatingBtn${r==="medio"?" asIsRatingBtnActive asIsRatingBtnMedio":""}`} onClick={()=>setRating(i,"medio")}>{language==="it"?"Medio":"Medium"}</button><button className={`asIsRatingBtn${r==="basso"?" asIsRatingBtnActive asIsRatingBtnBasso":""}`} onClick={()=>setRating(i,"basso")}>{language==="it"?"Basso":"Low"}</button></div></article>})}</div><div className="asisTotal"><span className="asisTotalLabel">{language==="it"?"Criticità totale":"Total criticality"}</span><span className="asisTotalScore" style={{color:totalColor}}>{total}<span className="asisTotalMax">/100</span></span><span className="asisTotalBadge" style={{color:totalColor,borderColor:totalColor}}>{totalLabel}</span></div><button className="actionButton asisBottomBtn" onClick={()=>setScreen("compare")}>{t.proceedDecision}<b>→</b></button></>;})()}
    {screen==="trust"&&<><p className="resultEyebrow">{t.trustKicker}</p><h1>{t.trustTitle}</h1><p className="storyText">{activeTrustIntro}</p>{activeTrustSources&&activeTrustSources.length>0&&<p className="trustSourceList">{language==="it"?"Fonti: ":"Sources: "}{activeTrustSources.map((s,i)=><><a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>{i<activeTrustSources.length-1&&" · "}</>)}</p>}<div className="trustEvolutionChart"><small className="trustChartLabel">{language==="it"?"Evoluzione missione per missione":"Mission-by-mission evolution"}</small><svg width="100%" viewBox={"0 0 "+trustTotalW+" "+(TRUST_CHART_H+40)} preserveAspectRatio="xMidYMid meet">{[30,50,70,100].map(v=>{const y=4+TRUST_CHART_H-(v/100)*TRUST_CHART_H;return<g key={v}><line x1={TRUST_SVG_PAD_X} x2={trustTotalW-TRUST_SVG_PAD_X} y1={y} y2={y} stroke="#1e3a30" strokeWidth="1" strokeDasharray="3 4"/><text x={TRUST_SVG_PAD_X-2} y={y+4} fontSize="8" fill="#4a6d60" textAnchor="end">{v}</text></g>;})} {trustSteps.map((s,i)=>{const x=TRUST_SVG_PAD_X+i*(TRUST_BAR_W+TRUST_BAR_GAP);const isEmpty=s.val===null;const barH=isEmpty?12:(s.val!/100)*TRUST_CHART_H;const barY=4+TRUST_CHART_H-barH;return<g key={i}>{s.isCurrent&&<rect x={x-5} y={4} width={TRUST_BAR_W+10} height={TRUST_CHART_H+8} rx="8" fill="rgba(57,239,180,0.07)" stroke={s.fill==="none"?"#39efb4":s.fill} strokeWidth="1.5" strokeDasharray={s.fill==="none"?"4 3":"0"}/>}<rect x={x} y={isEmpty?barY+barH-12:barY} width={TRUST_BAR_W} height={isEmpty?12:barH} rx="5" fill={isEmpty?"none":s.fill} stroke={s.stroke} strokeWidth={s.strokeW} opacity={isEmpty?1:0.92}/>{!isEmpty&&<text x={x+TRUST_BAR_W/2} y={barY-5} fontSize="11" fill={i===0?"#7fa898":s.isCurrent?"#f2fff9":"#c9e8dc"} textAnchor="middle" fontWeight={s.isCurrent?"700":"400"}>{s.val}</text>}{isEmpty&&<text x={x+TRUST_BAR_W/2} y={barY+barH/2+5} fontSize="9" fill="#3d6052" textAnchor="middle">—</text>}<text x={x+TRUST_BAR_W/2} y={4+TRUST_CHART_H+18} fontSize="8" fill={s.isCurrent?"#8affda":isEmpty?"#3d6052":"#7da89a"} textAnchor="middle">{s.label.split("\n")[0]}</text>{s.label.split("\n")[1]&&<text x={x+TRUST_BAR_W/2} y={4+TRUST_CHART_H+28} fontSize="8" fill={s.isCurrent?"#8affda":isEmpty?"#3d6052":"#7da89a"} textAnchor="middle">{s.label.split("\n")[1]}</text>}</g>;})} </svg></div><div className="trustPanel"><div className="trustScoreCard"><small>{t.trustScore}</small><strong>{trustScore}</strong><span>{t.trustBase}: 30 · {t.trustMax}</span><div className="trustBar"><span style={{width:trustScore+"%"}}/></div><p>{t.trustProgressLabel}</p></div><div className="trustStakeholders"><small>{t.trustStakeholders}</small><div><span>{t.trustBoard}</span><span>{t.trustBanks}</span><span>{t.trustClients}</span><span>{t.trustAuditors}</span></div></div><div className="trustGainCard"><small>{t.trustCurrentDecision}</small><strong>{missionOutcomes[selectedMission]==="positive"?(selectedMission===0?(language==="it"?"Scelta fondante · +25":"Foundational choice · +25"):t.trustGainPositive):missionOutcomes[selectedMission]==="warning"?t.trustGainWarning:t.trustGainCritical}</strong><p>{t.trustPersonaLabel}</p><b>{name}</b><span>{profile==="marco"?t.maleRole:t.femaleRole}</span></div></div></>}

    {result&&<><p className="resultEyebrow">{screen==="success"?active.enviziValue:t.impact}</p><h1>{screen==="success"?active.successTitle:negativeChoice==="form"?active.warningTitle:active.criticalTitle}</h1><p className="storyText">{screen==="success"?active.successText:negativeChoice==="form"?active.warningText:active.criticalText}</p>{screen==="success"&&<div className="enviziFactChip"><span className="efcNumber">40.000+</span><div className="efcText"><span className="efcLabel">{t.efcLabel}</span><span className="efcDetail">{t.efcByMission[selectedMission]}</span><span className="efcSource"><a href="https://www.ibm.com/docs/it/envizi-esg-suite?topic=reference-emission-factors" target="_blank" rel="noreferrer">{language==="it"?"Libreria fattori Envizi ↗":"Envizi factor library ↗"}</a>{" · "}<span>{language==="it"?"Compatibile anche con ecoinvent":"Also compatible with ecoinvent"}</span></span></div></div>}<div className="metrics"><div><span>{active.metricLabels[0]}</span><strong>{resultValues[0]}</strong></div><div><span>{active.metricLabels[1]}</span><strong>{resultValues[1]}</strong></div><div><span>{active.metricLabels[2]}</span><strong>{resultValues[2]}</strong></div></div><blockquote className="boardQuote"><small>{t.boardQuoteLabel} · CFO, {displayCompanyName}</small><p>"{t.boardQuotes[selectedMission][screen==="success"?"positive":negativeChoice==="form"?"warning":"critical"]}"</p></blockquote><button className="actionButton" onClick={()=>setScreen(selectedMission===0?"milestone":"missions")}>{t.backScenarios}<b>→</b></button>{screen==="success"&&renderSaveBtn(language==="it")}</>}
  </section></main>}


  if(screen==="cover")return <main className="coverScreen" style={{position:"relative"}}><img className="coverImage" src="./cover-marco.png" alt="Envizi Impact Quest"/><div className="coverCta"><button className="coverStartBtn" onClick={()=>setScreenState("welcome")}>START</button></div></main>;

  if(screen==="welcome"){
    const isIt=language==="it";
    // Leggi tutte le quest salvate con i dati
    const allSavedKeys=getSavedQuestKeys();
    const allSaved=allSavedKeys.map(k=>{
      let d:any={};
      try{d=JSON.parse(localStorage.getItem(`envizi-quest-save-${k}`)||"{}");}catch(e){}
      return {key:k,userName:(d.userName||"") as string,missionOutcomes:d.missionOutcomes||{}};
    });
    // Utenti unici case-insensitive (mantiene prima occorrenza, ordina)
    const knownUsers=(()=>{const seen=new Set<string>();const out:string[]=[];for(const s of allSaved){const u=s.userName.trim();if(u&&!seen.has(u.toLowerCase())){seen.add(u.toLowerCase());out.push(u);}}return out.sort((a,b)=>a.toLowerCase().localeCompare(b.toLowerCase()));})();
    // Suggerimenti utente: match parziale sul campo (esclude match esatto case-insensitive)
    const userSuggestions=knownUsers.filter(u=>userName.trim()&&u.toLowerCase().includes(userName.trim().toLowerCase())&&u.toLowerCase()!==userName.trim().toLowerCase());
    // Quest filtrate per utente corrente (match esatto, case-insensitive)
    const userQuests=userName.trim()
      ? allSaved.filter(s=>s.userName.toLowerCase()===userName.trim().toLowerCase())
      : [];
    return <main className="welcomeScreen" style={{position:"relative"}}>
      
      <img src="./welcome-gen.png" alt="" className="welcomeBg" aria-hidden="true"/>
      <div className="welcomeBgOverlay"/>
      <header className="missionNav" style={{position:"relative",zIndex:3}}>
        <div className="brand"><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></div>
        <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
          <button className="secondaryAction" style={{fontSize:"clamp(11px,1vw,14px)",padding:"8px 16px"}} onClick={()=>setScreenState("cover")}>← {isIt?"Indietro":"Back"}</button>
          <button className="langMini" onClick={()=>setLanguage(language==="it"?"en":"it")}>{language==="it"?"EN":"IT"}</button>
        </div>
      </header>
      <div className="welcomePanel">
        {/* LEFT: form */}
        <div className="welcomeLeft">
          <p className="eyebrow">IBM ENVIZI · IMPACT QUEST</p>
          <h1 className="welcomeTitle">{isIt?"Benvenuto alla Envizi Quest":"Welcome to Envizi Quest"}</h1>
          <p className="welcomeSubtitle">{isIt?"Inserisci il tuo nome o selezionane uno esistente per vedere le tue quest salvate.":"Enter your name or pick an existing one to see your saved quests."}</p>
          <div className="welcomeForm">
            {/* Campo nome con suggerimenti utenti */}
            <div className="welcomeField" style={{position:"relative"}}>
              <label className="welcomeLabel">{isIt?"Il tuo nome":"Your name"}</label>
              <input
                className="welcomeInput"
                type="text"
                placeholder={isIt?"Es. Felice Petrignano":"E.g. Felice Petrignano"}
                value={userName}
                onChange={e=>setUserName(e.target.value)}
                autoComplete="off"
              />
              {/* Dropdown suggerimenti utenti esistenti */}
              {userSuggestions.length>0&&(
                <ul className="welcomeUserSuggestions">
                  {userSuggestions.map(u=>(
                    <li key={u}>
                      <button className="welcomeUserSuggBtn" onClick={()=>setUserName(u)}>
                        <span className="welcomeUserSuggIcon">👤</span>{u}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {/* Pill con tutti gli utenti noti (se il campo è vuoto) */}
              {!userName.trim()&&knownUsers.length>0&&(
                <div className="welcomeKnownUsers">
                  {knownUsers.map(u=>(
                    <button key={u} className="welcomeUserPill" onClick={()=>setUserName(u)}>{u}</button>
                  ))}
                </div>
              )}
            </div>
            {/* Campo nome quest */}
            <div className="welcomeField">
              <label className="welcomeLabel">{isIt?"Nome della Quest (per il salvataggio)":"Quest name (for saving)"}</label>
              <input className="welcomeInput" type="text" placeholder={isIt?"Es. NovaForge — sessione 1":"E.g. NovaForge — session 1"} value={questName} onChange={e=>setQuestName(e.target.value)}/>
            </div>
            {userName.trim()&&questName.trim()&&(
              <button className="actionButton welcomeStartBtn" onClick={()=>{if(questName.trim())saveQuest(questName.trim());setScreenState("onboarding");}}>
                {isIt?"Inizia la Quest →":"Start the Quest →"}
              </button>
            )}
          </div>
          <div className="welcomeNote">
            <span className="welcomeNoteIcon">ℹ</span>
            <p>{isIt?"Per recuperare utenti e Quest precedentemente registrati, collegati dal medesimo browser utilizzato in precedenza.":"To retrieve previously registered users and Quests, connect from the same browser used before."}</p>
          </div>
        </div>
        {/* RIGHT: quest dell'utente corrente */}
        <div className="welcomeRight">
          {userName.trim()?(
            <>
              <p className="welcomeSavedTitle">
                {isIt?"Quest di":"Quests for"} <strong style={{color:"#39efb4"}}>{userName.trim()}</strong>
              </p>
              <button className="welcomeUserBackBtn" onClick={()=>setUserName("")}>← {isIt?"Cambia utente":"Change user"}</button>
              {userQuests.length===0?(
                <p className="welcomeEmpty">{isIt?"Nessuna Quest salvata per questo utente.":"No saved quests for this user."}</p>
              ):(
                <ul className="welcomeSavedList">
                  {userQuests.map(({key,missionOutcomes:mo})=>{
                    const completed=Object.keys(mo).length;
                    return <li key={key} className="welcomeSavedItem">
                      <div className="welcomeSavedInfo">
                        <strong>{key}</strong>
                        <small>{isIt?`${completed}/6 missioni`:`${completed}/6 missions`}</small>
                      </div>
                      <div className="welcomeSavedActions">
                        <button className="welcomeLoadBtn" onClick={()=>{loadQuest(key);setScreenState("onboarding");}}>{isIt?"Riprendi →":"Resume →"}</button>
                        <button className="welcomeDownloadBtn" title={isIt?"Salva come file .envizi-quest (controlla la cartella Download del browser)":"Save as .envizi-quest file (check your browser Downloads folder)"} onClick={()=>downloadQuest(key)}>⬇</button>
                        <button className="welcomeDeleteBtn" onClick={()=>{deleteQuest(key);setScreenState("cover");setTimeout(()=>setScreenState("welcome"),10);}}>✕</button>
                      </div>
                    </li>;
                  })}
                </ul>
              )}
              {/* Upload zone */}
              <div className="welcomeUploadZone" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)uploadQuestFile(f);}}>
                <input id="welcomeUploadInput" type="file" accept=".envizi-quest,.json" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)uploadQuestFile(f);e.target.value="";}}/>
                <button className="welcomeUploadBtn" onClick={openUploadPicker}>
                  <span className="welcomeUploadIcon">⬆</span>
                  <span className="welcomeUploadText">{isIt?"Importa una Quest (.envizi-quest)":"Import a Quest (.envizi-quest)"}</span>
                </button>
                <span className="welcomeUploadHint">{isIt?"Scegli cartella o trascina il file qui":"Choose folder or drag file here"}</span>
              </div>
            </>
          ):(
            <>
              <p className="welcomeSavedTitle">{isIt?"Quest salvate":"Saved quests"}</p>
              {allSaved.length===0
                ?<p className="welcomeEmpty">{isIt?"Nessuna Quest salvata ancora.":"No saved quests yet."}</p>
                :<ul className="welcomeSavedList">
                  {allSaved.map(({key,userName:u,missionOutcomes:mo})=>{
                    const completed=Object.keys(mo).length;
                    return <li key={key} className="welcomeSavedItem">
                      <div className="welcomeSavedInfo">
                        <strong>{key}</strong>
                        <small>{u?`${u} · `:""}{isIt?`${completed}/6 missioni`:`${completed}/6 missions`}</small>
                      </div>
                      <div className="welcomeSavedActions">
                        <button className="welcomeLoadBtn" onClick={()=>{loadQuest(key);setScreenState("onboarding");}}>{isIt?"Riprendi →":"Resume →"}</button>
                        <button className="welcomeDeleteBtn" onClick={()=>{deleteQuest(key);setScreenState("cover");setTimeout(()=>setScreenState("welcome"),10);}}>✕</button>
                      </div>
                    </li>;
                  })}
                </ul>
              }
            </>
          )}
        </div>
      </div>
    </main>;
  }


  return <main className="onboarding" style={{position:"relative"}}><div className="ambient ambientOne"/><div className="ambient ambientTwo"/><header className="topbar"><div className="brand"><span className="brandMark">e·</span><span>Envizi<br/>Impact Quest</span></div></header><section className="introPanel"><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p className="intro">{t.intro}</p><p className="thread">{t.sameStory}</p><p className="authorDisclaimer">{t.disclaimer}<a href="mailto:felice_petrignano@it.ibm.com">felice_petrignano@it.ibm.com</a></p><button className="secondaryAction" style={{fontSize:"clamp(11px,1vw,14px)",padding:"8px 16px",marginTop:"18px",alignSelf:"flex-start"}} onClick={()=>setScreenState("welcome")}>← {language==="it"?"Indietro":"Back"}</button></section><section className="choicePanel"><div className="choiceHeading"><div><span className="choiceNumber">01</span><h2>{t.language}</h2></div><div className="languageSwitch"><button className={language==="it"?"active":""} onClick={()=>setLanguage("it")}>Italiano <span>🇮🇹</span></button><button className={language==="en"?"active":""} onClick={()=>setLanguage("en")}>English <span>🇬🇧</span></button></div></div><div className="profileSection"><div className="profileTitle profileTitleHighlighted"><span className="choiceNumber">02</span><h2>{t.profile}</h2></div><div className="profilesWrap"><div className="profiles profilesGuided">{(["marco","luisa"] as Profile[]).map(p=><div key={p} className="profileCardWrap"><button className={`profileCard ${profile===p?"selected":""}`} onClick={()=>setProfile(p)}><img src={`./characters/${p}-neutral.png`} alt={p==="marco"?"Marco Rossi":"Luisa Bianchi"}/><div className="profileInfo"><span className="statusDot"/><div><strong>{p==="marco"?"Marco Rossi":"Luisa Bianchi"}</strong><small>{p==="marco"?t.maleRole:t.femaleRole}</small></div></div></button><button className="profileChooseBtn" onClick={()=>{setProfile(p);localStorage.setItem("envizi-quest-profile",JSON.stringify({language,profile:p}));setScreen("approach");}}>{language==="it"?`Scegli ${p==="marco"?"Marco":"Luisa"}`:`Choose ${p==="marco"?"Marco":"Luisa"}`} →</button></div>)}</div></div></div><p className="bobCredit">{language==="it"?"Sviluppato con IBM Bob":"Developed with IBM Bob"}</p></section></main>;
}
