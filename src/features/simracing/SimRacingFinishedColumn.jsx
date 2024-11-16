import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/ui/StatusBadge";
import { TableCell, TableHead } from "@/components/ui/table";
import { format } from "date-fns";

export const SimRacingFinishedColumn = [
  {
    accessorKey: "billNo",
    header: () => <TableHead>Bill No</TableHead>,
    cell: ({ row }) => {
      return (
        <TableCell className="text-muted-foreground">
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
        <TableCell className="text-gray-600 px-4 py-2 sm:py-2 sm:px-4">
          <div className="flex flex-col items-start">
            <div className="font-semibold">{customer.customerName}</div>
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
    accessorKey: "rig",

    header: () => <TableHead className="hidden md:table-cell"> Rig</TableHead>,
    cell: ({ row }) => {
      const rig = row.original.rig;

      return (
        <TableCell className="px-4 py-2 sm:py-2 sm:px-4 hidden md:table-cell">
          {rig?.rigName}
        </TableCell>
      );
    },
    filterFn: (row, _, filterValue) => {
      return row.original.rig?.rigName.toString().includes(filterValue);
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
          <StatusBadge status={payment} />
        </TableCell>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      let header = "Finished At";

      return (
        <DataTableColumnHeader
          column={column}
          title={header}
          className="hidden lg:table-cell px-1"
        />
      );
    },
    cell: ({ row }) => {
      let date = format(new Date(row.original.end), "d MMM, yyyy");
      let time = format(new Date(row.original.end), "h:mm a");

      return (
        <TableCell className="hidden  lg:table-cell">
          <div className="flex flex-col items-start">
            <div className="font-medium">{time}</div>
            <div className="text-xs text-muted-foreground">{date}</div>
          </div>
        </TableCell>
      );
    },
  },
];