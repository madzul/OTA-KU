import { v4 as uuid } from "uuid";

export const testUsers = [
  {
    id: uuid(),
    email: "user1@test.com",
    phoneNumber: "081234567890",
    password: "testuser123",
    type: "mahasiswa" as const,
    provider: "credentials" as const,
    status: "unverified" as const,
  },
  {
    id: uuid(),
    email: "user2@test.com",
    phoneNumber: "081234567891",
    password: "testuser123",
    type: "ota" as const,
    provider: "credentials" as const,
    status: "verified" as const,
  },
  {
    id: uuid(),
    email: "user3@test.com",
    phoneNumber: "081234567892",
    password: "testuser123",
    type: "admin" as const,
    provider: "credentials" as const,
    status: "unverified" as const,
  },
];

export const testRegisterUsers = [
  // Valid
  {
    type: "ota",
    email: "user1@test.com",
    phoneNumber: "081234567890",
    password: "testuser123",
    confirmPassword: "testuser123",
  },
  // Invalid
  {
    type: "mahasiswa",
    email: "user2@test.com",
    phoneNumber: "081234567891",
    password: "testuser123",
    confirmPassword: "testuser123",
  },
];

// Add otp data for testUsers
export const otpDatas = [
  {
    accountId: testUsers[0].id,
    code: "123456",
    expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  },
  {
    accountId: testUsers[1].id,
    code: "654321",
    expiredAt: new Date(),
  },
  {
    accountId: testUsers[2].id,
    code: "654321",
    expiredAt: new Date(),
  },
];
