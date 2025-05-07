import { TableCell, TableRow } from '@/components/ui/table';

export const TableSkeleton = ({ columns = 4, rows = 5 }: { columns?: number; rows?: number }) => {
  return Array(rows)
    .fill(0)
    .map((_, rowIndex) => (
      <TableRow key={`skeleton-row-${rowIndex}`}>
        {Array(columns)
          .fill(0)
          .map((_, colIndex) => (
            <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
              <div className="h-5 w-full rounded-md bg-gray-200 animate-pulse" />
            </TableCell>
          ))}
      </TableRow>
    ));
};
