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

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

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
    chartConfig[payment.paymentModeName] = {
      label: payment.paymentModeName,
      color: `hsl(var(${colorVar}))`,
    };
  });

  return chartConfig;
}

// const chartConfig = {
//   chrome: {
//     label: "Chrome",
//     color: "hsl(var(--chart-1))",
//   },
//   safari: {
//     label: "Safari",
//     color: "hsl(var(--chart-2))",
//   },
//   firefox: {
//     label: "Firefox",
//     color: "hsl(var(--chart-3))",
//   },
//   edge: {
//     label: "Edge",
//     color: "hsl(var(--chart-4))",
//   },
//   other: {
//     label: "Other",
//     color: "hsl(var(--chart-5))",
//   },
//   label: {
//     color: "hsl(var(--background))",
//   },
// };

function calculatePaymentModeTotals(transactions) {
  const paymentModeTotals = {};

  transactions.forEach((transaction) => {
    const paymentModeName = transaction.paymentMode?.paymentModeName;
    const netAmount = transaction?.netAmount;

    if (!paymentModeTotals[paymentModeName]) {
      paymentModeTotals[paymentModeName] = 0;
    }

    paymentModeTotals[paymentModeName] += netAmount;
  });

  const result = Object.entries(paymentModeTotals)
    .map(([paymentModeName, total]) => ({
      paymentModeName,
      total,
      fill: `var(--color-${paymentModeName})`,
    }))
    .filter(({ total }) => total > 0);

  return result;
}

function PaymentsGraph({ completetedTransactions }) {
  const paymentGraphData = calculatePaymentModeTotals(completetedTransactions);
  const chartConfig = useMemo(
    () => createChartConfig(paymentGraphData),
    [paymentGraphData]
  );
  console.log("🚀 ~ PaymentsGraph ~ chartConfig:", chartConfig);

  return (
    <Card className="col-span-12 sm:col-span-6">
      <CardHeader className="pb-0">
        <CardTitle>Payment Breakdown</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className=" max-h-40 w-full">
          <BarChart
            accessibilityLayer
            data={paymentGraphData}
            layout="vertical"
            margin={{
              left: 20,
            }}
          >
            <YAxis
              dataKey="paymentModeName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => chartConfig[value]?.label}
            />
            <XAxis dataKey="total" type="number" hide />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" layout="vertical" radius={10}>
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
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}

export default PaymentsGraph;
