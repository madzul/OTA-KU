import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login/")({
  component: RouteComponent,
});

// TOOD: Nanti ganti jadi pake nomor wa
function RouteComponent() {
  return (
    <div className="md:px-auto min-h-[100vh] bg-[#F3F4F6] px-9 pt-16 pb-16">
      <div className="flex flex-col items-center gap-9">
        <img
          src="/icon/logo-basic.png"
          alt="logo"
          className="mx-auto h-[81px] w-[123px]"
        />
        <h1 className="text-primary text-center text-3xl font-bold md:text-[50px]">
          Selamat Datang Kembali!
        </h1>
        <h2 className="text-primary text-center text-2xl md:text-[26px]">
          Masuk ke akun Anda
        </h2>
        <section className="md:w-[400px]">
          <form action="" className="flex w-[100%] flex-col gap-[20px]">
            <div>
              <label htmlFor="email" className="text-primary text-sm">
                Email
              </label>
              <Input type="email" placeholder="Masukkan email Anda" />
              <span className="text-destructive text-sm">
                Masukkan email yang benar
              </span>
            </div>
            <div>
              <label htmlFor="email" className="text-dark text-sm">
                Email
              </label>
              <Input type="password" placeholder="Masukkan password Anda" />
              <span className="text-destructive text-sm">
                Masukkan email yang benar
              </span>
            </div>
            <a href="#" className="text-primary underline">
              Lupa password?
            </a>
            <Button type="submit" className="w-full">
              Masuk
            </Button>
            <p className="text-primary text-center text-base">
              Belum punya akun?{" "}
              <a href="">
                <span className="underline">Daftar disini sekarang</span>{" "}
              </a>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
