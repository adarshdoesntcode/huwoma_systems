import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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
import { useEffect, useMemo, useState } from "react";

function createChartConfig(incomeData) {
  const chartConfig = {
    views: {
      label: "Income",
    },
    label: {
      color: "hsl(var(--background))",
    },
  };
  incomeData.forEach((vehicle, index) => {
    const colorVar = `--chart-${index + 1}`;
    chartConfig[vehicle.vehicleTypeName] = {
      label: vehicle.vehicleTypeName,
      color: `hsl(var(${colorVar}))`,
    };
  });

  return chartConfig;
}

const VehicleIncomeGraph = ({ vehicleIncomeData }) => {
  const chartConfig = useMemo(
    () => createChartConfig(vehicleIncomeData),
    [vehicleIncomeData]
  );
  const excludedKeys = ["views", "label"];
  const keys = Array.from(
    Object.keys(chartConfig),
    (key) => !excludedKeys.includes(key) && key
  ).filter(Boolean);

  const [activeChart, setActiveChart] = useState(keys[0]);

  useEffect(() => {
    if (!keys.length) {
      return;
    }

    if (!activeChart || !keys.includes(activeChart)) {
      setActiveChart(keys[0]);
    }
  }, [keys, activeChart]);

  const selectedChart = activeChart && keys.includes(activeChart)
    ? activeChart
    : keys[0];

  const total = vehicleIncomeData.reduce((acc, curr) => {
    const totalIncome = curr.services?.reduce(
      (sum, service) => sum + service.income,
      0
    );
    acc[curr.vehicleTypeName] = totalIncome;
    return acc;
  }, {});

  const serviceData =
    vehicleIncomeData.filter(
      (vehicle) => vehicle.vehicleTypeName === selectedChart
    )[0]?.services || [];

  return (
    <Card className="col-span-12 xl:col-span-6">
      <CardHeader className="flex flex-col  space-y-0 border-b p-0 sm:flex-row">
        <div className="w-full overflow-x-auto">
          <div className="flex min-w-max">
          {keys.map((key) => {
            const chart = key;

            return (
              <button
                key={chart}
                data-active={selectedChart === chart}
                className=" flex  shrink-0 flex-col justify-center gap-1 border-t px-6 py-4 text-left even-border-l data-[active=true]:bg-muted/50 sm:border-r sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span
                  className="text-xs leading-5 text-muted-foreground whitespace-normal break-words"
                  title={chartConfig[chart].label}
                >
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-2xl">
                  {(total[key] || 0).toLocaleString()}
                </span>
              </button>
            );
          })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <BarChart
            accessibilityLayer
            data={serviceData}
            layout="vertical"
            margin={{
              right: 90,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="serviceTypeName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="income" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="income"
              layout="vertical"
              fill={`${chartConfig[selectedChart]?.color}`}
              radius={10}
              barSize={50}
            >
              <LabelList
                dataKey="serviceTypeName"
                position="insideLeft"
                offset={10}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="income"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={16}
                fontWeight={700}
                formatter={(value) => value.toLocaleString()}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default VehicleIncomeGraph;
