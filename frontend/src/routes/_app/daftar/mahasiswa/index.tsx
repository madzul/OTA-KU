import MahasiswaCard from "@/components/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/daftar/mahasiswa/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <MahasiswaCard
        name="michael"
        smt={1}
        faculty="fik"
        money={100000}
        link="/_app/profile/"
      />
    </div>
  );
}
