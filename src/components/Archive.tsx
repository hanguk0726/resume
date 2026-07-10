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
          <div key={p.slug} className="paper-panel p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-[family-name:var(--display)] text-lg font-semibold text-[var(--ink)]">{p.title}</h3>
              <span className="shrink-0 font-mono text-xs text-[var(--faint)]">{yearLabel(p.period)}</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{p.summary[lang]}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {p.techStacks.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="tech-token"
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
                    className="text-link inline-flex items-center gap-1 font-mono text-xs"
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
