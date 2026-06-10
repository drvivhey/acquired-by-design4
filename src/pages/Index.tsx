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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSelect = (questionId: number, points: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: points }));
    // auto-advance
    setTimeout(() => {
      if (currentIndex < QUESTIONS.length - 1) {
        setCurrentIndex((i) => i + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setShowDetails(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 200);
  };

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
    setCurrentIndex(0);
    setBusinessName("");
    setFirstName("");
    setEmail("");
    setDetailsSubmitted(false);
    setShowDetails(false);
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
          <h1 className="mb-4 text-4xl font-black tracking-tight text-foreground md:text-5xl">
            Is your business sellable, whether you want to exit or not?
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            Find out what your business is actually worth to a buyer. Takes about 3 minutes, and you'll see exactly where to focus.
          </p>
          <Button
            size="lg"
            onClick={() => setStarted(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-base font-bold rounded-lg"
          >
            Start your free assessment
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

  if (showDetails && !detailsSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="mb-2 text-2xl font-black tracking-tight text-foreground">
            Almost there
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Enter your details and we'll show your score plus your full six-pillar breakdown.
          </p>
          <div className="text-left space-y-4 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">What is your business called?</label>
              <Input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Acme Consulting"
                className="w-full"
              />
            </div>
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
            disabled={!businessName.trim() || !firstName.trim() || !email.trim() || submitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-base font-bold rounded-lg disabled:opacity-40"
          >
            {submitting ? "Submitting..." : "View my results"}
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight text-foreground">Business value diagnostic</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Question {currentIndex + 1} of {QUESTIONS.length}
          </p>
          <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
            <div
              className="h-1.5 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${((answeredCount) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          selectedPoints={answers[currentQuestion.id]}
          onSelect={handleSelect}
        />

        <div className="mt-6 flex justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex((i) => i - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            disabled={currentIndex === 0}
          >
            Back
          </Button>
          {answers[currentQuestion.id] !== undefined && currentIndex < QUESTIONS.length - 1 && (
            <Button
              onClick={() => {
                setCurrentIndex((i) => i + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Next
            </Button>
          )}
          {answers[currentQuestion.id] !== undefined && currentIndex === QUESTIONS.length - 1 && (
            <Button
              onClick={() => {
                setShowDetails(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
