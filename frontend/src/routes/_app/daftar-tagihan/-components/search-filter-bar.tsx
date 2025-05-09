"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  yearValue?: string;
  onYearChange?: (value: string) => void;
  monthValue?: string;
  onMonthChange?: (value: string) => void;
  statusValue?: string;
  onStatusChange?: (value: string) => void;
}

export function SearchFilterBar({
  searchValue,
  onSearchChange,
  yearValue,
  onYearChange,
  monthValue,
  onMonthChange,
  statusValue,
  onStatusChange,
}: SearchFilterBarProps) {
  // Generate years (current year and 4 years back)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Months in English - make sure values match exactly with API's expected format
  const months = [
    { value: "January", label: "Januari" },
    { value: "February", label: "Februari" },
    { value: "March", label: "Maret" },
    { value: "April", label: "April" },
    { value: "May", label: "Mei" },
    { value: "June", label: "Juni" },
    { value: "July", label: "Juli" },
    { value: "August", label: "Agustus" },
    { value: "September", label: "September" },
    { value: "October", label: "Oktober" },
    { value: "November", label: "November" },
    { value: "December", label: "Desember" },
  ] as const;

  // Status options
  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "unpaid", label: "Belum Bayar" },
    { value: "pending", label: "Pending" },
  ];

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          className="border-gray-300 py-6 pl-10"
          placeholder="Cari nama orang tua atau mahasiswa"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Select value={yearValue} onValueChange={onYearChange}>
        <SelectTrigger className="w-[130px] bg-white">
          <SelectValue placeholder="Tahun" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Tahun</SelectItem>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={monthValue} onValueChange={onMonthChange}>
        <SelectTrigger className="w-[130px] bg-white">
          <SelectValue placeholder="Bulan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Bulan</SelectItem>
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {onStatusChange && (
        <Select value={statusValue} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
