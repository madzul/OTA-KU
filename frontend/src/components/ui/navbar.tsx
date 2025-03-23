import { api } from "@/api/client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useSidebar } from "@/context/sidebar";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";

import Sidebar from "../sidebar";
import { Button } from "./button";

export default function NavBar() {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  // Only fetch authentication status when component mounts
  // Enable refetching on window focus and set a stale time
  const { data, isLoading } = useQuery({
    queryKey: ["verify"],
    queryFn: () => api.auth.verif().catch(() => null),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
  });

  const isLoggedIn = !!data;

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const navbar = document.getElementById("navbar");
      const sidebar = document.querySelector("[data-sidebar='true']");

      // If click is not on the navbar, sidebar, or their children, close the sidebar
      if (
        isSidebarOpen &&
        navbar &&
        sidebar &&
        !navbar.contains(event.target as Node) &&
        !sidebar.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, closeSidebar]);

  return (
    <>
      <nav
        className="font-anderson sticky top-0 right-0 left-0 z-[60] flex w-full flex-col bg-white shadow-md"
        id="navbar"
      >
        <div className="flex h-[70px] flex-row items-center justify-between px-7 lg:h-24 xl:px-14">
          <div className="relative flex items-center gap-6">
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center hover:cursor-pointer focus:outline-none"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              aria-expanded={isSidebarOpen}
            >
              <img
                src="/icon/Type=list-icon.svg"
                alt="sidebar-button"
                className="transform transition-transform duration-200 ease-in-out hover:scale-125"
              />
            </button>
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <Link to="/">
              <img
                className="h-9 w-auto object-contain xl:h-10"
                src="/logo-iom.svg"
                alt="Logo"
              />
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {!isLoading && !isLoggedIn && (
              <Link className="w-fit" to="/auth/login">
                <Button size="lg" variant={"outline"} className="w-[90px]">
                  Masuk
                </Button>
              </Link>
            )}
            {!isLoading && !isLoggedIn && (
              <Link className="w-fit" to="/auth/register">
                <Button size="lg" className="w-[90px]">
                  Daftar
                </Button>
              </Link>
            )}
            {/* TODO: Nanti ganti linknya */}
            {!isLoading && isLoggedIn && (
              <Link className="w-fit" to="/auth/login">
                <img
                  src="/icon/Type=notification.svg"
                  alt="Notifications"
                  className="h-6 w-6 transform transition-transform duration-200 ease-in-out hover:scale-125"
                />
              </Link>
            )}
            {!isLoading && isLoggedIn && (
              <Menubar className="border-none bg-transparent p-0 shadow-none">
                <MenubarMenu>
                  <MenubarTrigger className="cursor-pointer border-none bg-transparent p-0 shadow-none outline-none hover:bg-transparent focus:bg-transparent">
                    <img
                      src="/icon/Type=profile-icon.svg"
                      alt="Profile"
                      className="h-6 w-6 transform transition-transform duration-200 ease-in-out hover:scale-125"
                    />
                  </MenubarTrigger>
                  <MenubarContent
                    className="z-[70]"
                    align="end"
                    alignOffset={-10}
                    sideOffset={5}
                  >
                    <MenubarItem className="text-dark">Akun Saya</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem className="text-destructive">
                      Keluar
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
