import { z } from "zod";

export const NotesVerificationRequestSchema = z.object({
  status: z.enum(["accepted", "rejected", "pending", "unregistered"], {
    message: "Status harus berupa accepted atau rejected",
  }),
  notes: z
    .string({
      invalid_type_error: "Catatan untuk Orang Tua Asuh harus berupa string",
      required_error: "Catatan untuk Orang Tua Asuh harus diisi",
    })
    .min(1, {
      message: "Catatan untuk Orang Tua Asuh tidak boleh kosong",
    }),
  adminOnlyNotes: z
    .string({
      invalid_type_error: "Catatan khusus Admin harus berupa string",
      required_error: "Catatan khusus Admin harus diisi",
    })
    .min(1, {
      message: "Catatan khusus Admin tidak boleh kosong",
    }),
});
