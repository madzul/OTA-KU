import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownAZ, ArrowUpAZ, Eye } from "lucide-react";

export type StatusType = "pending" | "unpaid" | "paid";
export type TransferStatusType = "unpaid" | "paid";

export interface TransaksiItem {
  id: string;
  mahasiswaId: string;
  otaId: string;
  namaMa: string;
  nimMa: string;
  namaOta: string;
  noTelpOta: string;
  tagihan: string;
  pembayaran: number;
  waktuBayar: string;
  status: StatusType;
  transferStatus: TransferStatusType;
  due_date: string;
  receipt?: string;
  createdAt: string;
  index: number;
}

export const tagihanColumns: ColumnDef<TransaksiItem>[] = [
  {
    accessorKey: "mahasiswaId",
    header: "ID Mahasiswa",
  },
  {
    accessorKey: "otaId",
    header: "ID OTA",
  },
  {
    accessorKey: "namaMa",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama (MA)
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-6 w-6" />
          ) : (
            <ArrowDownAZ className="ml-2 h-6 w-6" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "nimMa",
    header: "NIM (MA)",
  },
  {
    accessorKey: "namaOta",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama (OTA)
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-6 w-6" />
          ) : (
            <ArrowDownAZ className="ml-2 h-6 w-6" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "noTelpOta",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No. Telp (OTA)
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownAZ className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "tagihan",
    header: "Tagihan (Rp)",
  },
  {
    accessorKey: "pembayaran",
    header: "Pembayaran",
  },
  {
    accessorKey: "waktuBayar",
    header: "Waktu Bayar",
  },
  {
    accessorKey: "due_date",
    header: "Jatuh Tempo",
  },
  {
    accessorKey: "receipt",
    header: "Bukti",
    cell: ({ row }) => {
      const receipt = row.getValue("receipt") as string | undefined;

      if (receipt) {
        return (
          <a href={`${receipt}`} target="_blank" rel="noopener noreferrer">
            <Eye className="h-5 w-5 cursor-pointer text-blue-600" />
          </a>
        );
      }
      return null;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownAZ className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as StatusType;

      let statusText = "";
      let statusClass = "";

      switch (status) {
        case "paid":
          statusText = "Dibayar";
          statusClass =
            "bg-green-50 text-green-600 border border-green-300 rounded-full px-3 py-1 text-xs font-semibold";
          break;
        case "pending":
          statusText = "Pending";
          statusClass =
            "bg-yellow-50 text-yellow-600 border border-yellow-300 rounded-full px-3 py-1 text-xs font-semibold";
          break;
        case "unpaid":
          statusText = "Ditolak";
          statusClass =
            "bg-red-50 text-red-600 border border-red-300 rounded-full px-3 py-1 text-xs font-semibold";
          break;
      }

      return <span className={statusClass}>{statusText}</span>;
    },
  },
  {
    accessorKey: "aksi",
    header: "Aksi",
    cell: ({ row }) => {
      const index = row.original.index;
      const status = row.getValue("status") as StatusType;
      const namaOta = row.getValue("namaOta") as string;

      const isDisabled = status === "paid" || status === "unpaid";

      return (
        <Select
          value={status}
          onValueChange={(value: StatusType) => {
            // Trigger custom event to handle status change
            window.dispatchEvent(
              new CustomEvent("status-dropdown-change", {
                detail: {
                  index,
                  status: value as StatusType,
                  namaOta,
                },
              }),
            );
          }}
          disabled={isDisabled}
        >
          <SelectTrigger
            className={cn(
              "w-40",
              status === "paid"
                ? "border-green-300 bg-green-50 text-green-600"
                : status === "pending"
                  ? "border-yellow-300 bg-yellow-50 text-yellow-600"
                  : "border-red-300 bg-red-50 text-red-600",
              isDisabled && "cursor-not-allowed opacity-80",
            )}
          >
            <SelectValue placeholder="-">
              {status === "paid"
                ? "Dibayar"
                : status === "pending"
                  ? "Pending"
                  : "Ditolak"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unpaid">Belum Bayar</SelectItem>
            <SelectItem value="paid">Sudah Dibayar</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "transferStatus",
    header: "Status Transfer",
    cell: ({ row }) => {
      const index = row.original.index;
      const transferStatus =
        (row.getValue("transferStatus") as TransferStatusType) || "unpaid";
      const status = row.getValue("status") as StatusType;

      // Only enable transfer status change for paid transactions
      const isDisabled = status !== "paid";

      return (
        <Select
          value={transferStatus}
          onValueChange={(value: TransferStatusType) => {
            // Trigger custom event to handle transfer status change
            window.dispatchEvent(
              new CustomEvent("transfer-status-change", {
                detail: {
                  index,
                  transferStatus: value as TransferStatusType,
                  id: row.original.id,
                },
              }),
            );
          }}
          disabled={isDisabled}
        >
          <SelectTrigger
            className={cn(
              "w-40",
              transferStatus === "paid"
                ? "border-green-300 bg-green-50 text-green-600"
                : "border-orange-300 bg-orange-50 text-orange-600",
              isDisabled && "cursor-not-allowed opacity-80",
            )}
          >
            <SelectValue placeholder="-">
              {transferStatus === "paid" ? "Ditransfer" : "Belum Ditransfer"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unpaid">Belum Ditransfer</SelectItem>
            <SelectItem value="paid">Ditransfer</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
];
