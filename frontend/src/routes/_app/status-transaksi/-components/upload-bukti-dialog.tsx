import { api } from "@/api/client";
import { TransactionOTA } from "@/api/generated";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FileUp, Image, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface UploadBuktiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: TransactionOTA | null;
  onSuccess?: () => void;
  paidFor: number;
}

export function UploadBuktiDialog({
  open,
  onOpenChange,
  transaction,
  onSuccess,
  paidFor,
}: UploadBuktiDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "pdf" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localTransaction, setLocalTransaction] =
    useState<TransactionOTA | null>(null);
  const [selectedPaidFor, setSelectedPaidFor] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && transaction) {
      setLocalTransaction(transaction);
      setSelectedPaidFor(paidFor);
    } else {
      // Reset form when dialog closes
      setFile(null);
      setFileName("");
      setFilePreview(null);
      setFileType(null);
    }
  }, [open, transaction, paidFor]);

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
      const isValidFileType =
        selectedFile.type === "application/pdf" ||
        selectedFile.type.startsWith("image/");

      if (!isValidFileType) {
        toast.error("Format file tidak valid", {
          description: "Harap unggah file PDF atau gambar",
        });
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSize) {
        toast.error("Ukuran file terlalu besar", {
          description: "Maksimal ukuran file adalah 5MB",
        });
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
      
      // Set file type
      if (selectedFile.type === "application/pdf") {
        setFileType("pdf");
        setFilePreview(null); // Can't preview PDF directly
      } else {
        setFileType("image");
        // Create a preview for images
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      }
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
    setFilePreview(null);
    setFileType(null);
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
    console.log("localTransaction", localTransaction);

    if (!mahasiswaId) {
      toast.error("ID mahasiswa tidak ditemukan");
      return;
    }

    setIsUploading(true);

    try {
      // Use the API client to upload
      const response = await api.transaction.uploadReceipt({
        formData: {
          id: localTransaction.id,
          paidFor: selectedPaidFor,
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
      setFilePreview(null);
      setFileType(null);
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
          <DialogTitle className="text-center text-xl font-bold text-[#0A2463]">
            Unggah Bukti Pembayaran
          </DialogTitle>
          <DialogDescription className="text-center">
            Unggah bukti pembayaran untuk mahasiswa {localTransaction.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Preview */}
          {filePreview && fileType === "image" && (
            <div className="rounded-md border border-gray-200 p-2">
              <p className="mb-2 text-sm font-medium text-gray-700">Preview:</p>
              <div className="flex justify-center">
                <img 
                  src={filePreview}
                  alt="Preview bukti pembayaran" 
                  className="max-h-40 rounded-md object-contain"
                />
              </div>
            </div>
          )}

          {fileType === "pdf" && fileName && (
            <div className="flex items-center gap-2 rounded-md border border-gray-200 p-2">
              <FileText className="h-6 w-6 text-blue-700" />
              <div>
                <p className="text-sm font-medium text-gray-700">File PDF:</p>
                <p className="text-xs text-gray-500">{fileName}</p>
              </div>
            </div>
          )}

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
              {fileType === "image" ? (
                <Image className="text-muted-foreground h-8 w-8" />
              ) : fileType === "pdf" ? (
                <FileText className="text-muted-foreground h-8 w-8" />
              ) : (
                <FileUp className="text-muted-foreground h-8 w-8" />
              )}
              
              <p className="text-sm font-medium">
                {isDragging
                  ? "Geser berkas kesini untuk upload"
                  : fileName || "Klik untuk upload atau drag & drop"}
              </p>
              {fileName && !filePreview && (
                <p className="text-muted-foreground mt-1 text-xs">
                  File terpilih: {fileName}
                </p>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                {fileName ? "Ganti File" : "Pilih Bukti Pembayaran"}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4 flex gap-2">
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