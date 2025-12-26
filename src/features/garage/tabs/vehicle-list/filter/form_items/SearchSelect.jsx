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
import { isDesktop } from "react-device-detect";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
const SelectList = ({ data = [], setOpen, setSelectedValue, placeholder }) => (
  <Command>
    <CommandInput placeholder={placeholder} />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup>
        {data.map((item) => (
          <CommandItem
            key={item.value}
            value={item.value}
            onSelect={(value) => {
              setSelectedValue(value);
              setOpen(false);
            }}
          >
            {item.label}
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  </Command>
);
export function SearchSelect({
  name,
  label,
  placeholder,
  selectedValue,
  setSelectedValue,
  data,
  largeSpan,
  smallSpan,
  errors,
  formItemClassName,
  labelClassName,
  containerClassName = "duration-300 fade-in animate-in",
  required,
}) {
  const [open, setOpen] = useState(false);

  let content;

  if (isDesktop) {
    content = (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              errors ? "border-destructive" : "",
              formItemClassName
            )}
          >
            {selectedValue ? (
              <div className="flex items-center justify-between w-full">
                <span>{selectedValue}</span>
                <span>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span>{placeholder}</span>
                <span>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <SelectList
            data={data}
            placeholder={placeholder}
            setOpen={setOpen}
            setSelectedValue={setSelectedValue}
          />
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
              errors ? "border-destructive" : "",
              formItemClassName
            )}
          >
            {selectedValue ? (
              <div className="flex items-center justify-between w-full">
                <span>{selectedValue}</span>
                <span>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span>{placeholder}</span>
                <span>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </div>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <SelectList
              data={data}
              placeholder={placeholder}
              setOpen={setOpen}
              setSelectedValue={setSelectedValue}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-2",
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
      {content}
    </div>
  );
}

export default SearchSelect;
