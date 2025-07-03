import { useEffect, useState } from "react";
import { useSearchParams } from "@remix-run/react";
import Experience from "~/components/Experience";
import Header from "~/components/Header";
import { useMeta } from "~/hooks/useMeta";

export default function About() {
  const [translations, setTranslations] = useState<any>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "ko";
  // 메타 태그 일괄 등록
  useMeta([
    { title: "About - HanGuk Shin" },
    { name: "description", content: "Resume of HanGuk Shin." },
    { name: "keywords", content: "Dev, Resume, HanGuk Shin" },
    { property: "og:title", content: "About - HanGuk Shin" },
    { property: "og:description", content: "Resume of HanGuk Shin." },
    { property: "og:type", content: "website" },
  ]);

  useEffect(() => {
    const loadData = async () => {
      const [aboutRes, experienceRes] = await Promise.all([
        fetch("/resume/assets/about.json"),
        fetch("/resume/assets/experience.json"),
      ]);

      const aboutData = await aboutRes.json();
      const experienceData = await experienceRes.json();

      setTranslations(aboutData.translations);
      setExperiences(experienceData.experiences);
    };

    loadData();
  }, []);

  if (!translations) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto font-sans text-gray-800 w-[600px] leading-relaxed text-[17px]">
      <Header />
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
