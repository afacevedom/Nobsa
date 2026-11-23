interface SectionHeaderProps {
  index: string;
  eyebrow: string;
  title: string;
  lead?: string;
  dark?: boolean;
  as?: 'h1' | 'h2';
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  lead,
  dark = false,
  as = 'h2',
}: SectionHeaderProps) {
  const HeadingTag = as;
  return (
    <div className="max-w-3xl">
      <div className="mb-3.5 flex items-center gap-3 sm:mb-4">
        <span
          className={`font-mono text-xs tracking-widest uppercase ${
            dark ? 'text-trigo-soft' : 'text-grana'
          }`}
        >
          {index}
        </span>
        <span className={`h-px w-8 ${dark ? 'bg-lana/30' : 'bg-tinta/25'}`} aria-hidden="true" />
        <span
          className={`font-mono text-[11px] tracking-[0.16em] uppercase sm:text-xs ${
            dark ? 'text-lana/70' : 'text-tinta-muted'
          }`}
        >
          {eyebrow}
        </span>
      </div>
      <HeadingTag
        className={`font-display text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl ${
          dark ? 'text-lana' : 'text-tinta'
        }`}
      >
        {title}
      </HeadingTag>
      {lead && (
        <p
          className={`mt-4 text-sm leading-relaxed sm:text-base lg:text-lg ${
            dark ? 'text-lana/75' : 'text-tinta-muted'
          }`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
