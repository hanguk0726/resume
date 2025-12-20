import { Briefcase, GraduationCap, Globe, Award, GitPullRequest, MapPin } from "lucide-react";
import type { ExperienceGroup } from "../types";

interface Props {
  experiences: ExperienceGroup[];
  lang: string;
}

const categoryIcons: Record<string, any> = {
  "경력": Briefcase,
  "Career": Briefcase,
  "부트캠프": Award,
  "Bootcamp": Award,
  "교육": GraduationCap,
  "Education": GraduationCap,
  "어학": Globe,
  "Languages": Globe,
};

export default function Experience({ experiences, lang }: Props) {
  return (
    <section className="space-y-8">
      {experiences.map((group) => {
        const IconComponent = categoryIcons[group.category[lang]] || Briefcase;
        return (
          <div key={group.category[lang]} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
              <IconComponent size={20} strokeWidth={1.5} />
              {group.category[lang]}
            </h2>
            <ul className="space-y-4">
              {group.entries.map((entry) => (
                <li
                  key={entry.company[lang]}
                  className="pl-4 border-l-2 border-gray-200 hover:border-blue-400 transition-colors"
                >
                  <p className="text-lg font-semibold text-gray-900">
                    {entry.company[lang]}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPin size={14} strokeWidth={1.5} />
                    <span>{entry.location[lang]}</span>
                    <span className="mx-1">·</span>
                    <span>{entry.period}</span>
                  </div>
                  <p className="text-gray-700 mt-1">
                    {entry.position[lang]}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {/* Contributing Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
          <GitPullRequest size={20} strokeWidth={1.5} />
          {lang === "ko" ? "오픈소스 기여" : "Open Source Contributions"}
        </h2>
        <ul className="space-y-4">
          <li className="pl-4 border-l-2 border-gray-200 hover:border-green-400 transition-colors">
            <p className="text-lg font-semibold text-gray-900">
              {lang === "ko"
                ? "mp4 muxing에 오디오 트랙을 추가하는 기능"
                : "Feature to add an audio track on mp4 muxing"}
            </p>
            <a
              href="https://github.com/darkskygit/minimp4.rs/pull/3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 underline text-sm mt-1 inline-block"
            >
              darkskygit/minimp4.rs#3
            </a>
          </li>
          <li className="pl-4 border-l-2 border-gray-200 hover:border-green-400 transition-colors">
            <p className="text-lg font-semibold text-gray-900">
              {lang === "ko"
                ? "YUV to RGB 디코딩 로직 개선"
                : "Improving the YUV to RGB decoding logic"}
            </p>
            <a
              href="https://github.com/l1npengtul/nokhwa/pull/105"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 underline text-sm mt-1 inline-block"
            >
              l1npengtul/nokhwa#105
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
