import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCcw, Car, Settings2 } from "lucide-react";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetVehicleListingsQuery } from "../../garageApiSlice";
import { VehicleCard } from "./VehicleCard";
import GaragePagination from "../../components/GaragePagination";
import VehicleFilter from "./filter/VehicleFilter";

function VehicleListing({ tab }) {
  const [pageSize, setPageSize] = useState("9");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [sortBy, setSortBy] = useState("newest");
  const [query, setQuery] = useState({
    status: "Available",
    isVerified: true,
  });

  const queryArgs =
    tab === "listing"
      ? {
        pageModel: { currentPage, pageSize: Number(pageSize) },
        reportModel: query,
        sortBy: sortBy === "newest" ? undefined : sortBy,
      }
      : skipToken;

  const { data, isSuccess, isFetching, isLoading, isError, error, refetch } =
    useGetVehicleListingsQuery(queryArgs);

  const handleRefresh = () => {
    refetch();
  };

  useEffect(() => {
    handleRefresh();
  }, [currentPage, pageSize, query, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, query]);

  useEffect(() => {
    if (isSuccess && data?.data) {
      const count = data.data.count;
      const totalPages = Math.ceil(count / pageSize);
      setTotalPages(totalPages);
    }
  }, [data, isSuccess]);

  let content;
  if (isLoading) {
    content = (
      <div className="flex items-center justify-center flex-1 h-full">
        <Loader />
      </div>
    );
  } else if (isSuccess && data?.data) {
    if (data.data.vehicles.length > 0) {
      content = (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {data.data.vehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} />
          ))}
        </div>
      );
    } else {
      content = (
        <div className="py-8 text-center">
          <Car className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="mb-2 text-sm font-medium text-gray-900">
            No vehicles found
          </h3>
          <p className="text-xs text-gray-500">
            There are no vehicles available for sale at the moment.
          </p>
        </div>
      );
    }
  } else if (isError) {
    content = <ApiError error={error} refetch={refetch} />;
  }

  return (
    <Card>
      <CardHeader className="p-4 bg-white border-b rounded-t-lg top-[60px] sm:p-6 sm:py-4">
        <div className="flex items-center justify-end sm:justify-between ">
          <div className="hidden sm:block">
            <CardTitle className="text-xl sm:text-2xl">Vehicles</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Vehicles available for sale
            </CardDescription>
          </div>
          <div className="flex items-end gap-2">
            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="priceAsc">Low to High</SelectItem>
                <SelectItem value="priceDesc">High to Low</SelectItem>
              </SelectContent>
            </Select>
            {/* <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              aria-label="Refresh vehicle listings"
            >
              <RefreshCcw
                className={`w-4 h-4 ${isLoading || isFetching ? "animate-spin" : ""
                  }`}
              />
            </Button> */}
            <VehicleFilter query={query} setQuery={setQuery} />
          </div>
        </div>
      </CardHeader>

      <div className="flex-1 px-4 pt-4 pb-4 overflow-y-auto sm:px-6">
        {content}
      </div>

      {/* Pagination Footer */}
      <GaragePagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
      />
    </Card>
  );
}

export default VehicleListing;
