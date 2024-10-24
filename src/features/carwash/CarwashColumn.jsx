import { Badge } from "@/components/ui/badge";
import { TableCell, TableHead } from "@/components/ui/table";
import { format } from "date-fns";

export const CarwashColumn = [
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
  },
  {
    accessorKey: "serviceTypeName",

    header: () => (
      <TableHead className="hidden lg:table-cell"> Service</TableHead>
    ),
    cell: ({ row }) => {
      const service = row.original.service.id;

      return (
        <TableCell className="hidden lg:table-cell">
          <div className="flex flex-col items-start">
            <div className="text-xs text-muted-foreground">
              {service.serviceVehicle.vehicleTypeName}
            </div>
            <div className="font-semibold">{service.serviceTypeName}</div>
          </div>
        </TableCell>
      );
    },
  },
  {
    accessorKey: "transactionStatus",
    header: () => <TableHead>Status</TableHead>,
    cell: ({ row }) => {
      const status = row.original.transactionStatus;

      return (
        <TableCell>
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
    header: () => (
      <TableHead className="hidden lg:table-cell">Initiated At</TableHead>
    ),
    cell: ({ row }) => {
      const date = format(new Date(row.original.createdAt), "d MMM, yyyy");
      const time = format(new Date(row.original.createdAt), "h:mm a");

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
