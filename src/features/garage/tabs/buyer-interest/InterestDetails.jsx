import { useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "@/components/Loader";
import NavBackButton from "@/components/NavBackButton";
import ApiError from "@/components/error/ApiError";
import { useGetInterestDetailsQuery } from "../../garageApiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  DollarSign,
  Car,
  Settings,
  FileText,
  Phone,
  Calendar,
} from "lucide-react";

function InterestDetails() {
  const { id } = useParams();
  const { data, isLoading, isError, isFetching, isSuccess, error, refetch } =
    useGetInterestDetailsQuery(id);

  const [showCars, setShowCars] = useState(false);

  const formatCurrency = (amt) =>
    amt
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "NPR",
          maximumFractionDigits: 0,
        }).format(amt)
      : "N/A";

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

  const statusColor = {
    Active: "bg-green-100 text-green-800",
    Fulfilled: "bg-blue-100 text-blue-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  if (isError) return <ApiError error={error} refetch={refetch} />;

  if (isSuccess) {
    const interest = data?.data || {};
    const buyer = interest.buyer || {};
    const criteria = interest.criteria || {};
    const history = buyer.history || {};

    return (
      <div className="space-y-4">
        <NavBackButton buttonText="Back" navigateTo={-1} />

        {/* Top header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <User className="w-5 h-5" /> {buyer.name || "Unknown Buyer"}
          </h1>
          <Badge
            className={
              statusColor[interest.status] || "bg-gray-100 text-gray-800"
            }
          >
            {interest.status || "Unknown"}
          </Badge>
        </div>
        <p className="text-xs text-gray-500"></p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card className="border-green-100 bg-green-50">
            <CardContent className="p-3">
              <p className="text-xs text-gray-500">Max Budget</p>
              <p className="text-lg font-bold text-green-700">
                {formatCurrency(interest?.budget?.max)}
              </p>
            </CardContent>
          </Card>
          <Card className="border-blue-100 bg-blue-50">
            <CardContent className="p-3">
              <p className="text-xs text-gray-500">Min Budget</p>
              <p className="text-lg font-bold text-blue-700">
                {formatCurrency(interest?.budget?.min)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-gray-500">Total Interests</p>
              <p className="text-lg font-bold">
                {history.buyerInterests?.length || 0}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-gray-500">Max Mileage</p>
              <p className="text-lg font-bold">
                {criteria.mileageMax?.toLocaleString() || "N/A"} kms
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Split */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Left Column - Buyer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-4 h-4" /> Buyer Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-medium">{buyer.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Contact</p>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{buyer.contactNumber || "N/A"}</span>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div>Created: {formatDate(interest.createdAt)}</div>
                <div>Updated: {formatDate(interest.updatedAt)}</div>
              </div>
              {interest.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-gray-500">Notes</p>
                    <p>{interest.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Right Column - Vehicle Criteria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-4 h-4" /> Vehicle Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {criteria.categories?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500">Categories</p>
                  <div className="flex flex-wrap gap-1">
                    {criteria.categories.map((c, i) => (
                      <Badge key={i} variant="outline">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {criteria.makes?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500">Makes</p>
                  <div className="flex flex-wrap gap-1">
                    {criteria.makes.map((m, i) => (
                      <Badge key={i} variant="outline">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {criteria.models?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500">Models</p>
                  <div className="flex flex-wrap gap-1">
                    {criteria.models.map((m, i) => (
                      <Badge key={i} variant="outline">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {(criteria.year?.from || criteria.year?.to) && (
                <div>
                  <p className="text-xs text-gray-500">Year Range</p>
                  <Badge variant="outline">{criteria.year.from || "?"}</Badge>
                  <span className="mx-1">to</span>
                  <Badge variant="outline">{criteria.year.to || "?"}</Badge>
                </div>
              )}
              {criteria.transmissions?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500">Transmission</p>
                  <div className="flex flex-wrap gap-1">
                    {criteria.transmissions.map((t, i) => (
                      <Badge key={i} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {criteria.fuelTypes?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500">Fuel</p>
                  <div className="flex flex-wrap gap-1">
                    {criteria.fuelTypes.map((f, i) => (
                      <Badge key={i} variant="secondary">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {criteria.driveTypes?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500">Drive Type</p>
                  <div className="flex flex-wrap gap-1">
                    {criteria.driveTypes.map((d, i) => (
                      <Badge key={i} variant="secondary">
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-2">
                <Button size="sm" onClick={() => setShowCars(!showCars)}>
                  {showCars ? "Hide" : "Find"} Potential Cars
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Potential Cars */}
        {showCars && (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((car) => (
              <Card key={car}>
                <CardContent className="p-3">
                  <p className="font-medium">Car {car}</p>
                  <p className="text-xs text-gray-500">
                    Example car details...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default InterestDetails;
