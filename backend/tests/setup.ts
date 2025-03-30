import { hash } from "bcrypt";
import { afterAll, beforeAll } from "vitest";

import { db } from "../src/db/drizzle.js";
import {
  accountMahasiswaDetailTable,
  accountOtaDetailTable,
  accountTable,
  connectionTable,
  otpTable,
} from "../src/db/schema.js";
import { otpDatas, testUsers } from "./constants/user.js";

let originalData: {
  accounts: any[];
  mahasiswaDetails: any[];
  otaDetails: any[];
  connections: any[];
};

beforeAll(async () => {
  console.log("Backup all data before each tests...");
  originalData = {
    accounts: await db.select().from(accountTable),
    mahasiswaDetails: await db.select().from(accountMahasiswaDetailTable),
    otaDetails: await db.select().from(accountOtaDetailTable),
    connections: await db.select().from(connectionTable),
  };

  await db.transaction(async (tx) => {
    // Clear all tables
    await tx.delete(connectionTable);
    await tx.delete(accountOtaDetailTable);
    await tx.delete(accountMahasiswaDetailTable);
    await tx.delete(accountTable);
  });

  console.log("Seeding database before each tests...");
  const hashedUsers = await Promise.all(
    testUsers.map(async (user) => ({
      ...user,
      password: await hash(user.password, 10),
    })),
  );
  await db.insert(accountTable).values(hashedUsers).onConflictDoNothing();
  await db.insert(otpTable).values(otpDatas).onConflictDoNothing();
});

afterAll(async () => {
  console.log("Cleaning up database after each tests...");
  await db.transaction(async (tx) => {
    // Clear all tables
    await tx.delete(connectionTable);
    await tx.delete(accountOtaDetailTable);
    await tx.delete(accountMahasiswaDetailTable);
    await tx.delete(accountTable);

    // Reinsert original data
    if (originalData.accounts.length > 0) {
      await tx.insert(accountTable).values(originalData.accounts);
    }
    if (originalData.mahasiswaDetails.length > 0) {
      await tx
        .insert(accountMahasiswaDetailTable)
        .values(originalData.mahasiswaDetails);
    }
    if (originalData.otaDetails.length > 0) {
      await tx.insert(accountOtaDetailTable).values(originalData.otaDetails);
    }
    if (originalData.connections.length > 0) {
      await tx.insert(connectionTable).values(originalData.connections);
    }
  });

  console.log("Database cleaned up and original data restored.");
});
