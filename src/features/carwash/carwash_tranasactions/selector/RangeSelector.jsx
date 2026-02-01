import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { endOfDay, format, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { isMobile } from "react-device-detect";

function RangeSelector({ filter, setFilter }) {
  return isMobile ? (
    <Drawer shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          id="date"
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !filter.customRange?.from &&
            !filter.customRange?.to &&
            "text-muted-foreground"
          )}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {filter.customRange?.from ? (
            filter.customRange?.to ? (
              <>
                {format(filter.customRange?.from, "LLL dd, y")} -{" "}
                {format(filter.customRange?.to, "LLL dd, y")}
              </>
            ) : (
              format(filter.customRange?.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a range</span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex items-center justify-center pb-10">
        <Calendar
          mode="range"
          toDate={new Date()}
          selected={filter.customRange}
          onSelect={(value) => {
            setFilter((prev) => ({
              ...prev,
              preset: {
                from: "",
                text: "",
                to: new Date().toISOString(),
              },
              customDate: {
                date: "",
              },
              customMonth: {
                from: "",
                to: "",
              },
              customRange: {
                ...prev.customRange,
                ...{
                  from: value.from ? startOfDay(value.from) : undefined,
                  to: value.to ? endOfDay(value.to) : undefined,
                },
              },
            }));
          }}
          numberOfMonths={2}
          data-vaul-no-drag
        />
      </DrawerContent>
    </Drawer>
  ) : (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          id="date"
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !filter.customRange?.from &&
            !filter.customRange?.to &&
            "text-muted-foreground"
          )}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {filter.customRange?.from ? (
            filter.customRange?.to ? (
              <>
                {format(filter.customRange?.from, "LLL dd, y")} -{" "}
                {format(filter.customRange?.to, "LLL dd, y")}
              </>
            ) : (
              format(filter.customRange?.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          toDate={new Date()}
          selected={filter.customRange}
          onSelect={(value) => {
            setFilter((prev) => ({
              ...prev,
              preset: {
                from: "",
                text: "",
                to: new Date(),
              },
              customDate: {
                date: "",
              },
              customMonth: {
                from: "",
                to: "",
              },
              customRange: {
                ...prev.customRange,
                ...{
                  from: value.from ? startOfDay(value.from) : undefined,
                  to: value.to ? endOfDay(value.to) : undefined,
                },
              },
            }));
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}

export default RangeSelector;
