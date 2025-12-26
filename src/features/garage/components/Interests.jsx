import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Wallet } from "lucide-react";

function Interests({ interest, showBudget = false }) {
  return (
    <div className="space-y-3">
      {showBudget && (
        <div className="flex items-center gap-2 px-3 py-1 text-xs text-green-800 bg-green-100 border border-green-200 rounded-full w-fit">
          <Wallet className="w-4 h-4" />
          <span>
            Budget: {formatCurrency(interest.budget.min)} -{" "}
            {formatCurrency(interest.budget.max)}
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {interest.criteria?.makes?.map((make, index) => (
          <Badge
            key={`make-${make}-${index}`}
            className="pointer-events-none bg-teal-50 text-teal-700 border border-teal-100 rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            {make}
          </Badge>
        ))}

        {interest?.criteria?.models?.map((model, index) => (
          <Badge
            key={`model-${model}-${index}`}
            className="pointer-events-none bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            {model}
          </Badge>
        ))}

        {interest.criteria?.categories?.map((cat, index) => (
          <Badge
            key={`cat-${cat}-${index}`}
            className="pointer-events-none bg-green-50 text-green-700 border border-green-100 rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            {cat}
          </Badge>
        ))}

        {interest?.criteria?.fuelTypes?.map((ft, index) => (
          <Badge
            key={`fuel-${ft}-${index}`}
            className="pointer-events-none bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            {ft}
          </Badge>
        ))}

        {interest?.criteria?.driveTypes?.map((dt, index) => (
          <Badge
            key={`trans-${dt}-${index}`}
            className="pointer-events-none bg-violet-50 text-violet-700 border border-violet-100 rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            {dt}
          </Badge>
        ))}
        {interest?.criteria?.transmissions?.map((t, index) => (
          <Badge
            key={`trans-${t}-${index}`}
            className="pointer-events-none bg-sky-50 text-sky-700 border border-sky-100 rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            {t}
          </Badge>
        ))}

        {interest?.criteria?.year?.from && interest?.criteria?.year?.to && (
          <Badge
            key={`year-${interest.criteria.year.from}-${interest.criteria.year.to}`}
            className="pointer-events-none bg-gray-50 text-gray-700 border border-gray-200 rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            Year: {interest.criteria.year.from} - {interest.criteria.year.to}
          </Badge>
        )}

        {interest?.criteria?.mileageMax && (
          <Badge
            key={`mileage-${interest.criteria.mileageMax}`}
            className="pointer-events-none bg-gray-50 text-gray-700 border border-gray-200 rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            Max Mileage: {interest.criteria.mileageMax.toLocaleString()}
          </Badge>
        )}
      </div>
    </div>
  );
}

export default Interests;
