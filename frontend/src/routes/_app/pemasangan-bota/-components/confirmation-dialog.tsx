import { api, queryClient } from "@/api/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

function ConfirmationDialog({
  onConfirmSuccess,
  selectedCount,
  otaName,
  otaId,
  selectedMahasiswa,
}: {
  onConfirmSuccess: () => void;
  selectedCount: number;
  otaName: string;
  otaId: string;
  selectedMahasiswa: Set<string>;
}) {
  const [isOpen, setOpen] = useState(false);

  console.log("otaId", otaId);
  console.log("selectedMahasiswa", selectedMahasiswa);

  const connectMutation = useMutation({
    mutationFn: async () => {
      const promises = [...selectedMahasiswa].map((mahasiswaId) =>
        api.connect.connectOtaMahasiswaByAdmin({
          formData: { otaId, mahasiswaId },
        }),
      );
      return Promise.all(promises);
    },
    onSuccess: (_, __, context) => {
      toast.dismiss(context); // Dismiss the loading toast
      toast.success("Berhasil memasangkan mahasiswa dengan OTA.");
      queryClient.invalidateQueries({
        queryKey: ["listMahasiswaOta"],
        refetchType: "active",
      });
      onConfirmSuccess();
      setOpen(false);
    },
    onError: (_error, __, context) => {
        console.error("Error:", _error);
      toast.dismiss(context); // Dismiss the loading toast
      toast.warning("Gagal memasangkan mahasiswa dengan OTA.");
    },
    onMutate: () => {
      const loading = toast.loading("Memasangkan mahasiswa dengan OTA...", {
        duration: Infinity,
      });
      return loading; // Pass the loading toast ID as context
    },
  });

  const handleConfirm = () => {
    connectMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="w-full max-w-3xs"
          onClick={() => {
            setOpen(true);
          }}
        >
          Pasangkan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Pemasangan</DialogTitle>
        </DialogHeader>
        <p>
          Apakah Anda yakin ingin memasangkan{" "}
          <span className="font-bold">{selectedCount}</span> mahasiswa dengan
          OTA <span className="font-bold">{otaName}</span>? Aksi ini tidak dapat
          dibatalkan.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="default" onClick={handleConfirm}>Yakin</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmationDialog;
