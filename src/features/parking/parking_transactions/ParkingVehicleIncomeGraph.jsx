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
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

function createChartConfig(paymentData) {
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    label: {
      color: "hsl(var(--background))",
    },
  };
  paymentData.forEach((payment, index) => {
    const colorVar = `--chart-${index + 1}`;
    chartConfig[payment.paymentModeId] = {
      label: payment.paymentModeName,
      color: `hsl(var(${colorVar}))`,
    };
  });

  return chartConfig;
}

function calculatePaymentModeTotals(transactions) {
  const paymentModeTotals = {};

  transactions.forEach((transaction) => {
    const paymentModeId = transaction.vehicle?._id;
    const netAmount = transaction?.netAmount;

    if (!paymentModeTotals[paymentModeId]) {
      paymentModeTotals[paymentModeId] = {
        total: 0,
        paymentModeName: transaction.vehicle?.vehicleTypeName,
      };
    }

    paymentModeTotals[paymentModeId].total += netAmount;
  });

  const result = Object.entries(paymentModeTotals)
    .map(([paymentModeId, { total, paymentModeName }]) => ({
      paymentModeId,
      paymentModeName,
      total,
      fill: `var(--color-${paymentModeId})`,
    }))
    .filter(({ total }) => total > 0);

  return result;
}

function ParkingVehicleIncomeGraph({ completetedTransactions, range }) {
  const paymentGraphData = calculatePaymentModeTotals(completetedTransactions);
  const chartConfig = useMemo(
    () => createChartConfig(paymentGraphData),
    [paymentGraphData]
  );

  return (
    <Card className="col-span-12 xl:col-span-6">
      <CardHeader className="pb-0 p-4 sm:p-6 sm:pb-0">
        <CardTitle className="text-lg sm:text-xl">
          Vehicle Type Breakdown
        </CardTitle>
        <CardDescription className="text-xs">
          {range.split("-")[0].trim() === range.split("-")[1].trim()
            ? range.split("-")[0]
            : range}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <BarChart
            accessibilityLayer
            data={paymentGraphData}
            layout="vertical"
            margin={{
              left: 20,
            }}
          >
            <CartesianGrid horizontal={false} />

            <YAxis
              dataKey="paymentModeName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <XAxis dataKey="total" type="number" hide />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hide indicator="line" />}
            />
            <Bar dataKey="total" layout="vertical" radius={10} barSize={50}>
              <LabelList
                dataKey="total"
                position="insideLeft"
                offset={14}
                className="fill-[--color-label]"
                fontSize={12}
                formatter={(value) => value.toLocaleString()}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default ParkingVehicleIncomeGraph;
