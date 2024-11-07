import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/ui/StatusBadge";
import { TableCell, TableHead } from "@/components/ui/table";
import { format } from "date-fns";

export const CarwashBookingColumn = [
  {
    accessorKey: "billNo",
    header: () => (
      <TableHead className="hidden lg:table-cell">Bill No</TableHead>
    ),
    cell: ({ row }) => {
      return (
        <TableCell className="text-muted-foreground hidden lg:table-cell">
          {row.original.billNo}
        </TableCell>
      );
    },
  },

  {
    accessorKey: "customer",
    header: () => <TableHead>Customer</TableHead>,
    cell: ({ row }) => {
      const customer = row.original.customer;
      const date = format(
        new Date(row.original.bookingDeadline),
        "d MMM, h:mm a"
      );

      return (
        <TableCell className=" border-t px-4 py-2 sm:py-2 sm:px-4">
          <div className="flex flex-col   items-start">
            <div className="font-semibold">{customer.customerName}</div>
            <div className="text-xs text-muted-foreground">
              {customer.customerContact}
            </div>
          </div>
          <div className="text-xs block sm:hidden">Deadline: {date}</div>
        </TableCell>
      );
    },
    filterFn: (row, _, filterValue) => {
      return row.original.customer.customerContact
        .toString()
        .includes(filterValue);
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
          {/* <Badge variant="secondary">{status}</Badge> */}
          <StatusBadge status={status} />
        </TableCell>
      );
    },
  },

  {
    accessorKey: "bookingDeadline",
    header: () => (
      <TableHead className="hidden md:table-cell">Deadline</TableHead>
    ),
    cell: ({ row }) => {
      let date = format(new Date(row.original.bookingDeadline), "d MMM, yyyy");
      let time = format(new Date(row.original.bookingDeadline), "h:mm a");

      return (
        <TableCell className="hidden  md:table-cell">
          <div className="flex flex-col items-start">
            <div className="font-medium">{time}</div>
            <div className="text-xs text-muted-foreground">{date}</div>
          </div>
        </TableCell>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ table }) => {
      let header = "Booked At";

      return <TableHead className="hidden xl:table-cell">{header}</TableHead>;
    },
    cell: ({ row }) => {
      let date = format(new Date(row.original.createdAt), "d MMM, yyyy");
      let time = format(new Date(row.original.createdAt), "h:mm a");

      return (
        <TableCell className="hidden  xl:table-cell">
          <div className="flex flex-col items-start">
            <div className="font-medium">{time}</div>
            <div className="text-xs text-muted-foreground">{date}</div>
          </div>
        </TableCell>
      );
    },
  },
];
