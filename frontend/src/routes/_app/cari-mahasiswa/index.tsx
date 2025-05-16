import Metadata from "@/components/metadata";
import { createFileRoute, redirect } from "@tanstack/react-router";

import DaftarMahasiswa from "./-components/DaftarMahasiswa";

// TODO: add state checker for all routes, also add toast messages if user can't access the route
export const Route = createFileRoute("/_app/cari-mahasiswa/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = context.session;

    if (!user) {
      throw redirect({ to: "/auth/login" });
    }

    if (user.type !== "ota") {
      throw redirect({ to: "/" });
    }

    return { session: user };
  },
  loader: async ({ context }) => {
    return { session: context.session };
  },
});

function RouteComponent() {
  const { session } = Route.useLoaderData();

  return (
    <main className="flex min-h-[calc(100vh-70px)] flex-col p-2 px-6 py-8 md:px-12 lg:min-h-[calc(100vh-96px)]">
      <Metadata title="Cari Mahasiswa | BOTA" />
      <DaftarMahasiswa session={session} />
    </main>
  );
}
