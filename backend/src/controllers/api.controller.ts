import { OpenAPIHono } from "@hono/zod-openapi";

import { authProtectedRouter, authRouter } from "./auth.controller.js";
import { profileProtectedRouter, profileRouter } from "./profile.controller.js";

const unprotectedApiRouter = new OpenAPIHono();
unprotectedApiRouter.route("/auth", authRouter);
unprotectedApiRouter.route("/profile", profileRouter);

const protectedApiRouter = new OpenAPIHono();
protectedApiRouter.route("/auth", authProtectedRouter);
protectedApiRouter.route("/profile", profileProtectedRouter);

export const apiRouter = new OpenAPIHono();
apiRouter.route("/", unprotectedApiRouter);
apiRouter.route("/", protectedApiRouter);
