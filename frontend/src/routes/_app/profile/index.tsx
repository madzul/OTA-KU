import { api } from "@/api/client";
import { SessionContext } from "@/context/session";
import { createFileRoute } from "@tanstack/react-router";
import { Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import ProfileCard from "./-components/profile-card";
import ProfileFormMA from "./-components/profile-form-ma";
import ProfileFormOTA from "./-components/profile-form-ota";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_app/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const session = useContext(SessionContext);

  // Redirect if user is admin
  if (session?.type === "admin") {
    return <Navigate to="/" />;
  }

  // For mahasiswa users
  if (session?.type === "mahasiswa") {
    const { data: profileData, isLoading } = useQuery({
      queryKey: ["mahasiswaProfile", session?.id],
      queryFn: () => api.profile.profileMahasiswa({ params: { id: session?.id ?? "" } }),
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
                name={profileData?.body?.name || "Mahasiswa Asuh"}
                role="Mahasiswa Asuh"
                email={session.email}
                phone={profileData?.body?.phone_number || session.phoneNumber || "-"}
                joinDate={"Belum tersedia"}
              />
            )}
          </div>
          <div>
            <ProfileFormMA />
          </div>
        </div>
      </div>
    );
  } 
  
  // For OTA users
  else if (session?.type === "ota") {
    const { data: profileData, isLoading } = useQuery({
      queryKey: ["otaProfile", session?.id],
      queryFn: () => api.profile.profileOrangTua({ params: { id: session?.id ?? "" } }),
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
                phone={profileData?.body?.phone_number || session.phoneNumber || "-"}
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
  
  // Fallback for users with no type set
  return (
    <div className="container mx-auto px-4 py-8">
      <p className="text-primary mb-6 text-4xl font-bold">Profile</p>
      <div className="p-8 text-center">
        <p>Tipe akun tidak dikenali. Silakan hubungi administrator.</p>
      </div>
    </div>
  );
}