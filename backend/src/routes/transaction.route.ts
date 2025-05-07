import { createRoute } from "@hono/zod-openapi";

import { AuthorizationErrorResponse } from "../types/response.js";
import { InternalServerErrorResponse, NotFoundResponse } from "../zod/response.js";
import { DetailTransactionParams, TransactionDetailQueryResponse, TransactionListAdminQueryResponse, TransactionListAdminQuerySchema, TransactionListOTAQueryResponse, TransactionListOTAQuerySchema } from "../zod/transaction.js";

export const listTransactionOTARoute = createRoute({
    operationId: "listTransactionOTA",
    tags: ["Transaction"],
    method: "get",
    path: "/orang-tua/transactions",
    description: "Daftar tagihan seluruh mahasiswa asuh saya",
    request: {
        query: TransactionListOTAQuerySchema,
    },
    responses: {
        200: {
          description: "Berhasil mendapatkan daftar tagihan seluruh mahasiswa asuh saya.",
          content: {
            "application/json": {
                schema: TransactionListOTAQueryResponse,
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

export const listTransactionAdminRoute = createRoute({
    operationId: "listTransactionAdmin",
    tags: ["Transaction"],
    method: "get",
    path: "/admin/transactions",
    description: "Daftar seluruh tagihan yang ada",
    request: {
        query: TransactionListAdminQuerySchema,
    },
    responses: {
        200: {
          description: "Berhasil mendapatkan daftar tagihan.",
          content: {
          "application/json": {
              schema: TransactionListAdminQueryResponse,
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

export const detailTransactionRoute = createRoute({
    operationId: "detailTransaction",
    tags: ["Transaction"],
    method: "get",
    path: "/transaction-detail/{id}",
    description: "Detail tagihan mahasiswa asuh saya",
    request: {
        params: DetailTransactionParams,
    },
    responses: {
        200: {
          description: "Berhasil mendapatkan detail tagihan mahasiswa asuh.",
          content: {
          "application/json": {
              schema: TransactionDetailQueryResponse,
            },
          },
        },
        401: AuthorizationErrorResponse,
        404: {
          description: "Mahasiswa tidak ditemukan",
          content: {
            "application/json": { schema: NotFoundResponse }
          }
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": { schema: InternalServerErrorResponse },
          },
        }, 
    }  
})