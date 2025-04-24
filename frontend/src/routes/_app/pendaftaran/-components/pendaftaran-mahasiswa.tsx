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

// Nama file upload yang ada di backend (TODO: Ubah nama nya supaya lebih user friendly)
type MahasiswaRegistrationField = keyof MahasiswaRegistrationFormValues;
const uploadFields: MahasiswaRegistrationField[] = [
  "file",
  "kk",
  "ktm",
  "waliRecommendationLetter",
  "transcript",
  "salaryReport",
  "pbb",
  "electricityBill",
  "ditmawaRecommendationLetter",
];

export default function PendaftaranMahasiswa({
  session,
}: {
  session: UserSchema;
}) {
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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

  const form = useForm<MahasiswaRegistrationFormValues>({
    resolver: zodResolver(MahasiswaRegistrationFormSchema),
    defaultValues: {
      phoneNumber: session.phoneNumber ?? "",
    },
  });

  const handleFileChange = (
    field: keyof MahasiswaRegistrationFormValues,
    file: File | null
  ) => {
    setFileNames((prev) => ({
      ...prev,
      [field]: file?.name || "",
    }));
  
    // Kalau tidak ada file, set ke undefined atau string kosong
    form.setValue(field, file ?? "");
  };

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

      <section className="w-[100%] md:max-w-[960px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-5"
          >
            {/* TODO: Disable input kalo udah ada nama, NIM, jurusan, dan fakultas (login oauth)
            1. Pake session context (useContext), session itu isinya JWT
            2. Harus ngecek dulu provider si user itu azure atau ga, kalo azure -> disable */}
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
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="text-primary text-sm">
                      Nomor HP (Whatsapp)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nomor WA Anda"
                        disabled={!!session.phoneNumber}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
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
              name="major"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">Jurusan</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan jurusan Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="faculty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">Fakultas</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan fakultas Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cityOfOrigin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">Kota Asal</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan kota asal Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="highschoolAlumni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">Asal SMA</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan asal SMA Anda" {...field} />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadFields.map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={() => {
                    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFileNames((prev) => ({ ...prev, [name]: "Dragging..." }));
                    };

                    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFileNames((prev) => ({ ...prev, [name]: "" }));
                    };

                    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files?.[0] || null;
                      handleFileChange(name, file);
                    };

                    return (
                      <FormItem>
                        <FormLabel className="text-primary text-sm">{name}</FormLabel>
                        <FormControl>
                          <div
                            className={`flex flex-col items-center justify-center rounded-md border-2 ${
                              fileNames[name] === "Dragging..."
                                ? "border-primary bg-primary/5 border-dashed"
                                : "border-muted-foreground/25 hover:border-muted-foreground/50 border-dashed"
                            } p-6 transition-all`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                          >
                            <Input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                handleFileChange(name, file);
                              }}
                              ref={(el) => {
                                fileInputRefs.current[name] = el;
                              }}
                            />
                            <div className="flex flex-col items-center gap-2 text-center">
                              <FileUp className="text-muted-foreground h-8 w-8" />
                              <p className="text-sm font-medium">
                                {fileNames[name] || `Klik untuk upload atau drag & drop`}
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRefs.current[name]?.click()}
                              >
                                Pilih {name}
                              </Button>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>

            <Button type="submit" className="w-full">
              Kirim
            </Button>
          </form>
        </Form>
      </section>
    </div>
  );
}
