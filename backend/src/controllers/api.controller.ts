import { OpenAPIHono } from "@hono/zod-openapi";

import { authProtectedRouter, authRouter } from "./auth.controller.js";

const unprotectedApiRouter = new OpenAPIHono();
unprotectedApiRouter.route("/auth", authRouter);

const protectedApiRouter = new OpenAPIHono();
protectedApiRouter.route("/auth", authProtectedRouter);

export const apiRouter = new OpenAPIHono();
apiRouter.route("/", unprotectedApiRouter);
apiRouter.route("/", protectedApiRouter);
