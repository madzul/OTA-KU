/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ListService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * List mahasiswa asuh yang dapat dipilih orang tua asuh.
   * @returns any Berhasil mendapatkan daftar mahasiswa.
   * @throws ApiError
   */
  public listMahasiswaOta({
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
        accountId: string;
        email: string;
        type: 'mahasiswa' | 'admin' | 'ota';
        phoneNumber: string;
        provider: 'credentials' | 'azure';
        applicationStatus: 'pending' | 'accepted' | 'rejected' | 'unregistered';
        name: string;
        nim: string;
        mahasiswaStatus: 'active' | 'inactive';
        description: string;
        file: string;
        major: string;
        faculty: string;
        cityOfOrigin: string;
        highschoolAlumni: string;
        kk: string;
        ktm: string;
        waliRecommendationLetter: string;
        transcript: string;
        salaryReport: string;
        pbb: string;
        electricityBill: string;
        ditmawaRecommendationLetter: string;
        notes: string;
        adminOnlyNotes: string;
      }>;
      totalData: number;
    };
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/list/mahasiswa/verified',
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
  /**
   * List mahasiswa asuh beserta detailnya.
   * @returns any Berhasil mendapatkan daftar mahasiswa.
   * @throws ApiError
   */
  public listMahasiswaAdmin({
    q,
    page,
    jurusan,
    status,
  }: {
    q?: string,
    page?: number | null,
    jurusan?: string,
    status?: 'pending' | 'accepted' | 'rejected',
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      data: Array<{
        id: string;
        email: string;
        type: 'mahasiswa' | 'admin' | 'ota';
        phoneNumber: string;
        provider: 'credentials' | 'azure';
        applicationStatus: 'pending' | 'accepted' | 'rejected' | 'unregistered';
        name: string;
        nim: string;
        mahasiswaStatus: 'active' | 'inactive';
        description: string;
        file: string;
        major: string;
        faculty: string;
        cityOfOrigin: string;
        highschoolAlumni: string;
        kk: string;
        ktm: string;
        waliRecommendationLetter: string;
        transcript: string;
        salaryReport: string;
        pbb: string;
        electricityBill: string;
        ditmawaRecommendationLetter: string;
        notes: string;
        adminOnlyNotes: string;
      }>;
      totalPagination: number;
      totalData: number;
      totalPending: number;
      totalAccepted: number;
      totalRejected: number;
    };
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/list/mahasiswa/details',
      query: {
        'q': q,
        'page': page,
        'jurusan': jurusan,
        'status': status,
      },
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * List orang tua asuh beserta detailnya.
   * @returns any Berhasil mendapatkan daftar orang tua.
   * @throws ApiError
   */
  public listOrangTuaAdmin({
    q,
    page,
    status,
  }: {
    q?: string,
    page?: number | null,
    status?: 'pending' | 'accepted' | 'rejected',
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      data: Array<{
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
        provider: 'credentials' | 'azure';
        status: 'verified' | 'unverified';
        applicationStatus: 'accepted' | 'rejected' | 'pending' | 'unregistered';
        job: string;
        address: string;
        linkage: 'otm' | 'dosen' | 'alumni' | 'lainnya' | 'none';
        funds: number | null;
        maxCapacity: number | null;
        startDate: string;
        maxSemester: number | null;
        transferDate: number | null;
        criteria: string;
      }>;
      totalPagination: number;
      totalData: number;
      totalPending: number;
      totalAccepted: number;
      totalRejected: number;
    };
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/list/orang-tua/details',
      query: {
        'q': q,
        'page': page,
        'status': status,
      },
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * List orang tua asuh yang membantu saya
   * @returns any Berhasil mendapatkan daftar OTA-ku
   * @throws ApiError
   */
  public listOtaKu({
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
        accountId: string;
        name: string;
        /**
         * Nomor telepon pengguna yang dimulai dengan 62.
         */
        phoneNumber: string;
        nominal: number;
      }>;
      totalData: number;
    };
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/list/orang-tua',
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
  /**
   * List mahasiswa asuh saya yang aktif
   * @returns any Berhasil mendapatkan daftar MA aktif
   * @throws ApiError
   */
  public listMaActive({
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
        accountId: string;
        name: string;
        /**
         * Nomor Induk Mahasiswa
         */
        nim: string;
        /**
         * Status mahasiswa
         */
        mahasiswaStatus: 'active' | 'inactive';
      }>;
      totalData: number;
    };
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/list/orang-tua/mahasiswa-asuh-active',
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
  /**
   * List ajuan mahasiswa asuh saya yang masih pending
   * @returns any Berhasil mendapatkan daftar MA pending
   * @throws ApiError
   */
  public listMaPending({
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
        accountId: string;
        name: string;
        /**
         * Nomor Induk Mahasiswa
         */
        nim: string;
        /**
         * Status mahasiswa
         */
        mahasiswaStatus: 'active' | 'inactive';
      }>;
      totalData: number;
    };
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/list/orang-tua/mahasiswa-asuh-pending',
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
