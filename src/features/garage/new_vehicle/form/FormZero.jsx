import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useSearchCustomerMutation } from "../../garageApiSlice";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
const SellerSuggestions = ({
  sellers,
  onSelect,
  isLoading,
  highlightedIndex,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (sellers.length === 0) {
    return null;
  }
  return (
    <div role="listbox" className="grid gap-1">
      {sellers.map((seller, index) => (
        <div
          key={seller._id}
          onMouseDown={() => onSelect(seller)}
          role="option"
          aria-selected={index === highlightedIndex}
          className={cn(
            "p-2 text-sm rounded-md cursor-pointer",
            index === highlightedIndex && "bg-accent"
          )}
        >
          <p className="font-medium">{seller.name}</p>
          <p className="text-xs text-muted-foreground">
            {seller.contactNumber}
          </p>
        </div>
      ))}
    </div>
  );
};
function FormZero({
  register,
  watch,
  errors,
  trigger,
  setValue,
  setSelectedSeller,
  selectedSeller,
  clearErrors,
  setFormStep,
  reset,
  setError,
  setFocus,
}) {
  const [oldSellers, setOldSellers] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [focusedInput, setFocusedInput] = useState("");
  const [searchCustomer, { isLoading: isSearching }] =
    useSearchCustomerMutation();

  const name = watch("name");
  const debounceName = useDebounce(name, 500);
  const contactNumber = watch("contactNumber");
  const debounceNumber = useDebounce(contactNumber, 500);

  useEffect(() => {
    let term;
    if (
      focusedInput === "name" &&
      debounceName &&
      /^[a-zA-Z\s]*$/.test(debounceName)
    ) {
      term = debounceName;
    } else if (
      focusedInput === "contactNumber" &&
      debounceNumber &&
      /^[0-9]/.test(debounceNumber)
    ) {
      term = debounceNumber;
    }

    const fetchCustomer = async () => {
      if (!term || term.trim() === "") {
        setOldSellers([]);
        return;
      }
      try {
        const response = await searchCustomer({ searchTerm: term }).unwrap();
        setOldSellers(response.data || []);
      } catch (error) {
        console.error("Error fetching customer:", error);
        setOldSellers([]);
      }
    };

    fetchCustomer();
  }, [debounceName, debounceNumber, focusedInput, searchCustomer]);

  const handleSellerSelect = (seller) => {
    if (!seller.name || !seller.contactNumber || !seller._id) return;
    setSelectedSeller(seller);
    setOldSellers([]);
  };

  const handleKeyDown = (e) => {
    if (oldSellers.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prevIndex) =>
            prevIndex === oldSellers.length - 1 ? 0 : prevIndex + 1
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prevIndex) =>
            prevIndex <= 0 ? oldSellers.length - 1 : prevIndex - 1
          );
          break;
        case "Enter":
          if (highlightedIndex !== -1) {
            e.preventDefault();
            handleSellerSelect(oldSellers[highlightedIndex]);
          }
          break;
        default:
          break;
      }
    }
  };
  const isNamePopoverOpen = focusedInput === "name" && oldSellers.length > 0;

  const isNumberPopoverOpen =
    focusedInput === "contactNumber" && oldSellers.length > 0;

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setFocusedInput("");
    }
  };

  const handleEdit = () => {
    setValue("name", selectedSeller.name);
    setValue("contactNumber", selectedSeller.contactNumber);
    setSelectedSeller("");
  };

  const handleNext = async () => {
    const isValid = await trigger(["name", "contactNumber"]);

    if (!isValid) {
      const firstErrorField = Object.keys(errors).reduce((field, key) => {
        return errors[key] ? key : field;
      }, "");

      if (firstErrorField) {
        setFocus(firstErrorField);
      }
    }

    if (isValid && !selectedSeller) {
      setSelectedSeller({
        name,
        contactNumber,
      });
      setFormStep(1);
    } else if (selectedSeller) {
      setFormStep(1);
    }
  };

  return (
    <div className="duration-500 slide-in-from-right-5 w-xl animate-in">
      <Card>
        <CardHeader className="pb-4">
          <div className="w-full mx-auto md:w-1/2 sm:w-3/4">
            <CardTitle className="text-xl sm:text-2xl">Seller Info</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Add a new seller or find an existing one.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full mx-auto space-y-4 md:w-1/2 sm:w-3/4">
            {selectedSeller ? (
              <div className="duration-300 fade-in animate-in">
                <Alert>
                  <AlertTitle className="flex flex-col gap-2 mb-0 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="hidden w-4 h-4 text-green-500 sm:block shrink-0" />
                        <span className="font-medium truncate">
                          {selectedSeller.name}
                        </span>
                        <CheckCircle className="block w-4 h-4 text-green-500 sm:hidden shrink-0" />
                      </div>
                      <span className="truncate file:text-sm text-muted-foreground">
                        {selectedSeller.contactNumber}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit()}
                      className="w-full shrink-0 sm:w-auto"
                    >
                      Change
                    </Button>
                  </AlertTitle>
                </Alert>
              </div>
            ) : (
              <div className="space-y-4 duration-300 fade-in animate-in">
                <div className="grid gap-2">
                  <Label className="mt-2" htmlFor="name">
                    {errors.name ? (
                      <span className="text-destructive">
                        {errors.name.message}
                      </span>
                    ) : (
                      <span>Seller Name</span>
                    )}
                  </Label>
                  <Popover
                    open={isNamePopoverOpen}
                    onOpenChange={handleOpenChange}
                  >
                    <PopoverAnchor>
                      <PopoverTrigger asChild>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Seller name"
                          autoFocus
                          defaultValue={selectedSeller?.name}
                          onFocus={() => setFocusedInput("name")}
                          onBlur={() => setFocusedInput("")}
                          onKeyDown={handleKeyDown}
                          autoComplete="off"
                          {...register("name", {
                            required: "Name is required",
                            pattern: {
                              value: /^[a-zA-Z\s]*$/,
                              message: "Invalid Name",
                            },
                            onChange: (e) => {
                              if (
                                e.target.value &&
                                !/^[a-zA-Z\s]*$/.test(e.target.value)
                              ) {
                                return setError("name", {
                                  message: "Invalid Name",
                                });
                              }
                              clearErrors("name");
                              const words = e.target.value.split(" ");
                              const newWords = words.map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              );
                              const newValue = newWords.join(" ");
                              if (e.target.value !== newValue) {
                                e.target.value = newValue;
                              }
                            },
                          })}
                          className={errors.name ? "border-destructive" : ""}
                        />
                      </PopoverTrigger>
                    </PopoverAnchor>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)]"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <SellerSuggestions
                        sellers={oldSellers}
                        onSelect={handleSellerSelect}
                        isLoading={isSearching}
                        highlightedIndex={highlightedIndex}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label className="mt-2" htmlFor="contactNumber">
                    {errors.contactNumber ? (
                      <span className="text-destructive">
                        {errors.contactNumber.message}
                      </span>
                    ) : (
                      <span>Contact Number</span>
                    )}
                  </Label>
                  <Popover
                    open={isNumberPopoverOpen}
                    onOpenChange={handleOpenChange}
                  >
                    <PopoverAnchor>
                      <PopoverTrigger asChild>
                        <Input
                          id="contactNumber"
                          onWheel={(e) => e.target.blur()}
                          onFocus={() => setFocusedInput("contactNumber")}
                          onBlur={() => setFocusedInput("")}
                          type="tel"
                          defaultValue={selectedSeller?.contactNumber}
                          inputMode="numeric"
                          placeholder="Contact number"
                          onKeyDown={handleKeyDown}
                          autoComplete="off"
                          {...register("contactNumber", {
                            required: "Number is required",
                            onChange: (e) => {
                              if (
                                e.target.value &&
                                !/^[0-9]/.test(e.target.value)
                              ) {
                                return setError("contactNumber", {
                                  message: "Invalid Number",
                                });
                              }
                              clearErrors("contactNumber");
                            },
                            validate: (value) =>
                              String(value).length === 10 ||
                              "Number must be 10 digits",
                          })}
                          className={
                            errors.contactNumber ? "border-destructive" : ""
                          }
                        />
                      </PopoverTrigger>
                    </PopoverAnchor>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)]"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <SellerSuggestions
                        sellers={oldSellers}
                        onSelect={handleSellerSelect}
                        isLoading={isSearching}
                        highlightedIndex={highlightedIndex}
                      />
                    </PopoverContent>
                  </Popover>
                </div>{" "}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full mx-auto md:w-1/2 sm:w-3/4">
            <div>
              {!selectedSeller && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() =>
                    reset({
                      name: "",
                      contactNumber: "",
                    })
                  }
                >
                  Reset
                </Button>
              )}
            </div>

            <Button type="button" onClick={handleNext}>
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default FormZero;
