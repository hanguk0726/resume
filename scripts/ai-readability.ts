// Build-time AI/SEO readability plugin.
//
// This site is a client-rendered SPA, so crawlers and LLMs that don't execute
// JavaScript only see an empty <div id="root">. This Vite plugin makes the
// portfolio machine-readable WITHOUT changing the runtime app, by deriving
// everything from the same public/assets/*.json data the app already uses:
//
//   - injects rich <meta>, canonical link, and schema.org JSON-LD into <head>
//   - injects a <noscript> full-text fallback so non-JS crawlers read everything
//   - emits llms.txt (full-text resume for LLMs), robots.txt, and sitemap.xml
//
// Single source of truth: edit the JSON, rebuild, and all artifacts update.
// The static HTML defaults to Korean (the site's default language); the
// English text lives in llms.txt and the JSON-LD.
import fs from "node:fs";
import path from "node:path";
import type { HtmlTagDescriptor, Plugin } from "vite";
import type {
  Experience,
  ExperienceGroup,
  Lang,
  Project,
  Site,
} from "../src/types";

const SITE_URL = "https://hanguk0726.github.io/resume/";
const ASSETS_DIR = path.resolve(process.cwd(), "public/assets");
const DEFAULT_LANG: Lang = "ko";

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(ASSETS_DIR, file), "utf-8")) as T;
}

function load() {
  const site = readJson<Site>("site.json");
  const projects = readJson<Project[]>("projects.json");
  const { experiences } = readJson<{ experiences: ExperienceGroup[] }>(
    "experience.json"
  );
  return { site, projects, experiences };
}

