/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TransactionListAdminSchema = {
  data: Array<{
    name_ma: string;
    /**
     * Nomor Induk Mahasiswa
     */
    nim_ma: string;
    name_ota: string;
    /**
     * Nomor telepon pengguna yang dimulai dengan 62.
     */
    number_ota: string;
    bill: number;
    amount_paid: number;
    due_date: string;
    status: 'unpaid' | 'pending' | 'paid';
    receipt: string;
  }>;
  totalData: number;
};

