import Image from "next/image";
import type { ResourceItem } from "@/lib/types";

type ResourceGridProps = {
  resources: ResourceItem[];
  context: "home" | "sources";
  dense?: boolean;
};

export function ResourceGrid({ resources, context, dense = false }: ResourceGridProps) {
  return (
    <div className={`grid gap-6 ${dense ? "md:grid-cols-2" : "lg:grid-cols-2 xl:grid-cols-4"}`}>
      {resources.map((resource) => {
        const content = resource[context];

        return (
          <article
            key={resource.id}
            className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
          >
            <div className="relative overflow-hidden border-b border-slate-100 bg-slate-50">
              <Image
                src={`/${resource.media.src}`}
                alt={resource.media.alt}
                width={resource.media.width}
                height={resource.media.height}
                className="h-auto w-full transition duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute left-4 top-4 rounded-full bg-slate-950/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                {resource.media.label}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-6">
              <div className="space-y-3">
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  {content.badge}
                </span>
                <h3 className="font-display text-2xl font-semibold leading-tight text-slate-950">{content.title}</h3>
                <p className="text-sm font-semibold text-sky-700">{content.kicker}</p>
                {content.description ? <p className="text-sm leading-7 text-slate-600">{content.description}</p> : null}
              </div>

              <div className="mt-auto">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-secondary inline-flex"
                >
                  {resource.cta}
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
