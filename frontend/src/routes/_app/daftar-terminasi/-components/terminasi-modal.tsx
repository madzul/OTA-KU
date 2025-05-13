"use client";

import { api } from "@/api/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";

interface TerminasiData {
  otaId: string;
  otaName: string;
  otaNumber: string;
  mahasiswaId: string;
  maName: string;
  maNIM: string;
  createdAt: string;
  requestTerminateOTA: boolean;
  requestTerminateMA: boolean;
}

interface TerminasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: TerminasiData;
}

export default function TerminasiModal({
  isOpen,
  onClose,
  onConfirm,
  item,
}: TerminasiModalProps) {
  const terminateConnection = useMutation({
    mutationFn: (data: { maId: string; otaId: string }) => {
      return api.terminate.validateTerminate({
        formData: { mahasiswaId: data.maId, otaId: data.otaId },
      });
    },
    onSuccess: () => {
      // Call onConfirm to refresh the data after successful termination
      onConfirm();
      onClose();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive text-xl font-semibold">
            Konfirmasi Terminasi
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Apakah Anda yakin ingin melakukan terminasi hubungan antara OTA dan
            Mahasiswa berikut?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-semibold text-gray-700">OTA:</div>
            <div className="text-gray-800">{item.otaName}</div>

            <div className="font-semibold text-gray-700">Nomor OTA:</div>
            <div className="text-gray-800">{item.otaNumber}</div>

            <div className="font-semibold text-gray-700">Mahasiswa:</div>
            <div className="text-gray-800">{item.maName}</div>

            <div className="font-semibold text-gray-700">NIM:</div>
            <div className="text-gray-800">{item.maNIM}</div>
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700"
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              terminateConnection.mutate({
                maId: item.mahasiswaId,
                otaId: item.otaId,
              });
            }}
            className="border border-red-300 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
            disabled={terminateConnection.isPending}
          >
            {terminateConnection.isPending ? "Memproses..." : "Terminasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
