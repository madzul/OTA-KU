/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DetailService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Get detailed information of a specific mahasiswa.
   * @returns any Berhasil mendapatkan detail mahasiswa.
   * @throws ApiError
   */
  public getMahasiswaDetail({
    id,
  }: {
    id: string,
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      accountId: string;
      name: string;
      nim: string;
      mahasiswaStatus: 'active' | 'inactive';
      description: string | null;
      file: string | null;
    };
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/detail/mahasiswa/{id}',
      path: {
        'id': id,
      },
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        404: `Mahasiswa tidak ditemukan`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Get detailed information of a specific orang tua asuh.
   * @returns any Berhasil mendapatkan detail orang tua asuh.
   * @throws ApiError
   */
  public getOtaDetail({
    id,
  }: {
    id: string,
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      accountId: string;
      name: string;
      job: string;
      address: string;
      linkage: 'otm' | 'alumni';
      funds: number;
      maxCapacity: number;
      startDate: string;
      maxSemester: number;
      transferDate: number;
      criteria: string;
    };
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/detail/orang-tua/{id}',
      path: {
        'id': id,
      },
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        404: `Orang tua asuh tidak ditemukan`,
        500: `Internal server error`,
      },
    });
  }
}
