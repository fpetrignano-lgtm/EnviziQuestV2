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
  companyName: string
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

      // Draw pins for other active geos
      for (const key of geoKeys.filter(k => k !== "italia")) {
        const count = geoDistrib[key] ?? 0;
        if (count <= 0) continue;
        const [px, py] = GEO_PIN_PCT[key];
        const x = px / 100 * W;
        const y = py / 100 * H;
        const label = key === "europa" ? "EUROPA"
          : key === "nordamerica" ? "N. AMERICA"
          : key === "sudamerica" ? "S. AMERICA"
          : key.toUpperCase();
        drawOfficePin(ctx, x, y, `${label} · ${count}%`);
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

// ── Slide 4 title font reducer ────────────────────────────────────────────────
// Reduces the font size of shape id=13 (title bar) from 27pt to 16pt.
function reduceSlide4TitleFont(xml: string): string {
  // Target: inside the sp with id=13, change all sz="2700" to sz="1600"
  return xml.replace(
    /(<p:sp>(?:(?!<p:sp>)[\s\S])*?<p:cNvPr[^>]*\bid="13"[^>]*>[\s\S]*?<\/p:sp>)/,
    (spBlock) => spBlock.replace(/\bsz="2700"/g, `sz="1600"`)
  );
}

// ── Slide 4 needs list replacement ───────────────────────────────────────────
// Replaces the txBody of shape id=15 (left column) with a numbered list.
// Items sorted by R+C descending, top 10. Format: "N. label (R:x C:y)"
function replaceSlide4NeedsList(
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

// ── Slide 2 body replacement ──────────────────────────────────────────────────
// Replaces the entire txBody of shape id=2 in slide 2 with structured paragraphs.
// Each data line becomes its own <a:p>. Empty lines become empty paragraphs.
// Uses the same rPr styling as the original template (Calibri 16pt #477268).
function replaceSlide2Body(xml: string, lines: string[]): string {
  // The base rPr for all runs — matching the template style
  const RPR = `<a:rPr lang="it-IT" sz="1600" dirty="0"><a:solidFill><a:srgbClr val="477268"/></a:solidFill><a:latin typeface="Calibri"/><a:cs typeface="Calibri"/></a:rPr>`;
  const PPR = `<a:pPr><a:defRPr sz="1125" b="0"><a:solidFill><a:srgbClr val="477268"/></a:solidFill></a:defRPr></a:pPr>`;

  const paras = lines.map(line => {
    if (line === "") {
      // empty paragraph — use endParaRPr
      return `<a:p>${PPR}<a:endParaRPr lang="it-IT" sz="1600" dirty="0"><a:solidFill><a:srgbClr val="477268"/></a:solidFill><a:latin typeface="Calibri"/><a:cs typeface="Calibri"/></a:endParaRPr></a:p>`;
    }
    return `<a:p>${PPR}<a:r>${RPR}<a:t>${escapeXml(line)}</a:t></a:r></a:p>`;
  }).join("");

  const BODY_PR = `<a:bodyPr/>`;
  const LST_STYLE = `<a:lstStyle/>`;
  const newTxBody = `<p:txBody>${BODY_PR}${LST_STYLE}${paras}</p:txBody>`;

  // Replace the txBody inside the sp with id=2
  return xml.replace(
    /(<p:sp>(?:(?!<p:sp>)[\s\S])*?<p:cNvPr[^>]*\bid="2"[^>]*>[\s\S]*?)<p:txBody>[\s\S]*?<\/p:txBody>(<\/p:sp>)/,
    `$1${newTxBody}$2`
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export async function generateTemplatePptx(data: SummaryPptxData): Promise<void> {
  const isIt = data.isIt;

  // Geo distribution text
  const geo = (data as any).geoDistrib as Record<string, number> | undefined;
  const geoItalia      = geo?.italia      ?? 0;
  const geoEuropa      = geo?.europa      ?? 0;
  const geoAsia        = geo?.asia        ?? 0;
  const geoNordAmerica = geo?.nordamerica ?? 0;
  const geoAfrica      = geo?.africa      ?? 0;
  const geoDistribText = `Italia ${geoItalia} · Europa ${geoEuropa} · N. America ${geoNordAmerica} · Asia ${geoAsia} · Africa ${geoAfrica}`;

  // Workshop date / consultant
  const wDate       = (data as any).workshopDate as string | undefined;
  const wConsultant = (data as any).consultantName as string | undefined;
  const dateStr     = wDate
    ? new Date(wDate).toLocaleDateString(isIt ? "it-IT" : "en-GB", { day: "2-digit", month: "long", year: "numeric" })
    : isIt ? "data da definire" : "date TBD";
  const consultantStr = wConsultant || "IBM Envizi Team";

  // CSRD status text
  const isCsrdIn   = data.csrdLabel.startsWith("Soggett") || data.csrdLabel.startsWith("Subject");
  const csrdStatus = isCsrdIn
    ? (isIt ? "Indicativamente DENTRO il perimetro CSRD" : "Indicatively WITHIN the CSRD scope")
    : (isIt ? "Indicativamente FUORI dal perimetro CSRD" : "Indicatively OUTSIDE the CSRD scope");

  // Slide 2 body — one entry per paragraph, matching the template's 16-paragraph structure.
  // Empty strings produce empty <a:p> spacer paragraphs.
  const dc = (data as any).dataCenters as number | undefined ?? 0;
  const totalSedi = data.plants + data.offices + dc;
  const year = new Date().getFullYear();

  // Build geo line only with non-zero values
  const geoEntries: string[] = [];
  if ((geo?.italia ?? 0) > 0)      geoEntries.push(`Italia ${geo!.italia}%`);
  if ((geo?.europa ?? 0) > 0)      geoEntries.push(`Europa ${geo!.europa}%`);
  if ((geo?.nordamerica ?? 0) > 0) geoEntries.push(`N. America ${geo!.nordamerica}%`);
  if ((geo?.asia ?? 0) > 0)        geoEntries.push(`Asia ${geo!.asia}%`);
  if ((geo?.africa ?? 0) > 0)      geoEntries.push(`Africa ${geo!.africa}%`);
  const geoLine = geoEntries.length > 0 ? geoEntries.join(" · ") : "";

  // Line 1: company intro
  const line1 = isIt
    ? `${data.companyName} è un ${data.sectorLabel} presente a livello ${data.marketLabel}.`
    : `${data.companyName} is a ${data.sectorLabel} operating at ${data.marketLabel} level.`;

  // Line 3: revenue
  const line3 = isIt
    ? `Nell'anno ${year} ha registrato ${data.revenue} ${data.dimUnit}.`
    : `In ${year} it recorded ${data.revenue} ${data.dimUnit}.`;

  // Line 5: employees
  const line5 = isIt
    ? `L'organizzazione occupa ${data.employees.toLocaleString()} dipendenti.`
    : `The organisation employs ${data.employees.toLocaleString()} people.`;

  // Line 7: CSRD
  const line7 = `${csrdStatus}.`;

  // Lines 10-14: sites breakdown (maps to template paragraphs 10–14)
  const line10 = isIt ? `${totalSedi} sedi totali` : `${totalSedi} total sites`;
  const line11 = isIt ? "di cui:" : "of which:";
  const line12 = isIt
    ? `${data.offices} ${data.offices === 1 ? "ufficio" : "uffici"}`
    : `${data.offices} ${data.offices === 1 ? "office" : "offices"}`;
  const line13 = isIt
    ? `${data.plants} ${data.plants === 1 ? "sede operativa" : "sedi operative"}`
      + (dc > 0 ? ` · ${dc} data center` : "")
    : `${data.plants} ${data.plants === 1 ? "operational site" : "operational sites"}`
      + (dc > 0 ? ` · ${dc} data centre${dc > 1 ? "s" : ""}` : "");
  const line14 = data.csrdNote ? (isIt ? `Note: ${data.csrdNote}` : `Note: ${data.csrdNote}`) : "";

  // Line 16: geo distribution
  const line16 = geoLine;

  // Build array: indices match the 16 template paragraphs (0-based)
  // para[0]=line1, para[1]=empty, para[2]=line3, para[3]=empty, para[4]=line5,
  // para[5]=empty, para[6]=line7, para[7]=empty, para[8]=empty,
  // para[9]=line10, para[10]=line11, para[11]=line12, para[12]=line13,
  // para[13]=line14, para[14]=empty, para[15]=line16
  const slide2Lines: string[] = [
    line1, "", line3, "", line5, "", line7, "", "",
    line10, line11, line12, line13, line14, "", line16,
  ];

  // Maturity text for slide 2
  const maturityText = `${data.maturityTitle} — ${data.maturityDesc}`;

  // Slide 3: fill each of the 6 fixed cells (in template order: customers=1, compliance=2,
  // credit=3, efficiency=4, supply=5, reputation=6) with the user's priority at that rank.
  const slot = (rank: number) => {
    const item = prioAtRank(data.prioItems, rank);
    return {
      header: item ? `${rank}/6  ${item.name}` : `–`,
      note:   item ? (item.note || "") : "",
    };
  };
  const s1 = slot(1); const s2 = slot(2); const s3 = slot(3);
  const s4 = slot(4); const s5 = slot(5); const s6 = slot(6);

  // Slide 3 intro sentence
  const top1 = prioAtRank(data.prioItems, 1);
  const top2 = prioAtRank(data.prioItems, 2);
  const slide3Intro = isIt
    ? `La priorità principale di ${data.companyName} è ${top1?.name ?? "–"}`
      + (top2 ? ` seguita da ${top2.name}` : "")
      + `, evidenziando il valore di ESG per il business.`
    : `The main priority of ${data.companyName} is ${top1?.name ?? "–"}`
      + (top2 ? ` followed by ${top2.name}` : "")
      + `, highlighting the value of ESG for the business.`;

  // Slide 4 title — use top-2 needs (sorted by R+C desc, same order as list)
  const sortedForTitle = [...data.critItems]
    .sort((a, b) => (b.rel + b.crit) - (a.rel + a.crit));
  const cleanLabel = (s: string) => s.replace(/\)+\s*$/, "").trimEnd();
  const titleNeed1 = cleanLabel(sortedForTitle[0]?.label ?? "");
  const titleNeed2 = cleanLabel(sortedForTitle[1]?.label ?? "");
  const titleAreas = titleNeed2
    ? (isIt ? `${titleNeed1} e ${titleNeed2}` : `${titleNeed1} and ${titleNeed2}`)
    : titleNeed1;
  const slide4Title = isIt
    ? `${data.companyName} mostra le principali esigenze a supporto degli obiettivi di business nelle aree ${titleAreas}`
    : `${data.companyName} shows the main data needs supporting business objectives in the areas of ${titleAreas}`;


  const replacements: Record<string, string> = {
    // ── Slide 1 ──
    "Il percorso ESG  di Erica":
      isIt ? `Il percorso ESG di ${data.companyName}` : `The ESG journey of ${data.companyName}`,
    "Sintesi workshop Envizi Quest data da definire WorkshopIBM Envizi Team IBM Envizi":
      `${isIt ? "Sintesi workshop Envizi Quest" : "Envizi Quest workshop summary"}\n${dateStr}\n${consultantStr}\nIBM Envizi`,
    "Incontro di lavoro · 2026":
      `${isIt ? "Incontro di lavoro" : "Working session"} · ${new Date().getFullYear()}`,

    // ── Slide 2 ──
    // (shape id=2 body is handled separately via replaceSlide2Body — see below)
    "(Nome Azienda) ha avviato il percorso ESG ":
      isIt ? `${data.companyName} ha avviato il percorso ESG` : `${data.companyName} has started the ESG journey`,
    "(qui inserisci frase e commenti su livello maturità esg)": maturityText,
    "(qui inserisci Immagine mondo o italia o europa cona la distribuzione sedi come Nella visualizzazione in applicazione)": geoDistribText,

    // ── Slide 3 ──
    "La priorità di principale di (Nome Azienda) è (nome obiettivo priorità 1) seguita da (nome obiettivo priorità 2) evidenziando il valore di ESG per il business.":
      slide3Intro,
    // Header cells — positional: template cell order = customers(1), compliance(2), credit(3), efficiency(4), supply(5), reputation(6)
    "N/6  Clienti e gare":                   s1.header,
    "N/6  Compliance e reporting":            s2.header,
    "N/6  Accesso al credito":                s3.header,
    "N/6  Efficienza, energia e costi":       s4.header,
    "N/6  Resilienza della supply chain":     s5.header,
    "N/6  Reputazione e attrazione talenti":  s6.header,
    // Note cells — same positional mapping
    "(qui le note dell\u2019obiettivo clienti e gare con questo font, se il testo supera questo blocco tagliare, non mostrare riquadro tratteggio) ":
      s1.note,
    "(qui le note dell\u2019obiettivo compliance e reporting  con questo font, se il testo supera questo blocco tagliare, non mostrare riquadro tratteggio) ":
      s2.note,
    "(qui le note dell\u2019obiettivo accesso al credito con questo font, se il testo supera questo blocco tagliare, non mostrare riquadro tratteggio) ":
      s3.note,
    "(qui le note dell\u2019obiettivo efficienza energia con questo font, se il testo supera questo blocco tagliare, non mostrare riquadro tratteggio) ":
      s4.note,
    "(qui le note dell\u2019obiettivo supply chain con questo font, se il testo supera questo blocco tagliare, non mostrare riquadro tratteggio) ":
      s5.note,
    "(qui le note dell\u2019obiettivo reputazione e talenti, se il testo supera questo blocco tagliare, non mostrare riquadro tratteggio) ":
      s6.note,

    // ── Slide 4 ──
    // (shape id=13 title font is reduced via reduceSlide4TitleFont)
    // (shape id=15 list is replaced via replaceSlide4NeedsList)
    "(nome azienda)  mostra le principali esigenze a supporto degli obiettivi di business nelle aree (inserire prima esigenza) ":
      slide4Title,

    // ── Common (logo / ignored placeholders) ──
    "(qui il logo di nome azienda se caricato) ": "",
    "(qui il logo di nome azienda se caricato)":  "",
  };

  // ── Slide 3 icon remapping ──────────────────────────────────────────────────
  // The template has 6 icon pictures fixed in 6 slots (reading order: slot1..6).
  // Each slot has a fixed rId pointing to the icon for the original priority order.
  // When the user reorders priorities we must remap rId values so each slot shows
  // the icon matching the priority now in that position.
  //
  // Slot → original priority key (template order):
  //   slot1=customers  slot2=credit  slot3=compliance
  //   slot4=efficiency slot5=reputation slot6=supply
  //
  // Icon pic ids (sorted by y then x = reading order):
  //   slot1=id33(rId7) slot2=id35(rId8) slot3=id37(rId9)
  //   slot4=id31(rId4) slot5=id24(rId5) slot6=id29(rId6)
  //
  // Priority key → original rId that carries its icon:
  const PRIO_KEY_TO_RID: Record<string, string> = {
    "Clienti e gare":                    "rId7",
    "Compliance e reporting":            "rId9",
    "Accesso al credito":                "rId8",
    "Efficienza, energia e costi":       "rId4",
    "Resilienza della supply chain":     "rId6",
    "Reputazione e attrazione dei talenti": "rId5",
    // EN keys
    "Customers and tenders":             "rId7",
    "Compliance and reporting":          "rId9",
    "Access to finance":                 "rId8",
    "Efficiency, energy and cost":       "rId4",
    "Supply-chain resilience":           "rId6",
    "Reputation and talent attraction":  "rId5",
  };

  // Slot pic ids in reading order left→center→right, top→bottom:
  //   slot1(top-left  x=26 ): id=33 rId7 → Clienti e gare
  //   slot2(top-center x=446): id=37 rId9 → Compliance
  //   slot3(top-right x=890): id=35 rId8 → Accesso al credito
  //   slot4(bot-left  x=13 ): id=31 rId4 → Efficienza
  //   slot5(bot-center x=452): id=29 rId6 → Supply chain
  //   slot6(bot-right x=883): id=24 rId5 → Reputazione
  const SLOT_PIC_IDS = [33, 37, 35, 31, 29, 24];

  function remapSlide3Icons(xml: string): string {
    const desiredRIds: string[] = [];
    for (let rank = 1; rank <= 6; rank++) {
      const item = prioAtRank(data.prioItems, rank);
      const rId = item ? (PRIO_KEY_TO_RID[item.name] ?? null) : null;
      desiredRIds.push(rId ?? "");
    }

    // Original rId for each slot (same reading order as SLOT_PIC_IDS)
    const SLOT_ORIGINAL_RIDS = ["rId7", "rId9", "rId8", "rId4", "rId6", "rId5"];

    // For each slot, replace the r:embed of its pic shape
    SLOT_PIC_IDS.forEach((picId, slotIdx) => {
      const desired = desiredRIds[slotIdx];
      if (!desired) return; // no priority at this rank, leave as-is
      const original = SLOT_ORIGINAL_RIDS[slotIdx];
      if (desired === original) return; // already correct

      // Replace r:embed inside this specific pic shape
      const pattern = new RegExp(
        `(<p:pic>(?:(?!<p:pic>)[\\s\\S])*?<p:cNvPr[^>]*\\bid="${picId}"[\\s\\S]*?r:embed=")([^"]+)(")`
      );
      xml = xml.replace(pattern, `$1${desired}$3`);
    });

    return xml;
  }

  // ── Generate matrix PNG for slide 4 ───────────────────────────────────────
  const matrixPng = generateMatrixPng(data.critItems, isIt);

  // ── Generate map PNG ───────────────────────────────────────────────────────
  const market = (() => {
    if (data.marketLabel === "Solo Italia" || data.marketLabel === "Italy only") return "italia";
    if (data.marketLabel === "Europa" || data.marketLabel === "Europe") return "europa";
    return "mondo";
  })();
  const dc2 = (data as any).dataCenters as number | undefined ?? 0;
  const totalSitesForMap = data.plants + data.offices + dc2;
  const geoDistribForMap = (data as any).geoDistrib as GeoDistrib | undefined ?? {};
  const mapPng = await generateMapPng(market, geoDistribForMap, totalSitesForMap, data.companyName);

  // Fetch the new template (cache-bust to avoid stale file)
  const res = await fetch(`./Envizi-Report-template.pptx?v=${Date.now()}`);
  if (!res.ok) throw new Error(`Template fetch failed: ${res.status} ${res.statusText}`);
  const buf = await res.arrayBuffer();
  const zip = await JSZip.loadAsync(buf);

  // ── Inject map into slide 2 ────────────────────────────────────────────────
  if (mapPng) {
    const mapB64 = mapPng.split(",")[1];
    const mapBytes = Uint8Array.from(atob(mapB64), c => c.charCodeAt(0));
    zip.file("ppt/media/map_slide2.png", mapBytes);

    // Register content type if not already present
    const ctFile2 = zip.file("[Content_Types].xml");
    if (ctFile2) {
      let ctXml2 = await ctFile2.async("string");
      if (!ctXml2.includes('Extension="png"')) {
        ctXml2 = ctXml2.replace("</Types>", `<Default Extension="png" ContentType="image/png"/></Types>`);
        zip.file("[Content_Types].xml", ctXml2);
      }
    }

    // Add relationship to slide 2
    const mapRid = "rId98";
    const s2RelsPath = "ppt/slides/_rels/slide2.xml.rels";
    const s2RelsFile = zip.file(s2RelsPath);
    if (s2RelsFile) {
      let relsXml = await s2RelsFile.async("string");
      if (!relsXml.includes(mapRid)) {
        relsXml = relsXml.replace(
          "</Relationships>",
          `<Relationship Id="${mapRid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/map_slide2.png"/></Relationships>`
        );
        zip.file(s2RelsPath, relsXml);
      }
    }

    // Replace the map placeholder shape (id=5) in slide 2 with a <p:pic>
    const s2File = zip.file("ppt/slides/slide2.xml");
    if (s2File) {
      let s2Xml = await s2File.async("string");
      // id=5 is the map placeholder: x=867*9144, y=455*9144, w=419*9144, h=106*9144
      // Use wider/taller bounds to show the map properly — keep same x,y but expand h
      const MAP_X  = 7927848;   // 867pt
      const MAP_Y  = 4160520;   // 455pt
      const MAP_CX = 3831336;   // 419pt
      const MAP_CY = 2743200;   // 300pt (taller than original 106pt for better map display)
      const mapPicXml = `<p:pic><p:nvPicPr><p:cNvPr id="998" name="map_slide2"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="${mapRid}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x="${MAP_X}" y="${MAP_Y}"/><a:ext cx="${MAP_CX}" cy="${MAP_CY}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>`;
      // Remove old placeholder shape id=5
      s2Xml = s2Xml.replace(
        /<p:sp>(?:(?!<p:sp>)[\s\S])*?<p:cNvPr[^>]*\bid="5"[^>]*>[\s\S]*?<\/p:sp>/,
        mapPicXml
      );
      zip.file("ppt/slides/slide2.xml", s2Xml);
    }
  }

  // ── Inject matrix PNG into slide 4 ────────────────────────────────────────
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

    // Add relationship to slide 4
    const matrixRid = "rId97";
    const s4RelsPath = "ppt/slides/_rels/slide4.xml.rels";
    const s4RelsFile = zip.file(s4RelsPath);
    if (s4RelsFile) {
      let relsXml = await s4RelsFile.async("string");
      if (!relsXml.includes(matrixRid)) {
        relsXml = relsXml.replace(
          "</Relationships>",
          `<Relationship Id="${matrixRid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/matrix_slide4.png"/></Relationships>`
        );
        zip.file(s4RelsPath, relsXml);
      }
    }
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

    // Add relationship to each slide's .rels file and replace logo placeholder shape
    for (let i = 1; i <= 4; i++) {
      const relsPath = `ppt/slides/_rels/slide${i}.xml.rels`;
      const relsFile = zip.file(relsPath);
      if (!relsFile) continue;
      let relsXml = await relsFile.async("string");

      // Add new relationship for logo
      const logoRid = "rId99";
      const contentType = `image/${ext === "jpg" ? "jpeg" : ext}`;
      if (!relsXml.includes(logoRid)) {
        relsXml = relsXml.replace(
          "</Relationships>",
          `<Relationship Id="${logoRid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/logo_company.${ext}"/></Relationships>`
        );
        zip.file(relsPath, relsXml);
      }

      // Replace the logo placeholder shape with a <p:pic>
      // The placeholder shape has text "(qui il logo di nome azienda se caricato)"
      // We replace the entire <p:sp> with a <p:pic> at the same position
      const slideFile = zip.file(`ppt/slides/slide${i}.xml`);
      if (!slideFile) continue;
      let slideXml = await slideFile.async("string");

      // Find the logo sp and extract its position
      const logoSpMatch = slideXml.match(
        /<p:sp>(?:(?!<p:sp>)[\s\S])*?qui il logo di nome azienda[\s\S]*?<\/p:sp>/
      );
      if (logoSpMatch) {
        const spXml = logoSpMatch[0];
        const offM = spXml.match(/<a:off x="(\d+)" y="(\d+)"/);
        const extM = spXml.match(/<a:ext cx="(\d+)" cy="(\d+)"/);
        if (offM && extM) {
          const lx = offM[1];
          const ly = offM[2];
          const lcx = extM[1];
          const lcy = extM[2];
          const picXml = `<p:pic><p:nvPicPr><p:cNvPr id="999" name="logo_company"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="${logoRid}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x="${lx}" y="${ly}"/><a:ext cx="${lcx}" cy="${lcy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>`;
          slideXml = slideXml.replace(logoSpMatch[0], picXml);
          zip.file(`ppt/slides/slide${i}.xml`, slideXml);
        }
      }
    }
  }

  // Process each slide XML
  for (let i = 1; i <= 4; i++) {
    const path = `ppt/slides/slide${i}.xml`;
    const file = zip.file(path);
    if (!file) continue;
    let xmlStr = await file.async("string");
    // Slide 2: replace shape id=2 body directly (per-paragraph, bypasses pass-1 join)
    if (i === 2) {
      xmlStr = replaceSlide2Body(xmlStr, slide2Lines);
    }
    // Slide 4: reduce title font + replace left-column needs list + inject matrix PNG
    if (i === 4) {
      xmlStr = reduceSlide4TitleFont(xmlStr);
      xmlStr = replaceSlide4NeedsList(xmlStr, data.critItems, isIt);
      // Remove all old matrix-area shapes (id=16,17,18,19,20,21,22,24,27,29,30,31,32,33,35,36)
      xmlStr = removeShapesById(xmlStr, [16, 17, 18, 19, 20, 21, 22, 24, 27, 29, 30, 31, 32, 33, 36]);
      // Also remove the connector (id=35) — it's a <p:cxnSp>, handle separately
      xmlStr = xmlStr.replace(/<p:cxnSp>(?:(?!<p:cxnSp>)[\s\S])*?<p:cNvPr[^>]*\bid="35"[^>]*>[\s\S]*?<\/p:cxnSp>/, "");
      // Inject matrix PNG if generated
      if (matrixPng) {
        const matrixRid = "rId97";
        // Position = shape id=16 bounding box: x=4274289, y=1499190, cx=7176976, cy=4742121
        const MX = 4274289, MY = 1499190, MCX = 7176976, MCY = 4742121;
        const picXml = `<p:pic><p:nvPicPr><p:cNvPr id="997" name="matrix_slide4"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="${matrixRid}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x="${MX}" y="${MY}"/><a:ext cx="${MCX}" cy="${MCY}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>`;
        // Insert the pic before </p:spTree>
        xmlStr = xmlStr.replace("</p:spTree>", picXml + "</p:spTree>");
      }
    }
    // Slide 3: remove empty overlay rectangles + remap icons to match user priority order
    if (i === 3) {
      xmlStr = removeShapesById(xmlStr, [11, 13, 18, 20, 21, 22, 26, 38, 41, 43, 45, 47, 49]);
      xmlStr = remapSlide3Icons(xmlStr);
    }
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
