import { api } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
import { OrangTuaPageTwoSchema } from "@/lib/zod/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronDown } from "lucide-react";
import { UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { days } from "./data";
import { OrangTuaRegistrationFormValues } from "./pendaftaran-orang-tua";

interface OTAPageTwoProps {
  setPage: (page: number) => void;
  mainForm: UseFormReturn<OrangTuaRegistrationFormValues>;
}

export type OrangTuaRegistrationTwoFormValues = z.infer<
  typeof OrangTuaPageTwoSchema
>;

export default function OTAPageTwo({ setPage, mainForm }: OTAPageTwoProps) {
  const navigate = useNavigate();
  const orangTuaRegistrationCallbackMutation = useMutation({
    mutationFn: (data: OrangTuaRegistrationFormValues) =>
      api.profile.pendaftaranOrangTua({ formData: data }),
    onSuccess: (_data, _variables, context) => {
      toast.dismiss(context);
      toast.success("Berhasil melakukan pendaftaran", {
        description: "Silakan tunggu hingga admin memverifikasi data",
      });

      setTimeout(() => {
        navigate({ to: "/profile", reloadDocument: true });
      }, 1000);
    },
    onError: (error, _variables, context) => {
      toast.dismiss(context);
      toast.warning("Gagal melakukan pendaftaran", {
        description: error.message,
      });
    },
    onMutate: () => {
      const loading = toast.loading("Sedang melakukan pendaftaran...", {
        description: "Mohon tunggu sebentar",
        duration: Infinity,
      });
      return loading;
    },
  });

  const form = useForm<OrangTuaRegistrationTwoFormValues>({
    resolver: zodResolver(OrangTuaPageTwoSchema),
    defaultValues: {
      checked: false,
      allowAdminSelection: "false",
    },
  });

  async function onSubmit(data: OrangTuaRegistrationTwoFormValues) {
    mainForm.setValue("funds", data.funds);
    mainForm.setValue("maxCapacity", data.maxCapacity);
    mainForm.setValue("startDate", data.startDate);
    mainForm.setValue("maxSemester", data.maxSemester);
    mainForm.setValue("transferDate", data.transferDate);
    mainForm.setValue("criteria", data.criteria);
    mainForm.handleSubmit(
      async (data) => {
        await orangTuaRegistrationCallbackMutation.mutateAsync(data);
      },
      (errors) => {
        console.error(errors);
      },
    )();
  }

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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="funds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">
                    Bersedia memberikan dana setiap bulan sebesar (dalam Rp)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Minimal Rp300.000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">
                    Untuk diberikan kepada
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Jumlah anak asuh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">
                    Dana akan mulai diberikan pada
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "rounded-md pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pilih tanggal</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          form.setValue(
                            "startDate",
                            date ? date.toISOString() : "",
                          )
                        }
                        disabled={(date) => date <= new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxSemester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">Selama</FormLabel>
                  <FormControl>
                    <Input placeholder="Min. 1 semester" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transferDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">
                    Dana akan ditransfer ke rekening IOM setiap tanggal
                  </FormLabel>
                  <Popover>
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
                            ? days.find((day) => day.value === field.value)
                                ?.label
                            : "Pilih tanggal"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {days.map((day) => (
                              <CommandItem
                                value={day.label}
                                key={day.value}
                                onSelect={() => {
                                  form.setValue("transferDate", day.value);
                                }}
                              >
                                {day.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    day.value === field.value
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
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="criteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">
                    Adapun Kriteria Anak Asuh yang saya inginkan (Opsional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Kriteria dapat berupa jenis kelamin, fakultas, agama, dll. Tuliskan nama mahasiswa/fakultas/jurusan jika sudah ada."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="text-dark text-justify text-base">
              Saya bersedia dihubungi melalui nomor HP untuk koordinasi dalam
              penyaluran bantuan. Demikian pernyataan ini saya buat dengan
              sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
            </p>

            <FormField
              control={form.control}
              name="checked"
              render={({ field }) => (
                <FormItem className="text-primary flex items-center gap-2 text-base">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="text-primary"
                    />
                  </FormControl>
                  <span className="ml-2">
                    Saya tidak keberatan untuk berkomunikasi dengan anak asuh
                  </span>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allowAdminSelection"
              render={({ field }) => (
                <FormItem className="text-primary flex items-center gap-2 text-base">
                  <FormControl>
                    <Checkbox
                      checked={field.value === "true"}
                      onCheckedChange={(checked) => {
                        field.onChange(checked ? "true" : "false");
                      }}
                      className="text-primary"
                    />
                  </FormControl>
                  <span className="ml-2">
                    Saya memberikan izin kepada IOM untuk memilihkan anak asuh
                    (Opsional)
                  </span>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Selesai
            </Button>

            <Button
              type="button"
              className="w-full"
              variant="outline"
              onClick={() => setPage(1)}
            >
              Kembali
            </Button>
          </form>
        </Form>
      </section>
    </div>
  );
}
