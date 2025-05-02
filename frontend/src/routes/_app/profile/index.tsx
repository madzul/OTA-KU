import { createFileRoute, redirect } from "@tanstack/react-router";
import { Navigate } from "@tanstack/react-router";

import ProfileMahasiswa from "./-components/profile-mahasiswa";
import ProfileOta from "./-components/profile-ota";

export const Route = createFileRoute("/_app/profile/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = context.session;

    if (!user) {
      throw redirect({ to: "/auth/login" });
    }

    return { session: user };
  },
  loader: async ({ context }) => {
    return { session: context.session };
  },
});

function RouteComponent() {
  const { session } = Route.useLoaderData();

  // For mahasiswa users
  if (session.type === "mahasiswa") {
    return <ProfileMahasiswa session={session} />;
  }

  // For OTA users
  if (session.type === "ota") {
    return <ProfileOta session={session} />;
  }

  // Redirect if user is admin
  return <Navigate to="/" />;
}
