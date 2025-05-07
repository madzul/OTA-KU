import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { mockOTAList } from "./pemasangan-bota";

interface SelectOTAProps {
  onSelect: (ota: string) => void;
}

export function SelectOTA({ onSelect }: SelectOTAProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<typeof mockOTAList>(mockOTAList);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 0) {
      // Filter OTA list based on search term (name or WhatsApp)
      const filteredResults = mockOTAList.filter(ota => 
        ota.name.toLowerCase().includes(term.toLowerCase()) || 
        ota.whatsapp.includes(term)
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults(mockOTAList);
    }
  };

  const handleSelect = (ota: string) => {
    onSelect(ota);
    setIsSearchOpen(false);
  };

  return (
    <div>
      <p className="text-xl text-[#0A2463] font-bold mb-4">Pilih OTA yang akan dipasangkan dengan mahasiswa asuh</p>
      
      <div className="flex justify-end">
        <Button
          onClick={() => setIsSearchOpen(true)}
          className="bg-[#0A2463] hover:bg-[#0A2463]/90 text-white font-medium px-8 rounded-full"
        >
          Pilih
        </Button>
      </div>

      {/* Search Dialog/Popup */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="p-0 max-w-md gap-0 rounded-lg border shadow-lg overflow-hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <DialogHeader className="p-0">
            <div className="relative border-b">
              <Input
                type="text"
                placeholder="Cari nama atau no. whatsapp"
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 py-3 w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </DialogHeader>
         
          <div className="max-h-80 overflow-y-auto">
            {searchResults.map((ota, index) => (
              <div
                key={index}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelect(ota.name)}
              >
                <div>
                  <div className="text-[#0A2463] font-medium">{ota.name}</div>
                  <div className="text-gray-400 text-sm">{ota.whatsapp}</div>
                </div>
                
              </div>
            ))}
            {searchResults.length === 0 && (
              <div className="px-4 py-3 text-gray-500">Tidak ada hasil ditemukan</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}