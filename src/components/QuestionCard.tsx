import { Question } from "@/lib/questions";
import { cn } from "@/lib/utils";

interface Props {
  question: Question;
  selectedPoints: number | undefined;
  onSelect: (questionId: number, points: number) => void;
}

const QuestionCard = ({ question, selectedPoints, onSelect }: Props) => (
  <div className="rounded-lg border border-border bg-card p-6">
    <div className="mb-1 text-xs font-bold uppercase tracking-widest text-secondary">
      {question.pillar}
    </div>
    <p className="mb-5 text-base font-medium leading-relaxed text-foreground">
      {question.text}
    </p>
    <div className="flex flex-wrap gap-3">
      {question.options.map((opt) => (
        <button
          key={opt.label}
          onClick={() => onSelect(question.id, opt.points)}
          className={cn(
            "rounded-md border px-4 py-2.5 text-sm font-medium transition-all",
            selectedPoints === opt.points
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/50"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

export default QuestionCard;
