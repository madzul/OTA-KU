import { api, queryClient } from "@/api/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function Combobox({
  id,
  name,
  email,
  status,
  type,
}: {
  id: string;
  name: string;
  email: string;
  status: "pending" | "accepted" | "rejected";
  type: "mahasiswa" | "ota";
}) {
  const [openAccept, setOpenAccept] = useState(false);
  const [openReject, setOpenReject] = useState(false);

  const applicationStatusCallbackMutation = useMutation({
    mutationFn: (status: "accepted" | "rejected") => {
      return api.status.applicationStatus({
        formData: { status },
        id: id,
      });
    },
    onSuccess: (_data, _variables, context) => {
      toast.dismiss(context);
      toast.success("Berhasil mengubah status", {
        description: "Status berhasil diubah",
      });
    },
    onError: (_error, _variables, context) => {
      toast.dismiss(context);
      toast.warning("Gagal mengubah status", {
        description: "Silakan coba lagi",
      });
    },
    onMutate: () => {
      const loading = toast.loading("Sedang mengubah status...", {
        description: "Mohon tunggu sebentar",
        duration: Infinity,
      });
      return loading;
    },
  });

  return (
    <div className="flex gap-6">
      {status === "pending" ? (
        <>
          <Dialog open={openAccept} onOpenChange={setOpenAccept}>
            <DialogTrigger>
              <CircleCheck className="text-succeed h-5 w-5 hover:cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apakah Anda yakin?</DialogTitle>
                <DialogDescription>
                  Anda akan mengubah status pendaftaran <b>{name}</b> -{" "}
                  <b>{email}</b> menjadi <b>Terverifikasi</b>. Aksi ini tidak
                  dapat diubah setelah dilakukan. Apakah Anda yakin ingin
                  melanjutkan?
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  className="bg-succeed hover:bg-succeed"
                  onClick={async () => {
                    await applicationStatusCallbackMutation.mutateAsync(
                      "accepted",
                    );
                    if (type === "ota") {
                      await queryClient.invalidateQueries({
                        queryKey: ["listOrangTuaAdmin"],
                        refetchType: "active",
                      });
                    } else {
                      await queryClient.invalidateQueries({
                        queryKey: ["listMahasiswaAdmin"],
                        refetchType: "active",
                      });
                    }
                  }}
                >
                  Ya
                </Button>
                <Button
                  className="bg-destructive hover:bg-destructive"
                  onClick={() => setOpenAccept(false)}
                >
                  Tidak
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={openReject} onOpenChange={setOpenReject}>
            <DialogTrigger>
              <CircleX className="text-destructive h-5 w-5 hover:cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Apakah Anda yakin?</DialogTitle>
                <DialogDescription>
                  Anda akan mengubah status pendaftaran <b>{name}</b> -{" "}
                  <b>{email}</b> menjadi <b>Tertolak</b>. Aksi ini tidak dapat
                  diubah setelah dilakukan. Apakah Anda yakin ingin melanjutkan?
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  className="bg-succeed hover:bg-succeed"
                  onClick={async () => {
                    await applicationStatusCallbackMutation.mutateAsync(
                      "rejected",
                    );
                    if (type === "ota") {
                      await queryClient.invalidateQueries({
                        queryKey: ["listOrangTuaAdmin"],
                        refetchType: "active",
                      });
                    } else {
                      await queryClient.invalidateQueries({
                        queryKey: ["listMahasiswaAdmin"],
                        refetchType: "active",
                      });
                    }
                  }}
                >
                  Ya
                </Button>
                <Button
                  className="bg-destructive hover:bg-destructive"
                  onClick={() => setOpenReject(false)}
                >
                  Tidak
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : status === "accepted" ? (
        <CircleCheck className="text-succeed h-5 w-5" />
      ) : (
        <CircleX className="text-destructive h-5 w-5" />
      )}
    </div>
  );
}

export default Combobox;
