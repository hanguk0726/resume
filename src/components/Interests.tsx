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
          <h3 className="font-[family-name:var(--display)] text-lg font-semibold text-[var(--ink)]">
            {lang === "ko" ? "관심 있는 문제" : "Problems I care about"}
          </h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[var(--muted)] marker:text-[var(--accent)]">
            {interests.problems.map((p) => (
              <li key={p.en}>{p[lang]}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-[family-name:var(--display)] text-lg font-semibold text-[var(--ink)]">
            {lang === "ko" ? "잘 맞는 역할" : "Good-fit roles"}
          </h3>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {interests.goodFitRoles.map((role) => (
              <li
                key={role}
                className="tech-token"
              >
                {role}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-7 border-l-2 border-[var(--accent)] pl-4 font-[family-name:var(--display)] text-lg italic leading-relaxed text-[var(--muted)]">
        {interests.preference[lang]}
      </p>
    </Section>
  );
}
