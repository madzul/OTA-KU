/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PasswordService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Change password.
   * @returns any Successful change password.
   * @throws ApiError
   */
  public changePassword({
    formData,
  }: {
    formData?: {
      /**
       * The user's password.
       */
      password: string;
      /**
       * The user's password.
       */
      confirmPassword: string;
    },
  }): CancelablePromise<{
    success: boolean;
    message: string;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/password/change/{id}',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `Bad request - missing fields.`,
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
}
