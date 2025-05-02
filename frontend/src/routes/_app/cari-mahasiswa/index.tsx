import { createFileRoute, redirect } from "@tanstack/react-router";

import DaftarMahasiswa from "./-components.tsx/DaftarMahasiswa";

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
    <div>
      <DaftarMahasiswa session={session} />
    </div>
  );
}
