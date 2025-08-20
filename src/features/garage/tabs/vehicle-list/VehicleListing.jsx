import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RefreshCcw, Car, Settings2 } from "lucide-react";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetVehicleListingsQuery } from "../../garageApiSlice";
import { VehicleCard } from "./VehicleCard";
import GaragePagination from "../../components/GaragePagination";

function VehicleListing({ tab }) {
  const [pageSize, setPageSize] = useState("6");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [query, setQuery] = useState({
    status: "Available",
  });
  const [showFilter, setShowFilter] = useState(false);

  const queryArgs =
    tab === "listing"
      ? {
          pageModel: { currentPage, pageSize: Number(pageSize) },
          reportModel: query,
        }
      : skipToken;

  const { data, isSuccess, isFetching, isLoading, isError, error, refetch } =
    useGetVehicleListingsQuery(queryArgs);

  const handleRefresh = () => {
    refetch();
  };

  useEffect(() => {
    handleRefresh();
  }, [currentPage, pageSize]);

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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl sm:text-2xl">Vehicles</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Vehicles available for sale
            </CardDescription>
          </div>
          <div className="flex items-end gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              aria-label="Refresh vehicle listings"
            >
              <RefreshCcw
                className={`w-4 h-4 ${
                  isLoading || isFetching ? "animate-spin" : ""
                }`}
              />
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilter((prev) => !prev)}
              aria-label="Toggle filters"
            >
              <span className="sr-only sm:not-sr-only">Filter</span>
              <Settings2 className="w-4 h-4 sm:ml-2" />
            </Button>
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
