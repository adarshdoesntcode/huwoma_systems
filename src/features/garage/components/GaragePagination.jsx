import { CardFooter } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function GaragePagination({
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalPages,
}) {
  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <PaginationItem key={i} className="hidden md:block">
            <PaginationLink
              onClick={() => handlePageClick(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <PaginationItem key={`ellipsis-${i}`} className="hidden md:block">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages)
      setCurrentPage(page);
  };
  return (
    <CardFooter className="px-4 py-2 bg-white border-t rounded-b-lg  sm:p-6 sm:py-4">
      <div className="flex items-center justify-between w-full gap-2">
        <Select value={pageSize} onValueChange={setPageSize}>
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-[70px]">
            <SelectItem value="6">6</SelectItem>
            <SelectItem value="9">9</SelectItem>
            <SelectItem value="18">18</SelectItem>
            <SelectItem value="27">27</SelectItem>
            <SelectItem value="36">36</SelectItem>
          </SelectContent>
        </Select>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {/* Desktop Pagination Numbers */}
            {renderPageNumbers()}
            {/* Mobile-only current page */}
            <PaginationItem className="block px-3 py-1 text-sm md:hidden">
              Page {currentPage} of {totalPages}
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </CardFooter>
  );
}

export default GaragePagination;
