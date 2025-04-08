/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ConnectService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Menghubungkan orang tua asuh dengan mahasiswa asuh.
   * @returns any Berhasil menghubungkan orang tua asuh dengan mahasiswa asuh.
   * @throws ApiError
   */
  public connectOtaMahasiswa({
    formData,
  }: {
    formData?: {
      /**
       * ID orang tua asuh
       */
      otaId: string;
      /**
       * ID mahasiswa asuh
       */
      mahasiswaId: string;
    },
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      /**
       * ID mahasiswa asuh
       */
      mahasiswaId: string;
      /**
       * ID orang tua asuh
       */
      otaId: string;
    };
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/connect/mahasiswa',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `Gagal menghubungkan orang tua asuh dengan mahasiswa asuh.`,
        401: `Bad request: authorization (not logged in) error`,
        403: `Akun belum terverifikasi.`,
        500: `Internal server error`,
      },
    });
  }
}
