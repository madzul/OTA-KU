import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const years = ["2023", "2024", "2025", "2026"];
const months = [
  "Januari", "Februari", "Maret", "April", 
  "Mei", "Juni", "Juli", "Agustus", 
  "September", "Oktober", "November", "Desember"
];

export default function StatusTransaksiFilter() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("Mei");

  return (
    <div className="flex flex-wrap gap-3">
      <Select value={selectedYear} onValueChange={setSelectedYear}>
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

      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
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