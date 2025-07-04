import type { ExperienceGroup } from "../types";

interface Props {
  experiences: ExperienceGroup[];
  lang: string;
}

export default function Experience({ experiences, lang }: Props) {
  return (
    <section className="space-y-10">
      {experiences.map((group) => (
        <div key={group.category[lang]}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-1">
            {group.category[lang]}
          </h2>
          <ul className="space-y-4">
            {group.entries.map((entry) => (
              <li
                key={entry.company[lang]}
                className="p-4 border-l-4 border-blue-500 bg-gray-50 rounded-md shadow-sm"
              >
                <p className="text-lg font-semibold text-gray-900">
                  {entry.company[lang]}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  {entry.location[lang]} · {entry.period}
                </p>
                <p className="text-base text-gray-700">
                  {entry.position[lang]}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div key={"contributing"}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-1">
          {lang === "ko" ? "기여" : "Contributing"}
        </h2>
        <ul className="space-y-4">
          <li
            key={"minimp4"}
            className="p-4 border-l-4 border-blue-500 bg-gray-50 rounded-md shadow-sm"
          >
            <p className="text-lg font-semibold text-gray-900">
              {lang === "ko"
                ? "mp4 muxing에 오디오 트랙을 추가하는 기능"
                : "Feature to add an audio track on mp4 muxing"}
            </p>
            <br />
            <a href="https://github.com/darkskygit/minimp4.rs/pull/3">
              <p className="text-base text-gray-700">
                https://github.com/darkskygit/minimp4.rs/pull/3
              </p>
            </a>
          </li>
          <li
            key={"nokhwa"}
            className="p-4 border-l-4 border-blue-500 bg-gray-50 rounded-md shadow-sm"
          >
            <p className="text-lg font-semibold text-gray-900">
              {lang === "ko"
                ? "yuv to rgb 디코딩 로직 개선"
                : "Improving the YUV to RGB decoding logic"}
            </p>
            <br />
            <a href="https://github.com/l1npengtul/nokhwa/pull/105">
              <p className="text-base text-gray-700">
                https://github.com/l1npengtul/nokhwa/pull/105
              </p>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
