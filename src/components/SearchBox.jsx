import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

export default function SearchBox({
  placeholder = "Search...",
  className,
  value,
  setValue,
}) {
  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-8"
        aria-label="Search"
      />
      {value && (
        <X
          className="absolute w-4 h-4 -translate-y-1/2 cursor-pointer right-3 top-1/2 text-muted-foreground"
          onClick={() => setValue("")}
        />
      )}
    </div>
  );
}
