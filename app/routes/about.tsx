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
    <div className="px-4 py-6 max-w-3xl mx-auto font-sans text-gray-800 leading-relaxed text-[17px]">
      <nav className="flex justify-between items-center mb-6">
        <div className="space-x-4">
          <Link to="/" className="text-blue-600 hover:underline">
            💻 Develop
          </Link>
          <Link to="/about" className="text-blue-600 hover:underline">
            👤 About
          </Link>
        </div>
        <Link
          to={`/about?lang=${toggleLang}`}
          className="text-blue-600 hover:underline"
        >
          {toggleLang === "ko" ? "🇰🇷 한국어로 보기" : "🇺🇸 View in English"}
        </Link>
      </nav>

      <h1 className="text-3xl font-bold mb-4">
        {translations.helloText[lang]}
      </h1>

      <div className="space-y-3">
        <p>📧 {translations.emailText}</p>

        <p>
          <a
            href={translations.githubText}
            className="text-blue-600 hover:underline break-all"
          >
            🐙 GitHub Link
          </a>
        </p>

        <p>{translations.interestedText[lang]}</p>
        <p>{translations.backgroundText[lang]}</p>
        <p>{translations.projectText[lang]}</p>
      </div>

      <hr className="my-6 border-t border-gray-300" />

      <Experience experiences={experiences} lang={lang} />
    </div>
  );
}
  