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
import { ChevronLeft, PlusCircle } from "lucide-react";
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

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];
const chartConfig = {
  desktop: {
    label: "Customers",
    color: "hsl(var(--chart-2))",
  },
};

function Carwash() {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold tracking-tight flex items-center gap-4 mb-4">
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
        <ChartContainer config={chartConfig} className="h-[10vh] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              // tickLine={false}
              tickMargin={5}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="desktop"
              fill="var(--color-desktop)"
              radius={2}
              // barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </div>
      <div>
        <Tabs defaultValue="active">
          <div className="flex justify-between">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
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
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active</CardTitle>
                <CardDescription>Ongoing sessions on the rigs</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Rig</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Time Lapsed</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* {invoices.map((invoice, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div>{invoice.customer.name}</div>

                          <div>{invoice.customer.contact}</div>
                        </TableCell>
                        <TableCell>{invoice.rig}</TableCell>
                        <TableCell>{invoice.startTime}</TableCell>
                        <TableCell>{invoice.timeLapsed}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="destructive">
                            End
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))} */}
                  </TableBody>
                </Table>
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
}

export default Carwash;
