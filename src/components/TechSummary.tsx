import { Cpu, Server, Smartphone, Globe } from "lucide-react";

interface Props {
  lang: string;
}

const categories = [
  {
    icon: Smartphone,
    label: { ko: "모바일", en: "Mobile" },
    items: ["React Native", "Kotlin", "Jetpack Compose", "Flutter", "Expo"],
  },
  {
    icon: Server,
    label: { ko: "백엔드 & 인프라", en: "Backend & Infra" },
    items: ["Go", "Python", "Nginx", "Airflow", "Temporal", "Docker"],
  },
  {
    icon: Cpu,
    label: { ko: "미디어 & 저수준", en: "Media & Low-level" },
    items: ["OpenGL", "OpenCV", "Rust", "C++", "WebRTC", "MediaCodec"],
  },
  {
    icon: Globe,
    label: { ko: "웹", en: "Web" },
    items: ["TypeScript", "React", "Next.js", "Svelte", "Vue.js"],
  },
];

export default function TechSummary({ lang }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {lang === "ko" ? "기술 스택" : "Tech Stack"}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.label.en}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} strokeWidth={1.5} className="text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">
                  {cat.label[lang as "ko" | "en"] ?? cat.label.en}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
