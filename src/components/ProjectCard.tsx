import { Calendar, Wrench, Tag, Link as LinkIcon, FileText } from "lucide-react";
import type { Project } from "../types";

interface Props {
  project: Project;
  lang: string;
}

export default function ProjectCard({ project, lang }: Props) {
  return (
    <div className="border border-gray-200 p-8 rounded-2xl shadow-sm space-y-6 bg-white w-full max-w-[600px] mx-auto text-[17px] leading-[1.75] text-gray-800 font-sans">
      {/* 타이틀 및 요약 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{project.title}</h2>
        <p className="mt-2 text-gray-600 leading-relaxed">
          {project.description[lang]}
        </p>
      </div>

      {/* 날짜 */}
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <Calendar size={16} strokeWidth={1.5} />
        <span>
          {project.date.startYear}.
          {String(project.date.startMonth).padStart(2, "0")} ~{" "}
          {project.date.endYear && project.date.endMonth
            ? `${project.date.endYear}.${String(project.date.endMonth).padStart(2, "0")}`
            : lang === "ko" ? "진행중" : "Present"}
        </span>
      </div>

      {/* 기술 스택 */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
          <Wrench size={18} strokeWidth={1.5} />
          {lang === "ko" ? "기술 스택" : "Tech Stack"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {project.techStacks.map((tech) => (
            <span
              key={tech}
              className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* 키워드 */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
          <Tag size={18} strokeWidth={1.5} />
          {lang === "ko" ? "키워드" : "Keywords"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {project.keyword.map((key) => (
            <span
              key={key}
              className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full"
            >
              {key}
            </span>
          ))}
        </div>
      </div>

      {/* 관련 링크 */}
      {project.links.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-2">
            <LinkIcon size={18} strokeWidth={1.5} />
            {lang === "ko" ? "관련 링크" : "Links"}
          </h3>
          <ul className="space-y-1">
            {project.links.map((link, idx) => (
              <li key={link}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 underline text-sm break-all"
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
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
          <FileText size={18} strokeWidth={1.5} />
          {lang === "ko" ? "프로젝트 설명" : "Project Description"}
        </h3>
        <div className="whitespace-pre-wrap text-gray-700 leading-[1.85]">
          {project.article[lang]}
        </div>
      </div>
    </div>
  );
}
