import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface Transaction {
  id: string;
  name: string;
  nim: string;
  amount: number;
  paid: number | null;
  paymentDate: string | null;
  dueDate: string;
  status: "Accepted" | "Pending" | "Rejected" | "Unpaid";
}

interface UploadBuktiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

export function UploadBuktiDialog({ open, onOpenChange, transaction }: UploadBuktiDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // Here you would handle the file upload
    console.log("Uploading file:", file);
    // Reset the state and close the dialog
    setFile(null);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFile(null);
    onOpenChange(false);
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-[#0A2463]">
            Unggah Bukti Pembayaran
          </DialogTitle>
        </DialogHeader>

        <div 
          className={`mt-4 border-2 border-dashed rounded-md p-6 text-center ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <div className="bg-gray-100 p-2 rounded">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
              </div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                Hapus
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center mb-4">
                <Upload className="h-10 w-10 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500">
                Klik untuk upload atau drag & drop
              </p>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleChange}
                accept="image/*,.pdf"
              />
              <label 
                htmlFor="file-upload" 
                className="mt-2 inline-block cursor-pointer text-sm text-blue-600 hover:text-blue-800"
              >
                Pilih file
              </label>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="flex-1"
          >
            Batal
          </Button>
          <Button 
            variant="default"
            onClick={handleSubmit}
            disabled={!file}
            className="flex-1 bg-blue-700 hover:bg-blue-800"
          >
            Unggah
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}