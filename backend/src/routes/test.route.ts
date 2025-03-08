import { createRoute, z } from "@hono/zod-openapi";

export const testRoute = createRoute({
  operationId: "test",
  tags: ["Test"],
  method: "get",
  path: "/",
  description: "Unprotected API",
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
          example: {
            message: "Unprotected API",
          },
        },
      },
    },
  },
});
