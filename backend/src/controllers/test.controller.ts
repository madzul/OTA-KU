import { testRoute } from "../routes/test.route.js";
import { createRouter } from "./router-factory.js";

export const testRouter = createRouter();

testRouter.openapi(testRoute, async (c) => {
  return c.json({ message: "Unprotected API" });
});
