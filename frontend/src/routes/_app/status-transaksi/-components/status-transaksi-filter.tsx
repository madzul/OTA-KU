import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const months = [
  { name: "January", value: "1" },
  { name: "February", value: "2" },
  { name: "March", value: "3" },
  { name: "April", value: "4" },
  { name: "May", value: "5" },
  { name: "June", value: "6" },
  { name: "July", value: "7" },
  { name: "August", value: "8" },
  { name: "September", value: "9" },
  { name: "October", value: "10" },
  { name: "November", value: "11" },
  { name: "December", value: "12" },
];

const years = ["2023", "2024", "2025", "2026"];

interface StatusTransaksiFilterProps {
  onFilterChange: (filters: { year: string; month: string }) => void;
}

export default function StatusTransaksiFilter({
  onFilterChange,
}: StatusTransaksiFilterProps) {
  // Store current date for initialization
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonthIndex = currentDate.getMonth(); // 0-11

  // Initialize with current month and year
  const [selectedYear, setSelectedYear] = useState<string>(
    years.includes(currentYear) ? currentYear : "2025",
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    months[currentMonthIndex].value,
  );

  // Use the state directly in the handlers
  const handleYearChange = (value: string) => {
    console.log("Year changed to:", value);
    setSelectedYear(value);
    onFilterChange({
      year: value,
      month: selectedMonth,
    });
  };

  const handleMonthChange = (value: string) => {
    console.log("Month changed to:", value);
    setSelectedMonth(value);
    onFilterChange({
      year: selectedYear,
      month: value,
    });
  };

  // Call onFilterChange once on initial render to set initial filters
  useEffect(() => {
    console.log("Initial filter set:", {
      year: selectedYear,
      month: selectedMonth,
    });
    onFilterChange({
      year: selectedYear,
      month: selectedMonth,
    });
  }, []); // Only on mount

  return (
    <div>
      <p>Filter untuk tenggat waktu bayar</p>
      <div className="my-4 flex flex-wrap gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Tahun
          </label>
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
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Bulan
          </label>
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
