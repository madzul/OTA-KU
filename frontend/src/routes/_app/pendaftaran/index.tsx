import { SessionContext } from "@/context/session";
import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useContext } from "react";

import PendaftaranMahasiswa from "./-components/pendaftaran-mahasiswa";
import PendaftaranOrangTua from "./-components/pendaftaran-orang-tua";

export const Route = createFileRoute("/_app/pendaftaran/")({
  component: RouteComponent,
});

function RouteComponent() {
  const session = useContext(SessionContext);

  if (session?.type === "admin") {
    return <Navigate to="/profile" />;
  }

  return session?.type === "mahasiswa" ? (
    <PendaftaranMahasiswa session={session} />
  ) : (
    <PendaftaranOrangTua />
  );
}
