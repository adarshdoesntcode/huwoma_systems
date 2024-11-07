import { useParams } from "react-router-dom";
import { useGetCarwashCustomerByIdQuery } from "../carwashApiSlice";
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
import { format } from "date-fns";
import { CarwashFilterTranasactionDataTable } from "../carwash_tranasactions/CarwashFilterTransactionDataTable";
import { CarwashFilterTransactionColumn } from "../carwash_tranasactions/CarwashFilterTransactionColumn";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

function CarwashCustomerDetails() {
  const { id } = useParams();

  const { data, isLoading, isFetching, isSuccess, isError, error } =
    useGetCarwashCustomerByIdQuery(id);

  let customer = {};
  let customerTransactions = [];
  let vehicleWithServices = [];
  let vehicleWithServicesAndStats;

  if (data) {
    customer = data?.data.customer || {};
    customerTransactions =
      data?.data?.customer?.customerTransactions.filter(
        (transaction) =>
          transaction.transactionStatus === "Completed" &&
          transaction.paymentStatus === "Paid"
      ) || [];

    vehicleWithServices = data?.data?.activeVehicleTypes || [];

    vehicleWithServicesAndStats = vehicleWithServices.map(
      (vehicleWithService) => {
        const services = vehicleWithService.services.map((service) => {
          const transactionsForService = customerTransactions.filter(
            (transaction) => transaction.service.id._id === service._id
          );
          const totalTransactions = transactionsForService.length;
          const streak = transactionsForService.filter(
            (transaction) => transaction.redeemed === false
          ).length;
          return {
            serviceTypeName: service.serviceTypeName,
            washCount: service.streakApplicable.washCount,
            totalTransactions,
            streak,
          };
        });
        return {
          vehicleTypeName: vehicleWithService.vehicleTypeName,
          services,
        };
      }
    );
  }

  let content;
  if (isLoading || isFetching) {
    content = (
      <div className="flex items-center justify-center flex-1">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    content = (
      <div className=" space-y-4 mb-64">
        <NavBackButton buttonText={"Back"} navigateTo={-1} />
        <Card>
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-2">
            <CardTitle className="text-xl sm:text-2xl">
              {customer.customerName}
            </CardTitle>
            <CardDescription className="flex flex-col text-xs">
              <span>{customer.customerContact}</span>
              <span>Since {format(customer.createdAt, "MMMM d, yyyy")}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">
            <Separator className="my-2" />
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
              {vehicleWithServicesAndStats.map((vehicleWithService, index) => {
                return (
                  <div key={index} className="space-y-2 ">
                    <Label className="text-xs">
                      {vehicleWithService.vehicleTypeName}
                    </Label>
                    <div className="border rounded-lg">
                      <Table className="text-[10px]">
                        <TableHeader className="border-b bg-muted">
                          <TableRow>
                            <TableHead className=" py-0 ">Services</TableHead>
                            <TableHead className=" py-0  text-center">
                              Current Streak{" "}
                            </TableHead>
                            <TableHead className=" py-0 text-center ">
                              Free After{" "}
                            </TableHead>
                            <TableHead className=" py-0 text-center ">
                              Total Washes{" "}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {vehicleWithService.services.map((service, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  <span>{service.serviceTypeName}</span>
                                </TableCell>
                                <TableCell className="text-center text-xs font-medium py-1 ">
                                  <div className="flex gap-1 flex-col">
                                    <span>{service.streak}</span>
                                    <Progress
                                      className="h-3"
                                      value={
                                        (service.streak / service.washCount) *
                                        100
                                      }
                                    />
                                  </div>
                                </TableCell>
                                <TableCell className="text-center text-xs font-medium">
                                  <span>{service.washCount}</span>
                                </TableCell>
                                <TableCell className="text-center text-xs font-medium">
                                  <span>{service.totalTransactions}</span>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                );
              })}
            </div>
            <CarwashFilterTranasactionDataTable
              data={customer.customerTransactions}
              columns={CarwashFilterTransactionColumn}
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

export default CarwashCustomerDetails;
