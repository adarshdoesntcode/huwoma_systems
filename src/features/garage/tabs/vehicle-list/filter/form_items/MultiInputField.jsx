import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function MultiInputField({
  name,
  label,
  placeholder = "Enter model names separated by commas...",
  selectedValues = [],
  setSelectedValues,
  largeSpan = 6,
  smallSpan = 12,
  errors,
  formItemClassName,
  labelClassName,
  containerClassName = "duration-300 fade-in animate-in",
  required,
  showClearAll = false,
}) {
  const [inputValue, setInputValue] = useState("");

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    if (!value) {
      setInputValue("");
      setSelectedValues([]);
      return;
    }

    setInputValue(value);

    const allParts = value
      .split(",")
      .map((part) => {
        const words = part.trim().split(" ");
        return words.map((word) => capitalizeFirstLetter(word)).join(" ");
      })
      .filter((part) => part !== "");

    const newModels = allParts.map((model) =>
      capitalizeFirstLetter(model.trim())
    );

    if (newModels.length > 0) {
      setSelectedValues([...newModels]);
    }
  };

  const handleClearAll = () => {
    setInputValue("");
    setSelectedValues([]);
  };

  const renderModelBadges = () => {
    return selectedValues.map((model, index) => (
      <Badge
        key={`${model}-${index}`}
        variant="secondary"
        className="pr-1.5 mb-1 mr-1"
      >
        {model}
        <button
          type="button"
          className="ml-2 rounded-full outline-none hover:scale-110 ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        ></button>
      </Badge>
    ));
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2 w-full items-start",
        `col-span-${smallSpan}`,
        `sm:col-span-${largeSpan}`,
        containerClassName
      )}
    >
      <Label className={`${labelClassName} text-xs`}>
        {errors ? (
          <span className="text-destructive">{errors?.message}</span>
        ) : (
          <span className="relative">
            {required && (
              <span className="absolute text-xs -right-2.5 -top-1 text-destructive">
                *
              </span>
            )}
            {label}
          </span>
        )}
      </Label>

      <Input
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={cn(
          "w-full",
          errors ? "border-destructive" : "",
          formItemClassName
        )}
      />

      {showClearAll && selectedValues.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Clear all
        </Button>
      )}

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">{renderModelBadges()}</div>
      )}
    </div>
  );
}
