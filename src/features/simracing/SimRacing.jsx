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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, Edit, PlusCircle, QrCode, Users } from "lucide-react";
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
            <div className="w-8/12 border-r pr-2 flex flex-col justify-between">
              <div>
                <CardHeader className=" p-2 ">
                  <CardTitle className="flex items-center justify-between gap-4 ">
                    <div className="flex items-center gap-4 ">Rig #1</div>
                    <div>
                      <Badge variant="outline">Available</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 text-muted-foreground text-xs  pt-0">
                  <p>in service since 21st June, 2023</p>
                  <p>used for 401 hours</p>
                </CardContent>
              </div>
              <div className="flex justify-between items-end p-2  text-sm">
                <Edit className="w-5 h-5 text-muted-foreground" />
                <QrCode />
              </div>
            </div>
            <div className="w-4/12 flex items-center justify-center">
              <img src="rig.webp" />
            </div>
          </div>
        </Card>
        <Card className="col-span-6 p-4">
          <div className="flex">
            <div className="w-8/12 border-r pr-2 flex flex-col justify-between">
              <div>
                <CardHeader className=" p-2 ">
                  <CardTitle className="flex items-center justify-between gap-4 ">
                    <div className="flex items-center gap-4 ">Rig #2</div>
                    <div>
                      <Badge variant="">Busy</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 text-muted-foreground text-xs  pt-0">
                  <p>in service since 2nd April, 2021</p>
                  <p>used for 928 hours</p>
                </CardContent>
              </div>
              <div className="flex justify-between items-end p-2  text-sm">
                <Edit className="w-5 h-5 text-muted-foreground" />
                <QrCode />
              </div>
            </div>
            <div className="w-4/12 flex items-center justify-center">
              <img src="rig.webp" className="" />
            </div>
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
                Record <PlusCircle className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active</CardTitle>
                <CardDescription>Ongoing sessions on the rigs</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Rig</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Time Lapsed</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div>{invoice.customer.name}</div>

                          <div>{invoice.customer.contact}</div>
                        </TableCell>
                        <TableCell>{invoice.rig}</TableCell>
                        <TableCell>{invoice.startTime}</TableCell>
                        <TableCell>{invoice.timeLapsed}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="destructive">
                            End
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
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
    customer: {
      name: "Sajjan Raj Vaidya",
      contact: "986756788",
    },
    rig: "Rig#2",
    startTime: "11:00 AM",
    timeLapsed: "00:36",
  },
];

export default SimRacing;
