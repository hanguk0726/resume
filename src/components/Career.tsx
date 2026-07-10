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
      <div className="space-y-8">
        {experiences.map((group) => (
          <div key={group.category.en}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {group.category[lang]}
            </h3>
            <ul className="space-y-5 border-l border-slate-200 pl-5">
              {group.entries.map((e) => (
                <li key={`${e.company}-${e.start}`} className="relative">
                  <span className="absolute -left-[23px] top-2 h-2 w-2 rounded-full bg-slate-300" />
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-semibold text-slate-900">{e.company}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-700">{e.title[lang]}</span>
                  </div>
                  <div className="mt-0.5 text-sm text-slate-500">
                    {periodLabel(e, lang)} · {e.location[lang]}
                  </div>
                  {e.summary[lang] ? (
                    <p className="mt-1.5 text-sm text-slate-600">{e.summary[lang]}</p>
                  ) : null}
                  {e.responsibilities.length ? (
                    <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-sm text-slate-600">
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
