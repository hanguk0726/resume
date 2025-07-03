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
    endMonth: number;
    endYear: number;
  };
  article: Record<string, string>;
}
