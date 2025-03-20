/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserRegisRequestSchema = {
  /**
   * The user's type.
   */
  type: 'mahasiswa' | 'ota';
  /**
   * The user's email.
   */
  email: string;
  /**
   * The user's phone number.
   */
  phoneNumber: string;
  /**
   * The user's password.
   */
  password: string;
  /**
   * The user's password confirmation.
   */
  confirmPassword: string;
};

