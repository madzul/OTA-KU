import { api } from "@/api/client";
import type { UserSchema } from "@/api/generated";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MahasiswaRegistrationFormSchema } from "@/lib/zod/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FileUp } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type MahasiswaRegistrationFormValues = z.infer<
  typeof MahasiswaRegistrationFormSchema
>;

export default function PendaftaranMahasiswa({
  session,
}: {
  session: UserSchema;
}) {
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const mahasiswaRegistrationCallbackMutation = useMutation({
    mutationFn: (data: MahasiswaRegistrationFormValues) =>
      api.profile.pendaftaranMahasiswa({ formData: data }),
    onSuccess: (_data, _variables, context) => {
      toast.dismiss(context);
      toast.success("Berhasil melakukan pendaftaran", {
        description: "Silakan tunggu hingga admin memverifikasi data",
      });

      setTimeout(() => {
        navigate({ to: "/profile" });
      }, 1000);
    },
    onError: (_error, _variables, context) => {
      toast.dismiss(context);
      toast.warning("Gagal melakukan pendaftaran", {
        description: "Silakan coba lagi",
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

  const form = useForm<MahasiswaRegistrationFormValues>({
    resolver: zodResolver(MahasiswaRegistrationFormSchema),
    defaultValues: {
      phoneNumber: session.phoneNumber ?? "",
    },
  });

  async function onSubmit(values: MahasiswaRegistrationFormValues) {
    mahasiswaRegistrationCallbackMutation.mutate(values);
  }

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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-5"
          >
            {/* TODO: Disable input kalo udah ada nama dan NIM (login oauth) */}
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
              name="phoneNumber"
              disabled={!!session.phoneNumber}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">
                    Nomor HP (Whatsapp)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor WA Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">NIM</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan NIM Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">
                    Alasan keperluan bantuan
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Alasan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { value, ref, onChange, ...fieldProps } }) => {
                const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(true);
                };

                const handleDragLeave = (
                  e: React.DragEvent<HTMLDivElement>,
                ) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                };

                const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);

                  const file = e.dataTransfer.files?.[0] || null;
                  if (file) {
                    onChange(file);
                    setFileName(file.name);
                  }
                };

                return (
                  <FormItem>
                    <FormLabel className="text-primary text-sm">
                      Upload berkas pengajuan bantuan
                    </FormLabel>
                    <FormControl>
                      <div className="grid w-full gap-1.5">
                        <Label htmlFor="file-upload" className="sr-only">
                          Upload berkas
                        </Label>
                        <div
                          className={`flex flex-col items-center justify-center rounded-md border-2 ${
                            isDragging
                              ? "border-primary bg-primary/5 border-dashed"
                              : "border-muted-foreground/25 hover:border-muted-foreground/50 border-dashed"
                          } p-6 transition-all`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <Input
                            id="file-upload"
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              onChange(file);
                              setFileName(file?.name || "");
                            }}
                            ref={fileInputRef}
                            {...fieldProps}
                          />
                          <div className="flex flex-col items-center gap-2 text-center">
                            <FileUp className="text-muted-foreground h-8 w-8" />
                            <div className="flex flex-col items-center gap-1">
                              <p className="text-sm font-medium">
                                {fileName ? (
                                  <span className="inline-block max-w-[300px] truncate">
                                    {fileName}
                                  </span>
                                ) : (
                                  <>
                                    <span className="font-semibold">
                                      Klik untuk upload
                                    </span>{" "}
                                    atau drag & drop
                                  </>
                                )}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                PDF (maksimal 5MB)
                              </p>
                            </div>
                            {!fileName && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                Pilih berkas
                              </Button>
                            )}
                            {fileName && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                  setFileName("");
                                  onChange(null);
                                  if (fileInputRef.current) {
                                    fileInputRef.current.value = "";
                                  }
                                }}
                              >
                                Ganti berkas
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <Button type="submit" className="w-full">
              Kirim
            </Button>
          </form>
        </Form>
      </section>
    </div>
  );
}
