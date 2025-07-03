import { useEffect, useState } from "react";
import { Link, useSearchParams } from "@remix-run/react";
import ProjectCard from "~/components/ProjectCard";
import Header from "~/components/Header";
import { useMeta } from "~/hooks/useMeta";

export default function Index() {
  const [projects, setProjects] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "ko";

  // 메타 태그 일괄 등록
  useMeta([
    { title: "Resume - HanGuk Shin" },
    { name: "description", content: "Resume of HanGuk Shin." },
    { name: "keywords", content: "Dev, Resume" },
    { property: "og:title", content: "Resume - HanGuk Shin" },
    { property: "og:description", content: "Resume of HanGuk Shin." },
    { property: "og:type", content: "website" },
  ]);

  useEffect(() => {
    const loadJson = async () => {
      try {
        const response = await fetch("/assets/projects.json");
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
    <div className="flex min-h-screen">
      {/* 고정된 내비 */}
      <nav className="fixed top-0 left-0 w-48 h-screen overflow-y-auto border-r bg-white z-50 p-4 pt-24">
        <ul className="space-y-2">
          {projects.map((project: any) => (
            <li key={project.title}>
              <button
                onClick={() => handleNavClick(project.title)}
                className="text-blue-600 hover:underline text-left w-full"
              >
                {project.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 오른쪽 콘텐츠 */}
      <div className="ml-48 flex-1">
        <div className="px-4 py-6 max-w-3xl mx-auto font-sans text-gray-800 w-[600px] leading-relaxed text-[17px]">
          <Header />
          <div className="text-3xl font-bold mb-4">
            {lang === "ko" ? "프로젝트" : "Projects"}
          </div>
          <div className="space-y-8">
            {projects.map((project: any) => (
              <div
                key={project.title}
                id={project.title}
                className="scroll-mt-6"
              >
                <ProjectCard project={project} lang={lang} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
