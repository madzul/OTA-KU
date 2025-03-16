import { z } from "@hono/zod-openapi";

export const UserLoginRequestSchema = z.object({
  email: z.string().email().openapi({
    example: "johndoe@example.com",
    description: "The user's email.",
  }),
  password: z.string().min(8).openapi({
    example: "secret123",
    description: "The user's password.",
  }),
});

export const SuccessfulLoginResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Login successful" }),
  body: z.object({
    token: z.string().openapi({
      example: "eyJhbGciOiJIUzI1...",
      description: "JWT token for authentication.",
    }),
  }),
});

export const InvalidLoginResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Invalid credentials" }),
  error: z.string().openapi({ example: "Password comparison failed" }),
});

export const BadRequestLoginResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Missing required fields" }),
  error: z.string().openapi({ example: "Username and password are required" }),
});

export const UserRegisRequestSchema = z
  .object({
    type: z.enum(["mahasiswa", "ota"]).openapi({
      example: "mahasiswa",
      description: "The user's type.",
    }),
    email: z.string().email().openapi({
      example: "johndoe@example.com",
      description: "The user's email.",
    }),
    phoneNumber: z.string().openapi({
      example: "081234567890",
      description: "The user's phone number.",
    }),
    password: z.string().min(8).openapi({
      example: "secret123",
      description: "The user's password.",
    }),
    confirmPassword: z.string().min(8).openapi({
      example: "secret123",
      description: "The user's password confirmation.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SuccessfulRegisResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Authenticated" }),
  body: z.object({
    token: z.string().openapi({
      example: "eyJhbGciOiJIUzI1...",
      description: "JWT token for authentication.",
    }),
  }),
});

export const BadRequestRegisResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Missing password" }),
  error: z.object({}),
});

export const InternalServerErrorResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Internal server error" }),
  error: z.object({}),
});

export const UserAuthenticatedResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Authenticated" }),
  body: z.object({
    id: z.string().openapi({ example: "1" }),
    email: z.string().openapi({ example: "johndoe@example.com" }),
    phoneNumber: z.string().openapi({ example: "081234567890" }),
    type: z.enum(["mahasiswa", "ota"]).openapi({ example: "mahasiswa" }),
  }),
});

export const UserNotAuthenticatedResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Unauthenticated" }),
});

export const LogoutSuccessfulResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Logout successful" }),
});
