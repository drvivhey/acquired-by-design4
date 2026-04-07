interface Props {
  score: number;
  bandLabel: string;
  bandColor: string;
}

const RadialGauge = ({ score, bandLabel, bandColor }: Props) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-sm">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="12" />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={bandColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 100 100)"
          className="animate-gauge-fill"
          style={{ "--gauge-offset": offset } as React.CSSProperties}
        />
        <text x="100" y="92" textAnchor="middle" className="fill-foreground text-4xl font-black" style={{ fontSize: 40, fontFamily: "Satoshi, sans-serif" }}>
          {score}
        </text>
        <text x="100" y="115" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 13, fontFamily: "Satoshi, sans-serif" }}>
          out of 100
        </text>
      </svg>
      <div
        className="mt-3 rounded-full px-5 py-1.5 text-sm font-bold tracking-wide"
        style={{ backgroundColor: bandColor, color: "#fff" }}
      >
        {bandLabel}
      </div>
    </div>
  );
};

export default RadialGauge;
