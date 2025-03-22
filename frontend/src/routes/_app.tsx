import { queryClient } from "@/api/client";
import { UserSchema } from "@/api/generated";
import SessionProvider from "@/components/session";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
  loader: () => {
    const queryClientUser = queryClient.getQueryData<UserSchema | null>([
      "verify",
    ]);

    if (queryClientUser === null) {
      throw redirect({ to: "/auth/login" });
    }

    if (queryClientUser) {
      queryClient.setQueryData(["verify"], queryClientUser);
    }
  },
});

function AppLayout() {
  return (
    <SessionProvider>
      <Outlet />
    </SessionProvider>
  );
}
