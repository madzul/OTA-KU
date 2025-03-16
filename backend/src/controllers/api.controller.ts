import { OpenAPIHono } from "@hono/zod-openapi";

import {
  loginRouter,
  logoutRouter,
  regisRouter,
  verifRouter,
} from "./test.controller.js";

const unprotectedApiRouter = new OpenAPIHono();
// TODO: Bikin jadi satu route aja, misal jadi unprotectedApiRouter.route("/auth", authRouter);
unprotectedApiRouter.route("/login", loginRouter);
unprotectedApiRouter.route("/register", regisRouter);
unprotectedApiRouter.route("/verify", verifRouter);
unprotectedApiRouter.route("/logout", logoutRouter);

const protectedApiRouter = new OpenAPIHono();

export const apiRouter = new OpenAPIHono();
apiRouter.route("/", unprotectedApiRouter);
apiRouter.route("/", protectedApiRouter);
