import { createRoute } from "@hono/zod-openapi";

import { AuthorizationErrorResponse } from "../types/response.js";
import { InternalServerErrorResponse } from "../zod/response.js";
import {
  ApplicationStatusSchema,
  ApplicationStatusSuccessResponse,
} from "../zod/status.js";

export const applicationStatusRoute = createRoute({
  operationId: "applicationStatus",
  tags: ["Status"],
  method: "put",
  path: "/status/application/:id",
  description: "Mengubah status pendaftaran.",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: ApplicationStatusSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Berhasil mengubah status pendaftaran",
      content: {
        "application/json": {
          schema: ApplicationStatusSuccessResponse,
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
