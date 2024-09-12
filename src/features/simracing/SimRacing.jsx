import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, PlusCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SimRacing() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="text-xl font-semibold  flex items-center tracking-tight  justify-between gap-4 mb-4">
        <div className="flex items-center gap-4 ">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          Sim Racing
        </div>
        <div>
          <Button size="sm" variant="outline" className="mr-2">
            Customers <Users className="ml-2 w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline">
            New Rig <PlusCircle className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6 mb-6">
        <Card className="col-span-6 p-4">
          <div className="flex">
            <div className="w-8/12">
              <CardHeader className="pl-2 pt-2">
                <CardTitle className="flex items-center gap-4 ">
                  Rig #1 <Badge variant="outline">Available</Badge>
                </CardTitle>
              </CardHeader>
              <CardFooter className="pb-2 pl-2">Show QR</CardFooter>
            </div>
            <img src="rig.webp" className="w-4/12" />
          </div>
        </Card>
        <Card className="col-span-6 p-4">
          <div className="flex">
            <div className="w-8/12">
              <CardHeader className="pl-2 pt-2">
                <CardTitle className="flex items-center gap-4 ">
                  Rig #2 <Badge>Busy</Badge>
                </CardTitle>
              </CardHeader>
            </div>
            <img src="rig.webp" className="w-4/12" />
          </div>
        </Card>
      </div>
      <div>
        <Tabs defaultValue="active">
          <div className="flex justify-between">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>
            <div>
              <Button size="sm" variant="outline" className="mr-2">
                Booking <PlusCircle className="ml-2 w-4 h-4" />
              </Button>
              <Button size="sm">
                New <PlusCircle className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
          <TabsContent value="active">
            <Card>
              <CardHeader></CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>A list of your recent invoices.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Invoice</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.invoice}>
                        <TableCell className="font-medium">
                          {invoice.invoice}
                        </TableCell>
                        <TableCell>{invoice.paymentStatus}</TableCell>
                        <TableCell>{invoice.paymentMethod}</TableCell>
                        <TableCell className="text-right">
                          {invoice.totalAmount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Total</TableCell>
                      <TableCell className="text-right">$2,500.00</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bookings">
            <Card></Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default SimRacing;
