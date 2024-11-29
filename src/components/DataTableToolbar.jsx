import { Dot, X } from "lucide-react";
import { Button } from "./ui/button";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "./ui/input";

const carwashTransactionStatus = [
  {
    value: "In Queue",
    label: "In Queue",
    icon: Dot,
  },
  {
    value: "Ready for Pickup",
    label: "Ready for Pickup",
    icon: Dot,
  },
  {
    value: "Completed",
    label: "Completed",
    icon: Dot,
  },
  {
    value: "Booked",
    label: "Booked",
    icon: Dot,
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    icon: Dot,
  },
];

const simracingTransactionStatus = [
  {
    value: "Active",
    label: "Active",
    icon: Dot,
  },

  {
    value: "Completed",
    label: "Completed",
    icon: Dot,
  },
  {
    value: "Booked",
    label: "Booked",
    icon: Dot,
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    icon: Dot,
  },
];

const parkingTransactionStatus = [
  {
    value: "Parked",
    label: "Parked",
    icon: Dot,
  },

  {
    value: "Completed",
    label: "Completed",
    icon: Dot,
  },

  {
    value: "Cancelled",
    label: "Cancelled",
    icon: Dot,
  },
];

const paymentStatus = [
  {
    label: "Pending",
    value: "Pending",
    icon: Dot,
  },
  {
    label: "Paid",
    value: "Paid",
    icon: Dot,
  },
  {
    label: "Cancelled",
    value: "Cancelled",
    icon: Dot,
  },
];

export function DataTableToolbar({
  table,
  transactionOption,
  defaultSearchSelection,
  searchOptions,
}) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    table.getState().sorting.length > 0 ||
    Object.keys(table.getState().columnVisibility).length > 0;
  const [filter, setFilter] = useState(defaultSearchSelection);

  return (
    <div className="flex items-center justify-between">
      <div className="flex  items-center space-x-2">
        <div className="flex items-center gap-2 space-x-2">
          <Select
            value={filter}
            onValueChange={(value) => {
              setFilter(value);
              table.resetColumnFilters();
              table.resetSorting();
              table.resetColumnVisibility();
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              {searchOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
              {/* <SelectItem value="serviceTypeName">Vehicle No</SelectItem>
              <SelectItem value="customer">Contact</SelectItem>
              <SelectItem value="billNo">Bill No</SelectItem> */}
            </SelectContent>
          </Select>

          <Input
            placeholder="Search.."
            type="tel"
            inputMode="numeric"
            autoComplete="off"
            value={table.getColumn(filter)?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn(filter)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="hidden   lg:flex  items-center gap-2">
          {table.getColumn("transactionStatus") && (
            <DataTableFacetedFilter
              column={table.getColumn("transactionStatus")}
              title="Status"
              options={
                transactionOption === "carwash"
                  ? carwashTransactionStatus
                  : transactionOption === "simracing"
                  ? simracingTransactionStatus
                  : parkingTransactionStatus
              }
            />
          )}
          {table.getColumn("paymentStatus") && (
            <DataTableFacetedFilter
              column={table.getColumn("paymentStatus")}
              title="Payment"
              options={paymentStatus}
            />
          )}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                table.resetColumnFilters();
                table.resetSorting();
                table.resetColumnVisibility();
              }}
            >
              Reset
              <X className="ml-2 h-3.5 w-5.5 text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
