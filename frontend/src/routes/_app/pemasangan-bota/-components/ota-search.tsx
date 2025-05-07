import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock data for OTA list with WhatsApp numbers
const mockOTAList = [
  { name: "Ayi Purbasari Lorem Ipsum", whatsapp: "6285276811934" },
  { name: "Budi Santoso", whatsapp: "6281223344556" },
  { name: "Citra Dewi", whatsapp: "6281334455667" },
  { name: "Dedi Pratama", whatsapp: "6281445566778" },
  { name: "Eka Putri", whatsapp: "6281556677889" }
];

interface OTASearchProps {
  onSelect: (ota: string) => void;
}

export function OTASearch({ onSelect }: OTASearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<typeof mockOTAList>(mockOTAList);
  
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

  return (
    <>
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
      
      <div className="max-h-80 overflow-y-auto">
        {searchResults.map((ota, index) => (
          <div
            key={index}
            className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-b-0"
            onClick={() => onSelect(ota.name)}
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
    </>
  );
}