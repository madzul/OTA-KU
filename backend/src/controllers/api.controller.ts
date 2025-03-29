import { OpenAPIHono } from "@hono/zod-openapi";

import { authProtectedRouter, authRouter } from "./auth.controller.js";
import { listProtectedRouter, listRouter } from "./list.controller.js";
import { profileProtectedRouter, profileRouter } from "./profile.controller.js";

const unprotectedApiRouter = new OpenAPIHono();
unprotectedApiRouter.route("/auth", authRouter);
unprotectedApiRouter.route("/profile", profileRouter);
unprotectedApiRouter.route("/list", listRouter);

const protectedApiRouter = new OpenAPIHono();
protectedApiRouter.route("/auth", authProtectedRouter);
protectedApiRouter.route("/profile", profileProtectedRouter);
protectedApiRouter.route("/list", listProtectedRouter);

export const apiRouter = new OpenAPIHono();
apiRouter.route("/", unprotectedApiRouter);
apiRouter.route("/", protectedApiRouter);
