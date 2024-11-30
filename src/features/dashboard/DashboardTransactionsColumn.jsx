import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";

import StatusBadge from "@/components/ui/StatusBadge";
import { TableCell, TableHead } from "@/components/ui/table";
import { format } from "date-fns";

const badgeColours = {
  Carwash: " border bg-teal-50 font-medium text-teal-600 border-teal-300",
  Simracing:
    " border bg-orange-50 font-medium text-orange-600 border-orange-300",
  Parking: " border bg-purple-50 font-medium text-purple-600 border-purple-300",
};

export const DashboardTransactionsColumn = [
  {
    accessorKey: "billNo",
    header: () => (
      <TableHead className="hidden md:table-cell">Bill No</TableHead>
    ),
    cell: ({ row }) => {
      return (
        <TableCell className="text-muted-foreground text-sm py-0 hidden md:table-cell">
          {row.original.billNo}
        </TableCell>
      );
    },
  },

  {
    accessorKey: "serviceTypeName",

    header: () => <TableHead className="px-2 sm:px-4"> Service</TableHead>,
    cell: ({ row }) => {
      const billNo = row.original?.billNo;
      const type = billNo.endsWith("W")
        ? "Carwash"
        : billNo.endsWith("R")
        ? "Simracing"
        : billNo.endsWith("P")
        ? "Parking"
        : "Unknown";

      return (
        <TableCell className="px-2 py-1 sm:py-1 sm:px-4 ">
          <div className="flex flex-col items-start">
            {type === "Carwash" && (
              <>
                <div className="font-medium text-primary text-xs">
                  {row.original?.vehicleNumber}
                </div>
                <div className="text-[10px] flex justify-between gap-2 text-muted-foreground">
                  {row.original?.service?.id?.serviceVehicle?.billAbbreviation}_
                  {row.original?.service?.id?.billAbbreviation}
                </div>
              </>
            )}
            {type === "Parking" && (
              <>
                <div className="font-medium text-primary text-xs">
                  {row.original?.vehicleNumber}
                </div>
                <div className="text-[10px] flex justify-between gap-2 text-muted-foreground">
                  {row.original?.vehicle?.billAbbreviation}
                </div>
              </>
            )}
            {type === "Simracing" && (
              <>
                <div className="font-medium text-primary text-xs">
                  {row.original?.rig.rigName}
                </div>
                <div className="text-[10px] flex justify-between gap-2 text-muted-foreground">
                  SIM_RACING
                </div>
              </>
            )}
          </div>
        </TableCell>
      );
    },
    filterFn: (row, _, filterValue) => {
      if (row.original?.vehicleNumber) {
        return row.original?.vehicleNumber?.toString().includes(filterValue);
      } else {
        return false;
      }
    },
  },

  {
    accessorKey: "type",

    header: () => <TableHead className="px-2 sm:px-4">Type</TableHead>,
    cell: ({ row }) => {
      const billNo = row.original?.billNo;
      const type = billNo.endsWith("W")
        ? "Carwash"
        : billNo.endsWith("R")
        ? "Simracing"
        : billNo.endsWith("P")
        ? "Parking"
        : "Unknown";
      return (
        <TableCell className="px-2 py-1 sm:py-1 sm:px-4">
          <Badge variant={"outline"} className={badgeColours[type]}>
            {type}
          </Badge>
        </TableCell>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    accessorFn: (row) => {
      const billNo = row.billNo;
      return billNo.endsWith("W")
        ? "Carwash"
        : billNo.endsWith("R")
        ? "Simracing"
        : billNo.endsWith("P")
        ? "Parking"
        : "Unknown";
    },
  },

  {
    accessorKey: "transactionTime",
    header: ({ column }) => {
      let header = "Time";

      return (
        <DataTableColumnHeader
          column={column}
          title={header}
          className="hidden lg:table-cell px-1"
        />
      );
    },
    cell: ({ row }) => {
      let date = format(new Date(row.original.transactionTime), "hh:mm a");

      return (
        <TableCell className="hidden lg:table-cell text-start py-1 text-xs text-muted-foreground">
          {date}
        </TableCell>
      );
    },
  },

  {
    accessorKey: "netAmount",
    header: () => {
      let header = "Amount";

      return <TableHead className="text-end px-3 sm:pr-6">{header}</TableHead>;
    },
    cell: ({ row }) => {
      const amount = row.original.netAmount;

      return (
        <TableCell className=" py-1 text-end px-3 sm:pr-6 font-mono text-sm tracking-tight">
          <span className="sr-only sm:not-sr-only">+</span>
          {amount.toFixed(2)}
        </TableCell>
      );
    },
  },
];
