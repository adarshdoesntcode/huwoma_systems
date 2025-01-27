import { DataTableColumnHeader } from "@/components/DataTableColumnHeader";
import { TableCell, TableHead } from "@/components/ui/table";
import { format } from "date-fns";
import RaceTimeLapsed from "./RaceTimeLapsed";
import StatusBadge from "@/components/ui/StatusBadge";
import RaceRigChange from "./RaceRigChange";

export const SimRacingColumn = (
  isFetching,
  isMutating,
  setIsMutating,
  mutatingId,
  setMutatingId,
  changeRigId,
  setChangeRigId,
  rigs
) => [
  {
    accessorKey: "billNo",
    header: () => (
      <TableHead className="hidden lg:table-cell">Bill No</TableHead>
    ),
    cell: ({ row }) => {
      return (
        <TableCell className="text-muted-foreground hidden lg:table-cell">
          {row.original.billNo}
        </TableCell>
      );
    },
  },

  {
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Customer"
        className={"px-1"}
      />
    ),
    cell: ({ row }) => {
      const customer = row.original.customer;
      const date = format(new Date(row.original.createdAt), "d MMM, h:mm a");

      return (
        <TableCell className=" border-t px-4 py-1 sm:py-1 sm:px-4">
          <div className="flex flex-col   items-start">
            <div className="font-medium text-sm">{customer.customerName}</div>
            <div className="text-xs text-muted-foreground">
              {customer.customerContact}
            </div>
          </div>
          <div className="text-xs block md:hidden">Started: {date}</div>
        </TableCell>
      );
    },
    filterFn: (row, _, filterValue) => {
      return row.original.customer.customerContact
        .toString()
        .includes(filterValue);
    },
    sortingFn: (a, b) => {
      const nameA = a.original.customer?.customerName?.toLowerCase() || "";
      const nameB = b.original.customer?.customerName?.toLowerCase() || "";
      return nameA.localeCompare(nameB);
    },
  },

  {
    accessorKey: "rigName",
    header: () => <TableHead className="hidden  lg:table-cell">Rig</TableHead>,
    cell: ({ row }) => {
      return (
        <TableCell className="hidden  lg:table-cell">
          <RaceRigChange
            rigs={rigs}
            currentRig={row.original.rig._id}
            transaction={row.original._id}
            isFetching={isFetching}
            isMutating={isMutating}
            setIsMutating={setIsMutating}
            showLoader={changeRigId === row.original._id ? true : false}
            setChangeRigId={setChangeRigId}
          />
        </TableCell>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      let header = "Start Time";

      return (
        <DataTableColumnHeader
          column={column}
          title={header}
          className="hidden xl:table-cell px-1"
        />
      );
    },
    cell: ({ row }) => {
      let date = format(new Date(row.original.start), "d MMM, yyyy");
      let time = format(new Date(row.original.start), "h:mm a");

      return (
        <TableCell className="hidden  xl:table-cell ">
          <div className="flex flex-col items-start text-center">
            <span className="font-medium ">{time}</span>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
        </TableCell>
      );
    },
  },
  {
    accessorKey: "transactionStatus",
    header: () => (
      <TableHead className="hidden lg:table-cell">Status</TableHead>
    ),
    cell: ({ row }) => {
      const status = row.original.transactionStatus;

      return (
        <TableCell className="hidden lg:table-cell">
          <StatusBadge status={status} />
        </TableCell>
      );
    },
  },
  {
    accessorKey: "timeLapsed",
    header: () => (
      <TableHead className="hidden md:table-cell text-center">
        Time Lapsed
      </TableHead>
    ),
    cell: ({ row }) => {
      const start = new Date(row.original.start);

      return (
        <TableCell className="hidden md:table-cell  font-mono">
          <div className="flex items-center justify-center">
            <RaceTimeLapsed
              start={start}
              transactionId={row.original._id}
              pauseHistory={row.original.pauseHistory}
              isPaused={
                row.original.transactionStatus === "Paused" ? true : false
              }
              isFetching={isFetching}
              isMutating={isMutating}
              setIsMutating={setIsMutating}
              showLoader={mutatingId === row.original._id ? true : false}
              setMutatingId={setMutatingId}
            />
          </div>
        </TableCell>
      );
    },
  },
];
