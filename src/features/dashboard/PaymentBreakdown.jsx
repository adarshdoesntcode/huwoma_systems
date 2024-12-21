import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function calculateTotalAmounts(
  paymentModes,
  carWashTransactions = [],
  simRacingTransactions = [],
  parkingTransactions = []
) {
  // Combine all transactions into one array
  const allTransactions = [
    ...carWashTransactions,
    ...simRacingTransactions,
    ...parkingTransactions,
  ];

  // Filter only Completed transactions
  const completedTransactions = allTransactions.filter(
    (transaction) => transaction.transactionStatus === "Completed"
  );

  // Create a result array by mapping over payment modes
  const result = paymentModes.map((paymentMode) => {
    // Calculate total amount for the current payment mode
    const totalAmount = completedTransactions
      .filter((transaction) => transaction.paymentMode._id === paymentMode._id)
      .reduce((sum, transaction) => sum + transaction.netAmount, 0);

    return {
      totalAmount: totalAmount, // Format totalAmount to two decimal places
      paymentMethod: paymentMode.paymentModeName,
    };
  });

  return result;
}

function PaymentBreakdown({
  paymentModes,
  carWashTransactions,
  simRacingTransactions,
  parkingTransactions,
}) {
  const [breakdownFilter, setBreakdownFilter] = useState("all");
  let breakdownData = [];

  if (breakdownFilter === "all") {
    breakdownData = calculateTotalAmounts(
      paymentModes,
      carWashTransactions,
      simRacingTransactions,
      parkingTransactions
    );
  } else if (breakdownFilter === "carwash") {
    breakdownData = calculateTotalAmounts(paymentModes, carWashTransactions);
  } else if (breakdownFilter === "simracing") {
    breakdownData = calculateTotalAmounts(paymentModes, simRacingTransactions);
  } else if (breakdownFilter === "parking") {
    breakdownData = calculateTotalAmounts(paymentModes, parkingTransactions);
  }

  return (
    <Card className="max-h-fit">
      <CardHeader className="p-4 sm:p-6 sm:pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg sm:text-xl">Breakdown</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Breakdown of today&apos;s collection
            </CardDescription>
          </div>
          <Select value={breakdownFilter} onValueChange={setBreakdownFilter}>
            <SelectTrigger className="w-[115px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="carwash">Carwash</SelectItem>
              <SelectItem value="simracing">Simracing</SelectItem>
              <SelectItem value="parking">Parking</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-4  sm:p-6 pt-2 sm:pt-0">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead colSpan={3}>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breakdownData.map((invoice, index) => (
              <TableRow key={index}>
                <TableCell colSpan={3}>{invoice.paymentMethod}</TableCell>
                <TableCell className="text-end">
                  Rs {invoice.totalAmount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right font-bold text-base">
                Rs{" "}
                {breakdownData
                  .reduce((acc, curr) => acc + curr.totalAmount, 0)
                  .toLocaleString()}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}

export default PaymentBreakdown;
