import { TableCell } from "@/components/ui/table";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TransferCarwashTransaction from "./TransferCarwashTransaction";
import { EllipsisVertical } from "lucide-react";
function ActionCell({ row }) {
  const [open, setOpen] = useState(false);

  return (
    <TableCell className="flex items-center justify-center h-full p-0">
      <div
        className="p-4"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <EllipsisVertical className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Action</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOpen(true)}>
              Transfer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <TransferCarwashTransaction
          open={open}
          onOpenChange={setOpen}
          selectedTransaction={row.original}
        />
      </div>
    </TableCell>
  );
}

export default ActionCell;
