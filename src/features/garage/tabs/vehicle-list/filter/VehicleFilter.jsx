import { Button } from "@/components/ui/button";
import DynamicFilterWrapper from "@/features/garage/components/DynamicFilterWrapper";
import { Settings2 } from "lucide-react";
import VehicleFilterForm from "./VehicleFilterForm";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isEqual } from "lodash";

function VehicleFilter({ query, setQuery }) {
  const [selectedInterestMakes, setSelectedInterestMakes] = useState([]);
  const [selectedInterestCategories, setSelectedInterestCategories] = useState(
    []
  );
  const [selectedInterestFuelTypes, setSelectedInterestFuelTypes] = useState(
    []
  );
  const [selectedInterestTransmissions, setSelectedInterestTransmissions] =
    useState([]);
  const [selectedInterestDriveTypes, setSelectedInterestDriveTypes] = useState(
    []
  );
  const [selectedInterestModels, setSelectedInterestModels] = useState([]);

  const form = useForm();

  const initialQuery = { status: "Available", isVerified: true };

  const areFiltersActive = !isEqual(query, initialQuery);

  return (
    <DynamicFilterWrapper
      trigger={
        <div className="relative">
          <Button variant="outline" aria-label="Toggle filters">
            <span className="sr-only sm:not-sr-only">Filter</span>
            <Settings2 className="w-4 h-4 sm:ml-2" />
          </Button>
          {areFiltersActive && (
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </div>
      }
      content={
        <VehicleFilterForm
          form={form}
          setQuery={setQuery}
          selectedInterestMakes={selectedInterestMakes}
          setSelectedInterestMakes={setSelectedInterestMakes}
          selectedInterestCategories={selectedInterestCategories}
          setSelectedInterestCategories={setSelectedInterestCategories}
          selectedInterestFuelTypes={selectedInterestFuelTypes}
          setSelectedInterestFuelTypes={setSelectedInterestFuelTypes}
          selectedInterestTransmissions={selectedInterestTransmissions}
          setSelectedInterestTransmissions={setSelectedInterestTransmissions}
          selectedInterestDriveTypes={selectedInterestDriveTypes}
          setSelectedInterestDriveTypes={setSelectedInterestDriveTypes}
          selectedInterestModels={selectedInterestModels}
          setSelectedInterestModels={setSelectedInterestModels}
        />
      }
    />
  );
}

export default VehicleFilter;
