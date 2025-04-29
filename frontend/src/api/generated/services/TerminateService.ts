/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class TerminateService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Mengirimkan request terminate hubungan asuh dari akun MA
   * @returns any Berhasil mengirimkan request terminate hubungan asuh dari akun MA
   * @throws ApiError
   */
  public requestTerminateFromMa({
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
      url: '/api/terminate/ma',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `Gagal mengirimkan request terminate hubungan asuh dari akun MA`,
        401: `Bad request: authorization (not logged in) error`,
        403: `Akun MA belum terverifikasi.`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Mengirimkan request terminate hubungan asuh dari akun OTA
   * @returns any Berhasil mengirimkan request terminate hubungan asuh dari akun OTA
   * @throws ApiError
   */
  public requestTerminateFromOta({
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
      url: '/api/terminate/ota',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `Gagal mengirimkan request terminate hubungan asuh dari akun OTA`,
        401: `Bad request: authorization (not logged in) error`,
        403: `Akun OTA belum terverifikasi.`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Melakukan validasi terminate hubungan asuh
   * @returns any Berhasil memvalidasi terminasi hubungan
   * @throws ApiError
   */
  public validateTerminate({
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
      url: '/api/terminate/validate',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `Gagal memvalidasi terminasi hubungan`,
        401: `Bad request: authorization (not logged in) error`,
        403: `Akun admin belum terverifikasi.`,
        500: `Internal server error`,
      },
    });
  }
}
