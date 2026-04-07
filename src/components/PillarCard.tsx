import { PillarScore, getPillarSummary } from "@/lib/questions";

interface Props {
  pillar: PillarScore;
}

const PillarCard = ({ pillar }: Props) => {
  const summary = getPillarSummary(pillar.key, pillar.percentage);
  const barColor =
    pillar.percentage >= 75 ? "bg-secondary" : pillar.percentage >= 40 ? "bg-amber" : "bg-accent";

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{pillar.icon}</span>
          <h3 className="font-bold text-foreground">{pillar.label}</h3>
        </div>
        <span className="text-sm font-bold text-foreground">{pillar.percentage}%</span>
      </div>
      <div className="mb-3 h-2 w-full rounded-full bg-muted">
        <div className={`h-2 rounded-full ${barColor} transition-all duration-700`} style={{ width: `${pillar.percentage}%` }} />
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
      {pillar.key === "ownerIndependence" && (
        <a
          href="#"
          className="mt-3 inline-block text-sm font-semibold text-secondary hover:text-primary transition-colors"
        >
          Analyse my 8 Independence Sub-Drivers →
        </a>
      )}
    </div>
  );
};

export default PillarCard;
