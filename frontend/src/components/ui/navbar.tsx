"use client";

import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import Sidebar from "../sidebar";
import { Button } from "./button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <nav
        className="font-anderson bg-background sticky top-0 right-0 left-0 z-[60] flex w-full flex-col shadow-md"
        id="navbar"
      >
        <div className="flex h-[70px] flex-row items-center justify-between px-7 lg:h-24 xl:px-14">
          <div className="relative flex items-center gap-6">
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center focus:outline-none"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              aria-expanded={isSidebarOpen}
            >
              <img
                src="/icon/Type=list-icon.svg"
                alt="Toggle sidebar"
                className="transition-transform duration-200 ease-in-out"
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

          <div className="hidden items-center space-x-8 lg:flex">
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
                  className="h-6 w-6"
                />
              </Link>
            )}
            {isLoggedIn && (
              <Link className="w-fit" to="/auth/login">
                <img
                  src="/icon/Type=profile-icon.svg"
                  alt="Profile"
                  className="h-6 w-6"
                />
              </Link>
            )}
          </div>

          <div className="flex gap-6 lg:hidden">
            <Sheet>
              <SheetTrigger>
                <img
                  src="/icon/Type=notification.svg"
                  alt="Notifications"
                  className="h-6 w-6"
                />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    <div className="mt-4 flex flex-col space-y-4">
                      <Link
                        to="/"
                        className="text-primary hover:text-primary/80"
                      >
                        Beranda
                      </Link>
                      <Link
                        to="/"
                        className="text-primary hover:text-primary/80"
                      >
                        Tentang
                      </Link>
                      <Link className="w-full" to="/auth/login">
                        <Button
                          size="lg"
                          className="bg-primary hover:bg-primary/90 w-full text-base text-white"
                        >
                          Masuk
                        </Button>
                      </Link>
                      <Link className="w-full" to="/auth/register">
                        <Button
                          size="lg"
                          className="bg-secondary hover:bg-secondary/90 w-full text-base text-white"
                        >
                          Daftar
                        </Button>
                      </Link>
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger>
                <img
                  src="/icon/Type=profile-icon.svg"
                  alt="Profile"
                  className="h-6 w-6"
                />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    <div className="mt-4 flex flex-col space-y-4">
                      <Link
                        to="/"
                        className="text-primary hover:text-primary/80"
                      >
                        Beranda
                      </Link>
                      <Link
                        to="/"
                        className="text-primary hover:text-primary/80"
                      >
                        Tentang
                      </Link>
                      <Link className="w-full" to="/auth/login">
                        <Button
                          size="lg"
                          className="bg-primary hover:bg-primary/90 w-full text-base text-white"
                        >
                          Masuk
                        </Button>
                      </Link>
                      <Link className="w-full" to="/auth/register">
                        <Button
                          size="lg"
                          className="bg-secondary hover:bg-secondary/90 w-full text-base text-white"
                        >
                          Daftar
                        </Button>
                      </Link>
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
}
