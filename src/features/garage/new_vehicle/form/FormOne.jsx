import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import SearchBox from "@/components/SearchBox";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useGetVehicleConfigQuery } from "../../garageApiSlice";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";
import { ChevronLeft, ChevronRight } from "lucide-react";

function FormOne({
  selectedMake,
  setSelectedMake,
  selectedCategory,
  setSelectedCategory,
  selectedTransmission,
  setSelectedTransmission,
  selectedFuelType,
  setSelectedFuelType,
  selectedDriveType,
  setSelectedDriveType,
  setFormStep,
  errors,
  setError,
  clearErrors,
}) {
  const { data, isLoading, isSuccess, isError, error, refetch } =
    useGetVehicleConfigQuery();
  const [makeSearchValue, setMakeSearchValue] = useState("");
  const [makeData, setMakeData] = useState([]);

  const [categorySearchValue, setCategorySearchValue] = useState("");
  const [categoryData, setCategoryData] = useState([]);

  const [transmissionData, setTransmissionData] = useState([]);

  const [fuelTypeData, setFuelTypeData] = useState([]);
  const [driveTypeData, setDriveTypeData] = useState([]);

  useEffect(() => {
    if (data) {
      const filtered = data?.data?.vehicleMakers?.filter((make) =>
        make.toLowerCase().includes(makeSearchValue.toLowerCase())
      );
      setMakeData(filtered);
    }
  }, [makeSearchValue, data]);

  useEffect(() => {
    if (data) {
      const filtered = data?.data?.vehicleCategories?.filter((make) =>
        make.toLowerCase().includes(categorySearchValue.toLowerCase())
      );
      setCategoryData(filtered);
    }
  }, [categorySearchValue, data]);

  useEffect(() => {
    setTransmissionData(data?.data?.transmissionTypes || []);
    setFuelTypeData(data?.data?.fuelTypes || []);
    setDriveTypeData(data?.data?.driveTypes || []);
  }, [data]);

  const formConfig = [
    {
      name: "make",
      label: "Company",
      selectedValue: selectedMake,
      setSelectedValue: (value) => {
        clearErrors("make");
        setSelectedMake(value);
      },
      data: makeData,
      searchValue: makeSearchValue,
      setSearchValue: setMakeSearchValue,
      showSearch: true,
      largeSpan: 2,
      smallSpan: 2,
    },
    {
      name: "category",
      label: "Category",
      selectedValue: selectedCategory,
      setSelectedValue: (value) => {
        clearErrors("category");
        setSelectedCategory(value);
      },
      data: categoryData,
      showSearch: true,
      searchValue: categorySearchValue,
      setSearchValue: setCategorySearchValue,
      largeSpan: 2,
      smallSpan: 2,
    },
    {
      name: "transmission",
      label: "Transmission",
      selectedValue: selectedTransmission,
      setSelectedValue: (value) => {
        clearErrors("transmission");
        setSelectedTransmission(value);
      },
      data: transmissionData,
      showSearch: false,
      largeSpan: 1,
      smallSpan: 2,
    },
    {
      name: "fuelType",
      label: "Fuel Type",
      selectedValue: selectedFuelType,
      setSelectedValue: (value) => {
        clearErrors("fuelType");
        setSelectedFuelType(value);
      },
      data: fuelTypeData,
      showSearch: false,
      largeSpan: 1,
      smallSpan: 2,
    },
    {
      name: "driveType",
      label: "Drive Type",
      selectedValue: selectedDriveType,
      setSelectedValue: (value) => {
        clearErrors("driveType");
        setSelectedDriveType(value);
      },
      data: driveTypeData,
      showSearch: false,
      largeSpan: 1,
      smallSpan: 2,
    },
  ];

  const handleReset = () => {
    setSelectedMake("");
    setSelectedCategory("");
    setSelectedTransmission("");
    setSelectedFuelType("");
    setSelectedDriveType("");
    clearErrors(["make", "category", "transmission", "fuelType", "driveType"]);
  };
  const handleNext = () => {
    const fieldsToValidate = [
      { name: "make", value: selectedMake },
      { name: "category", value: selectedCategory },
      { name: "transmission", value: selectedTransmission },
      { name: "fuelType", value: selectedFuelType },
      { name: "driveType", value: selectedDriveType },
    ];

    let hasError = false;

    fieldsToValidate.forEach((field) => {
      if (!field.value) {
        setError(field.name, { message: "Required" });
        hasError = true;
      }
    });

    if (!hasError) {
      const fieldNames = fieldsToValidate.map((field) => field.name);
      clearErrors(fieldNames);
      // setFormStep(2);
    }
  };

  let content;
  if (isLoading) {
    content = (
      <div className="flex items-center justify-center flex-1 h-full ">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    content = (
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          {formConfig.map((config, index) => (
            <Card
              key={index}
              className={`grid rounded-xl shadow-md ${
                errors?.[config.name] ? "border-red-500 shadow-red-500/20" : ""
              } col-span-${config.smallSpan} sm:col-span-${
                config.largeSpan
              } gap-4  `}
            >
              <CardHeader className="border-b">
                <div className="flex flex-col items-start justify-start gap-6 sm:flex-row sm:justify-between sm:items-center">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base sm:text-md">
                      {config.label}
                    </CardTitle>
                    <CardDescription>
                      {errors?.[config.name] && (
                        <span className="text-destructive">
                          {errors?.[config.name].message}
                        </span>
                      )}
                    </CardDescription>
                    {config.selectedValue && (
                      <div className="flex items-center ">
                        <Badge variant={""} className="ml-2">
                          {config.selectedValue}
                        </Badge>
                        <Cross2Icon
                          className="ml-2 cursor-pointer hover:"
                          onClick={() => {
                            config.setSelectedValue("");
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {config.showSearch && (
                    <SearchBox
                      value={config?.searchValue || ""}
                      setValue={config?.setSearchValue || ""}
                      placeholder="Search..."
                      className={"w-full sm:w-[240px]"}
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div id="make" className="flex flex-wrap gap-2">
                  {config.data?.map((value) => (
                    <div
                      className={cn(
                        "px-2 py-1 text-xs transition-all border rounded-full cursor-pointer hover:bg-primary hover:text-primary-foreground",
                        config.selectedValue === value &&
                          "bg-secondary font-bold border-primary",
                        config.selectedValue && config.selectedValue !== value
                          ? "text-muted-foreground"
                          : ""
                      )}
                      key={value}
                      value={value}
                      onClick={() => {
                        config.selectedValue === value
                          ? config.setSelectedValue("")
                          : config.setSelectedValue(value);
                      }}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="grid grid-cols-2 gap-4"></div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setFormStep(0)}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button variant="outline" type="button" onClick={handleReset}>
              Reset
            </Button>
          </div>
          <Button type="button" onClick={handleNext}>
            Next <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  } else if (isError) {
    content = <ApiError error={error} refetch={refetch} />;
  }

  return content;
}

export default FormOne;
