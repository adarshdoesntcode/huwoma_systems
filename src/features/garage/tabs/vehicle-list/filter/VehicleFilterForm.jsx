import { Button } from "@/components/ui/button";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { useGetVehicleConfigQuery } from "@/features/garage/garageApiSlice";
import { cleanObject } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { isMobile } from "react-device-detect";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { useVehicleFilterFormConfig } from "./useVehicleFilterFormConfig";
import FormItems from "./form_items";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const buildVehicleListingQuery = (payload) => {
  const query = { status: payload.status || "Available" };

  const { budget, criteria } = payload;

  if (budget && (budget.min || budget.max)) {
    query.askingPrice = {};
    if (budget.min) {
      query.askingPrice.$gte = Number(budget.min);
    }
    if (budget.max) {
      query.askingPrice.$lte = Number(budget.max);
    }
  }

  if (!criteria) {
    return query;
  }

  if (criteria.year && (criteria.year.min || criteria.year.max)) {
    query.year = {};
    if (criteria.year.min) {
      query.year.$gte = Number(criteria.year.min);
    }
    if (criteria.year.max) {
      query.year.$lte = Number(criteria.year.max);
    }
  }

  if (criteria.mileageMax) {
    query.mileage = { $lte: Number(criteria.mileageMax) };
  }

  const arrayFieldMap = {
    categories: "category",
    makes: "make",
    models: "model",
    transmissions: "transmission",
    driveTypes: "driveType",
    fuelTypes: "fuelType",
  };

  for (const [payloadKey, schemaKey] of Object.entries(arrayFieldMap)) {
    const valueArray = criteria[payloadKey];

    if (valueArray && valueArray.length > 0) {
      const extractedValues = valueArray.map((item) =>
        typeof item === "object" && item.value != null ? item.value : item
      );

      query[schemaKey] = { $in: extractedValues };
    }
  }

  return query;
};

