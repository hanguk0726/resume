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
    <section id="top" className="mx-auto max-w-3xl px-5 pb-14 pt-14 sm:pt-20">
      <p className="text-sm font-medium uppercase tracking-widest text-blue-600">
        {site.headline[lang]}
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        {site.name[lang]}
      </h1>
      <p className="mt-5 text-lg font-medium leading-relaxed text-slate-800">
        {site.valueProp[lang]}
      </p>
      <p className="mt-4 leading-relaxed text-slate-600">{site.intro[lang]}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={15} strokeWidth={1.75} />
          {site.meta.location[lang]}
        </span>
        <span className="hidden sm:inline text-slate-300">·</span>
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
                  ? "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                  : "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-600"
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
