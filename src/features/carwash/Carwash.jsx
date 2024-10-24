import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, PlusCircle, ReceiptText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CarwashDataTable } from "./CarwashDataTable";
import { CarwashColumn } from "./CarwashColumn";
import { useGetCarwashTransactionsQuery } from "./carwashApiSlice";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";

const chartConfig = {
  desktop: {
    label: "Customers",
    color: "hsl(var(--chart-2))",
  },
};

function Carwash() {
  const date = new Date();
  const formattedDate = date.toISOString().split("T")[0];
  const { data, isLoading, isFetching, isSuccess, isError, error } =
    useGetCarwashTransactionsQuery(formattedDate);
  const navigate = useNavigate();

  let hourlyCounts;

  if (data) {
    hourlyCounts = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: 0,
    })).map((hour) => {
      const count = data.data.filter((transaction) => {
        const createdAt = new Date(transaction.createdAt);
        return createdAt.getHours() === hour.hour;
      }).length;
      return { hour: hour.hour, count };
    });
  }
  let content;

  if (isLoading || isFetching) {
    content = (
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    content = (
      <div className="space-y-4">
        <div className="text-xl font-semibold  flex items-center tracking-tight  justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 ">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            Car Wash
          </div>
          <div>
            <Button size="sm" variant="outline" className="mr-2">
              Customers <Users className="ml-2 w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline">
              Transactions <ReceiptText className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="bg-white border rounded-md p-2 ">
          <p className="text-xs text-muted-foreground p-2">
            Hourly Traffic Visualization
          </p>
          <ChartContainer config={chartConfig} className="h-[10vh] w-full ">
            <BarChart accessibilityLayer data={hourlyCounts}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
                tickMargin={5}
                axisLine={false}
                tickFormatter={(value) => `${value}:00`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="count"
                fill="var(--color-desktop)"
                radius={4}
                barSize={20}
              />
            </BarChart>
          </ChartContainer>
        </div>
        <div>
          <Tabs defaultValue="queue">
            <div className="flex justify-between">
              <TabsList>
                <TabsTrigger value="queue">Active</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
              </TabsList>
              <div>
                <Button size="sm" variant="outline" className="mr-2">
                  Booking <PlusCircle className="ml-2 w-4 h-4" />
                </Button>
                <Button size="sm" onClick={() => navigate("/carwash/new")}>
                  Record <PlusCircle className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
            <TabsContent value="queue">
              <Card>
                <CardHeader>
                  <CardTitle>Queue</CardTitle>
                  <CardDescription>
                    Vehicles in queue for their wash
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CarwashDataTable data={data.data} columns={CarwashColumn} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="bookings">
              <Card></Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} />;
  }

  return content;
}

export default Carwash;
