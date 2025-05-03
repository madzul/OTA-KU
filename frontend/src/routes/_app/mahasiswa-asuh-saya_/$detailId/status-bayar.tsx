import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_app/mahasiswa-asuh-saya_/$detailId/status-bayar",
)({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = context.session;

    if (!user) {
      throw redirect({ to: "/auth/login" });
    }

    if (user.type !== "ota") {
      throw redirect({ to: "/" });
    }

    return { user };
  },
});

function RouteComponent() {
  return (
    <div>
      Hello "/_app/mahasiswa-asuh-saya_/$detailId/status-bayar"! Halaman ini
      hanya bisa dilihat oleh verified OTA yang mengasuh mahasiswa ini
    </div>
  );
}
