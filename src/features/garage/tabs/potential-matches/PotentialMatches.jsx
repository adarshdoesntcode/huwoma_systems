import Loader from "@/components/Loader";
import { useGetPotentialMatchesQuery } from "../../garageApiSlice";
import ApiError from "@/components/error/ApiError";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { RefreshCcw, User, Wallet, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import MatchedVehiclesCard from "../../components/MatchedVehiclesCard";
import { formatCurrency } from "@/lib/utils";

function PotentialMatches() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isError, isSuccess, error, refetch, isFetching } =
    useGetPotentialMatchesQuery();

  const filteredData = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data) || !searchQuery.trim()) {
      return data?.data || [];
    }

    const query = searchQuery.toLowerCase().trim();

    return data.data.filter(({ interest }) => {
      const buyerNameMatch = interest?.buyer?.name
        ?.toLowerCase()
        .includes(query);

      const buyerNumberMatch = interest?.buyer?.contactNumber
        ?.toLowerCase()
        .includes(query);

      return buyerNameMatch || buyerNumberMatch;
    });
  }, [data?.data, searchQuery]);

  let content;

  if (isLoading) {
    content = (
      <div className="flex items-center justify-center flex-1 h-full py-20">
        <Loader />
      </div>
    );
  } else if (isSuccess && data?.data && Array.isArray(data.data)) {
    if (filteredData.length === 0) {
      content = (
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <Search className="w-16 h-16 mb-4 text-gray-300" />
          <h3 className="mb-2 text-lg font-semibold text-gray-700">
            {searchQuery.trim() ? "No Matches Found" : "No Potential Matches"}
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery.trim()
              ? `No results found for "${searchQuery}". Try a different search term.`
              : "There are currently no buyer interests with matching vehicles."}
          </p>
          {searchQuery.trim() && (
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="mt-3"
              size="sm"
            >
              Clear Search
            </Button>
          )}
        </div>
      );
    } else {
      content = (
        <div className="space-y-8">
          {searchQuery.trim() && (
            <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-blue-50">
              <p className="text-sm text-blue-700">
                Showing {filteredData.length} of {data.data.length} potential
                matches for &quot;{searchQuery}&quot;
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          )}
          {filteredData
            .map(({ interest, matchingVehicles }) => {
              if (!interest?._id || !interest?.buyer) {
                console.warn("Invalid interest data:", interest);
                return null;
              }

              return (
                <div
                  key={interest._id}
                  className="p-3 space-y-4 border shadow-sm rounded-xl bg-gray-50/50 sm:p-4"
                >
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <User className="w-5 h-5 text-blue-700" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {interest.buyer?.name || "Unknown Buyer"}
                          </h3>
                          {interest.buyer?.contactNumber && (
                            <p className="text-sm text-gray-500">
                              {interest.buyer.contactNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      {interest.budget && (
                        <div className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-green-800 bg-green-100 border border-green-200 rounded-full">
                          <Wallet className="w-4 h-4" />
                          <span>
                            Budget: {formatCurrency(interest.budget.min)} -{" "}
                            {formatCurrency(interest.budget.max)}
                          </span>
                        </div>
                      )}
                    </div>

                    {interest.criteria && (
                      <div className="p-4 bg-white border border-dashed rounded-lg">
                        <p className="mb-3 text-sm font-medium text-gray-600">
                          Buyer&apos;s Criteria:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {interest.criteria.makes?.map((make, index) => (
                            <Badge
                              key={`make-${make}-${index}`}
                              variant="secondary"
                            >
                              {make}
                            </Badge>
                          ))}
                          {interest.criteria.models?.map((model, index) => (
                            <Badge
                              key={`model-${model}-${index}`}
                              variant="secondary"
                            >
                              {model}
                            </Badge>
                          ))}
                          {interest.criteria.categories?.map((cat, index) => (
                            <Badge
                              key={`cat-${cat}-${index}`}
                              variant="outline"
                            >
                              {cat}
                            </Badge>
                          ))}
                          {interest.criteria.fuelTypes?.map((ft, index) => (
                            <Badge
                              key={`fuel-${ft}-${index}`}
                              variant="outline"
                              className="border-amber-400 text-amber-700"
                            >
                              {ft}
                            </Badge>
                          ))}
                          {interest.criteria.transmissions?.map((t, index) => (
                            <Badge
                              key={`trans-${t}-${index}`}
                              variant="outline"
                              className="border-sky-400 text-sky-700"
                            >
                              {t}
                            </Badge>
                          ))}
                          {/* Added Badges for year and mileageMax */}
                          {interest.criteria.year?.from &&
                            interest.criteria.year?.to && (
                              <Badge
                                key={`year-${interest.criteria.year.from}-${interest.criteria.year.to}`}
                                variant="outline"
                                className="text-gray-700 border-gray-400"
                              >
                                Year: {interest.criteria.year.from} -{" "}
                                {interest.criteria.year.to}
                              </Badge>
                            )}
                          {interest.criteria.mileageMax && (
                            <Badge
                              key={`mileage-${interest.criteria.mileageMax}`}
                              variant="outline"
                              className="text-gray-700 border-gray-400"
                            >
                              Max Mileage:{" "}
                              {interest.criteria.mileageMax.toLocaleString()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {interest.notes && (
                      <p className="text-sm italic text-gray-500">
                        Note: &quot;{interest.notes}&quot;
                      </p>
                    )}
                  </div>

                  <Separator className="my-2" />

                  <div className="w-full">
                    <h4 className="mb-1 font-semibold text-gray-700 text-md">
                      Matching Vehicles (
                      {Array.isArray(matchingVehicles)
                        ? matchingVehicles.length
                        : 0}
                      )
                    </h4>
                    <div>
                      {Array.isArray(matchingVehicles) &&
                      matchingVehicles.length > 0 ? (
                        <div
                          className="relative w-full overflow-x-auto scrollbar-thin scroll-smooth  min-h-[425px]"
                          style={{ maxWidth: "100%" }}
                        >
                          <div className="absolute left-0 flex gap-4 pb-4 top-4 flex-nowrap w-max">
                            {matchingVehicles.map((vehicle) => (
                              <div
                                key={vehicle._id}
                                className="min-w-[300px] flex-shrink-0 snap-start"
                              >
                                <MatchedVehiclesCard vehicle={vehicle} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-10 text-center bg-white border-2 border-dashed rounded-lg">
                          <Search className="w-12 h-12 mb-4 text-gray-300" />
                          <p className="font-semibold text-gray-700">
                            No Matching Vehicles Found
                          </p>
                          <p className="text-sm text-gray-500">
                            No current inventory matches this buyer&apos;s
                            interest.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
            .filter(Boolean)}
        </div>
      );
    }
  } else if (isError) {
    content = <ApiError error={error} refetch={refetch} />;
  }

  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader className="sticky top-0 z-10 p-4 border-b rounded-t-lg bg-white/80 backdrop-blur-sm sm:p-6 sm:py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl sm:text-2xl">
              Potential Matches
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Best interest and vehicle matches in the system.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-[250px] max-w-sm">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                type="text"
                placeholder="Search buyer name or number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 text-sm"
                disabled={isLoading}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute w-6 h-6 p-0 transform -translate-y-1/2 right-1 top-1/2 hover:bg-gray-100"
                  disabled={isLoading}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              disabled={isLoading || isFetching}
              aria-label="Refresh potential matches"
            >
              <RefreshCcw
                className={`w-4 h-4 ${
                  isLoading || isFetching ? "animate-spin" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </CardHeader>

      <div className="flex-1 p-3 bg-slate-50/50 sm:p-4">{content}</div>
    </Card>
  );
}

export default PotentialMatches;
