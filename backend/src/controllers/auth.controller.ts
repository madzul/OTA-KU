import { compare, hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";

import { env } from "../config/env.config.js";
import { db } from "../db/drizzle.js";
import { accountTable } from "../db/schema.js";
import {
  loginRoute,
  logoutRoute,
  regisRoute,
  verifRoute,
} from "../routes/auth.route.js";
import { UserLoginRequestSchema, UserRegisRequestSchema } from "../zod/auth.js";
import { createAuthRouter, createRouter } from "./router-factory.js";

export const authRouter = createRouter();
export const authProtectedRouter = createAuthRouter();

authRouter.openapi(loginRoute, async (c) => {
  const body = await c.req.json();

  const zodParseResult = UserLoginRequestSchema.safeParse(body);
  if (!zodParseResult.success) {
    return c.json(
      {
        success: false,
        message: "Missing required fields",
        error: "Email and password are required",
      },
      400,
    );
  }

  const { email, password } = zodParseResult.data;

  try {
    const account = await db
      .select()
      .from(accountTable)
      .where(eq(accountTable.email, email))
      .limit(1);

    if (!account || account.length === 0) {
      console.error("Invalid email");
      return c.json(
        {
          success: false,
          message: "Invalid credentials",
          error: "Invalid email or password",
        },
        401,
      );
    }

    const foundAccount = account[0];

    // Check the password hash
    const isPasswordValid = await compare(password, foundAccount.password);

    if (!isPasswordValid) {
      console.error("Invalid password");
      return c.json(
        {
          success: false,
          message: "Invalid credentials",
          error: "Invalid email or password",
        },
        401,
      );
    }

    const accessToken = await sign(
      {
        id: account[0].id,
        email: account[0].email,
        phoneNumber: account[0].phoneNumber,
        type: account[0].type,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      },
      env.JWT_SECRET,
    );

    setCookie(c, "ota-ku.access-cookie", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return c.json(
      {
        success: true,
        message: "Login successful",
        body: {
          token: accessToken,
        },
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {},
      },
      500,
    );
  }
});

authRouter.openapi(regisRoute, async (c) => {
  const body = await c.req.json();

  const zodParseResult = UserRegisRequestSchema.safeParse(body);
  if (!zodParseResult.success) {
    return c.json(
      {
        success: false,
        message: "Missing required fields",
        error: "Email, phone number, password, and type are required",
      },
      400,
    );
  }

  const { email, phoneNumber, password, confirmPassword, type } =
    zodParseResult.data;

  if (password !== confirmPassword) {
    return c.json(
      {
        success: false,
        message: "Invalid credentials",
        error: "Password confirmation failed!",
      },
      401,
    );
  }

  const hashedPassword = await hash(password, 10);

  try {
    const newUser = await db
      .insert(accountTable)
      .values({
        email,
        phoneNumber,
        password: hashedPassword,
        type,
      })
      .returning();

    const accessToken = await sign(
      {
        id: newUser[0].id,
        email: newUser[0].email,
        phoneNumber: newUser[0].phoneNumber,
        type: newUser[0].type,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      },
      env.JWT_SECRET,
    );

    setCookie(c, "ota-ku.access-cookie", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return c.json(
      {
        success: true,
        message: "User registered successfully",
        body: {
          token: accessToken,
          id: newUser[0].id,
          email: newUser[0].email,
        },
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {},
      },
      500,
    );
  }
});

authRouter.openapi(verifRoute, async (c) => {
  const token = getCookie(c, "ota-ku.access-cookie") as string;
  if (!token) {
    return c.json(
      {
        success: false,
        message: "User is not authenticated",
        error: {},
      },
      401,
    );
  }

  const isVerified = await verify(token, env.JWT_SECRET);
  if (!isVerified) {
    return c.json(
      {
        success: false,
        message: "User is not authenticated",
        error: {},
      },
      401,
    );
  }

  try {
    const user = await db
      .select()
      .from(accountTable)
      .where(eq(accountTable.id, (isVerified as { id: string }).id));

    const { password, ...privateUser } = user[0];

    return c.json(
      {
        success: true,
        message: "Authenticated",
        body: privateUser,
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {},
      },
      500,
    );
  }
});

authProtectedRouter.openapi(logoutRoute, async (c) => {
  try {
    deleteCookie(c, "ota-ku.access-cookie");
    return c.json(
      {
        success: true,
        message: "Logout successful",
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {},
      },
      500,
    );
  }
});
