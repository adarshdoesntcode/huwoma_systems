import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

import { Input } from "@/components/ui/input";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Loader2, Undo2 } from "lucide-react";

import {
  useDeleteCarwashTransactionMutation,
  useRollBackFromCompletedMutation,
  useRollBackFromPickupMutation,
} from "./carwashApiSlice";

import { toast } from "@/hooks/use-toast";

import CarwashTransactionDetails from "./CarwashTransactionDetails";
import { DataTablePagination } from "@/components/DataTablePagination";

export const CarwashDataTable = ({ columns, data }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showRollbackFromPickup, setShowRollbackFromPickup] = useState(false);
  const [showRollbackFromComplete, setShowRollbackFromComplete] =
    useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [rollBackId, setRollBackId] = useState(null);

  const [filter, setFilter] = useState("serviceTypeName");

  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <>
      <div className="items-center mb-4 space-x-2">
        <div className="flex items-center gap-2 space-x-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="serviceTypeName">Vehicle No</SelectItem>
              <SelectItem value="customer">Contact</SelectItem>
              <SelectItem value="billNo">Bill No</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Search.."
            type="tel"
            inputMode="numeric"
            autoComplete="off"
            value={table.getColumn(filter)?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn(filter)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      </div>
      <div className="bg-white border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <React.Fragment key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </React.Fragment>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => {
                    setTransactionDetails(row.original);
                    setShowDetails(true);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <React.Fragment key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </React.Fragment>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Transactions today.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="py-4 text-muted-foreground">
        <DataTablePagination table={table} />
      </div>
      <CarwashTransactionDetails
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        showDelete={showDelete}
        setShowDelete={setShowDelete}
        setDeleteId={setDeleteId}
        setTransactionDetails={setTransactionDetails}
        transactionDetails={transactionDetails}
        setShowRollbackFromComplete={setShowRollbackFromComplete}
        setShowRollbackFromPickup={setShowRollbackFromPickup}
        setRollBackId={setRollBackId}
      />
      <ConfirmDelete
        showDelete={showDelete}
        setShowDelete={setShowDelete}
        setDeleteId={setDeleteId}
        deleteId={deleteId}
      />
      <ConfirmRollbackFromPickup
        showRollbackFromPickup={showRollbackFromPickup}
        setShowRollbackFromPickup={setShowRollbackFromPickup}
        setRollBackId={setRollBackId}
        rollBackId={rollBackId}
      />
      <ConfirmRollbackFromComplete
        showRollbackFromComplete={showRollbackFromComplete}
        setShowRollbackFromComplete={setShowRollbackFromComplete}
        setRollBackId={setRollBackId}
        rollBackId={rollBackId}
      />
    </>
  );
};

function ConfirmDelete({ showDelete, setShowDelete, deleteId, setDeleteId }) {
  const [deleteCarwashTransaction, { isLoading }] =
    useDeleteCarwashTransactionMutation();

  const handleCloseDelete = () => {
    setShowDelete(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    try {
      if (!deleteId) return;
      const res = await deleteCarwashTransaction({
        id: deleteId,
      });

      if (res.error) {
        handleCloseDelete();
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        handleCloseDelete();
        toast({
          title: "Transaction Terminated!",
          description: "Successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.message,
      });
    }
  };
  return (
    <AlertDialog open={showDelete} onOpenChange={handleCloseDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will terminate this transaction
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {isLoading ? (
            <Button variant="destructive" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Terminating
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleDelete}>
              Terminate
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ConfirmRollbackFromPickup({
  showRollbackFromPickup,
  setShowRollbackFromPickup,
  rollBackId,
  setRollBackId,
}) {
  const [rollBackFromPickup, { isLoading }] = useRollBackFromPickupMutation();

  const handleCloseDelete = () => {
    setShowRollbackFromPickup(false);
    setRollBackId(null);
  };

  const handleRollbackFromPickup = async () => {
    try {
      if (!rollBackId) return;
      const res = await rollBackFromPickup({
        transactionId: rollBackId,
      });

      if (res.error) {
        handleCloseDelete();
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        handleCloseDelete();
        toast({
          title: "Transaction Rolled back",
          description: "to In Queue",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.message,
      });
    }
  };
  return (
    <AlertDialog open={showRollbackFromPickup} onOpenChange={handleCloseDelete}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to Rollback?</AlertDialogTitle>
          <AlertDialogDescription>
            This will rollback this transaction from Ready for Pickup to In
            Queue
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {isLoading ? (
            <Button variant="destructive" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Rolling back...
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleRollbackFromPickup}>
              Rollback <Undo2 className="ml-2 h-4 w-4" />
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ConfirmRollbackFromComplete({
  showRollbackFromComplete,
  setShowRollbackFromComplete,
  rollBackId,
  setRollBackId,
}) {
  const [rollBackFromCompleted, { isLoading }] =
    useRollBackFromCompletedMutation();

  const handleCloseDelete = () => {
    setShowRollbackFromComplete(false);
    setRollBackId(null);
  };

  const handleRollbackFromComplete = async () => {
    try {
      if (!rollBackId) return;
      const res = await rollBackFromCompleted({
        transactionId: rollBackId,
      });

      if (res.error) {
        handleCloseDelete();
        throw new Error(res.error.data.message);
      }

      if (!res.error) {
        handleCloseDelete();
        toast({
          title: "Transaction Rolled Back",
          description: "to Ready for Pickup",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!!",
        description: error.message,
      });
    }
  };
  return (
    <AlertDialog
      open={showRollbackFromComplete}
      onOpenChange={handleCloseDelete}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to Rollback?</AlertDialogTitle>
          <AlertDialogDescription>
            This will rollback this transaction from Completed to Ready for
            Pickup
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {isLoading ? (
            <Button variant="destructive" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Rolling back...
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleRollbackFromComplete}>
              Rollback <Undo2 className="ml-2 h-4 w-4" />
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
