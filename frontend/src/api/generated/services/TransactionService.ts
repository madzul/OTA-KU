/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransactionDetailSchema } from '../models/TransactionDetailSchema';
import type { TransactionListAdminSchema } from '../models/TransactionListAdminSchema';
import type { TransactionListOTASchema } from '../models/TransactionListOTASchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class TransactionService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}
  /**
   * Daftar tagihan seluruh mahasiswa asuh saya
   * @returns any Berhasil mendapatkan daftar tagihan seluruh mahasiswa asuh saya.
   * @throws ApiError
   */
  public listTransactionOta({
    q,
    page,
    status,
  }: {
    q?: string,
    page?: number | null,
    status?: 'unpaid' | 'pending' | 'paid',
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: TransactionListOTASchema;
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/transaction/orang-tua/transactions',
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
   * Daftar seluruh tagihan yang ada
   * @returns any Berhasil mendapatkan daftar tagihan.
   * @throws ApiError
   */
  public listTransactionAdmin({
    month,
    year,
    page,
    status,
  }: {
    month?: string,
    year?: number,
    page?: number | null,
    status?: 'unpaid' | 'pending',
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: TransactionListAdminSchema;
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/transaction/admin/transactions',
      query: {
        'month': month,
        'year': year,
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
   * Detail tagihan mahasiswa asuh saya
   * @returns any Berhasil mendapatkan detail tagihan mahasiswa asuh.
   * @throws ApiError
   */
  public detailTransaction({
    id,
    page,
  }: {
    id: string,
    page?: number | null,
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: TransactionDetailSchema;
  }> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/transaction/transaction-detail/{id}',
      path: {
        'id': id,
        'page': page,
      },
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        404: `Mahasiswa tidak ditemukan`,
        500: `Internal server error`,
      },
    });
  }
}
