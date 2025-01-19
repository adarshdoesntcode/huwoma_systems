import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { TableCell, TableHead } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
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
    accessorKey: "customerTransactionsNumber",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="No of Washes"
        className={"px-1 hidden lg:table-cell"}
        buttonClass={"mx-auto"}
      />
    ),
    cell: ({ row }) => {
      const transactions = row.original.transactions.filter(
        (transaction) => transaction.transactionStatus === "Completed"
      );
      const total = transactions.length;

      return (
        <TableCell className="hidden lg:table-cell px-4 text-xs text-muted-foreground text-center py-2">
          {total}
        </TableCell>
      );
    },

    sortingFn: (a, b) => {
      const A = a.original.transactions.filter(
        (transaction) => transaction.transactionStatus === "Completed"
      ).length;
      const B = b.original.transactions.filter(
        (transaction) => transaction.transactionStatus === "Completed"
      ).length;

      return B - A;
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
