import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const years = ["2023", "2024", "2025", "2026"];

interface StatusTransaksiFilterProps {
  onFilterChange: (filters: { year: string; month: string; }) => void;
}

export default function StatusTransaksiFilter({ onFilterChange }: StatusTransaksiFilterProps) {
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedMonth, setSelectedMonth] = useState<string>("May");
  
  // Use the state directly in the handlers
  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    onFilterChange({
      year: value,
      month: selectedMonth
    });
  };
  
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    onFilterChange({
      year: selectedYear,
      month: value
    });
  };
  
  // Call onFilterChange once on initial render to set initial filters
  useEffect(() => {
    onFilterChange({
      year: selectedYear,
      month: selectedMonth
    });
  }, []);

  return (
    <div className="flex flex-wrap gap-3">
      <Select value={selectedYear} onValueChange={handleYearChange}>
        <SelectTrigger className="w-[150px] bg-white">
          <SelectValue placeholder="Pilih Tahun" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={selectedMonth} onValueChange={handleMonthChange}>
        <SelectTrigger className="w-[150px] bg-white">
          <SelectValue placeholder="Pilih Bulan" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}