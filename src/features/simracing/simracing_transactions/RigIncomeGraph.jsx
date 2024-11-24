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
    chartConfig[payment.rigId] = {
      label: payment.rigName,
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
  const rigTotals = {};

  transactions.forEach((transaction) => {
    const rigId = transaction.rig?._id;
    const netAmount = transaction?.netAmount;
    const rigName = transaction.rig?.rigName;

    if (!rigTotals[rigId]) {
      rigTotals[rigId] = {
        total: 0,
        rigName,
      };
    }

    rigTotals[rigId].total += netAmount;
  });

  const result = Object.entries(rigTotals)
    .map(([rigId, { total, rigName }]) => ({
      rigId,
      rigName,
      total,
      fill: `var(--color-${rigId})`,
    }))
    .filter(({ total }) => total > 0);

  return result;
}

function RigIncomeGraph({ completetedTransactions, range }) {
  const paymentGraphData = calculatePaymentModeTotals(completetedTransactions);
  const chartConfig = useMemo(
    () => createChartConfig(paymentGraphData),
    [paymentGraphData]
  );

  return (
    <Card className="col-span-12 xl:col-span-6">
      <CardHeader className="pb-0 p-4 sm:p-6 sm:pb-0">
        <CardTitle className="text-lg sm:text-xl">Rig Income</CardTitle>
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
              dataKey="rigName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return value;
              }}
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

export default RigIncomeGraph;
