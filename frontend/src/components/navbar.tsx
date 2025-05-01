import { api, queryClient } from "@/api/client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { SessionContext } from "@/context/session";
import { useSidebar } from "@/context/sidebar";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { useContext } from "react";

import Sidebar from "./sidebar";
import { Button } from "./ui/button";

export default function NavBar() {
  const session = useContext(SessionContext);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const navigate = useNavigate();

  const isLoggedIn = !!session;

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
              className={cn(
                "flex items-center justify-center hover:cursor-pointer focus:outline-none",
                !isLoggedIn && "hidden",
              )}
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
            <Link to="/" className="flex items-center space-x-2">
              <img
                className="h-9 w-auto object-contain xl:h-10"
                src="/logo-iom-icon.svg"
                alt="Logo"
              />
              {/* Title visible from md (desktop) and up */}
              <div className="hidden flex-col leading-tight md:flex">
                <span className="text-primary text-lg font-bold">
                  Ikatan Orang Tua Mahasiswa
                </span>
                <span className="text-primary text-base font-medium">
                  Institut Teknologi Bandung
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {!isLoggedIn && (
              <Link className="w-fit" to="/auth/login">
                <Button size="lg" variant={"outline"} className="w-[90px]">
                  Masuk
                </Button>
              </Link>
            )}
            {!isLoggedIn && (
              <Link className="w-fit" to="/auth/register">
                <Button size="lg" className="w-[90px]">
                  Daftar
                </Button>
              </Link>
            )}
            {isLoggedIn && (
              <Link className="w-fit" to="/auth/login">
                <img
                  src="/icon/Type=notification.svg"
                  alt="Notifications"
                  className="h-6 w-6 transform transition-transform duration-200 ease-in-out hover:scale-125"
                />
              </Link>
            )}
            {isLoggedIn && (
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
                    <MenubarItem
                      className="text-dark"
                      onClick={() => {
                        const path = "/profile";

                        navigate({
                          to: path,
                          replace: false,
                          reloadDocument: true,
                        });
                      }}
                    >
                      Akun Saya
                    </MenubarItem>

                    <MenubarSeparator />
                    <MenubarItem
                      className="text-destructive"
                      onClick={() => {
                        api.auth.logout();
                        queryClient.invalidateQueries({ queryKey: ["verify"] });
                        navigate({
                          to: "/",
                          replace: true,
                          reloadDocument: true,
                        });
                      }}
                    >
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
