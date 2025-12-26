import { Star } from "lucide-react";

const MatchBadge = ({ score }) => {
  const getColor = (score) => {
    if (score <= 5) return "bg-red-200 text-red-800";
    if (score <= 10) return "bg-orange-200 text-orange-800";
    if (score <= 15) return "bg-yellow-200 text-yellow-800";
    if (score <= 18) return "bg-green-200 text-green-800";
    return "bg-emerald-300 text-emerald-900";
  };

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full w-fit ${getColor(
        score
      )}`}
    >
      <Star className="w-3.5 h-3.5" />
      <span>{score.toFixed(1)} Match</span>
    </div>
  );
};

export default MatchBadge;
