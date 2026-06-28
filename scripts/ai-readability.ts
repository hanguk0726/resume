// Build-time AI/SEO readability plugin.
//
// This site is a client-rendered SPA, so crawlers and LLMs that don't execute
// JavaScript only see an empty <div id="root">. This Vite plugin makes the
// resume machine-readable WITHOUT changing the runtime app, by deriving
// everything from the same public/assets/*.json data the app already uses:
//
//   - injects rich <meta>, canonical link, and schema.org JSON-LD into <head>
//   - injects a <noscript> full-text fallback so non-JS crawlers read everything
//   - emits llms.txt (full-text resume for LLMs), robots.txt, and sitemap.xml
//
// Single source of truth: edit the JSON, rebuild, and all artifacts update.
import fs from "node:fs";
import path from "node:path";
import type { HtmlTagDescriptor, Plugin } from "vite";

const SITE_URL = "https://hanguk0726.github.io/resume/";
const PERSON_NAME = "HanGuk Shin";
const ASSETS_DIR = path.resolve(process.cwd(), "public/assets");

interface DateRange {
  startMonth: number;
  startYear: number;
  endMonth: number | null;
  endYear: number | null;
}
interface Project {
  title: string;
  description: Record<string, string>;
  keyword: string[];
  techStacks: string[];
  personal: boolean;
  links: string[];
  date: DateRange;
  article: Record<string, string>;
}
interface Entry {
  company: Record<string, string>;
  location: Record<string, string>;
  period: string;
  position: Record<string, string>;
}
interface ExperienceGroup {
  category: Record<string, string>;
  entries: Entry[];
}
interface About {
  translations: {
    emailText: string;
    githubText: string;
    interestedText: Record<string, string>;
    backgroundText: Record<string, string>;
    projectText: Record<string, string>;
  };
}

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(ASSETS_DIR, file), "utf-8")) as T;
}

function formatRange(d: DateRange): string {
  const start = `${d.startYear}.${String(d.startMonth).padStart(2, "0")}`;
  const end =
    d.endYear && d.endMonth
      ? `${d.endYear}.${String(d.endMonth).padStart(2, "0")}`
      : "Present";
  return `${start} – ${end}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ---- derived data ---------------------------------------------------------

function load() {
  const about = readJson<About>("about.json");
  const projects = readJson<Project[]>("projects.json");
  const { experiences } = readJson<{ experiences: ExperienceGroup[] }>(
    "experience.json"
  );
  const t = about.translations;
  const summary = `${t.interestedText.en} ${t.backgroundText.en}`;
  return { about, projects, experiences, t, summary };
}

// ---- <head> tags (meta + JSON-LD) -----------------------------------------

function buildHeadTags() {
  const { projects, experiences, t, summary } = load();
  const github = t.githubText.replace(/^https?:\/\/(www\.)?/, "https://");
  const techSet = new Set<string>();
  projects.forEach((p) => p.techStacks.forEach((s) => techSet.add(s)));
  const career = experiences.find((g) => g.category.en === "Career");

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PERSON_NAME,
    url: SITE_URL,
    email: `mailto:${t.emailText}`,
    description: summary,
    sameAs: [github, "https://medium.com/@hangukshin"],
    knowsAbout: [...techSet],
    worksFor: career?.entries[0]
      ? { "@type": "Organization", name: career.entries[0].company.en }
      : undefined,
    hasOccupation: career?.entries[0]
      ? {
          "@type": "Occupation",
          name: career.entries[0].position.en,
        }
      : undefined,
  };

  const profileLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${PERSON_NAME} — Resume`,
    url: SITE_URL,
    about: { "@type": "Person", name: PERSON_NAME },
    mainEntity: {
      "@type": "Person",
      name: PERSON_NAME,
      makesOffer: projects.map((p) => ({
        "@type": "CreativeWork",
        name: p.title,
        description: p.description.en,
        keywords: [...p.keyword, ...p.techStacks].join(", "),
        url: p.links[0] || SITE_URL,
      })),
    },
  };

  const tags: HtmlTagDescriptor[] = [
    {
      tag: "meta",
      attrs: { name: "description", content: summary },
      injectTo: "head",
    },
    {
      tag: "meta",
      attrs: {
        name: "keywords",
        content: [...techSet, "Resume", PERSON_NAME, "Software Engineer"].join(
          ", "
        ),
      },
      injectTo: "head",
    },
    { tag: "meta", attrs: { name: "author", content: PERSON_NAME }, injectTo: "head" },
    { tag: "link", attrs: { rel: "canonical", href: SITE_URL }, injectTo: "head" },
    { tag: "link", attrs: { rel: "alternate", type: "text/plain", href: `${SITE_URL}llms.txt`, title: "llms.txt" }, injectTo: "head" },
    { tag: "meta", attrs: { property: "og:title", content: `${PERSON_NAME} — Resume` }, injectTo: "head" },
    { tag: "meta", attrs: { property: "og:description", content: summary }, injectTo: "head" },
    { tag: "meta", attrs: { property: "og:type", content: "profile" }, injectTo: "head" },
    { tag: "meta", attrs: { property: "og:url", content: SITE_URL }, injectTo: "head" },
    { tag: "meta", attrs: { name: "twitter:card", content: "summary" }, injectTo: "head" },
    {
      tag: "script",
      attrs: { type: "application/ld+json" },
      children: JSON.stringify(personLd),
      injectTo: "head",
    },
    {
      tag: "script",
      attrs: { type: "application/ld+json" },
      children: JSON.stringify(profileLd),
      injectTo: "head",
    },
  ];
  return tags;
}

