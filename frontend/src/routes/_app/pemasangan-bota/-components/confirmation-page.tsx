import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserRound, Trash2 } from "lucide-react";
import { OTAInfo } from "./ota-info";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Mock student data matching the table names for display in confirmation
const mockStudentMap = {
  "S1": { name: "Siti Nurhaliza", nim: "101" },
  "S2": { name: "Budi Santoso", nim: "135" },
  "S3": { name: "Ahmad Rizky", nim: "122" },
  "S4": { name: "Linda Oktaviani", nim: "104" },
  "S5": { name: "Dedi Firmansyah", nim: "150" }
};

interface OTAProps {
  name: string;
  whatsapp?: string;
  contribution: string;
  maxStudents: number;
  criteria: string;
}

interface ConfirmationPageProps {
  ota: OTAProps;
  students: string[];
  onConfirm: () => void;
  onBack: () => void;
}

export function ConfirmationPage({ ota, students, onConfirm, onBack }: ConfirmationPageProps) {
  const [showDialog, setShowDialog] = useState(false);
  
  // Get details of selected students
  const selectedStudentDetails = students.map(id => 
    mockStudentMap[id as keyof typeof mockStudentMap] || { name: "Unknown Student", nim: "---" }
  );

  const handleRemoveStudent = (studentId: string) => {
    // Implementation would go here in a real app
    console.log("Remove student:", studentId);
  };

  const handleConfirmClick = () => {
    setShowDialog(true);
  };

  const handleFinalConfirm = () => {
    setShowDialog(false);
    onConfirm();
  };

  return (
    <div>
      <OTAInfo ota={ota} onChangeOTA={onBack} />
      
      <div className="mb-6">
        <p className="text-base mb-4 text-[#0A2463] font-medium">
          Pilih mahasiswa yang ingin dipasangkan dengan OTA
        </p>
        
        <div className="flex items-center mb-4">
          <div className="flex items-center bg-[#0A2463] text-white rounded-lg px-4 py-2">
            <UserRound className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Total {selectedStudentDetails.length}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {selectedStudentDetails.map((student, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <div className="flex items-center">
                <div className="h-6 w-6 flex items-center justify-center rounded-full bg-[#0A2463] text-white mr-3 text-xs">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-gray-500">{student.nim}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500"
                onClick={() => handleRemoveStudent(students[index])}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          Kembali
        </Button>
        <Button 
          onClick={handleConfirmClick}
          className="bg-[#0A2463] hover:bg-[#0A2463]/90 text-white px-8 font-medium"
        >
          Pasangkan
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apakah Anda yakin?</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p>
              Apakah Anda yakin ingin memasangkan mahasiswa tersebut kepada {ota.name}? Aksi ini tidak akan bisa diubah.
            </p>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              Batal
            </Button>
            <div className="relative">
              <Button 
                onClick={handleFinalConfirm}
                className="bg-[#0A2463] hover:bg-[#0A2463]/90 text-white"
              >
                Yakin
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}