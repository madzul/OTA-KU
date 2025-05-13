import { createRoute } from "@hono/zod-openapi";

import { AuthorizationErrorResponse } from "../types/response.js";
import {
  connectionListQueryResponse,
  connectionListQuerySchema,
  MahasiwaConnectSchema,
  OrangTuaFailedResponse,
  OrangTuaSuccessResponse,
  OrangTuaUnverifiedResponse,
  verifyConnectionResponse,
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

export const verifyConnectionAccRoute = createRoute({
  operationId: "verifyConnectionAccept",
  tags: ["Connect"],
  method: "post",
  path: "/verify-connect-acc",
  description: "Melakukan penerimaan verifikasi connection oleh admin",
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
        "Berhasil melakukan penerimaan verifikasi connection oleh admin",
      content: {
        "application/json": {
          schema: verifyConnectionResponse,
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
  }
})

export const verifyConnectionRejectRoute = createRoute({
  operationId: "verifyConnectionReject",
  tags: ["Connect"],
  method: "post",
  path: "/verify-connect-reject",
  description: "Melakukan penolakan verifikasi connection oleh admin",
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
        "Berhasil melakukan penolakan verifikasi connection oleh admin",
      content: {
        "application/json": {
          schema: verifyConnectionResponse,
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
  }
})

export const listConnectionRoute = createRoute({
  operationId: "listConnection",
  tags: ["Connect"],
  method: "get",
  path: "/daftar-connection",
  description: "List seluruh connection yang ada beserta detailnya",
  request: {
    query: connectionListQuerySchema
  },
  responses: {
    200: {
      description: "Daftar connection berhasil diambil",
      content: {
        "application/json": {
          schema: connectionListQueryResponse,
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
})