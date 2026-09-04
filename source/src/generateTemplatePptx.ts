import JSZip from "jszip";
import type { SummaryPptxData } from "./generateSummaryPptx";

// ── Map PNG generator ─────────────────────────────────────────────────────────
// Renders the same world-footprint image used in the app, with office pins
// at the same % positions as CompanyScreen posMap. Returns a PNG data URL.

type GeoDistrib = Record<string, number>;

// Same positions as CompanyScreen posMap (first position per region)
const GEO_PIN_PCT: Record<string, [number, number]> = {
  italia:      [52, 45],   // milan HQ area
  europa:      [48, 38],
  nordamerica: [18, 43],
  sudamerica:  [28, 64],
  asia:        [72, 42],
  africa:      [50, 58],
  australia:   [78, 66],
};

async function generateMapPng(
  market: string,
  geoDistrib: GeoDistrib,
  totalSites: number,
  companyName: string,
  siteTableCounts: Record<string, number>
): Promise<string | null> {
  const W = 840, H = 420;

  return new Promise((resolve) => {
    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      // Draw background map
      ctx.drawImage(bgImg, 0, 0, W, H);

      // Dark overlay like the app
      ctx.fillStyle = "rgba(3,15,11,0.35)";
      ctx.fillRect(0, 0, W, H);

      // Determine which geo keys to show based on market
      const geoKeys = market === "italia"
        ? ["italia"]
        : market === "europa"
          ? ["italia", "europa"]
          : ["italia", "europa", "nordamerica", "sudamerica", "asia", "africa", "australia"];

      // Draw HQ pin for Milano (always)
      const hqX = GEO_PIN_PCT["italia"][0] / 100 * W;
      const hqY = GEO_PIN_PCT["italia"][1] / 100 * H;
      drawOfficePin(ctx, hqX, hqY, `HQ · ${companyName}`, "MILAN");

      // Draw pins for other active geos — show absolute site counts
      for (const key of geoKeys.filter(k => k !== "italia")) {
        const count = siteTableCounts[key] ?? geoDistrib[key] ?? 0;
        if (count <= 0) continue;
        const [px, py] = GEO_PIN_PCT[key];
        const x = px / 100 * W;
        const y = py / 100 * H;
        const label = key === "europa" ? "EUROPA"
          : key === "nordamerica" ? "NORD AMERICA"
          : key === "sudamerica" ? "SUD AMERICA"
          : key.toUpperCase();
        drawOfficePin(ctx, x, y, `${label} · ${count}`);
      }

      resolve(canvas.toDataURL("image/png"));
    };
    bgImg.onerror = () => resolve(null);
    bgImg.src = "./novaforge-world-footprint.png";
  });
}

function drawOfficePin(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  line1: string,
  line2?: string
) {
  const S = 14; // pin size

  // Building icon (office style from app)
  ctx.save();
  ctx.shadowColor = "rgba(57,239,180,0.7)";
  ctx.shadowBlur = 8;

  // Outer glow ring
  ctx.beginPath();
  ctx.arc(x, y, S * 0.9, 0, Math.PI * 2);
  ctx.strokeStyle = "#d4fff0";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Building body
  ctx.fillStyle = "#1a4a3a";
  ctx.fillRect(x - S * 0.5, y - S * 0.6, S, S * 1.1);
  // Roof
  ctx.fillStyle = "#39efb4";
  ctx.fillRect(x - S * 0.3, y - S * 0.9, S * 0.6, S * 0.3);
  // Windows
  ctx.fillStyle = "#72f7ca";
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      ctx.fillRect(
        x - S * 0.35 + col * S * 0.38,
        y - S * 0.4 + row * S * 0.4,
        S * 0.22, S * 0.22
      );
    }
  }
  ctx.restore();

  // Label bubble
  ctx.save();
  const padding = 5;
  ctx.font = "bold 11px Arial, sans-serif";
  const tw1 = ctx.measureText(line1).width;
  const tw2 = line2 ? ctx.measureText(line2).width : 0;
  const bw = Math.max(tw1, tw2) + padding * 2;
  const bh = line2 ? 32 : 20;
  const bx = x + S + 4;
  const by = y - bh / 2;

  ctx.fillStyle = "rgba(3,16,12,0.88)";
  ctx.beginPath();
  // roundRect polyfill for Safari < 15.4
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(bx, by, bw, bh, 3);
  } else {
    const r = 3;
    ctx.moveTo(bx + r, by);
    ctx.lineTo(bx + bw - r, by);
    ctx.arcTo(bx + bw, by, bx + bw, by + r, r);
    ctx.lineTo(bx + bw, by + bh - r);
    ctx.arcTo(bx + bw, by + bh, bx + bw - r, by + bh, r);
    ctx.lineTo(bx + r, by + bh);
    ctx.arcTo(bx, by + bh, bx, by + bh - r, r);
    ctx.lineTo(bx, by + r);
    ctx.arcTo(bx, by, bx + r, by, r);
    ctx.closePath();
  }
  ctx.fill();
  ctx.strokeStyle = "#4b7868";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  ctx.fillStyle = "#effff9";
  ctx.fillText(line1, bx + padding, by + 13);
  if (line2) {
    ctx.fillStyle = "#72f7ca";
    ctx.font = "9px Arial, sans-serif";
    ctx.fillText(line2, bx + padding, by + 26);
  }
  ctx.restore();
}

// ── priority helpers ──────────────────────────────────────────────────────────
// Returns the prioItem at a given 1-based rank position (sorted by rank asc).
function prioAtRank(
  prioItems: SummaryPptxData["prioItems"],
  rank: number
): SummaryPptxData["prioItems"][number] | null {
  const sorted = [...prioItems].sort((a, b) => a.rank - b.rank);
  return sorted[rank - 1] ?? null;
}

// ── XML text replacement ───────────────────────────────────────────────────────
// Two-pass strategy:
//  1. Shape-level: join all text across ALL paragraphs in a shape, do the replace,
//     rewrite the entire shape body as a single paragraph with a single run.
//     Used for placeholders that span multiple paragraphs (e.g. slide 1 workshop info).
//  2. Para-level: for placeholders contained within a single paragraph, replace
//     in-place preserving the paragraph structure.

