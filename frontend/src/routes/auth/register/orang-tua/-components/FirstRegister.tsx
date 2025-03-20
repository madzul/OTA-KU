import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FirstRegister() {
  return (
    <div className="flex flex-col items-center gap-9">
      <img
        src="/icon/logo-basic.png"
        alt="logo"
        className="mx-auto h-[81px] w-[123px]"
      />
      <h1 className="text-primary text-center text-3xl font-bold md:text-[50px]">
        Daftar Sebagai Orang Tua
      </h1>
      <h2 className="text-primary text-center text-2xl md:text-[26px]">
        Silahkan isi kolom yang tersedia
      </h2>
      <section className="md:w-[400px]">
        <form action="" className="flex w-[100%] flex-col gap-[20px]">
          {/* Email */}
          <div>
            <label htmlFor="email" className="text-dark text-base">
              Email
            </label>
            <Input type="email" placeholder="Masukkan email Anda" />
            <span className="text-destructive text-sm">
              Masukkan email yang benar
            </span>
          </div>
          {/* Password */}
          <div>
            <label htmlFor="email" className="text-dark text-base">
              Password
            </label>
            <Input type="password" placeholder="Masukkan password Anda" />
            <span className="text-destructive text-sm">
              Masukkan email yang benar
            </span>
          </div>
          {/* Konfirmasi Password */}
          <div>
            <label htmlFor="password" className="text-dark text-base">
              Konfirmasi Kata Sandi
            </label>
            <Input type="password" placeholder="Kata Sandi" />
            <span className="text-destructive text-sm">
              Masukkan kata sandi yang benar
            </span>
          </div>
          <Button type="submit" className="w-full">
            Masuk
          </Button>
          <Button type="button" className="w-full" variant={"secondary"}>
            Kembali
          </Button>
        </form>
      </section>
    </div>
  );
}
