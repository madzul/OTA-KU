import { createRoute } from "@hono/zod-openapi";

import { AuthorizationErrorResponse } from "../types/response.js";
import {
  MahasiswaDetailsListQueryResponse,
  MahasiswaDetailsListQuerySchema,
  VerifiedMahasiswaListQueryResponse,
  VerifiedMahasiswaListQuerySchema,
} from "../zod/list.js";
import { InternalServerErrorResponse } from "../zod/response.js";

export const listMahasiswaOtaRoute = createRoute({
  operationId: "listMahasiswaOta",
  tags: ["List"],
  method: "get",
  path: "/mahasiswa/verified",
  description: "List mahasiswa asuh yang dapat dipilih orang tua asuh.",
  request: {
    query: VerifiedMahasiswaListQuerySchema,
  },
  responses: {
    200: {
      description: "Berhasil mendapatkan daftar mahasiswa.",
      content: {
        "application/json": {
          schema: VerifiedMahasiswaListQueryResponse,
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

export const listMahasiswaAdminRoute = createRoute({
  operationId: "listMahasiswaAdmin",
  tags: ["List"],
  method: "get",
  path: "/mahasiswa/details",
  description: "List mahasiswa asuh beserta detailnya.",
  request: {
    query: MahasiswaDetailsListQuerySchema,
  },
  responses: {
    200: {
      description: "Berhasil mendapatkan daftar mahasiswa.",
      content: {
        "application/json": {
          schema: MahasiswaDetailsListQueryResponse,
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
