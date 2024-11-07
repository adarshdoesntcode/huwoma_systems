import { Badge } from "@/components/ui/badge";

const statusColors = {
  "In Queue": "bg-orange-500/10 text-orange-500 border-orange-500",
  "Ready for Pickup": "bg-green-600/10 text-green-600 border-green-600",
  Completed: "bg-blue-500/10 text-blue-500 border-blue-500",
  Pending: "bg-yellow-600/10 text-yellow-600 border-yellow-600",
  Paid: "bg-emerald-600/10 text-emerald-600 border-emerald-600",
  Cancelled: "bg-red-600/10 text-red-600 border-red-600",
  Booked: "bg-purple-600/10 text-purple-600 border-purple-600",
};

const StatusBadge = ({ status }) => {
  const badgeClass = statusColors[status];

  return (
    <Badge
      className={`${badgeClass} uppercase text-[10px] py-0 whitespace-nowrap pointer-events-none`}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;
