import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { TableCell, TableHead } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { Copy } from "lucide-react";

export const CarwashCustomersColumn = [
  {
    accessorKey: "sn",
    header: () => <TableHead className="hidden md:table-cell">Sn</TableHead>,
    cell: ({ row }) => {
      return (
        <TableCell className="text-muted-foreground hidden md:table-cell px-4 py-2">
          {row.index + 1}
        </TableCell>
      );
    },
  },

  {
    accessorKey: "customerName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Customer"
        className={"px-1"}
      />
    ),
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <TableCell className="px-4 py-2">
          <div className="font-medium text-xs">{customer.customerName}</div>
        </TableCell>
      );
    },
    filterFn: (row, _, filterValue) => {
      return row.original.customerName
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
  },

  {
    accessorKey: "customerContact",
    header: () => <TableHead>Contact</TableHead>,
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <TableCell className="px-4 py-3">
          <div className="flex  items-center gap-2">
            <div className="text-xs ">{customer.customerContact}</div>
            <Copy
              className="text-muted-foreground w-4 h-4 hover:text-primary hover:cursor-pointer hover:scale-110"
              title="Copy"
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(customer.customerContact);
                toast({
                  description: `${customer.customerContact} copied to clipboard.`,
                  duration: 1000,
                });
              }}
            />
          </div>
        </TableCell>
      );
    },
    filterFn: (row, _, filterValue) => {
      return row.original.customerContact.toString().includes(filterValue);
    },
  },

  {
    accessorKey: "customerVehicles",
    header: () => (
      <TableHead className="px-1 hidden lg:table-cell">Vehicles</TableHead>
    ),
    cell: ({ row }) => {
      const vehicles = row.original.customerVehicles;

      return (
        <TableCell className="hidden lg:table-cell max-w-32 px-4 text-xs text-muted-foreground text-center py-2">
          <div className="flex gap-2 items-center  flex-wrap">
            {vehicles.map((vehicle, index) => (
              <div className="flex gap-2 items-center" key={index}>
                {vehicle?.vehicleColor && (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className={cn(
                            `w-5 h-5 border-2  rounded-full shadow-lg  cursor-pointer`
                          )}
                          style={{
                            backgroundColor: vehicle?.vehicleColor?.colorCode,
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {vehicle?.vehicleColor?.colorName}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <div className="flex flex-col items-start">
                  <div className="font-semibold text-primary text-left text-xs">
                    {vehicle?.vehicleModel}
                  </div>
                  <div className="text-xs flex  justify-between gap-2 text-muted-foreground">
                    {vehicle.vehicleNumber}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TableCell>
      );
    },

    filterFn: (row, _, filterValue) => {
      return row.original.customerVehicles.some(
        (vehicle) =>
          vehicle.vehicleModel
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          vehicle.vehicleNumber
            ?.toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase())
      );
    },
  },
  {
    accessorKey: "customerTransactions",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Total Spent"
        className={"px-1 hidden lg:table-cell"}
        buttonClass={"mx-auto"}
      />
    ),
    cell: ({ row }) => {
      const total = row.original.totalNetAmount || 0;

      return (
        <TableCell className="hidden lg:table-cell px-4 text-xs text-muted-foreground text-center py-2">
          +{total.toLocaleString()}
        </TableCell>
      );
    },

    sortingFn: (a, b) => {
      const A = a.original.totalNetAmount || 0;
      const B = b.original.totalNetAmount || 0;

      return B - A;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      let header = "Customer Since";

      return (
        <DataTableColumnHeader
          column={column}
          title={header}
          className="hidden lg:table-cell px-1"
          buttonClass={"mx-auto"}
        />
      );
    },
    cell: ({ row }) => {
      let date = format(new Date(row.original.createdAt), "MMMM d, yyyy");

      return (
        <TableCell className="hidden  lg:table-cell px-4 py-2 text-center">
          <div className="text-xs text-muted-foreground">{date}</div>
        </TableCell>
      );
    },
  },
];
