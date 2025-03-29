import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Mail, Phone } from "lucide-react";
import React from "react";

interface DetailCardsMahasiswaAsuhProps {
  name: string;
  role: string;
  email: string;
  phone: string;
  joinDate: string;
  avatarSrc?: string;
  departement: string;
  faculty: string;
  batch: string;
  gpa?: number;
}

const DetailCardsMahasiswaAsuh: React.FC<DetailCardsMahasiswaAsuhProps> = ({
  name,
  role,
  email,
  phone,
  joinDate,
  avatarSrc,
  departement,
  faculty,
  batch,
  gpa,
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

      <Card className="text-primary w-full">
        <div className="space-y-3 p-4">
          <h3 className="mb-8 text-lg font-bold xl:text-xl">Data Diri</h3>
          <div className="xl:text-md space-y-2">
            <div className="flex items-center space-x-3">
              <span className="font-semibold">Departemen:</span>
              <span>{departement}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-semibold">Fakultas:</span>
              <span>{faculty}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="font-semibold">Angkatan:</span>
              <span>{batch}</span>
            </div>
            {gpa && (
              <div className="flex items-center space-x-3">
                <span className="font-semibold">IPK:</span>
                <span>{gpa}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DetailCardsMahasiswaAsuh;
