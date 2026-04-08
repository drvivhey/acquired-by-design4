import { Results } from "@/lib/questions";
import RadialGauge from "./RadialGauge";
import SpiderChart from "./SpiderChart";
import PillarCard from "./PillarCard";
import { Button } from "@/components/ui/button";

interface Props {
  results: Results;
  onRetake: () => void;
  businessName?: string;
}

const ResultsDashboard = ({ results, onRetake, businessName }: Props) => (
  <div className="mx-auto max-w-4xl space-y-10 px-4 py-12">
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-black tracking-tight text-foreground">
        {businessName ? `Your results for ${businessName}` : "Your business value index"}
      </h1>
      <p className="text-muted-foreground">{results.band.description}</p>
    </div>

    {/* Gauge */}
    <div className="flex justify-center">
      <RadialGauge score={results.normalizedScore} bandLabel={results.band.label} bandColor={results.band.color} />
    </div>

    {/* Band legend */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs font-medium">
      {[
        { label: "Fragile", range: "0\u201340", color: "hsl(18, 100%, 61%)" },
        { label: "Owner-centric", range: "41\u201360", color: "hsl(42, 100%, 62%)" },
        { label: "Scalable asset", range: "61\u201380", color: "hsl(177, 65%, 37%)" },
        { label: "Investment grade", range: "81\u2013100", color: "hsl(189, 69%, 30%)" },
      ].map((b) => (
        <div key={b.label} className="flex items-center justify-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: b.color }} />
          <span className="text-muted-foreground">{b.label} ({b.range})</span>
        </div>
      ))}
    </div>

    {/* Spider chart */}
    <div>
      <h2 className="mb-1 text-center text-xl font-bold text-foreground">
        Your PROFIT profile
      </h2>
      <p className="mb-4 text-center text-xs text-muted-foreground">
        Scored using the Wellspring PROFIT Framework
      </p>
      <SpiderChart pillarScores={results.pillarScores} />
    </div>

    {/* Pillar cards */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {results.pillarScores.map((p) => (
        <PillarCard key={p.key} pillar={p} />
      ))}
    </div>

    {/* CTA */}
    <div className="text-center space-y-4 pt-4">
      <Button
        size="lg"
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-bold rounded-lg shadow-md"
        asChild
      >
        <a href="https://calendar.app.google/GKw8okh4CmYDHRrJ8" target="_blank" rel="noopener noreferrer">
          Book your free Value Index review
        </a>
      </Button>
      <div>
        <button onClick={onRetake} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Retake assessment
        </button>
      </div>
    </div>
  </div>
);

export default ResultsDashboard;
