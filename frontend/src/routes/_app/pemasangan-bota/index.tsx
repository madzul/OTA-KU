import { createFileRoute, redirect } from "@tanstack/react-router";

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
    <div>
      Hello "/_app/pemasangan-bota/"! Halaman ini hanya bisa diakses oleh admin
    </div>
  );
}
