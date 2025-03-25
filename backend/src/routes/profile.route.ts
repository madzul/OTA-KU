import { createRoute } from "@hono/zod-openapi";

import { AuthorizationErrorResponse } from "../types/response.js";
import {
  InternalServerErrorResponse,
  MahasiswaRegistrationFailedResponse,
  MahasiswaRegistrationFormSchema,
  MahasiswaRegistrationSuccessfulResponse,
} from "../zod/profile.js";

export const pendaftaranMahasiswaRoute = createRoute({
  operationId: "pendaftaranMahasiswa",
  tags: ["Profile"],
  method: "post",
  path: "/mahasiswa",
  description: "Pendaftaran mahasiswa asuh.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: MahasiswaRegistrationFormSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Berhasil mendaftar.",
      content: {
        "application/json": { schema: MahasiswaRegistrationSuccessfulResponse },
      },
    },
    400: {
      description: "Gagal mendaftar.",
      content: {
        "application/json": { schema: MahasiswaRegistrationFailedResponse },
      },
    },
    401: AuthorizationErrorResponse,
    500: {
      description: "Internal server error",
      content: {
        "application/json": { schema: InternalServerErrorResponse },
      },
    },
  },
});
