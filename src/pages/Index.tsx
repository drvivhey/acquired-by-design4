import { useState } from "react";
import Navbar from "@/components/Navbar";
import QuestionCard from "@/components/QuestionCard";
import ResultsDashboard from "@/components/ResultsDashboard";
import { QUESTIONS, calculateResults, Results } from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cog, Handshake, KeyRound, BarChart3, Users, Monitor } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [results, setResults] = useState<Results | null>(null);
  const [started, setStarted] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessNameConfirmed, setBusinessNameConfirmed] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = (questionId: number, points: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: points }));
  };

  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);

  const handleSubmitDetails = async () => {
    const computed = calculateResults(answers);
    setSubmitting(true);

    try {
      const pillarMap: Record<string, number> = {};
      computed.pillarScores.forEach((p) => {
        pillarMap[p.key] = p.percentage;
      });

      const { error } = await supabase.from("bvi_responses").insert({
        business_name: businessName,
        first_name: firstName,
        email: email,
        total_score: computed.normalizedScore,
        band_name: computed.band.label,
        score_processes: pillarMap["processes"] ?? 0,
        score_relationships: pillarMap["relationships"] ?? 0,
        score_owner_independence: pillarMap["ownerIndependence"] ?? 0,
        score_financials: pillarMap["financials"] ?? 0,
        score_independent_team: pillarMap["independentTeam"] ?? 0,
        score_technology: pillarMap["technology"] ?? 0,
      });

      if (error) {
        console.error("Insert error:", error);
        toast.error("Something went wrong saving your results. Please try again.");
        setSubmitting(false);
        return;
      }

      // Send email notification (fire and forget)
      supabase.functions.invoke("notify-bvi-submission", {
        body: {
          firstName,
          businessName,
          email,
          totalScore: computed.normalizedScore,
          bandName: computed.band.label,
        },
      }).catch((err) => console.error("Email notification error:", err));

      setResults(computed);
      setDetailsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setResults(null);
    setStarted(false);
    setBusinessName("");
    setBusinessNameConfirmed(false);
    setFirstName("");
    setEmail("");
    setDetailsSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (results) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <ResultsDashboard results={results} onRetake={handleRetake} businessName={businessName} />
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
            Have you created a business that is sellable whether you want to or not?
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            Answer 12 questions across the six pillars that drive transferable business value. Get your score and discover where to focus.
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

  if (started && !businessNameConfirmed) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="mb-2 text-2xl font-black tracking-tight text-foreground">
            Before we begin
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            We'll use this to personalise your results.
          </p>
          <div className="text-left space-y-2 mb-8">
            <label className="text-sm font-medium text-foreground">What is your business called?</label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Acme Consulting"
              className="w-full"
            />
          </div>
          <Button
            size="lg"
            onClick={() => setBusinessNameConfirmed(true)}
            disabled={!businessName.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-base font-bold rounded-lg disabled:opacity-40"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // After all questions answered, show detail capture
  if (allAnswered && !detailsSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="mb-2 text-2xl font-black tracking-tight text-foreground">
            Almost there
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Enter your details to see your personalised results.
          </p>
          <div className="text-left space-y-4 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">First name</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Vivienne"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. you@company.com"
                className="w-full"
              />
            </div>
          </div>
          <Button
            size="lg"
            onClick={handleSubmitDetails}
            disabled={!firstName.trim() || !email.trim() || submitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-base font-bold rounded-lg disabled:opacity-40"
          >
            {submitting ? "Submitting..." : "View my results"}
          </Button>
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

        {!allAnswered && (
          <div className="mt-8 text-center">
            <Button
              size="lg"
              disabled
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-base font-bold rounded-lg disabled:opacity-40"
            >
              Answer all questions to continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
