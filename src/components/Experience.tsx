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
    </section>
  );
}
