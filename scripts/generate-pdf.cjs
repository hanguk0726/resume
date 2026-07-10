/**
 * Generates concise KO/EN resume PDFs from the same JSON content as the site.
 *
 * The web portfolio is editorial and exploratory. The PDF is deliberately a
 * different artifact: two A4 pages, scan-first hierarchy, no duplicated long
 * narratives, and print-readable type.
 *
 * Run: npm run pdf
 */
const fs = require("node:fs");
const path = require("node:path");

let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  try {
    // The repository pins playwright-core and uses the installed Chrome
    // channel, avoiding a second browser download in normal npm installs.
    ({ chromium } = require("playwright-core"));
  } catch {
    try {
      ({ chromium } = require("/opt/node22/lib/node_modules/playwright"));
    } catch {
      console.error("Playwright not found. Run npm install before generating PDFs.");
      process.exit(1);
    }
  }
}

const ASSETS = path.resolve(__dirname, "../public/assets");
const OUT = path.resolve(__dirname, "../public");
const read = (file) => JSON.parse(fs.readFileSync(path.join(ASSETS, file), "utf-8"));

const site = read("site.json");
const projects = read("projects.json");
const { experiences } = read("experience.json");

const normalizeDashes = (value) =>
  String(value).replace(/[\u2010-\u2015\u2212]/g, "-");
