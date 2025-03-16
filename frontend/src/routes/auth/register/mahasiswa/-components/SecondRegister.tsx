import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SecondRegister() {
  return (
    <div className="flex flex-col items-center gap-4 md:px-[34px]">
      <img
        src="/icon/logo-basic.png"
        alt="logo"
        className="mx-auto h-[81px] w-[123px]"
      />
      <h1 className="text-primary text-center text-[32px] font-bold md:text-left md:text-[50px]">
        Formulir Pendaftaran Calon Mahasiswa Asuh
      </h1>

      <section className="w-[100%] md:max-w-[640px]">
        <form action="" className="flex w-[100%] flex-col gap-[20px]">
          {/* Nama  */}
          <div>
            <label htmlFor="text" className="text-dark text-base">
              Nama Lengkap
            </label>
            <Input type="text" placeholder="Nama Lengkap" />
          </div>
          {/* Nomor HP  */}
          <div>
            <label htmlFor="number" className="text-dark text-base">
              Nomor HP (Whatsapp)
            </label>
            <Input type="number" placeholder="Nomor HP (Whatsapp)" />
          </div>
          {/* NIM  */}
          <div>
            <label htmlFor="number" className="text-dark text-base">
              NIM
            </label>
            <Input type="number" placeholder="NIM" />
          </div>
          {/* Aasan */}
          <div>
            <label htmlFor="text" className="text-dark text-base">
              Alasan keperluan bantuan
            </label>
            <Textarea placeholder="Alasan" />
          </div>
          {/* Berkas */}
          <div>
            <label htmlFor="text" className="text-dark text-base">
              Upload berkas pengajuan bantuan
            </label>
            {/* BELUM ADA DROPDOWN YANG SESUAI */}
            <Input type="file" />
          </div>

          <Button type="submit" className="w-full">
            Kirim
          </Button>
          <Button type="submit" className="w-full" variant={"secondary"}>
            Kembali
          </Button>
        </form>
      </section>
    </div>
  );
}
