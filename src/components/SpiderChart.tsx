import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { PillarScore } from "@/lib/questions";

interface Props {
  pillarScores: PillarScore[];
}

const SpiderChart = ({ pillarScores }: Props) => {
  const data = pillarScores.map((p) => ({
    subject: p.label,
    score: p.percentage,
    fullMark: 100,
  }));

  return (
    <div className="w-full max-w-lg mx-auto">
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="hsl(185, 30%, 88%)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "hsl(192, 42%, 15%)", fontSize: 12, fontFamily: "Satoshi, sans-serif", fontWeight: 500 }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="score"
            stroke="hsl(189, 69%, 30%)"
            fill="hsl(189, 69%, 30%)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpiderChart;
