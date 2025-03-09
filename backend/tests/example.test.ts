import { describe, expect, test } from "vitest";

import app from "../src/app.js";

describe("Example", () => {
  test("GET /health", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      success: true,
      message: "Server is running",
      body: { message: "Server is running" },
    });
  });

  test("GET /api/test", async () => {
    const res = await app.request("/api/test");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Unprotected API" });
  });
});
