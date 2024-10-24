// import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableHead } from "@/components/ui/table";

import { format } from "date-fns";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";

export const CarwashColumn = [
  {
    accessorKey: "billNo",
    header: () => <TableHead>Bill No</TableHead>,
    cell: ({ row }) => {
      return (
        <TableCell className="text-gray-700">{row.original.billNo}</TableCell>
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
            <div>{customer.customerName}</div>
            <div>{customer.customerContact}</div>
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
            <div>{service.serviceVehicle.vehicleTypeName}</div>
            <div>{service.serviceTypeName}</div>
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
    id: "actions",
    header: () => (
      <TableHead className="hidden md:table-cell"> Actions</TableHead>
    ),

    cell: ({ row }) => {
      return (
        <TableCell className="hidden md:table-cell">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Link to={``}>View</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Terminate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      );
    },
  },
];
