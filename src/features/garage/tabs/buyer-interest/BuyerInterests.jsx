import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import {
  RefreshCcw,
  MessageSquareHeart,
  Settings2,
  Phone,
  User,
  Calendar,
  DollarSign,
  Eye,
  Menu,
  Edit,
  Trash,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetBuyerInterestsQuery } from "../../garageApiSlice";
import Loader from "@/components/Loader";
import StatusBadge from "@/components/ui/StatusBadge";
import DynamicMenu from "../../components/DynamicMenu";
import { useNavigate } from "react-router-dom";
import ApiError from "@/components/error/ApiError";
import DeleteBuyerInterest from "./mutation/DeleteBuyerInterest";
import { skipToken } from "@reduxjs/toolkit/query";

// Mock data for demonstration

function BuyerInterests({ tab }) {
  const [pageSize, setPageSize] = useState("6");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [query, setQuery] = useState({
    status: "Active",
  });

  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

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

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages)
      setCurrentPage(page);
  };

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

      {/* Fixed Pagination Footer */}
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
              {/* Desktop Pagination Numbers */}
              {renderPageNumbers()}
              {/* Mobile-only current page */}
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

const InterestCard = ({ interest }) => {
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card
      key={interest._id}
      className="h-full uration-300 animate-in fade-in-10 slide-in-from-bottom-1"
    >
      <CardHeader className="p-4 ">
        <div className="flex items-start justify-between">
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
          {/* <Badge className={getStatusColor(status)}>{status}</Badge> */}
          <StatusBadge status={status} />
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-4">
        {/* Budget Section */}
        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-1">
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
            <span className="text-xs">View Details</span>
          </Button>
          <DynamicMenu configs={interestConfigs}>
            <Button variant="outline" size="sm">
              <Menu className="w-4 h-4" />
            </Button>
          </DynamicMenu>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <Calendar className="w-3 h-3" />
          Listed on {formatDate(createdAt)}
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
export default BuyerInterests;
