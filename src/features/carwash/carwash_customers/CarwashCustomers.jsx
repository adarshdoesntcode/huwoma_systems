import { useGetCarwashCustomersQuery } from "../carwashApiSlice";
import ApiError from "@/components/error/ApiError";
import Loader from "@/components/Loader";
import NavBackButton from "@/components/NavBackButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CarwashCustomersColumn } from "./CarwashCustomersColumn";
import { CarwashCustomersDataTable } from "./CarwashCustomersDataTable";

function CarwashCustomers() {
  const { data, isLoading, isSuccess, isFetching, isError, error } =
    useGetCarwashCustomersQuery();
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
      <div className=" space-y-4 mb-64">
        <NavBackButton buttonText={"Car Wash Customers"} navigateTo={-1} />
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl">All Customers</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              All the customers who have visited the car wash
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">
            <CarwashCustomersDataTable
              data={customers}
              columns={CarwashCustomersColumn}
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
