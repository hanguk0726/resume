import { json } from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { loadTomlData } from "~/utils/toml";
import ProjectCard from "~/components/ProjectCard";

export async function loader() {
  const data = await loadTomlData("app/data/projects.toml");
  return json({ projects: Object.values(data) });
}

export default function Index() {
  const { projects } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "ko";
  const toggleLang = lang === "ko" ? "en" : "ko";

  return (
    <div className="p-4">
      <nav className="flex justify-between items-center w-[600px]">
        <div className="space-x-4">
          <Link to="/" className="text-blue-600">
            💻 Develop
          </Link>
          <Link to="/about" className="text-blue-600">
            👤 About
          </Link>
        </div>
        <Link to={`/?lang=${toggleLang}`} className="text-blue-600">
          {toggleLang === "ko" ? "🇰🇷 한국어로 보기" : "🇺🇸 View in English"}
        </Link>
      </nav>

      <h1 className="text-2xl font-bold my-4">
        {lang === "ko" ? "프로젝트" : "Projects"}
      </h1>
      <div className="grid gap-4">
        {projects.map((project: any) => (
          <ProjectCard key={project.title} project={project} lang={lang} />
        ))}
      </div>
    </div>
  );
}
