import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import StatusBadge from "@/components/ui/StatusBadge";
import { TableCell, TableHead } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export const GarageTransactionsColumn = [
  {
    accessorKey: "id",
    header: () => <TableHead className="hidden sm:table-cell">ID</TableHead>,
    cell: ({ row }) => {
      return (
        <TableCell className="hidden px-4 py-2 text-xs text-muted-foreground sm:table-cell">
          {row.original._id.slice(-6).toUpperCase()}
        </TableCell>
      );
    },
  },

  {
    accessorKey: "vehicle",

    header: () => <TableHead className="">Vehicle</TableHead>,
    cell: ({ row }) => {
      const vehicle = row.original.vehicle;
      return (
        <TableCell
          className="px-4 py-2 text-center cursor-pointer sm:py-2 sm:px-4 hover:bg-muted/50"
          onClick={() =>
            window.open(`/garage/vehicle/${vehicle._id}`, "_blank")
          }
        >
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-start">
              <div className="text-xs font-semibold underline text-primary text-start">
                {vehicle?.year} {vehicle?.make} {vehicle?.model}
              </div>
              <div className="flex justify-between gap-2 text-xs text-muted-foreground">
                {vehicle?.numberPlate}
              </div>
            </div>
          </div>
        </TableCell>
      );
    },
    filterFn: (row, _, filterValue) => {
      return (
        row.original?.vehicle.year +
        row.original?.vehicle.make +
        row.original?.vehicle.model
      )
        .toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
  },

  {
    accessorKey: "seller",
    header: () => <TableHead>Seller</TableHead>,
    cell: ({ row }) => {
      const customer = row.original.vehicle.seller;

      return (
        <TableCell
          className="px-4 py-2 cursor-pointer hover:bg-muted/50"
          onClick={() => {
            window.open(`/garage/customers/${customer._id}`, "_blank");
          }}
        >
          <div className="flex flex-col items-start">
            <div className="text-xs font-medium underline">{customer.name}</div>
            <div className="text-xs text-muted-foreground">
              {customer.contactNumber}
            </div>
          </div>
        </TableCell>
      );
    },
    filterFn: (row, _, filterValue) => {
      return row.original.vehicle.seller.name
        .toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "buyer",
    header: () => <TableHead>Buyer</TableHead>,
    cell: ({ row }) => {
      const customer = row.original.buyer;

      return (
        <TableCell
          className="px-4 py-2 cursor-pointer hover:bg-muted/50"
          onClick={() =>
            window.open(`/garage/customers/${customer._id}`, "_blank")
          }
        >
          <div className="flex flex-col items-start">
            <div className="text-xs font-medium underline">{customer.name}</div>
            <div className="text-xs text-muted-foreground">
              {customer.contactNumber}
            </div>
          </div>
        </TableCell>
      );
    },
    filterFn: (row, _, filterValue) => {
      return row.original.buyer.name
        .toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "sellingPrice",

    header: () => <TableHead>Selling Price</TableHead>,
    cell: ({ row }) => {
      const amount = row.original.sellingPrice;

      return (
        <TableCell className="px-4 py-1 sm:py-2 sm:px-4">
          <div className="flex flex-col items-start font-mono text-xs">
            <div>{formatCurrency(amount)}</div>
          </div>
        </TableCell>
      );
    },
  },
  {
    accessorKey: "commissionAmount",

    header: () => <TableHead>Commission</TableHead>,
    cell: ({ row }) => {
      const amount = row.original.commissionAmount;

      return (
        <TableCell className="px-4 py-1 sm:py-2 sm:px-4">
          <div className="flex flex-col items-start font-mono text-xs">
            <div>{formatCurrency(amount)}</div>
          </div>
        </TableCell>
      );
    },
  },
  {
    accessorKey: "transactionStatuses",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={"Status"}
        className="hidden px-1 lg:table-cell"
      />
    ),
    cell: ({ row }) => {
      const status = row.original.transactionStatus;

      return (
        <TableCell className="hidden px-4 py-2 lg:table-cell">
          <StatusBadge status={status} />
        </TableCell>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "transactionTime",
    header: ({ column }) => {
      let header = "Sold On";

      return (
        <DataTableColumnHeader
          column={column}
          title={header}
          className="hidden px-1 lg:table-cell"
        />
      );
    },
    cell: ({ row }) => {
      let date = row.original.transactionTime
        ? format(new Date(row.original?.transactionTime), "d MMM, yy h:mm a")
        : "";

      return (
        <TableCell className="hidden px-4 py-2 lg:table-cell">
          <div className="flex flex-col items-start">
            <div className="text-xs text-muted-foreground">{date}</div>
          </div>
        </TableCell>
      );
    },
  },
];
