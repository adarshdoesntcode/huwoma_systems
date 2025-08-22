import { useNavigate, useParams } from "react-router-dom";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";
import { useGetInterestDetailsQuery } from "../../garageApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  DollarSign,
  Car,
  FileText,
  Calendar,
  Edit,
  Trash,
  ArrowUpRight,
  CheckCheck,
} from "lucide-react";
import { formatCurrency, formatDate, getDaysDifference } from "@/lib/utils";
import NavBackButton from "@/components/NavBackButton";
import StatusBadge from "@/components/ui/StatusBadge";
import DeleteBuyerInterest from "./mutation/DeleteBuyerInterest";
import { useState } from "react";
import PotentialVehicles from "../../components/PotentialVehicles";
import { Separator } from "@/components/ui/separator";
import MarkAsFulfilled from "./mutation/MarkAsFulfilled";

function InterestDetails() {
  const [showDelete, setShowDelete] = useState(false);
  const [showFulfill, setShowFulfill] = useState(false);
  const [fullfillId, setFullfillId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { id } = useParams();
  const { data, isLoading, isError, isFetching, isSuccess, error, refetch } =
    useGetInterestDetailsQuery(id);

  const navigate = useNavigate();

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isError) return <ApiError error={error} refetch={refetch} />;

  if (isSuccess) {
    const interest = data?.data || {};
    const buyer = interest.buyer || {};
    const criteria = interest.criteria || {};
    const history = buyer.history || {
      listedVehicles: [],
      purchasedVehicles: [],
      buyerInterests: [],
    };
    const budget = interest.budget || {};

    return (
      <div className="min-h-screen pt-0 sm:p-6 sm:pt-0 ">
        <div className="max-w-6xl mx-auto space-y-4">
          <NavBackButton buttonText={"Back"} navigateTo={-1} />
          {/* Header Section */}
          <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Buyer Interest Details
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                View comprehensive buyer requirements and preferences
              </p>
            </div>
            {interest.status === "Active" && (
              <div className="flex items-center justify-end w-full mt-4 space-x-2 sm:w-fit sm:mt-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDelete(true);
                    setDeleteId(interest._id);
                  }}
                >
                  <Trash className="w-4 h-4 sm:mr-2" />
                  <span className="sr-only sm:not-sr-only">Delete</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/garage/edit-interest/${interest._id}`)
                  }
                >
                  <Edit className="w-4 h-4 sm:mr-2" />
                  <span className="sr-only sm:not-sr-only">Edit</span>
                </Button>
                <Button
                  onClick={() => {
                    setShowFulfill(true);
                    setFullfillId(interest._id);
                  }}
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark as Fulfilled
                </Button>
              </div>
            )}
          </div>

          {/* Buyer Details Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-start justify-between sm:flex-row">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center bg-gray-100 rounded-full w-14 h-14">
                    <User className="text-gray-500 w-7 h-7" />
                  </div>
                  <div>
                    <p
                      className="flex items-center text-lg font-semibold text-gray-900 cursor-pointer group "
                      onClick={() => navigate(`/garage/customers/${buyer._id}`)}
                    >
                      {buyer.name}{" "}
                      <ArrowUpRight className="w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </p>

                    <p className="text-xs text-gray-600">
                      <span>{buyer.contactNumber}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Interest ID: {interest._id}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row items-end justify-between w-full gap-2 mt-3 sm:w-fit sm:mt-0 sm:flex-col">
                  <StatusBadge status={interest.status} className={"w-fit"} />
                  <div className="flex items-center justify-start gap-1 mt-2 text-xs text-muted-foreground sm:justify-end">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <span>
                      Created on {formatDate(interest.createdAt)} (
                      {`${getDaysDifference(
                        interest.createdAt,
                        new Date()
                      )}d ago`}
                      )
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Range Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium">
                <DollarSign className="w-5 h-5 mr-2 text-gray-600" />
                Budget Range
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div className="p-4 border rounded-lg bg-muted">
                <p className="mb-1 text-xs text-gray-500">Minimum Budget</p>
                <p className="text-xl font-semibold text-gray-800">
                  {formatCurrency(budget?.min || 0)}
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-muted">
                <p className="mb-1 text-xs text-gray-500">Maximum Budget</p>
                <p className="text-xl font-semibold text-gray-800">
                  {formatCurrency(budget.max)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Criteria Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-sm font-medium">
                <Car className="w-5 h-5 mr-2 text-gray-600" />
                Vehicle Criteria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Year Range
                  </p>
                  <p className="p-2 mt-2 font-mono text-sm text-gray-800 border rounded-md bg-muted">
                    {criteria?.year?.from && criteria?.year?.to
                      ? `${criteria?.year?.from} - ${criteria?.year?.to}`
                      : criteria?.year?.from
                      ? `${criteria?.year?.from} - Present`
                      : criteria?.year?.to
                      ? `Untill ${criteria?.year?.to}`
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {criteria.categories.length > 0
                      ? criteria.categories.map((item) => (
                          <Badge
                            key={item}
                            className="pointer-events-none bg-green-50 text-green-700 border border-green-100 rounded-full px-2.5 py-0.5 text-xs font-medium"
                          >
                            {item}
                          </Badge>
                        ))
                      : "-"}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 ">Makes</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {criteria.makes.length > 0
                      ? criteria.makes.map((item) => (
                          <Badge
                            key={item}
                            className="pointer-events-none bg-teal-50 text-teal-700 border border-teal-100 rounded-full px-2.5 py-0.5 text-xs font-medium"
                          >
                            {item}
                          </Badge>
                        ))
                      : "-"}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Maximum Mileage
                  </p>
                  <p className="p-2 mt-2 text-sm text-gray-800 border rounded-md bg-muted ">
                    {criteria?.mileageMax
                      ? `${new Intl.NumberFormat("en-IN").format(
                          criteria.mileageMax
                        )} km`
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Models</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {criteria.models.length > 0
                      ? criteria.models.map((item) => (
                          <Badge
                            key={item}
                            className="pointer-events-none bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-0.5 text-xs font-medium"
                          >
                            {item}
                          </Badge>
                        ))
                      : "-"}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Transmissions
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {criteria.transmissions.length > 0
                      ? criteria.transmissions.map((item) => (
                          <Badge
                            key={item}
                            className="pointer-events-none bg-sky-50 text-sky-700 border border-sky-100 rounded-full px-2.5 py-0.5 text-xs font-medium"
                          >
                            {item}
                          </Badge>
                        ))
                      : "-"}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Fuel Types
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {criteria.fuelTypes.length > 0
                      ? criteria.fuelTypes.map((item) => (
                          <Badge
                            key={item}
                            className="pointer-events-none bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-2.5 py-0.5 text-xs font-medium"
                          >
                            {item}
                          </Badge>
                        ))
                      : "-"}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Drive Types
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {criteria.driveTypes.length > 0
                      ? criteria.driveTypes.map((item) => (
                          <Badge
                            key={item}
                            className="pointer-events-none bg-violet-50 text-violet-700 border border-violet-100 rounded-full px-2.5 py-0.5 text-xs font-medium"
                          >
                            {item}
                          </Badge>
                        ))
                      : "-"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes Card */}
          {interest.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-medium">
                  <FileText className="w-5 h-5 mr-2 text-gray-600" />
                  Additional Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="px-4 py-3 text-sm italic text-gray-600 border border-gray-200 rounded-md bg-gray-50">
                  {interest.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {interest.status === "Active" && (
            <PotentialVehicles interest={interest} />
          )}
        </div>
        <DeleteBuyerInterest
          showDelete={showDelete}
          setShowDelete={setShowDelete}
          deleteId={deleteId}
          setDeleteId={setDeleteId}
        />
        <MarkAsFulfilled
          showDialog={showFulfill}
          setShowDialog={setShowFulfill}
          interestId={fullfillId}
          setInterestId={setFullfillId}
        />
      </div>
    );
  }

  return null;
}

export default InterestDetails;
