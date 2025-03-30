import { createRoute } from "@hono/zod-openapi";

import { AuthorizationErrorResponse } from "../types/response.js";
import {
  MahasiwaConnectSchema,
  OrangTuaFailedResponse,
  OrangTuaSuccessResponse,
  OrangTuaUnverifiedResponse,
} from "../zod/connect.js";
import { InternalServerErrorResponse } from "../zod/response.js";

export const connectOtaMahasiswaRoute = createRoute({
  operationId: "connectOtaMahasiswa",
  tags: ["Connect"],
  method: "post",
  path: "/mahasiswa",
  description: "Menghubungkan orang tua asuh dengan mahasiswa asuh.",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: MahasiwaConnectSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description:
        "Berhasil menghubungkan orang tua asuh dengan mahasiswa asuh.",
      content: {
        "application/json": {
          schema: OrangTuaSuccessResponse,
        },
      },
    },
    400: {
      description: "Gagal menghubungkan orang tua asuh dengan mahasiswa asuh.",
      content: {
        "application/json": {
          schema: OrangTuaFailedResponse,
        },
      },
    },
    401: AuthorizationErrorResponse,
    403: {
      description: "Akun belum terverifikasi.",
      content: {
        "application/json": {
          schema: OrangTuaUnverifiedResponse,
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": { schema: InternalServerErrorResponse },
      },
    },
  },
});
