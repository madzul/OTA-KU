import { createRoute } from "@hono/zod-openapi";
import { AuthorizationErrorResponse } from "../types/response.js";
import { InternalServerErrorResponse } from "../zod/response.js";
import { MahasiswaUnverifiedResponse } from "../zod/profile.js";
import { AdminUnverifiedResponse, requestTerminateMAFailedResponse, requestTerminateMASuccessResponse, requestTerminateOTAFailedResponse, requestTerminateOTASuccessResponse, TerminateRequestSchema, validateTerminateFailedResponse, validateTerminateSuccessResponse } from "../zod/terminate.js";
import { OrangTuaUnverifiedResponse } from "../zod/connect.js";

export const requestTerminateFromMARoute = createRoute({
    operationId: "requestTerminateFromMA",
    tags: ["Terminate"],
    method: "post",
    path: "/ma",
    description: "Mengirimkan request terminate hubungan asuh dari akun MA",
    request: {
        body:{
            content:{
                "multipart/form-data": { schema: TerminateRequestSchema }
            }
        }
    },
    responses:{
        200: {
            description: "Berhasil mengirimkan request terminate hubungan asuh dari akun MA",
            content: {
              "application/json": { schema: requestTerminateMASuccessResponse },
            },
        },
        400: {
            description: "Gagal mengirimkan request terminate hubungan asuh dari akun MA",
            content: {
            "application/json": { schema: requestTerminateMAFailedResponse },
          },
        },
        401: AuthorizationErrorResponse,
        403: {
            description: "Akun MA belum terverifikasi.",
            content: {
            "application/json": { schema: MahasiswaUnverifiedResponse },
            },
        },
        500: {
            description: "Internal server error",
            content: {
            "application/json": { schema: InternalServerErrorResponse },
            },
        },
    }
})

export const requestTerminateFromOTARoute = createRoute({
    operationId: "requestTerminateFromOTA",
    tags: ["Terminate"],
    method: "post",
    path: "/ota",
    description: "Mengirimkan request terminate hubungan asuh dari akun OTA",
    request: {
        body:{
            content:{
                "multipart/form-data": { schema: TerminateRequestSchema }
            }
        }
    },
    responses:{
        200: {
            description: "Berhasil mengirimkan request terminate hubungan asuh dari akun OTA",
            content: {
              "application/json": { schema: requestTerminateOTASuccessResponse },
            },
        },
        400: {
            description: "Gagal mengirimkan request terminate hubungan asuh dari akun OTA",
            content: {
            "application/json": { schema: requestTerminateOTAFailedResponse },
          },
        },
        401: AuthorizationErrorResponse,
        403: {
            description: "Akun OTA belum terverifikasi.",
            content: {
            "application/json": { schema: OrangTuaUnverifiedResponse },
            },
        },
        500: {
            description: "Internal server error",
            content: {
            "application/json": { schema: InternalServerErrorResponse },
            },
        },
    }
})

export const validateTerminateRoute = createRoute({
    operationId: "validateTerminate",
    tags: ["Terminate"],
    method: "post",
    path: "/validate",
    description: "Melakukan validasi terminate hubungan asuh",
    request: {
        body:{
            content:{
                "multipart/form-data": { schema: TerminateRequestSchema }
            }
        }
    },
    responses:{
        200: {
            description: "Berhasil memvalidasi terminasi hubungan",
            content:{
                "application/json": {schema: validateTerminateSuccessResponse }
            }
        },
        400: {
            description: "Gagal memvalidasi terminasi hubungan",
            content: {
            "application/json": { schema: validateTerminateFailedResponse },
          },
        },
        401: AuthorizationErrorResponse,
        403: {
            description: "Akun admin belum terverifikasi.",
            content: {
            "application/json": { schema: AdminUnverifiedResponse },
            },
        },
        500: {
            description: "Internal server error",
            content: {
            "application/json": { schema: InternalServerErrorResponse },
            },
        },
    }
})