function replaceInSlideXml(xml: string, replacements: Record<string, string>): string {
  // Pass 1 — shape-level (handles multi-paragraph placeholders)
  xml = xml.replace(/(<p:txBody>)([\s\S]*?)(<\/p:txBody>)/g, (match, open, body, close) => {
    // Collect all paragraph texts joined by newline separator
    const paraTexts: string[] = [];
    body.replace(/<a:p>([\s\S]*?)<\/a:p>/g, (_pm: string, inner: string) => {
      const t = (inner.match(/<a:t>([^<]*)<\/a:t>/g) || [])
        .map((x: string) => x.replace(/<a:t>|<\/a:t>/g, "")).join("");
      paraTexts.push(t);
      return "";
    });
    const fullText = paraTexts.join("");

    let newText = fullText;
    for (const [ph, val] of Object.entries(replacements)) {
      newText = newText.split(ph).join(val);
    }
    if (newText === fullText) return match; // no multi-para placeholder matched

    // Extract body-level props (bodyPr, lstStyle) and first rPr
    const bodyPr   = body.match(/(<a:bodyPr[\s\S]*?<\/a:bodyPr>|<a:bodyPr[^/]*\/>)/)?.[0] || "";
    const lstStyle = body.match(/(<a:lstStyle[\s\S]*?<\/a:lstStyle>|<a:lstStyle[^/]*\/>)/)?.[0] || "";
    const rPr      = body.match(/(<a:rPr[\s\S]*?<\/a:rPr>|<a:rPr[^/]*\/>)/)?.[0] || "";

    // Rebuild: one paragraph per line of replaced text
    const paras = newText.split("\n").map(line =>
      `<a:p><a:r>${rPr}<a:t>${escapeXml(line)}</a:t></a:r></a:p>`
    ).join("");

    return `${open}${bodyPr}${lstStyle}${paras}${close}`;
  });

  // Pass 2 — paragraph-level (handles single-paragraph placeholders, preserves styling)
  xml = xml.replace(/<a:p>([\s\S]*?)<\/a:p>/g, (paraMatch) => {
    const fullText = (paraMatch.match(/<a:t>([^<]*)<\/a:t>/g) || [])
      .map((t) => t.replace(/<a:t>|<\/a:t>/g, ""))
      .join("");

    let newText = fullText;
    for (const [ph, val] of Object.entries(replacements)) {
      newText = newText.split(ph).join(val);
    }

    if (newText === fullText) return paraMatch;

    const pPr = paraMatch.match(/(<a:pPr[\s\S]*?<\/a:pPr>|<a:pPr[^/]*\/>)/)?.[0] || "";
    const rPr = paraMatch.match(/(<a:rPr[\s\S]*?<\/a:rPr>|<a:rPr[^/]*\/>)/)?.[0] || "";

    return `<a:p>${pPr}<a:r>${rPr}<a:t>${escapeXml(newText)}</a:t></a:r></a:p>`;
  });

  return xml;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Remove specific shapes by their cNvPr id from slide XML.
// Used to delete empty overlay rectangles that cover note text boxes.
function removeShapesById(xml: string, ids: number[]): string {
  for (const id of ids) {
    const re = new RegExp(`<p:sp>(?:(?!<p:sp>)[\\s\\S])*?<p:cNvPr[^>]*\\bid="${id}"[^>]*>[\\s\\S]*?</p:sp>`, "g");
    xml = xml.replace(re, "");
  }
  return xml;
}

// ── Slide 2 readiness label fix ───────────────────────────────────────────────
// Shape id=23 (readiness value label):
//   - font was sz=2850 in the template demo → align to sz=2025 (matches id=27)
//   - width was 2286000 EMU (180pt) — enough for "BASSA" but not for longer
//     maturity labels. Widen to 4572000 EMU (360pt) so text fits on one line.
function fixSlide2ReadinessFont(xml: string): string {
  return xml.replace(
    /(<p:sp>(?:(?!<p:sp>)[\s\S])*?<p:cNvPr[^>]*\bid="23"[^>]*>[\s\S]*?<\/p:sp>)/,
    (spBlock) => spBlock
      .replace(/\bsz="2850"/g, `sz="2025"`)
      .replace(/(<a:ext cx=")2286000(")/,  `$14572000$2`)
  );
}

// ── Slide 6 title font reducer ────────────────────────────────────────────────
// Reduces the font size of shape id=13 (title bar in slide6) to fit long text.
function reduceSlide6TitleFont(xml: string): string {
  return xml.replace(
    /(<p:sp>(?:(?!<p:sp>)[\s\S])*?<p:cNvPr[^>]*\bid="13"[^>]*>[\s\S]*?<\/p:sp>)/,
    (spBlock) => spBlock.replace(/\bsz="2700"/g, `sz="1600"`)
                        .replace(/\bsz="1600"/g, `sz="1400"`)
  );
}

// ── Slide 6 needs list replacement ───────────────────────────────────────────
// Replaces the txBody of shape id=15 (left column in slide6) with a numbered list.
// Items sorted by R+C descending, top 10. Format: "N. label (R:x C:y)"
function replaceSlide6NeedsList(
  xml: string,
  items: SummaryPptxData["critItems"],
  isIt: boolean
): string {
  const top10 = [...items]
    .sort((a, b) => (b.rel + b.crit) - (a.rel + a.crit))
    .slice(0, 10);

  const RPR = `<a:rPr lang="it-IT" sz="1200" dirty="0"><a:solidFill><a:srgbClr val="073E31"/></a:solidFill><a:latin typeface="Calibri"/><a:cs typeface="Calibri"/></a:rPr>`;
  const PPR = `<a:pPr marL="0" marR="0" indent="0"><a:lnSpc><a:spcPct val="110000"/></a:lnSpc><a:spcBef><a:spcPts val="200"/></a:spcBef><a:spcAft><a:spcPts val="0"/></a:spcAft><a:buNone/></a:pPr>`;

  const header = isIt ? "Esigenze per criticità + rilevanza:" : "Needs by criticality + relevance:";
  const HDR_RPR = `<a:rPr lang="it-IT" sz="1200" b="1" dirty="0"><a:solidFill><a:srgbClr val="073E31"/></a:solidFill><a:latin typeface="Calibri"/><a:cs typeface="Calibri"/></a:rPr>`;
  const HDR_PPR = `<a:pPr marL="0" marR="0" indent="0"><a:lnSpc><a:spcPct val="110000"/></a:lnSpc><a:spcBef><a:spcPts val="0"/></a:spcBef><a:spcAft><a:spcPts val="400"/></a:spcAft><a:buNone/></a:pPr>`;

  const paras = [
    // Header paragraph
    `<a:p>${HDR_PPR}<a:r>${HDR_RPR}<a:t>${escapeXml(header)}</a:t></a:r></a:p>`,
    // One paragraph per need
    ...top10.map((it, i) => {
      const score = it.rel + it.crit;
      const line = `${i + 1}. ${it.label}  (R:${it.rel} C:${it.crit} · ${score})`;
      return `<a:p>${PPR}<a:r>${RPR}<a:t>${escapeXml(line)}</a:t></a:r></a:p>`;
    }),
  ].join("");

  const newTxBody = `<p:txBody><a:bodyPr/><a:lstStyle/>${paras}</p:txBody>`;

  return xml.replace(
    /(<p:sp>(?:(?!<p:sp>)[\s\S])*?<p:cNvPr[^>]*\bid="15"[^>]*>[\s\S]*?)<p:txBody>[\s\S]*?<\/p:txBody>(<\/p:sp>)/,
    `$1${newTxBody}$2`
  );
}

// ── Slide 4 matrix PNG generator ─────────────────────────────────────────────
// Renders a 10×10 matrix on canvas. Horizontal axis = Rilevanza (1-10),
// Vertical axis = Criticità (1-10, bottom=1, top=10).
// Each item is drawn as a numbered circle placed at its (rel, crit) cell.
// Returns a PNG data URL (or null on error).
function generateMatrixPng(
  items: SummaryPptxData["critItems"],
  isIt: boolean
): string | null {
  try {
    const W = 640, H = 520;
    const PAD_L = 52, PAD_B = 48, PAD_T = 18, PAD_R = 18;
    const PLOT_W = W - PAD_L - PAD_R;
    const PLOT_H = H - PAD_T - PAD_B;
    const CELL_W = PLOT_W / 10;
    const CELL_H = PLOT_H / 10;

    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = "#FAFCFB";
    ctx.fillRect(0, 0, W, H);

    // Quadrant fills (same 4 quadrants as viewer: mid at 5.5)
    const midX = PAD_L + 5 * CELL_W;
    const midY = PAD_T + 5 * CELL_H;
    const quads = [
      { x: PAD_L, y: PAD_T,  w: 5 * CELL_W, h: 5 * CELL_H, fill: "#dceee5" }, // top-left: Mantenere
      { x: midX,  y: PAD_T,  w: 5 * CELL_W, h: 5 * CELL_H, fill: "#c5e0d2" }, // top-right: Trasformare
      { x: PAD_L, y: midY,   w: 5 * CELL_W, h: 5 * CELL_H, fill: "#e8f5ee" }, // bot-left: Monitorare
      { x: midX,  y: midY,   w: 5 * CELL_W, h: 5 * CELL_H, fill: "#d5eadf" }, // bot-right: Migliorare
    ];
    for (const q of quads) {
      ctx.fillStyle = q.fill;
      ctx.fillRect(q.x, q.y, q.w, q.h);
    }

    // Grid lines (10×10 cells)
    ctx.strokeStyle = "#c0d8c8";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const x = PAD_L + i * CELL_W;
      ctx.beginPath(); ctx.moveTo(x, PAD_T); ctx.lineTo(x, PAD_T + PLOT_H); ctx.stroke();
      const y = PAD_T + i * CELL_H;
      ctx.beginPath(); ctx.moveTo(PAD_L, y); ctx.lineTo(PAD_L + PLOT_W, y); ctx.stroke();
    }

    // Mid dividers (thicker)
    ctx.strokeStyle = "#8ab5a0";
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(midX, PAD_T); ctx.lineTo(midX, PAD_T + PLOT_H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(PAD_L, midY); ctx.lineTo(PAD_L + PLOT_W, midY); ctx.stroke();

    // Border around plot area
    ctx.strokeStyle = "#0d3a2a";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(PAD_L, PAD_T, PLOT_W, PLOT_H);

    // Axis labels
    ctx.fillStyle = "#0d3a2a";
    ctx.font = "bold 13px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(isIt ? "R – Rilevanza" : "R – Relevance", PAD_L + PLOT_W / 2, H - 6);
    ctx.save();
    ctx.translate(14, PAD_T + PLOT_H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(isIt ? "C – Criticità" : "C – Criticality", 0, 0);
    ctx.restore();

    // Tick labels 1–10 on both axes
    ctx.font = "11px Arial, sans-serif";
    ctx.fillStyle = "#3a6a50";
    ctx.textAlign = "center";
    for (let v = 1; v <= 10; v++) {
      // X axis: value v is at the centre of cell (v-1)
      const tx = PAD_L + (v - 1) * CELL_W + CELL_W / 2;
      ctx.fillText(String(v), tx, H - PAD_B + 14);
      // Y axis: value v bottom=1, top=10 → cell (10-v)
      const ty = PAD_T + (10 - v) * CELL_H + CELL_H / 2 + 4;
      ctx.textAlign = "right";
      ctx.fillText(String(v), PAD_L - 5, ty);
      ctx.textAlign = "center";
    }

    // Quadrant labels
    ctx.font = "italic 11px Arial, sans-serif";
    ctx.fillStyle = "#3a6a50";
    ctx.textAlign = "center";
    const qLabels = [
      { label: isIt ? "Mantenere" : "Maintain",   cx: PAD_L + 2.5 * CELL_W, cy: PAD_T + 10 },
      { label: isIt ? "Trasformare" : "Transform", cx: midX  + 2.5 * CELL_W, cy: PAD_T + 10 },
      { label: isIt ? "Monitorare" : "Monitor",    cx: PAD_L + 2.5 * CELL_W, cy: midY + 12 },
      { label: isIt ? "Migliorare" : "Improve",    cx: midX  + 2.5 * CELL_W, cy: midY + 12 },
    ];
    for (const ql of qLabels) {
      ctx.fillText(ql.label, ql.cx, ql.cy);
    }

    // Sort items by R+C desc to get display rank (same as list)
    const ranked = [...items]
      .sort((a, b) => (b.rel + b.crit) - (a.rel + a.crit))
      .slice(0, 10)
      .map((it, i) => ({ ...it, displayRank: i + 1 }));

    // Group by cell key to detect overlaps
    const cellGroups = new Map<string, typeof ranked>();
    for (const it of ranked) {
      const key = `${it.rel},${it.crit}`;
      if (!cellGroups.has(key)) cellGroups.set(key, []);
      cellGroups.get(key)!.push(it);
    }

    // Offset patterns within a cell (normalised to cell units, centred on 0,0).
    // For n circles in the same cell, spread them so they don't overlap.
    // Each circle radius = 0.38 * min(CELL_W, CELL_H).
    const R_CIRCLE = Math.min(CELL_W, CELL_H) * 0.38;
    // Step between circle centres = 2 * R_CIRCLE * 0.85 (slight overlap allowed)
    const STEP = R_CIRCLE * 1.7;
    const offsets: [number, number][][] = [
      [[0, 0]],                                           // 1: centre
      [[-STEP / 2, 0], [STEP / 2, 0]],                   // 2: left-right
      [[-STEP, 0], [0, 0], [STEP, 0]],                   // 3: row
      [[-STEP / 2, -STEP / 2], [STEP / 2, -STEP / 2],   // 4: 2×2 grid
       [-STEP / 2,  STEP / 2], [STEP / 2,  STEP / 2]],
      [[-STEP, 0], [-STEP / 2, -STEP * 0.8], [STEP / 2, -STEP * 0.8], // 5+: wrap into rows
       [-STEP / 2,  STEP * 0.8], [STEP / 2,  STEP * 0.8]],
    ];
    const getOffsets = (n: number): [number, number][] => {
      if (n <= offsets.length) return offsets[n - 1];
      // fallback: arrange in a horizontal row clamped to cell
      return Array.from({ length: n }, (_, i) => [(i - (n - 1) / 2) * STEP, 0] as [number, number]);
    };

    // Draw circles with jitter applied
    for (const group of cellGroups.values()) {
      const baseCx = PAD_L + (group[0].rel - 1) * CELL_W + CELL_W / 2;
      const baseCy = PAD_T + (10 - group[0].crit) * CELL_H + CELL_H / 2;
      const offs = getOffsets(group.length);
      group.forEach((it, idx) => {
        const cx = baseCx + offs[idx][0];
        const cy = baseCy + offs[idx][1];

        ctx.beginPath();
        ctx.arc(cx, cy, R_CIRCLE, 0, Math.PI * 2);
        ctx.fillStyle = "#0d3a2a";
        ctx.fill();

        ctx.font = `bold ${Math.round(R_CIRCLE * 1.1)}px Arial, sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(it.displayRank), cx, cy);
      });
    }
    ctx.textBaseline = "alphabetic";

    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

// ── CSRD / reporting path lookup ──────────────────────────────────────────────
const REPORTING_PATHS: Record<number, { status: { it: string; en: string }; decision: { it: string; en: string } }> = {
  0: { status: { it: "Percorso di rendicontazione non selezionato", en: "Reporting path not selected" }, decision: { it: "", en: "" } },
  1: { status: { it: "Standard VSME (rendicontazione volontaria semplificata)", en: "VSME Standard (simplified voluntary reporting)" }, decision: { it: "L'azienda è una PMI che intende rispondere alle richieste di banche, clienti e imprese capofiliera.", en: "The company is an SME seeking to respond to requests from banks, clients and lead firms in the supply chain." } },
  2: { status: { it: 'Report volontario "CSRD-aligned"', en: '"CSRD-aligned" voluntary report' }, decision: { it: "L'azienda è un'impresa medio-grande, un fornitore strategico, un'organizzazione in crescita che intende avvicinarsi gradualmente ai requisiti CSRD.", en: "The company is a mid-large enterprise, a strategic supplier or a growing organisation aiming to gradually align with CSRD requirements." } },
  3: { status: { it: "Adozione integrale volontaria degli ESRS", en: "Full voluntary adoption of ESRS" }, decision: { it: "L'azienda non è ancora soggetta alla CSRD, ma è vicina alle soglie, valuta una quotazione o riceve rilevanti richieste ESG dagli stakeholder.", en: "The company is not yet subject to CSRD but is close to the thresholds, considering a listing, or receiving significant ESG requests from stakeholders." } },
  4: { status: { it: "CSRD obbligatoria", en: "Mandatory CSRD" }, decision: { it: "L'organizzazione supera le soglie previste dalla normativa ed è pertanto soggetta agli obblighi della CSRD.", en: "The company or group exceeds the regulatory thresholds and is therefore subject to CSRD obligations." } },
  5: { status: { it: "Rendicontazione libera", en: "Free-form reporting" }, decision: { it: "L'azienda intende comunicare liberamente le proprie iniziative e prestazioni di sostenibilità.", en: "The company does not fall within the previous options and intends to freely communicate its sustainability initiatives and performance." } },
};

// ── Company slide PNG generator ────────────────────────────────────────────────
async function generateCompanySlidePng(data: SummaryPptxData, isIt: boolean): Promise<string | null> {
  const W = 1270, H = 714; // 16:9 proportions
  const siteTable = data.siteTable as Record<string, Record<string, number>> | undefined;
  const GEO_KEYS = ["italia","europa","nordamerica","sudamerica","asia","africa","australia"];
  const GEO_LABELS: Record<string,string[]> = {
    italia:["Italia","Italy"], europa:["Europa","Europe"],
    nordamerica:["Nord America","North America"], sudamerica:["Sud America","South America"],
    asia:["Asia","Asia"], africa:["Africa","Africa"], australia:["Australia","Australia"],
  };
  const SITE_ROWS = ["uffici","ops","datacenter","altro"];
  const SITE_LABELS: Record<string,string[]> = {
    uffici:["Uffici","Offices"], ops:["Sedi op.","Op. sites"],
    datacenter:["Data centre","Data centres"], altro:["Altro","Other"],
  };
  const SITE_COLORS: Record<string,string> = {uffici:"#7ab8d8",ops:"#72c4a0",datacenter:"#b08adc",altro:"#e8a84a"};
  const li = isIt ? 0 : 1;

  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // Top accent bar
    ctx.fillStyle = "#1a7a4a";
    ctx.fillRect(0, 0, W, 6);

    // Title
    ctx.fillStyle = "#0a3a2a";
    ctx.font = "bold 28px Arial, sans-serif";
    const companyName = data.participantCompany?.trim() || data.companyName;
    ctx.fillText(isIt ? `Profilo aziendale — ${companyName}` : `Company profile — ${companyName}`, 48, 56);

    // ── Left column: stats ─────────────────────────────────────────────
    const COL1_X = 48, COL2_X = W / 2 + 20;
    const stats = [
      [isIt?"Settore":"Sector", data.sectorLabel],
      [isIt?"Mercato":"Market", data.marketLabel],
      [isIt?"Fatturato":"Revenue", `${data.revenue} ${data.dimUnit}`],
      [isIt?"Dipendenti":"Employees", String(data.employees?.toLocaleString() ?? "—")],
    ];
    let y = 90;
    const statW = (W/2 - 72) / 2 - 8;
    stats.forEach(([label, value], idx) => {
      const x = COL1_X + (idx % 2) * (statW + 8);
      if (idx % 2 === 0 && idx > 0) y += 68;
      const bY = idx < 2 ? 90 : 158;
      const bX = COL1_X + (idx % 2) * (statW + 8);
      ctx.fillStyle = "#f0f7f3";
      roundRect(ctx, bX, bY, statW, 58, 8);
      ctx.fillStyle = "#f0f7f3";
      ctx.fill();
      ctx.fillStyle = "#1a7a4a";
      ctx.font = "bold 10px Arial, sans-serif";
      ctx.fillText(label.toUpperCase(), bX + 10, bY + 18);
      ctx.fillStyle = "#0a2a1a";
      ctx.font = "bold 14px Arial, sans-serif";
      ctx.fillText(String(value).slice(0, 32), bX + 10, bY + 42);
    });

    // CSRD box
    ctx.fillStyle = "#fff8ee";
    roundRect(ctx, COL1_X, 236, W/2 - 72, 64, 8);
    ctx.fill();
    ctx.strokeStyle = "#f5a623";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#c05000";
    ctx.font = "bold 10px Arial, sans-serif";
    ctx.fillText("CSRD", COL1_X + 10, 256);
    ctx.fillStyle = "#0a2a1a";
    ctx.font = "bold 13px Arial, sans-serif";
    ctx.fillText(String(data.csrdLabel ?? "").slice(0, 50), COL1_X + 10, 274);
    ctx.fillStyle = "#556677";
    ctx.font = "12px Arial, sans-serif";
    ctx.fillText(String(data.csrdSub ?? "").slice(0, 60), COL1_X + 10, 291);

    // Maturity box
    ctx.fillStyle = "#f0f7f3";
    roundRect(ctx, COL1_X, 316, W/2 - 72, 72, 8);
    ctx.fill();
    ctx.strokeStyle = "#39efb4";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#39efb4";
    ctx.fillRect(COL1_X, 316, 3, 72);
    ctx.fillStyle = "#1a7a4a";
    ctx.font = "bold 10px Arial, sans-serif";
    ctx.fillText((isIt?"MATURITÀ ESG":"ESG MATURITY"), COL1_X + 12, 334);
    ctx.fillStyle = "#0a2a1a";
    ctx.font = "bold 13px Arial, sans-serif";
    ctx.fillText(String(data.maturityTitle ?? "").slice(0, 50), COL1_X + 12, 352);
    ctx.fillStyle = "#556677";
    ctx.font = "11px Arial, sans-serif";
    const matDesc = String(data.maturityDesc ?? "");
    ctx.fillText(matDesc.slice(0, 70), COL1_X + 12, 368);
    if (matDesc.length > 70) ctx.fillText(matDesc.slice(70, 140), COL1_X + 12, 382);

    // ── Right column: geographic footprint ────────────────────────────
    ctx.fillStyle = "#1a7a4a";
    ctx.font = "bold 12px Arial, sans-serif";
    ctx.fillText((isIt?"FOOTPRINT GEOGRAFICO":"GEOGRAPHIC FOOTPRINT").toUpperCase(), COL2_X, 100);

    if (siteTable) {
      const activeGeos = GEO_KEYS.filter(g => SITE_ROWS.some(r => (siteTable[r]?.[g] ?? 0) > 0));
      let gy = 116;
      activeGeos.forEach(g => {
        const rowH = 44;
        ctx.fillStyle = "#f0f7f3";
        roundRect(ctx, COL2_X, gy, W - COL2_X - 48, rowH, 6);
        ctx.fill();
        ctx.fillStyle = "#0a2a1a";
        ctx.font = "bold 13px Arial, sans-serif";
        ctx.fillText(GEO_LABELS[g]?.[li] ?? g, COL2_X + 10, gy + 18);
        let cx = COL2_X + 130;
        SITE_ROWS.forEach(r => {
          const val = siteTable[r]?.[g] ?? 0;
          if (val === 0) return;
          const chip = `${SITE_LABELS[r]?.[li] ?? r} ${val}`;
          ctx.strokeStyle = SITE_COLORS[r];
          ctx.lineWidth = 1;
          ctx.fillStyle = "transparent";
          const cw = ctx.measureText(chip).width + 14;
          roundRect(ctx, cx, gy + 8, cw, 22, 4);
          ctx.stroke();
          ctx.fillStyle = SITE_COLORS[r];
          ctx.font = "bold 10px Arial, sans-serif";
          ctx.fillText(chip, cx + 7, gy + 23);
          cx += cw + 6;
        });
        gy += rowH + 6;
      });
      if (activeGeos.length === 0) {
        ctx.fillStyle = "#8aaa98";
        ctx.font = "italic 13px Arial, sans-serif";
        ctx.fillText(isIt?"Nessuna sede configurata":"No sites configured", COL2_X, 130);
      }
    }

    // Bottom bar
    ctx.fillStyle = "#e8f5ef";
    ctx.fillRect(0, H - 28, W, 28);
    ctx.fillStyle = "#8aaa98";
    ctx.font = "11px Arial, sans-serif";
    ctx.fillText("IBM Envizi Quest", W / 2 - 45, H - 10);

    resolve(canvas.toDataURL("image/png"));
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ── Main export ────────────────────────────────────────────────────────────────
export async function generateTemplatePptx(data: SummaryPptxData): Promise<void> {
  const isIt = data.isIt;

  // Resolve company name — prefer participantCompany over displayCompanyName placeholder
  const participantCompany = data.participantCompany?.trim() || "";
  const participantRole    = data.participantRole?.trim() || "";
  const resolvedCompanyName = participantCompany || data.companyName;

  // siteTable — absolute counts per geo
  const siteTable = data.siteTable as Record<string, Record<string, number>> | undefined;
  const siteRows = ["uffici", "ops", "datacenter", "altro"] as const;
  const geoKeys2 = ["italia", "europa", "nordamerica", "sudamerica", "asia", "africa", "australia"] as const;

  // siteColSum — total sites per geo (all types)
  const siteColSum = (geo: string): number =>
    siteRows.reduce((s, r) => s + ((siteTable?.[r]?.[geo]) ?? 0), 0);

  // siteRowSum — total sites per row type (all geos)
  const siteRowSum = (row: string): number =>
    geoKeys2.reduce((s, g) => s + ((siteTable?.[row]?.[g]) ?? 0), 0);

  // Workshop date / consultant
  const wDate       = data.workshopDate;
  const wConsultant = data.consultantName?.trim() || "";
  const dateStr     = wDate
    ? new Date(wDate).toLocaleDateString(isIt ? "it-IT" : "en-GB", { day: "2-digit", month: "long", year: "numeric" })
    : isIt ? "data da definire" : "date TBD";
  // Consultant string: one line per element (name, businessUnit, role, company)
  const businessUnit = data.businessUnit?.trim() || "";
  const consultantStr = (() => {
    const parts: string[] = [];
    if (wConsultant) parts.push(wConsultant);
    if (participantRole) parts.push(participantRole);
    if (participantCompany) parts.push(participantCompany);
    if (businessUnit) parts.push(businessUnit);
    return parts.join("\n") || "IBM Envizi Team";
  })();

  // CSRD status / reporting path decision
  const rPath = data.reportingPath ?? 0;
  const pathEntry = REPORTING_PATHS[rPath] ?? REPORTING_PATHS[0];
  const csrdStatus   = isIt ? pathEntry.status.it   : pathEntry.status.en;
  const csrdDecision = isIt ? pathEntry.decision.it : pathEntry.decision.en;
  const line7 = csrdDecision ? `${csrdStatus}\n${csrdDecision}` : csrdStatus;

  const dc = data.dataCenters ?? 0;

  // Total sites (used for slide2 stat card and map)
  const totalSedi = siteRows.reduce((s, r) => s + siteRowSum(r), 0) || (data.plants + data.offices + dc);

  // Slide 2 card values — new template uses individual shapes per stat
  const activeGeoCount = geoKeys2.filter(g => siteColSum(g) > 0).length;
  // Slide2 title (shape id=2): company name + market presence + ESG focus
  const slide2Title = isIt
    ? `${resolvedCompanyName} combina una presenza ${data.marketLabel.toLowerCase()} con una forte attenzione a ESG`
    : `${resolvedCompanyName} combines a ${data.marketLabel.toLowerCase()} presence with a strong focus on ESG`;

  // Slide 5 (priorities): fill each of the 6 fixed cells.
  // Template cell order (by shape id in slide5):
  //   id=8  → slot compliance (rank=1 in Erica demo)
  //   id=4  → slot credito    (rank=2)
  //   id=6  → slot clienti    (rank=3)
  //   id=10 → slot efficienza (rank=4)
  //   id=12 → slot supply     (rank=5)
  //   id=27 → slot reputazione(rank=6)
  // The slot order matches the "demo" values in the template (1/6..6/6).
  // We map user priorities at each rank to the corresponding slot.
  const slot = (rank: number) => {
    const item = prioAtRank(data.prioItems, rank);
    return {
      header: item ? `${rank}/6  ${item.name}` : `–`,
      note:   item ? (item.note || "") : "",
    };
  };
  const s1 = slot(1); const s2 = slot(2); const s3 = slot(3);
  const s4 = slot(4); const s5 = slot(5); const s6 = slot(6);

  // Slide 5 intro sentence
  const top1 = prioAtRank(data.prioItems, 1);
  const top2 = prioAtRank(data.prioItems, 2);
  const slide5Intro = isIt
    ? `La priorità principale di ${resolvedCompanyName} è ${top1?.name ?? "–"}`
      + (top2 ? ` seguita da ${top2.name}` : "")
      + `, evidenziando il valore di ESG per il business.`
    : `The main priority of ${resolvedCompanyName} is ${top1?.name ?? "–"}`
      + (top2 ? ` followed by ${top2.name}` : "")
      + `, highlighting the value of ESG for the business.`;

  // Slide 6 title — use top-2 needs (sorted by R+C desc, same order as list)
  const sortedForTitle = [...data.critItems]
    .sort((a, b) => (b.rel + b.crit) - (a.rel + a.crit));
  const cleanLabel = (s: string) => s.replace(/\)+\s*$/, "").trimEnd();
  const titleNeed1 = cleanLabel(sortedForTitle[0]?.label ?? "");
  const titleNeed2 = cleanLabel(sortedForTitle[1]?.label ?? "");
  const titleAreas = titleNeed2
    ? (isIt ? `${titleNeed1} e ${titleNeed2}` : `${titleNeed1} and ${titleNeed2}`)
    : titleNeed1;
  const slide6Title = isIt
    ? `${resolvedCompanyName} mostra le principali esigenze a supporto degli obiettivi di business nelle aree ${titleAreas}`
    : `${resolvedCompanyName} shows the main data needs supporting business objectives in the areas of ${titleAreas}`;


  const replacements: Record<string, string> = {
    // ── Slide 1 ──
    "Il percorso ESG di Erica":
      isIt ? `Il percorso ESG di ${resolvedCompanyName}` : `The ESG journey of ${resolvedCompanyName}`,
    // Slide1 shape id=5: multi-paragraph (intro + date + consultant lines)
    // The template has 5 paragraphs: "Sintesi…", date, name, role, company
    // replaceInSlideXml concatenates all <a:t> in a txBody match then replaces
    "Sintesi workshop Envizi Quest04 settembre 2026Felice Petrignano VESG Consultant VAbc V":
      `${isIt ? "Sintesi workshop Envizi Quest" : "Envizi Quest workshop summary"}\n${dateStr}\n${consultantStr}`,
    "Incontro di lavoro · 2026":
      `${isIt ? "Incontro di lavoro" : "Working session"} · ${new Date().getFullYear()}`,

    // ── Slide 2 ──
    // Title (id=2): dynamic sentence
    "Erica combina una presenza globale con una maturità ESG ancora iniziale": slide2Title,
    // Stat cards — value shapes
    // Strip trailing descriptor word from dimUnit (e.g. "€mln ricavi" → "€mln")
    // so the card shows only the numeric value + monetary unit; the label below already carries the descriptor.
    "€100 mln": `${data.revenue} ${data.dimUnit.replace(/\s+\S+$/, "")}`,
    "500":      `${data.employees.toLocaleString()}`,
    "54":       `${totalSedi}`,
    "8":        `${activeGeoCount}`,
    // Readiness block (id=23 label, id=24 desc)
    "BASSA": data.maturityTitle,
    "I dati sono pochi e frammentati. Erica cerca un sistema unico per raccoglierli, identificare i gap e organizzare le evidenze.":
      data.maturityDesc,
    // Reporting path block (id=27 label, id=28 desc)
    "Report volontario CSRD-aligned": csrdStatus,
    "Erica non rientra indicativamente nel perimetro CSRD 2026, ma vuole avvicinarsi gradualmente ai requisiti europei e rispondere alle richieste degli stakeholder.":
      csrdDecision,

    // ── Slide 4 (frameworks) ──
    "Erica usa più framework e vuole aggiungere una vista strutturata sul rischio climatico":
      isIt
        ? `${resolvedCompanyName} usa più framework e vuole aggiungere una vista strutturata sul rischio climatico`
        : `${resolvedCompanyName} uses multiple frameworks and wants to add a structured view on climate risk`,

    // ── Slide 5 (priorities) ──
    // Intro title
    "La priorità principale di Nat 1 è Compliance e reporting seguita da Accesso al credito, evidenziando il valore di ESG per il business.":
      slide5Intro,
    // Header cells — template order by shape id (compliance=8, credito=4, clienti=6, efficienza=10, supply=12, reputazione=27)
    "1/6  Compliance e reporting":       s1.header,
    "2/6  Accesso al credito":           s2.header,
    "3/6  Clienti e gare":               s3.header,
    "4/6  Efficienza, energia e costi":  s4.header,
    "5/6  Resilienza della supply chain": s5.header,
    "6/6  Reputazione e attrazione dei talenti": s6.header,
    // Note cells — template demo texts map to the same slot order
    "Il nostro settore è sotto osservazione da parte di ESMA per il rischio di greenwashing. Il Compliance Officer ha chiesto al team ESG di dimostrare che ogni dato pubblicato è tracciabile fino alla fonte primaria. Oggi non siamo in grado di farlo.":
      s1.note,
    "Stiamo lavorando a un\u2019emissione di green bond. Il lead arranger ci ha già richiesto un framework ESG verificabile con dati storici su emissioni ed energia. Non abbiamo ancora un sistema capace di produrre questo livello di evidenza.":
      s2.note,
    "Un grande retailer europeo ci ha notificato che dal 2025 tutti i fornitori dovranno dichiarare le emissioni Scope 3 cat. 1 con dati specifici per prodotto. Oggi lavoriamo con stime spend-based che non soddisfano questo requisito.":
      s3.note,
    "Il CFO ha chiesto un piano di decarbonizzazione con NPV e payback per ogni iniziativa. Non disponiamo di una baseline energetica affidabile per sito, né di un sistema che aggreghi consumi, costi e produzioni per calcolare l\u2019intensità emissiva.":
      s4.note,
    "Scope 3 cat. 1 e 2 valgono il 65% della nostra impronta totale. I principali fornitori non inviano dati strutturati: riceviamo PDF e allegati e-mail che non riusciamo a riconciliare. Un cliente chiave ci ha già chiesto un piano di riduzione Scope 3.":
      s5.note,
    "Abbiamo perso tre candidati senior in favore di competitor che comunicano obiettivi di Net Zero con dati verificabili. Il nostro employer branding ESG è percepito come generico. I neolaureati STEM chiedono di vedere metriche reali prima di accettare un\u2019offerta.":
      s6.note,

    // ── Slide 6 (needs) ──
    // (shape id=13 title font is reduced via reduceSlide6TitleFont)
    // (shape id=15 list is replaced via replaceSlide6NeedsList)
    // The title text is replaced via find-replace on the demo text:
    "Nat 1 mostra le principali esigenze a supporto degli obiettivi di business nelle aree Registro delle modifiche e audit trail per ogni dato ESG e Scenari previsionali che mostrino traiettorie, gap e impatto degli investimenti ESG":
      slide6Title,
  };

  // ── Slide 5 icon remapping ──────────────────────────────────────────────────
  // Slide5 has 6 icon pictures in fixed slots. The template demo order is:
  //   slot1=compliance (rId7, id=68), slot2=credito (rId8, id=69),
  //   slot3=clienti    (rId9, id=70), slot4=efficienza (rId4, id=60),
  //   slot5=supply     (rId5, id=61), slot6=reputazione (rId6, id=66)
  //
  // Priority key → original rId that carries its icon (slide5 rels):
  const PRIO_KEY_TO_RID: Record<string, string> = {
    "Compliance e reporting":               "rId7",
    "Accesso al credito":                   "rId8",
    "Clienti e gare":                       "rId9",
    "Efficienza, energia e costi":          "rId4",
    "Resilienza della supply chain":        "rId5",
    "Reputazione e attrazione dei talenti": "rId6",
    // EN keys
    "Compliance and reporting":          "rId7",
    "Access to finance":                 "rId8",
    "Customers and tenders":             "rId9",
    "Efficiency, energy and cost":       "rId4",
    "Supply-chain resilience":           "rId5",
    "Reputation and talent attraction":  "rId6",
  };

  // Slot pic ids in template order (slot1..slot6):
  //   slot1=id68(rId7/compliance) slot2=id69(rId8/credito) slot3=id70(rId9/clienti)
  //   slot4=id60(rId4/efficienza) slot5=id61(rId5/supply)  slot6=id66(rId6/reputazione)
  const SLOT_PIC_IDS = [68, 69, 70, 60, 61, 66];

  function remapSlide5Icons(xml: string): string {
    const desiredRIds: string[] = [];
    for (let rank = 1; rank <= 6; rank++) {
      const item = prioAtRank(data.prioItems, rank);
      const rId = item ? (PRIO_KEY_TO_RID[item.name] ?? null) : null;
      desiredRIds.push(rId ?? "");
    }

    // Original rId for each slot (same order as SLOT_PIC_IDS)
    const SLOT_ORIGINAL_RIDS = ["rId7", "rId8", "rId9", "rId4", "rId5", "rId6"];

    SLOT_PIC_IDS.forEach((picId, slotIdx) => {
      const desired = desiredRIds[slotIdx];
      if (!desired) return;
      const original = SLOT_ORIGINAL_RIDS[slotIdx];
      if (desired === original) return;

      const pattern = new RegExp(
        `(<p:pic>(?:(?!<p:pic>)[\\s\\S])*?<p:cNvPr[^>]*\\bid="${picId}"[\\s\\S]*?r:embed=")([^"]+)(")`
      );
      xml = xml.replace(pattern, `$1${desired}$3`);
    });

    return xml;
  }

  // ── Generate matrix PNG for slide 4 ───────────────────────────────────────
  const matrixPng = generateMatrixPng(data.critItems, isIt);

  // ── Generate company slide PNG ──────────────────────────────────────────────
  const companySlidePng = await generateCompanySlidePng(data, isIt);

  // Fetch the new template (cache-bust to avoid stale file)
  const res = await fetch(`./Envizi-Report-template.pptx?v=${Date.now()}`);
  if (!res.ok) throw new Error(`Template fetch failed: ${res.status} ${res.statusText}`);
  const buf = await res.arrayBuffer();
  const zip = await JSZip.loadAsync(buf);

  // ── Save matrix PNG to media (used in slide6) ────────────────────────────────
  if (matrixPng) {
    const mB64 = matrixPng.split(",")[1];
    const mBytes = Uint8Array.from(atob(mB64), c => c.charCodeAt(0));
    zip.file("ppt/media/matrix_slide4.png", mBytes);

    // Ensure png content type is registered (may already be done by map)
    const ctFileM = zip.file("[Content_Types].xml");
    if (ctFileM) {
      let ctXmlM = await ctFileM.async("string");
      if (!ctXmlM.includes('Extension="png"')) {
        ctXmlM = ctXmlM.replace("</Types>", `<Default Extension="png" ContentType="image/png"/></Types>`);
        zip.file("[Content_Types].xml", ctXmlM);
      }
    }
    // The rId registration and picture rId update for slide6 are done in the slide loop below.
  }

  // ── Inject company logo into PPTX ──────────────────────────────────────────
  // If a logo is provided, add it as an image to the media folder and replace
  // the logo placeholder shape in each slide with an actual <p:pic> element.
  const companyLogo = (data as any).companyLogo as string | undefined;
  if (companyLogo) {
    // Convert data URL to binary and detect extension
    const [header, b64] = companyLogo.split(",");
    const mimeMatch = header.match(/data:image\/([a-zA-Z+]+);/);
    const ext = mimeMatch ? mimeMatch[1].replace("jpeg", "jpg").replace("svg+xml", "svg") : "png";
    const logoMediaPath = `ppt/media/logo_company.${ext}`;
    const logoBytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    zip.file(logoMediaPath, logoBytes);

    // Register content type for the logo image
    const ctFile = zip.file("[Content_Types].xml");
    if (ctFile) {
      let ctXml = await ctFile.async("string");
      const mime = ext === "jpg" ? "jpeg" : ext;
      const ctEntry = `<Default Extension="${ext}" ContentType="image/${mime}"/>`;
      if (!ctXml.includes(`Extension="${ext}"`)) {
        ctXml = ctXml.replace("</Types>", `${ctEntry}</Types>`);
        zip.file("[Content_Types].xml", ctXml);
      }
    }

    // Add relationship to each slide's .rels file and replace logo placeholder shape.
    // The new template has logo_placeholder shape (id=99) in slide1, and
    // logo_company pictures (already embedded) in slides 5 and 6 — update their rId.
    // Slides 2,3,4 don't have a logo placeholder in the new template.
    for (const i of [1, 2, 5, 6]) {
      const relsPath = `ppt/slides/_rels/slide${i}.xml.rels`;
      const relsFile = zip.file(relsPath);
      if (!relsFile) continue;
      let relsXml = await relsFile.async("string");

      // Add new relationship for logo
      const logoRid = "rId99";
      if (!relsXml.includes(logoRid)) {
        relsXml = relsXml.replace(
          "</Relationships>",
          `<Relationship Id="${logoRid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/logo_company.${ext}"/></Relationships>`
        );
        zip.file(relsPath, relsXml);
      }

      const slideFile = zip.file(`ppt/slides/slide${i}.xml`);
      if (!slideFile) continue;
      let slideXml = await slideFile.async("string");

      if (i === 1) {
        // Slide1: the template already has a logo picture (id=109, rId4).
        // Point its r:embed to the company logo and remove the empty logo_placeholder
        // shape (id=99) to avoid having two overlapping logo elements.
        slideXml = slideXml.replace(
          /(<p:pic>(?:(?!<p:pic>)[\s\S])*?<p:cNvPr[^>]*\bid="109"[^>]*>[\s\S]*?r:embed=")([^"]+)(")/,
          `$1${logoRid}$3`
        );
        slideXml = slideXml.replace(
          /<p:sp>(?:(?!<p:sp>)[\s\S])*?<p:cNvPr[^>]*\bid="99"[^>]*>[\s\S]*?<\/p:sp>/,
          ""
        );
        zip.file(`ppt/slides/slide${i}.xml`, slideXml);
      } else {
        // Slides 2,5,6: replace existing logo_company picture's rId with the new one
        // The picture is named "logo_company" in the template
        slideXml = slideXml.replace(
          /(<p:pic>(?:(?!<p:pic>)[\s\S])*?<p:cNvPr[^>]*\bname="logo_company"[^>]*>[\s\S]*?r:embed=")([^"]+)(")/,
          `$1${logoRid}$3`
        );
        zip.file(`ppt/slides/slide${i}.xml`, slideXml);
      }
    }
  }

  // Process each slide XML — new template has 7 slides:
  //   slide1=cover, slide2=company profile, slide3=geo table (static),
  //   slide4=frameworks (title has company name), slide5=priorities, slide6=needs list,
  //   slide7=next steps (static)
  // We process slides 1, 2, 3, 4, 5, 6 (the dynamic ones).
  for (const i of [1, 2, 3, 4, 5, 6]) {
    const path = `ppt/slides/slide${i}.xml`;
    const file = zip.file(path);
    if (!file) continue;
    let xmlStr = await file.async("string");

    // Slide 2: fix readiness label font size (id=23 has sz=2850 in template, align to sz=2025)
    if (i === 2) {
      xmlStr = fixSlide2ReadinessFont(xmlStr);
    }

    // Slide 3: replace company name in subtitle (id=3) directly to avoid substring collision
    // with the "54" stat-card placeholder which gets substituted first by replaceInSlideXml.
    if (i === 3) {
      const slide3Subtitle = isIt
        ? `Evidenza raccolta sulle ${totalSedi} sedi di ${resolvedCompanyName}`
        : `Evidence collected across ${totalSedi} sites of ${resolvedCompanyName}`;
      xmlStr = xmlStr.replace(
        /(<p:sp>(?:(?!<p:sp>)[\s\S])*?<p:cNvPr[^>]*\bid="3"[^>]*>[\s\S]*?)<p:txBody>[\s\S]*?<\/p:txBody>(<\/p:sp>)/,
        (_, pre, post) => {
          const rPr = `<a:rPr sz="1200" b="0"><a:solidFill><a:srgbClr val="4D6D67"/></a:solidFill><a:latin typeface="Calibri"/><a:ea typeface="Calibri"/><a:cs typeface="Calibri"/></a:rPr>`;
          const newTxBody = `<p:txBody><a:bodyPr><a:normAutofit/></a:bodyPr><a:lstStyle/><a:p><a:r>${rPr}<a:t>${escapeXml(slide3Subtitle)}</a:t></a:r></a:p></p:txBody>`;
          return `${pre}${newTxBody}${post}`;
        }
      );
    }

    // Slide 5: remap priority icons to match user priority order
    if (i === 5) {
      xmlStr = remapSlide5Icons(xmlStr);
    }

    // Slide 6: reduce title font, run text replacements, then write the needs list last
    // so replaceInSlideXml cannot corrupt the already-built paragraph structure.
    if (i === 6) {
      xmlStr = reduceSlide6TitleFont(xmlStr);
      // Update the matrix picture rId to point to the newly generated matrix PNG
      if (matrixPng) {
        const matrixRid = "rId97";
        // Add relationship for matrix to slide6
        const s6RelsPath = "ppt/slides/_rels/slide6.xml.rels";
        const s6RelsFile = zip.file(s6RelsPath);
        if (s6RelsFile) {
          let relsXml = await s6RelsFile.async("string");
          if (!relsXml.includes(matrixRid)) {
            relsXml = relsXml.replace(
              "</Relationships>",
              `<Relationship Id="${matrixRid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/matrix_slide4.png"/></Relationships>`
            );
            zip.file(s6RelsPath, relsXml);
          }
        }
        // Replace the existing matrix picture rId (rId4 in template) with rId97
        xmlStr = xmlStr.replace(
          /(<p:pic>(?:(?!<p:pic>)[\s\S])*?<p:cNvPr[^>]*\bname="matrix_slide4"[^>]*>[\s\S]*?r:embed=")([^"]+)(")/,
          `$1${matrixRid}$3`
        );
      }
    }

    // Run generic text replacements before needs list so the list paragraphs are written last
    // and cannot be corrupted by replaceInSlideXml's txBody-level pass.
    const updated = replaceInSlideXml(xmlStr, replacements);

    // Slide 6: write needs list after replaceInSlideXml to preserve paragraph structure
    const final = i === 6 ? replaceSlide6NeedsList(updated, data.critItems, isIt) : updated;
    zip.file(path, final);
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

// Variante che restituisce il buffer invece di scaricarlo
export async function generateTemplatePptxBuffer(data: SummaryPptxData): Promise<ArrayBuffer> {
  // Esegui la stessa logica ma cattura il buffer prima del download
  // Usiamo un trick: monkey-patch temporaneo di document.createElement per intercettare il click
  let capturedBuffer: ArrayBuffer | null = null;
  const origClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function(this: HTMLAnchorElement) {
    // intercetta: leggi il blob dal href
    const url = this.href;
    if (url.startsWith("blob:")) {
      fetch(url).then(r => r.arrayBuffer()).then(buf => { capturedBuffer = buf; });
    }
    // NON chiamare origClick — non scaricare
  };
  await generateTemplatePptx(data);
  HTMLAnchorElement.prototype.click = origClick;
  // Attendi che il fetch del blob completi
  for (let i = 0; i < 50 && !capturedBuffer; i++) {
    await new Promise(r => setTimeout(r, 100));
  }
  if (!capturedBuffer) throw new Error("Buffer non catturato");
  return capturedBuffer;
}
