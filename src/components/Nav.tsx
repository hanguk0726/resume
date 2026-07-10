import { Globe } from "lucide-react";
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
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
        <a href="#top" className="font-semibold tracking-tight text-slate-900">
          {site.name[lang]}
        </a>
        <div className="flex items-center gap-5">
          <ul className="hidden items-center gap-5 text-sm text-slate-600 md:flex">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="transition-colors hover:text-blue-600">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 transition-colors hover:border-blue-300 hover:text-blue-600"
            aria-label={lang === "ko" ? "Switch to English" : "한국어로 전환"}
          >
            <Globe size={15} strokeWidth={1.75} />
            {lang === "ko" ? "EN" : "한국어"}
          </button>
        </div>
      </nav>
    </header>
  );
}
