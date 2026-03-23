import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PendingCarwashDataTable({ data = [] }) {
  const navigate = useNavigate();

  const customerGroups = useMemo(() => {
    const grouped = new Map();

    data.forEach((transaction) => {
      const fallbackKey = `${transaction?.customer?.customerContact || "N/A"}-${transaction?.customer?.customerName || "Unknown Customer"}`;
      const key = transaction?.customer?._id || fallbackKey;

      const existing = grouped.get(key);
      const transactionTime = new Date(
        transaction?.transactionTime || transaction?.createdAt || new Date(),
      );

      if (!existing) {
        grouped.set(key, {
          customerId: transaction?.customer?._id || null,
          key,
          customerName: transaction?.customer?.customerName || "Unknown",
          customerContact: transaction?.customer?.customerContact || "-",
          transactions: [transaction],
          totalNetAmount: Number(transaction?.netAmount) || 0,
          latestTransactionTime: transactionTime,
        });
        return;
      }

      existing.transactions.push(transaction);
      existing.totalNetAmount += Number(transaction?.netAmount) || 0;
      if (transactionTime > existing.latestTransactionTime) {
        existing.latestTransactionTime = transactionTime;
      }
    });

    return Array.from(grouped.values()).sort(
      (a, b) => b.latestTransactionTime - a.latestTransactionTime,
    );
  }, [data]);

  return (
    <div className="bg-white border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead className="text-center">Pending</TableHead>
            <TableHead className="hidden text-right lg:table-cell">
              Net Amt
            </TableHead>
            <TableHead className="hidden lg:table-cell">Last Txn</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customerGroups.length > 0 ? (
            customerGroups.map((customer) => (
              <TableRow
                key={customer.key}
                className="cursor-pointer"
                onClick={() => {
                  navigate(
                    `/carwash/pending-settlement/${customer.customerId || customer.key}`,
                    { state: { customerGroup: customer } },
                  );
                }}
              >
                <TableCell className="py-2">
                  <div className="text-xs font-semibold">{customer.customerName}</div>
                  <div className="text-xs text-muted-foreground md:hidden">
                    {customer.customerContact}
                  </div>
                </TableCell>
                <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                  {customer.customerContact}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{customer.transactions.length}</Badge>
                </TableCell>
                <TableCell className="hidden text-xs font-semibold text-right lg:table-cell">
                  Rs. {customer.totalNetAmount}
                </TableCell>
                <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">
                  {format(customer.latestTransactionTime, "d MMM, yyyy h:mm a")}
                </TableCell>
                <TableCell>
                  <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No pending transactions.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
