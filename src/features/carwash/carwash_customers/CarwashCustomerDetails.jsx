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
import { Table } from "@/components/ui/table";

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
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl">
              {customer.customerName}
            </CardTitle>
            <CardDescription className="flex flex-col text-xs">
              <span>{customer.customerContact}</span>
              <span>Since {format(customer.createdAt, "MMMM d, yyyy")}</span>
            </CardDescription>
            <div>
              {vehicleWithServicesAndStats.map((vehicleWithService, index) => {
                return (
                  <div key={index}>
                    <Label className="text-xs">
                      {vehicleWithService.vehicleTypeName}
                    </Label>
                    <Table>
                      {vehicleWithService.services.map((service, index) => {
                        return (
                          <div key={index}>
                            <div className="flex justify-between">
                              <span>{service.serviceTypeName}</span>
                              <span>
                                {service.totalTransactions} Transaction
                                {service.totalTransactions > 1 && "s"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Wash Count</span>
                              <span>{service.washCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Streak</span>
                              <span>{service.streak}</span>
                            </div>
                          </div>
                        );
                      })}
                    </Table>
                  </div>
                );
              })}
            </div>
          </CardHeader>
          <CardContent className="p-4  sm:p-6 pt-0 sm:pt-0">
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
