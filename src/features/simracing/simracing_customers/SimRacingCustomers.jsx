import Loader from "@/components/Loader";
import {
  useExportSimRacingCustomersMutation,
  useGetSimRacingCustomersQuery,
} from "../simRacingApiSlice";
import ApiError from "@/components/error/ApiError";
import NavBackButton from "@/components/NavBackButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SimRacingCustomersDataTable } from "./SimRacingCustomersDataTable";
import { SimRacingCustomersColumn } from "./SimRacingCustomersColumn";
import { useMemo, useState } from "react";
import {
  downloadBlob,
  getFilenameFromDisposition,
} from "@/lib/download/downloadBlob";
import { toast } from "@/hooks/use-toast";

function SimRacingCustomers() {
  const [filter, setFilter] = useState("customerContact");
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

  const { data, isLoading, isSuccess, isFetching, isError, error } =
    useGetSimRacingCustomersQuery(queryParams);
  const [exportSimRacingCustomers, { isLoading: isExporting }] =
    useExportSimRacingCustomersMutation();

  const handleExport = async () => {
    try {
      const { page, limit, ...exportParams } = queryParams;
      const exportResult = await exportSimRacingCustomers(exportParams).unwrap();
      const filename = getFilenameFromDisposition(
        exportResult.contentDisposition,
        "SimRacingCustomers.xlsx"
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
      <div className=" space-y-4 mb-64">
        <NavBackButton buttonText={"Back"} navigateTo={-1} />
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl">
              Sim Racing Customers
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              All the customers who have visited the sim racing
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">
            <SimRacingCustomersDataTable
              data={customers}
              columns={SimRacingCustomersColumn}
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
    content = <ApiError error={error} />;
  }

  return content;
}

export default SimRacingCustomers;
