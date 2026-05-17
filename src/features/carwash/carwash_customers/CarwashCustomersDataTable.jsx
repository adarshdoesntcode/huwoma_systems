import {
  flexRender,
  getCoreRowModel,
  useReactTable,
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
import React from "react";

import { Input } from "@/components/ui/input";

import { File, Loader2 } from "lucide-react";

import { toast } from "@/hooks/use-toast";

import { useNavigate } from "react-router-dom";
import { DataTablePagination } from "@/components/DataTablePagination";
import { useExportCarwashCustomersMutation } from "../carwashApiSlice";
import {
  downloadBlob,
  getFilenameFromDisposition,
} from "@/lib/download/downloadBlob";

export const CarwashCustomersDataTable = ({
  columns,
  data,
  filter,
  search,
  sorting,
  pagination,
  paginationMetadata,
  isFetching,
  queryParams,
  onFilterChange,
  onSearchChange,
  onSortingChange,
  onPaginationChange,
}) => {
  const navigate = useNavigate();
  const [exportCarwashCustomers, { isLoading: isExporting }] =
    useExportCarwashCustomersMutation();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.max(paginationMetadata?.totalPages || 1, 1),
    onPaginationChange,
    onSortingChange,
    state: {
      sorting,
      pagination,
    },
    meta: {
      rowNumberOffset:
        ((paginationMetadata?.page || 1) - 1) *
        (paginationMetadata?.limit || pagination.pageSize),
    },
  });

  const handleExport = async () => {
    try {
      const { page, limit, ...exportParams } = queryParams;
      const exportResult = await exportCarwashCustomers(exportParams).unwrap();
      const filename = getFilenameFromDisposition(
        exportResult.contentDisposition,
        "ParkNWashCustomers.xlsx"
      );

      downloadBlob(exportResult.blob, filename);
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

  return (
    <>
      <div className="flex justify-between items-center mb-4 space-x-2">
        <div className="flex items-center gap-2 space-x-2">
          <Select
            value={filter}
            onValueChange={(value) => {
              onFilterChange(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customerContact">Contact</SelectItem>
              <SelectItem value="customerVehicles">Vehicle</SelectItem>
              <SelectItem value="customerName">Name</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Search.."
            type={filter === "customerContact" ? "tel" : "text"}
            autoComplete="off"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <div>
          <Button
            size="sm"
            variant="outline"
            className="h-10 gap-1 text-sm"
            disabled={isExporting}
            onClick={handleExport}
          >
            {isExporting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <File className="h-3.5 w-3.5" />
            )}
            <span className="sr-only sm:not-sr-only">
              {isExporting ? "Exporting" : "Export"}
            </span>
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
                    navigate(`/carwash/customers/${row.original._id}`);
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
        <DataTablePagination
          table={table}
          totalRows={paginationMetadata?.total || 0}
          isFetching={isFetching}
        />
      </div>
    </>
  );
};
