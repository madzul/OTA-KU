import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { api } from "@/api/client";

interface SelectOTAProps {
  onSelect: (otaId: string) => void;
}

interface OTAItem {
  accountId: string;
  name: string;
  phoneNumber: string;
  nominal: number;
}

export function SelectOTA({ onSelect }: SelectOTAProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [otaList, setOtaList] = useState<OTAItem[]>([]);
  const [filteredOTAs, setFilteredOTAs] = useState<OTAItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState(0);

  useEffect(() => {
    if (isSearchOpen) {
      fetchAvailableOTAs();
    }
  }, [isSearchOpen, page]);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      setFilteredOTAs(otaList);
    }
  }, [searchTerm, otaList]);

  const fetchAvailableOTAs = async () => {
    setIsLoading(true);
    try {
      const response = await api.list.listAvailableOta({
        q: searchTerm,
        page
      });
     
      if (response.success) {
        setOtaList(response.body.data);
        setFilteredOTAs(response.body.data);
        setTotalData(response.body.totalData);
      }
    } catch (error) {
      console.error("Error fetching available OTAs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm) {
      const filtered = otaList.filter(ota =>
        ota.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ota.phoneNumber.includes(searchTerm)
      );
      setFilteredOTAs(filtered);
    } else {
      setFilteredOTAs(otaList);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const handleSelect = (otaId: string) => {
    onSelect(otaId);
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
     
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="p-0 max-w-md gap-0 rounded-lg border shadow-lg overflow-hidden">
          <DialogHeader className="p-0 m-0">
            <DialogTitle className="sr-only">Pilih Orang Tua Asuh</DialogTitle>
            <DialogDescription className="sr-only">
              Cari dan pilih orang tua asuh yang tersedia untuk dipasangkan dengan mahasiswa
            </DialogDescription>
          </DialogHeader>
          <div className="relative border-b">
            <Input
              type="text"
              placeholder="Cari nama atau no. telepon"
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 py-3 w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
         
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center p-6">
                Loading...
              </div>
            ) : (
              <>
                {filteredOTAs.length > 0 ? (
                  filteredOTAs.map((ota) => (
                    <div
                      key={ota.accountId}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSelect(ota.accountId)}
                    >
                      <div>
                        <div className="text-[#0A2463] font-medium">{ota.name}</div>
                        <div className="text-gray-400 text-sm">{ota.phoneNumber}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500">Tidak ada hasil ditemukan</div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}