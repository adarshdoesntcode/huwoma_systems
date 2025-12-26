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
import { File } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Workbook } from "exceljs";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { DataTablePagination } from "@/components/DataTablePagination";

const exportExcel = (rows) => {
  try {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Customers");

    const titleRow = worksheet.addRow(["Huwoma Car Garage"]);
    titleRow.font = { bold: true, size: 14 };
    titleRow.alignment = { horizontal: "center" };

    worksheet.mergeCells(`A1:D1`);

    worksheet.addRow([]);

    worksheet.mergeCells(`A2:P2`);
    worksheet.columns = [{ width: 25 }, { width: 15 }, { width: 25 }];

    worksheet.getRow(3).values = ["Customer", "Contact", "Customer Since"];
    worksheet.getRow(3).font = { bold: true, size: 12 };
    worksheet.getRow(3).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    };

    const rowData = rows.map((row, index) => ({
      Customer_Name: row.original?.name || "",
      Customer_Contact: row.original?.contactNumber || "",
      Customer_Since: row.original?.createdAt
        ? format(row.original?.createdAt, "MMMM d, yyyy")
        : "",
    }));

    rowData.forEach((row) => {
      worksheet.addRow([
        row.Customer_Name,
        row.Customer_Contact,
        row.Customer_Since,
      ]);
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "GarageCustomers.xlsx";
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

export const GarageCustomersDataTable = ({ columns, data }) => {
  const [filter, setFilter] = useState("contactNumber");
  const [sorting, setSorting] = useState([]);
  const navigate = useNavigate();

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
      <div className="flex items-center justify-between mb-4 space-x-2">
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
              <SelectItem value="contactNumber">Contact</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Search.."
            type={filter === "contactNumber" ? "tel" : "text"}
            autoComplete="off"
            value={table.getColumn(filter)?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn(filter)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
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
                    navigate(`/garage/customers/${row.original._id}`);
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
                  No Customers.
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
