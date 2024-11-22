import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import TimeLapsed from "@/components/TimeLapsed";
import { TableCell, TableHead } from "@/components/ui/table";
import { format } from "date-fns";

export const ParkingColumn = [
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
    accessorKey: "vehicle",
    header: () => (
      <TableHead className="hidden lg:table-cell">Vehicle</TableHead>
    ),
    cell: ({ row }) => {
      const name = row.original.vehicle.vehicleTypeName;

      return <TableCell className="hidden lg:table-cell">{name}</TableCell>;
    },
  },
  {
    accessorKey: "vehicleNumber",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Vehicle No"
        className={"px-1 "}
      />
    ),
    cell: ({ row }) => {
      const number = row.original.vehicleNumber;

      return (
        <TableCell className="tracking-wide text-lg font-medium">
          <div className="block lg:hidden text-muted-foreground text-xs font-normal">
            {row.original.vehicle.vehicleTypeName}
          </div>
          <div>{number}</div>
          <div className="block lg:hidden text-muted-foreground text-xs font-normal">
            Start: {format(new Date(row.original.start), "d MMM, yyyy h:mm a")}
          </div>
        </TableCell>
      );
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
