import { useGetCarwashCustomersQuery } from "../carwashApiSlice";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import NavBackButton from "@/components/NavBackButton";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CarwashCustomersColumn } from "./CarwashCustomersColumn";
import { CarwashCustomersDataTable } from "./CarwashCustomersDataTable";
import { useMemo, useState } from "react";

function CarwashCustomers() {
  const [filter, setFilter] = useState("customerContact");
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const debouncedSearch = useDebounce(search, 300);

  const queryParams = useMemo(() => {
    const sort = sorting[0];
    const effectiveSearch = search ? debouncedSearch : "";
    const params = {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      searchField: filter,
    };

    if (effectiveSearch) {
      params.search = effectiveSearch;
    }

    if (sort) {
      params.sortBy = sort.id;
      params.sortOrder = sort.desc ? "desc" : "asc";
    }

    return params;
  }, [debouncedSearch, filter, pagination, search, sorting]);

  const { data, isLoading, isSuccess, isFetching, isError, error } =
    useGetCarwashCustomersQuery(queryParams);
  let content;
  if (isLoading) {
    content = (
      <div className="flex items-center justify-center flex-1">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    const responseData = data?.data || {};
    const customers = Array.isArray(responseData)
      ? responseData
      : responseData.customers || [];
    const paginationMetadata = responseData.pagination || {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      total: customers.length,
      totalPages: 1,
    };

    content = (
      <div className=" space-y-4 mb-64">
        <NavBackButton buttonText={"Back"} navigateTo={-1} />
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl">
              Carwash Customers
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              All the customers who have visited the car wash
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">
            <CarwashCustomersDataTable
              data={customers}
              columns={CarwashCustomersColumn}
              filter={filter}
              search={search}
              sorting={sorting}
              pagination={pagination}
              paginationMetadata={paginationMetadata}
              isFetching={isFetching}
              queryParams={queryParams}
              onFilterChange={(value) => {
                setFilter(value);
                setSearch("");
                setSorting([]);
                setPagination((current) => ({ ...current, pageIndex: 0 }));
              }}
              onSearchChange={(value) => {
                setSearch(value);
                setPagination((current) => ({ ...current, pageIndex: 0 }));
              }}
              onSortingChange={(updater) => {
                setSorting(updater);
                setPagination((current) => ({ ...current, pageIndex: 0 }));
              }}
              onPaginationChange={setPagination}
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

export default CarwashCustomers;
