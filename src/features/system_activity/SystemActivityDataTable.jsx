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
import { cn } from "@/lib/utils";
import { SystemActivityDataTableToolbar } from "./SystemActivityDataTableToolbar";
import { isMobile } from "react-device-detect";

const activityColors = {
  Rollback: "text-orange-600 !bg-orange-50", // A safe action, using blue for stability.
  Booking: "text-purple-600 !bg-purple-50", // Positive action, green signifies success.
  Create: "text-emerald-600 !bg-emerald-50", // Constructive action, emerald for creation.
  Logout: "text-muted-foreground",
  "Start Race": "text-blue-600 !bg-blue-50", // Technical, indigo for innovation.

  Update: "text-yellow-600 !bg-yellow-50", // Informative, yellow for updates or changes.
  Cancelled: "text-red-600 !bg-red-50", // Negative, red to signify cancellation.
  Delete: "text-red-600 !bg-red-50", // Critical, rose for destructive actions.
};

const exportExcel = (rows) => {
  try {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("System_Activity");

    const titleRow = worksheet.addRow(["System_Activity"]);
    titleRow.font = { bold: true, size: 14 };
    titleRow.alignment = { horizontal: "center" };

    worksheet.mergeCells(`A1:D1`);

    worksheet.addRow([]);

    worksheet.mergeCells(`A2:P2`);
    worksheet.columns = [
      { width: 25 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 70 },
      { width: 115 },
      { width: 25 },
    ];

    worksheet.getRow(3).values = [
      "Time",
      "Actor",
      "Login",
      "Module",
      "Message",
      "Agent",
      "IP",
    ];
    worksheet.getRow(3).font = { bold: true, size: 12 };
    worksheet.getRow(3).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    };

    const rowData = rows.map((row, index) => ({
      Time: row.original?.activityDate
        ? format(row.original.activityDate, "MMM dd, yy hh:mm:ss ")
        : "",
      Actor: row.original?.activityBy?.fullname || "",
      Activity: row.original?.activityType || "",
      Module: row?.original?.systemModule || "",
      Message: row.original?.description || "",
      Agent: row.original?.userAgent || "",
      IP: row.original?.activityIpAddress || "",
    }));

    rowData.forEach((row) => {
      worksheet.addRow([
        row.Time,
        row.Actor,
        row.Activity,
        row.Module,
        row.Message,
        row.Agent,
        row.IP,
      ]);
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "System_Activity.xlsx";
      a.click();
    });
    toast({
      title: "Exported Successfully!!",
      description: "Check your downloads folder",
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

export const SystemActivityDataTable = ({ columns, data }) => {
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
    initialState: {
      pagination: {
        pageSize: 50, // Set your initial page size here
      },
    },
  });

  return (
    <>
      <div className="flex justify-between items-center mb-4 space-x-2">
        <SystemActivityDataTableToolbar table={table} />

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
      <div className="bg-white border rounded-md font-mono tracking-tighter">
        {isMobile && (
          <p className="text-center p-4 text-muted-foreground text-xs">
            Information reduced in a mobile screen
          </p>
        )}
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
                  className={cn(
                    "cursor-pointer odd:bg-muted/60    border-none  ",
                    activityColors[row.original.activityType] ??
                      "text-secondary-foreground/70"
                  )}
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
                  No Activities.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="py-4 text-muted-foreground">
        <div>
          <DataTablePagination
            table={table}
            sizes={[50, 100, 150, 200, 300, 400]}
          />
        </div>
      </div>
    </>
  );
};
