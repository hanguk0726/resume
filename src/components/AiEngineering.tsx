import { Bot, Zap, Shield, Repeat } from "lucide-react";

interface Props {
  lang: string;
}

const stats = [
  { value: "174", label: { ko: "세션", en: "sessions" } },
  { value: "248h", label: { ko: "협업 시간", en: "hours" } },
  { value: "135", label: { ko: "커밋", en: "commits" } },
  { value: "12+", label: { ko: "커스텀 스킬", en: "custom skills" } },
];

const approaches = [
  {
    icon: Shield,
    text: {
      ko: "AI의 거짓 보고를 구조적으로 차단하는 2-Phase 리포트 하니스와 독립 감사 에이전트 설계",
      en: "Designed 2-phase report harness and independent audit agents to structurally prevent AI hallucinations",
    },
  },
  {
    icon: Repeat,
    text: {
      ko: "반복되는 마찰을 일회성 수정이 아닌 영구 인프라(hook, rule, lint, skill)로 승격",
      en: "Elevate recurring friction into permanent infrastructure (hooks, rules, lint, skills) instead of one-off fixes",
    },
  },
  {
    icon: Zap,
    text: {
      ko: "병렬 서브에이전트로 탐색·검증·감사를 동시 수행하는 워크플로 구축",
      en: "Built workflows running parallel sub-agents for exploration, verification, and auditing simultaneously",
    },
  },
];

export default function AiEngineering({ lang }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
      <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
        <Bot size={20} strokeWidth={1.5} />
        {lang === "ko" ? "AI 엔지니어링" : "AI Engineering"}
      </h2>

      <p className="text-gray-700 mb-4 text-[15px]">
        {lang === "ko"
          ? "AI를 단순히 사용하는 것이 아니라, AI의 행동 자체를 시스템으로 설계하고 제약합니다."
          : "I don't just use AI — I engineer its behavior as a system, designing constraints and guardrails."}
      </p>

      {/* 정량 지표 */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {stats.map((s) => (
          <div key={s.value} className="text-center">
            <div className="text-lg font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500">
              {s.label[lang as "ko" | "en"] ?? s.label.en}
            </div>
          </div>
        ))}
      </div>

      {/* 접근 방식 */}
      <ul className="space-y-3">
        {approaches.map((a) => {
          const Icon = a.icon;
          return (
            <li key={a.text.en} className="flex items-start gap-2">
              <Icon
                size={16}
                strokeWidth={1.5}
                className="text-gray-400 mt-0.5 shrink-0"
              />
              <span className="text-sm text-gray-700">
                {a.text[lang as "ko" | "en"] ?? a.text.en}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
