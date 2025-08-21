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
import React, { useState } from "react";

import { File } from "lucide-react";

import { toast } from "@/hooks/use-toast";

import { Workbook } from "exceljs";
import { format } from "date-fns";
import { DataTableToolbar } from "@/components/DataTableToolbar";
import { DataTablePagination } from "@/components/DataTablePagination";
import { useNavigate } from "react-router-dom";

const exportExcel = (rows) => {
  try {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Transactions");

    const titleRow = worksheet.addRow(["Huwoma Garage"]);
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
      { width: 25 },
      { width: 25 },
      { width: 15 },
      { width: 25 },
      { width: 14 },
      { width: 14 },
      { width: 14 },
      { width: 18 },
      { width: 18 },
      { width: 35 },
    ];

    worksheet.getRow(3).values = [
      "ID",
      "Vehicle Number",
      "Vehicle Year",
      "Vehicle Maker",
      "Vehicle Model",
      "Seller Name",
      "Seller Contact",
      "Buyer Name",
      "Buyer Contact",
      "Transaction Status",
      "Asking Price",
      "Selling Price",
      "Commission Amount",
      "Payment Date",
    ];
    worksheet.getRow(3).font = { bold: true, size: 12 };
    worksheet.getRow(3).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    };

    const rowData = rows.map((row) => ({
      ID: row.original?._id,
      Vehicle_Number: row.original?.vehicle?.numberPlate || "",
      Vehicle_Year: row.original?.vehicle?.year || "",
      Vehicle_Maker: row.original?.vehicle?.make || "",
      Vehicle_Model: row.original?.vehicle?.model || "",
      Seller_Name: row.original?.vehicle?.seller?.name || "",
      Seller_Contact: row.original?.vehicle?.seller?.contactNumber || "",
      Buyer_Name: row.original?.buyer?.name || "",
      Buyer_Contact: row.original?.buyer?.contactNumber || "",
      Transaction_Status: row.original?.transactionStatus || "",
      Asking_Price: row.original?.vehicle?.askingPrice || 0,
      Selling_Price: row.original?.sellingPrice || 0,
      Commission_Amount: row.original?.commissionAmount || 0,
      Payment_Date: row.original?.transactionTime
        ? format(row.original?.transactionTime, "d MMM, yyyy h:mm a")
        : "",
    }));

    rowData.forEach((row) => {
      worksheet.addRow([
        row.ID,
        row.Vehicle_Number,
        row.Vehicle_Year,
        row.Vehicle_Maker,
        row.Vehicle_Model,
        row.Seller_Name,
        row.Seller_Contact,
        row.Buyer_Name,
        row.Buyer_Contact,
        row.Transaction_Status,
        row.Asking_Price,
        row.Selling_Price,
        row.Commission_Amount,
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
      a.download = "GarageTransactions.xlsx";
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

export const GarageTranasactionsDataTable = ({
  columns,
  data,
  defaultSearchSelection = "vehicle",
  transactionOption = "garage",
  searchOptions = [
    { value: "vehicle", label: "Vehicle Name" },
    { value: "buyer", label: "Buyer Name" },
    { value: "seller", label: "Seller Name" },
  ],
}) => {
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const navigate = useNavigate();

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
      <div className="flex items-center justify-between mb-4 space-x-2">
        <DataTableToolbar
          table={table}
          transactionOption={transactionOption}
          defaultSearchSelection={defaultSearchSelection}
          searchOptions={searchOptions}
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
                  className="hover:bg-white"
                >
                  {row.getVisibleCells().map((cell) => (
                    <React.Fragment key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext({ navigate })
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
    </>
  );
};
