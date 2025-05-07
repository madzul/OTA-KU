import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OTASearch } from "./ota-search"; // Import the OTA search component

interface OTAProps {
  name: string;
  whatsapp?: string;
  contribution: string;
  maxStudents: number;
  criteria: string;
}

interface OTAInfoProps {
  ota: OTAProps;
  onChangeOTA?: (otaName: string) => void;
}

export function OTAInfo({ ota, onChangeOTA }: OTAInfoProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);

  const handleOTASelect = (selectedOTA: string) => {
    if (onChangeOTA) {
      onChangeOTA(selectedOTA);
    }
    setShowSearchDialog(false);
  };

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
                  <p>Kesanggupan sumbangan: {ota.contribution}</p>
                  <p>Max. mahasiswa asuh: {ota.maxStudents}</p>
                  <p>Kriteria calon mahasiswa asuh: {ota.criteria}</p>
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
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#0A2463]">{ota.name}</h3>
                {ota.whatsapp && (
                  <p className="text-gray-500 text-sm mb-4">Whatsapp: {ota.whatsapp}</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-[#0A2463]">Informasi Sumbangan</h4>
                <p className="text-sm">Kesanggupan: {ota.contribution}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-[#0A2463]">Kapasitas</h4>
                <p className="text-sm">Maksimum mahasiswa asuh: {ota.maxStudents}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-[#0A2463]">Kriteria Calon Mahasiswa Asuh</h4>
                <p className="text-sm">{ota.criteria}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-[#0A2463]">Alamat</h4>
                <p className="text-sm">Jl. Ganesa No. 10, Bandung</p>
              </div>
              
              <div>
                <h4 className="font-medium text-[#0A2463]">Pekerjaan</h4>
                <p className="text-sm">Dosen ITB</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search Dialog */}
      <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <DialogContent className="p-0 max-w-md gap-0 rounded-lg border shadow-lg overflow-hidden">
          <OTASearch onSelect={handleOTASelect} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}