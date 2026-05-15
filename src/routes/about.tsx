import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMeta } from "../hooks/useMeta";
import Experience from "../components/Experience";
import Header from "../components/Header";
import TechSummary from "../components/TechSummary";
import { Mail, Github } from "lucide-react";
import type { AboutTranslations, ExperienceGroup } from "../types";

export default function About() {
  const [translations, setTranslations] = useState<AboutTranslations | null>(null);
  const [experiences, setExperiences] = useState<ExperienceGroup[]>([]);
  const [error, setError] = useState(false);
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "ko";

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
      try {
        const [aboutRes, experienceRes] = await Promise.all([
          fetch("/resume/assets/about.json"),
          fetch("/resume/assets/experience.json"),
        ]);

        if (!aboutRes.ok || !experienceRes.ok) throw new Error("Failed");

        const aboutData = await aboutRes.json();
        const experienceData = await experienceRes.json();

        setTranslations(aboutData.translations);
        setExperiences(experienceData.experiences);
      } catch {
        setError(true);
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          {lang === "ko" ? "데이터를 불러올 수 없습니다." : "Failed to load data."}
        </p>
      </div>
    );
  }

  if (!translations) {
    return <div className="min-h-screen" />;
  }

  return (
    <div className="px-4 py-6 w-full max-w-[600px] mx-auto font-sans text-gray-800 leading-relaxed text-[17px]">
      <Header />

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          {translations.helloText[lang]}
        </h1>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail size={18} strokeWidth={1.5} />
            <span>{translations.emailText}</span>
          </div>

          <a
            href={translations.githubText}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={18} strokeWidth={1.5} />
            <span>GitHub</span>
          </a>
        </div>

        <div className="mt-6 space-y-3 text-gray-700">
          <p>{translations.interestedText[lang]}</p>
          <p>{translations.backgroundText[lang]}</p>
          <p>{translations.projectText[lang]}</p>
        </div>
      </div>

      <TechSummary lang={lang} />

      <Experience experiences={experiences} lang={lang} />
    </div>
  );
}
