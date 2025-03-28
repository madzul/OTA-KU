export const testUsers = [
  {
    id: "da7a126a-4c35-43e3-b2fd-3531c26c88ad",
    email: "99922999@mahasiswa.itb.ac.id",
    phoneNumber: "081234567890",
    password: "testuser123",
    type: "mahasiswa" as const,
    provider: "credentials" as const,
    status: "unverified" as const,
  },
  {
    id: "cd22db2d-fe89-45e2-b6fe-76fc23bbd8d1",
    email: "user2@test.com",
    phoneNumber: "081234567891",
    password: "testuser123",
    type: "ota" as const,
    provider: "credentials" as const,
    status: "verified" as const,
  },
  {
    id: "9c4dde84-b662-4066-8048-c7beac56d22d",
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
    email: "user4@test.com",
    phoneNumber: "081234567893",
    password: "testuser123",
    confirmPassword: "testuser123",
  },
  // Invalid
  {
    type: "mahasiswa",
    email: "user5@test.com",
    phoneNumber: "081234567894",
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
