import { z } from "@hono/zod-openapi";
import { NIMSchema, PhoneNumberSchema } from "./atomic.js";

export const TransactionListOTAQuerySchema = z.object({
    q: z.string().optional().openapi({
      description: "Query string for searching mahasiswa.",
      example: "John Doe",
    }),
    page: z.coerce.number().optional().openapi({
      description: "Page number for pagination.",
      example: 1,
    }),
    status: z.enum(["unpaid", "pending", "paid"]).optional().openapi({
      description: "Status of transaction.",
      example: "pending",
    }),
});

export const TransactionListOTAQueryResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Daftar transaction untuk OTA berhasil diambil" }),
  body: z.object({
    data: z.array(
      z.object({
        name: z.string().openapi({ example: "John Doe" }),
        nim: NIMSchema,
        bill: z.number().openapi({ example: 300000}),
        amount_paid: z.number().openapi({ example: 200000}),
        due_date: z.string().openapi({ example: "2023-10-01T00:00:00.000Z" }),
        status: z
          .enum([
              "unpaid",
              "pending",
              "paid"
          ])
          .openapi({ example: "pending" }),
        receipt: z
          .string()
          .openapi({ example: "https://example.com/file.pdf" }),
      })
    ),
    totalData: z.number().openapi({ example: 100 })
  })
})

export const TransactionListAdminQuerySchema = z.object({
    month: z
      .string()
      .optional()
      .refine((value) => {
        if (value === undefined) return true;
        const validMonths = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        return validMonths.includes(value);
      }, {
        message: "Invalid month name. Must be one of January to December.",
      })
      .openapi({
        description: "Month filter",
        example: "June",
      }),

    year: z
      .number()
      .min(2024, { message: "Year must be 2024 or later." })
      .max(new Date().getFullYear(), { message: `Year cannot be in the future.` })
      .optional()
      .openapi({
        description: "Year filter",
        example: 2024,
      }),

    page: z.coerce.number().optional().openapi({
      description: "Page number for pagination.",
      example: 1,
    }),
    
    status: z.enum(["unpaid", "pending", "pending"]).optional().openapi({
      description: "Status of transaction.",
      example: "pending",
    }),
});

export const TransactionListAdminQueryResponse = z.object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: "Daftar transaction untuk Admin berhasil diambil" }),
    body: z.object({
      data: z.array(
        z.object({
          name_ma: z.string().openapi({ example: "John Doe" }),
          nim_ma: NIMSchema,
          name_ota: z.string().openapi({ example: "Jane Doe" }),
          number_ota: PhoneNumberSchema,
          bill: z.number().openapi({ example: 300000}),
          amount_paid: z.number().openapi({ example: 200000}),
          due_date: z.string().openapi({ example: "2023-10-01T00:00:00.000Z" }),
          status: z
            .enum([
                "unpaid",
                "pending",
                "paid"
            ])
            .openapi({ example: "pending" }),
          receipt: z
            .string()
            .openapi({ example: "https://example.com/file.pdf" }),
        })
      ),
      totalData: z.number().openapi({ example: 100 })
    })
  }) 

export const TransactionDetailQueryResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Detail transaction berhasil diambil" }),
  body: z.object({
    nama_ma: z.string().openapi({ example: "John Doe" }),
    nim_ma: NIMSchema,
    fakultas: z.string().openapi({ example: "STEI-K"}), //TODO: kalau ada waktu bikin jadi enum,
    jurusan: z.string().openapi({ example: "Teknik Informatika "}),
    data: z.array(
      z.object({
        tagihan: z.number().openapi({ example: 300000}),
        pembayaran: z.number().openapi({ example: 200000}),
        due_date: z.string().openapi({ example: "2023-10-01T00:00:00.000Z" }),
        status_bayar: z
          .enum([
              "unpaid",
              "pending",
              "paid"
          ])
          .openapi({ example: "pending" }),
        bukti_bayar: z
          .string()
          .openapi({ example: "https://example.com/file.pdf" }),
      })
    ),
    totalData: z.number().openapi({ example: 100 })
  })
})

export const DetailTransactionParams = z.object({
    id: z.string().openapi({ description: "ID mahasiswa asuh yang ingin diperiksa daftar tagihannya" }),
    page: z.coerce.number().optional().openapi({
      description: "Page number for pagination.",
      example: 1,
    }),
});

