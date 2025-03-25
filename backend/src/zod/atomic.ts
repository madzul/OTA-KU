import { z } from "@hono/zod-openapi";

const allowedPdfTypes = ["application/pdf"];
const maxPdfSize = 5242880; // 5 MB

export const PDFSchema = z
  .instanceof(File, { message: "File harus berupa PDF" })
  .refine((file) => {
    return file.size <= maxPdfSize;
  }, "PDF file size should be less than 5 MB")
  .refine((file) => {
    return allowedPdfTypes.includes(file.type);
  }, "Only PDF files are allowed")
  .openapi({ description: "PDF file", format: "binary" });

export const EmailSchema = z
  .string({
    invalid_type_error: "Email harus berupa string",
    required_error: "Email harus diisi",
  })
  .email({
    message: "Format email tidak valid",
  })
  .max(255, {
    message: "Email terlalu panjang",
  })
  .openapi({
    example: "johndoe@example.com",
    description: "The user's email.",
  });

export const PhoneNumberSchema = z
  .string({
    invalid_type_error: "Nomor telepon harus berupa string",
    required_error: "Nomor telepon harus diisi",
  })
  .max(32, {
    message: "Nomor telepon terlalu panjang",
  })
  .regex(/\d{7,13}$/, {
    message: "Nomor telepon tidak valid",
  })
  .openapi({
    example: "081234567890",
    description: "The user phone number.",
  });

export const PasswordSchema = z
  .string({
    invalid_type_error: "Password harus berupa string",
    required_error: "Password harus diisi",
  })
  .min(8, {
    message: "Password minimal 8 karakter",
  })
  .openapi({
    example: "secret123",
    description: "The user's password.",
  });

export const TokenSchema = z.string().openapi({
  example: "eyJhbGciOiJIUzI1...",
  description: "JWT token for authentication.",
});

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
