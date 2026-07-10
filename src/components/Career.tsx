import type { ExperienceGroup, Lang } from "../types";
import Section from "./Section";
import { periodLabel } from "../format";

interface Props {
  experiences: ExperienceGroup[];
  lang: Lang;
}

export default function Career({ experiences, lang }: Props) {
  return (
    <Section id="career" title={lang === "ko" ? "경력" : "Career"}>
      <div className="space-y-10">
        {experiences.map((group) => (
          <div key={group.category.en}>
            <h3 className="meta-label mb-4">
              {group.category[lang]}
            </h3>
            <ul className="space-y-6 border-l border-[var(--line)] pl-5">
              {group.entries.map((e) => (
                <li key={`${e.company}-${e.start}`} className="relative">
                  <span className="absolute -left-[23px] top-2 h-2 w-2 bg-[var(--accent)]" />
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-[family-name:var(--display)] text-lg font-semibold text-[var(--ink)]">{e.company}</span>
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
      </div>
    </Section>
  );
}
