import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, CircleCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { OTAPopover, OTA } from "./ota-popover";
import DetailDialogOta from "./detail-dialog-ota";
import { toast } from "sonner";

export function OTASelection() {
  const [selectedOTA, setSelectedOTA] = useState<OTA | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);

  const { data: availableOTAs, isLoading } = useQuery({
    queryKey: ["listAvailableOta"],
    queryFn: () => api.list.listAvailableOta({ page: 1 }),
  });

  let hasAvailableOTAs = false;

  if (availableOTAs === undefined) {
    console.log("Error: availableOTAs is undefined");
    toast.warning("Terjadi kesalahan saat memuat data OTA.");
  } else {
    hasAvailableOTAs = availableOTAs.body.data.length > 0;
  }

  const { data: otaDetails, refetch: fetchOTADetails } = useQuery({
    queryKey: ["otaDetails", selectedOTA?.accountId],
    queryFn: () => api.detail.getOtaDetail({ id: selectedOTA?.accountId || "" }),
    enabled: false, // Disable automatic fetching
  });

  useEffect(() => {
    if (selectedOTA) {
      fetchOTADetails();
    }
  }, [selectedOTA, fetchOTADetails]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSelectOTA = (ota: OTA) => {
    setSelectedOTA(ota);
    setIsComboboxOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
                {otaDetails?.body.funds || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Max. mahasiswa asuh:</p>
              <p className="font-bold text-dark">
                {otaDetails?.body.maxCapacity || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Kriteria calon mahasiswa asuh:
              </p>
              <p className="text-dark line-clamp-2">{otaDetails?.body.criteria || "-"}</p>
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
            <DetailDialogOta id={selectedOTA.accountId} />
          </div>
        </div>
      )}

      {/* State 4: No available OTAs */}
      {!hasAvailableOTAs && (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="font-medium text-dark">
              Tidak ada OTA yang perlu dipasangkan dengan mahasiswa asuh
            </p>
            <CircleCheck className="h-6 w-6 text-succeed" />
          </div>
        </div>
      )}
    </div>
  );
}
