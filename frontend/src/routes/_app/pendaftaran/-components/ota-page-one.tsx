import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { OrangTuaPageOneSchema } from "@/lib/zod/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";

import { linkages } from "./data";
import { OrangTuaRegistrationFormValues } from "./pendaftaran-orang-tua";

interface OTAPageOneProps {
  setPage: (page: number) => void;
  mainForm: UseFormReturn<OrangTuaRegistrationFormValues>;
}

export type OrangTuaRegistrationOneFormValues = z.infer<
  typeof OrangTuaPageOneSchema
>;

export default function OTAPageOne({ setPage, mainForm }: OTAPageOneProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<OrangTuaRegistrationOneFormValues>({
    resolver: zodResolver(OrangTuaPageOneSchema),
  });

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  async function onSubmit(data: OrangTuaRegistrationOneFormValues) {
    mainForm.setValue("name", data.name);
    mainForm.setValue("job", data.job);
    mainForm.setValue("address", data.address);
    mainForm.setValue("linkage", data.linkage);
    setPage(2);
  }

  return (
    <main className="flex flex-col items-center gap-4 md:px-[34px]">
      <img
        src="/icon/logo-basic.png"
        alt="logo"
        className="mx-auto h-[81px] w-[123px]"
      />
      <h1 className="text-primary text-center text-[32px] font-bold md:text-[50px]">
        Formulir Pendaftaran Orang Tua Asuh
      </h1>
      {/* Deskripsi Title */}
      <div className="text-primary flex flex-col gap-[18px]">
        <div>
          {isExpanded ? (
            <p className="text-justify text-[18px]">
              Orang Tua Asuh (OTA) merupakan salah satu bentuk bantuan IOM-ITB
              yang dapat berasal dari siapa saja, baik Orang Tua Mahasiswa
              (OTM), alumni, maupun pihak lain yang memiliki kepedulian untuk
              mendukung mahasiswa ITB. Bantuan ini diberikan untuk membiayai
              sebagian atau seluruh kebutuhan seorang mahasiswa ITB dalam jangka
              waktu tertentu (minimal 1 semester). Besar bantuan yang diberikan
              disesuaikan dengan kesanggupan masing-masing Orang Tua Asuh. Kami
              memprogramkan bantuan minimal senilai Rp300.000,- per mahasiswa,
              yang berasal dari satu Orang Tua Asuh. Partisipasi dan kepedulian
              Bapak/Ibu sebagai Orang Tua Asuh akan sangat berarti bagi para
              mahasiswa yang membutuhkan.{"  "}
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">
                    Nama Lengkap
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="job"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">
                    Pekerjaan
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan pekerjaan Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">Alamat</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan alamat Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">
                    Keterkaitan dengan ITB
                  </FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between rounded-md",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? linkages.find(
                                (linkage) => linkage.value === field.value,
                              )?.label
                            : "Pilih keterkaitan dengan ITB"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {linkages.map((linkage) => (
                              <CommandItem
                                value={linkage.label}
                                key={linkage.value}
                                onSelect={() => {
                                  form.setValue("linkage", linkage.value);
                                  setOpen(false);
                                }}
                              >
                                {linkage.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    linkage.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Selanjutnya
            </Button>
          </form>
        </Form>
      </section>
    </main>
  );
}
