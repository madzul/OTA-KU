import { OpenAPIHono } from "@hono/zod-openapi";

import { loginRouter, regisRouter, verifRouter, logoutRouter } from "./test.controller.js";

const unprotectedApiRouter = new OpenAPIHono();
unprotectedApiRouter.route("/login", loginRouter);
unprotectedApiRouter.route("/register", regisRouter);
unprotectedApiRouter.route("/verify", verifRouter);
unprotectedApiRouter.route("/logout", logoutRouter);

const protectedApiRouter = new OpenAPIHono();

export const apiRouter = new OpenAPIHono();
apiRouter.route("/", unprotectedApiRouter);
apiRouter.route("/", protectedApiRouter);
