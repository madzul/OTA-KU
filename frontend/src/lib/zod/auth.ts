import { z } from "zod";

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
  });

export const PasswordSchema = z
  .string({
    invalid_type_error: "Password harus berupa string",
    required_error: "Password harus diisi",
  })
  .min(8, {
    message: "Password minimal 8 karakter",
  });

export const UserLoginRequestSchema = z.object({
  identifier: z.union([EmailSchema, PhoneNumberSchema], {
    message: "Harus berupa email atau nomor telepon",
  }),
  password: PasswordSchema,
});

export const UserRegisRequestSchema = z
  .object({
    type: z.enum(["mahasiswa", "ota"], {
      message: "Tipe tidak valid",
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
  .refine(
    (data) => {
      if (data.type === "mahasiswa") {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@mahasiswa.itb.ac.id$/;
        return emailRegex.test(data.email);
      }
      return true;
    },
    {
      message: "Email harus berdomain mahasiswa.itb.ac.id",
      path: ["email"],
    },
  );

export const OTPVerificationRequestSchema = z.object({
  pin: z.string().min(6, {
    message: "Kode OTP harus terdiri dari 6 karakter.",
  }),
});
