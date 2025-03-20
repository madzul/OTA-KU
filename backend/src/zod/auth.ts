import { z } from "@hono/zod-openapi";

export const EmailSchema = z
  .string({
    invalid_type_error: "Email harus berupa string",
    required_error: "Email harus diisi",
  })
  .email({
    message: "Format email tidak valid",
  })
  .max(255, {
    message: "Email terlalu panjang",
  })
  .openapi({
    example: "johndoe@example.com",
    description: "The user's email.",
  });

export const PhoneNumberSchema = z
  .string({
    invalid_type_error: "Nomor telepon harus berupa string",
    required_error: "Nomor telepon harus diisi",
  })
  .max(32, {
    message: "Nomor telepon terlalu panjang",
  })
  .regex(/\d{7,13}$/, {
    message: "Nomor telepon tidak valid",
  })
  .openapi({
    example: "081234567890",
    description: "The user phone number.",
  });

export const PasswordSchema = z
  .string({
    invalid_type_error: "Password harus berupa string",
    required_error: "Password harus diisi",
  })
  .min(8, {
    message: "Password minimal 8 karakter",
  })
  .openapi({
    example: "secret123",
    description: "The user's password.",
  });

export const UserLoginRequestSchema = z
  .object({
    identifier: z
      .union([EmailSchema, PhoneNumberSchema], {
        message: "Harus berupa email atau nomor telepon",
      })
      .openapi({
        examples: ["johndoe@example.com", "081234567890"],
      }),
    password: PasswordSchema,
  })
  .openapi("UserLoginRequestSchema");

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
    type: z
      .enum(["mahasiswa", "ota"], {
        message: "Tipe tidak valid",
      })
      .openapi({
        example: "mahasiswa",
        description: "The user's type.",
      }),
    email: EmailSchema,
    phoneNumber: PhoneNumberSchema,
    password: PasswordSchema,
    confirmPassword: PasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password gagal",
    path: ["confirmPassword"],
  })
  .openapi("UserRegisRequestSchema");

export const SuccessfulRegisResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Authenticated" }),
  body: z.object({
    token: z.string().openapi({
      example: "eyJhbGciOiJIUzI1...",
      description: "JWT token for authentication.",
    }),
    id: z.string().openapi({
      example: "3762d870-158e-4832-804c-f0be220d40c0",
      description: "Unique account ID",
    }),
    email: z.string().openapi({
      example: "johndoe@example.com",
      description: "The user's email.",
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
  body: z
    .object({
      id: z.string().openapi({ example: "1" }),
      email: z.string().openapi({ example: "johndoe@example.com" }),
      phoneNumber: z.string().openapi({ example: "081234567890" }),
      type: z
        .enum(["mahasiswa", "ota", "admin"])
        .openapi({ example: "mahasiswa" }),
    })
    .openapi("UserSchema"),
});

export const UserNotAuthenticatedResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Unauthenticated" }),
});

export const LogoutSuccessfulResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Logout successful" }),
});

export const JWTPayloadSchema = z
  .object({
    id: z.string().openapi({ example: "1" }),
    email: z.string().openapi({ example: "johndoe@example.com" }),
    phoneNumber: z.string().openapi({ example: "081234567890" }),
    type: z
      .enum(["mahasiswa", "ota", "admin"])
      .openapi({ example: "mahasiswa" }),
    iat: z.number().openapi({ example: 1630000000 }),
    exp: z.number().openapi({ example: 1630000000 }),
  })
  .openapi("JWTPayloadSchema");
