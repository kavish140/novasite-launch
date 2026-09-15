/**
 * Sparkline — tiny inline SVG sparkline.
 * No extra dependency, pure SVG path from data points.
 * Renders at height 32 by default; fills with a gradient.
 */

interface SparklineProps {
  data: number[];
  color?: string;          // stroke hex/hsl, e.g. "hsl(var(--primary))"
  height?: number;
  width?: number;
}

export default function Sparkline({
  data,
  color = "hsl(var(--primary))",
  height = 32,
  width = 80,
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * w;
    const y = pad + h - ((v - min) / range) * h;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const fillD = `${pathD} L ${pad + w},${pad + h} L ${pad},${pad + h} Z`;

  const gradId = `spark-${color.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <path d={fillD} fill={`url(#${gradId})`} />
      {/* Line */}
      <path d={pathD} stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      <circle
        cx={points[points.length - 1].split(",")[0]}
        cy={points[points.length - 1].split(",")[1]}
        r={2.5}
        fill={color}
      />
    </svg>
  );
}
