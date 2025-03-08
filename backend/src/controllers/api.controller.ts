import { OpenAPIHono } from "@hono/zod-openapi";

import { testRouter } from "./test.controller.js";

const unprotectedApiRouter = new OpenAPIHono();
unprotectedApiRouter.route("/test", testRouter);

const protectedApiRouter = new OpenAPIHono();

export const apiRouter = new OpenAPIHono();
apiRouter.route("/", unprotectedApiRouter);
apiRouter.route("/", protectedApiRouter);
