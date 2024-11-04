import {
  Activity,
  ArrowUpRight,
  Car,
  ChevronLeft,
  CreditCard,
  DollarSign,
  Droplets,
  File,
  Footprints,
  GlassWater,
  ParkingCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Badge } from "@/components/ui/badge";
export const description = "A multiple bar chart";
const vistorChartData = [
  { month: "January", desktop: 186, mobile: 80, parking: 433 },
  { month: "February", desktop: 305, mobile: 200, parking: 433 },
  { month: "March", desktop: 237, mobile: 120, parking: 433 },
  { month: "April", desktop: 73, mobile: 190, parking: 433 },
  { month: "May", desktop: 209, mobile: 130, parking: 433 },
  { month: "June", desktop: 214, mobile: 140, parking: 433 },
];

const chartData = [
  { date: "2024-04-01", desktop: 22, mobile: 150, parking: 433 },
  { date: "2024-04-02", desktop: 97, mobile: 180, parking: 433 },
  { date: "2024-04-03", desktop: 167, mobile: 120, parking: 433 },
  { date: "2024-04-04", desktop: 42, mobile: 260, parking: 433 },
  { date: "2024-04-05", desktop: 73, mobile: 290, parking: 433 },
  { date: "2024-04-06", desktop: 19, mobile: 340, parking: 433 },
  { date: "2024-04-07", desktop: 145, mobile: 180, parking: 433 },
  { date: "2024-04-08", desktop: 209, mobile: 320, parking: 433 },
  { date: "2024-04-09", desktop: 159, mobile: 110, parking: 433 },
  { date: "2024-04-10", desktop: 261, mobile: 190, parking: 433 },
  { date: "2024-04-11", desktop: 227, mobile: 350, parking: 433 },
  { date: "2024-04-12", desktop: 292, mobile: 210, parking: 433 },
  { date: "2024-04-13", desktop: 342, mobile: 380, parking: 433 },
  { date: "2024-04-14", desktop: 237, mobile: 220, parking: 433 },
  { date: "2024-04-15", desktop: 220, mobile: 170, parking: 433 },
  { date: "2024-04-16", desktop: 238, mobile: 190, parking: 433 },
  { date: "2024-04-17", desktop: 346, mobile: 360, parking: 433 },
  { date: "2024-04-18", desktop: 364, mobile: 410, parking: 433 },
  { date: "2024-04-19", desktop: 243, mobile: 180, parking: 433 },
  { date: "2024-04-20", desktop: 289, mobile: 150, parking: 433 },
  { date: "2024-04-21", desktop: 237, mobile: 200, parking: 433 },
  { date: "2024-04-22", desktop: 324, mobile: 170, parking: 433 },
  { date: "2024-04-23", desktop: 338, mobile: 230, parking: 433 },
  { date: "2024-04-24", desktop: 387, mobile: 290, parking: 433 },
  { date: "2024-04-25", desktop: 315, mobile: 250, parking: 433 },
  { date: "2024-04-26", desktop: 475, mobile: 130, parking: 433 },
  { date: "2024-04-27", desktop: 483, mobile: 420, parking: 433 },
  { date: "2024-04-28", desktop: 422, mobile: 180, parking: 433 },
  { date: "2024-04-29", desktop: 415, mobile: 240, parking: 433 },
  { date: "2024-04-30", desktop: 454, mobile: 380, parking: 433 },
  { date: "2024-05-01", desktop: 465, mobile: 220, parking: 433 },
  { date: "2024-05-02", desktop: 493, mobile: 310, parking: 433 },
  { date: "2024-05-03", desktop: 447, mobile: 190, parking: 433 },
  { date: "2024-05-04", desktop: 485, mobile: 420, parking: 433 },
  { date: "2024-05-05", desktop: 481, mobile: 390, parking: 433 },
  { date: "2024-05-06", desktop: 498, mobile: 520, parking: 433 },
  { date: "2024-05-07", desktop: 488, mobile: 300, parking: 433 },
  { date: "2024-05-08", desktop: 449, mobile: 210, parking: 433 },
  { date: "2024-05-09", desktop: 527, mobile: 180, parking: 433 },
  { date: "2024-05-10", desktop: 593, mobile: 330, parking: 433 },
  { date: "2024-05-11", desktop: 535, mobile: 270, parking: 433 },
  { date: "2024-05-12", desktop: 597, mobile: 240, parking: 433 },
  { date: "2024-05-13", desktop: 597, mobile: 160, parking: 433 },
  { date: "2024-05-14", desktop: 548, mobile: 490, parking: 433 },
  { date: "2024-05-15", desktop: 573, mobile: 380, parking: 433 },
  { date: "2024-05-16", desktop: 638, mobile: 400, parking: 433 },
  { date: "2024-05-17", desktop: 699, mobile: 420, parking: 433 },
  { date: "2024-05-18", desktop: 615, mobile: 350, parking: 433 },
  { date: "2024-05-19", desktop: 635, mobile: 180, parking: 433 },
  { date: "2024-05-20", desktop: 677, mobile: 230, parking: 433 },
  { date: "2024-05-21", desktop: 562, mobile: 140, parking: 433 },
  { date: "2024-05-22", desktop: 561, mobile: 120, parking: 433 },
  { date: "2024-05-23", desktop: 652, mobile: 290, parking: 433 },
  { date: "2024-05-24", desktop: 694, mobile: 220, parking: 433 },
  { date: "2024-05-25", desktop: 601, mobile: 250, parking: 433 },
  { date: "2024-05-26", desktop: 613, mobile: 170, parking: 433 },
  { date: "2024-05-27", desktop: 620, mobile: 460, parking: 433 },
  { date: "2024-05-28", desktop: 633, mobile: 190, parking: 433 },
  { date: "2024-05-29", desktop: 678, mobile: 130, parking: 433 },
  { date: "2024-05-30", desktop: 640, mobile: 280, parking: 433 },
  { date: "2024-05-31", desktop: 678, mobile: 230, parking: 433 },
  { date: "2024-06-01", desktop: 778, mobile: 200, parking: 433 },
  { date: "2024-06-02", desktop: 770, mobile: 410, parking: 433 },
  { date: "2024-06-03", desktop: 703, mobile: 160, parking: 433 },
  { date: "2024-06-04", desktop: 739, mobile: 380, parking: 433 },
  { date: "2024-06-05", desktop: 778, mobile: 140, parking: 433 },
  { date: "2024-06-06", desktop: 794, mobile: 250, parking: 433 },
  { date: "2024-06-07", desktop: 723, mobile: 370, parking: 433 },
  { date: "2024-06-08", desktop: 785, mobile: 320, parking: 433 },
  { date: "2024-06-09", desktop: 738, mobile: 480, parking: 433 },
  { date: "2024-06-10", desktop: 755, mobile: 200, parking: 433 },
  { date: "2024-06-11", desktop: 702, mobile: 150, parking: 433 },
  { date: "2024-06-12", desktop: 792, mobile: 420, parking: 433 },
  { date: "2024-06-13", desktop: 681, mobile: 130, parking: 433 },
  { date: "2024-06-14", desktop: 526, mobile: 380, parking: 433 },
  { date: "2024-06-15", desktop: 707, mobile: 350, parking: 433 },
  { date: "2024-06-16", desktop: 771, mobile: 310, parking: 433 },
  { date: "2024-06-17", desktop: 775, mobile: 520, parking: 433 },
  { date: "2024-06-18", desktop: 707, mobile: 170, parking: 433 },
  { date: "2024-06-19", desktop: 741, mobile: 290, parking: 433 },
  { date: "2024-06-20", desktop: 708, mobile: 450, parking: 433 },
  { date: "2024-06-21", desktop: 769, mobile: 210, parking: 433 },
  { date: "2024-06-22", desktop: 317, mobile: 270, parking: 433 },
  { date: "2024-06-23", desktop: 480, mobile: 530, parking: 433 },
  { date: "2024-06-24", desktop: 132, mobile: 180, parking: 433 },
  { date: "2024-06-25", desktop: 141, mobile: 190, parking: 433 },
  { date: "2024-06-26", desktop: 434, mobile: 380, parking: 433 },
  { date: "2024-06-27", desktop: 448, mobile: 490, parking: 433 },
  { date: "2024-06-28", desktop: 149, mobile: 200, parking: 433 },
  { date: "2024-06-29", desktop: 103, mobile: 160, parking: 433 },
  { date: "2024-06-30", desktop: 446, mobile: 400, parking: 433 },
];

const visitorChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  parking: {
    label: "Parking",
    color: "hsl(var(--chart-3))",
  },
};

const chartConfig = {
  views: {
    label: "Customers",
  },
  desktop: {
    label: "Car Wash",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Sim Racing",
    color: "hsl(var(--chart-2))",
  },
  parking: {
    label: "Parking",
    color: "hsl(var(--chart-3))",
  },
};

export function Dashboard() {
  const [activeChart, setActiveChart] = useState("desktop");
  const navigate = useNavigate();

  const total = useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
      parking: chartData.reduce((acc, curr) => acc + curr.parking, 0),
    }),
    []
  );
  return (
    <div>
      <div className="text-xl font-semibold tracking-tight flex items-center gap-4 mb-4">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        Dashboard
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Carwash Revenue
            </CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15,231</div>
            <p className="text-xs text-muted-foreground">
              +20.1% than yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sim Racing Revenue
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,350</div>
            <p className="text-xs text-muted-foreground">
              +18.1% than yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Parking Revenue
            </CardTitle>
            <ParkingCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,234</div>
            <p className="text-xs text-muted-foreground">+19% than yesterday</p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors</CardTitle>
            <Footprints className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 than yesterday</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid mb-6 gap-4 grid-cols-12">
        <Card className="col-span-12">
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>Customer Traffic</CardTitle>
              <CardDescription>
                Showing total customers for the last 3 months
              </CardDescription>
            </div>
            <div className="flex">
              {["desktop", "mobile", "parking"].map((key) => {
                const chart = key;
                return (
                  <button
                    key={chart}
                    data-active={activeChart === chart}
                    className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    onClick={() => setActiveChart(chart)}
                  >
                    <span className="text-xs text-muted-foreground">
                      {chartConfig[chart].label}
                    </span>
                    <span className="text-lg font-bold leading-none sm:text-3xl">
                      {total[key].toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="views"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                />
                <Line
                  dataKey={activeChart}
                  type="monotone"
                  stroke={`var(--color-desktop)`}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                Recent transactions from your store.
              </CardDescription>
            </div>
            <Button
              asChild
              size="sm"
              className="ml-auto gap-2"
              variant="outline"
            >
              <Link href="#">
                Export
                <File className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Liam Johnson</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      liam@example.com
                    </div>
                  </TableCell>
                  <TableCell>Car Wash</TableCell>
                  <TableCell>
                    <Badge className="text-xs" variant="outline">
                      Cash
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell ">
                    2023-06-23
                  </TableCell>
                  <TableCell className="text-right">+1200.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Olivia Smith</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      olivia@example.com
                    </div>
                  </TableCell>
                  <TableCell>Car Wash</TableCell>
                  <TableCell>
                    <Badge className="text-xs" variant="outline">
                      Fonepay
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell ">
                    2023-06-24
                  </TableCell>
                  <TableCell className="text-right">+600.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Noah Williams</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      noah@example.com
                    </div>
                  </TableCell>
                  <TableCell>Sim Racing</TableCell>
                  <TableCell>
                    <Badge className="text-xs" variant="outline">
                      Card
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell ">
                    2023-06-25
                  </TableCell>
                  <TableCell className="text-right">+750.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Emma Brown</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      emma@example.com
                    </div>
                  </TableCell>
                  <TableCell>Parking</TableCell>
                  <TableCell>
                    <Badge className="text-xs" variant="outline">
                      Cash
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell ">
                    2023-06-26
                  </TableCell>
                  <TableCell className="text-right">+450.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Liam Johnson</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      liam@example.com
                    </div>
                  </TableCell>
                  <TableCell>Car Wash</TableCell>
                  <TableCell>
                    <Badge className="text-xs" variant="outline">
                      Fonepay
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell ">
                    2023-06-27
                  </TableCell>
                  <TableCell className="text-right">+850.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle>Breakdown</CardTitle>
            <CardDescription>
              Breakdown of today&apos;s collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={3}>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={3}>{invoice.paymentMethod}</TableCell>
                    <TableCell className="text-end">
                      {invoice.totalAmount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">29,915.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const invoices = [
  {
    totalAmount: "+9093.00",
    paymentMethod: "Cash",
  },
  {
    totalAmount: "+2929.00",
    paymentMethod: "Fonepay",
  },
  {
    totalAmount: "+10675.00",
    paymentMethod: "Card",
  },
  {
    totalAmount: "+3687.00",
    paymentMethod: "Bank Transfer",
  },
  {
    totalAmount: "+3531.00",
    paymentMethod: "Others",
  },
];

export default Dashboard;
