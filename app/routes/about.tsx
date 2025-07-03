import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { loadTomlData } from "~/utils/toml";
import Experience from "~/components/Experience";

export async function loader() {
  const aboutData = await loadTomlData("app/data/about.toml");
  const experienceData = await loadTomlData("app/data/experience.toml");
  return json({
    translations: aboutData.translations,
    experiences: experienceData.experiences,
  });
}

export default function About() {
  const { translations, experiences } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "ko";
  const toggleLang = lang === "ko" ? "en" : "ko";

  return (
    <div className="container mx-auto p-4">
      <nav className="flex justify-between items-center">
        <div className="space-x-4">
          <Link to="/" className="text-blue-600">
            💻 Develop
          </Link>
          <Link to="/about" className="text-blue-600">
            👤 About
          </Link>
        </div>
        <Link to={`/about?lang=${toggleLang}`} className="text-blue-600">
          {toggleLang === "ko" ? "🇰🇷 한국어로 보기" : "🇺🇸 View in English"}
        </Link>
      </nav>

      <h1 className="text-2xl font-bold my-4">
        {translations.helloText[lang]}
      </h1>
      <p>{translations.emailText}</p>
      <p>
        <a href={translations.githubText} className="text-blue-600">
          {translations.githubText}
        </a>
      </p>
      <p>{translations.interestedText[lang]}</p>
      <p>{translations.backgroundText[lang]}</p>
      <p>{translations.projectText[lang]}</p>
      <Experience experiences={experiences} lang={lang} />
    </div>
  );
}
