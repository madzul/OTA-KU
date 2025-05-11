import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { otaList } from "./ota-data";
import { OTAPopover } from "./ota-popover";

// OTA type definition
type OTA = {
  id: string;
  name: string;
  phoneNumber: string;
  donationAmount: string;
  maxStudents: number;
  criteria: string;
  additionalInfo?: string;
};

export function OTASelection() {
  const [selectedOTA, setSelectedOTA] = useState<OTA | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasAvailableOTAs, setHasAvailableOTAs] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSelectOTA = (ota: OTA) => {
    setSelectedOTA(ota);
    setIsComboboxOpen(false);
  };

  return (
    <div>
      {/* State 1: No OTA selected */}
      {!selectedOTA && hasAvailableOTAs && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex gap-1 w-full items-center justify-between">
            <h3 className="min-w-[200px] w-full max-w-[900px] font-bold text-[18px] text-dark">
              Pilih OTA yang akan dipasangkan dengan mahasiswa asuh
            </h3>
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

      {/* State 2: OTA selected and not expanded */}
      {selectedOTA && !isExpanded && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Informasi Orang Tua Asuh</p>
              <h3 className="min-w-[200px] w-full max-w-[600px] font-bold text-[18px] text-dark">{selectedOTA.name}</h3>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-dark"
              onClick={toggleExpanded}
            >
              <ChevronDown className="text-dark" />
            </Button>
          </div>
        </div>
      )}

      {/* State 3: OTA selected and expanded */}
      {selectedOTA && isExpanded && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Informasi Orang Tua Asuh</p>
              <h3 className="min-w-[200px] w-full max-w-[600px] font-bold text-[18px] text-dark">{selectedOTA.name}</h3>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-dark"
              onClick={toggleExpanded}
            >
              <ChevronUp className="text-dark" />
            </Button>
          </div>

          <div className="mb-4 space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Kesanggupan sumbangan:</p>
              <p className="font-bold text-dark">
                {selectedOTA.donationAmount}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Max. mahasiswa asuh:</p>
              <p className="font-bold text-dark">
                {selectedOTA.maxStudents}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Kriteria calon mahasiswa asuh:
              </p>
                <p className="text-dark line-clamp-2">{selectedOTA.criteria}</p>
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
            <Button
              className="w-full"
              variant={"default"}
              onClick={() => setIsDialogOpen(true)}
            >
              Detail
            </Button>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-dark">
                  Detail Orang Tua Asuh
                </DialogTitle>
                <DialogDescription>
                  Informasi lengkap tentang Orang Tua Asuh
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-dark">
                    {selectedOTA.name}
                  </h4>
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
                  <p className="text-sm font-medium">
                    Kriteria calon mahasiswa asuh
                  </p>
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

      {/* State 4: No available OTAs */}
      {/* This state is shown when there are no available OTAs to select */}
      {!hasAvailableOTAs && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-medium text-dark">
              Tidak ada OTA yang perlu dipasangkan dengan mahasiswa asuh
            </p>
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
        </div>
      )}
    </div>
  );
}
