import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import CarwashConfigSettings from "./CarwashConfigSettings";
import CarWashInspectionSetting from "./CarWashInspectionSetting";

function CarwashSettings() {
  return (
    <div className="grid gap-6">
      <CarwashConfigSettings />
      <Card>
        <CardHeader>
          <CardTitle>Parking Buffer</CardTitle>
          <CardDescription>
            Time buffer between service completion and the initiation of
            parking.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
      <CarWashInspectionSetting />
    </div>
  );
}

export default CarwashSettings;
