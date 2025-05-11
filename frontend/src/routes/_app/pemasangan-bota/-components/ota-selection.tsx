"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, CheckCircle, Search } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
  // State for the component
  const [selectedOTA, setSelectedOTA] = useState<OTA | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isComboboxOpen, setIsComboboxOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [hasAvailableOTAs, setHasAvailableOTAs] = useState(true)

  // Toggle the expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  // Handle OTA selection
  const handleSelectOTA = (ota: OTA) => {
    setSelectedOTA(ota)
    setIsComboboxOpen(false)
  }

  // Render the component based on the current state
  return (
    <div>
      {/* State 1: No OTA selected yet */}
      {!selectedOTA && hasAvailableOTAs && (
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex justify-between items-center w-full">
            <h3 className="text-blue-900 font-bold min-w-[200px]">Pilih OTA yang akan dipasangkan dengan mahasiswa asuh</h3>
            <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"default"}
                  className="flex-grow min-w-23 max-w-[200px]"
                >
                  Pilih
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[300px]">
                <Command>
                  <div className="flex items-center border-b px-3">
                    <Search className="h-4 w-4 shrink-0 text-gray-400" />
                    <CommandInput
                      placeholder="Cari nama atau no. whatsapp"
                      className="flex-1 outline-none border-0 focus:ring-0 text-sm"
                    />
                  </div>
                  <CommandList>
                    <CommandEmpty>Tidak ada OTA yang ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {otaList.map((ota) => (
                        <CommandItem key={ota.id} onSelect={() => handleSelectOTA(ota)} className="cursor-pointer">
                          <div className="flex flex-col py-1">
                            <span className="text-blue-900 font-medium">{ota.name}</span>
                            <span className="text-gray-400">{ota.phoneNumber}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* State 2: OTA selected, collapsed view */}
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

      {/* State 3: OTA selected, expanded view */}
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
            <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full border-blue-800 text-blue-800">
                  Ganti OTA
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[300px]">
                <Command>
                  <div className="flex items-center border-b px-3">
                    <Search className="h-4 w-4 shrink-0 text-gray-400" />
                    <CommandInput
                      placeholder="Cari nama atau no. whatsapp"
                      className="flex-1 outline-none border-0 focus:ring-0 text-sm"
                    />
                  </div>
                  <CommandList>
                    <CommandEmpty>Tidak ada OTA yang ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {otaList.map((ota) => (
                        <CommandItem key={ota.id} onSelect={() => handleSelectOTA(ota)} className="cursor-pointer">
                          <div className="flex flex-col py-1">
                            <span className="text-blue-900 font-medium">{ota.name}</span>
                            <span className="text-gray-400">{ota.phoneNumber}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

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

      {/* State 4: No OTAs available */}
      {!hasAvailableOTAs && (
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <p className="text-blue-900 font-medium">Tidak ada OTA yang perlu dipasangkan dengan mahasiswa asuh</p>
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
        </div>
      )}

      {/* Controls for demo purposes */}
      {/* <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-sm font-medium mb-2">Demo Controls:</p>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedOTA(null)
              setIsExpanded(false)
              setHasAvailableOTAs(true)
            }}
          >
            Show State 1 (No OTA Selected)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedOTA(otaList[0])
              setIsExpanded(false)
              setHasAvailableOTAs(true)
            }}
          >
            Show State 2 (OTA Selected, Collapsed)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedOTA(otaList[0])
              setIsExpanded(true)
              setHasAvailableOTAs(true)
            }}
          >
            Show State 3 (OTA Selected, Expanded)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedOTA(null)
              setIsExpanded(false)
              setHasAvailableOTAs(false)
            }}
          >
            Show State 4 (No OTAs Available)
          </Button>
        </div>
      </div> */}
    </div>
  )
}
