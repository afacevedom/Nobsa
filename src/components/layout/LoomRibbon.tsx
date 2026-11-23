interface LoomRibbonProps {
  className?: string;
  height?: 'thin' | 'thick';
}

export function LoomRibbon({ className = '', height = 'thin' }: LoomRibbonProps) {
  const h = height === 'thick' ? 'h-2' : 'h-1';
  return (
    <div
      className={`grid w-full grid-cols-12 ${h} ${className}`}
      aria-hidden="true"
    >
      <span className="col-span-3 bg-grana" />
      <span className="col-span-2 bg-trigo" />
      <span className="col-span-2 bg-musgo" />
      <span className="col-span-2 bg-indigo-telar" />
      <span className="col-span-1 bg-lana-deep" />
      <span className="col-span-2 bg-grana" />
    </div>
  );
}
