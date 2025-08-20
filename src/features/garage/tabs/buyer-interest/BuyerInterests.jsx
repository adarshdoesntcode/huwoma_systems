import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RefreshCcw, MessageSquareHeart, Settings2 } from "lucide-react";
import { useGetBuyerInterestsQuery } from "../../garageApiSlice";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";
import { skipToken } from "@reduxjs/toolkit/query";
import { InterestCard } from "../../components/InterestCard";
import GaragePagination from "../../components/GaragePagination";

function BuyerInterests({ tab }) {
  const [pageSize, setPageSize] = useState("6");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [query, setQuery] = useState({
    status: "Active",
  });
  const [showFilter, setShowFilter] = useState(false);
  const queryArgs =
    tab === "interest"
      ? {
          pageModel: { currentPage, pageSize: Number(pageSize) },
          reportModel: query,
        }
      : skipToken;

  const { isLoading, isSuccess, isError, isFetching, error, refetch, data } =
    useGetBuyerInterestsQuery(queryArgs);

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
      <div className="flex items-center justify-center flex-1 h-64">
        <Loader />
      </div>
    );
  } else if (data?.data) {
    content = (
      <>
        {data.data.interests.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.data.interests.map((interest) => (
              <InterestCard key={interest._id} interest={interest} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <MessageSquareHeart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-sm font-medium text-gray-900">
              No interests found
            </h3>
            <p className="text-xs text-gray-500">
              There are no buyer interests available at the moment.
            </p>
          </div>
        )}
      </>
    );
  } else if (isError) {
    content = (
      <div className="flex items-center justify-center flex-1 h-64">
        <ApiError error={error} refetch={refetch} />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4 bg-white border-b rounded-t-lg top-[60px] sm:p-6 sm:py-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl sm:text-2xl">
              Buyer Interests
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Vehicle interests of potential buyers
            </CardDescription>
          </div>
          <div className="flex items-end gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isFetching || isLoading}
              aria-label="Refresh vehicle listings"
            >
              <RefreshCcw
                className={`w-4 h-4 ${isFetching && "animate-spin"}`}
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

export default BuyerInterests;
