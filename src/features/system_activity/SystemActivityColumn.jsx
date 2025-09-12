import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import TableCellToolTip from "@/components/TableCellToolTip";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/ui/StatusBadge";
import { TableCell, TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const activityColors = {
  Rollback: "!text-orange-600 ", // A safe action, using blue for stability.
  Booking: "!text-purple-600 ", // Positive action, green signifies success.
  Create: "!text-emerald-600 ", // Constructive action, emerald for creation.
  Login: "!text-cyan-600 ",
  "Start Race": "!text-blue-600 ", // Technical, indigo for innovation.
  "QR Scan": "!text-violet-400",
  Update: "!text-yellow-600 ", // Informative, yellow for updates or changes.
  Cancelled: "!text-red-600 ", // Negative, red to signify cancellation.
  Delete: "!text-red-600 ", // Critical, rose for destructive actions.
};

export const SystemActivityColumn = [
  {
    accessorKey: "activityDate",
    header: ({ column }) => {
      let header = "Time";

      return (
        <DataTableColumnHeader
          column={column}
          title={header}
          className="hidden px-1 md:table-cell"
        />
      );
    },
    cell: ({ row }) => {
      return (
        <TableCell className=" p-0 px-4 text-xs uppercase hidden md:table-cell  overflow-hidden py-1.5 text-ellipsis text-nowrap">
          {format(row.original.activityDate, "MMM dd, yy  hh:mm:ss ")}
        </TableCell>
      );
    },
  },

  {
    accessorKey: "activityBy",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Actor"
        className={"px-1 hidden md:table-cell"}
      />
    ),
    cell: ({ row }) => {
      const admin = row.original?.activityBy?.fullname;
      const module = row?.original?.systemModule;

      return (
        <TableCell className="p-0 hidden md:table-cell px-4 py-1.5 text-nowrap">
          <div className="text-xs ">
            {admin
              ? admin
              : module === "SimRacing Transaction"
              ? "Unknown"
              : "POS App"}
          </div>
        </TableCell>
      );
    },
    filterFn: (row, _, filterValue) => {
      const fullname = row.original?.activityBy?.fullname;
      if (!fullname) return false; // Exclude rows without fullname
      return fullname.toLowerCase().includes(filterValue.toLowerCase());
    },
    // sortingFn: (a, b) => {
    //   const nameA = a.original.customer?.customerName?.toLowerCase() || "";
    //   const nameB = b.original.customer?.customerName?.toLowerCase() || "";
    //   return nameA.localeCompare(nameB);
    // },
  },

  {
    accessorKey: "activityType",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Activity"}
        className="hidden px-1 lg:table-cell"
      />
    ),
    cell: ({ row }) => {
      const status = row.original?.activityType;

      return (
        <TableCell
          className={cn(
            "text-xs hidden lg:table-cell p-0 px-4",
            activityColors[status]
          )}
        >
          {status}
        </TableCell>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "systemModule",

    header: () => (
      <TableHead className="hidden lg:table-cell"> Module</TableHead>
    ),
    cell: ({ row }) => {
      const module = row?.original?.systemModule;

      return (
        <TableCell className="text-xs hidden lg:table-cell p-0 px-4 py-1.5">
          {module}
        </TableCell>
      );
    },
  },

  {
    accessorKey: "description",
    header: ({ column }) => {
      let header = "Message";

      return (
        <DataTableColumnHeader
          column={column}
          title={header}
          className="table-cell px-1"
        />
      );
    },
    cell: ({ row }) => {
      return (
        <TableCell className=" p-0 px-4 text-xs whitespace-nowrap max-w-[300px] py-1.5  overflow-hidden text-ellipsis ">
          <TableCellToolTip text={row.original.description}>
            <span>{row.original.description}</span>
          </TableCellToolTip>
        </TableCell>
      );
    },
  },

  {
    accessorKey: "userAgent",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Agent"}
        className="hidden px-1 2xl:table-cell"
      />
    ),
    cell: ({ row }) => {
      const payment = row.original?.userAgent;

      return (
        <TableCell className="p-0 px-4 hidden 2xl:table-cell text-xs whitespace-nowrap max-w-[200px] overflow-hidden text-ellipsis">
          <TableCellToolTip text={payment}>
            <span>{payment}</span>
          </TableCellToolTip>
        </TableCell>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "activityIpAddress",
    header: ({ column }) => {
      let header = "IP";

      return (
        <DataTableColumnHeader
          column={column}
          title={header}
          className="hidden px-1 xl:table-cell"
        />
      );
    },
    cell: ({ row }) => {
      return (
        <TableCell className="hidden p-0 px-4 text-xs xl:table-cell">
          {row.original?.activityIpAddress}
        </TableCell>
      );
    },
  },
];
