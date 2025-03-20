import { queryClient } from "@/api/client";
import Footer from "@/components/ui/footer";
import NavBar from "@/components/ui/navbar";
import { QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <QueryClientProvider client={queryClient}>
        <NavBar />
        <Outlet />
        <Footer />
      </QueryClientProvider>
      <TanStackRouterDevtools />
    </>
  ),
  // TODO: Nanti ganti pake component yang bener
  notFoundComponent: () => <div>Not Found</div>,
});
