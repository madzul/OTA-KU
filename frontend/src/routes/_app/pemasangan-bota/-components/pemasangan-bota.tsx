import { api } from "@/api/client";
import { useState } from "react";
import { toast } from "sonner";

import { ConfirmationPage } from "./confirmation-page";
import { OTAInfo } from "./ota-info";
import { SelectMahasiswa } from "./select-mahasiswa";
import { SelectOTA } from "./select-ota";

// Steps for the OTA pairing process
enum PemasanganStep {
  SELECT_OTA = 1,
  SELECT_MAHASISWA = 2,
  CONFIRMATION = 3,
}

interface OTAType {
  accountId: string;
  name: string;
  phoneNumber: string;
  nominal: number;
  criteria?: string;
  maxCapacity?: number;
}

export function PemasanganBOTA() {
  const [currentStep, setCurrentStep] = useState<PemasanganStep>(
    PemasanganStep.SELECT_OTA,
  );
  const [selectedOTA, setSelectedOTA] = useState<OTAType | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handleOTASelect = async (otaId: string) => {
    try {
      // Get detailed OTA info
      const response = await api.detail.getOtaDetail({ id: otaId });
      console.log("Selected OTA ID:", otaId);
      if (response.success) {
        const otaData = {
          accountId: otaId,
          name: response.body.name,
          phoneNumber: response.body.phoneNumber,
          nominal: response.body.funds,
          criteria: response.body.criteria,
          maxCapacity: response.body.maxCapacity,
        };
        setSelectedOTA(otaData);
        setCurrentStep(PemasanganStep.SELECT_MAHASISWA);
      }
    } catch (error) {
      toast.warning("Failed to fetch OTA details. Please try again.");
      console.error("Error fetching OTA details:", error);
    }
  };

  const handleStudentSelect = (students: string[]) => {
    setSelectedStudents(students);
    setCurrentStep(PemasanganStep.CONFIRMATION);
  };

  const handleConfirmation = async () => {
    if (!selectedOTA || selectedStudents.length === 0) return;

    try {
      // Process each student connection sequentially
      for (const studentId of selectedStudents) {
        await api.connect.connectOtaMahasiswa({
          formData: {
            otaId: selectedOTA.accountId,
            mahasiswaId: studentId,
          },
        });
      }

      toast;

      // Reset the flow
      setCurrentStep(PemasanganStep.SELECT_OTA);
      setSelectedOTA(null);
      setSelectedStudents([]);
    } catch (error) {
      toast.error("Gagal memasangkan OTA dengan mahasiswa. Silakan coba lagi.");
      console.error("Error connecting OTA with students:", error);
    }
  };

  const handleBack = () => {
    if (currentStep === PemasanganStep.SELECT_MAHASISWA) {
      setCurrentStep(PemasanganStep.SELECT_OTA);
      setSelectedOTA(null);
    } else if (currentStep === PemasanganStep.CONFIRMATION) {
      setCurrentStep(PemasanganStep.SELECT_MAHASISWA);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <div className="mx-auto p-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            {currentStep === PemasanganStep.SELECT_OTA && (
              <SelectOTA onSelect={handleOTASelect} />
            )}

            {currentStep === PemasanganStep.SELECT_MAHASISWA && selectedOTA && (
              <>
                <OTAInfo ota={selectedOTA} onChangeOTA={handleOTASelect} />
                <SelectMahasiswa
                  onSelect={handleStudentSelect}
                  onBack={handleBack}
                />
              </>
            )}

            {currentStep === PemasanganStep.CONFIRMATION && selectedOTA && (
              <ConfirmationPage
                ota={selectedOTA}
                students={selectedStudents}
                onConfirm={handleConfirmation}
                onBack={handleBack}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
