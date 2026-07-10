import { ArrowRight, FileText, Github, Mail, MapPin } from "lucide-react";
import type { CtaLink, Lang, Site } from "../types";

const BASE = import.meta.env.BASE_URL;

function ctaHref(cta: CtaLink, site: Site, lang: Lang): string {
  if (cta.kind === "resume") return `${BASE}${site.resume[lang]}`;
  return cta.href;
}

function ctaIcon(kind: CtaLink["kind"]) {
  switch (kind) {
    case "projects":
      return <ArrowRight size={16} strokeWidth={2} />;
    case "resume":
      return <FileText size={16} strokeWidth={1.75} />;
    case "github":
      return <Github size={16} strokeWidth={1.75} />;
    case "email":
      return <Mail size={16} strokeWidth={1.75} />;
    default:
      return null;
  }
}

interface Props {
  site: Site;
  lang: Lang;
}

export default function Hero({ site, lang }: Props) {
  return (
    <section id="top" className="journal-container scroll-mt-16 pb-16 pt-14 sm:pb-20 sm:pt-20">
      <div className="mb-7 flex items-center gap-3" aria-hidden="true">
        <span className="section-kicker">00 / Profile</span>
        <span className="h-px flex-1 bg-[var(--line)]" />
        <span className="h-2 w-2 bg-[var(--accent)]" />
      </div>
      <p className="meta-label hero-role max-w-2xl leading-relaxed">
        {site.headline[lang]}
      </p>
      <h1 className="display-title mt-3 text-5xl leading-none sm:text-6xl">
        {site.name[lang]}
      </h1>
      <p className="mt-6 max-w-2xl font-[family-name:var(--display)] text-xl font-semibold leading-relaxed text-[var(--ink)] sm:text-2xl">
        {site.valueProp[lang]}
      </p>
      <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">{site.intro[lang]}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-xs text-[var(--faint)]">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={15} strokeWidth={1.75} />
          {site.meta.location[lang]}
        </span>
        <span className="hidden text-[var(--line)] sm:inline">/</span>
        <span>{site.meta.languages[lang]}</span>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {site.ctas.map((cta, i) => {
          const href = ctaHref(cta, site, lang);
          const isPrimary = i === 0;
          const external = cta.kind === "github" || cta.kind === "external";
          const download = cta.kind === "resume";
          return (
            <a
              key={cta.kind}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              {...(download ? { download: "" } : {})}
              className={
                isPrimary
                  ? "primary-cta"
                  : "secondary-cta"
              }
            >
              {ctaIcon(cta.kind)}
              {cta.label[lang]}
            </a>
          );
        })}
      </div>
    </section>
  );
}
