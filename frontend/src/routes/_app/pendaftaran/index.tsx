import { SessionContext } from "@/context/session";
import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";

import PendaftaranMahasiswa from "./-components/pendaftaran-mahasiswa";
import PendaftaranOrangTua from "./-components/pendaftaran-orang-tua";

export const Route = createFileRoute("/_app/pendaftaran/")({
  component: RouteComponent,
});

function RouteComponent() {
  const session = useContext(SessionContext);

  const isAdmin = session?.type === "admin";

  const {
    data: applicationStatusData,
    isLoading,
  } = useQuery({
    queryKey: ["applicationStatus", session?.id],
    queryFn: () =>
      api.status.applicationStatus({ id: session?.id || "" }).catch(() => null),
    enabled: !!session?.id && !isAdmin, // Jangan jalankan query kalau admin
  });

  if (isAdmin) {
    return <Navigate to="/profile" />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const applicationStatus = applicationStatusData?.body?.status;

  // LOG APPLICATION STATUS
  console.log("Application Status:", applicationStatus);

  if (applicationStatus === "pending") {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-center text-2xl font-bold text-primary">
          Anda sudah mendaftar
        </h1>
        <p className="mt-4 text-center text-lg">
          Pendaftaran akan diproses selama dua hari maksimal. Jika sudah
          melewati waktu tersebut, silakan hubungi WhatsApp{" "}
          <a
            href="https://wa.me/6285624654990"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            +62 856-2465-4990
          </a>
          .
        </p>
      </div>
    );
  }

  if (applicationStatus === "rejected") {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-center text-2xl font-bold text-primary">
          Maaf, pendaftaran anda ditolak
        </h1>
        <p className="mt-4 text-center text-lg">
          Maaf pendaftaran anda ditolak oleh pengurus BOTA (admin) karena suatu
          alasan. Jika terdapat kesalahan, silakan hubungi WhatsApp{" "}
          <a
            href="https://wa.me/6285624654990"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            +62 856-2465-4990
          </a>
          .
        </p>
      </div>
    );
  }

  return session?.type === "mahasiswa" ? (
    <PendaftaranMahasiswa session={session} />
  ) : (
    <PendaftaranOrangTua />
  );
}
