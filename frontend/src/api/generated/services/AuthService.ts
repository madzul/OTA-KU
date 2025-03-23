/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserLoginRequestSchema } from '../models/UserLoginRequestSchema';
import type { UserRegisRequestSchema } from '../models/UserRegisRequestSchema';
import type { UserSchema } from '../models/UserSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Authenticates a user and returns a JWT token.
   * @returns any Successful login.
   * @throws ApiError
   */
  public login({
    requestBody,
  }: {
    requestBody?: UserLoginRequestSchema,
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      /**
       * JWT token for authentication.
       */
      token: string;
    };
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/auth/login',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request - missing fields.`,
        401: `Invalid credentials.`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Registers a new user and returns a JWT token.
   * @returns any Successful registration
   * @throws ApiError
   */
  public regis({
    requestBody,
  }: {
    requestBody?: UserRegisRequestSchema,
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      /**
       * JWT token for authentication.
       */
      token: string;
      /**
       * Unique account ID
       */
      id: string;
      /**
       * The user's email.
       */
      email: string;
    };
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/auth/register',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request (e.g., missing fields).`,
        401: `Invalid credentials.`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Authenticates a user using Azure OAuth2.
   * @returns any Successful login.
   * @throws ApiError
   */
  public oauth({
    requestBody,
  }: {
    requestBody?: {
      /**
       * OAuth code for authentication.
       */
      code: string;
    },
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      /**
       * JWT token for authentication.
       */
      token: string;
    };
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/auth/oauth',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `Bad request - missing fields.`,
        401: `Invalid credentials.`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Verifies if the user is authenticated by checking the JWT.
   * @returns any Success
   * @throws ApiError
   */
  public verif(): CancelablePromise<{
    success: boolean;
    message: string;
    body: UserSchema;
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/auth/verify',
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Logs out the user by clearing the JWT cookie.
   * @returns any Successful logout.
   * @throws ApiError
   */
  public logout(): CancelablePromise<{
    success: boolean;
    message: string;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/auth/logout',
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error.`,
      },
    });
  }
}
