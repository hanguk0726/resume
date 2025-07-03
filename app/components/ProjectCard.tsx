import { Project } from  "~/types";

interface Props {
  project: Project;
  lang: string;
}

export default function ProjectCard({ project, lang }: Props) {
  return (
    <div className="border p-6 rounded-2xl shadow-md space-y-4 bg-white w-[600px]">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{project.title}</h2>
        <p className="text-gray-600 mt-1">{project.description[lang]}</p>
      </div>
      <div className="text-sm text-gray-500">
        🗓️ {project.date.startYear}.
        {String(project.date.startMonth).padStart(2, "0")} ~{" "}
        {project.date.endYear}.{String(project.date.endMonth).padStart(2, "0")}
      </div>
      <div>
        <h3 className="font-semibold text-gray-700">기술 스택</h3>
        <div className="flex flex-wrap gap-2 mt-1">
          {project.techStacks.map((tech) => (
            <span
              key={tech}
              className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-700">키워드</h3>
        <div className="flex flex-wrap gap-2 mt-1">
          {project.keyword.map((key) => (
            <span
              key={key}
              className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
            >
              {key}
            </span>
          ))}
        </div>
      </div>
      {project.links.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700">관련 링크</h3>
          <ul className="list-disc list-inside text-blue-600 underline mt-1">
            {project.links.map((link, idx) => (
              <li key={link}>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  🔗 링크 {idx + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h3 className="font-semibold text-gray-700">프로젝트 설명</h3>
        <div className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed mt-1">
          {project.article[lang]}
        </div>
      </div>
    </div>
  );
}
