import { createRoute } from "@hono/zod-openapi";

import { AuthorizationErrorResponse } from "../types/response.js";
import {
  InternalServerErrorResponse,
  MahasiswaRegistrationFailedResponse,
  MahasiswaRegistrationFormSchema,
  MahasiswaRegistrationSuccessfulResponse,
  OrangTuaRegistrationFailedResponse,
  OrangTuaRegistrationSchema,
  OrangTuaRegistrationSuccessfulResponse,
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
        "multipart/form-data": {
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

export const pendaftaranOrangTuaRoute = createRoute({
  operationId: "pendaftaranOrangTua",
  tags: ["Profile"],
  method: "post",
  path: "/orang-tua",
  description: "Pendaftaran orang tua.",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: OrangTuaRegistrationSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Berhasil mendaftar.",
      content: {
        "application/json": { schema: OrangTuaRegistrationSuccessfulResponse },
      },
    },
    400: {
      description: "Gagal mendaftar.",
      content: {
        "application/json": { schema: OrangTuaRegistrationFailedResponse },
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
