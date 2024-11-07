import { TableCell, TableHead } from "@/components/ui/table";
import { format } from "date-fns";

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
    header: () => <TableHead>Customer</TableHead>,
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
        .split(" ")
        .some((name) => name.startsWith(filterValue.toLowerCase()));
    },
  },

  {
    accessorKey: "customerContact",
    header: () => <TableHead>Contact</TableHead>,
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <TableCell className="px-4 py-2">
          <div className="text-xs ">{customer.customerContact}</div>
        </TableCell>
      );
    },
    filterFn: (row, _, filterValue) => {
      return row.original.customerContact.toString().includes(filterValue);
    },
  },

  {
    accessorKey: "customerTransactions",
    header: () => (
      <TableHead className="hidden lg:table-cell text-center">
        Total Spent
      </TableHead>
    ),
    cell: ({ row }) => {
      const total = row.original.totalNetAmount || 0;

      return (
        <TableCell className="hidden lg:table-cell px-4 text-xs text-muted-foreground text-center py-2">
          +{total.toLocaleString()}
        </TableCell>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: () => {
      let header = "Customer Since";

      return (
        <TableHead className="hidden lg:table-cell text-center">
          {header}
        </TableHead>
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
