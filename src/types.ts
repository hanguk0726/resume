// Content model for the portfolio.
// All human-facing text is Localized; data lives in public/assets/*.json so it
// is the single source of truth for both the runtime app and the build-time
// prerender/llms.txt generation.

export type Lang = "ko" | "en";
export type Localized = Record<Lang, string>;

export interface CtaLink {
  kind: "projects" | "resume" | "github" | "email" | "medium" | "external";
  label: Localized;
  href: string; // URL or in-page anchor. Empty for app-resolved resume/email actions.
}

export interface Capability {
  id: string;
  title: Localized;
  items: Localized[];
}

export interface SignatureOutcome {
  label: Localized; // result headline
  before?: string;
  after?: string;
  context: Localized; // problem context + core action
  projectSlug?: string;
}

export interface Interests {
  problems: Localized[];
  goodFitRoles: string[];
  preference: Localized;
}

export interface Site {
  name: Localized;
  headline: Localized; // Product Engineer · Mobile, Media & Distributed Systems
  valueProp: Localized; // one-sentence value proposition
  intro: Localized; // hero paragraph
  meta: {
    location: Localized;
    languages: Localized;
    focus: Localized;
  };
  email: string;
  github: string;
  medium: string;
  resume: { ko: string; en: string }; // paths to generated PDFs
  ctas: CtaLink[];
  capabilities: Capability[];
  fullTechStack: string[];
  signatureOutcomes: SignatureOutcome[];
  interests: Interests;
}

export interface Outcome {
  label: Localized;
  before?: string;
  after?: string;
  detail?: Localized;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  type: "company" | "freelance" | "personal";
  featured: boolean;
  period: { start: string; end: string | null }; // "YYYY.MM"
  summary: Localized;
  role?: Localized;
  problems?: Localized[];
  contributions?: Localized[];
  outcomes?: Outcome[];
  techStacks: string[];
  keywords: string[];
  capabilities: string[];
  links: ProjectLink[];
}

export interface Experience {
  company: string;
  title: Localized;
  start: string; // "YYYY.MM"
  end: string | null;
  location: Localized;
  employmentType: "full-time" | "contract" | "freelance" | "personal" | "education";
  summary: Localized;
  responsibilities: Localized[];
  relatedProjectSlugs: string[];
}

export interface ExperienceGroup {
  category: Localized;
  entries: Experience[];
}
