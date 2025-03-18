"use client";

import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import type { Dispatch, SetStateAction } from "react";

const navLink: {
  name: string;
  path: string;
}[] = [
  {
    name: "Beranda",
    path: "/",
  },
];

export default function NavBar({
  isNavBarActive,
  setIsNavBarActive,
}: {
  isNavBarActive: boolean;
  setIsNavBarActive: Dispatch<SetStateAction<boolean>>;
}) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav
      className="sticky left-0 right-0 top-0 z-[50] flex w-full flex-col bg-white font-anderson text-white"
      id="navbar"
    >
      <div className="flex h-24 flex-row items-center justify-between px-7 xl:px-14">
        <div className="relative flex lg:align-middle">
          <Link to="/">
            <img
              className="static h-9 w-auto object-contain xl:h-10"
              src="/logo-iom.svg"
              alt="Logo"
            />
          </Link>
        </div>
        <Button
          aria-label="menu"
          variant="ghost"
          size="icon"
          className="bg-transparent hover:bg-transparent lg:hidden"
          onClick={() => setIsNavBarActive(true)}
        >
          <Menu className="h-full w-full" />
        </Button>
        <div
          className={cn(
            "absolute left-0 top-0 h-screen w-screen overflow-hidden",
            isNavBarActive ? "bg-black/50" : "pointer-events-none",
            "lg:static lg:ml-auto lg:h-auto lg:w-auto"
          )}
          onClick={() => setIsNavBarActive(false)}
        >
          <div
            className={cn(
              "pointer-events-auto absolute right-0 top-0 flex h-full min-w-[215px] translate-x-full flex-col gap-5 transition-transform",
              isNavBarActive ? "translate-x-0" : "",
              "transition-transform",
              "lg:relative lg:min-w-0 lg:translate-x-0 lg:gap-0"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -z-50 h-full w-full overflow-hidden bg-white lg:hidden">
              <div className="absolute -z-10 h-full w-full bg-white" />
            </div>

            <Button
              aria-label="menu-close"
              variant="ghost"
              size="icon"
              className="ml-auto mr-4 mt-7 bg-transparent hover:bg-transparent lg:hidden"
              onClick={() => setIsNavBarActive(false)}
            >
              <X className="h-full w-full" />
            </Button>

            <ul className="m-8 flex flex-col gap-6 lg:m-0 lg:flex-row lg:items-center lg:gap-8 xl:gap-12 xl:text-lg">
              {navLink.map(({ name, path: url }) => {
                return (
                  <li key={name} className="flex justify-end">
                    <Link
                      to={url}
                      className={`${
                        currentPath.startsWith(url)
                          ? "font-bold text-primary"
                          : "font-medium text-primary"
                      }`}
                    >
                      {name}
                    </Link>
                  </li>
                );
              })}
              <li className="flex justify-end">
                <Link className="w-fit self-center" to="/auth/login">
                  <Button size="lg" className="px-8 text-base">
                    Masuk
                  </Button>
                </Link>
              </li>
            </ul>
            <Link className="mb-8 mt-auto self-center lg:hidden" to="/">
              <img
                className="static h-auto w-[150px] object-contain"
                src="/logo/tedxitb-logo-white-cropped.png"
                alt="Logo"
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}