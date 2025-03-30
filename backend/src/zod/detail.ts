import { z } from "@hono/zod-openapi";

export const MahasiswaDetailParamsSchema = z.object({
  id: z.string().uuid().openapi({
    description: "ID of the mahasiswa to retrieve.",
    example: "3fc0317f-f143-43bf-aa65-13a7a8eca788",
  }),
});

export const MahasiswaDetailResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Detail mahasiswa berhasil diambil" }),
  body: z.object({
    accountId: z.string().uuid().openapi({ 
      example: "3fc0317f-f143-43bf-aa65-13a7a8eca788" 
    }),
    name: z.string().openapi({ example: "John Doe" }),
    nim: z.string().openapi({ example: "13522005" }),
    mahasiswaStatus: z.enum(["active", "inactive"]).openapi({
      example: "inactive",
    }),
    description: z.string().nullable().openapi({
      example: "Mahasiswa aktif yang sedang mencari orang tua asuh",
    }),
    file: z.string().nullable().openapi({
      example: "https://example.com/file.pdf",
    }),
  }),
});