import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";

import StatusBadge from "@/components/ui/StatusBadge";
import { TableCell, TableHead } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import React from "react";
import ActionCell from "./merge/ActionCell";

export const CarwashCustomerDetailsColumn = [
  {
    accessorKey: "billNo",
    header: () => (
      <TableHead className="hidden sm:table-cell">Bill No</TableHead>
    ),
    cell: ({ row }) => {
      return (
        <TableCell className="hidden px-4 py-2 text-xs text-muted-foreground sm:table-cell">
          {row.original.billNo}
        </TableCell>
      );
    },
  },

  // {
  //   accessorKey: "customer",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title="Customer"
  //       className={"px-1"}
  //     />
  //   ),
  //   cell: ({ row }) => {
  //     const customer = row.original.customer;

  //     return (
  //       <TableCell className="px-4 py-2">
  //         <div className="flex flex-col items-start">
  //           <div className="text-xs font-medium">{customer.customerName}</div>
  //           <div className="text-xs text-muted-foreground">
  //             {customer.customerContact}
  //           </div>
  //         </div>
  //       </TableCell>
  //     );
  //   },
  //   filterFn: (row, _, filterValue) => {
  //     return row.original.customer.customerContact
  //       .toString()
  //       .includes(filterValue);
  //   },
  //   sortingFn: (a, b) => {
  //     const nameA = a.original.customer?.customerName?.toLowerCase() || "";
  //     const nameB = b.original.customer?.customerName?.toLowerCase() || "";
  //     return nameA.localeCompare(nameB);
  //   },
  // },
  {
    accessorKey: "vehicleName",

    header: () => <TableHead className="">Vehicle</TableHead>,
    cell: ({ row }) => {
      return (
        <TableCell className="px-4 py-2 text-center sm:py-2 sm:px-4">
          <div className="flex items-center gap-2">
            {row?.original?.vehicleColor && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      className={cn(
                        `w-6 h-6 border-2  rounded-full shadow-lg  cursor-pointer`
                      )}
                      style={{
                        backgroundColor: row?.original?.vehicleColor?.colorCode,
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {row?.original?.vehicleColor?.colorName}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <div className="flex flex-col items-start">
              <div className="text-xs font-semibold text-primary text-start">
                {row.original?.vehicleModel}
              </div>
              <div className="flex justify-between gap-2 text-xs text-muted-foreground">
                {row.original.vehicleNumber}
              </div>
            </div>
          </div>
        </TableCell>
      );
    },
    filterFn: (row, _, filterValue) => {
      return row.original.vehicleName
        .toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "serviceTypeName",

    header: () => <TableHead> Wash</TableHead>,
    cell: ({ row }) => {
      const service = row.original.service?.id;

      return (
        <TableCell className="px-4 py-1 sm:py-2 sm:px-4">
          <div className="flex flex-col items-start">
            <div className="text-xs font-semibold text-primary">
              {service?.serviceTypeName}
            </div>
            <div className="flex justify-between gap-2 text-xs text-muted-foreground">
              {service?.serviceVehicle.vehicleTypeName}
            </div>
          </div>
        </TableCell>
      );
    },
    filterFn: (row, _, filterValue) => {
      return row.original.vehicleNumber
        .toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "transactionStatus",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Status"}
        className="hidden px-1 lg:table-cell"
      />
    ),
    cell: ({ row }) => {
      const status = row.original.transactionStatus;

      return (
        <TableCell className="hidden px-4 py-2 lg:table-cell">
          <StatusBadge status={status} />
        </TableCell>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "paymentStatus",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Payment"}
        className="hidden px-1 lg:table-cell"
      />
    ),
    cell: ({ row }) => {
      const payment = row.original.paymentStatus;

      return (
        <TableCell className="hidden px-4 py-2 lg:table-cell">
          <StatusBadge status={payment} />
        </TableCell>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      let header = "Initiated At";

      return (
        <DataTableColumnHeader
          column={column}
          title={header}
          className="hidden px-1 lg:table-cell"
        />
      );
    },
    cell: ({ row }) => {
      let date = format(new Date(row.original.createdAt), "d MMM, yy h:mm a");

      return (
        <TableCell className="hidden px-4 py-2 lg:table-cell">
          <div className="flex flex-col items-start">
            <div className="text-xs text-muted-foreground">{date}</div>
          </div>
        </TableCell>
      );
    },
  },
  {
    accessorKey: "transactionTime",
    header: ({ column }) => {
      let header = "Finished At";

      return (
        <DataTableColumnHeader
          column={column}
          title={header}
          className="hidden px-1 lg:table-cell"
        />
      );
    },
    cell: ({ row }) => {
      let date = row.original.transactionTime
        ? format(new Date(row.original?.transactionTime), "d MMM, yy h:mm a")
        : "";

      return (
        <TableCell className="hidden px-4 py-2 lg:table-cell">
          <div className="flex flex-col items-start">
            <div className="text-xs text-muted-foreground">{date}</div>
          </div>
        </TableCell>
      );
    },
  },
  {
    accessorKey: "action",
    header: () => <TableHead className="text-center">Action</TableHead>,
    cell: ({ row }) => <ActionCell row={row} />,
  },
];
