import { Badge } from "@/components/ui/badge";

const statusColors = {
  "In Queue": "bg-orange-500/10 text-orange-500 border-orange-500",
  Paused: "bg-orange-500/10 text-orange-500 border-orange-500",
  "Ready for Pickup": "bg-green-600/10 text-green-600 border-green-600",
  Active: "bg-green-600/10 text-green-600 border-green-600",
  Available: "bg-green-600/10 text-green-600 border-green-600",
  Completed: "bg-blue-500/10 text-blue-500 border-blue-500",
  Sold: "bg-blue-500/10 text-blue-500 border-blue-500",
  Fulfilled: "bg-blue-500/10 text-blue-500 border-blue-500",
  Pending: "bg-yellow-600/10 text-yellow-600 border-yellow-600",
  Paid: "bg-emerald-600/10 text-emerald-600 border-emerald-600",
  Cancelled: "bg-red-600/10 text-red-600 border-red-600",
  Booked: "bg-purple-600/10 text-purple-600 border-purple-600",
  Parked: "bg-green-600/10 text-green-600 border-green-600",
};

const solidStatusColors = {
  "In Queue": "bg-orange-500 text-white border-orange-600",
  Paused: "bg-amber-500 text-white border-amber-600",
  "Ready for Pickup": "bg-emerald-500 text-white border-emerald-600",
  Active: "bg-green-500 text-white border-green-600",
  Available: "bg-green-500 text-white border-green-600",
  Completed: "bg-blue-500 text-white border-blue-600",
  Sold: "bg-indigo-500 text-white border-indigo-600",
  Fulfilled: "bg-cyan-500 text-white border-cyan-600",
  Pending: "bg-yellow-500 text-gray-900 border-yellow-600",
  Paid: "bg-emerald-600 text-white border-emerald-700",
  Cancelled: "bg-red-500 text-white border-red-600",
  Booked: "bg-purple-500 text-white border-purple-600",
  Parked: "bg-teal-500 text-white border-teal-600",
};

const StatusBadge = ({ status, variant = "default", className }) => {
  let badgeClass;

  switch (variant) {
    case "default":
      badgeClass = statusColors[status];
      break;
    case "solid":
      badgeClass = solidStatusColors[status];
      break;
    default:
      badgeClass = "bg-gray-500/10 text-gray-500 border-gray-500";
      break;
  }

  return (
    <Badge
      className={`${badgeClass} uppercase text-[10px] py-0 whitespace-nowrap pointer-events-none ${className}`}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;
