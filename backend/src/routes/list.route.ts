import { createRoute } from "@hono/zod-openapi";

import { AuthorizationErrorResponse } from "../types/response.js";
import {
  MahasiswaDetailsListQueryResponse,
  MahasiswaDetailsListQuerySchema,
  OrangTuaDetailsListQueryResponse,
  OrangTuaDetailsListQuerySchema,
  VerifiedMahasiswaListQueryResponse,
  VerifiedMahasiswaListQuerySchema,
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

export const listOrangTuaAdminRoute = createRoute({
  operationId: "listOrangTuaAdmin",
  tags: ["List"],
  method: "get",
  path: "/orang-tua/details",
  description: "List orang tua asuh beserta detailnya.",
  request: {
    query: OrangTuaDetailsListQuerySchema,
  },
  responses: {
    200: {
      description: "Berhasil mendapatkan daftar orang tua.",
      content: {
        "application/json": {
          schema: OrangTuaDetailsListQueryResponse,
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
