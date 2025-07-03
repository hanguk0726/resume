import { json, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { loadTomlData } from "~/utils/toml";
import ProjectCard from "~/components/ProjectCard";
import Header from "~/components/Header";

export const meta: MetaFunction = () => {
  return [
    { title: "HanGuk Shin Resume" },
    { name: "HanGuk Shin Resume" },
  ];
};

export async function loader() {
  const data = await loadTomlData("app/data/projects.toml");
  return json({ projects: Object.values(data) });
}

export default function Index() {
  const { projects } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "ko";

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

      {/* 오른쪽 콘텐츠: 내비 너비 만큼 좌측 패딩 주고 중앙 정렬 */}
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
