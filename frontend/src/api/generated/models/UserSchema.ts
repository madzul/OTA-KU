/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserSchema = {
  id: string;
  email: string;
  phoneNumber: string | null;
  type: 'mahasiswa' | 'ota' | 'admin';
  provider: 'credentials' | 'azure';
  status: 'verified' | 'unverified';
};