const esc = (value) =>
  normalizeDashes(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const period = (value, lang) =>
  `${value.start} - ${value.end ?? (lang === "ko" ? "현재" : "Present")}`;
const t = (lang, ko, en) => (lang === "ko" ? ko : en);

function outcomeLine(outcome, lang) {
  const metric =
    outcome.before && outcome.after
      ? `<strong>${esc(outcome.before)} → ${esc(outcome.after)}</strong> `
      : "";
  const detail = outcome.detail ? ` - ${esc(outcome.detail[lang])}` : "";
  return `${metric}${esc(outcome.label[lang])}${detail}`;
}

function renderProjectLead(project, lang) {
  const signals = [
    ...(project.outcomes || []).slice(0, 1).map((item) => outcomeLine(item, lang)),
    ...(project.contributions || []).slice(0, 2).map((item) => esc(item[lang])),
  ];

  return `<article class="project project-lead">
    <div class="row-head">
      <h3>${esc(project.title)}</h3>
      <span class="date">${esc(period(project.period, lang))}</span>
    </div>
    <p class="project-summary">${esc(project.summary[lang])}</p>
    ${
      project.role
        ? `<p class="role"><span>${t(lang, "역할", "Role")}</span> ${esc(project.role[lang])}</p>`
        : ""
    }
    <ul class="signal-list">${signals.map((item) => `<li>${item}</li>`).join("")}</ul>
    <p class="stack">${esc(project.techStacks.slice(0, 8).join(" · "))}</p>
  </article>`;
}

function renderProjectCard(project, lang) {
  const signal = project.outcomes?.[0]
    ? outcomeLine(project.outcomes[0], lang)
    : esc(project.contributions?.[0]?.[lang] || "");

  return `<article class="project project-card">
    <div class="row-head">
      <h3>${esc(project.title)}</h3>
      <span class="date">${esc(period(project.period, lang))}</span>
    </div>
    <p class="project-summary">${esc(project.summary[lang])}</p>
    ${signal ? `<p class="signal">${signal}</p>` : ""}
    <p class="stack">${esc(project.techStacks.slice(0, 5).join(" · "))}</p>
  </article>`;
}

function renderExperience(entry, lang) {
  const responsibilities = entry.responsibilities
    .slice(0, 2)
    .map((item) => `<li>${esc(item[lang])}</li>`)
    .join("");

  return `<article class="experience">
    <div class="row-head">
      <h3>${esc(entry.company)} <span>· ${esc(entry.title[lang])}</span></h3>
      <span class="date">${esc(period(entry, lang))}</span>
    </div>
    <p class="location">${esc(entry.location[lang])}</p>
    ${entry.summary[lang] ? `<p class="experience-summary">${esc(entry.summary[lang])}</p>` : ""}
    ${responsibilities ? `<ul>${responsibilities}</ul>` : ""}
  </article>`;
}

function buildHtml(lang) {
  const featured = projects.filter((project) => project.featured);
  const archive = projects.filter((project) => !project.featured);
  const career = experiences[0].entries;
  const training = experiences.slice(1);

  const capabilities = site.capabilities
    .map(
      (capability) => `<div class="capability">
        <h3>${esc(capability.title[lang])}</h3>
        <p>${esc(capability.items.map((item) => item[lang]).join(" · "))}</p>
      </div>`
    )
    .join("");

  const projectCards = featured
    .slice(1)
    .map((project) => renderProjectCard(project, lang))
    .join("");

  const trainingBlocks = training
    .map(
      (group) => `<section class="compact-group">
        <h3 class="group-label">${esc(group.category[lang])}</h3>
        ${group.entries
          .map(
            (entry) => `<div class="compact-row">
              <span><strong>${esc(entry.company)}</strong> · ${esc(entry.title[lang])}</span>
              <span class="date">${esc(period(entry, lang))}</span>
            </div>`
          )
          .join("")}
      </section>`
    )
    .join("");

  const archiveItems = archive
    .map(
      (project) => `<li><strong>${esc(project.title)}</strong><span>${esc(project.summary[lang])}</span></li>`
    )
    .join("");

  return `<!doctype html>
  <html lang="${lang}">
  <head>
    <meta charset="utf-8">
    <title>${esc(site.name[lang])} - ${t(lang, "이력서", "Resume")}</title>
    <style>
      @page { size: A4; margin: 0; }
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        color: #1f2937;
        background: #ffffff;
        font-family: Arial, "Noto Sans KR", "Noto Sans CJK KR", "Malgun Gothic", sans-serif;
        font-size: 9pt;
        line-height: 1.42;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      a { color: inherit; text-decoration: none; }
      p, h1, h2, h3, ul { margin: 0; }
      ul { padding-left: 4mm; }
      li { margin: 0.6mm 0; }
      .page {
        position: relative;
        width: 210mm;
        height: 297mm;
        padding: 13mm 14mm 15mm;
        page-break-after: always;
      }
      .page:last-child { page-break-after: auto; }
      .page-content { position: relative; z-index: 1; }
      .rule { width: 12mm; height: 1.2mm; background: #7a4638; margin-bottom: 4mm; }
      .header h1 { color: #111827; font-size: 23pt; line-height: 1; letter-spacing: -0.035em; }
      .headline { color: #7a4638; font-size: 10pt; font-weight: 700; margin-top: 2.2mm; }
      .value { max-width: 171mm; color: #374151; font-size: 10pt; line-height: 1.48; margin-top: 2.4mm; }
      .contact { display: flex; flex-wrap: wrap; gap: 1.5mm 4mm; color: #526173; font-size: 8.25pt; margin-top: 3.2mm; }
      .contact a { border-bottom: 0.25mm solid #c7d2e2; }
      .section { margin-top: 7mm; }
      .section-title {
        display: flex;
        align-items: baseline;
        gap: 3mm;
        color: #111827;
        font-size: 13pt;
        line-height: 1.1;
        letter-spacing: -0.025em;
        padding-bottom: 2mm;
        border-bottom: 0.35mm solid #dce3ec;
        margin-bottom: 3mm;
      }
      .section-title span { color: #7b8798; font-size: 8.25pt; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; }
      .cap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.4mm 7mm; }
      .capability { display: grid; grid-template-columns: 36mm 1fr; gap: 2mm; align-items: baseline; }
      .capability h3 { color: #172033; font-size: 8.5pt; }
      .capability p { color: #526173; font-size: 8.2pt; }
      .project { break-inside: avoid; }
      .project h3, .experience h3 { color: #172033; font-size: 10pt; line-height: 1.25; }
      .row-head { display: flex; justify-content: space-between; align-items: baseline; gap: 5mm; }
      .date { flex: 0 0 auto; color: #7b8798; font-size: 8.25pt; font-weight: 500; }
      .project-lead { padding: 0.8mm 0 3.6mm; border-bottom: 0.3mm solid #e5eaf0; }
      .project-summary { color: #263244; font-weight: 700; margin-top: 1.2mm; }
      .role { color: #475569; margin-top: 1mm; }
      .role span { color: #7a4638; font-size: 8.25pt; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
      .signal-list { margin-top: 1.3mm; }
      .signal { color: #475569; margin-top: 1.2mm; }
      .stack { color: #64748b; font-size: 8.25pt; margin-top: 1.4mm; }
      .project-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm 7mm; margin-top: 4mm; }
      .project-card { padding-left: 3mm; border-left: 0.7mm solid #dce6f5; }
      .project-card .project-summary { font-size: 8.6pt; }
      .project-card .signal { font-size: 8.2pt; }
      .page-two .section { margin-top: 4mm; }
      .experience-list { display: grid; gap: 3mm; }
      .experience { padding-bottom: 2.8mm; border-bottom: 0.25mm solid #e7ebf0; }
      .experience:last-child { border-bottom: 0; padding-bottom: 0; }
      .experience h3 span { color: #475569; font-weight: 500; }
      .location { color: #8794a6; font-size: 8.25pt; margin-top: 0.5mm; }
      .experience-summary { color: #263244; font-weight: 700; margin-top: 1mm; }
      .experience ul { margin-top: 0.8mm; }
      .bottom-grid { display: grid; grid-template-columns: 0.9fr 1.5fr; gap: 7mm; margin-top: 5mm; }
      .bottom-grid .section-title { font-size: 11pt; margin-bottom: 2.4mm; }
      .compact-group + .compact-group { margin-top: 3mm; }
      .group-label { color: #7a4638; font-size: 8.25pt; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 1.2mm; }
      .compact-row { display: flex; justify-content: space-between; align-items: baseline; gap: 3mm; font-size: 8.2pt; margin: 1.2mm 0; }
      .archive-list { display: grid; grid-template-columns: 1fr 1fr; column-gap: 6mm; row-gap: 1.7mm; padding-left: 4mm; }
      .archive-list li { break-inside: avoid; font-size: 8.2pt; }
      .archive-list strong { color: #263244; }
      .archive-list span { color: #5d6979; margin-left: 1.2mm; }
      .footer {
        position: absolute;
        left: 14mm;
        right: 14mm;
        bottom: 7mm;
        display: flex;
        justify-content: space-between;
        color: #8a96a6;
        font-size: 8.25pt;
      }
      .footer strong { color: #526173; }
    </style>
  </head>
  <body>
    <main class="page page-one">
      <div class="page-content">
        <div class="rule"></div>
        <header class="header">
          <h1>${esc(site.name[lang])}</h1>
          <p class="headline">${esc(site.headline[lang])}</p>
          <p class="value">${esc(site.valueProp[lang])}</p>
          <div class="contact">
            <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>
            <a href="${esc(site.github)}">${esc(site.github.replace(/^https?:\/\//, ""))}</a>
            <a href="${esc(site.medium)}">${esc(site.medium.replace(/^https?:\/\//, ""))}</a>
            <span>${esc(site.meta.location[lang])}</span>
          </div>
        </header>

        <section class="section">
          <h2 class="section-title">${t(lang, "핵심 역량", "Core Capabilities")} <span>${t(lang, "일하는 범위", "Scope")}</span></h2>
          <div class="cap-grid">${capabilities}</div>
        </section>

        <section class="section">
          <h2 class="section-title">${t(lang, "선별 프로젝트", "Selected Work")}</h2>
          ${renderProjectLead(featured[0], lang)}
          <div class="project-grid">${projectCards}</div>
        </section>
      </div>
      <footer class="footer"><strong>${esc(site.name[lang])}</strong><span>01 / 02</span></footer>
    </main>

    <main class="page page-two">
      <div class="page-content">
        <div class="rule"></div>
        <section>
          <h2 class="section-title">${t(lang, "경력", "Experience")} <span>${t(lang, "역할과 책임", "Roles & ownership")}</span></h2>
          <div class="experience-list">${career.map((entry) => renderExperience(entry, lang)).join("")}</div>
        </section>

        <div class="bottom-grid">
          <div>
            <h2 class="section-title">${t(lang, "교육", "Education")}</h2>
            ${trainingBlocks}
          </div>
          <div>
            <h2 class="section-title">${t(lang, "추가 프로젝트", "Additional Projects")}</h2>
            <ul class="archive-list">${archiveItems}</ul>
          </div>
        </div>
      </div>
      <footer class="footer"><strong>${esc(site.name[lang])}</strong><span>02 / 02</span></footer>
    </main>
  </body>
  </html>`;
}

async function launchBrowser() {
  try {
    return await chromium.launch();
  } catch (bundledError) {
    try {
      // Official Playwright fallback for machines that provide branded Chrome
      // but do not have the Playwright-matched Chromium revision installed.
      return await chromium.launch({ channel: "chrome" });
    } catch {
      throw bundledError;
    }
  }
}

(async () => {
  const browser = await launchBrowser();
  try {
    for (const lang of ["ko", "en"]) {
      const page = await browser.newPage();
      await page.setContent(buildHtml(lang), { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);

      const layout = await page.$$eval(".page", (pages) =>
        pages.map((sheet, index) => {
          const content = sheet.querySelector(".page-content").getBoundingClientRect();
          const footer = sheet.querySelector(".footer").getBoundingClientRect();
          return {
            page: index + 1,
            contentBottom: Math.round(content.bottom * 10) / 10,
            footerTop: Math.round(footer.top * 10) / 10,
            clear: content.bottom <= footer.top - 8,
          };
        })
      );
      if (layout.some((item) => !item.clear)) {
        throw new Error(`PDF content overlaps footer (${lang}): ${JSON.stringify(layout)}`);
      }

      const file = path.join(OUT, `resume-${lang}.pdf`);
      await page.pdf({
        path: file,
        format: "A4",
        preferCSSPageSize: true,
        printBackground: true,
        margin: { top: "0", bottom: "0", left: "0", right: "0" },
      });
      console.log("wrote", path.relative(process.cwd(), file), JSON.stringify(layout));
      await page.close();
    }
  } finally {
    await browser.close();
  }
})();
