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
import { SessionContext } from "@/context/session";
import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { toast } from "sonner";

function MahasiswaCard({
  name = "Name not found",
  angkatan = "0",
  faculty = "faculty not found",
  link = "/profile/not-found",
  id = "",
}: {
  name: string;
  angkatan: string;
  faculty: string;
  link: string;
  id: string;
}) {
  const session = useContext(SessionContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const bantuHandler = useMutation({
    mutationFn: (id: { mahasiswa: string; ota: string }) => {
      console.log(id);
      return api.connect.connectOtaMahasiswa({
        formData: {
          mahasiswaId: id.mahasiswa,
          otaId: id.ota,
        },
      });
    },
    onSuccess: (_data, _variables, context: string | number | undefined) => {
      toast.dismiss(context);
      toast.success("Berhasil melakukan permintaan Bantuan Orang Tua Asuh", {
        description: "Permintaan akan segera diproses oleh IOM ITB",
      });
      setIsDialogOpen(false);
    },
    onError: (_error, _variables, context: string | number | undefined) => {
      toast.dismiss(context);
      toast.warning("Gagal melakukan permintaan Bantuan Orang Tua Asuh", {
        // description: "Silakan coba lagi",
        description: _error.message,
      });
      setIsDialogOpen(false);
    },
  });

  const handleBantuConfirm = () => {
    bantuHandler.mutate({
      mahasiswa: id,
      ota: session?.id || "",
    });
  };

  return (
    <>
      <div className="flex h-fit w-full min-w-[330px] flex-col gap-[18px] rounded-[12px] bg-white px-6 py-6 shadow-[0_0_6px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col gap-2">
          {/* Name and angkatan */}
          <div className="flex flex-col justify-between">
            <h5 className="text-[20px] font-bold text-black">
              {name
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
                .slice(0, 20) + (name.length > 20 ? "..." : "")}
            </h5>
            <span className="bg-dark/20 text-dark h-fit w-fit rounded-[4.58px] px-3 py-1 text-[14px] font-medium">
              Angkatan {angkatan}
            </span>
          </div>
          {/* Fakultas */}
          <span className="text-[14px] font-medium text-black/70">
            {faculty}
          </span>
        </div>

        {/* Button */}
        <div className="grid w-full grid-cols-2 gap-4">
          <Button
            variant={"outline"}
            onClick={() => (window.location.href = link)}
            className="h-10 w-full text-sm"
          >
            Lihat Profil
          </Button>
          <Button
            className="h-10 w-full text-sm"
            onClick={() => setIsDialogOpen(true)}
          >
            Bantu
          </Button>
        </div>
      </div>

      {/* Verification Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Bantuan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin memberikan bantuan kepada{" "}
              <span className="text-dark font-bold">{name}</span> ?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              className="sm:flex-1"
              onClick={() => setIsDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleBantuConfirm}
              disabled={bantuHandler.isPending}
              className="sm:flex-1"
            >
              {bantuHandler.isPending ? "Memproses..." : "Bantu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MahasiswaCard;
