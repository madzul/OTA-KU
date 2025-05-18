import { api, queryClient } from "@/api/client";
import { AllAccountListElement } from "@/api/generated";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

function DeleteAccountDialog({
  account,
  setOpen,
}: {
  account: AllAccountListElement;
  setOpen: (open: boolean) => void;
}) {
  const navigate = useNavigate();

  const deleteAccountCallbackMutation = useMutation({
    mutationKey: ["deleteAccount", account.id],
    mutationFn: () => api.profile.deleteAccount({ id: account.id }),
    onSuccess: (_data, _variables, context) => {
      toast.dismiss(context);
      toast.success("Berhasil menghapus akun", {
        description: "Akun berhasil dihapus",
      });
      queryClient.invalidateQueries({
        queryKey: ["listAllAccount"],
        exact: false,
      });
      navigate({
        to: "/manajemen-akun",
        search: {
          page: 1,
        },
      });
    },
    onError: (error, _variables, context) => {
      toast.dismiss(context);
      toast.warning("Gagal menghapus akun", {
        description: error.message,
      });
    },
    onMutate: () => {
      const loading = toast.loading("Sedang menghapus akun...", {
        description: "Mohon tunggu sebentar",
        duration: Infinity,
      });
      return loading;
    },
  });

  return (
    <DialogContent className="flex max-h-8/12 flex-col sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-[#003A6E]">
          Hapus Akun
        </DialogTitle>
      </DialogHeader>

      <p className="text-sm text-gray-500">
        Apakah Anda yakin ingin menghapus akun ini? Semua data yang terkait
        dengan akun ini akan dihapus secara <b>permanen</b> dan tidak dapat
        dipulihkan.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="submit"
          onClick={() => {
            deleteAccountCallbackMutation.mutate();
            setOpen(false);
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
  );
}

export default DeleteAccountDialog;
