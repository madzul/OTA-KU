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

export const OtaDetailParamsSchema = z.object({
    id: z.string().uuid().openapi({
      description: "ID of the orang tua asuh to retrieve.",
      example: "addd5a71-2b68-4a1c-9479-d7831f57b5ca",
    }),
  });
  
export const OtaDetailResponse = z.object({
success: z.boolean().openapi({ example: true }),
message: z.string().openapi({ example: "Detail orang tua asuh berhasil diambil" }),
body: z.object({
    accountId: z.string().uuid().openapi({ 
    example: "addd5a71-2b68-4a1c-9479-d7831f57b5ca" 
    }),
    name: z.string().openapi({ example: "OTA Organization One" }),
    job: z.string().openapi({ example: "Scholarship Provider" }),
    address: z.string().openapi({ example: "Jl. Example No. 1, Jakarta" }),
    linkage: z.enum(["otm", "alumni"]).openapi({
    example: "otm",
    }),
    funds: z.number().openapi({ example: 50000000 }),
    maxCapacity: z.number().openapi({ example: 10 }),
    startDate: z.string().openapi({ example: "2025-03-30T09:40:05.508Z" }),
    maxSemester: z.number().openapi({ example: 8 }),
    transferDate: z.number().openapi({ example: 10 }),
    criteria: z.string().openapi({ example: "GPA minimum 3.5, active in organizations" }),
}),
});