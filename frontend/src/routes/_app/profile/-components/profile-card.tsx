import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Mail, Phone } from "lucide-react";
import React from "react";

interface ProfileCardProps {
  name: string;
  role: string;
  email: string;
  phone: string;
  joinDate: string;
  avatarSrc?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name = "Budi Santoso",
  role = "Orang Tua Asuh",
  email = "Email@example.com",
  phone = "08129130321321",
  joinDate = "Bergabung di Maret 2024",
  avatarSrc,
}) => {
  return (
    <div>
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
    </div>
  );
};

export default ProfileCard;
