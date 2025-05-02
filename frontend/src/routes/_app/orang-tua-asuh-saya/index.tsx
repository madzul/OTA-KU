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
    <div className="container py-8">
      <DaftarOrangTua />
    </div>
  );
}
