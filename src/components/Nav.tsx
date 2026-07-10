import type { Lang, Site } from "../types";

interface Props {
  site: Site;
  lang: Lang;
  onToggleLang: () => void;
}

export default function Nav({ site, lang, onToggleLang }: Props) {
  const sections =
    lang === "ko"
      ? [
          { id: "capabilities", label: "역량" },
          { id: "outcomes", label: "성과" },
          { id: "featured", label: "프로젝트" },
          { id: "career", label: "경력" },
          { id: "contact", label: "연락처" },
        ]
      : [
          { id: "capabilities", label: "Capabilities" },
          { id: "outcomes", label: "Impact" },
          { id: "featured", label: "Work" },
          { id: "career", label: "Career" },
          { id: "contact", label: "Contact" },
        ];

  return (
    <header
      role="banner"
      className="sticky top-0 z-20 border-b border-[var(--line)] bg-[color:var(--paper)]/90 backdrop-blur-md"
    >
      <nav className="journal-container flex min-h-14 items-center justify-between gap-4 py-2">
        <a
          href="#top"
          className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
        >
          {site.name[lang]}<span className="ml-1 text-[var(--accent)]">/</span>
        </a>
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <ul className="hidden items-center gap-4 font-mono text-xs text-[var(--muted)] md:flex">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="border-b border-transparent pb-0.5 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onToggleLang}
            className="shrink-0 border border-[var(--line)] bg-[var(--paper-raised)]/50 px-2.5 py-1.5 font-mono text-xs font-semibold text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            aria-label={lang === "ko" ? "Switch to English" : "한국어로 전환"}
          >
            {lang === "ko" ? "KO → EN" : "EN → KO"}
          </button>
        </div>
      </nav>
    </header>
  );
}
