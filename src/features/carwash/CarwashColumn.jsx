import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
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

export const CarwashColumn = [
  {
    accessorKey: "billNo",
    header: () => (
      <TableHead className="hidden md:table-cell">Bill No</TableHead>
    ),
    cell: ({ row }) => {
      return (
        <TableCell className="text-muted-foreground hidden md:table-cell">
          {row.original.billNo}
        </TableCell>
      );
    },
  },

  {
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Customer"
        className={"px-1 hidden lg:table-cell"}
      />
    ),
    cell: ({ row }) => {
      const customer = row.original.customer;

      return (
        <TableCell className="px-4 py-2 sm:py-1 sm:px-4 hidden lg:table-cell">
          <div className="flex flex-col items-start">
            <div className="font-semibold text-xs">{customer.customerName}</div>
            <div className="text-xs text-muted-foreground">
              {customer.customerContact}
            </div>
          </div>
        </TableCell>
      );
    },
    filterFn: (row, _, filterValue) => {
      return row.original.customer.customerContact
        .toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
    sortingFn: (a, b) => {
      const nameA = a.original.customer?.customerName?.toLowerCase() || "";
      const nameB = b.original.customer?.customerName?.toLowerCase() || "";
      return nameA.localeCompare(nameB);
    },
  },
  {
    accessorKey: "vehicleName",

    header: () => <TableHead className="">Vehicle</TableHead>,
    cell: ({ row }) => {
      return (
        <TableCell className="px-4 py-2 sm:py-1 sm:px-4 text-center">
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
              <div className="font-semibold text-primary text-xs">
                {row.original?.vehicleModel}
              </div>
              <div className="text-xs flex justify-between gap-2 text-muted-foreground">
                {row.original.vehicleNumber}
              </div>
            </div>
          </div>
        </TableCell>
      );
    },
    filterFn: (row, _, filterValue) => {
      return row.original.vehicleModel
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
        <TableCell className="px-4 py-1 sm:py-1 sm:px-4">
          <div className="flex flex-col items-start">
            <div className="font-semibold text-primary text-xs">
              {service?.serviceTypeName}
            </div>
            <div className="text-xs flex justify-between gap-2 text-muted-foreground">
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
    header: () => (
      <TableHead className="hidden lg:table-cell">Status</TableHead>
    ),
    cell: ({ row }) => {
      const status = row.original.transactionStatus;

      return (
        <TableCell className="hidden lg:table-cell">
          <StatusBadge status={status} />
        </TableCell>
      );
    },
  },

  {
    accessorKey: "paymentStatus",
    header: () => (
      <TableHead className="hidden lg:table-cell">Payment</TableHead>
    ),
    cell: ({ row }) => {
      const payment = row.original.paymentStatus;

      return (
        <TableCell className="hidden  lg:table-cell">
          {/* <Badge variant="outline">{payment}</Badge> */}
          <StatusBadge status={payment} />
        </TableCell>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ table, column }) => {
      const rows = table.getFilteredRowModel().rows;

      let header = "Initiated At";

      if (rows[0]?.original.transactionStatus === "Ready for Pickup") {
        header = "Finished At";
      } else if (rows[0]?.original.transactionStatus === "Completed") {
        header = "Transaction Time";
      }

      return (
        <DataTableColumnHeader
          column={column}
          title={header}
          className="hidden lg:table-cell px-1"
        />
      );
    },
    cell: ({ row }) => {
      let date = format(new Date(row.original.createdAt), "d MMM, yyyy h:mm a");

      if (row?.original.transactionStatus === "Ready for Pickup") {
        date = format(new Date(row.original.service.end), "d MMM, yyyy h:mm a");
      } else if (row?.original.transactionStatus === "Completed") {
        date = format(
          new Date(row.original.transactionTime),
          "d MMM, yyyy h:mm a"
        );
      }

      return (
        <TableCell className="hidden  lg:table-cell py-1">
          <div className="flex flex-col items-start">
            <div className="text-xs text-muted-foreground">{date}</div>
          </div>
        </TableCell>
      );
    },
  },
];
