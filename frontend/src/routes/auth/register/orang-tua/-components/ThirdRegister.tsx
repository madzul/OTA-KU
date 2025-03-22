import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import * as React from "react";

export default function ThirdRegister() {
  const [valueAnakAsuh, setValueAnakAsuh] = useState("");
  const [valueSemester, setValueSemester] = useState("");
  const [date, setDate] = React.useState<Date>();

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
      <p className="text-primary text-justify text-[18px]">
        Dengan ini menyatakan bersedia menjadi orang Tua Asuh pada Ikatan Orang
        Tua Mahasiswa - Institut Teknologi Bandung (IOM - ITB) dengan ketentuan
        sebagai berikut
      </p>

      <section className="w-[100%] md:max-w-[640px]">
        <form action="" className="flex w-[100%] flex-col gap-[20px]">
          {/* Sedia bayar */}
          <div className="flex flex-col gap-[6px]">
            <label htmlFor="number" className="text-dark text-base">
              Bersedia memberikan dana setiap bulan sebesar (dalam Rp)
            </label>
            <Input type="number" placeholder="Minimal Rp. 300.000" />
            <span className="text-destructive text-sm">
              Dibilang minimal 300rb ngerti ga siii!!!{" "}
            </span>
          </div>
          {/* Jumlah anak asuh  */}
          <div className="flex flex-col gap-[6px]">
            <label htmlFor="number" className="text-dark text-base">
              Untuk diberikan kepada
            </label>
            <div className="relative">
              <Input
                type="number"
                placeholder="Jumlah anak asuh"
                value={valueAnakAsuh}
                onChange={(e) => setValueAnakAsuh(e.target.value)}
                className="pr-20"
              />
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <span className="text-primary"> anak asuh</span>
              </div>
            </div>
          </div>
          {/* Dana  */}
          <div className="flex flex-col gap-[6px]">
            <label htmlFor="text" className="text-dark text-base">
              Dana akan mulai diberikan pada
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start rounded-md text-left font-normal", // Added rounded-md for less rounding
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pilih Tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto rounded-md p-0">
                {" "}
                {/* Added rounded-md here too */}
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Lama waktu */}
          <div className="flex flex-col gap-[6px]">
            <label htmlFor="number" className="text-dark text-base">
              Selama
            </label>
            <div className="relative">
              <Input
                type="number"
                placeholder="Min. 1 semester"
                value={valueSemester}
                onChange={(e) => setValueSemester(e.target.value)}
                className="pr-20"
              />
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <span className="text-primary">semester</span>
              </div>
            </div>
          </div>
          {/* Tanggal Transfer */}
          <div className="flex flex-col gap-[6px]">
            <label htmlFor="text" className="text-dark text-base">
              Dana akan ditransfer ke rekening IOM setiap tanggal
            </label>
            {/* BELUM ADA DROPDOWN YANG SESUAI */}
            <Input type="text" />
            <label htmlFor="text" className="text-primary text-sm">
              Rekening IOM-ITB :<br />
              Bank BNI #002-866-8954
            </label>
          </div>
          {/* Kriteria */}
          <div className="flex flex-col gap-[6px]">
            <label htmlFor="text" className="text-dark text-base">
              Adapun Kriteria Anak Asuh yang saya inginkan (opsional)
            </label>
            <Textarea placeholder="Kriteria dapat berupa jenis kelamin, fakultas, agama, dll. Tuliskan nama mahasiswa/fakultas/jurusan jika sudah ada." />
          </div>
          <p className="text-dark text-justify text-base">
            Saya bersedia dihubungi melalui nomor HP untuk koordinasi dalam
            penyaluran bantuan. Demikian pernyataan ini saya buat dengan
            sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
          </p>
          <div className="text-dark flex items-center gap-2 text-base">
            <Checkbox />
            <span>
              Saya tidak keberatan untuk berkomunikasi dengan anak asuh
            </span>
          </div>
          <Button type="submit" className="w-full">
            Selesai
          </Button>
          <Button type="button" className="w-full" variant={"secondary"}>
            Kembali
          </Button>
        </form>
      </section>
    </div>
  );
}
