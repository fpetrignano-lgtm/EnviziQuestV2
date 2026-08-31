import JSZip from "jszip";
import type { SummaryPptxData } from "./generateSummaryPptx";

// ── priority rank helpers ─────────────────────────────────────────────────────
// prioItems is ordered by rank; we need to find rank (1-based) of each of the
// 6 fixed priorities in the template (customers, compliance, credit, efficiency, supply, reputation)
// Returns the rank string "N°X" if included, or "–" if not included
function prioRank(
  prioItems: SummaryPptxData["prioItems"],
  name: string,
  isIt: boolean
): string {
  const idx = prioItems.findIndex(
    (it) => it.name.toLowerCase() === name.toLowerCase()
  );
  if (idx === -1) return "–";
  return isIt ? `N°${idx + 1}` : `#${idx + 1}`;
}

function prioNote(
  prioItems: SummaryPptxData["prioItems"],
  name: string
): string {
  const item = prioItems.find(
    (it) => it.name.toLowerCase() === name.toLowerCase()
  );
  return item?.note || "";
}

// ── XML text replacement ───────────────────────────────────────────────────────
// PPTX text runs are often split across multiple <a:r><a:t> elements for styling.
// We join the full paragraph text, then do a string replace, then rewrite the paragraph
// with a single run carrying the original first-run properties (rPr).

