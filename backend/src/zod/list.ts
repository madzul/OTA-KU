import { z } from "@hono/zod-openapi";

// Mahasiswa
export const MahasiswaListQuerySchema = z.object({
  q: z.string().optional().openapi({
    description: "Query string for searching mahasiswa.",
    example: "John Doe",
  }),
  page: z.coerce.number().optional().openapi({
    description: "Page number for pagination.",
    example: 1,
  }),
});

export const MahasiswaListQueryResponse = z.object({
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
