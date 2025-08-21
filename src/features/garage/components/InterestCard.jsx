import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Calendar,
  DollarSign,
  Edit,
  Eye,
  Menu,
  Phone,
  Trash,
  User,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DynamicMenu from "./DynamicMenu";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, getDaysDifference } from "@/lib/utils";
import DeleteBuyerInterest from "../tabs/buyer-interest/mutation/DeleteBuyerInterest";

export const InterestCard = ({
  interest,
  showBuyer = true,
  showMutation = true,
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const handleDelete = () => {
    setShowDelete(true);
    setDeleteId(interest._id);
  };

  const interestConfigs = [
    {
      label: "Edit",
      icon: <Edit className="w-3 h-3 mr-1" />,
      action: () => {
        navigate(`/garage/edit-interest/${interest._id}`);
      },
    },
    {
      label: "Delete",
      icon: <Trash className="w-3 h-3 mr-1" />,
      action: () => {
        handleDelete();
      },
    },
  ];
  const { buyer, budget, status, createdAt } = interest;

  return (
    <Card
      key={interest._id}
      className="h-full duration-300 animate-in fade-in-10 slide-in-from-bottom-1"
    >
      <CardHeader className="p-4 ">
        <div className="flex items-start justify-between">
          {showBuyer ? (
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-4 h-4" />
                {buyer.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Phone className="w-3 h-3" />
                {buyer.contactNumber}
              </CardDescription>
            </div>
          ) : (
            <div className="pt-1 text-xs text-muted-foreground">
              Interest ID: {interest._id}
            </div>
          )}

          {/* <Badge className={getStatusColor(status)}>{status}</Badge> */}
          <StatusBadge status={status} />
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        {/* Budget Section */}
        <Separator />

        <div className="space-y-2">
          {/* <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Budget:</span>
          </div>
          <div className="text-sm text-gray-600">
            {budget.min && budget.max
              ? `Rs ${Number(budget.min).toLocaleString("en-IN")} - Rs ${Number(
                  budget.max
                ).toLocaleString("en-IN")}`
              : budget.min
              ? `From Rs ${Number(budget.min).toLocaleString("en-IN")}`
              : budget.max
              ? `Up to Rs ${Number(budget.max).toLocaleString("en-IN")}`
              : "-"}
          </div> */}
          <div className="flex items-center gap-2 px-3 py-1 text-xs text-green-800 bg-green-100 border border-green-200 rounded-full w-fit">
            <Wallet className="w-4 h-4" />
            <span>
              Budget: {formatCurrency(interest.budget.min)} -{" "}
              {formatCurrency(interest.budget.max)}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            size="sm"
            onClick={() => {
              navigate(`/garage/interest/${interest._id}`);
            }}
          >
            <Eye className="w-3 h-3 mr-2" />
            <span className="text-xs">View More</span>
          </Button>
          {showMutation && (
            <DynamicMenu configs={interestConfigs}>
              <Button variant="outline" size="sm">
                <Menu className="w-4 h-4" />
              </Button>
            </DynamicMenu>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Calendar className="w-3 h-3" />
            Listed on {formatDate(createdAt)}
          </div>
          <div className="text-[10px] text-gray-500">
            {getDaysDifference(createdAt, new Date())}d ago
          </div>
        </div>
        <DeleteBuyerInterest
          showDelete={showDelete}
          setShowDelete={setShowDelete}
          deleteId={deleteId}
          setDeleteId={setDeleteId}
        />
      </CardContent>
    </Card>
  );
};
