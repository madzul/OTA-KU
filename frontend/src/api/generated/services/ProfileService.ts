/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ProfileService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Pendaftaran mahasiswa asuh.
   * @returns any Berhasil mendaftar.
   * @throws ApiError
   */
  public pendaftaranMahasiswa({
    formData,
  }: {
    formData?: {
      /**
       * Nama mahasiswa
       */
      name: string;
      /**
       * The user phone number.
       */
      phoneNumber: string;
      /**
       * Nomor Induk Mahasiswa
       */
      nim: string;
      /**
       * Deskripsi mahasiswa
       */
      description: string;
      /**
       * Foto mahasiswa
       */
      file: any;
    },
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      /**
       * Nama mahasiswa
       */
      name: string;
      /**
       * Nomor Induk Mahasiswa
       */
      nim: string;
      /**
       * Deskripsi mahasiswa
       */
      description: string;
      /**
       * Foto mahasiswa
       */
      file: string;
    };
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/profile/mahasiswa',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `Gagal mendaftar.`,
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Pendaftaran orang tua.
   * @returns any Berhasil mendaftar.
   * @throws ApiError
   */
  public pendaftaranOrangTua({
    formData,
  }: {
    formData?: {
      /**
       * Nama orang tua
       */
      name: string;
      /**
       * Pekerjaan orang tua
       */
      job: string;
      /**
       * Alamat orang tua
       */
      address: string;
      /**
       * Hubungan dengan mahasiswa
       */
      linkage: 'otm' | 'dosen' | 'alumni' | 'lainnya' | 'none';
      /**
       * Dana yang disediakan
       */
      funds: number;
      /**
       * Kapasitas maksimal
       */
      maxCapacity: number | null;
      /**
       * Tanggal mulai
       */
      startDate: string;
      /**
       * Semester maksimal
       */
      maxSemester: number | null;
      /**
       * Tanggal transfer
       */
      transferDate: number | null;
      criteria: string;
    },
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      /**
       * Nama orang tua
       */
      name: string;
      /**
       * Pekerjaan orang tua
       */
      job: string;
      /**
       * Alamat orang tua
       */
      address: string;
      /**
       * Hubungan dengan mahasiswa
       */
      linkage: 'otm' | 'dosen' | 'alumni' | 'lainnya' | 'none';
      /**
       * Dana yang disediakan
       */
      funds: number;
      /**
       * Kapasitas maksimal
       */
      maxCapacity: number | null;
      /**
       * Tanggal mulai
       */
      startDate: string;
      /**
       * Semester maksimal
       */
      maxSemester: number | null;
      /**
       * Tanggal transfer
       */
      transferDate: number | null;
      criteria: string;
    };
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/profile/orang-tua',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `Gagal mendaftar.`,
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
}
