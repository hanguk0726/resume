import type { Lang, Site } from "../types";
import Section from "./Section";

interface Props {
  site: Site;
  lang: Lang;
}

export default function Outcomes({ site, lang }: Props) {
  return (
    <Section id="outcomes" title={lang === "ko" ? "대표 성과" : "Signature Impact"}>
      <ul className="space-y-4">
        {site.signatureOutcomes.map((o, i) => {
          const hasMetric = o.before && o.after;
          return (
            <li
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-5 sm:flex sm:items-start sm:gap-5"
            >
              {hasMetric ? (
                <div className="mb-3 shrink-0 sm:mb-0">
                  <div className="flex items-baseline gap-2 rounded-lg bg-blue-50 px-3 py-2 text-blue-700">
                    <span className="text-sm text-slate-400 line-through">{o.before}</span>
                    <span className="text-lg font-bold">→ {o.after}</span>
                  </div>
                </div>
              ) : null}
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900">{o.label[lang]}</h3>
                <p className="mt-1 leading-relaxed text-slate-600">{o.context[lang]}</p>
                {o.projectSlug ? (
                  <a
                    href={`#project-${o.projectSlug}`}
                    className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                  >
                    {lang === "ko" ? "관련 프로젝트 →" : "Related project →"}
                  </a>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
