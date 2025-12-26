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
import { useGetGarageCustomersQuery } from "../garageApiSlice";
import { GarageCustomersDataTable } from "./GarageCustomersDataTable";
import { GarageCustomersColumn } from "./GarageCustomersColumn";

function GarageCustomers() {
  const { data, isLoading, isSuccess, isFetching, isError, error, refetch } =
    useGetGarageCustomersQuery();
  let content;
  if (isLoading || isFetching) {
    content = (
      <div className="flex items-center justify-center flex-1">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    const customers = data?.data || [];

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
