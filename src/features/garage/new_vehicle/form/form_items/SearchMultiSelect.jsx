import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

const MultiSelectList = ({
  data = [],
  setOpen,
  selectedValues,
  setSelectedValues,
  placeholder,
}) => {
  const handleSelect = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  return (
    <Command>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {data.map((item) => (
            <CommandItem
              key={item.value}
              value={item.value}
              onSelect={() => handleSelect(item.value)}
            >
              <Check
                className={cn(
                  "h-4 w-4",
                  selectedValues.includes(item.value)
                    ? "opacity-100"
                    : "opacity-0"
                )}
              />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export function SearchMultiSelect({
  name,
  label,
  placeholder = "Select items...",
  selectedValues = [],
  setSelectedValues,
  data = [],
  largeSpan = 6,
  smallSpan = 12,
  errors,
  formItemClassName,
  labelClassName,
  containerClassName = "duration-300 fade-in animate-in",
  required,
  maxSelectedDisplay = 3,
  showClearAll = true,
}) {
  const [open, setOpen] = useState(false);

  const handleRemoveItem = (valueToRemove) => {
    setSelectedValues(
      selectedValues.filter((value) => value !== valueToRemove)
    );
  };

  const handleClearAll = () => {
    setSelectedValues([]);
  };

  const getSelectedLabels = () => {
    return selectedValues.map((value) => {
      const item = data.find((d) => d.value === value);
      return item ? item.label : value;
    });
  };

  const displayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }

    const labels = getSelectedLabels();
    if (labels.length <= maxSelectedDisplay) {
      return labels.join(", ");
    }

    return `${labels.slice(0, maxSelectedDisplay).join(", ")} +${
      labels.length - maxSelectedDisplay
    } more`;
  };

  const renderSelectedBadges = () => {
    const labels = getSelectedLabels();
    return labels.map((label, index) => (
      <Badge
        key={selectedValues[index]}
        variant="secondary"
        className="pr-1.5 mb-1 mr-1"
      >
        {label}
        <button
          type="button"
          className="ml-2 rounded-full outline-none hover:scale-110 ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRemoveItem(selectedValues[index]);
            }
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onClick={() => handleRemoveItem(selectedValues[index])}
        >
          <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
        </button>
      </Badge>
    ));
  };

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;

  let content;

  if (isDesktop) {
    content = (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              " w-full text-left font-normal",
              errors ? "border-destructive" : "",
              formItemClassName
            )}
          >
            <span className="truncate">{displayText()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <MultiSelectList
            data={data}
            placeholder={`Search ${label?.toLowerCase() || "items"}...`}
            setOpen={setOpen}
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
          />
          {showClearAll && selectedValues.length > 0 && (
            <div className="p-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="w-full"
              >
                Clear all
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  } else {
    content = (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              " w-full text-left font-normal",
              errors ? "border-destructive" : "",
              formItemClassName
            )}
          >
            <span className="truncate">{displayText()}</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <MultiSelectList
              data={data}
              placeholder={`Search ${label?.toLowerCase() || "items"}...`}
              setOpen={setOpen}
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
            />
            {showClearAll && selectedValues.length > 0 && (
              <div className="p-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="w-full"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 w-full items-start",
        `col-span-${smallSpan}`,
        `sm:col-span-${largeSpan}`,
        containerClassName
      )}
    >
      <Label className={labelClassName}>
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
      {content}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1">{renderSelectedBadges()}</div>
      )}
    </div>
  );
}
