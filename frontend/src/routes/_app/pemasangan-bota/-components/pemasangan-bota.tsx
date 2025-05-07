import { useState } from "react";
import { SelectOTA } from "./select-ota";
import { SelectMahasiswa } from "./select-mahasiswa";
import { ConfirmationPage } from "./confirmation-page";
import { OTAInfo } from "./ota-info";

// Steps for the OTA pairing process
enum PemasanganStep {
  SELECT_OTA = 1,
  SELECT_MAHASISWA = 2,
  CONFIRMATION = 3,
}

// Mock data for OTAs
export const mockOTAList = [
  { 
    name: "Ayi Purbasari Lorem Ipsum", 
    whatsapp: "6281112233445",
    contribution: "300.000 per bulan",
    maxStudents: 4,
    criteria: "Baik, soleh, agama, jenis kelamin, tinggi, alumni sma yang sama, dll lorem ipsum lorem ipsum lorem ipsum"
  },
  { 
    name: "Budi Santoso", 
    whatsapp: "6281223344556",
    contribution: "500.000 per bulan",
    maxStudents: 2,
    criteria: "Prestasi akademik tinggi, aktif organisasi"
  },
  { 
    name: "Citra Dewi", 
    whatsapp: "6281334455667",
    contribution: "400.000 per bulan",
    maxStudents: 3,
    criteria: "Mahasiswa dari keluarga tidak mampu, IPK minimal 3.0"
  },
  { 
    name: "Dedi Pratama", 
    whatsapp: "6281445566778",
    contribution: "350.000 per bulan",
    maxStudents: 2,
    criteria: "Mahasiswa asal daerah terpencil"
  },
  { 
    name: "Eka Putri", 
    whatsapp: "6281556677889",
    contribution: "450.000 per bulan",
    maxStudents: 3,
    criteria: "Mahasiswa berprestasi di bidang olahraga atau seni"
  }
];

export function PemasanganBOTA() {
  const [currentStep, setCurrentStep] = useState<PemasanganStep>(PemasanganStep.SELECT_OTA);
  const [selectedOTA, setSelectedOTA] = useState<(typeof mockOTAList)[0] | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handleOTASelect = (otaName: string) => {
    const ota = mockOTAList.find(o => o.name === otaName);
    if (ota) {
      setSelectedOTA(ota);
      setCurrentStep(PemasanganStep.SELECT_MAHASISWA);
    }
  };

  const handleStudentSelect = (students: string[]) => {
    setSelectedStudents(students);
    setCurrentStep(PemasanganStep.CONFIRMATION);
  };

  const handleConfirmation = () => {
    // Here would be the API call to confirm the pairing
    console.log("Pairing confirmed:", { selectedOTA, selectedStudents });
    // Reset the flow or show success message
    setCurrentStep(PemasanganStep.SELECT_OTA);
    setSelectedOTA(null);
    setSelectedStudents([]);
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
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="mx-auto p-6">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            {currentStep === PemasanganStep.SELECT_OTA && (
              <SelectOTA onSelect={handleOTASelect} />
            )}
           
            {currentStep === PemasanganStep.SELECT_MAHASISWA && selectedOTA && (
              <>
                <OTAInfo ota={selectedOTA} onChangeOTA={handleBack} />
                <SelectMahasiswa onSelect={handleStudentSelect} onBack={handleBack} />
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