import type { Lang, Site } from "../types";
import Section from "./Section";

interface Props {
  site: Site;
  lang: Lang;
}

export default function Outcomes({ site, lang }: Props) {
  return (
    <Section id="outcomes" title={lang === "ko" ? "대표 성과" : "Signature Impact"}>
      <ul className="border-b border-[var(--line)]">
        {site.signatureOutcomes.map((o, i) => {
          const hasMetric = o.before && o.after;
          return (
            <li
              key={i}
              className="rule-row grid gap-3 sm:grid-cols-[9.5rem_1fr] sm:gap-6"
            >
              {hasMetric ? (
                <div className="shrink-0">
                  <div className="flex items-baseline gap-2 font-mono text-[var(--accent)] sm:block">
                    <span className="text-xs text-[var(--faint)] line-through">{o.before}</span>
                    <span className="text-xl font-bold sm:mt-1 sm:block">→ {o.after}</span>
                  </div>
                </div>
              ) : (
                <span className="section-kicker">0{i + 1}</span>
              )}
              <div className="min-w-0">
                <h3 className="font-[family-name:var(--display)] text-lg font-semibold text-[var(--ink)]">{o.label[lang]}</h3>
                <p className="mt-1.5 leading-relaxed text-[var(--muted)]">{o.context[lang]}</p>
                {o.projectSlug ? (
                  <a
                    href={`#project-${o.projectSlug}`}
                    className="text-link mt-2 inline-block font-mono text-xs"
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
