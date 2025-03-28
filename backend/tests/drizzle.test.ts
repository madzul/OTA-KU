import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import drizzleConfig from "../drizzle.config.js";
import { db } from "../src/db/drizzle.js";
import { resetDatabase } from "../src/db/reset.js";
import {
  accountMahasiswaDetailTable,
  accountOtaDetailTable,
  accountTable,
  connectionTable,
} from "../src/db/schema.js";
import { seed } from "../src/db/seed.js";

describe("Drizzle Kit Configuration", () => {
  test("should have correct structure", () => {
    expect(drizzleConfig).toMatchObject({
      dialect: "postgresql",
      schema: expect.any(String),
      out: expect.any(String),
      dbCredentials: {
        url: expect.any(String),
        ssl: expect.any(Boolean),
      },
    });
  });
});

describe("Database Seeding", () => {
  test("should seed all data correctly", async () => {
    await seed();

    // Verify admin account
    const admin = (
      await db
        .select()
        .from(accountTable)
        .where(eq(accountTable.email, "admin@example.com"))
    )[0];
    expect(admin).toBeDefined();
    expect(admin.type).toBe("admin");

    // Verify mahasiswa accounts
    const mahasiswa = (
      await db
        .select()
        .from(accountTable)
        .where(eq(accountTable.email, "mahasiswa1@example.com"))
    )[0];
    expect(mahasiswa).toBeDefined();
    expect(mahasiswa.type).toBe("mahasiswa");

    // Verify OTA accounts
    const ota = (
      await db
        .select()
        .from(accountTable)
        .where(eq(accountTable.email, "ota1@example.com"))
    )[0];
    expect(ota).toBeDefined();
    expect(ota.type).toBe("ota");

    // Verify connections
    const connections = await db
      .select()
      .from(connectionTable)
      .where(
        and(
          eq(connectionTable.mahasiswaId, mahasiswa.id),
          eq(connectionTable.otaId, ota.id),
        ),
      );
    expect(connections).toBeDefined();
    expect(connections.length).toBe(1);
  });

  // Clean up after tests
  afterAll(async () => {
    const mahasiswa1Id = (
      await db
        .select()
        .from(accountTable)
        .where(eq(accountTable.email, "mahasiswa1@example.com"))
    )[0].id;

    await db
      .delete(connectionTable)
      .where(eq(connectionTable.mahasiswaId, mahasiswa1Id));
    await db
      .delete(accountTable)
      .where(eq(accountTable.email, "admin@example.com"));
    await db
      .delete(accountTable)
      .where(eq(accountTable.email, "mahasiswa1@example.com"));
    await db
      .delete(accountTable)
      .where(eq(accountTable.email, "mahasiswa2@example.com"));
    await db
      .delete(accountTable)
      .where(eq(accountTable.email, "ota1@example.com"));
    await db
      .delete(accountTable)
      .where(eq(accountTable.email, "ota2@example.com"));
    console.log("Test data cleaned up");
  });
});

describe("Database Reset", () => {
  let originalData: {
    accounts: any[];
    mahasiswaDetails: any[];
    otaDetails: any[];
    connections: any[];
  };

  beforeAll(async () => {
    // 1. Backup all current data before tests
    originalData = {
      accounts: await db.select().from(accountTable),
      mahasiswaDetails: await db.select().from(accountMahasiswaDetailTable),
      otaDetails: await db.select().from(accountOtaDetailTable),
      connections: await db.select().from(connectionTable),
    };
  });

  test("should completely reset and reseed the database", async () => {
    // 2. Run the reset function
    await resetDatabase();

    // 3. Verify all tables were reset properly
    const accounts = await db.select().from(accountTable);
    expect(accounts.length).toBe(5); // admin + 2 mahasiswa + 2 ota

    const mahasiswaDetails = await db
      .select()
      .from(accountMahasiswaDetailTable);
    expect(mahasiswaDetails.length).toBe(2);

    const otaDetails = await db.select().from(accountOtaDetailTable);
    expect(otaDetails.length).toBe(2);

    const connections = await db.select().from(connectionTable);
    expect(connections.length).toBe(1);
  });

  afterAll(async () => {
    // 4. Restore original data
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

    console.log("Original database state restored");
  });
});
