import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { TableCell, TableHead } from "@/components/ui/table";
import { format } from "date-fns";

export const SimRacingCustomersColumn = [
  {
    accessorKey: "sn",
    header: () => <TableHead className="hidden md:table-cell">Sn</TableHead>,
    cell: ({ row }) => {
      return (
        <TableCell className="hidden px-4 py-2 text-muted-foreground md:table-cell">
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
          <div className="text-xs font-medium">{customer.customerName}</div>
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
        <TableCell className="hidden px-4 py-2 text-xs text-center lg:table-cell text-muted-foreground">
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
          className="hidden px-1 lg:table-cell"
          buttonClass={"mx-auto"}
        />
      );
    },
    cell: ({ row }) => {
      let date = format(new Date(row.original.createdAt), "MMMM d, yyyy");

      return (
        <TableCell className="hidden px-4 py-2 text-center lg:table-cell">
          <div className="text-xs text-muted-foreground">{date}</div>
        </TableCell>
      );
    },
  },
];
