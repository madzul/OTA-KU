"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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

// Reusable OTA Popover Component
export function OTAPopover({
  isComboboxOpen,
  setIsComboboxOpen,
  onSelectOTA,
  buttonVariant,
  buttonText,
}: {
  isComboboxOpen: boolean
  setIsComboboxOpen: (open: boolean) => void
  onSelectOTA: (ota: OTA) => void
  buttonVariant: "default" | "outline"
  buttonText: string
}) {
  return (
    <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
      <PopoverTrigger asChild>
        <Button variant={buttonVariant} className="w-full">
          {buttonText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]">
        <Command>
          <div className="flex items-center border-b w-full">
            <div className="w-full">
              <CommandInput
                placeholder="Cari nama atau no. whatsapp"
                className="flex-1 outline-none border-0 focus:ring-0 text-sm w-full"
              />
            </div>
          </div>
          <CommandList>
            <CommandEmpty>Tidak ada OTA yang ditemukan.</CommandEmpty>
            <CommandGroup>
              {otaList.map((ota) => (
                <CommandItem key={ota.id} onSelect={() => onSelectOTA(ota)} className="cursor-pointer">
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
  )
}
