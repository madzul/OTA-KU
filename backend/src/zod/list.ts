import { z } from "@hono/zod-openapi";
import { NIMSchema, PhoneNumberSchema } from "./atomic.js";

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
        name: z.string().openapi({ example: "John Doe" }),
        email: z.string().openapi({ example: "johndoe@example.com" }),
        phoneNumber: z.string().openapi({ example: "081234567890" }),
        jurusan: z
          .string()
          
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
    totalPagination: z.number().openapi({ example: 10 }),
    totalData: z.number().openapi({ example: 100 }),
    totalPending: z.number().openapi({ example: 50 }),
    totalAccepted: z.number().openapi({ example: 30 }),
    totalRejected: z.number().openapi({ example: 20 }),
  }),
});

export const OrangTuaDetailsListQuerySchema = z.object({
  q: z.string().optional().openapi({
    description: "Query string for searching mahasiswa.",
    example: "John Doe",
  }),
  page: z.coerce.number().optional().openapi({
    description: "Page number for pagination.",
    example: 1,
  }),
  status: z.enum(["pending", "accepted", "rejected"]).optional().openapi({
    description: "Status of mahasiswa.",
    example: "pending",
  }),
});

export const OrangTuaDetailsListQueryResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Daftar mahasiswa berhasil diambil" }),
  body: z.object({
    data: z.array(
      z.object({
        id: z.string().openapi({ example: "1" }),
        name: z.string().openapi({ example: "John Doe" }),
        email: z.string().openapi({ example: "johndoe@example.com" }),
        phoneNumber: z.string().openapi({ example: "081234567890" }),
        provider: z.enum(["credentials", "azure"]).openapi({
          example: "credentials",
        }),
        status: z
          .enum(["verified", "unverified"])
          .openapi({ example: "unverified" }),
        applicationStatus: z.enum(["accepted", "rejected", "pending"]).openapi({
          example: "pending",
        }),
        job: z.string().openapi({ example: "Guru" }),
        address: z.string().openapi({ example: "Jl. Merdeka No. 1" }),
        linkage: z.enum(["otm", "dosen", "alumni", "lainnya", "none"]).openapi({
          example: "otm",
        }),
        funds: z.coerce.number().openapi({ example: 1000000 }),
        maxCapacity: z.coerce.number().openapi({ example: 10 }),
        startDate: z.string().openapi({ example: "2022-01-01" }),
        maxSemester: z.coerce.number().openapi({ example: 8 }),
        transferDate: z.coerce.number().openapi({ example: 1 }),
        criteria: z.string().openapi({ example: "Kriteria orang tua" }),
      }),
    ),
    totalPagination: z.number().openapi({ example: 10 }),
    totalData: z.number().openapi({ example: 100 }),
    totalPending: z.number().openapi({ example: 50 }),
    totalAccepted: z.number().openapi({ example: 30 }),
    totalRejected: z.number().openapi({ example: 20 }),
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
        name: z.string().openapi({ example: "John Doe" }),
        email: z.string().openapi({ example: "johndoe@example.com" }),
        phoneNumber: z.string().openapi({ example: "081234567890" }),
        jurusan: z
          .string()
          
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
    totalPagination: z.number().openapi({ example: 10 }),
    totalData: z.number().openapi({ example: 100 }),
    totalPending: z.number().openapi({ example: 50 }),
    totalAccepted: z.number().openapi({ example: 30 }),
    totalRejected: z.number().openapi({ example: 20 }),
  }),
});

export const OrangTuaDetailsListQuerySchema = z.object({
  q: z.string().optional().openapi({
    description: "Query string for searching mahasiswa.",
    example: "John Doe",
  }),
  page: z.coerce.number().optional().openapi({
    description: "Page number for pagination.",
    example: 1,
  }),
  status: z.enum(["pending", "accepted", "rejected"]).optional().openapi({
    description: "Status of mahasiswa.",
    example: "pending",
  }),
});

export const OrangTuaDetailsListQueryResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Daftar mahasiswa berhasil diambil" }),
  body: z.object({
    data: z.array(
      z.object({
        id: z.string().openapi({ example: "1" }),
        name: z.string().openapi({ example: "John Doe" }),
        email: z.string().openapi({ example: "johndoe@example.com" }),
        phoneNumber: z.string().openapi({ example: "081234567890" }),
        provider: z.enum(["credentials", "azure"]).openapi({
          example: "credentials",
        }),
        status: z
          .enum(["verified", "unverified"])
          .openapi({ example: "unverified" }),
        applicationStatus: z.enum(["accepted", "rejected", "pending"]).openapi({
          example: "pending",
        }),
        job: z.string().openapi({ example: "Guru" }),
        address: z.string().openapi({ example: "Jl. Merdeka No. 1" }),
        linkage: z.enum(["otm", "dosen", "alumni", "lainnya", "none"]).openapi({
          example: "otm",
        }),
        funds: z.coerce.number().openapi({ example: 1000000 }),
        maxCapacity: z.coerce.number().openapi({ example: 10 }),
        startDate: z.string().openapi({ example: "2022-01-01" }),
        maxSemester: z.coerce.number().openapi({ example: 8 }),
        transferDate: z.coerce.number().openapi({ example: 1 }),
        criteria: z.string().openapi({ example: "Kriteria orang tua" }),
      }),
    ),
    totalPagination: z.number().openapi({ example: 10 }),
    totalData: z.number().openapi({ example: 100 }),
    totalPending: z.number().openapi({ example: 50 }),
    totalAccepted: z.number().openapi({ example: 30 }),
    totalRejected: z.number().openapi({ example: 20 }),
  }),
});

export const OTAListQuerySchema = z.object({
  q: z.string().optional().openapi({
    description: "Query string for searching mahasiswa.",
    example: "John Doe",
  }),
  page: z.coerce.number().optional().openapi({
    description: "Page number for pagination.",
    example: 1,
  })
});

export const OTAListElementSchema = z.object({
  accountId: z.string().openapi({ example: "1" }),
  name: z.string().openapi({ example: "John Doe" }),
  phoneNumber: PhoneNumberSchema,
  nominal: z.number().openapi({ example: 5000000 }),
});

export const OTAListQueryResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Daftar OTA-ku berhasil diambil" }),
  body: z.object({
    data: z.array(OTAListElementSchema),
    totalData: z.number().openapi({ example: 100 }),
  }),
});

export const MAListElementSchema = z.object({
  accountId: z.string().openapi({ example: "1" }),
  name: z.string().openapi({ example: "John Doe" }),
  nim: NIMSchema,
  mahasiswaStatus: z.enum(["active", "inactive"]).openapi({
    example: "active",
    description: "Status mahasiswa",
  }),
});

export const MAListQueryResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Daftar MA berhasil diambil" }),
  body: z.object({
    data: z.array(MAListElementSchema),
    totalData: z.number().openapi({ example: 100 }),
  }),
});