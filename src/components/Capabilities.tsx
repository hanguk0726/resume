import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Lang, Site } from "../types";
import Section from "./Section";

interface Props {
  site: Site;
  lang: Lang;
}

export default function Capabilities({ site, lang }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Section id="capabilities" title={lang === "ko" ? "핵심 역량" : "Core Capabilities"}>
      <div className="grid gap-3 sm:grid-cols-2">
        {site.capabilities.map((cap) => (
          <div
            key={cap.id}
            className="paper-panel p-5 sm:p-6"
          >
            <h3 className="font-[family-name:var(--display)] text-lg font-semibold text-[var(--ink)]">
              {cap.title[lang]}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {cap.items.map((item) => (
                <li
                  key={item.en}
                  className="tech-token"
                >
                  {item[lang]}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 border-l-2 border-[var(--accent)] pl-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        >
          <ChevronDown
            size={16}
            strokeWidth={1.75}
            className={open ? "rotate-180 transition-transform" : "transition-transform"}
          />
          {lang === "ko" ? "전체 기술 목록" : "Full tech stack"}
        </button>
        {open ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {site.fullTechStack.map((tech) => (
              <li
                key={tech}
                className="tech-token"
              >
                {tech}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Section>
  );
}
