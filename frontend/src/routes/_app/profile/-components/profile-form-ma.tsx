import { api } from "@/api/client";
import { UserSchema } from "@/api/generated";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Fakultas, Jurusan } from "@/lib/nim";
import { MahasiswaRegistrationFormSchema } from "@/lib/zod/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FileUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type MahasiswaRegistrationFormValues = z.infer<
  typeof MahasiswaRegistrationFormSchema
>;

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

const uploadFieldLabels: Record<MahasiswaRegistrationField, string> = {
  file: "Berkas Utama",
  kk: "Kartu Keluarga",
  ktm: "Kartu Tanda Mahasiswa",
  waliRecommendationLetter: "Surat Rekomendasi Wali",
  transcript: "Transkrip Nilai",
  salaryReport: "Laporan Gaji",
  pbb: "PBB",
  electricityBill: "Tagihan Listrik",
  ditmawaRecommendationLetter: "Surat Rekomendasi Ditmawa",
  phoneNumber: "Nomor HP",
  name: "Nama Lengkap",
  nim: "NIM",
  major: "Jurusan",
  faculty: "Fakultas",
  cityOfOrigin: "Kota Asal",
  highschoolAlumni: "Asal SMA",
  description: "Alasan Keperluan Bantuan",
  gender: "Jenis Kelamin",
  gpa: "IPK",
  religion: "Agama",
};

interface ProfileFormProps {
  session: UserSchema;
}

const ProfileFormMA: React.FC<ProfileFormProps> = ({ session }) => {
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Create form with zod validation
  const form = useForm<MahasiswaRegistrationFormValues>({
    resolver: zodResolver(MahasiswaRegistrationFormSchema),
    defaultValues: {
      phoneNumber: session?.phoneNumber ?? "",
    },
  });

  // Fetch existing profile data
  const { data: profileData } = useQuery({
    queryKey: ["mahasiswaProfile", session?.id],
    queryFn: () => api.profile.profileMahasiswa({ id: session?.id ?? "" }),
    enabled: !!session?.id,
  });

  // Set form values once profile data is loaded
  useEffect(() => {
    if (profileData?.body) {
      // Set data dasar profil
      form.setValue("phoneNumber", profileData.body.phone_number || "");
      form.setValue("name", profileData.body.name || "");

      // Set data detail mahasiswa jika tersedia
      if (profileData.body.nim) form.setValue("nim", profileData.body.nim);
      if (profileData.body.major)
        form.setValue("major", profileData.body.major as Jurusan);
      if (profileData.body.faculty)
        form.setValue("faculty", profileData.body.faculty as Fakultas);
      if (profileData.body.cityOfOrigin)
        form.setValue("cityOfOrigin", profileData.body.cityOfOrigin);
      if (profileData.body.highschoolAlumni)
        form.setValue("highschoolAlumni", profileData.body.highschoolAlumni);
      if (profileData.body.description)
        form.setValue("description", profileData.body.description);

      // Set data file yang sudah diupload sebelumnya
      // dan update state fileNames untuk menampilkan nama file di UI
      const newFileNames = { ...fileNames };

      uploadFields.forEach((fieldName) => {
        // Map form field names to API response field names if needed
        const apiFieldName =
          fieldName === "phoneNumber" ? "phone_number" : fieldName;

        if (
          profileData.body[apiFieldName] &&
          typeof profileData.body[apiFieldName] === "string"
        ) {
          // Set URL file ke form state (meskipun ini URL, bukan file)
          form.setValue(fieldName, profileData.body[apiFieldName]);

          // Ekstrak nama file dari URL Cloudinary untuk ditampilkan di UI
          const fileName = profileData.body[apiFieldName].split("/").pop();
          newFileNames[fieldName] = fileName || "File sudah terupload";
        }
      });

      setFileNames(newFileNames);
    }
  }, [profileData, form, setFileNames, fileNames]);

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: (data: MahasiswaRegistrationFormValues) =>
      api.profile.editProfileMa({
        formData: data,
      }),
    onSuccess: () => {
      toast.success("Profil berhasil diperbarui", {
        description: "Data profil Anda telah disimpan",
      });
    },
    onError: (error) => {
      toast.error("Gagal memperbarui profil", {
        description: error.message,
      });
    },
  });

  const handleFileChange = (
    field: MahasiswaRegistrationField,
    file: File | null,
  ) => {
    setFileNames((prev) => ({
      ...prev,
      [field]: file?.name || "",
    }));
    // Set file in form
    form.setValue(field, file ?? "");
  };

  const onSubmit = (values: MahasiswaRegistrationFormValues) => {
    updateProfileMutation.mutate(values);
  };

  return (
    <div className="mx-auto w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="text-primary w-full">
            <p className="text-primary px-4 py-4 text-2xl font-bold">
              Data Diri
            </p>
            <div className="space-y-4 p-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{uploadFieldLabels.name}</FormLabel>
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{uploadFieldLabels.phoneNumber}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nomor WA Anda"
                        disabled={!!session?.phoneNumber}
                        {...field}
                      />
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
                    <FormLabel>{uploadFieldLabels.nim}</FormLabel>
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
                    <FormLabel>{uploadFieldLabels.major}</FormLabel>
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
                    <FormLabel>{uploadFieldLabels.faculty}</FormLabel>
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
                    <FormLabel>{uploadFieldLabels.cityOfOrigin}</FormLabel>
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
                    <FormLabel>{uploadFieldLabels.highschoolAlumni}</FormLabel>
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
                    <FormLabel>{uploadFieldLabels.description}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Alasan keperluan bantuan"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card className="text-primary w-full">
            <p className="text-primary px-4 py-4 text-2xl font-bold">
              Dokumen Pendukung
            </p>
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
              {uploadFields.map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={() => {
                    const handleDragOver = (
                      e: React.DragEvent<HTMLDivElement>,
                    ) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFileNames((prev) => ({
                        ...prev,
                        [name]: "Dragging...",
                      }));
                    };
                    const handleDragLeave = (
                      e: React.DragEvent<HTMLDivElement>,
                    ) => {
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
                        <FormLabel className="text-primary text-sm">
                          {uploadFieldLabels[name] || name}
                        </FormLabel>
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
                                {fileNames[name] ||
                                  `Klik untuk upload atau drag & drop`}
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  fileInputRefs.current[name]?.click()
                                }
                              >
                                Pilih {uploadFieldLabels[name] || name}
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
          </Card>

          <div className="flex justify-end space-x-2 p-4">
            <Button
              type="button"
              className="w-24 xl:w-40"
              variant="outline"
              onClick={() => form.reset()}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="w-24 xl:w-40"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileFormMA;
