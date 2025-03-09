import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import fs from "fs";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import path from "path";
import { fileURLToPath } from "url";

import { env } from "./config/env.config.js";
import { apiRouter } from "./controllers/api.controller.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  fs.readFileSync(path.join(dirname, "../package.json"), "utf-8"),
);

const app = new OpenAPIHono();

// Middlewares
app.use(logger());
app.use(secureHeaders());
app.use("*", requestId());

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({ error: "Something went wrong!" }, 500);
});

app.use(
  "/api/*",
  cors({
    credentials: true,
    origin: env.ALLOWED_ORIGINS,
  }),
);

app.get("/", (c) => c.json({ message: "Server runs successfully" }));

app.get("/health", (c) => {
  return c.json(
    {
      success: true,
      message: "Server is running",
      body: { message: "Server is running" },
    },
    200,
  );
});

app.route("/api", apiRouter);

app.doc("/doc", {
  openapi: "3.1.0",
  info: {
    version: packageJson.version,
    title: packageJson.name,
  },
  tags: [
    {
      name: "Test",
      description: "Testing",
    },
  ],
});

app.get("/swagger", swaggerUI({ url: "/doc" }));

export default app;
