import { createFileRoute } from "@tanstack/react-router";

import DaftarMahasiswa from "./-components.tsx/DaftarMahasiswa";

export const Route = createFileRoute("/_app/daftar/mahasiswa/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <DaftarMahasiswa />
    </div>
  );
}
