	import { json } from "@remix-run/node";
	import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
	import { loadTomlData } from "~/utils/toml";
	import ProjectCard from "~/components/ProjectCard";
import Header from "~/components/Header";

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
      <Header />

      <h1 className="text-3xl font-bold mb-4">
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
