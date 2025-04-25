import { z } from "@hono/zod-openapi";

import { fakultasEnum, jurusanEnum } from "../db/schema.js";
import {
  EmailSchema,
  NIMSchema,
  PDFSchema,
  PhoneNumberSchema,
  cloudinaryUrlSchema,
} from "./atomic.js";

// Mahasiswa Registration
export const MahasiswaRegistrationSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Nama harus berupa string",
      required_error: "Nama harus diisi",
    })
    .min(3, { message: "Nama terlalu pendek" })
    .max(255, { message: "Nama terlalu panjang" })
    .openapi({ example: "John Doe", description: "Nama mahasiswa" }),
  nim: NIMSchema,
  major: z
    .enum(jurusanEnum.enumValues, {
      required_error: "Jurusan harus dipilih",
      invalid_type_error: "Jurusan tidak valid",
    })
    .openapi({
      example: "Teknik Informatika",
      description: "Jurusan mahasiswa",
    }),
  faculty: z
    .enum(fakultasEnum.enumValues, {
      required_error: "Fakultas harus dipilih",
      invalid_type_error: "Fakultas tidak valid",
    })
    .openapi({ example: "STEI-R", description: "Fakultas mahasiswa" }),
  cityOfOrigin: z
    .string()
    .min(1, "Asal kota harus diisi")
    .max(255)
    .openapi({ example: "Bandung", description: "Kota asal mahasiswa" }),
  highschoolAlumni: z
    .string()
    .min(1, "Asal sekolah harus diisi")
    .max(255)
    .openapi({ example: "SMA Negeri 1 Bandung", description: "Asal SMA" }),
  description: z
    .string({
      required_error: "Deskripsi harus diisi",
      invalid_type_error: "Deskripsi harus berupa string",
    })
    .min(3, { message: "Deskripsi terlalu pendek" })
    .openapi({ example: "Mahasiswa baru", description: "Deskripsi mahasiswa" }),
  file: cloudinaryUrlSchema("File Essay Mahasiswa"),
  kk: cloudinaryUrlSchema("Kartu Keluarga"),
  ktm: cloudinaryUrlSchema("Kartu Tanda Mahasiswa"),
  waliRecommendationLetter: cloudinaryUrlSchema("Surat Rekomendasi Wali"),
  transcript: cloudinaryUrlSchema("Transkrip Nilai"),
  salaryReport: cloudinaryUrlSchema("Slip Gaji Orang Tua"),
  pbb: cloudinaryUrlSchema("Bukti Pembayaran PBB"),
  electricityBill: cloudinaryUrlSchema("Tagihan Listrik"),
  ditmawaRecommendationLetter: cloudinaryUrlSchema("Surat Rekomendasi Ditmawa"),
});

export const MahasiswaRegistrationFormSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Nama harus berupa string",
      required_error: "Nama harus diisi",
    })
    .min(3, { message: "Nama terlalu pendek" })
    .max(255, { message: "Nama terlalu panjang" })
    .openapi({ example: "John Doe", description: "Nama mahasiswa" }),
  phoneNumber: PhoneNumberSchema,
  nim: NIMSchema,
  major: z
    .enum(jurusanEnum.enumValues, {
      required_error: "Jurusan harus dipilih",
      invalid_type_error: "Jurusan tidak valid",
    })
    .openapi({
      example: "Teknik Informatika",
      description: "Jurusan mahasiswa",
    }),
  faculty: z
    .enum(fakultasEnum.enumValues, {
      required_error: "Fakultas harus dipilih",
      invalid_type_error: "Fakultas tidak valid",
    })
    .openapi({ example: "STEI-R", description: "Fakultas mahasiswa" }),
  cityOfOrigin: z
    .string()
    .min(1, "Asal kota harus diisi")
    .max(255)
    .openapi({ example: "Bandung", description: "Kota asal mahasiswa" }),
  highschoolAlumni: z
    .string()
    .min(1, "Asal sekolah harus diisi")
    .max(255)
    .openapi({ example: "SMA Negeri 1 Bandung", description: "Asal SMA" }),
  description: z
    .string({
      required_error: "Deskripsi harus diisi",
      invalid_type_error: "Deskripsi harus berupa string",
    })
    .min(3, { message: "Deskripsi terlalu pendek" })
    .openapi({ example: "Mahasiswa baru", description: "Deskripsi mahasiswa" }),
  file: PDFSchema.openapi({ description: "File Essay Mahasiswa" }),
  kk: PDFSchema.openapi({ description: "Kartu Keluarga" }),
  ktm: PDFSchema.openapi({ description: "Kartu Tanda Mahasiswa" }),
  waliRecommendationLetter: PDFSchema.openapi({
    description: "Surat Rekomendasi Wali",
  }),
  transcript: PDFSchema.openapi({ description: "Transkrip Nilai" }),
  salaryReport: PDFSchema.openapi({ description: "Slip Gaji Orang Tua" }),
  pbb: PDFSchema.openapi({ description: "Bukti Pembayaran PBB" }),
  electricityBill: PDFSchema.openapi({ description: "Tagihan Listrik" }),
  ditmawaRecommendationLetter: PDFSchema.openapi({
    description: "Surat Rekomendasi Ditmawa",
  }),
});

export const MahasiswaRegistrationSuccessfulResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Berhasil mendaftar" }),
  body: MahasiswaRegistrationSchema,
});

export const MahasiswaRegistrationFailedResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Gagal mendaftar" }),
  error: z.object({}),
});

export const MahasiswaUnverifiedResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Akun MA belum terverifikasi" }),
  error: z.object({}),
});

// Orang Tua Registration
export const OrangTuaRegistrationSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Nama harus berupa string",
      required_error: "Nama harus diisi",
    })
    .min(3, {
      message: "Nama terlalu pendek",
    })
    .max(255, {
      message: "Nama terlalu panjang",
    })
    .openapi({ example: "John Doe", description: "Nama orang tua" }),
  job: z
    .string({
      invalid_type_error: "Pekerjaan harus berupa string",
      required_error: "Pekerjaan harus diisi",
    })
    .min(3, {
      message: "Pekerjaan terlalu pendek",
    })
    .max(255, {
      message: "Pekerjaan terlalu panjang",
    })
    .openapi({ example: "Guru", description: "Pekerjaan orang tua" }),
  address: z
    .string({
      invalid_type_error: "Alamat harus berupa string",
      required_error: "Alamat harus diisi",
    })
    .min(3, {
      message: "Alamat terlalu pendek",
    })
    .max(255, {
      message: "Alamat terlalu panjang",
    })
    .openapi({ example: "Jl. Merdeka No. 1", description: "Alamat orang tua" }),
  linkage: z.enum(["otm", "dosen", "alumni", "lainnya", "none"]).openapi({
    example: "otm",
    description: "Hubungan dengan mahasiswa",
  }),
  funds: z.coerce
    .number({
      invalid_type_error: "Dana harus berupa angka",
      required_error: "Dana harus diisi",
      message: "Dana harus berupa angka",
    })
    .nonnegative({
      message: "Dana harus lebih dari 0",
    })
    .min(300000, {
      message: "Dana harus lebih dari Rp 300.000",
    })
    .openapi({ example: 1000000, description: "Dana yang disediakan" }),
  maxCapacity: z.coerce
    .number({
      invalid_type_error: "Kapasitas maksimal harus berupa angka",
      required_error: "Kapasitas maksimal harus diisi",
      message: "Kapasitas maksimal harus berupa angka",
    })
    .nonnegative({
      message: "Kapasitas maksimal harus lebih dari 0",
    })
    .openapi({ example: 10, description: "Kapasitas maksimal" }),
  startDate: z
    .string({
      invalid_type_error: "Tanggal invalid",
      required_error: "Tanggal harus diisi",
      message: "Tanggal harus berupa string",
    })
    .refine(
      (value) => {
        const date = new Date(value);
        return date instanceof Date && !isNaN(date.getTime());
      },
      {
        message: "Tanggal tidak valid",
        path: ["startDate"],
      },
    )
    .openapi({ example: "2022-01-01", description: "Tanggal mulai" }),
  maxSemester: z.coerce
    .number({
      invalid_type_error: "Semester maksimal harus berupa angka",
      required_error: "Semester maksimal harus diisi",
      message: "Semester maksimal harus berupa angka",
    })
    .nonnegative({
      message: "Semester maksimal harus lebih dari 0",
    })
    .openapi({ example: 8, description: "Semester maksimal" }),
  transferDate: z.coerce
    .number({
      invalid_type_error: "Tanggal transfer harus berupa angka",
      required_error: "Tanggal transfer harus diisi",
      message: "Tanggal transfer harus berupa angka",
    })
    .nonnegative({
      message: "Tanggal transfer harus lebih dari 0",
    })
    .max(28, {
      message: "Tanggal transfer tidak valid",
    })
    .openapi({ example: 1, description: "Tanggal transfer" }),
  criteria: z
    .string({
      invalid_type_error: "Kriteria harus berupa string",
      required_error: "Kriteria harus diisi",
    })
    .min(3, {
      message: "Kriteria terlalu pendek",
    })
    .openapi({ example: "Kriteria orang tua" }),
});

export const OrangTuaRegistrationSuccessfulResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Berhasil mendaftar" }),
  body: OrangTuaRegistrationSchema,
});

export const OrangTuaRegistrationFailedResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Gagal mendaftar" }),
  error: z.object({}),
});

export const OrangTuaUnverifiedResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Akun belum terverifikasi" }),
  error: z.object({}),
});

export const ProfileOrangTuaResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Berhasil mengakses profil OTA" }),
  body: z.object({
    name: z.string().openapi({ example: "Budi Santoso" }),
    email: EmailSchema,
    phone_number: PhoneNumberSchema,
    join_date: z.string().openapi({ example: "March 2025" }),
  }),
});

//TODO: add join_date to db
export const ProfileMahasiswaResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Berhasil mengakses profil MA" }),
  body: z.object({
    name: z.string().openapi({ example: "Alex Kurniawan" }),
    email: EmailSchema,
    phone_number: PhoneNumberSchema,
    // join_date: z.string().openapi({ example: "March 2025" })
  }),
});
