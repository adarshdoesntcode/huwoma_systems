const BUDGET_DIFFERENCE = 100000;
const numberFormatter = new Intl.NumberFormat("en-IN");

export const useBuyerInterestFormConfig = (
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
) => {
  return [
    {
      section: "budget",
      type: "input",
      name: "min",
      label: "Minimum Budget",
      errors: errors?.min,
      formItemProps: {
        ...register("min", {
          pattern: {
            value: /^[0-9]*$/,
            message: "Budget must be a number",
          },
          validate: (minValue) => {
            const minNum = Number(minValue);
            const maxValue = getValues("max");
            const maxNum = Number(maxValue);

            if (!minValue || minValue === "") return true;

            if (minNum < 0) return "Budget cannot be negative";

            if (maxValue && maxValue !== "" && minNum >= maxNum) {
              return "Min must be less than Max";
            }

            return true;
          },
          onChange: () => {
            clearErrors("min");
          },
          onBlur: async () => {
            await trigger("min");

            const maxValue = getValues("max");
            if (maxValue && maxValue !== "") {
              await trigger("max");
            }
          },
        }),
        onWheel: (e) => e.target.blur(),
        type: "tel",
        inputMode: "numeric",
        placeholder: "0",
        autoComplete: "off",
      },
      required: false,
    },
    {
      section: "budget",
      type: "input",
      name: "max",
      label: "Maximum Budget",
      errors: errors?.max,
      formItemProps: {
        ...register("max", {
          required: "Max Budget is required",
          pattern: {
            value: /^[0-9]*$/,
            message: "Budget must be a number",
          },
          validate: (maxValue) => {
            if (!maxValue || maxValue === "") return true;
            const maxNum = Number(maxValue);
            const minValue = getValues("min");
            const minNum = Number(minValue);

            if (maxNum < 0) return "Budget cannot be negative";

            if (minValue && minValue !== "") {
              if (maxNum < minNum + BUDGET_DIFFERENCE) {
                const requiredMax = numberFormatter.format(
                  minNum + BUDGET_DIFFERENCE
                );
                return `Must be at least Rs. ${requiredMax}`;
              }
            }

            return true;
          },
          onChange: () => {
            clearErrors("max");
          },
          onBlur: async () => {
            await trigger("min");
            await trigger("max");
          },
        }),
        onWheel: (e) => e.target.blur(),
        type: "tel",
        inputMode: "numeric",
        placeholder: "0",
        autoComplete: "off",
      },
      required: true,
    },

    {
      section: "preference",
      type: "searchMultiSelect",
      name: "interestCategories",
      label: "Categories",
      placeholder: "Select categories...",
      selectedValues: selectedInterestCategories,
      setSelectedValues: (value) => {
        setSelectedInterestCategories(value);
        clearErrors("interestCategories");
      },
      data: categoryData.map((item) => ({
        label: item,
        value: item,
      })),
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.interestCategory,
      formItemClassName: `justify-start font-normal ${
        selectedInterestCategories?.length > 0 ? "" : "text-muted-foreground"
      }`,
      required: false,
    },
    {
      section: "preference",
      type: "searchMultiSelect",
      name: "interestMakes",
      label: "Manufacturers",
      placeholder: "Select manufacturers...",
      selectedValues: selectedInterestMakes,
      setSelectedValues: (value) => {
        setSelectedInterestMakes(value);
        clearErrors("interestMakes");
      },
      data: makeData.map((item) => ({
        label: item,
        value: item,
      })),
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.interestMakes,
      formItemClassName: `justify-start font-normal ${
        selectedInterestMakes?.length > 0 ? "" : "text-muted-foreground"
      }`,
      required: false,
    },

    {
      section: "preference",
      type: "multiInput",
      name: "interestModels",
      label: "Models",
      placeholder: "eg., creta, fortuner, hilux, etc",
      selectedValues: selectedInterestModels,
      setSelectedValues: (value) => {
        setSelectedInterestModels(value);
        clearErrors("interestModels");
      },
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.interestModels,
      formItemClassName: `justify-start font-normal ${
        selectedInterestModels?.length > 0 ? "" : "text-muted-foreground"
      }`,
      required: false,
    },
    {
      section: "yearRange",
      type: "input",
      name: "from",
      label: "Minimum Year",
      errors: errors?.from,
      formItemProps: {
        ...register("from", {
          setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
          validate: (fromValue) => {
            if (!fromValue) return true;

            if (String(fromValue).length !== 4) return "Must be a 4-digit year";

            if (fromValue < 1888) return "Year must be 1888 or later";

            const toValue = getValues("to");
            if (toValue && fromValue > toValue) {
              return "Min year cannot be after Max year";
            }

            return true;
          },
          onChange: () => {
            clearErrors("from");
          },
          onBlur: async () => {
            await trigger("to");
          },
        }),
        onWheel: (e) => e.target.blur(),
        type: "tel",
        inputMode: "numeric",
        placeholder: "e.g., 2018",
      },
      required: false,
    },
    {
      section: "yearRange",
      type: "input",
      name: "to",
      label: "Maximum Year",
      errors: errors?.to,
      formItemProps: {
        ...register("to", {
          setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
          validate: (toValue) => {
            if (!toValue) return true;

            const currentYear = new Date().getFullYear();
            const maxAllowedYear = currentYear + 2;

            if (String(toValue).length !== 4) return "Must be a 4-digit year";

            if (toValue > maxAllowedYear) {
              return `Year cannot be after ${maxAllowedYear}`;
            }

            const fromValue = getValues("from");
            if (fromValue && toValue < fromValue) {
              return "Max year cannot be before Min year";
            }

            return true;
          },
          onChange: () => {
            clearErrors("to");
          },
          onBlur: async () => {
            await trigger("from");
          },
        }),
        onWheel: (e) => e.target.blur(),
        type: "tel",
        inputMode: "numeric",
        placeholder: `e.g., ${new Date().getFullYear()}`,
      },
      required: false,
    },
    {
      section: "mileage",
      type: "input",
      name: "mileageMax",
      label: "Maximum Driven",
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.mileageMax,
      formItemProps: {
        ...register("mileageMax", {
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
            clearErrors("mileageMax");
          },
        }),
        onWheel: (e) => e.target.blur(),
        type: "tel",
        inputMode: "numeric",
        autoComplete: "off",
        placeholder: "in kms",
      },
      required: false,
    },
    {
      section: "powertrain",
      type: "searchMultiSelect",
      name: "interestTransmissions",
      label: "Transmissions",
      placeholder: "Select transmissions...",
      selectedValues: selectedInterestTransmissions,
      setSelectedValues: (value) => {
        setSelectedInterestTransmissions(value);
        clearErrors("interestTransmissions");
      },
      data: transmissionData.map((item) => ({
        label: item,
        value: item,
      })),
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.interestTransmissions,
      formItemClassName: `justify-start font-normal ${
        selectedInterestTransmissions?.length > 0 ? "" : "text-muted-foreground"
      }`,
      required: false,
    },
    {
      section: "powertrain",
      type: "searchMultiSelect",
      name: "interestFuelTypes",
      label: "Fuel Types",
      placeholder: "Select fuel types...",
      selectedValues: selectedInterestFuelTypes,
      setSelectedValues: (value) => {
        setSelectedInterestFuelTypes(value);
        clearErrors("interestFuelTypes");
      },
      data: fuelTypeData.map((item) => ({
        label: item,
        value: item,
      })),
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.interestFuelTypes,
      formItemClassName: `justify-start font-normal ${
        selectedInterestFuelTypes?.length > 0 ? "" : "text-muted-foreground"
      }`,
      required: false,
    },
    {
      section: "powertrain",
      type: "searchMultiSelect",
      name: "interestDriveTypes",
      label: "Drive Types",
      placeholder: "Select drive types...",
      selectedValues: selectedInterestDriveTypes,
      setSelectedValues: (value) => {
        setSelectedInterestDriveTypes(value);
        clearErrors("interestDriveTypes");
      },
      data: driveTypeData.map((item) => ({
        label: item,
        value: item,
      })),
      largeSpan: 1,
      smallSpan: 3,
      errors: errors?.interestDriveTypes,
      formItemClassName: `justify-start font-normal ${
        selectedInterestDriveTypes?.length > 0 ? "" : "text-muted-foreground"
      }`,
      required: false,
    },
  ];
};
