type SectionHeadingProps = {
  label: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionHeading({ label, title, description, align = "left" }: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl";

  return (
    <div className={`space-y-4 ${alignment}`}>
      <p className="section-label">{label}</p>
      <h2 className="font-display text-3xl font-semibold leading-tight text-slate-950 md:text-5xl">{title}</h2>
      <p className="text-base leading-8 text-slate-600 md:text-lg">{description}</p>
    </div>
  );
}
