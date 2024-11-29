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
  TableHead,
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

import { Loader2 } from "lucide-react";

import { toast } from "@/hooks/use-toast";

import { useNavigate } from "react-router-dom";
import { DataTablePagination } from "@/components/DataTablePagination";

import { useCancelRaceMutation } from "../simracing/simRacingApiSlice";
import { useCancelParkingMutation } from "./parkingApiSlice";

export const ParkingDataTable = ({ columns, data }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const [filter, setFilter] = useState("vehicleNumber");

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
          <Select
            value={filter}
            onValueChange={(value) => {
              setFilter(value);
              table.resetColumnFilters();
              table.resetSorting();
              table.resetColumnVisibility();
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vehicleNumber">Vehicle No</SelectItem>
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
                {table.getRowModel().rows?.length > 0 && (
                  <TableHead className="text-center">Action</TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-inherit"
                >
                  {row.getVisibleCells().map((cell) => (
                    <React.Fragment key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </React.Fragment>
                  ))}
                  <TableCell className="text-center border-t px-4 py-2 sm:py-1 sm:px-4">
                    <div className="flex gap-2  justify-center flex-col sm:flex-row">
                      <Button
                        size="sm"
                        variant="outline"
                        title="Cancel Race"
                        className="h-9 text-xs order-2 sm:order-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDelete(true);
                          setDeleteId(row.original._id);
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        size="sm"
                        className="h-9 text-xs order-1 sm:order-2"
                        title="Finish Race"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/parking/checkout/${row.original._id}`);
                        }}
                      >
                        Finish
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Parkings
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="py-4 text-muted-foreground">
        <DataTablePagination table={table} />
      </div>

      <ConfirmDelete
        showDelete={showDelete}
        setShowDelete={setShowDelete}
        setDeleteId={setDeleteId}
        deleteId={deleteId}
      />
    </>
  );
};

function ConfirmDelete({ showDelete, setShowDelete, deleteId, setDeleteId }) {
  const [cancelParking, { isLoading }] = useCancelParkingMutation();

  const handleCloseDelete = () => {
    setShowDelete(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    try {
      if (!deleteId) return;
      const res = await cancelParking(deleteId);
      if (res.error) {
        handleCloseDelete();
        throw new Error(res.error.data.message);
      }
      if (!res.error) {
        handleCloseDelete();
        toast({
          title: "Parking Cancelled!",
          description: "Successfully",
          duration: 2000,
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
          <AlertDialogTitle>
            Do you want to terminate this parking ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will terminate this parking
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
