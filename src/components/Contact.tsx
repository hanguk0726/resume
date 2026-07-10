import { FileText, Github, Mail, PenLine } from "lucide-react";
import type { Lang, Site } from "../types";

const BASE = import.meta.env.BASE_URL;

interface Props {
  site: Site;
  lang: Lang;
}

export default function Contact({ site, lang }: Props) {
  const links = [
    { icon: <Mail size={16} strokeWidth={1.75} />, label: site.email, href: `mailto:${site.email}`, external: false, download: false },
    { icon: <Github size={16} strokeWidth={1.75} />, label: "GitHub", href: site.github, external: true, download: false },
    { icon: <PenLine size={16} strokeWidth={1.75} />, label: "Medium", href: site.medium, external: true, download: false },
    { icon: <FileText size={16} strokeWidth={1.75} />, label: lang === "ko" ? "이력서 PDF" : "Resume (PDF)", href: `${BASE}${site.resume[lang]}`, external: false, download: true },
  ];

  return (
    <section id="contact" className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-3xl px-5 py-14 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {lang === "ko" ? "연락하기" : "Get in touch"}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-slate-600">
          {lang === "ko"
            ? "제품을 함께 만들거나 협업할 기회에 열려 있습니다."
            : "Open to building products together and to collaboration."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              {...(l.download ? { download: "" } : {})}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-600"
            >
              {l.icon}
              {l.label}
            </a>
          ))}
        </div>
        <p className="mt-10 text-xs text-slate-400">
          © {site.name.en} · {site.headline.en}
        </p>
      </div>
    </section>
  );
}
