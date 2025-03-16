import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function SecondRegister() {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col items-center gap-4 md:px-[34px]">
      <img
        src="/icon/logo-basic.png"
        alt="logo"
        className="mx-auto h-[81px] w-[123px]"
      />
      <h1 className="text-primary text-center text-[32px] font-bold md:text-left md:text-[50px]">
        Formulir Pendaftaran Orang Tua Asuh
      </h1>
      {/* Deskripsi Title */}
      <div className="text-primary flex flex-col gap-[18px]">
        <div>
          {isExpanded ? (
            <p className="text-justify text-[18px]">
              Orang Tua Asuh (OTA) merupakan salah satu bentuk bantuan IOM-ITB
              yang bersumber dari Orang Tua Mahasiswa (OTM) yang dengan sukarela
              membiayai sebagian atau keseluruhan kebutuhan seorang mahasiswa
              ITB dalam jangka waktu tertentu (minimal 1 semester). Besar
              bantuan yang diberikan sesuai dengan kesanggupan OTM . Kami
              memprogramkan besar bantuan minimal bagi anak asuh senilai
              Rp.600.000,- dimana pembiayaannya dapat bersumber dari 1-2 OTM.
              Partisipasi dan kepedulian Bapak/Ibu sebagai Orang Tua Asuh akan
              sangat berarti bagi para mahasiswa yang membutuhkannya.{"  "}
              <span
                className="cursor-pointer font-bold underline"
                onClick={toggleExpand}
              >
                Tutup
              </span>
            </p>
          ) : (
            <p className="text-justify text-[18px]">
              Orang Tua Asuh (OTA) merupakan salah satu bentuk bantuan IOM - ITB
              yang bersumber dari Orang Tua Mahasiswa (OTM) yang dengan sukarela
              membiayai sebagian atau keseluruhan kebutuhan seorang mahasiswa
              ITB dalam jangka waktu tertentu (minimal 1 semester). Besar
              bantuan yang diberikan...{" "}
              <span
                className="cursor-pointer font-bold underline"
                onClick={toggleExpand}
              >
                Baca selengkapnya
              </span>
            </p>
          )}
        </div>
        <Button className="mx-auto w-full md:max-w-[400px]">
          Ketahui Lebih Lengkap
        </Button>
      </div>
      {/* Second Title */}
      <h2 className="text-primary text-center text-2xl md:text-[26px]">
        Data Diri:
      </h2>
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
          {/* Pekerjaan  */}
          <div>
            <label htmlFor="text" className="text-dark text-base">
              Pekerjaan
            </label>
            <Input type="text" placeholder="Pekerjaan" />
          </div>
          {/* Alamat */}
          <div>
            <label htmlFor="text" className="text-dark text-base">
              Alamat
            </label>
            <Textarea placeholder="Alamat" />
          </div>
          {/* Keterkaitan dengan ITB */}
          <div>
            <label htmlFor="text" className="text-dark text-base">
              Keterkaitan dengan ITB
            </label>
            {/* BELUM ADA DROPDOWN YANG SESUAI */}
            <Input />
          </div>

          <Button type="submit" className="w-full">
            Selanjutnya
          </Button>
          <Button type="submit" className="w-full" variant={"secondary"}>
            Kembali
          </Button>
        </form>
      </section>
    </div>
  );
}
