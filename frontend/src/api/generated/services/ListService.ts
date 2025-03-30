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
      url: '/api/list/mahasiswa',
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
