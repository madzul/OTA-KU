import Metadata from "@/components/metadata";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/persetujuan-asuh/")({
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
      <Metadata title="Persetujuan Asuh | BOTA" />
      Hello "/_app/persetujuan-asuh/"! Halaman ini hanya bisa diakses oleh admin
    </main>
  );
}
