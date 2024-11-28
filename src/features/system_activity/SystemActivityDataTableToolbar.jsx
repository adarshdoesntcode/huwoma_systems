import { DataTableFacetedFilter } from "@/components/DataTableFacetedFilter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dot, X } from "lucide-react";
import { useState } from "react";

const activityTypeStatus = [
  {
    label: "Rollback",
    value: "Rollback",
    icon: Dot,
  },
  {
    label: "Booking",
    value: "Booking",
    icon: Dot,
  },
  {
    label: "Create",
    value: "Create",
    icon: Dot,
  },
  {
    label: "Login",
    value: "Login",
    icon: Dot,
  },
  {
    label: "QR Scan",
    value: "QR Scan",
    icon: Dot,
  },
  {
    label: "Start Race",
    value: "Start Race",
    icon: Dot,
  },
  {
    label: "Logout",
    value: "Logout",
    icon: Dot,
  },
  {
    label: "Update",
    value: "Update",
    icon: Dot,
  },
  {
    label: "Cancelled",
    value: "Cancelled",
    icon: Dot,
  },
  {
    label: "Delete",
    value: "Delete",
    icon: Dot,
  },
];

export function SystemActivityDataTableToolbar({
  table,

  defaultSearchSelection = "activityBy",
  searchOptions = [
    {
      value: "activityBy",
      label: "Actor",
    },
    { value: "systemModule", label: "Module" },
    { value: "description", label: "Message" },
  ],
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
          {/* {table.getColumn("systemModule") && (
            <DataTableFacetedFilter
              column={table.getColumn("systemModule")}
              title="Module"
              options={systemModuleStatus}
            />
          )} */}
          {table.getColumn("activityType") && (
            <DataTableFacetedFilter
              column={table.getColumn("activityType")}
              title="Activity"
              options={activityTypeStatus}
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
