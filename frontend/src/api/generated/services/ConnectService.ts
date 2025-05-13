/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ConnectService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Menghubungkan orang tua asuh dengan mahasiswa asuh via pilihan mandiri OTA
   * @returns any Berhasil menghubungkan orang tua asuh dengan mahasiswa asuh via pilihan mandiri OTA
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
      url: '/api/connect/by-ota',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `Gagal menghubungkan orang tua asuh dengan mahasiswa asuh via pilihan mandiri OTA`,
        401: `Bad request: authorization (not logged in) error`,
        403: `Akun belum terverifikasi.`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Menghubungkan orang tua asuh dengan mahasiswa asuh via Admin
   * @returns any Berhasil menghubungkan orang tua asuh dengan mahasiswa asuh via Admin
   * @throws ApiError
   */
  public connectOtaMahasiswaByAdmin({
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
      url: '/api/connect/by-admin',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `Gagal menghubungkan orang tua asuh dengan mahasiswa asuh via Admin`,
        401: `Bad request: authorization (not logged in) error`,
        403: `Akun belum terverifikasi.`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Melakukan penerimaan verifikasi connection oleh admin
   * @returns any Berhasil melakukan penerimaan verifikasi connection oleh admin
   * @throws ApiError
   */
  public verifyConnectionAccept({
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
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/connect/verify-connect-acc',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Melakukan penolakan verifikasi connection oleh admin
   * @returns any Berhasil melakukan penolakan verifikasi connection oleh admin
   * @throws ApiError
   */
  public verifyConnectionReject({
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
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/connect/verify-connect-reject',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * List seluruh connection yang ada beserta detailnya
   * @returns any Daftar connection berhasil diambil
   * @throws ApiError
   */
  public listConnection({
    q,
    page,
  }: {
    q?: string,
    page?: number | null,
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      data: Array<{
        /**
         * ID mahasiswa asuh
         */
        mahasiswa_id: string;
        name_ma: string;
        nim_ma: string;
        /**
         * ID orang tua asuh
         */
        ota_id: string;
        name_ota: string;
        number_ota: string;
      }>;
    };
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/connect/daftar-connection',
      query: {
        'q': q,
        'page': page,
      },
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
}
