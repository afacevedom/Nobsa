interface SparkPoint {
  label: string;
  value: number;
}

interface MiniSparklineProps {
  points: SparkPoint[];
  strokeColor: string;
  fillColor: string;
  unitSuffix?: string;
  ariaLabel: string;
}

export function MiniSparkline({
  points,
  strokeColor,
  fillColor,
  unitSuffix = '',
  ariaLabel,
}: MiniSparklineProps) {
  if (points.length < 2) return null;

  const width = 260;
  const height = 56;
  const padX = 6;
  const padY = 8;

  const values = points.map((p) => p.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const span = maxVal - minVal || 1;

  const coords = points.map((p, i) => {
    const x = padX + (i / (points.length - 1)) * (width - padX * 2);
    const y = height - padY - ((p.value - minVal) / span) * (height - padY * 2);
    return { x, y, ...p };
  });

  const linePath = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${height} L ${coords[0].x.toFixed(1)} ${height} Z`;

  const first = points[0];
  const last = points[points.length - 1];

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-14 w-full overflow-visible"
        role="img"
        aria-label={ariaLabel}
      >
        <path d={areaPath} fill={fillColor} />
        <path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={coords[coords.length - 1].x}
          cy={coords[coords.length - 1].y}
          r="3.2"
          fill={strokeColor}
        />
      </svg>
      <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-tinta-soft">
        <span>
          {first.label} ({Math.round(first.value * 10) / 10}
          {unitSuffix})
        </span>
        <span>
          {last.label} ({Math.round(last.value * 10) / 10}
          {unitSuffix})
        </span>
      </div>
    </div>
  );
}
