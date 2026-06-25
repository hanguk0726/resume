export interface Entry {
  company: Record<string, string>;
  location: Record<string, string>;
  period: string;
  position: Record<string, string>;
}

export interface ExperienceGroup {
  category: Record<string, string>;
  entries: Entry[];
}

export interface Project {
  title: string;
  description: Record<string, string>;
  keyword: string[];
  techStacks: string[];
  personal: boolean;
  links: string[];
  date: {
    startMonth: number;
    startYear: number;
    endMonth: number | null;
    endYear: number | null;
  };
  article: Record<string, string>;
}

export interface AboutTranslations {
  helloText: Record<string, string>;
  emailText: string;
  githubText: string;
  interestedText: Record<string, string>;
  backgroundText: Record<string, string>;
  projectText: Record<string, string>;
  linkText: string;
  contributingText: Record<string, string>;
  contributingMinimp4Text: Record<string, string>;
  contributingNokhwaText: Record<string, string>;
  linkMinimp4Text: string;
  linkNokhwaText: string;
  linkOpenGlTextEn: string;
  linkOpenGlTextKo: string;
}
