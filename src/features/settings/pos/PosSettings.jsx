import { useState } from "react";
import { useGetPOSAccessQuery } from "../settingsApiSlice";
import Loader from "@/components/Loader";
import ApiError from "@/components/error/ApiError";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

function PosSettings() {
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data, isLoading, isSuccess, isError, error, isFetching } =
    useGetPOSAccessQuery();

  let content;

  if (isLoading || isFetching) {
    content = (
      <div className="py-4">
        <Loader />
      </div>
    );
  } else if (isSuccess) {
    if (!data) {
      content = (
        <div className="h-20 text-xs flex items-center justify-center text-muted-foreground">
          No POS Access
        </div>
      );
    } else {
      content = (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SN</TableHead>
                <TableHead>POS Name</TableHead>
                <TableHead>Code</TableHead>

                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((POSAccess, index) => {
                return (
                  <TableRow key={POSAccess._id}>
                    <TableCell className="p-1 pl-4 ">{index + 1}</TableCell>
                    <TableCell className="font-medium p-4 ">
                      {POSAccess.name}
                    </TableCell>
                    <TableCell>
                      <div className="pointer-events-none">
                        <InputOTP
                          maxLength={6}
                          value={POSAccess.accessCode.toString()}
                          disabled
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          // setSelectedPaymentMode(paymentMode);
                          setDeleteOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      );
    }
  } else if (isError) {
    content = (
      <div className="py-8">
        <ApiError error={error} />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>POS Access</CardTitle>
        <CardDescription>
          Configure payment modes for the system
        </CardDescription>
      </CardHeader>
      <CardContent className="py-0 overflow-auto">{content}</CardContent>
      <CardFooter className="border-t px-6 py-4 flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>Add Access</Button>
      </CardFooter>
    </Card>
  );
}

export default PosSettings;
