import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

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
  return (
    <nav
      className="font-anderson sticky top-0 right-0 left-0 z-[50] flex w-full flex-col bg-white"
      id="navbar"
    >
      <div className="flex h-24 flex-row items-center justify-between px-7 xl:px-14">
        <div className="relative flex items-center">
          <Link to="/">
            <img
              className="h-9 w-auto object-contain xl:h-10"
              src="/logo-iom.svg"
              alt="Logo"
            />
          </Link>
        </div>

        <div className="hidden items-center space-x-8 lg:flex">
          <Link to="/" className="text-primary hover:text-primary/80">
            Beranda
          </Link>
          <Link to="/" className="text-primary hover:text-primary/80">
            Tentang
          </Link>
          <Link className="w-fit" to="/auth/login">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 px-8 text-base text-white"
            >
              Masuk
            </Button>
          </Link>
          <Link className="w-fit" to="/auth/register">
            <Button
              size="lg"
              className="bg-secondary hover:bg-secondary/90 px-8 text-base text-white"
            >
              Daftar
            </Button>
          </Link>
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger>
              <Menu className="text-primary h-6 w-6" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  <div className="mt-4 flex flex-col space-y-4">
                    <Link to="/" className="text-primary hover:text-primary/80">
                      Beranda
                    </Link>
                    <Link to="/" className="text-primary hover:text-primary/80">
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
  );
}
