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

import { Edit, Loader2, Undo2 } from "lucide-react";

import {
  useDeleteCarwashTransactionMutation,
  useRollBackFromCompletedMutation,
  useRollBackFromPickupMutation,
} from "./carwashApiSlice";

import { toast } from "@/hooks/use-toast";

import CarwashTransactionDetails from "./CarwashTransactionDetails";
import { DataTablePagination } from "@/components/DataTablePagination";
import { useNavigate } from "react-router-dom";
import ConfirmRollbackFromComplete from "./transaction_mutation/ConfirmRollbackFromComplete";
import ConfirmRollbackFromPickup from "./transaction_mutation/ConfirmRollbackFromPickup";
import ConfirmDelete from "./transaction_mutation/ConfirmDelete";
import EditCarwashTransaction from "./transaction_mutation/EditCarwashTransaction";

export const CarwashDataTable = ({ columns, data, origin = "carwash" }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
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
                <TableHead className="hidden sm:table-cell"></TableHead>
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

                  <TableCell className="  text-center max-w-10 px-0 pr-4 sm:max-w-12">
                    <Edit
                      onClick={(e) => {
                        e.stopPropagation();
                        setTransactionDetails(row.original);
                        setShowEdit(true);
                      }}
                      className="h-4 w-4 cursor-pointer  text-muted-foreground hover:text-primary  hover:scale-110 transition-all"
                    />
                  </TableCell>
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
        origin={origin}
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
        origin={origin}
      />
      <ConfirmRollbackFromComplete
        showRollbackFromComplete={showRollbackFromComplete}
        setShowRollbackFromComplete={setShowRollbackFromComplete}
        setRollBackId={setRollBackId}
        rollBackId={rollBackId}
        origin={origin}
      />
      <EditCarwashTransaction
        showEdit={showEdit}
        setShowEdit={setShowEdit}
        transactionDetails={transactionDetails}
        setTransactionDetails={setTransactionDetails}
      />
    </>
  );
};
