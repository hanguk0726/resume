import { useEffect, useState } from "react";
import { Link, useSearchParams } from "@remix-run/react";
import ProjectCard from "~/components/ProjectCard";
import Header from "~/components/Header";
import { MetaFunction } from "@remix-run/node";
export const meta: MetaFunction = () => {
  return [
	{ title: "Resume - HanGuk Shin" },
	{ name: "description", content: "Resume of HanGuk Shin." },
	{
	  name: "keywords",
	  content: "Dev, Resume",
	},
	{ property: "og:title", content: "About - HanGuk Shin" },
	{
	  property: "og:description",
	  content: "Resume of HanGuk Shin.",
	},
	{ property: "og:type", content: "website" },
  ];
};
export default function Index() {
  const [projects, setProjects] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "ko";

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

  return (
    <div className="relative">
      {/* 고정된 내비 */}
      <nav className="fixed top-20 left-0 w-48 h-[80vh] overflow-y-auto border-r bg-white z-50 p-4">
        <ul className="space-y-2">
          {projects.map((project: any) => (
            <li key={project.title}>
              <a
                href={`#${project.title}`}
                className="text-blue-600 hover:underline"
              >
                {project.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 오른쪽 콘텐츠 */}
      <div className="px-4 py-6 max-w-3xl mx-auto font-sans text-gray-800 w-[600px] leading-relaxed text-[17px]">
        <Header />
        <div className="text-3xl font-bold mb-4">
          {lang === "ko" ? "프로젝트" : "Projects"}
        </div>
        <div className="space-y-4">
          {projects.map((project: any) => (
            <div key={project.title} id={project.title}>
              <ProjectCard project={project} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
