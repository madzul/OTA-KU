import Metadata from "@/components/metadata";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import { DaftarTagihanPage } from "./-components/DaftarTagihan";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const Route = createFileRoute("/_app/daftar-tagihan/")({
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
    <main className="flex min-h-[calc(100vh-70px)] flex-col gap-4 p-2 px-6 py-16 md:px-12 lg:min-h-[calc(100vh-96px)]">
      <Metadata title="Daftar Tagihan | BOTA" />
      <DaftarTagihanPage />
    </main>
  );
}
