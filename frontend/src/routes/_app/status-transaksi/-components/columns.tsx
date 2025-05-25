import { TransactionOTA } from "@/api/generated";
import { Button } from "@/components/ui/button";
import { formatFunding } from "@/lib/formatter";
import { censorNim } from "@/lib/nim";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";

export const transactionColumns: ColumnDef<TransactionOTA>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Mahasiswa
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-6 w-6" />
          ) : (
            <ArrowDownAZ className="ml-2 h-6 w-6" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const transaction = row.original;
      const isTotal = transaction.id === "total";

      return <p className={isTotal ? "font-bold" : ""}>{transaction.name}</p>;
    },
  },
  {
    accessorKey: "nim",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          NIM Mahasiswa
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-6 w-6" />
          ) : (
            <ArrowDownAZ className="ml-2 h-6 w-6" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const transaction = row.original;
      const isTotal = transaction.id === "total";

      return (
        <p className={isTotal ? "font-bold" : ""}>
          {isTotal ? "" : censorNim(transaction.nim)}
        </p>
      );
    },
  },
  {
    accessorKey: "bill",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tagihan
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-6 w-6" />
          ) : (
            <ArrowDownAZ className="ml-2 h-6 w-6" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const transaction = row.original;
      const isTotal = transaction.id === "total";

      return (
        <p className={isTotal ? "font-bold" : ""}>
          {formatFunding(transaction.bill)}
        </p>
      );
    },
  },
];
