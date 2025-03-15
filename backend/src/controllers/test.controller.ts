import { loginRoute, regisRoute, verifRoute, logoutRoute } from "../routes/test.route.js";
import { createRouter } from "./router-factory.js";

export const loginRouter = createRouter();
export const regisRouter = createRouter();
export const verifRouter = createRouter();
export const logoutRouter = createRouter();

loginRouter.openapi(loginRoute, async (c) => {
  const body = await c.req.json();
  const { username, password } = body;

  if (!username || !password) {
    return c.json(
      {
        success: false,
        message: "Missing required fields",
        error: "Username and password are required"
      },
      400
    );
  }

  if (username === "johndoe" && password === "secret123") {
    return c.json(
      {
        success: true,
        message: "Login successful",
        body: { token: "eyJhbGciOiJIUzI1..." }
      },
      200
    );
  } else {
    return c.json(
      {
        success: false,
        message: "Invalid credentials",
        error: "Password comparison failed"
      },
      401
    );
  }
});

regisRouter.openapi(regisRoute, async (c) => {
  try {
    const body = await c.req.json();
    const { username, email } = body;

    if (!username || !email) {
      return c.json(
        {
          success: false,
          message: "Missing required fields",
          error: {}
        },
        400
      );
    }

    return c.json(
      {
        success: true,
        message: "User registered successfully",
        body: {
          token: "eyJhbGciOiJIUzI1..."
        },
      },
      200
    );

  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {}
      },
      500
    );
  }
});

verifRouter.openapi(verifRoute, async (c) => {
  try {
    const isAuthenticated = true;

    if (!isAuthenticated) {
      return c.json(
        {
          success: false,
          message: "User is not authenticated",
          error: {}
        },
        401
      );
    }

    return c.json(
      {
        success: true,
        message: "Authenticated",
        body: {
          id: "1",
          username: "johndoe",
          email: "johndoe@example.com",
          full_name: "John Doe",
          profile_photo_path: "public/profile_pic.png"
        },
      },
      200
    );

  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {}
      },
      500
    );
  }
});

logoutRouter.openapi(logoutRoute, async (c) => {
  try {
    return c.json(
      {
        success: true,
        message: "Logout successful"
      },
      200
    );
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {}
      },
      500
    );
  }
});
