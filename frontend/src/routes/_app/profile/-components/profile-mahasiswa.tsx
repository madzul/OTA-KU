import { api } from "@/api/client";
import { UserSchema } from "@/api/generated";
import Metadata from "@/components/metadata";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { UserCog } from "lucide-react";
import { useState, useEffect } from "react";
import ProfileCard from "./profile-card";
import ChangePasswordForm from "./profile-change-password";
import ProfileFormMA from "./profile-form-ma";

function ProfileMahasiswa({
  session,
  applicationStatus,
}: {
  session: UserSchema;
  applicationStatus:
    | "accepted"
    | "rejected"
    | "pending"
    | "unregistered"
    | "reapply"
    | "outdated";
}) {
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [isWithin30Days, setIsWithin30Days] = useState(false);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["mahasiswaProfile", session.id],
    queryFn: () => api.profile.profileMahasiswa({ id: session.id }),
    enabled: !!session.id,
  });

  // Check if user is within 30 days of due date
  useEffect(() => {
    if (profileData?.success && profileData.body.dueNextUpdateAt) {
      const dueDate = new Date(profileData.body.dueNextUpdateAt);
      const currentDate = new Date();
      
      // Calculate days remaining until due date
      const timeDiff = dueDate.getTime() - currentDate.getTime();
      const remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // Check if less than 30 days remaining and status is accepted
      if (remainingDays <= 30 && applicationStatus === "accepted") {
        setIsWithin30Days(true);
      } else {
        setIsWithin30Days(false);
        setIsEditingEnabled(false); // Reset editing state if no longer within 30 days
      }
    }
  }, [profileData, applicationStatus]);

  const handleEnableEdit = () => {
    setIsEditingEnabled(true);
  };

  if (
    applicationStatus === "unregistered" ||
    applicationStatus === "outdated"
  ) {
    return (
      <main className="flex min-h-[calc(100vh-96px)] flex-col items-center justify-center gap-4 p-2 px-6 py-8 md:px-12">
        <Metadata title="Profile | BOTA" />
        <UserCog className="text-primary h-24 w-24" />
        <h2 className="text-2xl font-semibold">
          Anda belum melakukan pendaftaran
        </h2>
      </main>
    );
  }
 
  return (
    <main className="flex min-h-[calc(100vh-96px)] flex-col p-2 px-6 py-8 md:px-12">
      <Metadata title="Profile | BOTA" />
      <p className="text-primary mb-6 text-4xl font-bold">Profile</p>
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-52 w-full" />
            </div>
          ) : (
            <ProfileCard
              name={profileData?.body?.name || "Mahasiswa Asuh"}
              role="Mahasiswa"
              email={session.email}
              phone={profileData?.body?.phone_number || session.phoneNumber || "-"}
              joinDate={profileData?.body?.createdAt || "-"}
              dueNextUpdateAt={profileData?.body?.dueNextUpdateAt}
              applicationStatus={applicationStatus}
              onEnableEdit={handleEnableEdit}
              isEditingEnabled={isEditingEnabled}
            />
          )}
        </div>
        <div className="space-y-6">
          <ProfileFormMA 
            session={session} 
            isEditable={isEditingEnabled && isWithin30Days}
            isWithin30Days={isWithin30Days}
          />
          {/* Only show change password form for credentials provider */}
          {session.provider === "credentials" && (
            <ChangePasswordForm userId={session.id} />
          )}
        </div>
      </div>
    </main>
  );
}

export default ProfileMahasiswa;
