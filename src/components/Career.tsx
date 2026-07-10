import { ExternalLink } from "lucide-react";
import type { ExperienceGroup, Lang, OpenSourceContribution } from "../types";
import Section from "./Section";
import { localizedText, periodLabel } from "../format";

interface Props {
  experiences: ExperienceGroup[];
  contributions: OpenSourceContribution[];
  lang: Lang;
}

export default function Career({ experiences, contributions, lang }: Props) {
  const sectionTitle = lang === "ko" ? "경력" : "Career";

  return (
    <Section id="career" title={sectionTitle}>
      <div className="space-y-10">
        {experiences.map((group) => (
          <div key={group.category.en}>
            {group.category[lang] !== sectionTitle ? (
              <h3 className="meta-label mb-4">
                {group.category[lang]}
              </h3>
            ) : null}
            <ul className="space-y-6 border-l border-[var(--line)] pl-5">
              {group.entries.map((e) => (
                <li key={`${localizedText(e.company, "en")}-${e.start}`} className="relative">
                  <span className="absolute -left-[23px] top-2 h-2 w-2 bg-[var(--accent)]" />
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-[family-name:var(--display)] text-lg font-semibold text-[var(--ink)]">{localizedText(e.company, lang)}</span>
                    <span className="text-[var(--line)]">/</span>
                    <span className="text-[var(--ink)]">{e.title[lang]}</span>
                  </div>
                  <div className="mt-1 font-mono text-xs text-[var(--faint)]">
                    {periodLabel(e, lang)} · {e.location[lang]}
                  </div>
                  {e.summary[lang] ? (
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{e.summary[lang]}</p>
                  ) : null}
                  {e.responsibilities.length ? (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[var(--muted)] marker:text-[var(--accent)]">
                      {e.responsibilities.map((r) => (
                        <li key={r.en}>{r[lang]}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {contributions.length ? (
          <div>
            <h3 className="meta-label mb-4">
              {lang === "ko" ? "오픈소스 기여" : "Open Source Contributions"}
            </h3>
            <ul className="space-y-6 border-l border-[var(--line)] pl-5">
              {contributions.map((contribution) => (
                <li key={contribution.url} className="relative">
                  <span className="absolute -left-[23px] top-2 h-2 w-2 bg-[var(--accent)]" />
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <a
                      href={contribution.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link inline-flex items-center gap-1 font-[family-name:var(--display)] text-lg font-semibold"
                    >
                      {contribution.repository}
                      <ExternalLink size={14} strokeWidth={1.75} />
                    </a>
                    <span className="text-[var(--line)]">/</span>
                    <span className="text-[var(--ink)]">{contribution.title[lang]}</span>
                  </div>
                  <div className="mt-1 font-mono text-xs text-[var(--faint)]">
                    {contribution.meta[lang]}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
