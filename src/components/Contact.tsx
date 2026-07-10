import { FileText, Github, PenLine } from "lucide-react";
import type { Lang, Site } from "../types";
import EmailCopyButton from "./EmailCopyButton";

const BASE = import.meta.env.BASE_URL;

interface Props {
  site: Site;
  lang: Lang;
}

export default function Contact({ site, lang }: Props) {
  const links = [
    { icon: <Github size={16} strokeWidth={1.75} />, label: "GitHub", href: site.github, external: true, download: false },
    { icon: <PenLine size={16} strokeWidth={1.75} />, label: "Medium", href: site.medium, external: true, download: false },
    { icon: <FileText size={16} strokeWidth={1.75} />, label: lang === "ko" ? "이력서 PDF" : "Resume (PDF)", href: `${BASE}${site.resume[lang]}`, external: false, download: true },
  ];

  return (
    <section id="contact" className="scroll-mt-16 border-t border-[var(--ink)] bg-[var(--paper-deep)]/80">
      <div className="journal-container py-16 text-center">
        <span className="section-kicker">07 / Contact</span>
        <h2 className="display-title mt-2 text-3xl sm:text-4xl">
          {lang === "ko" ? "연락하기" : "Get in touch"}
        </h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-[var(--muted)]">
          {lang === "ko"
            ? "제품을 함께 만들거나 협업할 기회에 열려 있습니다."
            : "Open to building products together and to collaboration."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <EmailCopyButton
            email={site.email}
            lang={lang}
            label={site.email}
            className="secondary-cta"
          />
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              {...(l.download ? { download: "" } : {})}
              className="secondary-cta"
            >
              {l.icon}
              {l.label}
            </a>
          ))}
        </div>
        <p className="mt-10 font-mono text-xs uppercase tracking-wider text-[var(--faint)]">
          © {site.name.en} · {site.headline.en}
        </p>
      </div>
    </section>
  );
}
