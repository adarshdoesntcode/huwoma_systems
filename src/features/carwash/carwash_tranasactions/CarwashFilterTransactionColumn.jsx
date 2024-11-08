import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/ui/StatusBadge";
import { TableCell, TableHead } from "@/components/ui/table";
import { format } from "date-fns";

export const CarwashFilterTransactionColumn = [
  {
    accessorKey: "billNo",
    header: () => (
      <TableHead className="hidden md:table-cell">Bill No</TableHead>
    ),
    cell: ({ row }) => {
      return (
        <TableCell className="text-muted-foreground hidden md:table-cell px-4 py-2">
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
        className={"px-1"}
      />
    ),
    cell: ({ row }) => {
      const customer = row.original.customer;

      return (
        <TableCell className="px-4 py-2">
          <div className="flex flex-col items-start">
            <div className="font-medium text-xs">{customer.customerName}</div>
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
        .includes(filterValue);
    },
    sortingFn: (a, b) => {
      const nameA = a.original.customer?.customerName?.toLowerCase() || "";
      const nameB = b.original.customer?.customerName?.toLowerCase() || "";
      return nameA.localeCompare(nameB);
    },
  },
  {
    accessorKey: "serviceTypeName",

    header: () => <TableHead> Service</TableHead>,
    cell: ({ row }) => {
      const service = row.original.service?.id;

      return (
        <TableCell className="px-4 py-2">
          {service ? (
            <div className="flex flex-col items-start">
              <div className=" text-xs font-medium">
                {service?.serviceTypeName}
              </div>
              <div className="text-xs flex justify-between gap-2 text-muted-foreground">
                {service?.serviceVehicle?.vehicleTypeName}
                <span className="font-medium text-xs text-primary">
                  ({row.original?.vehicleNumber})
                </span>
              </div>
            </div>
          ) : (
            <div className=" text-xs  text-muted-foreground">Not Selected</div>
          )}
        </TableCell>
      );
    },
    filterFn: (row, _, filterValue) => {
      return row.original.vehicleNumber.toString().includes(filterValue);
    },
  },
  {
    accessorKey: "transactionStatus",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Status"}
        className="hidden lg:table-cell px-1"
      />
    ),
    cell: ({ row }) => {
      const status = row.original.transactionStatus;

      return (
        <TableCell className="hidden lg:table-cell px-4 py-2">
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
        className="hidden lg:table-cell px-1"
      />
    ),
    cell: ({ row }) => {
      const payment = row.original.paymentStatus;

      return (
        <TableCell className="hidden  lg:table-cell px-4 py-2">
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
          className="hidden lg:table-cell px-1"
        />
      );
    },
    cell: ({ row }) => {
      let date = format(new Date(row.original.createdAt), "d MMM, yyyy h:mm a");

      return (
        <TableCell className="hidden  lg:table-cell px-4 py-2">
          <div className="flex flex-col items-start">
            <div className="text-xs text-muted-foreground">{date}</div>
          </div>
        </TableCell>
      );
    },
  },
];
