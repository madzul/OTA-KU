import { createRoute } from "@hono/zod-openapi";
import { AuthorizationErrorResponse } from "../types/response.js";
import {
  MahasiswaDetailParamsSchema,
  MahasiswaDetailResponse,
} from "../zod/detail.js";
import { InternalServerErrorResponse, NotFoundResponse } from "../zod/response.js";

export const getMahasiswaDetailRoute = createRoute({
  operationId: "getMahasiswaDetail",
  tags: ["Detail"],
  method: "get",
  path: "/mahasiswa/{id}",
  description: "Get detailed information of a specific mahasiswa.",
  request: {
    params: MahasiswaDetailParamsSchema,
  },
  responses: {
    200: {
      description: "Berhasil mendapatkan detail mahasiswa.",
      content: {
        "application/json": {
          schema: MahasiswaDetailResponse,
        },
      },
    },
    401: AuthorizationErrorResponse,
    404: {
      description: "Mahasiswa tidak ditemukan",
      content: {
        "application/json": { schema: NotFoundResponse },
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