function formatPeriod(p: { start: string; end: string | null }): string {
  return `${p.start} – ${p.end ?? "Present"}`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---- <head> tags (meta + JSON-LD) -----------------------------------------

function buildHeadTags(): HtmlTagDescriptor[] {
  const { site, projects } = load();
  const featured = projects.filter((p) => p.featured);
  const title = `${site.name.ko} | ${site.headline.ko}`;
  const description = site.valueProp.ko;

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name.en,
    alternateName: site.name.ko,
    url: SITE_URL,
    email: `mailto:${site.email}`,
    jobTitle: site.headline.en,
    description: `${site.valueProp.en} ${site.intro.en}`,
    address: { "@type": "PostalAddress", addressLocality: "Seoul", addressCountry: "KR" },
    sameAs: [site.github, site.medium],
    knowsAbout: site.fullTechStack,
  };

  const profileLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${site.name.en} — Portfolio`,
    url: SITE_URL,
    inLanguage: ["ko", "en"],
    mainEntity: {
      "@type": "Person",
      name: site.name.en,
      makesOffer: featured.map((p) => ({
        "@type": "CreativeWork",
        name: p.title,
        description: p.summary.en,
        keywords: [...p.keywords, ...p.techStacks].join(", "),
        url: p.links[0]?.url || SITE_URL,
      })),
    },
  };

  return [
    { tag: "meta", attrs: { name: "description", content: description }, injectTo: "head" },
    {
      tag: "meta",
      attrs: {
        name: "keywords",
        content: [...site.fullTechStack, site.name.en, site.name.ko, "Product Engineer", "Portfolio"].join(", "),
      },
      injectTo: "head",
    },
    { tag: "meta", attrs: { name: "author", content: site.name.en }, injectTo: "head" },
    { tag: "link", attrs: { rel: "canonical", href: SITE_URL }, injectTo: "head" },
    { tag: "link", attrs: { rel: "alternate", hreflang: "ko", href: `${SITE_URL}?lang=ko` }, injectTo: "head" },
    { tag: "link", attrs: { rel: "alternate", hreflang: "en", href: `${SITE_URL}?lang=en` }, injectTo: "head" },
    { tag: "link", attrs: { rel: "alternate", hreflang: "x-default", href: SITE_URL }, injectTo: "head" },
    { tag: "link", attrs: { rel: "alternate", type: "text/plain", href: `${SITE_URL}llms.txt`, title: "llms.txt" }, injectTo: "head" },
    { tag: "meta", attrs: { property: "og:title", content: title }, injectTo: "head" },
    { tag: "meta", attrs: { property: "og:description", content: description }, injectTo: "head" },
    { tag: "meta", attrs: { property: "og:type", content: "profile" }, injectTo: "head" },
    { tag: "meta", attrs: { property: "og:url", content: SITE_URL }, injectTo: "head" },
    { tag: "meta", attrs: { name: "twitter:card", content: "summary" }, injectTo: "head" },
    { tag: "script", attrs: { type: "application/ld+json" }, children: JSON.stringify(personLd), injectTo: "head" },
    { tag: "script", attrs: { type: "application/ld+json" }, children: JSON.stringify(profileLd), injectTo: "head" },
  ];
}

// ---- <noscript> body fallback (Korean, the default language) --------------

function buildNoscript(): string {
  const { site, projects, experiences } = load();
  const L: Lang = DEFAULT_LANG;
  const featured = projects.filter((p) => p.featured);
  const archive = projects.filter((p) => !p.featured);
  const out: string[] = [];

  out.push(`<h1>${escapeHtml(site.name[L])}</h1>`);
  out.push(`<p><strong>${escapeHtml(site.headline[L])}</strong></p>`);
  out.push(`<p>${escapeHtml(site.valueProp[L])}</p>`);
  out.push(`<p>${escapeHtml(site.intro[L])}</p>`);
  out.push(
    `<p>${escapeHtml(site.meta.location[L])} · ${escapeHtml(site.meta.languages[L])}</p>`
  );
  out.push(
    `<p>Email: <a href="mailto:${site.email}">${site.email}</a> · ` +
      `<a href="${site.github}">GitHub</a> · <a href="${site.medium}">Medium</a></p>`
  );

  out.push("<h2>핵심 역량</h2>");
  for (const c of site.capabilities) {
    out.push(
      `<p><strong>${escapeHtml(c.title[L])}:</strong> ${escapeHtml(
        c.items.map((i) => i[L]).join(", ")
      )}</p>`
    );
  }

  out.push("<h2>대표 프로젝트</h2>");
  for (const p of featured) {
    out.push(
      `<section><h3>${escapeHtml(p.title)} (${formatPeriod(p.period)})</h3>`
    );
    out.push(`<p><strong>${escapeHtml(p.summary[L])}</strong></p>`);
    if (p.role) out.push(`<p>${escapeHtml(p.role[L])}</p>`);
    if (p.contributions?.length) {
      out.push("<ul>");
      for (const c of p.contributions) out.push(`<li>${escapeHtml(c[L])}</li>`);
      out.push("</ul>");
    }
    if (p.outcomes?.length) {
      out.push("<ul>");
      for (const o of p.outcomes) {
        const metric = o.before && o.after ? ` (${o.before} → ${o.after})` : "";
        out.push(`<li>${escapeHtml(o.label[L])}${metric}</li>`);
      }
      out.push("</ul>");
    }
    out.push(`<p>Tech: ${escapeHtml(p.techStacks.join(", "))}</p>`);
    for (const link of p.links)
      out.push(`<p><a href="${link.url}">${escapeHtml(link.label)}</a></p>`);
    out.push("</section>");
  }

  out.push("<h2>경력</h2>");
  for (const g of experiences) {
    out.push(`<h3>${escapeHtml(g.category[L])}</h3><ul>`);
    for (const e of g.entries)
      out.push(
        `<li>${escapeHtml(e.company)} — ${escapeHtml(e.title[L])} (${escapeHtml(
          e.location[L]
        )}, ${formatPeriod(e)})</li>`
      );
    out.push("</ul>");
  }

  out.push("<h2>프로젝트 아카이브</h2><ul>");
  for (const p of archive)
    out.push(
      `<li>${escapeHtml(p.title)} (${formatPeriod(p.period)}) — ${escapeHtml(
        p.summary[L]
      )}</li>`
    );
  out.push("</ul>");

  out.push("<h2>관심 영역</h2><ul>");
  for (const it of site.interests.problems)
    out.push(`<li>${escapeHtml(it[L])}</li>`);
  out.push("</ul>");

  return `<noscript><main>${out.join("\n")}</main></noscript>`;
}

// ---- llms.txt (English full text for LLMs) --------------------------------

function buildLlmsTxt(): string {
  const { site, projects, experiences } = load();
  const L: Lang = "en";
  const featured = projects.filter((p) => p.featured);
  const archive = projects.filter((p) => !p.featured);
  const out: string[] = [];

  out.push(`# ${site.name.en} — ${site.headline.en}`);
  out.push("");
  out.push(`> ${site.valueProp.en}`);
  out.push("");
  out.push(site.intro.en);
  out.push("");
  out.push("## Contact");
  out.push(`- Email: ${site.email}`);
  out.push(`- GitHub: ${site.github}`);
  out.push(`- Medium: ${site.medium}`);
  out.push(`- ${site.meta.location.en} · ${site.meta.languages.en}`);
  out.push("");

  out.push("## Core capabilities");
  for (const c of site.capabilities)
    out.push(`- **${c.title.en}**: ${c.items.map((i) => i.en).join(", ")}`);
  out.push("");

  out.push("## Featured projects");
  out.push("");
  for (const p of featured) {
    out.push(`### ${p.title} (${formatPeriod(p.period)}) — ${p.type}`);
    out.push("");
    out.push(`**${p.summary.en}**`);
    out.push("");
    if (p.role) out.push(`- Role: ${p.role.en}`);
    if (p.problems?.length)
      out.push(`- Problems: ${p.problems.map((x) => x.en).join(" / ")}`);
    if (p.contributions?.length) {
      out.push(`- Contributions:`);
      for (const c of p.contributions) out.push(`  - ${c.en}`);
    }
    if (p.outcomes?.length) {
      out.push(`- Outcomes:`);
      for (const o of p.outcomes) {
        const metric = o.before && o.after ? ` (${o.before} → ${o.after})` : "";
        out.push(`  - ${o.label.en}${metric}${o.detail ? ` — ${o.detail.en}` : ""}`);
      }
    }
    out.push(`- Tech: ${p.techStacks.join(", ")}`);
    if (p.links.length)
      out.push(`- Links: ${p.links.map((l) => `${l.label} ${l.url}`).join(" , ")}`);
    out.push("");
  }

  out.push("## Experience");
  out.push("");
  for (const g of experiences) {
    out.push(`### ${g.category.en}`);
    for (const e of g.entries) {
      const resp = e.responsibilities.length
        ? ` — ${e.responsibilities.map((r) => r.en).join("; ")}`
        : "";
      out.push(
        `- **${e.company}** — ${e.title.en} · ${e.location.en} · ${formatPeriod(e as Experience)}${resp}`
      );
    }
    out.push("");
  }

  out.push("## Project archive");
  for (const p of archive)
    out.push(`- **${p.title}** (${formatPeriod(p.period)}) — ${p.summary.en}`);
  out.push("");

  out.push("## Interested in");
  for (const it of site.interests.problems) out.push(`- ${it.en}`);
  out.push("");
  out.push(`Good-fit roles: ${site.interests.goodFitRoles.join(", ")}.`);
  out.push("");
  out.push(site.interests.preference.en);
  out.push("");
  void L;
  return out.join("\n");
}

function buildRobotsTxt(): string {
  return [
    "# Portfolio site — crawlers and AI agents welcome.",
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
  const urls = [SITE_URL];
  const body = urls.map((u) => `  <url>\n    <loc>${u}</loc>\n  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

// ---- plugin ---------------------------------------------------------------

export default function aiReadability(): Plugin {
  return {
    name: "ai-readability",
    transformIndexHtml(html) {
      const { site } = load();
      const title = `${site.name.ko} | ${site.headline.ko}`;
      // Set the static title and default language so non-JS crawlers see the
      // positioned identity (the runtime app keeps them in sync per language).
      const withTitle = html
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
        .replace(/<html lang="[^"]*">/, '<html lang="ko">');
      const withNoscript = withTitle.replace(
        "</body>",
        `${buildNoscript()}\n  </body>`
      );
      return { html: withNoscript, tags: buildHeadTags() };
    },
    generateBundle() {
      const emit = (fileName: string, source: string) =>
        this.emitFile({ type: "asset", fileName, source });
      emit("llms.txt", buildLlmsTxt());
      emit("robots.txt", buildRobotsTxt());
      emit("sitemap.xml", buildSitemap());
    },
  };
}
