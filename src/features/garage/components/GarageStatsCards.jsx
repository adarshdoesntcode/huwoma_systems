import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeSandboxLogoIcon } from "@radix-ui/react-icons";
import { BadgePercent, MessageSquareHeart } from "lucide-react";
import { useGetVehicleGarageStatsQuery } from "../garageApiSlice";
import ApiError from "@/components/error/ApiError";
import { Skeleton } from "@/components/ui/skeleton";

function GarageStatsCards() {
  const { data, isLoading, isError, isSuccess, error, refetch } =
    useGetVehicleGarageStatsQuery();

  let content;
  if (isLoading) {
    content = (
      <div className="grid gap-4 lg:grid-cols-2 md:gap-8 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 amimate-in fade-in-10">
              <Skeleton className="w-3/4 h-5" />

              <Skeleton className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Skeleton className="w-20 h-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  } else if (isSuccess) {
    content = (
      <div className="grid gap-4 duration-300 animate-in fade-in-10 slide-in-from-bottom-1 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {/* Card 1: Inventory */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Inventory Value
            </CardTitle>
            <BadgePercent className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.data?.vehicleCount || 0} Vehicles
            </div>
            <p className="text-xs text-muted-foreground">
              Currently available for sale
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Total Sales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <CodeSandboxLogoIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data?.data?.totalRevenue?.toLocaleString("en-IN") || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {data?.data?.soldCount || 0} sold vehicles
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Commission */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Commission Earned
            </CardTitle>
            <CodeSandboxLogoIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data?.data?.totalCommission?.toLocaleString("en-IN") || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total realized profit
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Active Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Active Opportunities
            </CardTitle>
            <MessageSquareHeart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{data?.data?.activeLeads || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Unfulfilled buyer interests
            </p>
          </CardContent>
        </Card>
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} refetch={refetch} />;
  }

  return content;
}

export default GarageStatsCards;
