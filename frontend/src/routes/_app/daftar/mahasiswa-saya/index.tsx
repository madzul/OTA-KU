import { createFileRoute } from "@tanstack/react-router";

import DaftarMahasiswaSaya from "./-components.tsx/DaftarMahasiswaSaya";

export const Route = createFileRoute("/_app/daftar/mahasiswa-saya/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <DaftarMahasiswaSaya />
    </div>
  );
}