function VehicleFilterForm({
  form,
  setQuery,
  selectedInterestMakes,
  setSelectedInterestMakes,
  selectedInterestCategories,
  setSelectedInterestCategories,
  selectedInterestFuelTypes,
  setSelectedInterestFuelTypes,
  selectedInterestTransmissions,
  setSelectedInterestTransmissions,
  selectedInterestDriveTypes,
  setSelectedInterestDriveTypes,
  selectedInterestModels,
  setSelectedInterestModels,
}) {
  const { data, isLoading, isSuccess, isError, error, refetch } =
    useGetVehicleConfigQuery();
  const [makeData, setMakeData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [transmissionData, setTransmissionData] = useState([]);
  const [fuelTypeData, setFuelTypeData] = useState([]);
  const [driveTypeData, setDriveTypeData] = useState([]);

  useEffect(() => {
    if (data) {
      setMakeData(data?.data?.vehicleMakers || []);
      setCategoryData(data?.data?.vehicleCategories || []);
      setTransmissionData(data?.data?.transmissionTypes || []);
      setFuelTypeData(data?.data?.fuelTypes || []);
      setDriveTypeData(data?.data?.driveTypes || []);
    }
  }, [data]);
  const {
    handleSubmit,
    reset,
    trigger,
    clearErrors,
    register,
    getValues,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data) => {
    const payload = cleanObject({
      status: data.status || "Available",
      budget: {
        min: data.min,
        max: data.max,
      },
      criteria: {
        categories: selectedInterestCategories,
        makes: selectedInterestMakes,
        transmissions: selectedInterestTransmissions,
        driveTypes: selectedInterestDriveTypes,
        fuelTypes: selectedInterestFuelTypes,
        models: selectedInterestModels,
        mileageMax: data.mileageMax,
        year: {
          min: data.from,
          max: data.to,
        },
      },
    });

    const query = buildVehicleListingQuery(payload);
    setQuery(query);
  };

  const formConfig = useVehicleFilterFormConfig(
    register,
    errors,
    clearErrors,
    getValues,
    trigger,
    makeData,
    categoryData,
    transmissionData,
    fuelTypeData,
    driveTypeData,
    selectedInterestMakes,
    setSelectedInterestMakes,
    selectedInterestCategories,
    setSelectedInterestCategories,
    selectedInterestTransmissions,
    setSelectedInterestTransmissions,
    selectedInterestFuelTypes,
    setSelectedInterestFuelTypes,
    selectedInterestDriveTypes,
    setSelectedInterestDriveTypes,
    selectedInterestModels,
    setSelectedInterestModels
  );

  const budgetConfig = formConfig.filter(
    (config) => config.section === "budget"
  );
  const preferenceConfig = formConfig.filter(
    (config) => config.section === "preference"
  );
  const yearRangeConfig = formConfig.filter(
    (config) => config.section === "yearRange"
  );
  const mileageConfig = formConfig.filter(
    (config) => config.section === "mileage"
  );
  const powertrainConfig = formConfig.filter(
    (config) => config.section === "powertrain"
  );

  const handleReset = () => {
    setSelectedInterestMakes([]);
    setSelectedInterestCategories([]);
    setSelectedInterestTransmissions([]);
    setSelectedInterestFuelTypes([]);
    setSelectedInterestDriveTypes([]);
    setSelectedInterestModels([]);
    reset({
      status: "Available",
      min: "",
      max: "",
      mileageMax: "",
      from: "",
      to: "",
    });
    clearErrors([
      "min",
      "max",
      "mileageMax",
      "from",
      "to",
      "interestMakes",
      "interestCategories",
      "interestTransmissions",
      "interestFuelTypes",
      "interestDriveTypes",
      "interestModels",
    ]);
    setQuery({
      status: "Available",
      isVerified: true,
    });
  };

  return (
    <>
      <form
        id="vehicle-filter-form"
        onSubmit={handleSubmit(onSubmit)}
        className="max-h-[55dvh] sm:max-h-[80dvh] overflow-y-scroll px-2"
      >
        {/* Status Filter */}
        <div className="mt-4 mb-2">
          <Label htmlFor="status" className="mb-2 block">Status</Label>
          <Select
            value={form.watch("status") || "Available"}
            onValueChange={(value) => form.setValue("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Accordion type="multiple">
          <AccordionItem value="budget">
            <AccordionTrigger>
              <Label>Budget</Label>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 px-2">
                {budgetConfig.map((config, index) => (
                  <FormItems key={index} type={config.type} props={config} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="preference">
            <AccordionTrigger>
              <Label>Preference</Label>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-4 px-2">
                {preferenceConfig.map((config, index) => (
                  <FormItems key={index} type={config.type} props={config} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="yearRange">
            <AccordionTrigger>
              <Label>Year Range</Label>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 px-2">
                {yearRangeConfig.map((config, index) => (
                  <FormItems key={index} type={config.type} props={config} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="mileage">
            <AccordionTrigger>
              <Label>Mileage</Label>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-4 px-2">
                {mileageConfig.map((config, index) => (
                  <FormItems key={index} type={config.type} props={config} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="powertrain">
            <AccordionTrigger>
              <Label>Powertrain</Label>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-4 px-2">
                {powertrainConfig.map((config, index) => (
                  <FormItems key={index} type={config.type} props={config} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
      {isMobile ? (
        <DrawerFooter>
          <DrawerClose asChild>
            <Button type="submit" form="vehicle-filter-form">
              Filter
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button onClick={handleReset} variant="outline" className="w-full">
              Reset
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      ) : (
        <SheetFooter className={"flex items-center justify-evenly w-full mt-4"}>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button onClick={handleReset} variant="outline" className="w-full">
              Reset
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button className="w-full" type="submit" form="vehicle-filter-form">
              Filter <Filter className="w-3 h-3 ml-2" />
            </Button>
          </SheetClose>
        </SheetFooter>
      )}
    </>
  );
}

export default VehicleFilterForm;
