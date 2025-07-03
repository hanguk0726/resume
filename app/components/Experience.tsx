import { ExperienceGroup } from "~/types";

interface Props {
  experiences: ExperienceGroup[];
  lang: string;
}

export default function Experience({ experiences, lang }: Props) {
  return (
    <section className="space-y-8">
      {experiences.map((group) => (
        <div key={group.category[lang]}>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {group.category[lang]}
          </h2>
          <ul className="space-y-2">
            {group.entries.map((entry) => (
              <li
                key={entry.company[lang]}
                className="text-sm border-l-4 border-blue-500 pl-3"
              >
                <p className="font-semibold">{entry.company[lang]}</p>
                <p className="text-gray-600">
                  {entry.location[lang]} · {entry.period}
                </p>
                <p className="text-gray-700">{entry.position[lang]}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
