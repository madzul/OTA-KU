/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class StatusService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Mengubah status pendaftaran.
   * @returns any Berhasil mengubah status pendaftaran
   * @throws ApiError
   */
  public applicationStatus({
    id,
    formData,
  }: {
    id: string,
    formData?: {
      /**
       * Status aplikasi
       */
      status: 'accepted' | 'rejected' | 'pending';
    },
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      /**
       * Status aplikasi
       */
      status: 'accepted' | 'rejected' | 'pending';
    };
  }> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/api/status/status/application/{id}',
      path: {
        'id': id,
      },
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
}
