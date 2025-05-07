import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { api } from "@/api/client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface OTAProps {
  accountId: string;
  name: string;
  phoneNumber: string;
  nominal: number;
  criteria?: string;
  maxCapacity?: number;
}

interface OTAInfoProps {
  ota: OTAProps;
  onChangeOTA: (otaId: string) => void;
}

export function OTAInfo({ ota, onChangeOTA }: OTAInfoProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  return (
    <Card className="mb-6 border rounded-lg">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="px-4 py-4 flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Informasi Orang Tua Asuh</h3>
              <h2 className="text-lg font-bold text-[#0A2463]">{ota.name}</h2>
              {isExpanded && (
                <div className="mt-2 text-sm text-[#0A2463]">
                  <p>Kesanggupan sumbangan: Rp {ota.nominal.toLocaleString()}</p>
                  <p>Max. mahasiswa asuh: {ota.maxCapacity || "Tidak ada data"}</p>
                  <p>Kriteria calon mahasiswa asuh: {ota.criteria || "Tidak ada data"}</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#0A2463]"
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </div>
         
          {isExpanded && (
            <div className="flex justify-center items-center gap-x-8 p-4">
              <Button
                variant="outline"
                onClick={() => setShowSearchDialog(true)}
                className="rounded-lg w-1/3"
              >
                Ganti OTA
              </Button>
              <Button
                className="rounded-lg w-1/3"
                onClick={() => setShowDetailDialog(true)}
              >
                Detail
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0A2463]">Detail Orang Tua Asuh</DialogTitle>
            <DialogDescription className="text-gray-500 text-sm">
              Informasi lengkap tentang orang tua asuh yang terpilih
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#0A2463]">{ota.name}</h3>
                {ota.phoneNumber && (
                  <p className="text-gray-500 text-sm mb-4">Telepon: {ota.phoneNumber}</p>
                )}
              </div>
             
              <div>
                <h4 className="font-medium text-[#0A2463]">Informasi Sumbangan</h4>
                <p className="text-sm">Kesanggupan: Rp {ota.nominal.toLocaleString()}</p>
              </div>
             
              <div>
                <h4 className="font-medium text-[#0A2463]">Kapasitas</h4>
                <p className="text-sm">Maksimum mahasiswa asuh: {ota.maxCapacity || "Tidak ada data"}</p>
              </div>
             
              <div>
                <h4 className="font-medium text-[#0A2463]">Kriteria Calon Mahasiswa Asuh</h4>
                <p className="text-sm">{ota.criteria || "Tidak ada data"}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search Dialog */}
      <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <DialogContent className="p-0 max-w-md gap-0 rounded-lg border shadow-lg overflow-hidden">
          <DialogHeader className="p-0 m-0">
            <DialogTitle className="sr-only">Pilih Orang Tua Asuh</DialogTitle>
            <DialogDescription className="sr-only">
              Cari dan pilih orang tua asuh yang tersedia untuk dipasangkan dengan mahasiswa
            </DialogDescription>
          </DialogHeader>
          <OTASearchIntegrated onSelect={(otaId) => {
            onChangeOTA(otaId);
            setShowSearchDialog(false);
          }} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Integrated OTA Search component that works with the API
function OTASearchIntegrated({ onSelect }: { onSelect: (otaId: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [otaList, setOtaList] = useState<Array<{
    accountId: string;
    name: string;
    phoneNumber: string;
  }>>([]);
  const [filteredOTAs, setFilteredOTAs] = useState<Array<{
    accountId: string;
    name: string;
    phoneNumber: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage] = useState(1);
  
  useEffect(() => {
    fetchAvailableOTAs();
  }, []);
  
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
        page: currentPage
      });
      
      if (response.success) {
        setOtaList(response.body.data);
        setFilteredOTAs(response.body.data);
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
    
    if (term.length > 0) {
      const timeoutId = setTimeout(() => {
        fetchAvailableOTAs();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  };
  
  return (
    <>
      <div className="relative border-b">
        <Input
          type="text"
          placeholder="Cari nama Orang Tua Asuh"
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
                  onClick={() => onSelect(ota.accountId)}
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
    </>
  );
}