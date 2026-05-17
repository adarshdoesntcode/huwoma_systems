import Loader from "@/components/Loader";

import ApiError from "@/components/error/ApiError";
import NavBackButton from "@/components/NavBackButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useExportGarageCustomersMutation,
  useGetGarageCustomersQuery,
} from "../garageApiSlice";
import { GarageCustomersDataTable } from "./GarageCustomersDataTable";
import { GarageCustomersColumn } from "./GarageCustomersColumn";
import { useMemo, useState } from "react";
import {
  downloadBlob,
  getFilenameFromDisposition,
} from "@/lib/download/downloadBlob";
import { toast } from "@/hooks/use-toast";

function GarageCustomers() {
  const [filter, setFilter] = useState("contactNumber");
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const queryParams = useMemo(() => {
    const activeSort = sorting[0];

    return {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search,
      searchField: filter,
      ...(activeSort
        ? {
            sortBy: activeSort.id,
            sortOrder: activeSort.desc ? "desc" : "asc",
          }
        : {}),
    };
  }, [filter, pagination.pageIndex, pagination.pageSize, search, sorting]);

  const { data, isLoading, isSuccess, isFetching, isError, error, refetch } =
    useGetGarageCustomersQuery(queryParams);
  const [exportGarageCustomers, { isLoading: isExporting }] =
    useExportGarageCustomersMutation();

  const handleExport = async () => {
    try {
      const { page, limit, ...exportParams } = queryParams;
      const exportResult = await exportGarageCustomers(exportParams).unwrap();
      const filename = getFilenameFromDisposition(
        exportResult.contentDisposition,
        "GarageCustomers.xlsx"
      );

      downloadBlob(exportResult.blob, filename);
      toast({
        title: "Exported Successfully!!",
        description: "Check your downloads folder",
        duration: 2000,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: "Could not download",
      });
    }
  };

  let content;
  if (isLoading) {
    content = (
      <div className="flex items-center justify-center flex-1">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    const customers = data?.data?.customers || [];
    const paginationMetadata = data?.data?.pagination || {};

    content = (
      <div className="mb-64 space-y-4 ">
        <NavBackButton buttonText={"Back"} navigateTo={-1} />
        <Card className="duration-300 animate-in fade-in-10 slide-in-from-bottom-1">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl">
              Garage Customers
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              All the customers of the garage
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <GarageCustomersDataTable
              data={customers}
              columns={GarageCustomersColumn}
              filter={filter}
              search={search}
              sorting={sorting}
              pagination={pagination}
              paginationMetadata={paginationMetadata}
              isFetching={isFetching}
              isExporting={isExporting}
              onFilterChange={(value) => {
                setFilter(value);
                setSearch("");
                setSorting([]);
                setPagination((current) => ({
                  ...current,
                  pageIndex: 0,
                }));
              }}
              onSearchChange={(value) => {
                setSearch(value);
                setPagination((current) => ({
                  ...current,
                  pageIndex: 0,
                }));
              }}
              onPaginationChange={setPagination}
              onSortingChange={(updater) => {
                setSorting(updater);
                setPagination((current) => ({
                  ...current,
                  pageIndex: 0,
                }));
              }}
              onExport={handleExport}
            />
          </CardContent>
        </Card>
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} refetch={refetch} />;
  }

  return content;
}

export default GarageCustomers;
