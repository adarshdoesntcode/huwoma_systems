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
import { RefreshCcw, Car, PlusCircle } from "lucide-react";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import { useGetPublicVehicleListingsQuery } from "../garageApiSlice";
import { PublicVehicleCard } from "./PublicVehicleCard";
import GaragePagination from "../components/GaragePagination";
import { IMAGE_DATA } from "@/lib/config";
import { VehicleCard } from "../tabs/vehicle-list/VehicleCard";
import { useNavigate } from "react-router-dom";

function PublicVehicleListings() {
    const [pageSize, setPageSize] = useState("18");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [sortBy, setSortBy] = useState("newest");
    const [query, setQuery] = useState({ status: "Available" });
    const navigate = useNavigate();

    const queryArgs = {
        pageModel: { currentPage, pageSize: Number(pageSize) },
        sortBy: sortBy === "newest" ? undefined : sortBy,
        reportModel: query,
    };

    const { data, isSuccess, isFetching, isLoading, isError, error, refetch } =
        useGetPublicVehicleListingsQuery(queryArgs);

    const handleRefresh = () => {
        refetch();
    };

    useEffect(() => {
        handleRefresh();
    }, [currentPage, pageSize, sortBy, query]);

    // Reset to page 1 when filters or sort changes
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

    const initialQuery = { status: "Available" };
    const hasActiveFilters = JSON.stringify(query) !== JSON.stringify(initialQuery);

    let content;
    if (isLoading || isFetching) {
        content = (
            <div className="flex items-center justify-center flex-1 h-full min-h-[400px]">
                <Loader />
            </div>
        );
    } else if (isSuccess && data?.data) {
        if (data.data.vehicles.length > 0) {
            content = (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {data.data.vehicles.map((vehicle) => (
                        <VehicleCard key={vehicle._id} scope="public" vehicle={vehicle} />
                    ))}
                </div>
            );
        } else {
            content = (
                <div className="py-16 text-center">
                    <Car className="w-20 h-20 mx-auto mb-4 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                        No vehicles available
                    </h3>
                    <p className="text-sm text-gray-500">
                        {hasActiveFilters
                            ? "No vehicles match your current filters. Try adjusting them."
                            : "There are no vehicles available for sale at the moment."}
                    </p>
                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setQuery({ status: "Available" })}
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            );
        }
    } else if (isError) {
        content = <ApiError error={error} refetch={refetch} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="flex sticky top-0 h-14 items-center gap-4 z-50 bg-slate-100/50 backdrop-filter backdrop-blur-lg px-4 lg:h-[60px] lg:px-6">
                <div className="relative max-w-[75.5rem] mx-auto flex-1">
                    <div className="flex items-center justify-between">
                        <img
                            loading="lazy"
                            src={IMAGE_DATA.huwoma_logo}
                            className="h-6 aspect-auto"
                        />
                        <Button
                            size="sm"
                            onClick={() => navigate("/garagebyhuwoma/new-vehicle")}
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            <span >Your Vehicle</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
                <Card>
                    <CardHeader className="p-4 bg-white border-b rounded-t-lg sm:p-6 sm:py-4">
                        <div className="flex items-center justify-end sm:justify-between">
                            <div className="hidden sm:block">
                                <CardTitle className="text-lg sm:text-xl">Vehicles</CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Vehicles available for sale
                                </CardDescription>
                            </div>
                            <div className="flex items-end gap-2">
                                {/* Sort Dropdown */}
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[120px] sm:w-[160px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest First</SelectItem>
                                        <SelectItem value="priceAsc">Low to High</SelectItem>
                                        <SelectItem value="priceDesc">High to Low</SelectItem>
                                        <SelectItem value="yearDesc">Year: Newest</SelectItem>
                                        <SelectItem value="mileageAsc">Mileage: Lowest</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Refresh Button */}
                                <Button
                                    variant="outline"
                                    className="ml-2"
                                    onClick={() => refetch()}
                                >
                                    <RefreshCcw className=" w-4 h-4 sm:mr-2" />
                                    <span className="hidden sm:block">

                                        Refresh
                                    </span>
                                </Button>
                                {/* <Button
                                    variant="outline"
                                    className="ml-2"
                                    onClick={() => refetch()}
                                >
                                    <RefreshCcw className=" w-4 h-4 sm:mr-2" />
                                    <span className="hidden sm:block">

                                        Refresh
                                    </span>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="ml-2"
                                    onClick={() => refetch()}
                                >
                                    <RefreshCcw className=" w-4 h-4 sm:mr-2" />
                                    <span className="hidden sm:block">

                                        Refresh
                                    </span>
                                </Button> */}
                            </div>
                        </div>
                    </CardHeader>

                    <div className="flex-1 px-4 pt-4 pb-4 overflow-y-auto sm:px-6">
                        {content}
                    </div>

                    {/* Pagination */}
                    <GaragePagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        totalPages={totalPages}
                    />
                </Card>

                {/* Footer */}

            </div>
            <footer className="mt-12 border-t bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} Huwoma Systems. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default PublicVehicleListings;
