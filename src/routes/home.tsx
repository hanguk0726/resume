import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";
import { useMeta } from "../hooks/useMeta";
import type { Project } from "../types";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState(false);
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "ko";

  useMeta([
    { title: "Projects - HanGuk Shin" },
    { name: "description", content: "Resume of HanGuk Shin." },
    { name: "keywords", content: "Dev, Resume, HanGuk Shin" },
    { property: "og:title", content: "Projects - HanGuk Shin" },
    { property: "og:description", content: "Resume of HanGuk Shin." },
    { property: "og:type", content: "website" },
  ]);

  useEffect(() => {
    const loadJson = async () => {
      try {
        const response = await fetch("/resume/assets/projects.json");
        if (!response.ok) throw new Error("Failed to load");
        const data = await response.json();
        setProjects(data);
      } catch {
        setError(true);
      }
    };
    loadJson();
  }, []);

  const handleNavClick = (projectTitle: string) => {
    const element = document.getElementById(projectTitle);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">
          {lang === "ko" ? "데이터를 불러올 수 없습니다." : "Failed to load data."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      <div
        className="fixed left-0 top-0 w-64 h-full bg-gray-100 shadow-lg overflow-y-auto p-4 z-10
                hidden lg:block"
      >
        <div className="space-y-2 mt-16">
          {projects.map((project) => (
            <div key={project.title}>
              <button
                onClick={() => handleNavClick(project.title)}
                className="text-gray-600 hover:text-blue-600 transition-colors text-left w-full text-sm"
              >
                {project.personal && (
                  <span className="text-xs text-blue-500 mr-1">●</span>
                )}
                {project.title}
              </button>
            </div>
          ))}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="text-blue-500">●</span>
              <span>{lang === "ko" ? "개인 프로젝트" : "Personal"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center bg-gray-100 min-h-screen">
        <div className="px-4 py-6 max-w-3xl mx-auto font-sans text-gray-800 w-[600px] leading-relaxed text-[17px]">
          <Header />

          <div>
            <h1 className="text-3xl font-bold text-left mb-8">
              {lang === "ko" ? "프로젝트" : "Projects"}
            </h1>

            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.title} id={project.title}>
                  <ProjectCard project={project} lang={lang} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
