import Image from "next/image";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  actions?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt,
  imageWidth = 640,
  imageHeight = 520,
  actions
}: PageHeroProps) {
  return (
    <section className="px-4 pt-4 md:px-6 md:pt-6">
      <div className="shell">
        <div className="hero-panel grid items-center gap-10 overflow-hidden px-6 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:py-12">
          <div className="space-y-6">
            <div className="eyebrow">{eyebrow}</div>
            <div className="space-y-4">
              <h1 className="font-display text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
                {title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 md:text-lg">{description}</p>
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>

          <div className="relative">
            <div className="absolute inset-0 -translate-x-4 translate-y-4 rounded-[36px] bg-emerald-200/45 blur-3xl" />
            <div className="relative rounded-[36px] border border-white/70 bg-white/70 p-4 shadow-2xl">
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
                className="h-auto w-full rounded-[28px]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
