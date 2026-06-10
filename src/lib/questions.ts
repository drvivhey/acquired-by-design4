export interface Question {
  id: number;
  pillar: string;
  pillarKey: string;
  text: string;
  options: { label: string; points: number }[];
}

export const PILLARS = [
  { key: "processes", label: "Processes", icon: "Cog" },
  { key: "relationships", label: "Relationships", icon: "Handshake" },
  { key: "ownerIndependence", label: "Owner independence", icon: "KeyRound" },
  { key: "financials", label: "Financials", icon: "BarChart3" },
  { key: "independentTeam", label: "Independent team", icon: "Users" },
  { key: "technology", label: "Technology", icon: "Monitor" },
];

export const QUESTIONS: Question[] = [
  {
    id: 1,
    pillar: "Processes",
    pillarKey: "processes",
    text: "Could someone new join your team and deliver your service well, without you guiding them through it?",
    options: [
      { label: "Yes", points: 10 },
      { label: "Partially", points: 5 },
      { label: "No", points: 0 },
    ],
  },
  {
    id: 2,
    pillar: "Processes",
    pillarKey: "processes",
    text: "Does your team have written guides or checklists they follow to deliver your service consistently?",
    options: [
      { label: "Yes", points: 10 },
      { label: "Partially", points: 5 },
      { label: "No", points: 0 },
    ],
  },
  {
    id: 3,
    pillar: "Relationships",
    pillarKey: "relationships",
    text: "Does more than 40% of your revenue come from your top 3 clients?",
    options: [
      { label: "No", points: 10 },
      { label: "Yes", points: 0 },
    ],
  },
  {
    id: 4,
    pillar: "Relationships",
    pillarKey: "relationships",
    text: "Do you have long-term contracts or recurring revenue agreements in place?",
    options: [
      { label: "Yes", points: 10 },
      { label: "Partially", points: 5 },
      { label: "No", points: 0 },
    ],
  },
  {
    id: 5,
    pillar: "Owner independence",
    pillarKey: "ownerIndependence",
    text: "If you were forced to step away for 30 days tomorrow, would your sales engine continue to close new deals without you?",
    options: [
      { label: "Yes, completely", points: 10 },
      { label: "Partially", points: 5 },
      { label: "No, sales would stop", points: 0 },
    ],
  },
  {
    id: 6,
    pillar: "Owner independence",
    pillarKey: "ownerIndependence",
    text: "During your last two weeks of planned absence, did your revenue pipeline remain stable or grow?",
    options: [
      { label: "Grew or stayed stable", points: 10 },
      { label: "Declined", points: 5 },
      { label: "I have not taken 2 weeks off in years", points: 0 },
    ],
  },
  {
    id: 7,
    pillar: "Financials",
    pillarKey: "financials",
    text: "Are your accounts management-ready (real-time) or retrospective/year-end only?",
    options: [
      { label: "Management-ready", points: 10 },
      { label: "Retrospective / year-end only", points: 0 },
    ],
  },
  {
    id: 8,
    pillar: "Financials",
    pillarKey: "financials",
    text: "Could your accounts withstand professional due diligence scrutiny right now?",
    options: [
      { label: "Yes", points: 10 },
      { label: "Possibly", points: 5 },
      { label: "No", points: 0 },
    ],
  },
  {
    id: 9,
    pillar: "Independent team",
    pillarKey: "independentTeam",
    text: "Do you have a second-in-command who could run the business in your absence?",
    options: [
      { label: "Yes", points: 10 },
      { label: "Partially", points: 5 },
      { label: "No", points: 0 },
    ],
  },
  {
    id: 10,
    pillar: "Independent team",
    pillarKey: "independentTeam",
    text: "If your 2 to 3 key people left, would the business collapse within 30 days?",
    options: [
      { label: "No", points: 10 },
      { label: "Possibly", points: 5 },
      { label: "Yes", points: 0 },
    ],
  },
  {
    id: 11,
    pillar: "Technology",
    pillarKey: "technology",
    text: "Is your data, IP, and client records centrally stored and organised, not in people's heads?",
    options: [
      { label: "Yes", points: 10 },
      { label: "Partially", points: 5 },
      { label: "No", points: 0 },
    ],
  },
  {
    id: 12,
    pillar: "Technology",
    pillarKey: "technology",
    text: "Do you have proprietary tools or IP that creates a clear competitive advantage?",
    options: [
      { label: "Yes", points: 10 },
      { label: "Partially", points: 5 },
      { label: "No", points: 0 },
    ],
  },
];

