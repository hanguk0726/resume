import { useEffect, useState } from "react";
import type { ExperienceGroup, Project, Site } from "../types";

const BASE = import.meta.env.BASE_URL;

export interface Content {
  site: Site;
  projects: Project[];
  experiences: ExperienceGroup[];
}

export function useContent(): Content | null {
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [site, projects, experience] = await Promise.all([
          fetch(`${BASE}assets/site.json`).then((r) => r.json()),
          fetch(`${BASE}assets/projects.json`).then((r) => r.json()),
          fetch(`${BASE}assets/experience.json`).then((r) => r.json()),
        ]);
        if (active) {
          setContent({ site, projects, experiences: experience.experiences });
        }
      } catch (error) {
        console.error("Failed to load content:", error);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return content;
}
