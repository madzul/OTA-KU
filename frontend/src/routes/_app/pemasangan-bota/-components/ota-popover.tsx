"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { otaList } from "./ota-data";

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
      <PopoverTrigger asChild >
        <Button variant={buttonVariant} className="grow min-w-[90px] ">
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
