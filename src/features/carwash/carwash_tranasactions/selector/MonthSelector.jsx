import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { startOfMonth, endOfMonth, isBefore, isAfter, format } from "date-fns";
import { isMobile } from "react-device-detect";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getMonthDateRange = (year, monthIndex) => {
  const start = startOfMonth(new Date(year, monthIndex));
  const end = endOfMonth(new Date(year, monthIndex));
  return { from: start, to: end };
};

const MonthSelector = ({ filter, onSelect }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [year, setYear] = useState(currentYear);
  const [open, setOpen] = useState(false);

  const handleMonthSelect = (monthIndex) => {
    if (year === currentYear && monthIndex > currentMonth) return;

    const range = getMonthDateRange(year, monthIndex);
    onSelect(range);
    setOpen(false);
  };

  const canGoPrev = year > 2024;
  const canGoNext = year < currentYear;

  const selectedMonth = filter.customMonth?.from
    ? new Date(filter.customMonth.from).getMonth()
    : null;

  const selectedYear = filter.customMonth?.from
    ? new Date(filter.customMonth.from).getFullYear()
    : null;

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start w-full font-normal text-left ",
            !filter.customMonth?.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {filter.customMonth?.from ? (
            <>{format(filter.customMonth?.from, "LLLL y")}</>
          ) : (
            <span>Pick a month</span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex items-center justify-center pb-10">
        <div className="flex items-center justify-between w-[240px] mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => canGoPrev && setYear((y) => y - 1)}
            disabled={!canGoPrev}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-medium">{year}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => canGoNext && setYear((y) => y + 1)}
            disabled={!canGoNext}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2" data-vaul-no-drag>
          {MONTHS.map((month, index) => {
            const isDisabled = year === currentYear && index > currentMonth;
            return (
              <Button
                key={month}
                variant={
                  selectedMonth === index && selectedYear === year
                    ? "default"
                    : "outline"
                }
                disabled={isDisabled}
                onClick={() => handleMonthSelect(index)}
                className="text-sm"
              >
                {month.slice(0, 3)}
              </Button>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start w-full font-normal text-left ",
            !filter.customMonth?.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {filter.customMonth?.from ? (
            <>{format(filter.customMonth?.from, "LLLL y")}</>
          ) : (
            <span>Pick a month</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px]">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => canGoPrev && setYear((y) => y - 1)}
            disabled={!canGoPrev}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-medium">{year}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => canGoNext && setYear((y) => y + 1)}
            disabled={!canGoNext}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {MONTHS.map((month, index) => {
            const isDisabled = year === currentYear && index > currentMonth;
            return (
              <Button
                key={month}
                variant={
                  selectedMonth === index && selectedYear === year
                    ? "default"
                    : "outline"
                }
                disabled={isDisabled}
                onClick={() => handleMonthSelect(index)}
                className="text-sm"
              >
                {month.slice(0, 3)}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MonthSelector;
