import { eq } from "drizzle-orm";
import { db } from "../db/drizzle.js";
import { accountTable } from "../db/schema.js";
import {
  loginRoute,
  logoutRoute,
  regisRoute,
  verifRoute,
} from "../routes/auth.route.js";
import { createAuthRouter, createRouter } from "./router-factory.js";
import { compare, hash } from "bcrypt";


export const authRouter = createRouter();
export const authProtectedRouter = createAuthRouter();

authRouter.openapi(loginRoute, async (c) => {
  const body = await c.req.json();
  const { email, password } = body;

  if (!email || !password) {
    return c.json(
      {
        success: false,
        message: "Missing required fields",
        error: "Email and password are required",
      },
      400,
    );
  }

  try{
    const account = await db
    .select()
    .from(accountTable)
    .where(eq(accountTable.email, email))
    .limit(1);

    if (!account || account.length === 0) {
      return c.json(
        {
          success: false,
          message: "Account not found",
          error: "Invalid email",
        },
        401,
      );
    }

    const foundAccount = account[0];

    // Check the password hash
    const isPasswordValid = await compare(password, foundAccount.password);

    if (!isPasswordValid) {
      return c.json(
        {
          success: false,
          message: "Invalid credentials",
          error: "Password comparison failed",
        },
        401,
      );
    }

    return c.json(
      {
        success: true,
        message: "Login successful",
        body: {
          accountId: foundAccount.id,
          email: foundAccount.email,
          type: foundAccount.type,
          token: "eyJhbGciOiJIUzI1...",
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
  try {
    const body = await c.req.json();
    const { type, email, phoneNumber, password, confirmPassword } = body;

    if (!type || !email || !phoneNumber || !password || !confirmPassword) {
      return c.json(
        {
          success: false,
          message: "Missing required fields",
          error: {},
        },
        400
      );
    }

    if(password !== confirmPassword){
      return c.json(
        {
          success: false,
          message: "Invalid credentials",
          error: "Password confirmation failed!",
        },
        401
      )
    }

    const existingUser = await db
      .select()
      .from(accountTable)
      .where(eq(accountTable.email, email));

    if (existingUser.length > 0) {
      return c.json(
        {
          success: false,
          message: "Invalid credentials",
          error: "Email is already in use",
        }, 
        401
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await db.insert(accountTable).values({
      email,
      phoneNumber,
      password: hashedPassword,
      type,
    }).returning();

    return c.json(
      {
        success: true,
        message: "User registered successfully",
        body: {
          token: "eyJhbGciOiJIUzI1...",
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
  try {
    const userId = c.get("requestId"); // Assuming you store this from middleware/JWT verification

    const user = await db
      .select()
      .from(accountTable)
      .where(eq(accountTable.id, userId));

    if (!user.length) {
      return c.json(
        {
          success: false,
          message: "User not found",
          error: {},
        }, 
        401
      );
    }

    return c.json(
      {
        success: true,
        message: "Authenticated",
        body: {
          id: user[0].id,
          email: user[0].email,
          phoneNumber: user[0].phoneNumber,
          type: user[0].type,
        },
      }, 
      200
    );
  } catch (error) {
    console.error(error);
    return c.json({
      success: false,
      message: "Internal server error",
      error: {},
    }, 500);
  }
});

authProtectedRouter.openapi(logoutRoute, async (c) => {
  try {
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
