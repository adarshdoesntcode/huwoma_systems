import { DataTablePagination } from "@/components/DataTablePagination";
import CarwashTransactionDetails from "../carwash/CarwashTransactionDetails";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTableFacetedFilter } from "@/components/DataTableFacetedFilter";
import { Dot } from "lucide-react";
import ConfirmRollbackFromComplete from "../carwash/transaction_mutation/ConfirmRollbackFromComplete";
import ParkingTransactionDetails from "../parking/ParkingTransactionDetails";
import SimRacingTransactionDetails from "../simracing/SimRacingTransactionDetails";

export const DashboardTransactionsDataTable = ({
  columns,
  data,
  origin = "carwash",
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDetailsSim, setShowDetailsSim] = useState(false);
  const [showDetailsPark, setShowDetailsPark] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showRollbackFromPickup, setShowRollbackFromPickup] = useState(false);
  const [showRollbackFromComplete, setShowRollbackFromComplete] =
    useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [rollBackId, setRollBackId] = useState(null);
  const [filter, setFilter] = useState("serviceTypeName");
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
        pageSize: 7, // Set your initial page size here
      },
    },
  });

  const handleTransactionDetail = (row) => {
    const billNo = row.original?.billNo;
    console.log("🚀 ~ handleTransactionDetail ~ billNo:", billNo);
    const type = billNo.endsWith("W")
      ? "Carwash"
      : billNo.endsWith("R")
      ? "Simracing"
      : billNo.endsWith("P")
      ? "Parking"
      : "Unknown";
    if (type === "Carwash") {
      setTransactionDetails(row.original);
      setShowDetails(true);
    } else if (type === "Simracing") {
      setTransactionDetails(row.original);
      setShowDetailsSim(true);
    } else if (type === "Parking") {
      setTransactionDetails(row.original);
      setShowDetailsPark(true);
    } else {
      return;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 ">
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
        <div className="hidden sm:block">
          <DataTableFacetedFilter
            options={[
              {
                value: "Carwash",
                label: "Carwash",
                icon: Dot,
              },

              {
                value: "Simracing",
                label: "Simracing",
                icon: Dot,
              },
              {
                value: "Parking",
                label: "Parking",
                icon: Dot,
              },
            ]}
            column={table.getColumn("type")}
            title="Type"
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
                    handleTransactionDetail(row);
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
        <DataTablePagination table={table} sizes={[5, 7, 10, 15, 20, 50]} />
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
        origin={"carwash"}
      />
      <ConfirmRollbackFromComplete
        showRollbackFromComplete={showRollbackFromComplete}
        setShowRollbackFromComplete={setShowRollbackFromComplete}
        setRollBackId={setRollBackId}
        rollBackId={rollBackId}
        origin={"carwash"}
      />

      <ParkingTransactionDetails
        showDetails={showDetailsPark}
        setShowDetails={setShowDetailsPark}
        setTransactionDetails={setTransactionDetails}
        transactionDetails={transactionDetails}
        origin={"parking"}
      />
      <SimRacingTransactionDetails
        showDetails={showDetailsSim}
        setShowDetails={setShowDetailsSim}
        setTransactionDetails={setTransactionDetails}
        transactionDetails={transactionDetails}
        origin={"simracing"}
      />
    </>
  );
};
