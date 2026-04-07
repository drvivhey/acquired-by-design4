import { Results } from "@/lib/questions";
import RadialGauge from "./RadialGauge";
import SpiderChart from "./SpiderChart";
import PillarCard from "./PillarCard";
import { Button } from "@/components/ui/button";

interface Props {
  results: Results;
  onRetake: () => void;
}

const ResultsDashboard = ({ results, onRetake }: Props) => (
  <div className="mx-auto max-w-4xl space-y-10 px-4 py-12">
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-black tracking-tight text-foreground">
        Your Business Value Index
      </h1>
      <p className="text-muted-foreground">{results.band.description}</p>
    </div>

    {/* Gauge */}
    <div className="flex justify-center">
      <RadialGauge score={results.normalizedScore} bandLabel={results.band.label} bandColor={results.band.color} />
    </div>

    {/* Band Legend */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs font-medium">
      {[
        { label: "Fragile", range: "0–40", color: "hsl(0, 84%, 60%)" },
        { label: "Owner-Centric", range: "41–60", color: "hsl(40, 100%, 62%)" },
        { label: "Scalable Asset", range: "61–80", color: "hsl(173, 48%, 37%)" },
        { label: "Investment Grade", range: "81–100", color: "hsl(189, 72%, 30%)" },
      ].map((b) => (
        <div key={b.label} className="flex items-center justify-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: b.color }} />
          <span className="text-muted-foreground">{b.label} ({b.range})</span>
        </div>
      ))}
    </div>

    {/* Spider Chart */}
    <div>
      <h2 className="mb-4 text-center text-xl font-bold text-foreground">
        Your PROFIT Profile
      </h2>
      <SpiderChart pillarScores={results.pillarScores} />
    </div>

    {/* Pillar Cards */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {results.pillarScores.map((p) => (
        <PillarCard key={p.key} pillar={p} />
      ))}
    </div>

    {/* CTA */}
    <div className="text-center space-y-4 pt-4">
      <Button
        size="lg"
        className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-base font-bold rounded-lg shadow-md"
        asChild
      >
        <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">
          Book Your BVI Strategy Review
        </a>
      </Button>
      <div>
        <button onClick={onRetake} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Retake Assessment
        </button>
      </div>
    </div>
  </div>
);

export default ResultsDashboard;
