"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { OTAPopover } from "./ota-popover"

// OTA type definition
type OTA = {
  id: string
  name: string
  phoneNumber: string
  donationAmount: string
  maxStudents: number
  criteria: string
  additionalInfo?: string
}

// Sample data
const otaList: OTA[] = [
  {
    id: "1",
    name: "Ayi Purbasari Lorem Ipsum",
    phoneNumber: "62XXXXXXXXX",
    donationAmount: "300.000 per bulan",
    maxStudents: 4,
    criteria:
      "Baik, soleh, agama, jenis kelamin, tinggi, alumni sma yang sama, dll lorem ipsum lorem ipsum lorem ipsum",
    additionalInfo:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    id: "2",
    name: "Ayi Purbasari",
    phoneNumber: "62XXXXXXXXX",
    donationAmount: "250.000 per bulan",
    maxStudents: 3,
    criteria: "Baik, soleh, agama, jenis kelamin",
    additionalInfo:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "3",
    name: "Ayi Purbasari",
    phoneNumber: "62XXXXXXXXX",
    donationAmount: "400.000 per bulan",
    maxStudents: 5,
    criteria: "Alumni sma yang sama, dll lorem ipsum",
    additionalInfo:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
]

export function OTASelection() {
  const [selectedOTA, setSelectedOTA] = useState<OTA | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isComboboxOpen, setIsComboboxOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [hasAvailableOTAs, setHasAvailableOTAs] = useState(true)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleSelectOTA = (ota: OTA) => {
    setSelectedOTA(ota)
    setIsComboboxOpen(false)
  }

  return (
    <div>
      {!selectedOTA && hasAvailableOTAs && (
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex justify-between items-center w-full">
            <h3 className="text-blue-900 font-bold min-w-[200px]">Pilih OTA yang akan dipasangkan dengan mahasiswa asuh</h3>
            <OTAPopover
              isComboboxOpen={isComboboxOpen}
              setIsComboboxOpen={setIsComboboxOpen}
              onSelectOTA={handleSelectOTA}
              buttonVariant="default"
              buttonText="Pilih"
            />
          </div>
        </div>
      )}

      {selectedOTA && !isExpanded && (
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Informasi Orang Tua Asuh</p>
              <h3 className="text-blue-900 font-medium">{selectedOTA.name}</h3>
            </div>
            <Button variant="outline" size="icon" className="rounded-full border-blue-900" onClick={toggleExpanded}>
              <ChevronDown className="h-5 w-5 text-blue-900" />
            </Button>
          </div>
        </div>
      )}

      {selectedOTA && isExpanded && (
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-400 text-sm">Informasi Orang Tua Asuh</p>
              <h3 className="text-blue-900 font-medium">{selectedOTA.name}</h3>
            </div>
            <Button variant="outline" size="icon" className="rounded-full border-blue-900" onClick={toggleExpanded}>
              <ChevronUp className="h-5 w-5 text-blue-900" />
            </Button>
          </div>

          <div className="space-y-2 mb-4">
            <div>
              <p className="text-gray-600 text-sm">Kesanggupan sumbangan:</p>
              <p className="text-blue-900 font-medium">{selectedOTA.donationAmount}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Max. mahasiswa asuh:</p>
              <p className="text-blue-900 font-medium">{selectedOTA.maxStudents}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Kriteria calon mahasiswa asuh:</p>
              <p className="text-blue-900">{selectedOTA.criteria}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <OTAPopover
              isComboboxOpen={isComboboxOpen}
              setIsComboboxOpen={setIsComboboxOpen}
              onSelectOTA={handleSelectOTA}
              buttonVariant="outline"
              buttonText="Ganti OTA"
            />
            <Button className="w-full bg-blue-800 hover:bg-blue-900 text-white" onClick={() => setIsDialogOpen(true)}>
              Detail
            </Button>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-blue-900">Detail Orang Tua Asuh</DialogTitle>
                <DialogDescription>Informasi lengkap tentang Orang Tua Asuh</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-blue-900">{selectedOTA.name}</h4>
                  <p className="text-gray-500">{selectedOTA.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Kesanggupan sumbangan</p>
                  <p>{selectedOTA.donationAmount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Max. mahasiswa asuh</p>
                  <p>{selectedOTA.maxStudents}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Kriteria calon mahasiswa asuh</p>
                  <p>{selectedOTA.criteria}</p>
                </div>
                {selectedOTA.additionalInfo && (
                  <div>
                    <p className="text-sm font-medium">Informasi tambahan</p>
                    <p>{selectedOTA.additionalInfo}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {!hasAvailableOTAs && (
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <p className="text-blue-900 font-medium">Tidak ada OTA yang perlu dipasangkan dengan mahasiswa asuh</p>
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
        </div>
      )}
    </div>
  )
}
