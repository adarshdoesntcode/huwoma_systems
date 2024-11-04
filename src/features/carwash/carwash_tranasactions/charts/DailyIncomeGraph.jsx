import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
import { format } from "date-fns";

function analyzeDailyIncome(dailyIncome) {
  const windowSize = Math.min(
    Math.max(Math.floor(dailyIncome.length / 10), 1),
    30
  );

  const movingAverage = (arr, windowSize) => {
    const averages = [];
    for (let i = 0; i <= arr.length - windowSize; i++) {
      const sum = arr
        .slice(i, i + windowSize)
        .reduce((acc, curr) => acc + curr, 0);
      averages.push(sum / windowSize);
    }
    return averages;
  };

  const movingAverages = movingAverage(dailyIncome, windowSize);

  if (movingAverages.length < 2) {
    return {
      trend: "stable",
      percentageChange: "0.00",
      currentAverage: (movingAverages[0] || 0).toFixed(2),
      previousAverage: (movingAverages[0] || 0).toFixed(2),
    };
  }

  const currentAverage = movingAverages[movingAverages.length - 1];
  const previousAverage = movingAverages[movingAverages.length - 2];
  const percentageChange =
    ((currentAverage - previousAverage) / previousAverage) * 100;

  const trend =
    currentAverage > previousAverage
      ? "up"
      : currentAverage < previousAverage
      ? "down"
      : "stable";

  return {
    trend,
    percentageChange: percentageChange.toFixed(2),
    currentAverage: currentAverage.toFixed(2),
    previousAverage: previousAverage.toFixed(2),
  };
}

export function DailyIncomeGraph({ dailyIncome, range }) {
  const incomes = dailyIncome.map((item) => item.Income);

  const { trend, percentageChange } = analyzeDailyIncome(incomes);

  const chartConfig = {
    mobile: {
      label: "Income",
      color: `hsl(var(--chart-${
        trend === "up" ? "1" : trend === "down" ? "2" : "3"
      }))`,
    },
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Net Revenue</CardTitle>
        <CardDescription className="flex items-center gap-2 font-medium leading-none">
          {trend === "stable" && `Trending ${trend}`}
          {trend !== "stable" && (
            <>
              {`Trending ${trend} by ${Math.abs(percentageChange)}% `}
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <AreaChart
            accessibilityLayer
            data={dailyIncome}
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
              tickFormatter={(value) => format(value, "MMM dd")}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="Income"
              type="natural"
              fill="url(#fillIncome)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Total incomes for each day of earnings between
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {range}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
