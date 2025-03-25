import { z } from "zod";

import { NIMSchema, PDFSchema } from "./atomic";
import { PhoneNumberSchema } from "./auth";

export const MahasiswaRegistrationFormSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Nama harus berupa string",
      required_error: "Nama harus diisi",
    })
    .min(3, {
      message: "Nama terlalu pendek",
    })
    .max(255, {
      message: "Nama terlalu panjang",
    }),
  phoneNumber: PhoneNumberSchema,
  nim: NIMSchema,
  description: z
    .string({
      required_error: "Deskripsi harus diisi",
      invalid_type_error: "Deskripsi harus berupa string",
    })
    .min(3, {
      message: "Deskripsi terlalu pendek",
    }),
  file: PDFSchema,
});
