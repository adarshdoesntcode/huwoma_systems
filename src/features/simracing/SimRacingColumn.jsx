import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import TimeLapsed from "@/components/TimeLapsed";
import { TableCell, TableHead } from "@/components/ui/table";
import { format } from "date-fns";

export const SimRacingColumn = [
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
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Customer"
        className={"px-1"}
      />
    ),
    cell: ({ row }) => {
      const customer = row.original.customer;
      const date = format(new Date(row.original.createdAt), "d MMM, h:mm a");

      return (
        <TableCell className=" border-t px-4 py-1 sm:py-1 sm:px-4">
          <div className="flex flex-col   items-start">
            <div className="font-medium text-sm">{customer.customerName}</div>
            <div className="text-xs text-muted-foreground">
              {customer.customerContact}
            </div>
          </div>
          <div className="text-xs block md:hidden">Started: {date}</div>
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
    accessorKey: "rigName",
    header: () => <TableHead className="hidden lg:table-cell">Rig</TableHead>,
    cell: ({ row }) => {
      const name = row.original.rig.rigName;

      return <TableCell className="hidden lg:table-cell">{name}</TableCell>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      let header = "Start Time";

      return (
        <DataTableColumnHeader
          column={column}
          title={header}
          className="hidden xl:table-cell px-1"
        />
      );
    },
    cell: ({ row }) => {
      let date = format(new Date(row.original.start), "d MMM, yyyy");
      let time = format(new Date(row.original.start), "h:mm a");

      return (
        <TableCell className="hidden  xl:table-cell ">
          <div className="flex flex-col items-start text-center">
            <span className="font-medium ">{time}</span>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
        </TableCell>
      );
    },
  },
  {
    accessorKey: "timeLapsed",
    header: () => (
      <TableHead className="hidden md:table-cell text-center">
        Time Lapsed
      </TableHead>
    ),
    cell: ({ row }) => {
      const start = new Date(row.original.start);

      return (
        <TableCell className="hidden md:table-cell font-mono">
          <TimeLapsed createdAt={start} />
        </TableCell>
      );
    },
  },
];
