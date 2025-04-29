import { api } from "@/api/client";
import { UserSchema } from "@/api/generated";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import ProfileCard from "./profile-card";
import ProfileFormOTA from "./profile-form-ota";

function ProfileOta({ session }: { session: UserSchema }) {
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["otaProfile", session?.id],
    queryFn: () => api.profile.profileOrangTua({ id: session?.id ?? "" }),
    enabled: !!session?.id,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <p className="text-primary mb-6 text-4xl font-bold">Profile</p>
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-52 w-full" />
            </div>
          ) : (
            <ProfileCard
              name={profileData?.body?.name || "Orang Tua Asuh"}
              role="Orang Tua Asuh"
              email={session.email}
              phone={
                profileData?.body?.phone_number || session.phoneNumber || "-"
              }
              joinDate={profileData?.body?.join_date || "Belum tersedia"}
            />
          )}
        </div>
        <div>
          <ProfileFormOTA />
        </div>
      </div>
    </div>
  );
}

export default ProfileOta;
