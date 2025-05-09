"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDownIcon as ChevronUpDown,
  Eye,
} from "lucide-react";
import { useState } from "react";

export type StatusType = "pending" | "unpaid" | "paid";
export type SortDirection = "asc" | "desc" | null;
export type SortColumn = "namaMa" | "namaOta" | null;

export interface TransaksiItem {
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
  due_date: string; // Added date field for filtering
  receipt?: string; // URL to receipt document
}

interface DaftarTransaksiTableProps {
  data: TransaksiItem[];
  onStatusChange?: (index: number, status: StatusType) => void;
  onFileClick?: (index: number) => void;
}

export function DaftarTransaksiTable({
  data,
  onStatusChange,
}: DaftarTransaksiTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Function to handle sort click
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      // New column, start with ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Function to get status color class
  const getStatusColorClass = (status: StatusType) => {
    switch (status) {
      case "paid":
        return "bg-green-50 text-green-600 border-green-300";
      case "pending":
        return "bg-yellow-50 text-yellow-600 border-yellow-300";
      case "unpaid":
        return "bg-red-50 text-red-600 border-red-300";
      default:
        return "border-gray-300";
    }
  };

  // Function to get status display text
  const getStatusDisplayText = (status: StatusType) => {
    switch (status) {
      case "paid":
        return "Dibayar";
      case "pending":
        return "Pending";
      case "unpaid":
        return "Ditolak";
      default:
        return "-";
    }
  };

  // Sort the data
  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    const valueA = a[sortColumn].toLowerCase();
    const valueB = b[sortColumn].toLowerCase();

    if (sortDirection === "asc") {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });

  // Function to render sort icon
  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ChevronUpDown className="ml-1 inline-block h-4 w-4" />;
    }

    if (sortDirection === "asc") {
      return <ArrowUp className="ml-1 inline-block h-4 w-4" />;
    } else if (sortDirection === "desc") {
      return <ArrowDown className="ml-1 inline-block h-4 w-4" />;
    }

    return <ChevronUpDown className="ml-1 inline-block h-4 w-4" />;
  };

  // Check if status is disabled (for accepted or rejected items)
  const isStatusDisabled = (status: StatusType) => {
    return status === "paid" || status === "unpaid";
  };

  const renderFileIcon = (item: TransaksiItem) => {
    if (item.receipt) {
      return (
        <a href={`//${item.receipt}`} target="_blank" rel="noopener noreferrer">
          <Eye className="h-5 w-5 cursor-pointer text-blue-600" />
        </a>
      );
    }
    return null;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1200px] border-collapse">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th
              className={cn(
                "cursor-pointer px-2 py-3 font-medium whitespace-nowrap",
                sortColumn === "namaMa" && "text-blue-900",
              )}
              onClick={() => handleSort("namaMa")}
            >
              <span className="flex items-center">
                Nama (MA)
                <span
                  className={cn(
                    "ml-1",
                    sortColumn === "namaMa" && "text-blue-900",
                  )}
                >
                  {renderSortIcon("namaMa")}
                </span>
              </span>
            </th>
            <th className="px-2 py-3 font-medium whitespace-nowrap">
              NIM (MA)
            </th>
            <th
              className={cn(
                "cursor-pointer px-2 py-3 font-medium whitespace-nowrap",
                sortColumn === "namaOta" && "text-blue-900",
              )}
              onClick={() => handleSort("namaOta")}
            >
              <span className="flex items-center">
                Nama (OTA)
                <span
                  className={cn(
                    "ml-1",
                    sortColumn === "namaOta" && "text-blue-900",
                  )}
                >
                  {renderSortIcon("namaOta")}
                </span>
              </span>
            </th>
            <th className="px-2 py-3 font-medium whitespace-nowrap">
              No. Telp (OTA)
            </th>
            <th className="px-2 py-3 font-medium whitespace-nowrap">
              Tagihan (Rp)
            </th>
            <th className="px-2 py-3 font-medium whitespace-nowrap">
              Pembayaran
            </th>
            <th className="px-2 py-3 font-medium whitespace-nowrap">
              Waktu Bayar
            </th>
            <th className="px-2 py-3 font-medium whitespace-nowrap">
              Jatuh Tempo
            </th>
            <th className="px-2 py-3 font-medium whitespace-nowrap">Bukti</th>
            <th className="px-2 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={10} className="py-8 text-center text-gray-500">
                Tidak ada data yang tersedia
              </td>
            </tr>
          ) : (
            sortedData.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-2 py-4 whitespace-nowrap">{item.namaMa}</td>
                <td className="px-2 py-4 whitespace-nowrap">{item.nimMa}</td>
                <td className="px-2 py-4 whitespace-nowrap">{item.namaOta}</td>
                <td className="px-2 py-4 whitespace-nowrap">
                  {item.noTelpOta}
                </td>
                <td className="px-2 py-4 whitespace-nowrap">{item.tagihan}</td>
                <td className="px-2 py-4 whitespace-nowrap">
                  {item.pembayaran}
                </td>
                <td className="px-2 py-4 whitespace-nowrap">
                  {item.waktuBayar}
                </td>
                <td className="px-2 py-4 whitespace-nowrap">{item.due_date}</td>
                <td className="px-2 py-4 whitespace-nowrap">
                  {renderFileIcon(item)}
                </td>
                <td className="px-2 py-4">
                  <Select
                    value={item.status}
                    onValueChange={(value: StatusType) =>
                      onStatusChange &&
                      onStatusChange(index, value as StatusType)
                    }
                    disabled={isStatusDisabled(item.status)}
                  >
                    <SelectTrigger
                      className={cn(
                        "w-32",
                        getStatusColorClass(item.status),
                        isStatusDisabled(item.status) &&
                          "cursor-not-allowed opacity-80",
                      )}
                    >
                      <SelectValue placeholder="-">
                        {getStatusDisplayText(item.status)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unpaid">Belum Bayar</SelectItem>
                      <SelectItem value="paid">Sudah Dibayar</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
