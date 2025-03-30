import { z } from "@hono/zod-openapi";

// Application Status
export const ApplicationStatusParams = z.object({
  id: z.string().openapi({ description: "ID akun" }),
});

export const ApplicationStatusSchema = z.object({
  status: z.enum(["accepted", "rejected"]).openapi({
    description: "Status aplikasi",
    example: "accepted",
  }),
});

export const ApplicationStatusSuccessResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({
    example: "Berhasil mengubah status pendaftaran",
  }),
  body: z.object({
    status: z.enum(["accepted", "rejected"]).openapi({
      description: "Status aplikasi",
      example: "accepted",
    }),
  }),
});
