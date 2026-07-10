import type { Lang, Site } from "../types";
import Section from "./Section";

interface Props {
  site: Site;
  lang: Lang;
}

export default function Interests({ site, lang }: Props) {
  const { interests } = site;
  return (
    <Section
      id="interests"
      title={lang === "ko" ? "관심 영역과 협업 방향" : "Interests & Collaboration"}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {lang === "ko" ? "관심 있는 문제" : "Problems I care about"}
          </h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-600">
            {interests.problems.map((p) => (
              <li key={p.en}>{p[lang]}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {lang === "ko" ? "잘 맞는 역할" : "Good-fit roles"}
          </h3>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {interests.goodFitRoles.map((role) => (
              <li
                key={role}
                className="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-600"
              >
                {role}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-6 border-l-2 border-blue-200 pl-4 italic text-slate-600">
        {interests.preference[lang]}
      </p>
    </Section>
  );
}
