import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { TableHead } from "./ui/table";

export function DataTableColumnHeader({
  column,
  title,
  className,
  buttonClass,
}) {
  if (!column.getCanSort()) {
    return <TableHead className={cn(className)}>{title}</TableHead>;
  }

  return (
    <TableHead className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              " data-[state=open]:bg-accent flex items-center ",
              buttonClass
            )}
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70 ml-2" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70 ml-2" />
            ) : (
              <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/70 ml-2" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70 mr-2" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70 mr-2" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70 mr-2" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableHead>
  );
}
