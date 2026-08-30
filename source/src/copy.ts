export const copy = {
  it: {
    formTitleUpdated:"Un beneficio rapido, ma limitato.", formTextUpdated:"I form standardizzano l'inserimento e riducono alcuni errori rispetto all'AS-IS. Restano però attività manuali, solleciti e fonti scollegate: con la crescita dei volumi il vantaggio si stabilizza e non scala.", impactUpdated:"Variazione rispetto all'AS-IS attuale · 12 mesi dopo", asIsTitleUpdated:"Nessun passo avanti.", asIsTextUpdated:"Mantenere l'AS-IS lascia invariati qualità dei dati e tempi di reporting, con un livello di fiducia del CdA che resta basso. Il costo della scelta è rinunciare ai benefici e rimandare la trasformazione.",
    successTextUpdated:"Envizi permette di alimentare i dati con template Excel e form semplici per gli utenti, guidati da workflow, e di integrare progressivamente le fonti dati esterne, come bollette delle utilities e fatture di acquisto, e interne, come ERP, HR e Asset Management; automatizza controlli e normalizzazioni e crea una traccia verificabile, riducendo tempi ed errori.",
    efcLabel:"OLTRE 40.000 FATTORI DI EMISSIONE ENVIZI", efcByMission:[
      "Associati automaticamente a bollette, acquisti, viaggi, rifiuti, consumi di gas e asset produttivi.",
      "Abbinati alle letture dei contatori e alle voci di bolletta elettrica, gas e teleriscaldamento.",
      "Applicati agli acquisti per categoria GHG Protocol, dalle materie prime al trasporto upstream.",
      "Utilizzati nei calcoli Scope 1–2 e in tutte le categorie Scope 3 rendicontate nei framework.",
      "Alla base dei modelli di abatement: ogni scenario calcola la CO₂e evitata per iniziativa.",
      "Integrati direttamente nei calcoli richiesti dai framework ESRS, GRI, SASB e CDP per la disclosure delle emissioni."
    ],
    boardQuoteLabel:"Voce del CdA",
    boardQuotes:[
      {positive:"Finalmente possiamo presentare una baseline ESG verificabile. È la base su cui costruire tutto il resto.",warning:"I form migliorano l'ordine, ma non la tracciabilità. Il CdA chiederà comunque le evidenze originali.",critical:"Rimandare significa rinunciare alla credibilità del dato per un altro anno. Non è una posizione sostenibile."},
      {positive:"I dati energetici strutturati dimostrano che stiamo investendo nella decarbonizzazione, non solo dichiarandola.",warning:"Un cruscotto manuale è un passo avanti, ma non genera gli alert e le azioni che il COO si aspetta.",critical:"Senza analisi sui contatori, gli sprechi continuano e non abbiamo nulla da mostrare agli investitori climatici."},
      {positive:"Avere dati Scope 3 credibili cambia il dialogo con i clienti e con chi ci finanzia. Siamo avanti rispetto ai concorrenti.",warning:"Un portale separato raccoglie risposte, ma non le integra nella contabilità GHG. Rimane un'isola.",critical:"Senza Scope 3 strutturato siamo fuori dai requisiti di qualifica di molti grandi clienti."},
      {positive:"Un reporting auditabile e conforme ai framework è ciò che separa un'azienda affidabile da una che si limita a dichiarare.",warning:"I template aiutano, ma i calcoli GHG restano disconnessi. L'assurance esterna sarà difficile da ottenere.",critical:"Costruire il reporting ogni anno da zero non è scala. Il CdA non può approvare quello che non può verificare."},
      {positive:"Avere scenari quantificati e programmi verificabili è l'unico modo per difendere il piano Net Zero davanti agli investitori.",warning:"Un portafoglio su foglio mostra le intenzioni, ma non dimostra l'esecuzione. Non regge a un'analisi esterna.",critical:"Senza un piano di decarbonizzazione credibile perdiamo accesso ai finanziamenti legati agli obiettivi climatici."},
      {positive:"Una disclosure strutturata e aggiornata ai framework è la prova che la sostenibilità è gestita come una funzione aziendale, non come un esercizio annuale.",warning:"I template aiutano a raccogliere le informazioni, ma senza un sistema governato non possiamo garantire la conformità ai framework aggiornati.",critical:"Inseguire i framework a mano ogni anno non è sostenibile: il rischio di non conformità cresce più velocemente delle nostre risorse."}
    ],
    crossEffectLabel:"Effetto della scelta precedente",
    crossEffects:[
      [],
      [{from:0,positive:"La Data Foundation di M1 alimenta direttamente le analisi energetiche: i dati dei contatori e delle bollette si integrano nella stessa fonte verificabile.",warning:"La soluzione a form di M1 rende più difficile normalizzare i dati energetici: le sedi useranno formati diversi.",critical:"Senza baseline ESG di M1, i risparmi energetici non sono confrontabili con nessun punto di riferimento verificabile."}],
      [{from:0,positive:"Con la Data Foundation attiva, i dati Scope 3 dei fornitori si integrano nella stessa piattaforma senza riconciliazioni aggiuntive.",warning:"Senza una fonte dati centrale di M1, le risposte dei fornitori rimangono isolate e non entrano nei calcoli GHG.",critical:null}],
      [{from:0,positive:"Il reporting può utilizzare direttamente dati ESG verificabili, normalizzati e tracciabili, senza ulteriori riconciliazioni tra sistemi e fogli di calcolo.",warning:"Con i form di M1, il team dovrà riconciliare manualmente i dati prima di ogni ciclo di reporting.",critical:"Senza baseline di M1, il reporting ESG si basa su stime: un rischio significativo per l'assurance esterna."},
       {from:1,positive:"I dati energetici strutturati di M2 entrano direttamente nei calcoli Scope 1–2 senza ulteriori elaborazioni.",warning:null,critical:"Senza dati energetici strutturati di M2, i consumi negli stabilimenti restano aggregati e non auditabili per sito."}],
      [{from:0,positive:"La baseline Envizi di M1 è il punto di partenza degli scenari what-if: i forecast partono da dati verificati.",warning:"Con i form di M1, la baseline di emissioni su cui costruire gli scenari è approssimativa.",critical:"Senza baseline di M1, qualsiasi modello Net Zero si basa su stime: il CdA non potrà validare il gap da colmare."},
       {from:1,positive:"I dati energetici di M2 alimentano direttamente i modelli di abatement: i risparmi calcolati sono confrontabili con gli obiettivi.",warning:null,critical:null}],
      [{from:0,positive:"Con la Data Foundation attiva, i framework in Envizi attingono direttamente ai dati già raccolti: nessuna riconciliazione prima della disclosure.",warning:"Con i form di M1, il team dovrà riconciliare manualmente i dati prima di ogni ciclo di disclosure.",critical:"Senza baseline di M1, le informazioni richieste dai framework si basano su stime: un rischio significativo per l'assurance esterna."},
       {from:3,positive:"Il GHG reporting di M4 produce i calcoli Scope 1–2 e Scope 3 che i framework richiedono: nessuna doppia elaborazione.",warning:null,critical:"Senza il GHG reporting strutturato di M4, la disclosure delle emissioni nei framework si basa su file separati non tracciabili."}]
    ],
    asiaOffice:"ASIA · 1 SEDE UFFICIO", europeOffices:"EUROPA · 3 UFFICI", hqShort:"HQ · MILANO",
    introKicker:"La tua sfida", introTitle:"Guadagna la fiducia.", introBody:"Il tuo obiettivo è conquistare la fiducia di CdA, Finanziatori, Clienti e Auditor. Ogni scelta influenza reputazione, accesso ai capitali e crescita del business. Raccogli punti fiducia e sblocca il livello \"Trusted ESG Leader\".", introScoreLabel:"Punteggio fiducia attuale", introLegend:"Decisioni Envizi +15 · Intermedie +7 · Rimandare +0", introStart:"Inizia il Quest", trustedLabel:"Trusted ESG Leader", trustLabel:"Fiducia stakeholder",
    questIntroKicker:"Come funziona il Quest", // TODO-EN
    questIntroText:"Questo percorso ti guida attraverso sei aree di evoluzione della gestione ESG. Per ognuna analizzerai la situazione attuale, confronterai tre possibili approcci e sceglierai la direzione più adatta al tuo contesto. Le tue scelte costruiranno progressivamente una roadmap ESG personalizzata e un punteggio di fiducia che riflette l'impatto delle decisioni prese. Non esistono risposte giuste o sbagliate: ogni scelta ha conseguenze diverse, e il percorso è pensato per rendere esplicite le priorità e avviare un confronto significativo.", // TODO-EN
    questIntroCta:"Avanti →", // TODO-EN
    approachKicker:"Due filoni paralleli", approachTitle:"ESG · un percorso basato su Persone e Dati.", approachBody:"La sfida è agire sul cambiamento con le persone. Formazione, responsabilizzazione, coinvolgimento e leadership sono fondamentali per rendere credibile e duraturo qualsiasi percorso ESG.",
    approachLeversLabel:"Le leve operative in campo", approachLevers:[
      {icon:"📐",label:"Governance e struttura",detail:"Policy, ruoli ESG, sistema di obiettivi e integrazione con il piano strategico."},
      {icon:"📊",label:"Dati e misurazione",detail:"Qualità, auditabilità e tracciabilità delle informazioni ambientali, sociali e di governance."},
      {icon:"⚙️",label:"Processi operativi",detail:"Efficienza energetica, supply chain, gestione dei rifiuti e decarbonizzazione delle operazioni."},
      {icon:"📋",label:"Reporting e disclosure",detail:"Framework di rendicontazione, conformità normativa e comunicazione agli stakeholder."},
      {icon:"🎯",label:"Pianificazione e target",detail:"Scenari di decarbonizzazione, obiettivi Net Zero e monitoraggio dell'esecuzione nel tempo."}
    ],
    approachDataTitle:"Il secondo filone è agire sulle sfide di dati.",
    approachOptionsLabel:"Le opzioni che valuterai attraverso questo Quest", approachOptions:[
      {key:"asis",icon:"⏸",label:"Attendere con l'AS-IS",detail:"Nessun investimento immediato, ma i problemi restano e la pressione cresce: da banche, clienti, normativa."},
      {key:"simple",icon:"🔧",label:"Adottare una soluzione percepita come semplice",detail:"Un tool puntuale o un workflow digitale: abbassa la complessità percepita, ma spesso non scala e non integra."},
      {key:"platform",icon:"🚀",label:"Adottare una piattaforma ESG enterprise",detail:"Un sistema integrato che unisce raccolta, calcolo, reporting e pianificazione su una fonte unica verificabile. Nel nostro Quest esploreremo le capacità di IBM Envizi, soluzione leader e sperimentata di ESG Reporting e Performance Management."}
    ],
    approachImpactNote:"Per ogni use case valuterai l'impatto sulla fiducia di CdA, banche, clienti e auditor. Le decisioni si accumulano: la roadmap finale è il risultato delle tue scelte.",
    approachCta:"Entra nell'azienda",
    approachQuestCallout:[
      "La Quest parte dalle priorità di business legate all'ESG e le collega alle esigenze delle persone che raccolgono, controllano e utilizzano i dati.",
      "Attraverso scenari e scelte alternative, individuerai le capacità necessarie per gestire dati ESG complessi, accompagnare il cambiamento e offrire agli utenti strumenti intuitivi, anche con il supporto dell'AI.",
      "L'obiettivo è aiutarti a mettere a fuoco bisogni, priorità e criteri di scelta prima di valutare dove e perché IBM Envizi possa rispondere alle necessità emerse.",
    ],
    approachQuestCta:"Avanti →",
    approachIntroTitle:"Dalle priorità alle decisioni: costruisci la tua roadmap ESG",
    approachIntroBody:[
      "Envizi Quest è un percorso guidato che ti aiuta a mettere a fuoco le esigenze ESG della tua azienda prima di valutare tecnologie e soluzioni.",
      "Non è un test con risposte giuste o sbagliate. È uno spazio di analisi nel quale rendere esplicite le priorità, confrontare approcci alternativi e costruire progressivamente una roadmap coerente con il tuo contesto.",
    ],
    approachIntroCta:"Avanti →",
    approachStepsTitle:"1. Parti dalle priorità di business",
    approachStepsBody:[
      "Il percorso inizia da sei macro-obiettivi di business collegati all'ESG. Potrai ordinarli in base alla loro importanza per la tua azienda e annotare le considerazioni che motivano le tue scelte.",
      "In questo modo, l'analisi non partirà dalla tecnologia, ma dai risultati che l'organizzazione intende perseguire.",
    ],
    approachStepsExample:"Esempio · La nostra motivazione principale per l'ESG è facilitare l'accesso a migliori condizioni di credito. Inoltre riceviamo richieste crescenti di dati ESG dai nostri clienti business.",
    approachStepsCta:"Avanti →",
    approachDataBody:[
      "A ogni obiettivo di business sono associate sette fra le principali problematiche riscontrate nella gestione dei dati ESG.",
      "L'elenco non pretende di rappresentare tutte le possibili situazioni né di sostituire un'analisi specifica della tua azienda. Offre però una base strutturata per riconoscere le criticità più vicine alla tua realtà e avviare un confronto significativo.",
      "Potrai selezionare tutte le issue che ritieni pertinenti e valutarle secondo due dimensioni: la loro rilevanza per il raggiungimento degli obiettivi; il livello di criticità che presentano oggi.",
      "La matrice rilevanza–criticità evidenzierà le issue prioritarie sulle quali concentrare l'attenzione.",
    ],
    approachDataExample:"Esempio · Con l'obiettivo di accesso al credito affrontiamo diverse issue in termini di dati ESG. In particolare sono molto rilevanti e molto problematiche queste esigenze: KPI ESG strutturati per il dialogo con banche e investitori · Tracciabilità completa dalla fonte al dato comunicato alla banca · Dati e piano ESG utilizzabili nei processi di rating e confronto con i peer.",
    approachDataCta:"Avanti →",
    approachDecisionsTitle:"3. Affronta le sfide decisionali",
    approachDecisionsBody:[
      "Sulla base delle priorità emerse, affronterai sei sfide dedicate alle principali aree di evoluzione della gestione ESG: dalla Data Foundation alla rendicontazione delle emissioni, dai framework ESG e CSRD alla supply chain, fino all'energia, alla decarbonizzazione e alla pianificazione degli scenari.",
      "Alcune capacità possono rappresentare fondamenta necessarie fin dall'inizio; altre possono trovare posto in una seconda fase della roadmap.",
      "Per ogni sfida confronterai tre possibili approcci: mantenere l'attuale situazione; adottare una soluzione semplice e di breve periodo; costruire una soluzione enterprise integrata.",
      "Dopo ogni decisione potrai osservare le possibili conseguenze e il contributo che le capacità di IBM Envizi potrebbero offrire.",
    ],
    approachDecisionsExample:"Esempio · Al fine di risolvere le issue della gestione dati ESG identificate come prioritarie stiamo valutando 3 approcci: mantenere lo stato attuale, adottare una soluzione semplice, evolvere a una soluzione integrata, confrontando pro e contro di ogni scelta.",
    approachDecisionsCta:"Avanti →",
    approachRoadmapTitle:"4. Trasforma le scelte in una roadmap",
    approachRoadmapBody:[
      "Per ciascuna sfida esaminerai i principali requisiti richiesti dalle aziende, indicando: la priorità del requisito nella tua roadmap; lo stato attuale della tua organizzazione; il divario da affrontare; il potenziale ruolo delle capacità di IBM Envizi.",
      "Tutte le sfide seguono la stessa struttura, così potrai confrontare le diverse aree utilizzando criteri coerenti.",
    ],
    approachRoadmapExample:"Esempio · Abbiamo scelto un approccio alla soluzione. Ora individuiamo le capacità necessarie per rispondere alle esigenze emerse. Questa è la fase più analitica del percorso: confronteremo requisiti, priorità e stato attuale per identificare la soluzione più adeguata al contesto. IBM Envizi sarà utilizzato come soluzione di riferimento per valutare in che modo le sue capacità possano contribuire a rispondere alle esigenze individuate.",
    approachRoadmapCta:"Avanti →",
    approachTrustTitle:"5. Costruisci la fiducia degli stakeholder",
    approachTrustBody:[
      "Attraverso una dinamica di gamification, le tue decisioni costruiranno un percorso a punti verso la fiducia di banche, clienti, CdA e auditor. Il punteggio ha un valore narrativo e, pur non rappresentando una valutazione scientifica, intende aiutare a confrontare le conseguenze delle diverse scelte proposte.",
    ],
    approachTrustExample:"Esempio · Al termine della valutazione Obiettivi, Rilevanza e Valore gestione dati riceverai il badge ESG Strategist, e potrai progredire verso altri punti fiducia e badge al completamento degli scenari successivi.",
    approachTrustCta:"Avanti →",
    approachReportTitle:"6. Porta con te il risultato",
    approachReportBody:[
      "Al termine della Quest riceverai un report complessivo con la sintesi delle priorità, delle criticità selezionate, delle decisioni assunte e dei requisiti individuati.",
      "Il tempo dedicato al percorso serve a trasformare percezioni spesso frammentate in una prima base di analisi condivisibile: non una roadmap definitiva, ma un punto di partenza più consapevole per decidere dove intervenire, con quale priorità e attraverso quali capacità.",
    ],
    approachReportExample:"Esempio · Potrai scaricare un documento con i risultati dell'analisi fatta.",
    approachReportCta:"Iniziamo la quest",
    asIsEditHint:"I valori sono pre-compilati con i parametri dello scenario. Puoi modificarli con i dati reali della tua organizzazione.",

    backScenarios:"Torna agli scenari", summaryCta:"Guarda il cruscotto finale", summaryKicker:"Il lavoro svolto", summaryTitle:"La tua roadmap ESG", summaryIntro:"Una panoramica per rileggere priorità, decisioni, impatti attesi e le esigenze di dati associate a ogni blocco prima del prossimo passo.", topPriorities:"I primi 3 obiettivi di business", parameters:"Esigenze di dati associate", backOne:"Indietro", backStart:"Torna all'inizio", nextStep:"Passiamo al prossimo passo", nextKicker:"Prossimo passo", nextTitle:"Porta i tuoi dati ESG al livello successivo.", nextSiteLabel:"Scopri IBM Envizi", nextSiteIntro:"La piattaforma SaaS per raccogliere, gestire e rendicontare i dati ESG con qualità e auditabilità.", nextSiteButton:"Visita il sito IBM Envizi →", nextDemoLabel:"Chiedi una demo", nextDemoIntro:"Inserisci l'email del tuo contatto IBM o Partner di fiducia. Se non hai un riferimento, scrivici direttamente: troveremo insieme la soluzione giusta.", nextDemoEmailPlaceholder:"Email contatto IBM o Partner", nextDemoButton:"Richiedi una demo →", nextDemoFallback:"Nessun contatto? Scrivi a Felice →", nextPocLabel:"Proof of Concept", nextPocIntro:"Porta i tuoi dati reali nella piattaforma: un PoC su misura per vedere IBM Envizi all'opera nel tuo contesto specifico, prima di qualsiasi decisione di investimento.", nextPocButton:"Chiedi un PoC →", nextBvaLabel:"Business Value Assessment", nextBvaIntro:"Quantifica il valore che IBM Envizi può generare per la tua organizzazione: risparmio di tempo, riduzione del rischio e impatto sul costo del capitale ESG.", nextBvaButton:"Richiedi un BVA →", nextContactLabel:"Il tuo riferimento IBM", nextContactName:"Felice Petrignano", nextContactRole:"Senior ESG Solution Engineer and Advisor", nextContactEmail:"", thankYouTitle:"Grazie / Thank you", prereqNoteLabel:"PREREQUISITO", prereqNoteText:"Richiede IBM Envizi Data Foundation (Missione 01)", prereqLabel:"PREREQUISITO NON SODDISFATTO", prereqText:"Per adottare IBM Envizi in questo scenario è necessario aver attivato la Data Foundation nella Missione 01 — Fabbrica dei dati ESG.", prereqLinkLabel:"Vai alla Missione 01 →", tobeKicker:"Proiezione TO BE", tobeTitle:"Come cambiano i tuoi parametri.", tobeSubtitle:"Stima dell'impatto atteso · 12 mesi", tobeAsIs:"AS-IS attuale", tobeToBe:"TO BE stimato", tobeDelta:"Variazione attesa", tobeDisclaimer:"Le stime TO BE sono proiezioni indicative basate su casistiche di adozione IBM Envizi. I benefici effettivi dipendono da contesto, perimetro e maturità dei processi. Non costituiscono garanzia di risultato.", tobeCta:"Vedi l'impatto sulla fiducia", trustKicker:"Indicatore di fiducia", trustTitle:"Quale l'impatto delle decisioni ESG data sulla fiducia?", trustIntro:"In questa fase il mercato valuta governance, solidità esecutiva e qualità del dato. Ogni scelta modifica il livello di fiducia con cui CdA, banche, clienti e auditor leggeranno il piano ESG.", trustScore:"Indice di fiducia", trustBase:"Baseline iniziale", trustMax:"Soglia massima 100", trustStakeholders:"Perimetro di lettura", trustBoard:"CdA", trustBanks:"Banche", trustClients:"Clienti", trustAuditors:"Auditor", trustGainPositive:"Scelta strategicamente solida · +15", trustGainWarning:"Scelta accettabile ma non scalabile · +7", trustGainCritical:"Scelta difensiva senza creazione di fiducia · +0", trustContinue:"Torna alle missioni", trustCurrentDecision:"Lettura del CdA", trustProgressLabel:"Fiducia cumulata sulla roadmap", trustPersonaLabel:"Responsabile della decisione",
    roadmapKicker:"La tua roadmap", roadmapTitle:"Dalle esigenze alle sfide decisionali.", roadmapIntro:"Ogni esigenza di dati è associata a una sfida. Affronta gli scenari nell'ordine che preferisci: ogni decisione costruisce la tua roadmap ESG.", missionReview:"Approfondisci", roadmapProgress:"Roadmap completata", moveLeft:"Sposta a sinistra", moveRight:"Sposta a destra", adoptedDecision:"Decisione adottata", expectedImpact:"Impatto atteso", decisionLabels:{positive:"Data Foundation IBM Envizi",warning:"Soluzione “semplice” basata su form non integrata con le fonti",critical:"Rimandare al prossimo esercizio"}, outcomeLabels:{positive:"−62% tempo di reporting · +34% qualità dati",warning:"−12% tempo di reporting · +8% qualità dati · beneficio limitato",critical:"Nessun miglioramento · fiducia del CdA bassa e invariata"},
    benchmarkLabel:"Riferimento scenario", yourValue:"I tuoi parametri attuali", sourceLabel:"Fonte metodologica IBM Envizi", benchmarkNote:"I numeri sono ipotesi di scenario, non benchmark di settore. La fonte descrive l'approccio Envizi a raccolta, qualità e auditabilità dei dati.",
    dataQuality:"Qualità dei dati", reportingTime:"Tempo di reporting", confidence:"Fiducia del management", successTitle:"Una Data Foundation pronta a crescere.", eyebrow:"IBM ENVIZI · IMPACT EXPERIENCE", title:"Ogni dato cambia la storia.", intro:"Entra nei panni di un ESG Manager. Affronta decisioni reali, misura gli impatti e guida l’azienda verso obiettivi credibili.", language:"Scegli la lingua", profile:"Scegli il tuo profilo", maleRole:"ESG Manager · Operations", femaleRole:"ESG Manager · Strategy", start:"Entra nell’azienda", select:"Seleziona un profilo per continuare", sameStory:"Una storia · Due protagonisti · Impatti reali", disclaimer:"Questa esperienza è stata ideata e realizzata da Felice Petrignano, Senior ESG Solution Engineer and Advisor, sulla base della propria esperienza e prospettiva professionale. I contenuti esprimono valutazioni personali e non rappresentano necessariamente posizioni ufficiali di IBM.",
    mission0QuestionKicker:"SFIDA · MISSIONE 01",mission0Question:"Quale scelta per la gestione dei dati ESG?",mission0QuestionBody:"Di fronte a dati provenienti da sedi, impianti e funzioni diverse, spesso raccolti tramite fogli Excel e processi manuali, quale approccio è più adatto alle esigenze attuali e future di COMPANY_NAME, considerando qualità, tracciabilità, impegno richiesto e capacità di crescere nel tempo?",mission0Cta:"Entra nella sfida →",
    missionIntroData:[
      {eyebrow:"REPORTING · MISSIONE 01 · DATA FOUNDATION",title:"Dai dati invisibili alle decisioni affidabili",kicker:"SFIDA · MISSIONE 01",question:"Quale scelta per la gestione dei dati ESG?",body:"Di fronte a dati provenienti da sedi, impianti e funzioni diverse, spesso raccolti tramite fogli Excel e processi manuali, quale approccio è più adatto alle esigenze attuali e future di COMPANY_NAME, considerando qualità, tracciabilità, impegno richiesto e capacità di crescere nel tempo?",cta:"Entra nella sfida →"},
      {eyebrow:"REPORTING · MISSIONE 02 · ENERGIA E DECARBONIZZAZIONE",title:"Dai consumi alle azioni",kicker:"SFIDA · MISSIONE 02",question:"Quale scelta per il controllo dell'energia?",body:"Di fronte a bollette e dati dei contatori digitali distribuiti tra le sedi, quale approccio permette a COMPANY_NAME di individuare anomalie, confrontare le performance e assegnare azioni correttive in modo tempestivo?",cta:"Entra nella sfida →"},
      {eyebrow:"REPORTING · MISSIONE 03 · COINVOLGIMENTO SUPPLY CHAIN",title:"Dai fornitori ai dati Scope 3",kicker:"SFIDA · MISSIONE 03",question:"Quale scelta per il coinvolgimento della supply chain?",body:"Di fronte a categorie Scope 3 incomplete e risposte fornitori frammentate, quale approccio consente a COMPANY_NAME di estendere la copertura, migliorare la qualità del dato e integrare le risposte nella contabilità GHG?",cta:"Entra nella sfida →"},
      {eyebrow:"REPORTING · MISSIONE 04 · REPORTING E PERFORMANCE",title:"Dai dati ESG alle decisioni",kicker:"SFIDA · MISSIONE 04",question:"Quale scelta per il reporting delle performance ESG?",body:"Di fronte alla necessità di consolidare le emissioni Scope 1, 2 e 3, analizzare le performance delle diverse sedi e produrre report e dashboard per stakeholder differenti, quale approccio è più adatto alle esigenze attuali e future di COMPANY_NAME, considerando affidabilità, capacità di analisi, personalizzazione e scalabilità nel tempo?",cta:"Entra nella sfida →"},
      {eyebrow:"REPORTING · MISSIONE 05 · ROTTA VERSO NET ZERO",title:"Dagli scenari al piano verificabile",kicker:"SFIDA · MISSIONE 05",question:"Quale scelta per il piano di decarbonizzazione?",body:"Di fronte a proposte di iniziative eterogenee, budget limitato e necessità di dimostrare al CdA la fattibilità del target Net Zero, quale approccio permette a COMPANY_NAME di confrontare scenari, selezionare le azioni prioritarie e monitorarne l'esecuzione?",cta:"Entra nella sfida →"},
      {eyebrow:"REPORTING · MISSIONE 06 · FRAMEWORK ESG E DISCLOSURE",title:"Dai requisiti alla disclosure governata",kicker:"SFIDA · MISSIONE 06",question:"Quale scelta per la gestione dei framework ESG?",body:"Di fronte a framework CSRD, ESRS, GRI, SASB e CDP in continua evoluzione, quale approccio consente a COMPANY_NAME di mantenere aggiornati i requisiti, mappare le informazioni materiali e produrre disclosure pronte all'uso senza ricostruire tutto ogni anno?",cta:"Entra nella sfida →"}
    ], missionMenuKicker:"Scegli la tua sfida", missionMenuTitle:"Da dove vuoi iniziare?", missionMenuIntro:"Cinque missioni, un’unica trasformazione. Scegli lo scenario più vicino alle priorità del tuo cliente.", missionSelect:"Avvia missione", missionDuration:"8–12 MIN", missionStartHere:"PARTI DA QUI", missionLocked:"Disponibile dopo la Data Foundation", companyIntro:"La tua azienda", companyTitle:"COMPANY_NAME", companyStory:"Un gruppo manifatturiero internazionale da 400 milioni di euro, nato in Italia e cresciuto attraverso otto stabilimenti e cinque sedi operative.", evolving:"COMPANY_NAME sta evolvendo verso un modello ESG per rispondere alle nuove esigenze di banche, regolatori, clienti e mercati, trasformando dati frammentati in decisioni affidabili.", revenue:"Fatturato annuo", plants:"Stabilimenti", offices:"Sedi uffici", people:"Dipendenti", explore:"Definisci le priorità ESG", europe:"EUROPA · 6 STABILIMENTI", usa:"USA · 1 STABILIMENTO", asia:"ASIA · 1 STABILIMENTO", hq:"HEADQUARTERS · MILANO", officeLabel:"5 SEDI UFFICI",
    priorityKicker:"Prima di iniziare", priorityTitle:"Priorità di business collegate all'ESG", priorityIntro:"Metti in ordine le priorità che stanno spingendo COMPANY_NAME verso l'ESG. Non esiste una risposta universale: la tua classifica orienterà la lettura degli impatti.", moveUp:"Sposta su", moveDown:"Sposta giù", confirm:"Conferma le priorità", priorityNames:{credit:"Accesso al credito",compliance:"Compliance e reporting",customers:"Clienti e gare",efficiency:"Efficienza, energia e costi",supply:"Resilienza della supply chain",reputation:"Reputazione e attrazione dei talenti"}, priorityDetails:{credit:"Migliorare il dialogo con banche e investitori e le condizioni di finanziamento.",compliance:"Disporre di dati verificabili per CSRD, ESRS, disclosure e audit.",customers:"Soddisfare i requisiti ESG nelle qualifiche fornitori e nei capitolati.",efficiency:"Ridurre consumi, sprechi, emissioni e volatilità dei costi energetici.",supply:"Gestire rischi di filiera, Scope 3 e continuità dei fornitori.",reputation:"Rafforzare la fiducia degli stakeholder e attrarre e trattenere competenze."},
    bridgeKicker:"Da qui in avanti", bridgeTitle:"Cinque decisioni. Una trasformazione.", bridgeIntro:"Hai definito le priorità e le esigenze di dati. Ora affronterai cinque scenari reali: per ognuno dovrai scegliere come rispondere alla sfida. Ogni decisione accumula fiducia e costruisce la tua roadmap ESG.", bridgeCta:"Entra nella quest", bridgePrereqLabel:"PREREQUISITO · BLOCCO FONDANTE", bridgeCapLabel:"CAPACITÀ ULTERIORI",
    bridgeMissions:[
      {num:"01",label:"Fabbrica dei dati ESG",need:"Una fonte unica verificabile per emissioni, energia e reporting."},
      {num:"02",label:"Energia e decarbonizzazione",need:"Dati intervallari e analisi delle bollette per ridurre costi e sprechi."},
      {num:"03",label:"Coinvolgimento supply chain",need:"Scope 3 strutturato e risposte fornitori integrabili nella contabilità GHG."},
      {num:"04",label:"Reporting e performance",need:"GHG reporting, workflow auditabili e dashboard riutilizzabili."},
      {num:"05",label:"Rotta verso Net Zero",need:"Scenari what-if e programmi di abbattimento verificabili nel tempo."},
      {num:"06",label:"Framework ESG e disclosure",need:"Gestione dei framework CSRD, ESRS, GRI, SASB, CDP e mappatura requisiti materiali."}
    ],
    bridgeNote:"Puoi affrontare le missioni nell'ordine che preferisci. Le scelte si accumulano: ogni decisione influenza le successive.",
    priorityDataKicker:"Le tue esigenze di dati", priorityDataTitle:"Esigenze di dati e sfide associate", priorityDataIntro:"Hai definito le priorità e le esigenze di business. Ora per ogni priorità di business seleziona quali fattori valutare (click cerchi in colonna includi) e per ognuno la rilevanza e la criticità attuale.", priorityDataCta:"Conferma priorità →",
    priorityDataNeeds:{
      credit:[
        {id:"credit-1",label:"Emissioni Scope 1, 2 e 3 verificabili e auditabili"},
        {id:"credit-2",label:"KPI ESG strutturati per il dialogo con banche e investitori"},
        {id:"credit-3",label:"Tracciabilità completa dalla fonte al dato comunicato alla banca"},
        {id:"credit-4",label:"Dati e piano ESG utilizzabili nei processi di rating e confronto con i peer"},
        {id:"credit-5",label:"Disclosure allineata a ESRS e standard ISSB / IFRS S1 e S2"},
        {id:"credit-6",label:"Scenari previsionali che mostrino traiettorie, gap e impatto degli investimenti ESG"},
        {id:"credit-7",label:"Business case delle iniziative con costi, risparmi ed emissioni evitate"}
      ],
      compliance:[
        {id:"compliance-1",label:"Calcoli GHG Scope 1, 2 e 3 tracciabili e riconciliabili"},
        {id:"compliance-2",label:"Workflow con assignee, scadenze, risposte ed evidenze per l'assurance"},
        {id:"compliance-3",label:"Framework CSRD / ESRS, GRI, IFRS S1/S2 e altri standard gestiti nel sistema"},
        {id:"compliance-4",label:"Registro delle modifiche e audit trail per ogni dato ESG"},
        {id:"compliance-5",label:"Identificazione e gestione delle informazioni materiali e dei gap rispetto agli standard"},
        {id:"compliance-6",label:"Controlli di completezza su dati mancanti, sovrapposti o in ritardo"},
        {id:"compliance-7",label:"Accesso rapido a dati, fattori, documenti ed evidenze richiesti dagli auditor"}
      ],
      customers:[
        {id:"customers-1",label:"Dati Scope 3 per categoria GHG Protocol su acquisti, trasporti e prodotti"},
        {id:"customers-2",label:"Risposte dei fornitori strutturate e integrabili nella contabilità GHG"},
        {id:"customers-3",label:"Product Carbon Footprint forniti dai supplier per prodotti e acquisti rilevanti"},
        {id:"customers-4",label:"Informazioni ESG riutilizzabili per capitolati e qualifiche di gara"},
        {id:"customers-5",label:"Prestazioni ambientali confrontabili con benchmark di mercato disponibili"},
        {id:"customers-6",label:"Dashboard e KPI dedicati alle richieste ESG dei clienti strategici"},
        {id:"customers-7",label:"Evidenze su energia rinnovabile ed emissioni Scope 2 location-based e market-based"}
      ],
      efficiency:[
        {id:"efficiency-1",label:"Dati intervallari ad alta frequenza da contatori e sistemi di sub-metering"},
        {id:"efficiency-2",label:"Analisi delle bollette per sito, utility, costo e variazione anomala"},
        {id:"efficiency-3",label:"KPI energetici normalizzati per meteo e variabili operative"},
        {id:"efficiency-4",label:"Alert automatici su picchi, sprechi e consumi fuori andamento atteso"},
        {id:"efficiency-5",label:"Benchmark dei consumi tra stabilimenti e monitoraggio rispetto ai target"},
        {id:"efficiency-6",label:"Identificazione degli impianti con il maggiore potenziale di risparmio"},
        {id:"efficiency-7",label:"Valutazione economica e ambientale degli interventi di efficienza"}
      ],
      supply:[
        {id:"supply-1",label:"Dati Scope 3 cat. 1 (acquisti) e cat. 4 (trasporti upstream)"},
        {id:"supply-2",label:"Risposte fornitori su emissioni, target, conformità e continuità"},
        {id:"supply-3",label:"Integrazione con i flussi ERP per elaborare ordini e transazioni di acquisto"},
        {id:"supply-4",label:"Valutazione del rischio ESG per fornitore e paese di origine"},
        {id:"supply-5",label:"Tracciabilità delle azioni correttive e dei piani di miglioramento"},
        {id:"supply-6",label:"Monitoraggio dei tassi di risposta e della qualità dei dati ricevuti dai fornitori"},
        {id:"supply-7",label:"Passaggio progressivo da stime spend-based a dati supplier-specific e PCF"}
      ],
      reputation:[
        {id:"reputation-1",label:"Report ESG chiari, coerenti e allineati ai framework riconosciuti"},
        {id:"reputation-2",label:"Dati verificabili su diversity, sicurezza, formazione e benessere"},
        {id:"reputation-3",label:"Indicatori ESG confrontabili nel tempo, tra sedi e tra funzioni"},
        {id:"reputation-4",label:"Contenuti ESG strutturati e riutilizzabili nella comunicazione esterna"},
        {id:"reputation-5",label:"Evidenze di avanzamento verso obiettivi climatici e Net Zero"},
        {id:"reputation-6",label:"Raccolta strutturata di dati e percezioni ESG da dipendenti e funzioni aziendali"},
        {id:"reputation-7",label:"Dashboard sintetiche per comunicare cultura, persone e risultati ESG al management"}
      ]
    },
    mission:"Missione", missionTitle:"La fabbrica dei dati invisibili", companyFacts:"Manifattura · €400M · 8 stabilimenti", briefing:"Il CdA vuole una baseline ESG affidabile entro 90 giorni. I dati energetici e ambientali sono dispersi tra stabilimenti, fornitori e fogli di calcolo.", objective:"Il tuo obiettivo", objectiveText:"Creare un’unica fonte verificabile per emissioni, energia e reporting, senza rallentare le attività produttive.", analyse:"Esamina l’AS-IS", asIsKicker:"Fotografia attuale", asIsTitle:"Quattro criticità.\nUn solo problema di fondo.", asIsIntro:"Prima di scegliere una soluzione, osserva come COMPANY_NAME gestisce oggi i dati ESG.", asIsItems:[{title:"Fonti frammentate",detail:"Dati energetici, ambientali e di produzione distribuiti tra 8 stabilimenti, ERP, fatture ed e-mail.",metric:"12 FONTI"},{title:"Raccolta manuale",detail:"Ogni mese gli utenti copiano i valori in fogli diversi, con solleciti e controlli gestiti via e-mail.",metric:"180 ORE/MESE"},{title:"Regole incoerenti",detail:"Unità, fattori di emissione e perimetri cambiano tra sedi: confrontare i risultati richiede rilavorazioni.",metric:"17% ERRORI"},{title:"Audit lento",detail:"Ricostruire origine, modifica e approvazione di un dato richiede documenti separati e verifiche manuali.",metric:"6 SETTIMANE"}], proceedDecision:"Decisioni →", decisionTitle:"Quale strada scegli?", decisionIntro:"La scelta deve risolvere il problema di oggi senza crearne uno più grande tra dodici mesi.", optionA:"Adottare una Data Foundation integrata", optionATag:"Soluzione indicata: IBM Envizi Premium", optionADetail:"Integra le fonti dati, automatizza raccolta e controlli, riduce tempi ed errori e conserva una traccia verificabile.", optionB:"Soluzione “semplice”", optionBDetail:"Basata su form per gli utenti che sostituiscono visivamente i fogli, ma mantengono attività manuali, solleciti ed errori: tra un anno, sarai ancora in grado di gestire il volume?", optionC:"Rimandare al prossimo esercizio", optionCDetail:"Evita costi immediati, ma lascia il CdA senza una baseline affidabile.", impact:"Impatto della decisione · 12 mesi dopo", negativeTitle:"Il nuovo form è diventato il nuovo foglio di calcolo.", negativeText:"L’interfaccia è cambiata, ma il processo è ancora manuale. Più utenti e più dati aumentano errori, ritardi e costi di controllo; le fonti restano scollegate.", postponeTitle:"Un anno perso, lo stesso problema più grande.", postponeText:"Le fonti e i volumi sono aumentati, mentre la baseline è ancora incompleta. Il CdA deve decidere senza dati affidabili e la pressione del reporting cresce.", successText:"Envizi integra progressivamente le fonti degli otto stabilimenti, automatizza controlli e normalizzazioni e crea una traccia verificabile, riducendo tempi ed errori.", retry:"Rivedi la decisione", restart:"Cambia profilo", continue:"Continua la quest", enviziValue:"VALORE ENVIZI SBLOCCATO · DATA FOUNDATION"
  },
  en: {
    formTitleUpdated:"A quick but limited benefit.", formTextUpdated:"Forms standardize data entry and reduce some errors compared with the current state. Manual work, reminders and disconnected sources remain; as volumes grow, the benefit plateaus and does not scale.", impactUpdated:"Change versus the current AS-IS · 12 months later", asIsTitleUpdated:"No step forward.", asIsTextUpdated:"Keeping the current AS-IS leaves data quality and reporting time unchanged, while Board confidence remains low. The cost of the choice is foregoing benefits and postponing the transformation.",
    successTextUpdated:"Envizi supports data entry via Excel templates and simple user-facing forms guided by workflows, and progressively integrates external data sources, such as utility bills and purchase invoices, and internal systems, such as ERP, HR and Asset Management; it automates controls and normalization and creates a verifiable trail, reducing time and errors.",
    efcLabel:"OVER 40,000 ENVIZI EMISSION FACTORS", efcByMission:[
      "Automatically mapped to utility bills, purchases, travel, waste, gas consumption and production assets.",
      "Matched to meter readings and line items in electricity, gas and district-heating bills.",
      "Applied to purchases by GHG Protocol category, from raw materials to upstream transport.",
      "Used in Scope 1–2 calculations and across all Scope 3 categories reported in disclosure frameworks.",
      "Underpinning abatement models: each scenario calculates avoided CO₂e per initiative.",
      "Integrated directly into the emission calculations required by ESRS, GRI, SASB and CDP frameworks for disclosure."
    ],
    boardQuoteLabel:"Board voice",
    boardQuotes:[
      {positive:"We can finally present a verifiable ESG baseline. This is the foundation on which everything else is built.",warning:"Forms improve order, but not traceability. The Board will still ask for the original evidence.",critical:"Postponing means giving up data credibility for another year. That is not a sustainable position."},
      {positive:"Structured energy data demonstrates that we are investing in decarbonisation, not just declaring it.",warning:"A manual dashboard is a step forward, but it does not generate the alerts and actions the COO expects.",critical:"Without meter analytics, waste continues and we have nothing to show climate investors."},
      {positive:"Having credible Scope 3 data changes the conversation with customers and financiers. We are ahead of our peers.",warning:"A separate portal collects responses but does not integrate them into GHG accounting. It remains an island.",critical:"Without structured Scope 3 we are outside the qualification requirements of many major customers."},
      {positive:"Auditable reporting aligned with disclosure frameworks is what separates a credible company from one that merely declares.",warning:"Templates help, but GHG calculations remain disconnected. Obtaining external assurance will be difficult.",critical:"Rebuilding reporting from scratch every year does not scale. The Board cannot approve what it cannot verify."},
      {positive:"Quantified scenarios and verifiable programmes are the only way to defend the Net Zero plan in front of investors.",warning:"A spreadsheet portfolio shows intent but does not demonstrate execution. It will not withstand external scrutiny.",critical:"Without a credible decarbonisation plan we lose access to financing tied to climate targets."},
      {positive:"Structured, framework-aligned disclosure is proof that sustainability is managed as a business function, not an annual exercise.",warning:"Templates help collect information, but without a governed system we cannot guarantee compliance with updated frameworks.",critical:"Chasing frameworks manually every year is not sustainable: the risk of non-compliance grows faster than our resources."}
    ],
    crossEffectLabel:"Effect of the previous choice",
    crossEffects:[
      [],
      [{from:0,positive:"The M1 Data Foundation feeds directly into energy analytics: meter and bill data share the same verifiable source.",warning:"The M1 forms solution makes it harder to normalise energy data: sites will use different formats.",critical:"Without the M1 ESG baseline, energy savings cannot be compared against any verifiable reference point."}],
      [{from:0,positive:"With the Data Foundation active, supplier Scope 3 data integrates into the same platform without additional reconciliation.",warning:"Without a central data source from M1, supplier responses remain isolated and do not feed into GHG calculations.",critical:null}],
      [{from:0,positive:"Reporting can draw directly from the verifiable data already collected: no reconciliation between systems.",warning:"With M1 forms, the team will need to reconcile data manually before every reporting cycle.",critical:"Without the M1 baseline, ESG reporting relies on estimates — a significant risk for external assurance."},
       {from:1,positive:"The structured energy data from M2 feeds directly into Scope 1–2 calculations without further processing.",warning:null,critical:"Without structured energy data from M2, site-level consumption remains aggregated and cannot be audited by location."}],
      [{from:0,positive:"The M1 Envizi baseline is the starting point for what-if scenarios: forecasts are built on verified data.",warning:"With M1 forms, the emissions baseline on which scenarios are built is approximate.",critical:"Without the M1 baseline, any Net Zero model relies on estimates: the Board cannot validate the gap to close."},
       {from:1,positive:"The M2 energy data feeds directly into abatement models: calculated savings are comparable against targets.",warning:null,critical:null}],
      [{from:0,positive:"With the Data Foundation active, frameworks in Envizi draw directly from already-collected data: no reconciliation before disclosure.",warning:"With M1 forms, the team will need to manually reconcile data before each disclosure cycle.",critical:"Without the M1 baseline, information required by frameworks relies on estimates — a significant risk for external assurance."},
       {from:3,positive:"The GHG reporting from M4 produces the Scope 1–2 and Scope 3 calculations that frameworks require: no double processing.",warning:null,critical:"Without the structured GHG reporting from M4, emissions disclosure in frameworks relies on separate, untraceable files."}]
    ],
    asiaOffice:"ASIA · 1 OFFICE", europeOffices:"EUROPE · 3 OFFICES", hqShort:"HQ · MILAN",
    introKicker:"Your challenge", introTitle:"Earn their trust.", introBody:"Your goal is to earn the trust of Board, Financiers, Customers and Auditors. Every choice shapes reputation, access to capital and business growth. Collect trust points and unlock the \"Trusted ESG Leader\" status.", introScoreLabel:"Current trust score", introLegend:"Envizi decisions +15 · Intermediate +7 · Postponing +0", introStart:"Start the Quest", trustedLabel:"Trusted ESG Leader", trustLabel:"Stakeholder trust",
    approachKicker:"Two parallel tracks", approachTitle:"ESG · a journey built on People and Data.", approachBody:"The first track is acting on change challenges with people. Training, accountability, engagement and leadership are essential to make any ESG journey credible and durable.",
    approachLeversLabel:"The operational levers at play", approachLevers:[
      {icon:"📐",label:"Governance and structure",detail:"Policies, ESG roles, objective-setting and integration with the strategic plan."},
      {icon:"📊",label:"Data and measurement",detail:"Quality, auditability and traceability of environmental, social and governance information."},
      {icon:"⚙️",label:"Operational processes",detail:"Energy efficiency, supply chain, waste management and operational decarbonisation."},
      {icon:"📋",label:"Reporting and disclosure",detail:"Reporting frameworks, regulatory compliance and stakeholder communication."},
      {icon:"🎯",label:"Planning and targets",detail:"Decarbonisation scenarios, Net Zero objectives and execution monitoring over time."}
    ],
    approachDataTitle:"The second track is acting on data challenges.",
    approachOptionsLabel:"The options you will evaluate through this Quest", approachOptions:[
      {key:"asis",icon:"⏸",label:"Wait with the AS-IS",detail:"No immediate investment, but problems persist and pressure grows: from banks, clients, regulation."},
      {key:"simple",icon:"🔧",label:"A solution perceived as simple",detail:"A point tool or digital workflow: lowers perceived complexity, but often does not scale or integrate."},
      {key:"platform",icon:"🚀",label:"An enterprise ESG platform",detail:"An integrated system that combines collection, calculation, reporting and planning on one verifiable source."}
    ],
    approachImpactNote:"For each use case you will assess the impact on the trust of the Board, banks, clients and auditors. Decisions accumulate: the final roadmap is the result of your choices.",
    approachCta:"Enter the company",
    approachQuestCallout:[
      "The Quest starts from ESG-related business priorities and connects them to the needs of the people who collect, control and use data.",
      "Through scenarios and alternative choices, you will identify the capabilities needed to manage complex ESG data, support change and offer users intuitive tools, including with AI support.",
      "The goal is to help you clarify needs, priorities and selection criteria before evaluating where and why IBM Envizi can address the needs that emerge.",
    ],
    approachQuestCta:"Next →",
    approachIntroTitle:"From priorities to decisions: build your ESG roadmap",
    approachIntroBody:[
      "Envizi Quest is a guided journey that helps you clarify your organisation's ESG needs before evaluating technologies and solutions.",
      "It is not a test with right or wrong answers. It is an analysis space where you can make priorities explicit, compare alternative approaches, and progressively build a roadmap that fits your context.",
    ],
    approachIntroCta:"Next →",
    approachStepsTitle:"1. Start from business priorities",
    approachStepsBody:[
      "The journey begins with six ESG-related business macro-objectives. You can rank them by importance for your organisation and add notes explaining the reasoning behind your choices.",
      "This way, the analysis will start from the outcomes the organisation wants to achieve — not from technology.",
    ],
    approachStepsExample:"Example · Our main motivation for ESG is to facilitate access to better credit conditions. We also receive growing requests for ESG data from our business clients.",
    approachStepsCta:"Next →",
    approachDataBody:[
      "Each business objective is linked to seven of the most common issues found in ESG data management.",
      "The list does not claim to cover every possible situation or replace a specific analysis of your organisation. It does, however, offer a structured basis for recognising the issues closest to your reality and starting a meaningful conversation.",
      "You will be able to select all the issues you consider relevant and assess them along two dimensions: their relevance to achieving the objectives; the level of criticality they present today.",
      "The relevance–criticality matrix will highlight the priority issues to focus on.",
    ],
    approachDataExample:"Example · With the credit access objective in mind, we face several ESG data issues. Particularly relevant and critical: structured ESG KPIs for dialogue with banks and investors · Full traceability from source to data communicated to the bank · ESG data and plan usable in rating processes and peer comparison.",
    approachDataCta:"Next →",
    approachDecisionsTitle:"3. Face the decision challenges",
    approachDecisionsBody:[
      "Based on the priorities identified, you will face six challenges covering the main ESG management evolution areas: from the Data Foundation to emissions reporting, from ESG and CSRD frameworks to supply chain, through to energy, decarbonisation and scenario planning.",
      "Some capabilities may represent necessary foundations from the start; others may fit into a second phase of the roadmap.",
      "For each challenge you will compare three possible approaches: maintaining the current situation; adopting a simple, short-term solution; building an integrated enterprise solution.",
      "After each decision you will be able to observe the possible consequences and the contribution that IBM Envizi capabilities could offer.",
    ],
    approachDecisionsExample:"Example · To address the ESG data management issues identified as priorities, we are evaluating 3 approaches: maintaining the current state, adopting a simple solution, evolving to an integrated solution — comparing the pros and cons of each choice.",
    approachDecisionsCta:"Next →",
    approachRoadmapTitle:"4. Turn your choices into a roadmap",
    approachRoadmapBody:[
      "For each challenge you will review the main requirements companies typically face, indicating: the priority of the requirement in your roadmap; the current state of your organisation; the gap to address; the potential role of IBM Envizi capabilities.",
      "All challenges follow the same structure, so you can compare different areas using consistent criteria.",
    ],
    approachRoadmapExample:"Example · We have chosen an approach to the solution. Now we identify the capabilities needed to address the needs that emerged. This is the most analytical phase of the journey: we will compare requirements, priorities and current state to identify the most suitable solution for the context. IBM Envizi will be used as the reference solution to assess how its capabilities can contribute to addressing the identified needs.", // TODO-EN
    approachRoadmapCta:"Next →",
    approachTrustTitle:"5. Build stakeholder trust",
    approachTrustBody:[
      "Through a gamification dynamic, your decisions will build a point-based journey towards the trust of banks, clients, boards and auditors. The score has a narrative value and, while not representing a scientific assessment, is intended to help compare the consequences of the different choices proposed.",
    ],
    approachTrustExample:"Example · Upon completing the Objectives, Relevance and Data Management Value assessment you will receive the ESG Strategist badge, and you can progress towards further trust points and badges upon completing subsequent scenarios.",
    approachTrustCta:"Next →",
    approachReportTitle:"6. Take the result with you",
    approachReportBody:[
      "At the end of the Quest you will receive a comprehensive report summarising your priorities, the criticalities selected, the decisions taken and the requirements identified.",
      "The time invested in this journey serves to turn often fragmented perceptions into a first shareable basis for analysis: not a definitive roadmap, but a more informed starting point for deciding where to act, with what priority and through which capabilities.",
    ],
    approachReportExample:"Example · You will be able to download a document with the results of the analysis carried out.",
    approachReportCta:"Let's start the quest",
    asIsEditHint:"Values are pre-filled with the scenario parameters. You can replace them with your organisation's actual data.",

    summaryCta:"View the final dashboard", summaryKicker:"Work completed", summaryTitle:"Your ESG roadmap", summaryIntro:"An overview to reflect on priorities, decisions, expected impacts and the data needs associated with each block before the next step.", topPriorities:"Top 3 business objectives", parameters:"Associated data needs", backOne:"Back", backStart:"Back to the beginning", nextStep:"Let's move to the next step", nextKicker:"Next step", nextTitle:"Take your ESG data to the next level.", nextSiteLabel:"Discover IBM Envizi", nextSiteIntro:"The SaaS platform to collect, manage and report ESG data with quality and auditability.", nextSiteButton:"Visit the IBM Envizi website →", nextDemoLabel:"Request a demo", nextDemoIntro:"Enter your IBM or trusted Partner contact email. If you don't have one, write to us directly — we'll find the right solution together.", nextDemoEmailPlaceholder:"IBM or Partner contact email", nextDemoButton:"Request a demo →", nextDemoFallback:"No contact? Write to Felice →", nextPocLabel:"Proof of Concept", nextPocIntro:"Bring your real data into the platform: a tailored PoC to see IBM Envizi in action within your specific context, before any investment decision.", nextPocButton:"Request a PoC →", nextBvaLabel:"Business Value Assessment", nextBvaIntro:"Quantify the value IBM Envizi can generate for your organisation: time savings, risk reduction and impact on ESG cost of capital.", nextBvaButton:"Request a BVA →", nextContactLabel:"Your IBM contact", nextContactName:"Felice Petrignano", nextContactRole:"Senior ESG Solution Engineer and Advisor", nextContactEmail:"", thankYouTitle:"Grazie / Thank you", prereqNoteLabel:"PREREQUISITE", prereqNoteText:"Requires IBM Envizi Data Foundation (Mission 01)", prereqLabel:"PREREQUISITE NOT MET", prereqText:"To adopt IBM Envizi in this scenario you must first activate the Data Foundation in Mission 01 — ESG Data Factory.", prereqLinkLabel:"Go to Mission 01 →", tobeKicker:"TO BE projection", tobeTitle:"How your parameters will change.", tobeSubtitle:"Estimated impact · 12 months", tobeAsIs:"Current AS-IS", tobeToBe:"Estimated TO BE", tobeDelta:"Expected change", tobeDisclaimer:"TO BE estimates are indicative projections based on IBM Envizi adoption cases. Actual benefits depend on context, scope and process maturity. They do not constitute a guarantee of results.", tobeCta:"See the trust impact", trustKicker:"Trust indicator", trustTitle:"Why choose IBM Envizi?", trustIntro:"At this stage the market is assessing governance, execution credibility and data quality. Each choice changes the level of confidence with which the Board, banks, clients and auditors will read the ESG plan.", trustScore:"Trust index", trustBase:"Opening baseline", trustMax:"Ceiling 100", trustStakeholders:"Stakeholder lens", trustBoard:"Board", trustBanks:"Banks", trustClients:"Clients", trustAuditors:"Auditors", trustGainPositive:"Strategically strong decision · +15", trustGainWarning:"Acceptable but not scalable decision · +7", trustGainCritical:"Defensive decision with no trust creation · +0", trustContinue:"Back to missions", trustCurrentDecision:"Board reading", trustProgressLabel:"Trust accumulated across the roadmap", trustPersonaLabel:"Decision owner",
    roadmapKicker:"Your roadmap", roadmapTitle:"From identified needs to decision challenges.", roadmapIntro:"Each data need is linked to a challenge. Tackle the scenarios in any order: every decision builds your ESG roadmap.", missionReview:"Explore further", roadmapProgress:"Roadmap completed", moveLeft:"Move left", moveRight:"Move right", adoptedDecision:"Decision adopted", expectedImpact:"Expected impact", decisionLabels:{positive:"IBM Envizi Data Foundation",warning:"A “simple” forms-based solution not integrated with sources",critical:"Postpone until next year"}, outcomeLabels:{positive:"−62% reporting time · +34% data quality",warning:"−12% reporting time · +8% data quality · limited benefit",critical:"No improvement · Board confidence remains low"},
    benchmarkLabel:"Scenario reference", yourValue:"Your current parameters", sourceLabel:"IBM Envizi methodology source", benchmarkNote:"These figures are scenario assumptions, not industry benchmarks. The source describes the Envizi approach to data capture, quality and auditability.",
    dataQuality:"Data quality", reportingTime:"Reporting time", confidence:"Stakeholder confidence", successTitle:"A Data Foundation ready to scale.", eyebrow:"IBM ENVIZI · IMPACT EXPERIENCE", title:"Every data point changes the story.", intro:"Step into the role of an ESG Manager. Face real decisions, measure their impact and lead the company towards credible goals.", language:"Choose your language", profile:"Choose your profile", maleRole:"ESG Manager · Operations", femaleRole:"ESG Manager · Strategy", start:"Enter the company", select:"Select a profile to continue", sameStory:"One story · Two protagonists · Real impact", disclaimer:"This experience was conceived and developed by Felice Petrignano, Senior ESG Solution Engineer and Advisor, based on his professional experience and perspective. Its content reflects personal views and does not necessarily represent official IBM positions.",
    mission0QuestionKicker:"CHALLENGE · MISSION 01",mission0Question:"How should ESG data be managed?",mission0QuestionBody:"Faced with data from multiple sites, plants and functions — often collected via Excel and manual processes — which approach best fits COMPANY_NAME's current and future needs, balancing data quality, traceability, effort required and the ability to scale over time?",mission0Cta:"Enter the challenge →",
    missionIntroData:[
      {eyebrow:"REPORTING · MISSION 01 · DATA FOUNDATION",title:"From invisible data to trusted decisions",kicker:"CHALLENGE · MISSION 01",question:"How should ESG data be managed?",body:"Faced with data from multiple sites, plants and functions — often collected via Excel and manual processes — which approach best fits COMPANY_NAME's current and future needs, balancing data quality, traceability, effort required and the ability to scale over time?",cta:"Enter the challenge →"},
      {eyebrow:"REPORTING · MISSION 02 · ENERGY AND DECARBONISATION",title:"From consumption to action",kicker:"CHALLENGE · MISSION 02",question:"How should energy performance be managed?",body:"Faced with utility bills and digital-meter data spread across sites, which approach allows COMPANY_NAME to detect anomalies, benchmark performance and assign corrective actions in a timely way?",cta:"Enter the challenge →"},
      {eyebrow:"REPORTING · MISSION 03 · SUPPLY CHAIN ENGAGEMENT",title:"From suppliers to Scope 3 data",kicker:"CHALLENGE · MISSION 03",question:"How should the supply chain be engaged for Scope 3?",body:"Faced with incomplete Scope 3 categories and fragmented supplier responses, which approach allows COMPANY_NAME to extend coverage, improve data quality and integrate responses into GHG accounting?",cta:"Enter the challenge →"},
      {eyebrow:"REPORTING · MISSION 04 · REPORTING AND PERFORMANCE",title:"From ESG data to decisions",kicker:"CHALLENGE · MISSION 04",question:"How should ESG performance reporting be managed?",body:"Faced with the need to consolidate Scope 1, 2 and 3 emissions, analyse performance across sites and produce reports and dashboards for different stakeholders, which approach best fits COMPANY_NAME's current and future needs, considering reliability, analytical depth, customisation and scalability over time?",cta:"Enter the challenge →"},
      {eyebrow:"REPORTING · MISSION 05 · NET ZERO PATHWAY",title:"From scenarios to a verifiable plan",kicker:"CHALLENGE · MISSION 05",question:"How should the decarbonisation plan be built?",body:"Faced with heterogeneous initiative proposals, a constrained budget and the need to demonstrate Net Zero feasibility to the Board, which approach allows COMPANY_NAME to compare scenarios, select priority actions and track their execution?",cta:"Enter the challenge →"},
      {eyebrow:"REPORTING · MISSION 06 · ESG FRAMEWORKS AND DISCLOSURE",title:"From requirements to governed disclosure",kicker:"CHALLENGE · MISSION 06",question:"How should ESG frameworks be managed?",body:"Faced with continuously evolving CSRD, ESRS, GRI, SASB and CDP requirements, which approach allows COMPANY_NAME to keep frameworks current, map material information and produce disclosure-ready outputs without rebuilding everything each year?",cta:"Enter the challenge →"}
    ], missionMenuKicker:"Choose your challenge", missionMenuTitle:"Where do you want to begin?", missionMenuIntro:"Five missions, one transformation. Choose the scenario closest to your client's priorities.", missionSelect:"Start mission", missionDuration:"8–12 MIN", missionStartHere:"START HERE", missionLocked:"Available after the Data Foundation", companyIntro:"Your company", companyTitle:"COMPANY_NAME", companyStory:"A €400 million international manufacturing group, founded in Italy and grown across eight plants and five operating offices.", evolving:"COMPANY_NAME is evolving towards an ESG model to meet the changing needs of banks, regulators, customers and markets—turning fragmented data into trusted decisions.", revenue:"Annual revenue", plants:"Plants", offices:"Office locations", people:"Employees", explore:"Set ESG priorities", europe:"EUROPE · 6 PLANTS", usa:"USA · 1 PLANT", asia:"ASIA · 1 PLANT", hq:"HEADQUARTERS · MILAN", officeLabel:"5 OFFICE LOCATIONS",
    priorityKicker:"Before you begin", priorityTitle:"Business priorities linked to ESG", priorityIntro:"Rank the priorities driving COMPANY_NAME towards ESG. There is no universal answer: your order will shape how the impacts are interpreted.", moveUp:"Move up", moveDown:"Move down", confirm:"Confirm priorities", priorityNames:{credit:"Access to finance",compliance:"Compliance and reporting",customers:"Customers and tenders",efficiency:"Efficiency, energy and cost",supply:"Supply-chain resilience",reputation:"Reputation and talent attraction"}, priorityDetails:{credit:"Improving dialogue with banks and investors and financing conditions.",compliance:"Having verifiable data for CSRD, ESRS, disclosure and audit.",customers:"Meeting ESG requirements in supplier qualification and procurement.",efficiency:"Reducing consumption, waste, emissions and energy cost volatility.",supply:"Managing supply-chain risk, Scope 3 and supplier continuity.",reputation:"Strengthening stakeholder trust and attracting and retaining talent."},
    bridgeKicker:"From here on", bridgeTitle:"Five decisions. One transformation.", bridgeIntro:"You have set your priorities and identified your data needs. Now you will face five real-world scenarios: for each one you will choose how to respond to the challenge. Every decision builds trust and shapes your ESG roadmap.", bridgeCta:"Enter the quest", bridgePrereqLabel:"PREREQUISITE · FOUNDATIONAL BLOCK", bridgeCapLabel:"ADDITIONAL CAPABILITIES",
    bridgeMissions:[
      {num:"01",label:"The ESG data factory",need:"One verifiable source for emissions, energy and reporting."},
      {num:"02",label:"Energy and decarbonisation",need:"Interval data and bill analytics to cut costs and waste."},
      {num:"03",label:"Supply-chain engagement",need:"Structured Scope 3 and supplier responses integrable into GHG accounting."},
      {num:"04",label:"Reporting and performance",need:"GHG reporting, auditable workflows and reusable dashboards."},
      {num:"05",label:"The route to Net Zero",need:"What-if scenarios and abatement programmes verifiable over time."},
      {num:"06",label:"ESG frameworks and disclosure",need:"Managing CSRD, ESRS, GRI, SASB, CDP frameworks and material requirements mapping."}
    ],
    bridgeNote:"You can tackle missions in any order. Choices accumulate: each decision influences the ones that follow.",
    priorityDataKicker:"Your data needs", priorityDataTitle:"Data needs and associated challenges", priorityDataIntro:"You have defined your business priorities. Now for each business priority, select which factors to evaluate and assign a relevance and current criticality score to each one.", priorityDataCta:"Confirm priorities →",
    priorityDataNeeds:{
      credit:[
        {id:"credit-1",label:"Verifiable and auditable Scope 1, 2 and 3 emissions"},
        {id:"credit-2",label:"Structured ESG KPIs for dialogue with banks and investors"},
        {id:"credit-3",label:"Full traceability from source to the data communicated to the bank"},
        {id:"credit-4",label:"ESG data and plan usable in rating processes and peer benchmarking"},
        {id:"credit-5",label:"Disclosure aligned with ESRS and ISSB / IFRS S1 and S2 standards"},
        {id:"credit-6",label:"Forward-looking scenarios showing trajectories, gaps and the impact of ESG investments"},
        {id:"credit-7",label:"Business case for initiatives with costs, savings and avoided emissions"}
      ],
      compliance:[
        {id:"compliance-1",label:"Traceable and reconcilable Scope 1, 2 and 3 GHG calculations"},
        {id:"compliance-2",label:"Workflows with assignees, deadlines, responses and evidence for assurance"},
        {id:"compliance-3",label:"CSRD / ESRS, GRI, IFRS S1/S2 and other standards managed in the system"},
        {id:"compliance-4",label:"Change log and audit trail for every ESG data point"},
        {id:"compliance-5",label:"Identification and management of material information and gaps against standards"},
        {id:"compliance-6",label:"Completeness checks on missing, overlapping or delayed data"},
        {id:"compliance-7",label:"Quick access to data, factors, documents and evidence requested by auditors"}
      ],
      customers:[
        {id:"customers-1",label:"Scope 3 data by GHG Protocol category for procurement, transport and products"},
        {id:"customers-2",label:"Structured supplier responses integrable into GHG accounting"},
        {id:"customers-3",label:"Product Carbon Footprints provided by suppliers for relevant products and purchases"},
        {id:"customers-4",label:"Reusable ESG information for tender and procurement qualification requirements"},
        {id:"customers-5",label:"Environmental performance comparable against available market benchmarks"},
        {id:"customers-6",label:"Dashboards and KPIs dedicated to ESG requests from strategic customers"},
        {id:"customers-7",label:"Evidence on renewable energy and location-based and market-based Scope 2 emissions"}
      ],
      efficiency:[
        {id:"efficiency-1",label:"High-frequency interval data from meters and sub-metering systems"},
        {id:"efficiency-2",label:"Bill analytics by site, utility, cost and anomalous variation"},
        {id:"efficiency-3",label:"Energy KPIs normalised for weather and operational variables"},
        {id:"efficiency-4",label:"Automatic alerts on peaks, waste and consumption outside expected trends"},
        {id:"efficiency-5",label:"Consumption benchmarking across plants and monitoring against targets"},
        {id:"efficiency-6",label:"Identification of facilities with the greatest savings potential"},
        {id:"efficiency-7",label:"Economic and environmental assessment of efficiency interventions"}
      ],
      supply:[
        {id:"supply-1",label:"Scope 3 cat. 1 (purchased goods) and cat. 4 (upstream transport) data"},
        {id:"supply-2",label:"Supplier responses on emissions, targets, compliance and continuity"},
        {id:"supply-3",label:"Integration with ERP flows to process purchase orders and transactions"},
        {id:"supply-4",label:"ESG risk assessment by supplier and country of origin"},
        {id:"supply-5",label:"Traceability of corrective actions and improvement plans"},
        {id:"supply-6",label:"Monitoring of response rates and data quality received from suppliers"},
        {id:"supply-7",label:"Progressive transition from spend-based estimates to supplier-specific data and PCFs"}
      ],
      reputation:[
        {id:"reputation-1",label:"Clear, consistent ESG reports aligned with recognised frameworks"},
        {id:"reputation-2",label:"Verifiable data on diversity, safety, training and wellbeing"},
        {id:"reputation-3",label:"ESG indicators comparable over time, across sites and functions"},
        {id:"reputation-4",label:"Structured and reusable ESG content for external communication"},
        {id:"reputation-5",label:"Evidence of progress towards climate and Net Zero targets"},
        {id:"reputation-6",label:"Structured collection of ESG data and perceptions from employees and business functions"},
        {id:"reputation-7",label:"Summary dashboards to communicate culture, people and ESG results to management"}
      ]
    },
    mission:"Mission", missionTitle:"The factory of invisible data", companyFacts:"Manufacturing · €400M · 8 plants", briefing:"The Board wants a reliable ESG baseline within 90 days. Energy and environmental data is scattered across plants, suppliers and spreadsheets.", objective:"Your objective", objectiveText:"Create one verifiable source for emissions, energy and reporting without slowing production.", analyse:"Examine the AS-IS", asIsKicker:"Current-state snapshot", asIsTitle:"Four critical issues.\nOne underlying problem.", asIsIntro:"Before choosing a solution, examine how COMPANY_NAME manages ESG data today.", asIsItems:[{title:"Fragmented sources",detail:"Energy, environmental and production data is spread across 8 plants, ERP systems, invoices and email.",metric:"12 SOURCES"},{title:"Manual collection",detail:"Every month users copy values into different sheets, with reminders and checks managed by email.",metric:"180 HRS/MONTH"},{title:"Inconsistent rules",detail:"Units, emission factors and boundaries vary by site, forcing teams to rework comparisons.",metric:"17% ERRORS"},{title:"Slow audit",detail:"Reconstructing the origin, change and approval of a value requires separate files and manual checks.",metric:"6 WEEKS"}], proceedDecision:"Decisions →", decisionTitle:"Which path do you choose?", decisionIntro:"The choice must solve today’s problem without creating a larger one twelve months from now.", optionA:"Adopt an integrated Data Foundation", optionATag:"Recommended solution: IBM Envizi Premium", optionADetail:"Integrates data sources, automates collection and controls, reduces time and errors, and preserves a verifiable trail.", optionB:"A “simple” solution", optionBDetail:"Based on user forms that visually replace spreadsheets, but preserve manual work, reminders and errors; in a year's time, will you still be able to manage the volume?", optionC:"Postpone until next year", optionCDetail:"Avoid immediate cost, but leave the Board without a reliable baseline.", impact:"Decision impact · 12 months later", negativeTitle:"The new form has become the new spreadsheet.", negativeText:"The interface changed, but the process remains manual. More users and data increase errors, delays and control costs, while sources remain disconnected.", postponeTitle:"A year lost, the same problem—only larger.", postponeText:"Sources and volumes have grown while the baseline remains incomplete. The Board must decide without reliable data as reporting pressure rises.", successText:"Envizi progressively integrates sources across eight plants, automates controls and normalization, and creates a verifiable trail—reducing time and errors.", retry:"Review the decision", restart:"Change profile", continue:"Continue the quest", enviziValue:"ENVIZI VALUE UNLOCKED · DATA FOUNDATION"
  }
};
