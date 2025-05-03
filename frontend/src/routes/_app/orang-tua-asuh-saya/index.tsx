import Metadata from "@/components/metadata";
import { createFileRoute, redirect } from "@tanstack/react-router";

import DaftarOrangTua from "./-components.tsx/DaftarOrangTua";

export const Route = createFileRoute("/_app/orang-tua-asuh-saya/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = context.session;

    if (!user) {
      throw redirect({ to: "/auth/login" });
    }

    if (user.type !== "mahasiswa") {
      throw redirect({ to: "/" });
    }

    return { user };
  },
});

function RouteComponent() {
  return (
    <main className="flex min-h-[calc(100vh-70px)] flex-col p-2 px-6 py-8 md:px-12 lg:min-h-[calc(100vh-96px)]">
      <Metadata title="Orang Tua Asuh Saya | BOTA" />
      <DaftarOrangTua />
    </main>
  );
}
