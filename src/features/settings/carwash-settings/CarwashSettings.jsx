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
import CarwashParkingBuffer from "./CarwashParkingBuffer";
import CarwashCount from "./CarwashCount";

function CarwashSettings() {
  return (
    <div className="grid gap-6">
      <CarwashConfigSettings />
      {/* <CarwashCount /> */}
      {/* <CarwashParkingBuffer /> */}
      <CarWashInspectionSetting />
    </div>
  );
}

export default CarwashSettings;
