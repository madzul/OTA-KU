import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { api } from "@/api/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface Transaction {
  id: string;
  name: string;
  nim: string;
  bill: number;
  amount_paid: number;
  paid_at: string | null;
  due_date: string;
  status: "unpaid" | "pending" | "paid";
  receipt: string;
}

interface UploadBuktiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  onSuccess?: () => void;
}

export function UploadBuktiDialog({ 
  open, 
  onOpenChange, 
  transaction, 
  onSuccess 
}: UploadBuktiDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localTransaction, setLocalTransaction] = useState<Transaction | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && transaction) {
      setLocalTransaction(transaction);
    } else {
      // Reset form when dialog closes
      setFile(null);
      setFileName("");
    }
  }, [open, transaction]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0] || null;
    handleFileChange(droppedFile);
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      // Validate file type
      const isValidFileType = selectedFile.type === "application/pdf" || 
                              selectedFile.type.startsWith("image/");
      
      if (!isValidFileType) {
        toast.error("Format file tidak valid", {
          description: "Harap unggah file PDF atau gambar"
        });
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSize) {
        toast.error("Ukuran file terlalu besar", {
          description: "Maksimal ukuran file adalah 5MB"
        });
        return;
      }
      
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileChange(selectedFile);
    if (!selectedFile && e.target) {
      e.target.value = "";
    }
  };
  
  const handleCancel = () => {
    setFile(null);
    setFileName("");
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Tidak ada file yang dipilih");
      return;
    }

    if (!localTransaction) {
      toast.error("Data transaksi tidak lengkap");
      return;
    }
    
    const mahasiswaId = localTransaction.id;
    
    if (!mahasiswaId) {
      toast.error("ID mahasiswa tidak ditemukan");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create FormData object to send to the API
      const formData = new FormData();
      formData.append("mahasiswaId", mahasiswaId);
      formData.append("receipt", file);
      
      // Use the API client to upload
      const response = await api.transaction.uploadReceipt({
        formData: {
          mahasiswaId,
          receipt: file,
        },
      });

      if (response.success) {
        toast.success("Bukti pembayaran berhasil diunggah");
        if (onSuccess) onSuccess();
      } else {
        toast.error("Gagal mengunggah bukti pembayaran");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error uploading file:", error);
      
      let errorMessage = "Terjadi kesalahan saat mengunggah bukti pembayaran";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      setFile(null);
      setFileName("");
      onOpenChange(false);
    }
  };

  if (!localTransaction) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-[#0A2463]">
            Unggah Bukti Pembayaran
          </DialogTitle>
          <DialogDescription className="text-center">
            Unggah bukti pembayaran untuk mahasiswa {localTransaction.name}
          </DialogDescription>
        </DialogHeader>

        <div 
          className={`flex flex-col items-center justify-center rounded-md border-2 ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          } border-dashed p-6 transition-all`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Input
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileInputChange}
            ref={fileInputRef}
          />
          
          <div className="flex flex-col items-center gap-2 text-center">
            <FileUp className="text-muted-foreground h-8 w-8" />
            <p className="text-sm font-medium">
              {isDragging
                ? "Geser berkas kesini untuk upload"
                : fileName || "Klik untuk upload atau drag & drop"}
            </p>
            {fileName && (
              <p className="text-xs text-muted-foreground mt-1">
                File terpilih: {fileName}
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Pilih Bukti Pembayaran
            </Button>
          </div>
        </div>

        <DialogFooter className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="flex-1"
            disabled={isUploading}
          >
            Batal
          </Button>
          <Button 
            variant="default"
            onClick={handleSubmit}
            disabled={!file || isUploading}
            className="flex-1 bg-blue-700 hover:bg-blue-800"
          >
            {isUploading ? "Mengunggah..." : "Unggah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}