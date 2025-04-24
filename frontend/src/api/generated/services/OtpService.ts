/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SendOtpRequestSchema } from '../models/SendOtpRequestSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class OtpService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Send OTP to the user's email.
   * @returns any OTP sent successfully.
   * @throws ApiError
   */
  public sendOtp({
    formData,
  }: {
    formData?: SendOtpRequestSchema,
  }): CancelablePromise<{
    success: boolean;
    message: string;
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/otp/send',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `Bad request - missing fields.`,
        401: `Invalid credentials.`,
        404: `User not found.`,
        500: `Internal server error`,
      },
    });
  }
}
