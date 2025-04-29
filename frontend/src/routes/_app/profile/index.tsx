import { SessionContext } from "@/context/session";
import { createFileRoute } from "@tanstack/react-router";
import { Navigate } from "@tanstack/react-router";
import { useContext } from "react";

import ProfileMahasiswa from "./-components/profile-mahasiswa";
import ProfileOta from "./-components/profile-ota";

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
    return <ProfileMahasiswa session={session} />;
  }

  // For OTA users
  else if (session?.type === "ota") {
    return <ProfileOta session={session} />;
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
