/**
 * Generates KO/EN resume PDFs from the same public/assets/*.json content the
 * site uses, so the "Resume PDF" links always match the live portfolio.
 *
 * Run:  npm run pdf
 *
 * Requires Playwright (with a Chromium build) available on the machine. This is
 * intentionally kept out of the normal `npm run build` so the site build has no
 * browser dependency; regenerate the PDFs whenever the content changes and
 * commit the resulting files under public/.
 */
const fs = require("node:fs");
const path = require("node:path");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  try {
    ({ chromium } = require("/opt/node22/lib/node_modules/playwright"));
  } catch {
    console.error(
      "Playwright not found. Install it (npm i -D playwright) or run where a global playwright is available."
    );
    process.exit(1);
  }
}

const ASSETS = path.resolve(__dirname, "../public/assets");
const OUT = path.resolve(__dirname, "../public");
const read = (f) => JSON.parse(fs.readFileSync(path.join(ASSETS, f), "utf-8"));

const site = read("site.json");
const projects = read("projects.json");
const { experiences } = read("experience.json");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const period = (p, lang) => `${p.start} – ${p.end ?? (lang === "ko" ? "현재" : "Present")}`;

function buildHtml(lang) {
  const featured = projects.filter((p) => p.featured);
  const archive = projects.filter((p) => !p.featured);
  const t = (ko, en) => (lang === "ko" ? ko : en);

  const cap = site.capabilities
    .map(
      (c) =>
        `<div class="cap"><span class="cap-t">${esc(c.title[lang])}</span> ${esc(
          c.items.map((i) => i[lang]).join(" · ")
        )}</div>`
    )
    .join("");

  const proj = featured
    .map((p) => {
      const contrib = (p.contributions || [])
        .map((c) => `<li>${esc(c[lang])}</li>`)
        .join("");
      const outcomes = (p.outcomes || [])
        .map((o) => {
          const m = o.before && o.after ? `<b>${esc(o.before)} → ${esc(o.after)}</b> ` : "";
          const d = o.detail ? ` — ${esc(o.detail[lang])}` : "";
          return `<li>${m}${esc(o.label[lang])}${d}</li>`;
        })
        .join("");
      return `<div class="proj">
        <div class="proj-h"><span class="proj-t">${esc(p.title)}</span>
        <span class="muted">${esc(period(p.period, lang))}</span></div>
        <div class="summary">${esc(p.summary[lang])}</div>
        ${p.role ? `<div class="role"><b>${t("역할", "Role")}</b> ${esc(p.role[lang])}</div>` : ""}
        ${contrib ? `<div class="lbl">${t("핵심 기여", "Contribution")}</div><ul>${contrib}</ul>` : ""}
        ${outcomes ? `<div class="lbl">${t("결과", "Outcome")}</div><ul>${outcomes}</ul>` : ""}
        <div class="tech">${esc(p.techStacks.join(" · "))}</div>
      </div>`;
    })
    .join("");

  const career = experiences
    .map((g) => {
      const rows = g.entries
        .map((e) => {
          const resp = e.responsibilities.length
            ? `<ul class="resp">${e.responsibilities.map((r) => `<li>${esc(r[lang])}</li>`).join("")}</ul>`
            : "";
          const sum = e.summary[lang] ? `<div class="summary">${esc(e.summary[lang])}</div>` : "";
          return `<div class="exp">
            <div class="exp-h"><span><b>${esc(e.company)}</b> · ${esc(e.title[lang])}</span>
            <span class="muted">${esc(period(e, lang))}</span></div>
            <div class="muted small">${esc(e.location[lang])}</div>${sum}${resp}</div>`;
        })
        .join("");
      return `<div class="cat">${esc(g.category[lang])}</div>${rows}`;
    })
    .join("");

  const arch = archive
    .map((p) => `<li><b>${esc(p.title)}</b> — ${esc(p.summary[lang])}</li>`)
    .join("");

  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Noto Sans KR", "Noto Sans CJK KR", "Malgun Gothic", sans-serif;
    color: #1e293b; font-size: 10.5px; line-height: 1.5; margin: 0; }
  h1 { font-size: 22px; margin: 0; }
  .headline { color: #2563eb; font-weight: 600; font-size: 11px; margin: 2px 0 6px; }
  .value { font-weight: 600; font-size: 11.5px; margin: 6px 0; }
  .contact { color: #475569; font-size: 9.5px; margin-bottom: 4px; }
  .sec { font-size: 12px; font-weight: 700; border-bottom: 1.5px solid #e2e8f0; margin: 14px 0 7px; padding-bottom: 3px; }
  .cap { margin: 2px 0; } .cap-t { font-weight: 600; color: #0f172a; }
  .proj { margin-bottom: 9px; page-break-inside: avoid; }
  .proj-h, .exp-h { display: flex; justify-content: space-between; align-items: baseline; }
  .proj-t { font-weight: 700; font-size: 11.5px; }
  .summary { font-weight: 600; margin: 1px 0; }
  .role { margin: 1px 0; } .role b, .lbl { color: #64748b; }
  .lbl { font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; margin-top: 3px; }
  ul { margin: 2px 0; padding-left: 15px; } li { margin: 0.5px 0; }
  .tech { color: #64748b; font-size: 9px; margin-top: 3px; }
  .muted { color: #94a3b8; font-weight: 400; } .small { font-size: 9px; }
  .cat { font-size: 8.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; color: #64748b; margin: 8px 0 3px; }
  .exp { margin-bottom: 6px; page-break-inside: avoid; } .resp { margin-top: 1px; }
  .arch { columns: 2; column-gap: 18px; font-size: 9.5px; } .arch li { break-inside: avoid; }
  </style></head><body>
  <h1>${esc(site.name[lang])}</h1>
  <div class="headline">${esc(site.headline[lang])}</div>
  <div class="value">${esc(site.valueProp[lang])}</div>
  <div class="contact">${esc(site.email)} · ${esc(site.github)} · ${esc(site.medium)} · ${esc(site.meta.location[lang])}</div>
  <div class="sec">${t("핵심 역량", "Core Capabilities")}</div>${cap}
  <div class="sec">${t("대표 프로젝트", "Featured Projects")}</div>${proj}
  <div class="sec">${t("경력", "Career")}</div>${career}
  <div class="sec">${t("프로젝트 아카이브", "Project Archive")}</div><ul class="arch">${arch}</ul>
  </body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  for (const lang of ["ko", "en"]) {
    const page = await browser.newPage();
    await page.setContent(buildHtml(lang), { waitUntil: "networkidle" });
    const file = path.join(OUT, `resume-${lang}.pdf`);
    await page.pdf({
      path: file,
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", bottom: "14mm", left: "14mm", right: "14mm" },
    });
    console.log("wrote", path.relative(process.cwd(), file));
    await page.close();
  }
  await browser.close();
})();
