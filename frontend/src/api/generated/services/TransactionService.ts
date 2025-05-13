/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransactionDetailSchema } from '../models/TransactionDetailSchema';
import type { TransactionListAdminSchema } from '../models/TransactionListAdminSchema';
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
    body: {
      data: Array<{
        name: string;
        /**
         * Nomor Induk Mahasiswa
         */
        nim: string;
        bill: number;
        amount_paid: number;
        paid_at: string;
        due_date: string;
        status: 'unpaid' | 'pending' | 'paid';
        receipt: string;
        /**
         * Alasan penolakan verifikasi pembayaran
         */
        rejection_note?: string;
      }>;
      totalData: number;
    };
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
    month?: 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December',
    year?: number,
    page?: number | null,
    status?: 'unpaid' | 'pending' | 'paid',
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
  /**
   * Upload bukti pembayaran dari OTA
   * @returns any Berhasil melakukan upload bukti pembayaran dari OTA.
   * @throws ApiError
   */
  public uploadReceipt({
    formData,
  }: {
    formData?: {
      /**
       * ID mahasiswa asuh
       */
      mahasiswaId: string;
      createdAt: string;
      receipt: Blob;
    },
  }): CancelablePromise<{
    success: boolean;
    message: string;
    body: {
      bukti_bayar: string;
    };
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/transaction/upload-receipt',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Melakukan penerimaan verifikasi pembayaran oleh admin
   * @returns any Berhasil melakukan penerimaan verifikasi pembayaran
   * @throws ApiError
   */
  public verifyTransactionAcc({
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
      createdAt: string;
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
      createdAt: string;
      /**
       * Nominal yang telah dibayarkan
       */
      amountPaid: number;
    };
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/transaction/verify-acc',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
  /**
   * Melakukan penolakan verifikasi pembayaran oleh admin
   * @returns any Berhasil melakukan penolakan verifikasi pembayaran
   * @throws ApiError
   */
  public verifyTransactionReject({
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
      createdAt: string;
      /**
       * Notes untuk menjelaskan alasan penolakan verifikasi transaction
       */
      rejectionNote: string;
      /**
       * Nominal yang telah dibayarkan
       */
      amountPaid: number | null;
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
      createdAt: string;
      /**
       * Notes untuk menjelaskan alasan penolakan verifikasi transaction
       */
      rejectionNote: string;
      /**
       * Nominal yang telah dibayarkan
       */
      amountPaid: number;
    };
  }> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/transaction/verify-reject',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        401: `Bad request: authorization (not logged in) error`,
        500: `Internal server error`,
      },
    });
  }
}
