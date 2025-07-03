import { Project } from "~/types";

interface Props {
  project: Project;
  lang: string;
}

export default function ProjectCard({ project, lang }: Props) {
  return (
    <div className="border p-8 rounded-2xl shadow-md space-y-8 bg-white w-[600px] mx-auto text-[17px] leading-[1.75] text-gray-800 font-sans">
      {/* 타이틀 및 요약 */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">{project.title}</h2>
        <p className="mt-3 text-[18px] text-gray-900 leading-[1.8]">
          {project.description[lang]}
        </p>
      </div>

      {/* 날짜 */}
      <div className="text-[15px] text-gray-500">
        🗓️ {project.date.startYear}.
        {String(project.date.startMonth).padStart(2, "0")} ~{" "}
        {project.date.endYear}.{String(project.date.endMonth).padStart(2, "0")}
      </div>

      {/* 기술 스택 */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900">
          🛠 {lang === "ko" ? "기술 스택" : "Tech Stack"}
        </h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.techStacks.map((tech) => (
            <span
              key={tech}
              className="bg-gray-100 text-gray-900 text-[15px] px-2 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* 키워드 */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900">
          🔑 {lang === "ko" ? "키워드" : "Keywords"}
        </h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.keyword.map((key) => (
            <span
              key={key}
              className="bg-blue-100 text-blue-800 text-[15px] px-2 py-1 rounded-full"
            >
              {key}
            </span>
          ))}
        </div>
      </div>

      {/* 관련 링크 */}
      {project.links.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            🔗 {lang === "ko" ? "관련 링크" : "Links"}
          </h3>
          <ul className="list-disc list-inside text-blue-700 text-[15px] mt-2 space-y-1">
            {project.links.map((link, idx) => (
              <li key={link}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline break-all"
                >
                  Link {idx + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 상세 설명 */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900">
          📝 {lang === "ko" ? "프로젝트 설명" : "Project Description"}
        </h3>
        <div className="whitespace-pre-wrap text-[17px] text-gray-900 leading-[1.85] mt-3">
          {project.article[lang]}
        </div>
      </div>
    </div>
  );
}
