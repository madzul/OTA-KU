import { z } from "@hono/zod-openapi";

export const TerminateRequestSchema = z.object({
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

export const requestTerminateMASuccessResponse = z.object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({
      example: "Berhasil mengirimkan request terminasi hubungan dari MA",
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

export const requestTerminateMAFailedResponse = z.object({
    success: z.boolean().openapi({ example: false }),
    message: z.string().openapi({
      example: "Gagal mengirimkan request terminasi hubungan dari MA",
    }),
    error: z.object({}),
});

export const requestTerminateOTASuccessResponse = z.object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({
      example: "Berhasil mengirimkan request terminasi hubungan dari OTA",
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

export const requestTerminateOTAFailedResponse = z.object({
    success: z.boolean().openapi({ example: false }),
    message: z.string().openapi({
      example: "Gagal mengirimkan request terminasi hubungan dari OTA",
    }),
    error: z.object({}),
});

export const validateTerminateSuccessResponse = z.object({
    success: z.boolean().openapi({ example: false }),
    message: z.string().openapi({
      example: "Berhasil memvalidasi terminasi hubungan",
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

export const validateTerminateFailedResponse = z.object({
    success: z.boolean().openapi({ example: false }),
    message: z.string().openapi({
      example: "Gagal memvalidasi terminasi hubungan",
    }),
    error: z.object({}),
});

export const AdminUnverifiedResponse = z.object({
    success: z.boolean().openapi({ example: false }),
    message: z.string().openapi({ example: "Akun admin belum terverifikasi" }),
    error: z.object({}),
  });
