/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class TestService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Unprotected API
   * @returns any Success
   * @throws ApiError
   */
  public test(): CancelablePromise<{
    message: string;
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/test',
    });
  }
}
