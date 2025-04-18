import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex h-full w-full items-center justify-center mt-20">
      <div className="mx-auto flex h-full max-w-md flex-col items-center px-4 text-center">
        <h1 className="text-5xl font-bold tracking-tighter text-[#003399]">
          404
        </h1>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#003399]">
          Halaman Tidak Ditemukan
        </h2>
        <p className="mt-4 mb-6 text-gray-600 md:text-xl/relaxed">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. Halaman mungkin
          telah dipindahkan atau dihapus.
        </p>
        <Link to="/">
          <Button className="bg-[#003399] text-white hover:bg-[#002277]">
            <Home className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}
