/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TransactionListOTASchema = {
  data: Array<{
    name: string;
    /**
     * Nomor Induk Mahasiswa
     */
    nim: string;
    bill: number;
    amount_paid: number;
    due_date: string;
    status: 'unpaid' | 'pending' | 'paid';
    receipt: string;
  }>;
  totalData: number;
};

