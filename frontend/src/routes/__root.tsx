// src/routes/__root.tsx
import { queryClient } from "@/api/client";
import Footer from "@/components/ui/footer";
import NavBar from "@/components/ui/navbar";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, useSidebar } from "@/context/sidebar";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

const RootComponent = () => {
  const { isSidebarOpen } = useSidebar();
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);

  // Handle screen size detection
  useEffect(() => {
    // Check initial screen size
    const checkScreenSize = () => {
      // lg breakpoint in Tailwind is 1024px
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    // Set initial value
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NavBar />
        <motion.div
          className="px-11 py-8"
          animate={{
            marginLeft: isLargeScreen && isSidebarOpen ? "255px" : "0px",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <Outlet />
        </motion.div>
        <Footer />
        <Toaster />

        <ReactQueryDevtools />
      </QueryClientProvider>
      {/* <TanStackRouterDevtools /> */}
    </>
  );
};

export const Route = createRootRoute({
  component: () => (
    <SidebarProvider>
      <RootComponent />
    </SidebarProvider>
  ),
  // TODO: Nanti ganti pake component yang bener
  notFoundComponent: () => <div>Not Found</div>,
});
