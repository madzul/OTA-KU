import { createRoute } from "@hono/zod-openapi";

import { AuthorizationErrorResponse } from "../types/response.js";
import {
  MahasiswaListQueryResponse,
  MahasiswaListQuerySchema,
  MAListQueryResponse,
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

export const listMAActiveRoute = createRoute({
  operationId: "listMAActive",
  tags: ["List"],
  method: "get",
  path: "/orang-tua/mahasiswa-asuh-active",
  description: "List mahasiswa asuh saya yang aktif",
  request: {
    query: MahasiswaListQuerySchema,
  },
  responses: {
    200: {
      description: "Berhasil mendapatkan daftar MA aktif",
      content: {
        "application/json": {
          schema: MAListQueryResponse
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

export const listMAPendingRoute = createRoute({
  operationId: "listMAPending",
  tags: ["List"],
  method: "get",
  path: "/orang-tua/mahasiswa-asuh-pending",
  description: "List ajuan mahasiswa asuh saya yang masih pending",
  request: {
    query: MahasiswaListQuerySchema,
  },
  responses: {
    200: {
      description: "Berhasil mendapatkan daftar MA pending",
      content: {
        "application/json": {
          schema: MAListQueryResponse
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
