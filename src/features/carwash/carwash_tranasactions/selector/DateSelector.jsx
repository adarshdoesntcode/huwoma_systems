import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { isMobile } from "react-device-detect";
import { useScrollLock } from "@/hooks/useScrollLock";

function DateSelector({ filter, setFilter }) {
  const [open, setOpen] = useState(false);

  // Lock body scroll when drawer is open
  useScrollLock(open && isMobile);

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn(
            "w-full  justify-start text-left font-normal",
            !filter.customDate.date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {filter.customDate.date ? (
            format(filter.customDate.date, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex items-center justify-center pb-10">
        <Calendar
          mode="single"
          toDate={new Date()}
          selected={filter.customDate.date}
          onSelect={(date) => {
            setFilter((prev) => ({
              ...prev,
              preset: {
                from: "",
                text: "",
                to: new Date().toISOString(),
              },
              customRange: {
                from: "",
                to: "",
              },
              customMonth: {
                from: "",
                to: "",
              },
              customDate: { date: date },
            }));
            setOpen(false);
          }}
          data-vaul-no-drag
        />
      </DrawerContent>
    </Drawer>
  ) : (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn(
            "w-full  justify-start text-left font-normal",
            !filter.customDate.date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {filter.customDate.date ? (
            format(filter.customDate.date, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          toDate={new Date()}
          selected={filter.customDate.date}
          onSelect={(date) => {
            setFilter((prev) => ({
              ...prev,
              preset: {
                from: "",
                text: "",
                to: new Date().toISOString(),
              },
              customMonth: {
                from: "",
                to: "",
              },
              customRange: {
                from: "",
                to: "",
              },
              customDate: { date: date },
            }));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export default DateSelector;