function replaceInSlideXml(xml: string, replacements: Record<string, string>): string {
  // Process paragraph by paragraph to handle split runs
  return xml.replace(/<a:p>([\s\S]*?)<\/a:p>/g, (paraMatch) => {
    // Extract all text content from runs
    const fullText = (paraMatch.match(/<a:t>([^<]*)<\/a:t>/g) || [])
      .map((t) => t.replace(/<a:t>|<\/a:t>/g, ""))
      .join("");

    // Check if any placeholder matches (after joining)
    let newText = fullText;
    for (const [ph, val] of Object.entries(replacements)) {
      newText = newText.split(ph).join(val);
    }

    if (newText === fullText) return paraMatch; // no change needed

    // Extract paragraph-level properties (pPr)
    const pPr = paraMatch.match(/(<a:pPr[\s\S]*?<\/a:pPr>|<a:pPr[^/]*\/>)/)?.[0] || "";
    // Extract first run properties (rPr) to keep font/size/color
    const rPr = paraMatch.match(/(<a:rPr[\s\S]*?<\/a:rPr>|<a:rPr[^/]*\/>)/)?.[0] || "";

    return `<a:p>${pPr}<a:r>${rPr}<a:t>${escapeXml(newText)}</a:t></a:r></a:p>`;
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ── Main export ────────────────────────────────────────────────────────────────
export async function generateTemplatePptx(data: SummaryPptxData): Promise<void> {
  const isIt = data.isIt;

  // Build geo distribution text
  const geo = (data as any).geoDistrib as Record<string, number> | undefined;
  const geoItalia = geo?.italia ?? 0;
  const geoEuropa = geo?.europa ?? 0;
  const geoAsia = geo?.asia ?? 0;
  const geoNordAmerica = geo?.nordamerica ?? 0;
  const geoAfrica = geo?.africa ?? 0;
  const geoDistribText = `Italia ${geoItalia} · Europa ${geoEuropa} · N. America ${geoNordAmerica} · Asia ${geoAsia} · Africa ${geoAfrica}`;

  // Workshop date formatting
  const wDate = (data as any).workshopDate as string | undefined;
  const wConsultant = (data as any).consultantName as string | undefined;
  const dateStr = wDate
    ? new Date(wDate).toLocaleDateString(isIt ? "it-IT" : "en-GB", { day: "2-digit", month: "long", year: "numeric" })
    : isIt ? "data da definire" : "date TBD";
  const consultantStr = wConsultant || (isIt ? "IBM Envizi Team" : "IBM Envizi Team");

  // CSRD status text
  const csrdStatus = data.csrdLabel.startsWith("Soggett") || data.csrdLabel.startsWith("Subject")
    ? (isIt ? "DENTRO il" : "WITHIN the")
    : (isIt ? "FUORI dal" : "OUTSIDE the");

  // Priority ranks (fixed order in template: customers, compliance, credit, efficiency, supply, reputation)
  const rCustomers   = prioRank(data.prioItems, isIt ? "Clienti e gare" : "Clients & tenders", isIt);
  const rCompliance  = prioRank(data.prioItems, isIt ? "Compliance e reporting" : "Compliance & reporting", isIt);
  const rCredit      = prioRank(data.prioItems, isIt ? "Accesso al credito" : "Credit access", isIt);
  const rEfficiency  = prioRank(data.prioItems, isIt ? "Efficienza, energia e costi" : "Efficiency, energy & costs", isIt);
  const rSupply      = prioRank(data.prioItems, isIt ? "Resilienza della supply chain" : "Supply chain resilience", isIt);
  const rReputation  = prioRank(data.prioItems, isIt ? "Reputazione e attrazione talenti" : "Reputation & talent", isIt);

  // Priority notes
  const nCustomers  = prioNote(data.prioItems, isIt ? "Clienti e gare" : "Clients & tenders");
  const nCompliance = prioNote(data.prioItems, isIt ? "Compliance e reporting" : "Compliance & reporting");
  const nCredit     = prioNote(data.prioItems, isIt ? "Accesso al credito" : "Credit access");
  const nEfficiency = prioNote(data.prioItems, isIt ? "Efficienza, energia e costi" : "Efficiency, energy & costs");
  const nSupply     = prioNote(data.prioItems, isIt ? "Resilienza della supply chain" : "Supply chain resilience");
  const nReputation = prioNote(data.prioItems, isIt ? "Reputazione e attrazione talenti" : "Reputation & talent");

  // Data needs list for slide 4
  const needsList = data.critItems
    .map((it) => `${it.rank}. ${it.label} — R:${it.rel} C:${it.crit}`)
    .join("  |  ");

  const replacements: Record<string, string> = {
    // Slide 1
    "(nome_azienda)":                    data.companyName,
    "(data)":                            dateStr,
    "(luogo)":                           isIt ? "Workshop" : "Workshop",
    "(nome_consulente)":                 consultantStr,
    // Slide 2
    "(Nome_azienda)":                    data.companyName,
    "(stato valutazione ESG)":           data.maturityTitle,
    "(Settore)":                         data.sectorLabel,
    "(presenza mercati)":                data.marketLabel,
    "(anno)":                            new Date().getFullYear().toString(),
    "(dato fatturato o altro secondo settore selezionato)": `${data.revenue} ${data.dimUnit}`,
    "Numero dipendenti":                 `${data.employees.toLocaleString()} ${isIt ? "dipendenti" : "employees"}`,
    "(fuori o dentro)":                  csrdStatus,
    "(numero-Sedi)":                     String(data.plants + data.offices),
    "(stabilimenti o altro selezionato per settore) (numero)": `${data.plants} ${isIt ? "stabilimenti" : "plants"}  ·  ${data.offices} ${isIt ? "sedi uffici" : "offices"}`,
    "(Numero) Europa (Numero) USA (NumeroI Asia (Numero) Africa (Numero)": geoDistribText,
    "(Eventuale frase commento": data.csrdNote ? `Note: ${data.csrdNote}` : "",
    "A stato CSRD)":             data.csrdNote ? "" : "",
    // Slide 3 — priority ranks
    "(N/6) Clienti e gare":                    `${rCustomers}/6  Clienti e gare`,
    "(N/6) Compliance e reporting":            `${rCompliance}/6  Compliance e reporting`,
    "(N/6) Accesso al credito":                `${rCredit}/6  Accesso al credito`,
    "(N/6) Efficienza, energia e costi":       `${rEfficiency}/6  Efficienza, energia e costi`,
    "(N/6) Resilienza della supply chain":     `${rSupply}/6  Resilienza della supply chain`,
    "(N/6) Reputazione e attrazione talenti":  `${rReputation}/6  Reputazione e attrazione talenti`,
    // Slide 3 — notes (6 note placeholders + header nota)
    "(Nota)":    nEfficiency,
    "(nota)":    nSupply || nCredit || nCompliance || nCustomers || nReputation || "",
    // Slide 4
    "(Elenco elementi valutati per rilevanza e criticità) ogni elemento ha un numero d'ordine in base al punteggio dato da (R N)  + (C N)": needsList,
    "(ogni elemento è rappresentato in matrice con un cerchio che contiene un numero che è lo stesso dell'ordine dell'elenco elementi": "",
  };

  // Fetch the template
  const res = await fetch("./P11slide.pptx");
  const buf = await res.arrayBuffer();

  const zip = await JSZip.loadAsync(buf);

  // Process each slide XML
  for (let i = 1; i <= 4; i++) {
    const path = `ppt/slides/slide${i}.xml`;
    const file = zip.file(path);
    if (!file) continue;
    const xmlStr = await file.async("string");
    const updated = replaceInSlideXml(xmlStr, replacements);
    zip.file(path, updated);
  }

  // Generate and download
  const outBuf = await zip.generateAsync({ type: "arraybuffer", compression: "DEFLATE" });
  const blob = new Blob([outBuf], { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Envizi-Report-${data.companyName.replace(/[^a-zA-Z0-9]/g, "_") || "Export"}.pptx`;
  a.click();
  URL.revokeObjectURL(url);
}
