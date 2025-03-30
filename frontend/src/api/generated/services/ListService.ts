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
        name: string;
        nim: string;
        mahasiswaStatus: 'active' | 'inactive';
        description: string;
        file: string;
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
        name: string;
        email: string;
        phoneNumber: string;
        jurusan: string;
        provider: 'credentials' | 'azure';
        status: 'verified' | 'unverified';
        applicationStatus: 'accepted' | 'rejected' | 'pending';
        nim: string;
        mahasiswaStatus: 'active' | 'inactive';
        description: string;
        file: string;
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
        applicationStatus: 'accepted' | 'rejected' | 'pending';
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
}
