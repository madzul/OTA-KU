import { api, queryClient } from "@/api/client";
import { ConnectionListAllResponse } from "@/api/generated";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SessionContext } from "@/context/session";
import { cn } from "@/lib/utils";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";

function DeleteConnectionDialog({
  connection,
}: {
  connection: ConnectionListAllResponse;
}) {
  const session = useContext(SessionContext);
  const [open, setOpen] = useState(false);

  const deleteConnectionCallbackMutation = useMutation({
    mutationKey: ["deleteConnection"],
    mutationFn: () =>
      api.connect.deleteConnection({
        mahasiswaId: connection.mahasiswa_id,
        otaId: connection.ota_id,
      }),
    onSuccess: (_data, _variables, context) => {
      toast.dismiss(context);
      toast.success("Berhasil menghapus hubungan asuh", {
        description: "Hubungan asuh berhasil dihapus",
      });
      queryClient.invalidateQueries({
        queryKey: ["listAllConnection"],
        exact: false,
      });
      setOpen(false);
    },
    onError: (_error, _variables, context) => {
      toast.dismiss(context);
      toast.warning("Gagal menghapus hubungan asuh", {
        description: "Silakan coba lagi",
      });
    },
    onMutate: () => {
      const loading = toast.loading("Sedang menghapus hubungan asuh...", {
        description: "Mohon tunggu sebentar",
        duration: Infinity,
      });
      return loading;
    },
  });

  const isDisabled = session?.type !== "admin" && session?.type !== "bankes";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={isDisabled}>
        <Trash
          className={cn(
            "text-destructive h-5 w-5",
            !isDisabled && "hover:cursor-pointer",
          )}
        />
      </DialogTrigger>
      <DialogContent className="flex max-h-8/12 flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#003A6E]">
            Apakah Anda yakin?
          </DialogTitle>
          <DialogDescription>
            Anda akan menghapus hubungan asuh <b>{connection.name_ma}</b> dengan{" "}
            <b>{connection.name_ota}</b>. Aksi ini tidak dapat diubah setelah
            dilakukan. Notifikasi terkait pemberhentian hubungan asuh akan
            dikirimkan kepada kedua belah pihak melalui email. Apakah Anda yakin
            ingin melanjutkan?
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <Button
            type="submit"
            onClick={() => {
              deleteConnectionCallbackMutation.mutate();
            }}
          >
            Lanjutkan
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              setOpen(false);
            }}
          >
            Batal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteConnectionDialog;
