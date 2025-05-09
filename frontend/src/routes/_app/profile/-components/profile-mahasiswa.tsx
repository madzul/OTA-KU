import { api } from "@/api/client";
import { UserSchema } from "@/api/generated";
import Metadata from "@/components/metadata";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { UserCog } from "lucide-react";
import ProfileCard from "./profile-card";
import ProfileFormMA from "./profile-form-ma";
import ChangePasswordForm from "./profile-change-password";

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
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["mahasiswaProfile", session.id],
    queryFn: () => api.profile.profileMahasiswa({ id: session.id }),
    enabled: !!session.id,
  });

  if (applicationStatus === "unregistered") {
    return (
      <main className="flex min-h-[calc(100vh-96px)] flex-col items-center justify-center gap-4 p-2 px-6 py-8 md:px-12">
        <UserCog className="h-24 w-24 text-primary" />
        <h2 className="text-2xl font-semibold">Anda belum melakukan pendaftaran</h2>
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
              role="Mahasiswa Asuh"
              email={session.email}
              phone={
                profileData?.body?.phone_number || session.phoneNumber || "-"
              }
              joinDate={"Belum tersedia"}
            />
          )}
        </div>
        <div className="space-y-6">
          <ProfileFormMA session={session} />
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