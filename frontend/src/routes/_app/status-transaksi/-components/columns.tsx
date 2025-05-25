import { TransactionOTA } from "@/api/generated";
import { formatFunding } from "@/lib/formatter";
import { censorNim } from "@/lib/nim";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";

export const transactionColumns: ColumnDef<TransactionOTA>[] = [
  {
    accessorKey: "id",
    header: () => <span className="text-dark font-bold">ID</span>,
  },
  {
    accessorKey: "name",
    header: () => <span className="text-dark font-bold">Nama Mahasiswa</span>,
    cell: ({ row }) => {
      const transaction = row.original;
      const isTotal = transaction.id === "total";

      return <p className={cn(isTotal && "font-bold")}>{transaction.name}</p>;
    },
  },
  {
    accessorKey: "nim",
    header: () => <span className="text-dark font-bold">NIM Mahasiswa</span>,
    cell: ({ row }) => {
      const transaction = row.original;
      const isTotal = transaction.id === "total";

      return (
        <p className={cn(isTotal && "font-bold")}>
          {isTotal ? "" : censorNim(transaction.nim)}
        </p>
      );
    },
  },
  {
    accessorKey: "bill",
    header: () => <span className="text-dark font-bold">Tagihan</span>,
    cell: ({ row }) => {
      const transaction = row.original;
      const isTotal = transaction.id === "total";

      return (
        <p className={cn(isTotal && "font-bold")}>
          {formatFunding(transaction.bill)}
        </p>
      );
    },
  },
];
