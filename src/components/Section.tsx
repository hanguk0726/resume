import type { ReactNode } from "react";

interface Props {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}

export default function Section({ id, title, intro, children }: Props) {
  return (
    <section id={id} className="border-t border-slate-100">
      <div className="mx-auto max-w-3xl px-5 py-12">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        {intro ? <p className="mt-2 text-slate-600">{intro}</p> : null}
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
