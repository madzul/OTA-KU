import { z } from "@hono/zod-openapi";

const allowedPdfTypes = ["application/pdf"];
const maxPdfSize = 5242880; // 5 MB

export const pdfSchema = z
  .custom<File>()
  .refine((file) => {
    return file.size <= maxPdfSize;
  }, "PDF file size should be less than 5 MB")
  .refine((file) => {
    return allowedPdfTypes.includes(file.type);
  }, "Only PDF files are allowed");

export const NIMSchema = z
  .string({
    invalid_type_error: "NIM harus berupa string",
    required_error: "NIM harus diisi",
  })
  .length(8, {
    message: "NIM harus 8 karakter",
  })
  .regex(/\d{8}$/, {
    message: "Format NIM tidak valid",
  })
  .openapi({ example: "13522005", description: "Nomor Induk Mahasiswa" });

export const MahasiwaRegistrationSchema = z.object({
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
    .openapi({ example: "John Doe", description: "Nama mahasiswa" }),
  nim: NIMSchema,
  description: z
    .string({
      required_error: "Deskripsi harus diisi",
      invalid_type_error: "Deskripsi harus berupa string",
    })
    .min(3, {
      message: "Deskripsi terlalu pendek",
    })
    .openapi({ example: "Mahasiswa baru", description: "Deskripsi mahasiswa" }),
  file: z
    .string({
      required_error: "File harus diisi",
      invalid_type_error: "File harus berupa string",
    })
    .url({
      message: "File harus berupa URL",
    })
    .regex(/^https:\/\/res\.cloudinary\.com/, {
      message: "File harus berupa URL dari cloudinary",
    })
    .openapi({
      example: "https://res.cloudinary.com/your-image.jpg",
      description: "Foto mahasiswa",
    }),
});

export const MahasiswaRegistrationFormSchema = z.object({
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
    .openapi({ example: "John Doe", description: "Nama mahasiswa" }),
  nim: NIMSchema,
  description: z
    .string({
      required_error: "Deskripsi harus diisi",
      invalid_type_error: "Deskripsi harus berupa string",
    })
    .min(3, {
      message: "Deskripsi terlalu pendek",
    })
    .openapi({ example: "Mahasiswa baru", description: "Deskripsi mahasiswa" }),
  file: pdfSchema.openapi({
    description: "Foto mahasiswa",
  }),
});

export const MahasiswaRegistrationSuccessfulResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Berhasil mendaftar" }),
  data: MahasiwaRegistrationSchema,
});

export const MahasiswaRegistrationFailedResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Gagal mendaftar" }),
  error: z.object({}),
});

export const InternalServerErrorResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Internal server error" }),
  error: z.object({}),
});
