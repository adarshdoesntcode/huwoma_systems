import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/ui/StatusBadge";
import { TableCell, TableHead } from "@/components/ui/table";
import { format } from "date-fns";

export const ParkingFinishedColumn = [
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
            Ended: {format(new Date(row.original.end), "d MMM, h:mm a")}
          </div>
        </TableCell>
      );
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
      let date = row.original.end
        ? format(new Date(row.original.end), "d MMM, yyyy h:mm a")
        : "";

      return (
        <TableCell className="hidden  lg:table-cell">
          <div className="flex flex-col items-start">
            <div className="text-xs text-muted-foreground">{date}</div>
          </div>
        </TableCell>
      );
    },
  },
];
