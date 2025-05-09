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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Fakultas, Jurusan } from "@/lib/nim";
import { MahasiswaProfileFormSchema } from "@/lib/zod/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FileUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type MahasiswaProfileFormValues = z.infer<typeof MahasiswaProfileFormSchema>;

type MahasiswaProfileField = keyof MahasiswaProfileFormValues;

const uploadFields: MahasiswaProfileField[] = [
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

const uploadFieldLabels: Record<MahasiswaProfileField, string> = {
  file: "Essay",
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

// Religion options from enum
const religionOptions = [
  "Islam",
  "Kristen Protestan",
  "Katolik",
  "Hindu",
  "Buddha",
  "Konghucu",
];

// Gender options from enum
const genderOptions = [
  { value: "M", label: "Laki-laki" },
  { value: "F", label: "Perempuan" },
];

interface ProfileFormProps {
  session: UserSchema;
}

const ProfileFormMA: React.FC<ProfileFormProps> = ({ session }) => {
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [previouslyUploadedFiles, setPreviouslyUploadedFiles] = useState<
    Record<string, string>
  >({});

  // Create form with zod validation
  const form = useForm<MahasiswaProfileFormValues>({
    resolver: zodResolver(MahasiswaProfileFormSchema),
    defaultValues: {
      phoneNumber: session?.phoneNumber ?? "",
      gpa: 0,
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
      if (profileData.body.gender)
        form.setValue("gender", profileData.body.gender);
      if (profileData.body.religion)
        form.setValue("religion", profileData.body.religion);
      if (profileData.body.gpa) form.setValue("gpa", profileData.body.gpa);

      // Set data file yang sudah diupload sebelumnya
      // dan update state fileNames untuk menampilkan nama file di UI
      const newFileNames: Record<string, string> = {};
      const newPreviouslyUploadedFiles: Record<string, string> = {};

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

          // Save the URL of previously uploaded file
          newPreviouslyUploadedFiles[fieldName] =
            profileData.body[apiFieldName];
        }
      });

      setFileNames(newFileNames);
      setPreviouslyUploadedFiles(newPreviouslyUploadedFiles);
    }
  }, [profileData, form]);

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: (data: MahasiswaProfileFormValues) => {
      // Replace the current form data with previously uploaded URLs for fields
      // where a file was uploaded before and no new file is being uploaded now
      const formDataWithAllFiles: any = { ...data };
      uploadFields.forEach((field) => {
        // If this field is not a File object but we have a previous upload for it,
        // reuse the previous URL
        if (
          !(formDataWithAllFiles[field] instanceof File) &&
          previouslyUploadedFiles[field]
        ) {
          formDataWithAllFiles[field] = previouslyUploadedFiles[field];
        }
      });

      return api.profile.editProfileMa({
        formData: formDataWithAllFiles,
      });
    },
    onSuccess: () => {
      toast.success("Profil berhasil diperbarui", {
        description: "Data profil Anda telah disimpan",
      });
    },
    onError: (error) => {
      toast.warning("Gagal memperbarui profil", {
        description: error.message,
      });
    },
  });

  const handleFileChange = (
    field: MahasiswaProfileField,
    file: File | null,
  ) => {
    if (file) {
      setFileNames((prev) => ({
        ...prev,
        [field]: file.name,
      }));
      // Set file in form
      form.setValue(field, file);
    } else {
      // If user clears the file input
      setFileNames((prev) => {
        const newFileNames = { ...prev };
        delete newFileNames[field];
        return newFileNames;
      });

      if (previouslyUploadedFiles[field]) {
        // If there was a previously uploaded file, restore it
        form.setValue(field, previouslyUploadedFiles[field]);
      } else {
        // Clear the form value if there was no previously uploaded file
        form.setValue(field, undefined);
      }
    }
  };

  const onSubmit = (values: MahasiswaProfileFormValues) => {
    const dataToSubmit = { ...values };

    // Hapus field file yang tidak diubah (masih berupa string URL)
    uploadFields.forEach((field) => {
      if (
        typeof dataToSubmit[field] === "string" &&
        previouslyUploadedFiles[field]
      ) {
        // Jika field berupa string URL dan ada di previouslyUploadedFiles,
        // artinya tidak diubah, bisa dihapus dari data yang dikirim
        delete dataToSubmit[field];
      }
    });

    updateProfileMutation.mutate(dataToSubmit);
  };

  return (
    <div className="mx-auto w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="w-full">
            <p className="text-primary px-4 py-4 text-2xl font-bold">
              Data Diri
            </p>
            <div className="space-y-4 p-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      {uploadFieldLabels.name}
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      {uploadFieldLabels.phoneNumber}
                    </FormLabel>
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
                    <FormLabel className="text-primary">
                      {uploadFieldLabels.nim}
                    </FormLabel>
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
                    <FormLabel className="text-primary">
                      {uploadFieldLabels.major}
                    </FormLabel>
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
                    <FormLabel className="text-primary">
                      {uploadFieldLabels.faculty}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan fakultas Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender field */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      {uploadFieldLabels.gender}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {genderOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Religion field */}
              <FormField
                control={form.control}
                name="religion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      {uploadFieldLabels.religion}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih agama" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {religionOptions.map((religion) => (
                          <SelectItem key={religion} value={religion}>
                            {religion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* GPA field */}
              <FormField
                control={form.control}
                name="gpa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary">
                      {uploadFieldLabels.gpa}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan IPK Anda"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
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
                    <FormLabel className="text-primary">
                      {uploadFieldLabels.cityOfOrigin}
                    </FormLabel>
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
                    <FormLabel className="text-primary">
                      {uploadFieldLabels.highschoolAlumni}
                    </FormLabel>
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
                    <FormLabel className="text-primary">
                      {uploadFieldLabels.description}
                    </FormLabel>
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
                      // Only clear if it was just showing "Dragging..."
                      if (fileNames[name] === "Dragging...") {
                        setFileNames((prev) => {
                          const newNames = { ...prev };
                          delete newNames[name];
                          return newNames;
                        });
                      }
                    };
                    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files?.[0] || null;
                      handleFileChange(name, file);
                    };

                    const hasExistingFile = !!previouslyUploadedFiles[name];

                    // Determine display status message
                    let fileStatus = "";
                    if (fileNames[name] === "Dragging...") {
                      fileStatus = "Dragging...";
                    } else if (fileNames[name]) {
                      fileStatus = fileNames[name];
                    } else if (hasExistingFile) {
                      fileStatus = "File sudah terupload";
                    } else {
                      fileStatus = "Klik untuk upload atau drag & drop";
                    }

                    // URL for previously uploaded file
                    const fileUrl = hasExistingFile
                      ? previouslyUploadedFiles[name]
                      : null;

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
                                : hasExistingFile
                                  ? "border-dashed border-green-500/50 bg-green-50/20"
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
                              <FileUp
                                className={`h-8 w-8 ${hasExistingFile ? "text-green-500" : "text-muted-foreground"}`}
                              />

                              {/* Display status message without showing the filename for uploaded files */}
                              <p className="text-sm font-medium">
                                {hasExistingFile
                                  ? "File sudah terupload"
                                  : fileStatus}
                              </p>

                              <div className="flex gap-2">
                                {hasExistingFile && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      if (fileUrl)
                                        window.open(fileUrl, "_blank");
                                    }}
                                  >
                                    Lihat
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    fileInputRefs.current[name]?.click()
                                  }
                                >
                                  {hasExistingFile ? `Ganti` : `Pilih`}
                                </Button>
                              </div>
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
