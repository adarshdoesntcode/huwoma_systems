import { capitalizeFirstLetter } from "@/lib/utils";

export const useFormConfig = (
  register,
  selectedMake,
  setSelectedMake,
  errors,
  makeData,
  clearErrors,
  selectedCategory,
  setSelectedCategory,
  categoryData,
  selectedTransmission,
  setSelectedTransmission,
  transmissionData,
  selectedFuelType,
  setSelectedFuelType,
  fuelTypeData,
  selectedDriveType,
  setSelectedDriveType,
  driveTypeData,
  selectedListingType,
  setSelectedListingType,
  listingTypeData
) => [
    {
      section: "listing-info",
      type: "searchSelect",
      name: "listingType",
      label: "Listing Type",
      selectedValue: capitalizeFirstLetter(selectedListingType),
      setSelectedValue: (value) => {
        clearErrors("listingType");
        setSelectedListingType(value);
      },
      data: listingTypeData.map((item) => ({
        label: capitalizeFirstLetter(item),
        value: item,
      })),
      placeholder: "Select a listing type",
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.listingType,
      formItemClassName: `justify-start font-normal ${selectedListingType ? "" : "text-muted-foreground"
        }`,
      required: true,
    },
    {
      section: "vehicle-info",
      type: "searchSelect",
      name: "make",
      label: "Manufacturer",
      placeholder: "Select a manufacturer",
      selectedValue: selectedMake,
      setSelectedValue: (value) => {
        clearErrors("make");
        setSelectedMake(value);
      },
      data: makeData.map((make) => ({ label: make, value: make })),
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.make,
      formItemClassName: `justify-start font-normal ${selectedMake ? "" : "text-muted-foreground"
        }`,
      required: true,
    },

    {
      section: "vehicle-info",
      type: "input",
      name: "model",
      label: "Model",
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.model,
      formItemProps: {
        ...register("model", {
          required: "Model is required",
          onChange: (e) => {
            autoCapitalize(e);
            clearErrors("model");
          },
        }),
        autoComplete: "off",
        placeholder: "eg., creta, swift, xuv700 etc",
      },
      required: true,
    },
    {
      section: "vehicle-info",
      type: "input",
      name: "variant",
      label: "Variant",
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.variant,
      formItemProps: {
        ...register("variant", {
          onChange: (e) => {
            autoCapitalize(e);
          },
        }),
        autoComplete: "off",
        placeholder: "eg., zxi, sx etc",
        type: "text",
      },
      required: false,
    },
    {
      section: "vehicle-info",
      type: "input",
      name: "year",
      label: "Manufactured Year",
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.year,
      formItemProps: {
        ...register("year", {
          required: "Year is required",
          pattern: {
            value: /^\d{4}$/,
            message: "Invalid year",
          },
          validate: (value) => {
            const currentYear = new Date().getFullYear() + 2;
            if (value > currentYear) {
              return "Year cannot be in the future";
            }
            if (value < 1888) {
              return "Year cannot be less than 1888";
            }
          },
          onChange: () => {
            clearErrors("year");
          },
        }),
        onWheel: (e) => e.target.blur(),
        type: "tel",
        inputMode: "numeric",
        autoComplete: "off",
        placeholder: "eg., 2022",
      },
      required: true,
    },
    {
      section: "specification",
      type: "input",
      name: "numberPlate",
      label: "Number Plate",
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.numberPlate,
      formItemProps: {
        ...register("numberPlate", {
          required: "Vehicle Number is required",
          pattern: {
            value: /^[A-Z0-9 ]+$/,
            message: "Only uppercase letters, digits, and spaces",
          },
          onChange: (e) => {
            e.target.value = e.target.value.toUpperCase();
            clearErrors("numberPlate");
          },
        }),
        autoComplete: "off",
        placeholder: "eg., BA 01 CHA 1234",
        type: "text",
      },
      required: false,
    },
    {
      section: "specification",
      type: "input",
      name: "mileage",
      label: "Kilometers",
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.mileage,
      formItemProps: {
        ...register("mileage", {
          required: "Mileage is required",
          pattern: {
            value: /^[0-9]+$/,
            message: "Invalid mileage",
          },
          validate: (value) => {
            if (value < 0) {
              return "Mileage cannot be negative";
            }
          },
          onChange: () => {
            clearErrors("mileage");
          },
        }),
        onWheel: (e) => e.target.blur(),
        type: "tel",
        inputMode: "numeric",
        autoComplete: "off",
        placeholder: "in kms",
      },
      required: true,
    },
    {
      section: "specification",
      type: "input",
      name: "engineCC",
      label: "Power (cc/kW)",
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.engineCC,
      formItemProps: {
        ...register("engineCC", {
          required: "Power figure is required",
          pattern: {
            value: /^[0-9]+$/,
            message: "Invalid cc",
          },
          validate: (value) => {
            if (value < 0) {
              return "Power figure cannot be negative";
            }
          },
          onChange: () => {
            clearErrors("engineCC");
          },
        }),
        onWheel: (e) => e.target.blur(),
        type: "tel",
        inputMode: "numeric",
        autoComplete: "off",
        placeholder: "eg., 1498 / 100",
      },
      required: true,
    },
    {
      section: "specification",
      type: "input",
      name: "colour",
      label: "Colour",
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.colour,
      formItemProps: {
        ...register("colour", {
          pattern: {
            value: /^[a-zA-Z\s]+$/,
            message: "Invalid colour",
          },
          onChange: (e) => {
            autoCapitalize(e);
            clearErrors("colour");
          },
        }),
        autoComplete: "off",
        placeholder: "eg., perl white",
        type: "text",
      },
      required: false,
    },
    {
      section: "classification",
      type: "searchSelect",
      name: "category",
      label: "Category",
      placeholder: "Select a category",
      selectedValue: selectedCategory,
      setSelectedValue: (value) => {
        clearErrors("category");
        setSelectedCategory(value);
      },
      data: categoryData.map((item) => ({
        label: item,
        value: item,
      })),
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.category,
      formItemClassName: `justify-start font-normal ${selectedCategory ? "" : "text-muted-foreground"
        }`,
      required: true,
    },

    {
      section: "classification",
      type: "searchSelect",
      name: "transmission",
      label: "Transmission",
      placeholder: "Select a transmission",
      selectedValue: selectedTransmission,
      setSelectedValue: (value) => {
        clearErrors("transmission");
        setSelectedTransmission(value);
      },
      data: transmissionData.map((item) => ({
        label: item,
        value: item,
      })),
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.transmission,
      formItemClassName: `justify-start font-normal ${selectedTransmission ? "" : "text-muted-foreground"
        }`,
      required: true,
    },
    {
      section: "classification",
      type: "searchSelect",
      name: "driveType",
      label: "Drive Type",
      selectedValue: selectedDriveType,
      setSelectedValue: (value) => {
        clearErrors("driveType");
        setSelectedDriveType(value);
      },
      data: driveTypeData.map((item) => ({
        label: item,
        value: item,
      })),
      placeholder: "Select a drive type",
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.category,
      formItemClassName: `justify-start font-normal ${selectedDriveType ? "" : "text-muted-foreground"
        }`,
      required: true,
    },
    {
      section: "classification",
      type: "searchSelect",
      name: "fuelType",
      label: "Fuel Type",
      selectedValue: selectedFuelType,
      setSelectedValue: (value) => {
        clearErrors("fuelType");
        setSelectedFuelType(value);
      },
      data: fuelTypeData.map((item) => ({
        label: item,
        value: item,
      })),
      placeholder: "Select a fuel type",
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.fuelType,
      formItemClassName: `justify-start font-normal ${selectedFuelType ? "" : "text-muted-foreground"
        }`,
      required: true,
    },

    {
      section: "pricing",
      type: "input",
      name: "askingPrice",
      label: "Expected Price",
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.askingPrice,
      formItemProps: {
        ...register("askingPrice", {
          required: "Expected price is required",
          pattern: {
            value: /^[0-9]+$/,
            message: "Invalid price",
          },
          validate: (value) => {
            if (value < 0) {
              return "Price cannot be negative";
            }
          },
          onChange: () => {
            clearErrors("askingPrice");
          },
        }),
        onWheel: (e) => e.target.blur(),
        type: "tel",
        inputMode: "numeric",
        autoComplete: "off",
        placeholder: "0",
      },
      required: true,
    },
    {
      section: "description",
      type: "inputArea",
      name: "description",
      label: "Description",
      largeSpan: 3,
      smallSpan: 3,
      errors: errors?.description,
      formItemProps: {
        ...register("description", {
          validate: (value) => {
            if (value.length > 2000) {
              return "Description must be less than 2000 characters";
            }
          },
        }),
        autoComplete: "off",
        placeholder: "2000 characters",
        type: "text",
      },
      required: false,
    },
  ];

const autoCapitalize = (e) => {
  if (!e.target.value) return;
  const words = e.target.value.split(" ");
  const newWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  const newValue = newWords.join(" ");
  if (e.target.value !== newValue) {
    e.target.value = newValue;
  }
};
