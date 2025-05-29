"use client";

import { api } from "@/api/client";
import { ListTerminateForAdmin } from "@/api/generated";
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

interface TerminasiModalProps {
  mode: "accept" | "reject";
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: ListTerminateForAdmin;
}

export default function TerminasiModal({
  mode,
  isOpen,
  onClose,
  onConfirm,
  item,
}: TerminasiModalProps) {
  const terminateConnection = useMutation({
    mutationFn: (data: { maId: string; otaId: string }) => {
      return api.terminate.validateTerminate({
        formData: {
          mahasiswaId: data.maId,
          otaId: data.otaId,
        },
      });
    },
    onSuccess: () => {
      // Call onConfirm to refresh the data after successful termination
      onConfirm();
      onClose();
    },
  });

  const cancleTerminateConnection = useMutation({
    mutationFn: (data: { maId: string; otaId: string }) => {
      return api.terminate.rejectTerminate({
        formData: {
          mahasiswaId: data.maId,
          otaId: data.otaId,
        },
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
          {mode === "accept" ? (
            <DialogTitle className="text-destructive text-xl font-semibold">
              Konfirmasi Terminasi
            </DialogTitle>
          ) : (
            <DialogTitle className="text-dark text-xl font-semibold">
              Konfirmasi Tolak Terminasi
            </DialogTitle>
          )}
          <DialogDescription className="text-gray-600 text-justify">
            {mode === "accept"
              ? "Apakah Anda yakin ingin melakukan terminasi hubungan asuh antara OTA dan Mahasiswa berikut?"
              : "Apakah Anda yakin ingin menolak permintaan terminasi hubungan asuh antara OTA dan Mahasiswa berikut?"}
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
        <DialogFooter className="flex flex-row space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Batal
          </Button>
          {mode === "accept" ? (
            <Button
              variant="destructive"
              onClick={() => {
                cancleTerminateConnection.mutate({
                  maId: item.mahasiswaId,
                  otaId: item.otaId,
                });
              }}
              className="flex-1"
              disabled={terminateConnection.isPending}
            >
              {terminateConnection.isPending ? "Memproses..." : "Terminasi"}
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={() => {
                cancleTerminateConnection.mutate({
                  maId: item.mahasiswaId,
                  otaId: item.otaId,
                });
              }}
              disabled={terminateConnection.isPending}
              className="sm:flex-1"
            >
              {terminateConnection.isPending
                ? "Memproses..."
                : "Tolak Terminasi"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
