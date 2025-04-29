import { SessionContext } from "@/context/session";
import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useContext } from "react";

import PendaftaranMahasiswa from "./-components/pendaftaran-mahasiswa";
import PendaftaranOrangTua from "./-components/pendaftaran-orang-tua";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/pendaftaran/")({
  component: RouteComponent,
});

function RouteComponent() {
  const session = useContext(SessionContext);

  const isAdmin = session?.type === "admin";

  if (isAdmin) {
    toast.error("Anda tidak diperbolehkan mengakses halaman ini");
    return <Navigate to="/" />;
  }

  const applicationStatus = session?.applicationStatus;

  // TODO: Handle applicationStatus === "reapply"
  if (applicationStatus === "accepted") {
    toast.success("Anda sudah mendaftar dan telah terverifikasi oleh Admin");
    return <Navigate to="/profile" />;
  }

  // TODO: Kayanya better ngeceknya jangan pake session, soalnya kalo belom logout sessionnya ga berubah

  // TODO: Sesuaiin datanya sesuai apa yang diinginkan IOM nanti
  if (applicationStatus === "pending") {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-primary text-center text-2xl font-bold">
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
        <h1 className="text-primary text-center text-2xl font-bold">
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
