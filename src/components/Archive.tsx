import { ExternalLink } from "lucide-react";
import type { Lang, Project } from "../types";
import Section from "./Section";
import { yearLabel } from "../format";

interface Props {
  projects: Project[];
  lang: Lang;
}

export default function Archive({ projects, lang }: Props) {
  const archived = projects.filter((p) => !p.featured);
  if (!archived.length) return null;

  return (
    <Section
      id="archive"
      title={lang === "ko" ? "프로젝트 아카이브" : "Project Archive"}
      intro={
        lang === "ko"
          ? "대표 프로젝트 외에 직접 만든 작업들입니다."
          : "Other things I've built beyond the featured work."
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {archived.map((p) => (
          <div key={p.slug} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-semibold text-slate-900">{p.title}</h3>
              <span className="shrink-0 text-xs text-slate-400">{yearLabel(p.period)}</span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{p.summary[lang]}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {p.techStacks.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500"
                >
                  {tech}
                </span>
              ))}
            </div>
            {p.links.length ? (
              <div className="mt-2 flex flex-wrap gap-3">
                {p.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                  >
                    <ExternalLink size={12} strokeWidth={1.75} />
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </Section>
  );
}
