import { z } from "@hono/zod-openapi";

// Mahasiswa
export const VerifiedMahasiswaListQuerySchema = z.object({
  q: z.string().optional().openapi({
    description: "Query string for searching mahasiswa.",
    example: "John Doe",
  }),
  page: z.coerce.number().optional().openapi({
    description: "Page number for pagination.",
    example: 1,
  }),
});

export const VerifiedMahasiswaListQueryResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Daftar mahasiswa berhasil diambil" }),
  body: z.object({
    data: z.array(
      z.object({
        accountId: z.string().openapi({ example: "1" }),
        name: z.string().openapi({ example: "John Doe" }),
        nim: z.string().openapi({ example: "13522005" }),
        mahasiswaStatus: z.enum(["active", "inactive"]).openapi({
          example: "active",
        }),
        description: z.string().openapi({
          example: "Mahasiswa aktif yang sedang mencari orang tua asuh",
        }),
        file: z.string().openapi({
          example: "https://example.com/file.pdf",
        }),
      }),
    ),
    totalData: z.number().openapi({ example: 100 }),
  }),
});

export const MahasiswaDetailsListQuerySchema = z.object({
  q: z.string().optional().openapi({
    description: "Query string for searching mahasiswa.",
    example: "John Doe",
  }),
  page: z.coerce.number().optional().openapi({
    description: "Page number for pagination.",
    example: 1,
  }),
  jurusan: z.string().optional().openapi({
    description: "Jurusan of mahasiswa.",
    example: "Teknik Informatika",
  }),
  status: z.enum(["pending", "accepted", "rejected"]).optional().openapi({
    description: "Status of mahasiswa.",
    example: "pending",
  }),
});

export const MahasiswaDetailsListQueryResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Daftar mahasiswa berhasil diambil" }),
  body: z.object({
    data: z.array(
      z.object({
        id: z.string().openapi({ example: "1" }),
        name: z.string().nullable().openapi({ example: "John Doe" }),
        email: z.string().openapi({ example: "johndoe@example.com" }),
        phoneNumber: z.string().nullable().openapi({ example: "081234567890" }),
        jurusan: z
          .string()
          .nullable()
          .openapi({ example: "Teknik Informatika" }),
        provider: z.enum(["credentials", "azure"]).openapi({
          example: "credentials",
        }),
        status: z
          .enum(["verified", "unverified"])
          .openapi({ example: "unverified" }),
        applicationStatus: z.enum(["accepted", "rejected", "pending"]).openapi({
          example: "pending",
        }),
        nim: z.string().nullable().openapi({ example: "13522005" }),
        mahasiswaStatus: z.enum(["active", "inactive"]).nullable().openapi({
          example: "active",
        }),
        description: z.string().nullable().openapi({
          example: "Mahasiswa aktif yang sedang mencari orang tua asuh",
        }),
        file: z.string().nullable().openapi({
          example: "https://example.com/file.pdf",
        }),
      }),
    ),
    totalPagination: z.number().openapi({ example: 10 }),
    totalData: z.number().openapi({ example: 100 }),
    totalPending: z.number().openapi({ example: 50 }),
    totalAccepted: z.number().openapi({ example: 30 }),
    totalRejected: z.number().openapi({ example: 20 }),
  }),
});
