import { createRoute } from "@hono/zod-openapi";

import { AuthorizationErrorResponse } from "../types/response.js";
import {
  MahasiswaListQueryResponse,
  MahasiswaListQuerySchema,
  OTAListQueryResponse,
  OTAListQuerySchema,
} from "../zod/list.js";
import { InternalServerErrorResponse } from "../zod/response.js";

export const listMahasiswaOtaRoute = createRoute({
  operationId: "listMahasiswaOta",
  tags: ["List"],
  method: "get",
  path: "/mahasiswa",
  description: "List mahasiswa asuh yang dapat dipilih orang tua asuh.",
  request: {
    query: MahasiswaListQuerySchema,
  },
  responses: {
    200: {
      description: "Berhasil mendapatkan daftar mahasiswa.",
      content: {
        "application/json": {
          schema: MahasiswaListQueryResponse,
        },
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

export const listOtaKuRoute = createRoute({
  operationId: "listOtaKu",
  tags: ["List"],
  method: "get",
  path: "/orang-tua",
  description: "List orang tua asuh yang membantu saya",
  request: {
    query: OTAListQuerySchema,
  },
  responses: {
    200: {
      description: "Berhasil mendapatkan daftar OTA-ku",
      content: {
        "application/json": {
          schema: OTAListQueryResponse
        }
      }
    },
    401: AuthorizationErrorResponse,
    500: {
      description: "Internal server error",
      content: {
        "application/json": { schema: InternalServerErrorResponse },
      },
    },
  }
})
