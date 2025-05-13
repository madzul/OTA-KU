"use client"

import { format, parseISO } from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

interface TerminasiData {
  otaId: string
  otaName: string
  otaNumber: string
  mahasiswaId: string
  maName: string
  maNIM: string
  createdAt: string
  requestTerminateOTA: boolean
  requestTerminateMA: boolean
}

interface TerminasiTableProps {
  data: TerminasiData[]
  onTerminasi: (item: TerminasiData) => void
}

type SortDirection = "asc" | "desc" | null
type SortColumn = "otaName" | "maName" | null

export default function TerminasiTable({ data, onTerminasi }: TerminasiTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Format tanggal dari string ISO ke format yang lebih mudah dibaca
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMMM yyyy", { locale: id })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return dateString
    }
  }

  // Function to handle sort click
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortDirection(null)
        setSortColumn(null)
      }
    } else {
      // New column, start with ascending
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Function to render sort icon
  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="ml-1 inline-block h-4 w-4" />
    }

    if (sortDirection === "asc") {
      return <ArrowUp className="ml-1 inline-block h-4 w-4" />
    } else if (sortDirection === "desc") {
      return <ArrowDown className="ml-1 inline-block h-4 w-4" />
    }

    return <ChevronsUpDown className="ml-1 inline-block h-4 w-4" />
  }

  // Sort the data
  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0

    const valueA = a[sortColumn].toLowerCase()
    const valueB = b[sortColumn].toLowerCase()

    if (sortDirection === "asc") {
      return valueA.localeCompare(valueB)
    } else {
      return valueB.localeCompare(valueA)
    }
  })

  return (
    <div className="w-full overflow-x-auto px-4">
      <table className="w-full min-w-[1200px] border-collapse">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th
              className={cn(
                "cursor-pointer px-2 py-3 font-medium whitespace-nowrap",
                sortColumn === "otaName" && "text-blue-900",
              )}
              onClick={() => handleSort("otaName")}
            >
              <span className="flex items-center">
                OTA
                <span className={cn("ml-1", sortColumn === "otaName" && "text-blue-900")}>
                  {renderSortIcon("otaName")}
                </span>
              </span>
            </th>
            <th className="px-2 py-3 font-medium whitespace-nowrap">Nomor OTA</th>
            <th
              className={cn(
                "cursor-pointer px-2 py-3 font-medium whitespace-nowrap",
                sortColumn === "maName" && "text-blue-900",
              )}
              onClick={() => handleSort("maName")}
            >
              <span className="flex items-center">
                Mahasiswa
                <span className={cn("ml-1", sortColumn === "maName" && "text-blue-900")}>
                  {renderSortIcon("maName")}
                </span>
              </span>
            </th>
            <th className="px-2 py-3 font-medium whitespace-nowrap">NIM</th>
            <th className="px-2 py-3 font-medium whitespace-nowrap">Berhubungan Sejak</th>
            <th className="px-2 py-3 font-medium whitespace-nowrap">Diminta Oleh</th>
            <th className="px-2 py-3 font-medium whitespace-nowrap">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 text-center text-gray-500">
                Tidak ada data permintaan terminasi
              </td>
            </tr>
          ) : (
            sortedData.map((item) => (
              <tr key={`${item.otaId}-${item.mahasiswaId}`} className="border-b">
                <td className="px-2 py-4 whitespace-nowrap">{item.otaName}</td>
                <td className="px-2 py-4 whitespace-nowrap">{item.otaNumber}</td>
                <td className="px-2 py-4 whitespace-nowrap">{item.maName}</td>
                <td className="px-2 py-4 whitespace-nowrap">{item.maNIM}</td>
                <td className="px-2 py-4 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                <td className="px-2 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    {item.requestTerminateMA && (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 border border-blue-300">
                        By MA
                      </span>
                    )}
                    {item.requestTerminateOTA && (
                      <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-600 border border-purple-300">
                        By OTA
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onTerminasi(item)}
                  >
                    Terminasi
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
