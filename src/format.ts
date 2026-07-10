import type { Lang, Localized, Project } from "./types";

export function localizedText(value: string | Localized, lang: Lang): string {
  return typeof value === "string" ? value : value[lang];
}

export function periodLabel(
  p: { start: string; end: string | null },
  lang: Lang
): string {
  const end = p.end ?? (lang === "ko" ? "현재" : "Present");
  return `${p.start} – ${end}`;
}

export function yearLabel(p: { start: string; end: string | null }): string {
  const startYear = p.start.slice(0, 4);
  const endYear = p.end ? p.end.slice(0, 4) : null;
  return endYear && endYear !== startYear ? `${startYear}–${endYear}` : startYear;
}

const TYPE_LABELS: Record<Project["type"], Record<Lang, string>> = {
  company: { ko: "회사", en: "Company" },
  freelance: { ko: "프리랜서", en: "Freelance" },
  personal: { ko: "개인", en: "Personal" },
};

export function typeLabel(t: Project["type"], lang: Lang): string {
  return TYPE_LABELS[t][lang];
}
