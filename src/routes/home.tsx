import { useLang } from "../i18n";
import { useContent } from "../hooks/useContent";
import { useMeta } from "../hooks/useMeta";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Capabilities from "../components/Capabilities";
import Outcomes from "../components/Outcomes";
import FeaturedProjects from "../components/FeaturedProjects";
import Career from "../components/Career";
import Archive from "../components/Archive";
import Interests from "../components/Interests";
import Contact from "../components/Contact";

export default function Home() {
  const { lang, setLang } = useLang();
  const content = useContent();

  const title = content
    ? `${content.site.name[lang]} | ${content.site.headline[lang]}`
    : "HanGuk Shin";
  const description = content ? content.site.valueProp[lang] : "";

  useMeta({ lang, title, description });

  if (!content) {
    return <div className="journal-shell min-h-screen" aria-busy="true" />;
  }

  const { site, projects, experiences } = content;

  return (
    <div className="journal-shell min-h-screen">
      <Nav
        site={site}
        lang={lang}
        onToggleLang={() => setLang(lang === "ko" ? "en" : "ko")}
      />
      <main className="overflow-x-clip">
        <Hero site={site} lang={lang} />
        <Capabilities site={site} lang={lang} />
        <Outcomes site={site} lang={lang} />
        <FeaturedProjects projects={projects} lang={lang} />
        <Career experiences={experiences} lang={lang} />
        <Archive projects={projects} lang={lang} />
        <Interests site={site} lang={lang} />
        <Contact site={site} lang={lang} />
      </main>
    </div>
  );
}
