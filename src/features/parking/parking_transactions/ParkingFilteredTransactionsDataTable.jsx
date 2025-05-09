import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

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

import { File, Loader2 } from "lucide-react";

import { toast } from "@/hooks/use-toast";

// import CarwashTransactionDetails from "../CarwashTransactionDetails";
// import { useDeleteCarwashTransactionMutation } from "../carwashApiSlice";

import { Workbook } from "exceljs";
import { format } from "date-fns";
import { DataTableToolbar } from "@/components/DataTableToolbar";
import { DataTablePagination } from "@/components/DataTablePagination";
import ParkingTransactionDetails from "../ParkingTransactionDetails";

const exportExcel = (rows) => {
  try {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Transactions");

    const titleRow = worksheet.addRow(["Park N Wash by HUWOMA"]);
    titleRow.font = { bold: true, size: 14 };
    titleRow.alignment = { horizontal: "center" };

    worksheet.mergeCells(`A1:P1`);

    worksheet.addRow([]);

    worksheet.mergeCells(`A2:P2`);
    worksheet.columns = [
      { width: 25 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 18 },
      { width: 18 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 25 },
    ];

    worksheet.getRow(3).values = [
      "Initiated At",
      "Bill No",

      "Vehicle Type",
      "Vehicle No",
      "Transaction Status",
      "Payment Status",
      "Payment Mode",
      "Gross Amount",
      "Discount Amount",
      "Net Amount",
      "Payment Date",
    ];
    worksheet.getRow(3).font = { bold: true, size: 12 };
    worksheet.getRow(3).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    };

    const rowData = rows.map((row) => ({
      Initiated_At: row.original?.createdAt
        ? format(row.original?.createdAt, "d MMM, yyyy h:mm a")
        : "",
      Bill_No: row.original?.billNo || "",

      Vehicle_Type: row.original?.vehicle?.vehicleTypeName || "",
      Vehicle_No: row.original?.vehicleNumber || "",
      Transaction_Status: row.original?.transactionStatus || "",
      Payment_Status: row.original?.paymentStatus || "",
      Payment_Mode: row.original?.paymentMode?.paymentModeName || "",
      Gross_Amount: row.original?.grossAmount || 0,
      Discount_Amount: row.original?.discountAmount || 0,
      Net_Amount: row.original?.netAmount || 0,
      Payment_Date: row.original?.transactionTime
        ? format(row.original?.transactionTime, "d MMM, yyyy h:mm a")
        : "",
    }));

    rowData.forEach((row) => {
      worksheet.addRow([
        row.Initiated_At,
        row.Bill_No,

        row.Vehicle_Type,
        row.Vehicle_No,
        row.Transaction_Status,
        row.Payment_Status,
        row.Payment_Mode,
        row.Gross_Amount,
        row.Discount_Amount,
        row.Net_Amount,
        row.Payment_Date,
      ]);
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ParkingTransactions.xlsx";
      a.click();
    });
    toast({
      title: "Exported Successfully!!",
      description: "Check your downloads folder",
      duration: 2000,
    });
  } catch (e) {
    console.error(e);
    toast({
      variant: "destructive",
      title: "Something went wrong!!",
      description: "Could not download",
    });
  }
};

export const ParkingFilterTranasactionDataTable = ({ columns, data }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
  });

  return (
    <>
      <div className="flex justify-between items-center mb-4 space-x-2">
        <DataTableToolbar
          table={table}
          transactionOption={"parking"}
          defaultSearchSelection={"billNo"}
          searchOptions={[
            {
              value: "billNo",
              label: "Bill No",
            },
            {
              value: "vehicleNumber",
              label: "Vehicle No",
            },
          ]}
        />
        <div>
          <Button
            size="sm"
            variant="outline"
            className="h-10 gap-1 text-sm"
            onClick={() => exportExcel(table.getFilteredRowModel().rows)}
          >
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Export</span>
          </Button>
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
                  No Transactions.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="py-4 text-muted-foreground">
        <DataTablePagination table={table} />
      </div>
      <ParkingTransactionDetails
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        showDelete={showDelete}
        setShowDelete={setShowDelete}
        setDeleteId={setDeleteId}
        setTransactionDetails={setTransactionDetails}
        transactionDetails={transactionDetails}
        origin="transactions"
      />
    </>
  );
};
