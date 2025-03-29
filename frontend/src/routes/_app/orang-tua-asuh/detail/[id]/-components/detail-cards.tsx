import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail, Phone } from "lucide-react";
import React from "react";

interface DetailCardsOrangTuaAsuhProps {
  name: string;
  role: string;
  email: string;
  phone: string;
  joinDate: string;
  avatarSrc?: string;
  occupation: string;
  beneficiary: number;
}

const DetailCardsOrangTuaAsuh: React.FC<DetailCardsOrangTuaAsuhProps> = ({
  name,
  role,
  email,
  phone,
  joinDate,
  avatarSrc,
  occupation,
  beneficiary,
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
      <Card className="mx-auto w-full max-w-sm">
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
                {name.charAt(0)}
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
            <div className="flex items-center space-x-3">
              <Mail className="text-muted-foreground h-5 w-5" />
              <span>{email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="text-muted-foreground h-5 w-5" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="text-muted-foreground h-5 w-5" />
              <span>{joinDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
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
                  <span className="font-semibold">Jumlah Mahasiswa Asuh:</span>
                  <span>{beneficiary}</span>
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
              <div className="xl:text-md space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">Status Pendaftaran:</span>
                  <span>Aktif</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">Tanggal Pendaftaran:</span>
                  <span>1 Januari 2024</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">Tanggal Pembaruan:</span>
                  <span>1 Maret 2024</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default DetailCardsOrangTuaAsuh;
