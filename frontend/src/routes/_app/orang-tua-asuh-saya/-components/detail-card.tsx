import { api } from "@/api/client";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionContext } from "@/context/session";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Calendar, Mail, Phone, User } from "lucide-react";
import React, { useContext, useState } from "react";

interface DetailCardsOrangTuaAsuhProps {
  otaId: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  joinDate: string;
  avatarSrc?: string;
  occupation: string;
  beneficiary: number;
  address: string;
  linkage: string;
  funds: number;
  maxCapacity: number;
  maxSemester: number;
  transferDate: number;
  criteria: string;
}

const DetailCardsOrangTuaAsuh: React.FC<DetailCardsOrangTuaAsuhProps> = ({
  otaId,
  name,
  role,
  email,
  phone,
  joinDate,
  avatarSrc,
  occupation,
  beneficiary,
  address,
  linkage,
  funds,
  maxCapacity,
  maxSemester,
  transferDate,
  criteria,
}) => {
  const session = useContext(SessionContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reqTerminateOTA = useMutation({
    mutationFn: (data: { otaId: string }) => {
      return api.terminate.requestTerminateFromMa({
        formData: {
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
    reqTerminateOTA.mutate({ otaId: otaId });
  };

  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
      <div className="flex flex-col gap-4">
        <Card className="mx-auto w-full md:max-w-sm">
          <CardHeader className="flex flex-col items-center justify-center pt-6 pb-4">
            <div className="mb-4 h-24 w-24 overflow-hidden rounded-full">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={`${name}'s avatar`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold xl:text-xl">{name}</h2>
              <p className="text-muted-foreground mt-4 rounded-xl border-2 px-6 py-1">
                {role}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-primary space-y-3 text-sm xl:text-base">
              <div className="flex items-start space-x-3">
                <Mail className="text-primary mt-0.5 h-5 w-5" />
                <span className="text-primary break-all">{email}</span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="text-primary mt-0.5 h-5 w-5" />
                <span>{phone}</span>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="text-primary mt-0.5 h-5 w-5" />
                <span>{joinDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Button
          className="rounded-xl transition-colors hover:bg-red-600 focus:ring-2 focus:ring-red-300 focus:outline-none active:bg-red-700"
          variant={"destructive"}
          onClick={() => setIsModalOpen(true)}
        >
          Terminasi Hubungan
        </Button>
      </div>
      <Tabs defaultValue="personalInfo" className="w-full">
        <TabsList className="bg-placeholder grid w-full grid-cols-2">
          <TabsTrigger value="personalInfo" className="text-primary">
            Data Diri
          </TabsTrigger>
          <TabsTrigger value="sponsorshipDetails" className="text-primary">
            Detail Pendaftaran
          </TabsTrigger>
        </TabsList>

        <Card className="text-primary w-full">
          {/* Personal Info Tab */}
          <TabsContent value="personalInfo">
            <div className="space-y-3 p-4">
              <h3 className="mb-8 text-lg font-bold xl:text-xl">Data Diri</h3>
              <div className="xl:text-md space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">Pekerjaan:</span>
                  <span>{occupation}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">Alamat:</span>
                  <span>{address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">Tipe Keterkaitan:</span>
                  <span>
                    {linkage === "otm"
                      ? "OTM"
                      : linkage === "alumni"
                        ? "Alumni"
                        : linkage === "dosen"
                          ? "Dosen"
                          : linkage === "lainnya"
                            ? "Lainnya"
                            : "Tidak Ada"}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">Jumlah Mahasiswa Asuh:</span>
                  <span>{beneficiary}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">Kapasitas Maksimal:</span>
                  <span>{maxCapacity}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Sponsorship Details Tab */}
          <TabsContent value="sponsorshipDetails">
            <div className="space-y-3 p-4">
              <h3 className="mb-8 text-lg font-bold xl:text-xl">
                Detail Pendaftaran
              </h3>
              <div className="xl:text-md space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">Dana Beasiswa:</span>
                  <span>Rp {funds.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">Maksimum Semester:</span>
                  <span>{maxSemester} semester</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">Tanggal Transfer:</span>
                  <span>Setiap tanggal {transferDate}</span>
                </div>
                <div className="space-y-2">
                  <span className="font-semibold">Kriteria:</span>
                  <p className="text-muted-foreground mt-1">{criteria}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Card>
      </Tabs>

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Konfirmasi Terminasi Hubungan
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mengakhiri hubungan dengan orang tua asuh{" "}
              <span className="font-bold">{name}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500">
              Tindakan ini akan mengakhiri hubungan Anda dengan orang tua asuh
              ini. Setelah terminasi, Anda tidak akan lagi dapat menerima
              beasiswa dari orang tua asuh ini.
            </p>
          </div>
          <DialogFooter className="flex justify-end gap-2 sm:justify-end">
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
              wYa, Terminasi Hubungan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailCardsOrangTuaAsuh;
