import Loader from "@/components/Loader";
import { useGetSimRacingCustomersQuery } from "../simRacingApiSlice";
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

function SimRacingCustomers() {
  const { data, isLoading, isSuccess, isFetching, isError, error } =
    useGetSimRacingCustomersQuery();
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
