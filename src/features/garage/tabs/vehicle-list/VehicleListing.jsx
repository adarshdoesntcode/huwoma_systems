import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RefreshCcw, Car, Settings2 } from "lucide-react";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetVehicleListingsQuery } from "../../garageApiSlice";
import { VehicleCard } from "./VehicleCard";

function VehicleListing({ tab }) {
  const [pageSize, setPageSize] = useState("6");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // You can set this dynamically from API later
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

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <PaginationItem key={i} className="hidden md:block">
            <PaginationLink
              onClick={() => handlePageClick(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <PaginationItem key={`ellipsis-${i}`} className="hidden md:block">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }
    return pages;
  };

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
      <CardFooter className="sticky bottom-0 z-10 px-4 py-2 bg-white border-t rounded-b-lg sm:p-6 sm:py-4">
        <div className="flex items-center justify-between w-full gap-2">
          <Select value={pageSize} onValueChange={setPageSize}>
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-[70px]">
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="9">9</SelectItem>
              <SelectItem value="18">18</SelectItem>
              <SelectItem value="27">27</SelectItem>
              <SelectItem value="36">36</SelectItem>
            </SelectContent>
          </Select>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageClick(currentPage - 1)}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {renderPageNumbers()}
              <PaginationItem className="block px-3 py-1 text-sm md:hidden">
                Page {currentPage} of {totalPages}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageClick(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardFooter>
    </Card>
  );
}

export default VehicleListing;
