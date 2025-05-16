import { api } from "@/api/client";
import { MyOtaDetailResponse } from "@/api/generated";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SessionContext } from "@/context/session";
import { censorEmail } from "@/lib/formatter";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  CircleDollarSign,
  Mail,
  Phone,
} from "lucide-react";
import React, { useContext, useState } from "react";

const DetailCardsOrangTuaAsuh: React.FC<MyOtaDetailResponse> = ({
  id,
  name,
  email,
  phoneNumber,
  transferDate,
  isDetailVisible,
  createdAt,
}) => {
  const session = useContext(SessionContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reqTerminateOTA = useMutation({
    mutationFn: (data: { otaId: string }) => {
      return api.terminate.requestTerminateFromMa({
        formData: {
          // TODO: Nanti tambahin input catatan terminasi
          requestTerminationNote: "Pengakhiran hubungan asuh",
          mahasiswaId: session?.id ? session.id : "",
          otaId: data.otaId,
        },
      });
    },
    onSuccess: () => {
      setIsModalOpen(false);
    },
  });

  const handleTerminate = () => {
    reqTerminateOTA.mutate({ otaId: id });
  };

  const { data: terminationData } = useQuery({
    queryKey: ["terminationData"],
    queryFn: () => api.terminate.terminationStatusMa(),
  });

  return (
    <div className="flex w-full max-w-[300px] justify-center">
      <div className="flex w-full flex-col gap-4">
        <Card className="mx-auto w-full md:max-w-sm">
          <CardHeader className="flex flex-col items-center justify-center pt-6 pb-4">
            <div className="mb-4 h-24 w-24 overflow-hidden rounded-full bg-gray-100">
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-400">
                {name.charAt(0)}
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold xl:text-xl">{name}</h2>
              <p className="text-muted-foreground">Orang Tua Asuh</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-primary space-y-3 text-sm xl:text-base">
              <div className="flex items-start space-x-3">
                <Mail className="text-muted-foreground h-5 w-5" />
                <a
                  href={isDetailVisible ? `mailto:${email}` : "#"}
                  target={isDetailVisible ? "_blank" : "_self"}
                  className="text-sm"
                >
                  {isDetailVisible ? email : censorEmail(email)}
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="text-muted-foreground h-5 w-5" />
                <a
                  href={isDetailVisible ? `https://wa.me/${phoneNumber}` : "#"}
                  target={isDetailVisible ? "_blank" : "_self"}
                  className="text-sm"
                >
                  +{isDetailVisible ? phoneNumber : "**********"}
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <CircleDollarSign className="text-muted-foreground min-h-5 min-w-5" />
                <span className="text-sm">
                  Bantuan dikirim tanggal {transferDate} untuk setiap bulan
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="text-muted-foreground h-5 w-5" />
                <span className="text-sm">
                  Terdaftar sejak{" "}
                  {new Date(createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Button
          className="rounded-xl transition-colors hover:bg-red-600 focus:ring-2 focus:ring-red-300 focus:outline-none active:bg-red-700"
          variant={"destructive"}
          disabled={terminationData?.body.requestTerminateMA}
          onClick={() => setIsModalOpen(true)}
        >
          Akhiri Hubungan Asuh
        </Button>
        <p
          className={cn(
            terminationData?.body.requestTerminateMA
              ? "text-center text-sm"
              : "hidden",
          )}
        >
          Menunggu konfirmasi Admin
        </p>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Konfirmasi Pengakhiran Hubungan
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mengakhiri hubungan dengan orang tua asuh{" "}
              <span className="font-bold">{name}</span>?
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm text-gray-500">
            Tindakan ini akan mengakhiri hubungan Anda dengan orang tua asuh.
            Setelah pengakhiran hubungan, Anda tidak akan lagi dapat menerima
            beasiswa dari orang tua asuh.
          </p>

          <DialogFooter className="grid grid-cols-2 gap-2 sm:gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-gray-300 hover:bg-gray-50 active:bg-gray-100"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleTerminate}
              className="bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-300 focus:outline-none active:bg-red-700"
            >
              Ya, Akhiri Hubungan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailCardsOrangTuaAsuh;
