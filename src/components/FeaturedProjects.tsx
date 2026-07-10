import { Calendar, ExternalLink } from "lucide-react";
import type { Lang, Project } from "../types";
import Section from "./Section";
import { periodLabel, typeLabel } from "../format";

function ProjectCard({ project, lang }: { project: Project; lang: Lang }) {
  const t = (ko: string, en: string) => (lang === "ko" ? ko : en);

  return (
    <article
      id={`project-${project.slug}`}
      className="scroll-mt-20 border-t-2 border-[var(--ink)] py-7 sm:py-9"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <h3 className="display-title text-2xl sm:text-3xl">{project.title}</h3>
        <span
          className={
            project.type === "personal"
              ? "border border-[var(--line)] px-1.5 py-0.5 font-mono text-[10px] uppercase text-[var(--muted)]"
              : "border border-[var(--accent)] px-1.5 py-0.5 font-mono text-[10px] uppercase text-[var(--accent-dark)]"
          }
        >
          {typeLabel(project.type, lang)}
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--faint)]">
          <Calendar size={14} strokeWidth={1.75} />
          {periodLabel(project.period, lang)}
        </span>
      </div>

      <p className="mt-4 font-[family-name:var(--display)] text-lg font-semibold leading-relaxed text-[var(--ink)]">
        {project.summary[lang]}
      </p>

      {project.role ? (
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          <span className="meta-label mr-1">{t("역할", "Role")}</span>
          {project.role[lang]}
        </p>
      ) : null}

      {project.problems?.length ? (
        <div className="mt-4">
          <h4 className="meta-label">
            {t("해결한 문제", "Problem")}
          </h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[var(--muted)] marker:text-[var(--accent)]">
            {project.problems.map((p) => (
              <li key={p.en}>{p[lang]}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {project.contributions?.length ? (
        <div className="mt-4">
          <h4 className="meta-label">
            {t("핵심 기여", "Contribution")}
          </h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[var(--ink)] marker:text-[var(--accent)]">
            {project.contributions.map((c) => (
              <li key={c.en}>{c[lang]}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {project.outcomes?.length ? (
        <div className="mt-4">
          <h4 className="meta-label">
            {t("결과", "Outcome")}
          </h4>
          <ul className="mt-2 space-y-1.5">
            {project.outcomes.map((o) => (
              <li key={o.label.en} className="flex flex-wrap items-baseline gap-2 text-sm">
                {o.before && o.after ? (
                  <span className="border-b border-[var(--accent)] font-mono font-semibold text-[var(--accent-dark)]">
                    {o.before} → {o.after}
                  </span>
                ) : (
                  <span className="text-[var(--accent)]">▹</span>
                )}
                <span className="text-[var(--ink)]">
                  {o.label[lang]}
                  {o.detail ? (
                    <span className="text-[var(--muted)]"> — {o.detail[lang]}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.techStacks.map((tech) => (
          <span
            key={tech}
            className="tech-token"
          >
            {tech}
          </span>
        ))}
      </div>

      {project.links.length ? (
        <div className="mt-4 flex flex-wrap gap-4">
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link inline-flex items-center gap-1 font-mono text-xs"
            >
              <ExternalLink size={14} strokeWidth={1.75} />
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}

interface Props {
  projects: Project[];
  lang: Lang;
}

export default function FeaturedProjects({ projects, lang }: Props) {
  const featured = projects.filter((p) => p.featured);
  return (
    <Section id="featured" title={lang === "ko" ? "대표 프로젝트" : "Featured Work"}>
      <div className="space-y-4">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} lang={lang} />
        ))}
      </div>
    </Section>
  );
}