// ---- <noscript> body fallback ---------------------------------------------

function buildNoscript(): string {
  const { projects, experiences, t, summary } = load();
  const parts: string[] = [];
  parts.push(`<h1>${PERSON_NAME}</h1>`);
  parts.push(`<p>${escapeHtml(summary)}</p>`);
  parts.push(
    `<p>Email: <a href="mailto:${t.emailText}">${t.emailText}</a> · ` +
      `GitHub: <a href="${t.githubText}">${escapeHtml(t.githubText)}</a></p>`
  );

  parts.push("<h2>Projects</h2>");
  for (const p of projects) {
    parts.push(
      `<section><h3>${escapeHtml(p.title)} (${formatRange(p.date)}, ${
        p.personal ? "Personal" : "Company"
      })</h3>`
    );
    parts.push(`<p><strong>${escapeHtml(p.description.en)}</strong></p>`);
    parts.push(`<p>Tech: ${escapeHtml(p.techStacks.join(", "))}</p>`);
    if (p.keyword.length)
      parts.push(`<p>Keywords: ${escapeHtml(p.keyword.join(", "))}</p>`);
    for (const para of p.article.en.split("\n\n"))
      parts.push(`<p>${escapeHtml(para)}</p>`);
    for (const link of p.links)
      parts.push(`<p><a href="${link}">${escapeHtml(link)}</a></p>`);
    parts.push("</section>");
  }

  parts.push("<h2>Experience</h2>");
  for (const g of experiences) {
    parts.push(`<h3>${escapeHtml(g.category.en)}</h3><ul>`);
    for (const e of g.entries)
      parts.push(
        `<li>${escapeHtml(e.company.en)} — ${escapeHtml(
          e.position.en
        )} (${escapeHtml(e.location.en)}, ${escapeHtml(e.period)})</li>`
      );
    parts.push("</ul>");
  }
  return `<noscript><main>${parts.join("\n")}</main></noscript>`;
}

// ---- llms.txt -------------------------------------------------------------

function buildLlmsTxt(): string {
  const { projects, experiences, t } = load();
  const lines: string[] = [];
  lines.push(`# ${PERSON_NAME} — Resume`);
  lines.push("");
  lines.push(`> Software engineer. ${t.interestedText.en}`);
  lines.push("");
  lines.push(t.backgroundText.en);
  lines.push("");
  lines.push("## Contact");
  lines.push(`- Email: ${t.emailText}`);
  lines.push(`- GitHub: ${t.githubText}`);
  lines.push(`- Medium: https://medium.com/@hangukshin`);
  lines.push(`- Site: ${SITE_URL}`);
  lines.push("");

  lines.push("## Projects");
  lines.push("");
  for (const p of projects) {
    lines.push(
      `### ${p.title} (${formatRange(p.date)}) — ${
        p.personal ? "Personal" : "Company"
      }`
    );
    lines.push("");
    lines.push(`**${p.description.en}**`);
    lines.push("");
    lines.push(`- Tech stack: ${p.techStacks.join(", ")}`);
    if (p.keyword.length) lines.push(`- Keywords: ${p.keyword.join(", ")}`);
    if (p.links.length) lines.push(`- Links: ${p.links.join(" , ")}`);
    lines.push("");
    lines.push(p.article.en);
    lines.push("");
  }

  lines.push("## Experience");
  lines.push("");
  for (const g of experiences) {
    lines.push(`### ${g.category.en}`);
    for (const e of g.entries)
      lines.push(
        `- **${e.company.en}** — ${e.position.en} · ${e.location.en} · ${e.period}`
      );
    lines.push("");
  }
  return lines.join("\n");
}

function buildRobotsTxt(): string {
  return [
    "# Resume site — crawlers and AI agents welcome.",
    "User-agent: *",
    "Allow: /",
    "",
    "# Explicitly welcome major AI crawlers.",
    ...["GPTBot", "ChatGPT-User", "ClaudeBot", "Claude-Web", "anthropic-ai", "PerplexityBot", "Google-Extended", "CCBot", "Applebot-Extended"].flatMap(
      (ua) => [`User-agent: ${ua}`, "Allow: /", ""]
    ),
    `Sitemap: ${SITE_URL}sitemap.xml`,
    "",
  ].join("\n");
}

function buildSitemap(): string {
  const urls = [SITE_URL, `${SITE_URL}about`];
  const body = urls
    .map((u) => `  <url>\n    <loc>${u}</loc>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

// ---- plugin ---------------------------------------------------------------

export default function aiReadability(): Plugin {
  return {
    name: "ai-readability",
    transformIndexHtml(html) {
      const withNoscript = html.replace(
        "</body>",
        `${buildNoscript()}\n  </body>`
      );
      return { html: withNoscript, tags: buildHeadTags() };
    },
    // Emit the static text artifacts into the build output.
    generateBundle() {
      const emit = (fileName: string, source: string) =>
        this.emitFile({ type: "asset", fileName, source });
      emit("llms.txt", buildLlmsTxt());
      emit("robots.txt", buildRobotsTxt());
      emit("sitemap.xml", buildSitemap());
    },
  };
}
