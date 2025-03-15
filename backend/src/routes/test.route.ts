import { createRoute, z } from "@hono/zod-openapi";

const UserLoginRequestSchema = z.object({
  username: z.string().min(3).openapi({
    example: "johndoe",
    description: "The user's username."
  }),
  password: z.string().min(6).openapi({
    example: "secret123",
    description: "The user's password."
  }),
});

const SuccessfulLoginResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Login successful" }),
  body: z.object({
    token: z.string().openapi({
      example: "eyJhbGciOiJIUzI1...",
      description: "JWT token for authentication."
    }),
  }),
});

const InvalidLoginResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Invalid credentials" }),
  error: z.string().openapi({ example: "Password comparison failed" })
});

const NotFoundLoginResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "User not found" }),
  error: z.string().openapi({ example: "Failed to get user" })
});

const BadRequestLoginResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Missing required fields" }),
  error: z.string().openapi({ example: "Username and password are required" })
});

const UserRegisRequestSchema = z.object({
  username: z.string().min(3).openapi({
    example: "johndoe",
    description: "created username"
  }),
  email: z.string().email()
})

const SuccessfulRegisResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Authenticated" }),
  body: z.object({
    token: z.string().openapi({
      example: "eyJhbGciOiJIUzI1...",
      description: "JWT token for authentication."
    })
  })
});

const BadRequestRegisResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Missing password" }),
  error: z.object({})
});

const InternalServerErrorResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Internal server error" }),
  error: z.object({})
});

const UserAuthenticatedResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Authenticated" }),
  body: z.object({
    id: z.string().openapi({
      example: "1"
    }),
    username: z.string().openapi({
      example: "johndoe"
    }),
    email: z.string().email().openapi({
      example: "johndoe@example.com"
    }),
    full_name: z.string().openapi({
      example: "John Doe"
    }),
    profile_photo_path: z.string().openapi({
      example: "public/profile_pic.png"
    })
  })
});

const UserNotAuthenticatedResponse = z.object({
  success: z.boolean().openapi({ example: false }),
  message: z.string().openapi({ example: "Unauthenticated" })
});

const LogoutSuccessfulResponse = z.object({
  success: z.boolean().openapi({ example: true }),
  message: z.string().openapi({ example: "Logout successful" })
});

export const loginRoute = createRoute({
  operationId: "login",
  tags: ["User"],
  method: "post",
  path: "/",
  description: "Authenticates a user and returns a JWT token.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: UserLoginRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successful login.",
      content: {
        "application/json": { schema: SuccessfulLoginResponse }
      }
    },
    400: {
      description: "Bad request - missing fields.",
      content: {
        "application/json": { schema: BadRequestLoginResponse },
      },
    },
    401: {
      description: "Invalid credentials.",
      content: {
        "application/json": { schema: InvalidLoginResponse }
      }
    },
    404: {
      description: "User not found.",
      content: {
        "application/json": { schema: NotFoundLoginResponse }
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": { schema: InternalServerErrorResponse }
      }
    }
  }
});

export const regisRoute = createRoute({
  operationId: "regis",
  tags: ["User"],
  method: "post",
  path: "/",
  description: "Registers a new user and returns a JWT token.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: UserRegisRequestSchema
        },
      }
    }
  },
  responses: {
    200: {
      description: "Successful registration",
      content: {
        "application/json": { schema: SuccessfulRegisResponse }
      }
    },
    400: {
      description: "Bad request (e.g., missing fields).",
      content: {
        "application/json": { schema:  BadRequestRegisResponse }
      }
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": { schema: InternalServerErrorResponse }
      }
    }
  },
});

export const verifRoute = createRoute({
  operationId: "verif",
  tags: ["User"],
  method: "get",
  path: "/",
  description: "Verifies if the user is authenticated by checking the JWT.",
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": { schema: UserAuthenticatedResponse },
      },
    },
    401: {
      description: "User is not authenticated.",
      content: {
        "application/json": { schema: UserNotAuthenticatedResponse }
      }
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": { schema: InternalServerErrorResponse }
      }
    }
  },
});

export const logoutRoute = createRoute({
  operationId: "logout",
  tags: ["User"],
  method: "get",
  path: "/",
  description: "Logs out the user by clearing the JWT cookie.",
  responses: {
    200: {
      description: "Successful logout.",
      content: {
        "application/json": { schema: LogoutSuccessfulResponse }
      }
    },
    500: {
      description: "Internal server error.",
      content: {
        "application/json": { schema: InternalServerErrorResponse }
      }
    }
  }
})