export interface PillarScore {
  key: string;
  label: string;
  icon: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface Results {
  totalScore: number;
  normalizedScore: number;
  band: { label: string; color: string; description: string };
  pillarScores: PillarScore[];
}

const BANDS = [
  { min: 0, max: 40, label: "Fragile", color: "hsl(18, 100%, 61%)", description: "Your business is heavily dependent on you and vulnerable to disruption. Significant work is needed across multiple pillars." },
  { min: 41, max: 60, label: "Owner-centric", color: "hsl(42, 100%, 62%)", description: "Your business runs, but it revolves around you. There are clear opportunities to build transferable value." },
  { min: 61, max: 80, label: "Scalable asset", color: "hsl(177, 65%, 37%)", description: "You've built real business value. Fine-tuning specific pillars will move you toward investment-grade status." },
  { min: 81, max: 100, label: "Investment grade", color: "hsl(189, 69%, 30%)", description: "Your business operates independently and would attract premium valuations. Keep optimising and protecting this position." },
];

export function calculateResults(answers: Record<number, number>): Results {
  const pillarScores: PillarScore[] = PILLARS.map((p) => {
    const pillarQuestions = QUESTIONS.filter((q) => q.pillarKey === p.key);
    const score = pillarQuestions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
    const maxScore = pillarQuestions.length * 10;
    return { key: p.key, label: p.label, icon: p.icon, score, maxScore, percentage: Math.round((score / maxScore) * 100) };
  });

  const totalScore = Object.values(answers).reduce((s, v) => s + v, 0);
  const normalizedScore = Math.round((totalScore / 120) * 100);
  const band = BANDS.find((b) => normalizedScore >= b.min && normalizedScore <= b.max) || BANDS[0];

  return { totalScore, normalizedScore, band, pillarScores };
}

export function getPillarSummary(key: string, percentage: number): string {
  const tier: "high" | "mid" | "low" =
    percentage >= 75 ? "high" : percentage >= 40 ? "mid" : "low";

  const summaries: Record<string, Record<"high" | "mid" | "low", string>> = {
    processes: {
      high: "Your processes are well documented and scalable, so new people can get up to speed with very little friction. Keep them current as you grow and this stays a real asset.",
      mid: "Some of your processes are in place, but gaps remain. Formalising the rest is one of the clearest ways to lift transferable value, and it's very doable.",
      low: "Right now, too much of how you deliver lives in people's heads. Documenting it is one of the highest-value things you can do, and it's very doable.",
    },
    relationships: {
      high: "Healthy client diversification and strong contracts protect your revenue. That's exactly what a buyer wants to see.",
      mid: "There's some concentration in your client base. Broadening it and securing recurring agreements is a straightforward way to reduce risk and lift value.",
      low: "Your revenue is concentrated in a small number of clients. A buyer sees that as risk, so spreading it is one of the clearest ways to lift value.",
    },
    ownerIndependence: {
      high: "The business generates revenue without depending on you, which is a hallmark of a valuable, sellable asset. Protect that as the team grows.",
      mid: "You're still involved in key revenue activities. Handing over sales and pipeline is the natural next step, and it's where a lot of value gets unlocked.",
      low: "At the moment, you are the business. That's normal for an owner-led company, and it's also the single biggest thing to shift to make it sellable.",
    },
    financials: {
      high: "Your financial infrastructure is investor-ready, with real-time visibility and the resilience to stand up to scrutiny. This is a genuine strength.",
      mid: "Your financial foundations are there but need strengthening. Moving to management-ready reporting removes a major obstacle later in any sale.",
      low: "Your financial visibility needs work. Buyers look here first, so getting your numbers management-ready early removes a major obstacle later.",
    },
    independentTeam: {
      high: "You have real leadership depth. The team can operate without you or any single individual, which is exactly what makes a business resilient and valuable.",
      mid: "There's some dependency on a few key people. Developing a clear second-in-command should be a priority, and it protects both you and the value.",
      low: "Key-person risk is high, which leaves the business exposed if someone steps away. Building bench strength protects both you and the value.",
    },
    technology: {
      high: "Strong systems and proprietary IP give you a defensible advantage. Keep it protected and current and it stays a real differentiator.",
      mid: "You've got some good foundations here. Centralising your data and protecting your IP would turn that into a real, defensible asset.",
      low: "Your data and knowledge are scattered at the moment. Centralising and protecting your IP is one of the most valuable early moves you can make.",
    },
  };

  return summaries[key]?.[tier] ?? "";
}

