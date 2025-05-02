import { createFileRoute, redirect } from "@tanstack/react-router";

import DaftarMahasiswa from "./-components.tsx/DaftarMahasiswa";

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
    <div>
      <DaftarMahasiswa session={session} />
    </div>
  );
}
