import Metadata from "@/components/metadata";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { PemasanganBOTA } from "./-components/pemasangan-bota";

export const Route = createFileRoute("/_app/pemasangan-bota/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = context.session;
    if (!user) {
      throw redirect({ to: "/auth/login" });
    }
    if (user.type !== "admin") {
      throw redirect({ to: "/" });
    }
    return { user };
  },
});

function RouteComponent() {
  return (
    <main>
      <Metadata title="Pemasangan Orang Tua Asuh | BOTA" />
      <h1 className="text-4xl font-bold text-primary m-10">Pemasangan Bantuan Orang Tua Asuh</h1>
      <PemasanganBOTA />
    </main>
  );
}