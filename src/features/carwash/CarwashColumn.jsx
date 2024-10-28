import { Badge } from "@/components/ui/badge";
import { TableCell, TableHead } from "@/components/ui/table";
import { format } from "date-fns";

export const CarwashColumn = [
  {
    accessorKey: "billNo",
    header: () => (
      <TableHead className="hidden md:table-cell">Bill No</TableHead>
    ),
    cell: ({ row }) => {
      return (
        <TableCell className="text-muted-foreground hidden md:table-cell">
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

      return (
        <TableCell className="text-gray-600">
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
  },
  {
    accessorKey: "serviceTypeName",

    header: () => <TableHead> Service</TableHead>,
    cell: ({ row }) => {
      const service = row.original.service.id;

      return (
        <TableCell className="p-2">
          <div className="flex flex-col items-start">
            <div className="font-semibold">{service.serviceTypeName}</div>
            <div className="text-xs flex justify-between gap-2 text-muted-foreground">
              {service.serviceVehicle.vehicleTypeName}
              <span className="font-medium text-xs text-primary">
                ({row.original.vehicleNumber})
              </span>
            </div>
          </div>
        </TableCell>
      );
    },
    filterFn: (row, _, filterValue) => {
      return row.original.vehicleNumber.toString().includes(filterValue);
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
          <Badge variant="secondary">{status}</Badge>
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
          <Badge variant="outline">{payment}</Badge>
        </TableCell>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ table }) => {
      const rows = table.getFilteredRowModel().rows;

      let header = "Initiated At";

      if (rows[0]?.original.transactionStatus === "Ready for Pickup") {
        header = "Finished At";
      } else if (rows[0]?.original.transactionStatus === "Completed") {
        header = "Transaction Time";
      }

      return <TableHead className="hidden lg:table-cell">{header}</TableHead>;
    },
    cell: ({ row }) => {
      let date = format(new Date(row.original.createdAt), "d MMM, yyyy");
      let time = format(new Date(row.original.createdAt), "h:mm a");

      if (row?.original.transactionStatus === "Ready for Pickup") {
        date = format(new Date(row.original.service.end), "d MMM, yyyy");
        time = format(new Date(row.original.service.end), "h:mm a");
      } else if (row?.original.transactionStatus === "Completed") {
        date = format(new Date(row.original.transactionTime), "d MMM, yyyy");
        time = format(new Date(row.original.transactionTime), "h:mm a");
      }

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
