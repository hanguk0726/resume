import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // react-router-dom 훅
import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";
import { useMeta } from "../hooks/useMeta";
export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "ko";

  useMeta([
    { title: "Projects - HanGuk Shin" },
    { name: "description", content: "Resume of HanGuk Shin." },
    { name: "keywords", content: "Dev, Resume, HanGuk Shin" },
    { property: "og:title", content: "About - HanGuk Shin" },
    { property: "og:description", content: "Resume of HanGuk Shin." },
    { property: "og:type", content: "website" },
  ]);
  useEffect(() => {
    const loadJson = async () => {
      try {
        const response = await fetch("/resume/assets/projects.json");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error loading JSON:", error);
      }
    };
    loadJson();
  }, []);

  const handleNavClick = (projectTitle: string) => {
    const element = document.getElementById(projectTitle);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="bg-gray-100">
      {/* 고정된 내비 */}
      <div
        className="fixed left-0 top-0 w-64 h-full bg-gray-100 shadow-lg overflow-y-auto p-4 z-10
                hidden lg:block"
      >
        <div className="space-y-2 mt-16">
          {projects.map((project) => (
            <div key={project.title}>
              <button
                onClick={() => handleNavClick(project.title)}
                className="text-gray-600 hover:text-blue-600 transition-colors text-left w-full"
              >
                {project.title}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 메인 콘텐츠 - 전체 화면 너비 기준 중앙 정렬 */}
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
