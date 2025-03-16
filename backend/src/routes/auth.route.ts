import { createRoute } from "@hono/zod-openapi";

import {
  BadRequestLoginResponse,
  BadRequestRegisResponse,
  InternalServerErrorResponse,
  InvalidLoginResponse,
  LogoutSuccessfulResponse,
  SuccessfulLoginResponse,
  SuccessfulRegisResponse,
  UserAuthenticatedResponse,
  UserLoginRequestSchema,
  UserNotAuthenticatedResponse,
  UserRegisRequestSchema,
} from "../zod/auth.js";

export const loginRoute = createRoute({
  operationId: "login",
  tags: ["Auth"],
  method: "post",
  path: "/login",
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
        "application/json": { schema: SuccessfulLoginResponse },
      },
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
        "application/json": { schema: InvalidLoginResponse },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": { schema: InternalServerErrorResponse },
      },
    },
  },
});

export const regisRoute = createRoute({
  operationId: "regis",
  tags: ["Auth"],
  method: "post",
  path: "/register",
  description: "Registers a new user and returns a JWT token.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: UserRegisRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Successful registration",
      content: {
        "application/json": { schema: SuccessfulRegisResponse },
      },
    },
    400: {
      description: "Bad request (e.g., missing fields).",
      content: {
        "application/json": { schema: BadRequestRegisResponse },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": { schema: InternalServerErrorResponse },
      },
    },
  },
});

export const verifRoute = createRoute({
  operationId: "verif",
  tags: ["Auth"],
  method: "get",
  path: "/verify",
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
        "application/json": { schema: UserNotAuthenticatedResponse },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": { schema: InternalServerErrorResponse },
      },
    },
  },
});

export const logoutRoute = createRoute({
  operationId: "logout",
  tags: ["Auth"],
  method: "get",
  path: "/logout",
  description: "Logs out the user by clearing the JWT cookie.",
  responses: {
    200: {
      description: "Successful logout.",
      content: {
        "application/json": { schema: LogoutSuccessfulResponse },
      },
    },
    500: {
      description: "Internal server error.",
      content: {
        "application/json": { schema: InternalServerErrorResponse },
      },
    },
  },
});
