import { PillarScore, getPillarSummary } from "@/lib/questions";
import { Cog, Handshake, KeyRound, BarChart3, Users, Monitor } from "lucide-react";

import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Cog, Handshake, KeyRound, BarChart3, Users, Monitor,
};

interface Props {
  pillar: PillarScore;
}

const PillarCard = ({ pillar }: Props) => {
  const summary = getPillarSummary(pillar.key, pillar.percentage);
  const barColor =
    pillar.percentage >= 75 ? "bg-secondary" : pillar.percentage >= 40 ? "bg-amber" : "bg-accent";
  const IconComp = iconMap[pillar.icon];

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {IconComp && <IconComp size={18} className="text-primary" />}
          <h3 className="font-bold text-foreground">{pillar.label}</h3>
        </div>
        <span className="text-sm font-bold text-foreground">{pillar.percentage}%</span>
      </div>
      <div className="mb-3 h-2 w-full rounded-full bg-muted">
        <div className={`h-2 rounded-full ${barColor} transition-all duration-700`} style={{ width: `${pillar.percentage}%` }} />
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
    </div>
  );
};

export default PillarCard;
