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
      <div className="grid gap-4 sm:grid-cols-2">
        {site.capabilities.map((cap) => (
          <div
            key={cap.id}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <h3 className="text-base font-semibold text-slate-900">
              {cap.title[lang]}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {cap.items.map((item) => (
                <li
                  key={item.en}
                  className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                >
                  {item[lang]}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-blue-600"
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
                className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500"
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
