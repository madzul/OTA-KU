import { OpenAPIHono } from "@hono/zod-openapi";

import { authRouter } from "./auth.controller.js";

const unprotectedApiRouter = new OpenAPIHono();
unprotectedApiRouter.route("/auth", authRouter);

const protectedApiRouter = new OpenAPIHono();

export const apiRouter = new OpenAPIHono();
apiRouter.route("/", unprotectedApiRouter);
apiRouter.route("/", protectedApiRouter);
