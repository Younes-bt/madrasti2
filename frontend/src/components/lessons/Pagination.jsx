import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export function Pagination({ currentPage, totalPages, onPageChange, isRTL }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisiblePages = 5;

  // Calculate which pages to show
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust start if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="gap-1"
      >
        <PrevIcon className="w-4 h-4" />
        <span className="hidden sm:inline">{isRTL ? 'التالي' : 'Previous'}</span>
      </Button>

      {/* First page + ellipsis */}
      {startPage > 1 && (
        <>
          <Button
            variant={1 === currentPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(1)}
            className="min-w-[40px]"
          >
            1
          </Button>
          {startPage > 2 && (
            <span className="px-2 text-neutral-500">...</span>
          )}
        </>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(page)}
          className="min-w-[40px]"
        >
          {page}
        </Button>
      ))}

      {/* Ellipsis + last page */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="px-2 text-neutral-500">...</span>
          )}
          <Button
            variant={totalPages === currentPage ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="min-w-[40px]"
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="gap-1"
      >
        <span className="hidden sm:inline">{isRTL ? 'السابق' : 'Next'}</span>
        <NextIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}
