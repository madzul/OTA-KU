import { z } from "@hono/zod-openapi";

import { EmailSchema } from "./atomic.js";

export const SendOtpRequestSchema = z
  .object({
    email: EmailSchema,
  })
  .openapi("SendOtpRequestSchema");

export const SendOtpResponseSchema = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "OTP sent successfully" }),
});

export const BadRequestSendOtpResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Missing required fields" }),
  error: z.object({}),
});

export const EmailNotFoundResponseSchema = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "User not found" }),
  error: z.object({}),
});
