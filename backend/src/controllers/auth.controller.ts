import { compare, hash } from "bcrypt";
import { eq, or } from "drizzle-orm";
import { deleteCookie, setCookie } from "hono/cookie";
import { decode, sign } from "hono/jwt";

import { env } from "../config/env.config.js";
import { db } from "../db/drizzle.js";
import { accountMahasiswaDetailTable, accountTable } from "../db/schema.js";
import {
  loginRoute,
  logoutRoute,
  oauthRoute,
  regisRoute,
  verifRoute,
} from "../routes/auth.route.js";
import {
  UserLoginRequestSchema,
  UserOAuthLoginRequestSchema,
  UserRegisRequestSchema,
} from "../zod/auth.js";
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

  const { identifier, password } = zodParseResult.data;

  try {
    const account = await db
      .select()
      .from(accountTable)
      .where(
        or(
          eq(accountTable.email, identifier),
          eq(accountTable.phoneNumber, identifier),
        ),
      )
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
        provider: account[0].provider,
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
        provider: newUser[0].provider,
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

authRouter.openapi(oauthRoute, async (c) => {
  const body = await c.req.json();
  const zodParseResult = UserOAuthLoginRequestSchema.safeParse(body);
  if (!zodParseResult.success) {
    return c.json(
      {
        success: false,
        message: "Missing required fields",
        error: "Code is required",
      },
      400,
    );
  }
  const { code } = zodParseResult.data;
  const res = await fetch(
    "https://login.microsoftonline.com/db6e1183-4c65-405c-82ce-7cd53fa6e9dc/oauth2/v2.0/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        scope: "https://vault.azure.net/.default openid offline_access",
        client_id: env.AZURE_CLIENT_ID,
        client_secret: env.AZURE_CLIENT_SECRET,
        redirect_uri: `${env.VITE_PUBLIC_URL}/integrations/azure-key-vault/oauth2/callback`,
      }),
    },
  );
  if (!res.ok) {
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {},
      },
      500,
    );
  }
  const data = await res.json();
  const azureToken = data.access_token as string;
  const { payload } = decode(azureToken);
  const email = payload.upn as string;
  const name = payload.name as string;

  try {
    await db.transaction(async (tx) => {
      let accountData;

      const existingAccount = await tx
        .select()
        .from(accountTable)
        .where(eq(accountTable.email, email))
        .limit(1);

      const randomPassword = crypto
        .getRandomValues(new Uint16Array(16))
        .join("");

      if (existingAccount && existingAccount.length > 0) {
        // Account exists, update only if provider is azure
        if (existingAccount[0].provider === "azure") {
          accountData = await tx
            .update(accountTable)
            .set({
              password: await hash(randomPassword, 10),
            })
            .where(eq(accountTable.id, existingAccount[0].id))
            .returning();
          accountData = accountData[0];
        } else {
          // Provider is not azure, don't update password
          accountData = existingAccount[0];
        }
      } else {
        // Account doesn't exist, create new one
        const newAccount = await tx
          .insert(accountTable)
          .values({
            email,
            password: await hash(randomPassword, 10),
            type: "mahasiswa",
            phoneNumber: null,
            provider: "azure",
          })
          .returning();

        accountData = newAccount[0];

        // Insert the mahasiswa details for new account
        await tx.insert(accountMahasiswaDetailTable).values({
          accountId: accountData.id,
          name,
          nim: email.split("@")[0],
          status: "verified",
        });
      }

      const accessToken = await sign(
        {
          id: accountData.id,
          email: accountData.email,
          phoneNumber: accountData.phoneNumber || null,
          type: accountData.type,
          provider: accountData.provider,
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
    });

    return c.json(
      {
        success: true,
        message: "Login successful",
        body: {
          token: azureToken,
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

authProtectedRouter.openapi(verifRoute, async (c) => {
  const user = c.var.user;
  // TODO: Update user session
  return c.json(
    {
      success: true,
      message: "User is authenticated",
      body: user,
    },
    200,
  );
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
