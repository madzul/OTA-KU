import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/register/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="md:px-auto min-h-[100vh] bg-[#F3F4F6] px-9 pt-16 pb-16">
      <div className="flex flex-col items-center gap-9">
        <img
          src="/icon/logo-basic.png"
          alt="logo"
          className="mx-auto h-[81px] w-[123px]"
        />
        <h1 className="text-primary text-center text-[32px] font-bold md:text-[50px]">
          Daftar
        </h1>
        <h2 className="text-primary text-center text-2xl md:text-[26px]">
          Mendaftar sebagai
        </h2>
        {/* Opsi Button */}
        <section className="inline-flex flex-col items-center gap-5">
          <div className="flex gap-5">
            <button className="hover:border-dark focus:border-dark flex h-[110px] w-[114px] flex-col items-center justify-center gap-3 rounded-[4px] bg-white transition-all delay-[50ms] ease-linear hover:border-[3px] focus:border-[3px] md:h-[151px] md:w-[156px]">
              <img
                src="/icon/icon-student.svg"
                alt="icon-mahasiswa"
                className="h-[46px] w-[46px] md:h-16 md:w-16"
              />
              <span className="text-dark">Mahasiswa</span>
            </button>
            <button className="hover:border-dark focus:border-dark flex h-[110px] w-[114px] flex-col items-center justify-center gap-3 rounded-[4px] bg-white transition-all delay-[50ms] ease-linear hover:border-[3px] focus:border-[3px] md:h-[151px] md:w-[156px]">
              <img
                src="/icon/icon-parent.svg"
                alt="icon-parent"
                className="h-[46px] w-[46px] md:h-16 md:w-16"
              />
              <span className="text-dark">Orang Tua</span>
            </button>
          </div>
          <p className="text-primary text-center text-base">
            Pilih mendaftar sebagai mahasiswa atau orang tua
          </p>
          <Button className="w-full">Selanjutnya</Button>
        </section>
        <p className="text-primary text-center text-base">
          Sudah punya akun?{" "}
          <a href="">
            <span className="underline">Masuk sekarang!</span>{" "}
          </a>
        </p>
      </div>
    </div>
  );
}
