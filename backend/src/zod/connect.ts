import { z } from "@hono/zod-openapi";

// Mahasiswa Connect
export const MahasiwaConnectSchema = z.object({
  otaId: z
    .string({
      required_error: "ID orang tua asuh harus diisi",
      invalid_type_error: "ID orang tua asuh harus berupa string",
    })
    .uuid({
      message: "ID orang tua asuh tidak valid",
    })
    .openapi({
      description: "ID orang tua asuh",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
  mahasiswaId: z
    .string({
      required_error: "ID mahasiswa asuh harus diisi",
      invalid_type_error: "ID mahasiswa asuh harus berupa string",
    })
    .uuid({
      message: "ID mahasiswa asuh tidak valid",
    })
    .openapi({
      description: "ID mahasiswa asuh",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
});

export const OrangTuaSuccessResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({
    example: "Berhasil menghubungkan orang tua asuh dengan mahasiswa asuh",
  }),
  body: z.object({
    mahasiswaId: z.string().uuid().openapi({
      description: "ID mahasiswa asuh",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
    otaId: z.string().uuid().openapi({
      description: "ID orang tua asuh",
      example: "123e4567-e89b-12d3-a456-426614174000",
    }),
  }),
});

export const OrangTuaFailedResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({
    example: "Gagal menghubungkan orang tua asuh dengan mahasiswa asuh",
  }),
  error: z.object({}),
});

export const OrangTuaUnverifiedResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Akun OTA belum terverifikasi" }),
  error: z.object({}),
});
