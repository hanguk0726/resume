import type { ReactNode } from "react";

interface Props {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}

export default function Section({ id, title, intro, children }: Props) {
  const index: Record<string, string> = {
    capabilities: "01",
    outcomes: "02",
    featured: "03",
    career: "04",
    archive: "05",
    interests: "06",
  };

  return (
    <section id={id} className="journal-section">
      <div className="journal-section-inner">
        <div className="grid gap-2 sm:grid-cols-[3.5rem_1fr] sm:items-start sm:gap-4">
          <span className="section-kicker pt-1" aria-hidden="true">
            {index[id] ?? "//"}
          </span>
          <div>
            <h2 className="display-title text-3xl sm:text-4xl">{title}</h2>
            {intro ? <p className="mt-2 max-w-2xl leading-relaxed text-[var(--muted)]">{intro}</p> : null}
          </div>
        </div>
        <div className="mt-7 sm:mt-8">{children}</div>
      </div>
    </section>
  );
}
