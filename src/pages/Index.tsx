import { useState } from "react";
import Navbar from "@/components/Navbar";
import QuestionCard from "@/components/QuestionCard";
import ResultsDashboard from "@/components/ResultsDashboard";
import { QUESTIONS, calculateResults, Results } from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Cog, Handshake, KeyRound, BarChart3, Users, Monitor } from "lucide-react";

const Index = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [results, setResults] = useState<Results | null>(null);
  const [started, setStarted] = useState(false);

  const handleSelect = (questionId: number, points: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: points }));
  };

  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);

  const handleSubmit = () => {
    setResults(calculateResults(answers));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetake = () => {
    setAnswers({});
    setResults(null);
    setStarted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (results) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <ResultsDashboard results={results} onRetake={handleRetake} />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
            The PROFIT Framework
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-foreground md:text-5xl">
            What is your business actually worth to a buyer?
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            Answer 12 diagnostic questions across the six pillars that drive transferable business value. Get your score, see your profile, and discover where to focus.
          </p>
          <Button
            size="lg"
            onClick={() => setStarted(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-base font-bold rounded-lg"
          >
            Start your assessment
          </Button>
          <div className="mt-12 grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
            {[
              { icon: Cog, label: "Processes" },
              { icon: Handshake, label: "Relationships" },
              { icon: KeyRound, label: "Owner independence" },
              { icon: BarChart3, label: "Financials" },
              { icon: Users, label: "Independent team" },
              { icon: Monitor, label: "Technology" },
            ].map((p) => (
              <div key={p.label} className="flex flex-col items-center gap-1 text-xs font-medium text-muted-foreground">
                <p.icon size={18} className="text-primary" />
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight text-foreground">Business value diagnostic</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {Object.keys(answers).length} of {QUESTIONS.length} answered
          </p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
            <div
              className="h-1.5 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(Object.keys(answers).length / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {QUESTIONS.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              selectedPoints={answers[q.id]}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-base font-bold rounded-lg disabled:opacity-40"
          >
            View my results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
