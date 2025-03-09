import { hash } from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { db } from "./drizzle.js";
import {
  accountMahasiswaDetailTable,
  accountOtaDetailTable,
  accountTable,
  connectionTable,
} from "./schema.js";

async function resetDatabase() {
  try {
    console.log("Starting database reset...");

    // 1. Clear all tables in reverse order of dependencies
    console.log("Clearing existing data...");

    // First delete connections (which depend on both mahasiswa and ota)
    await db.delete(connectionTable);

    // Then delete detail tables
    await db.delete(accountMahasiswaDetailTable);
    await db.delete(accountOtaDetailTable);

    // Finally delete accounts
    await db.delete(accountTable);

    console.log("Database cleared successfully");

    // 2. Run migrations to ensure schema is up to date
    console.log("Running migrations...");
    // Uncomment if you want to run migrations as part of reset
    // await migrate(db, { migrationsFolder: './drizzle' });

    // 3. Re-seed with initial data
    console.log("Re-seeding database with initial data...");

    // Hash passwords - adjust salt rounds as needed
    const hashedPassword = await hash("password123", 10);

    // Generate UUIDs
    const adminId = uuidv4();
    const mahasiswa1Id = uuidv4();
    const mahasiswa2Id = uuidv4();
    const ota1Id = uuidv4();
    const ota2Id = uuidv4();

    // Seed admin account
    await db.insert(accountTable).values({
      id: adminId,
      email: "admin@example.com",
      password: hashedPassword,
      type: "admin",
    });

    // Seed mahasiswa accounts
    await db.insert(accountTable).values([
      {
        id: mahasiswa1Id,
        email: "mahasiswa1@example.com",
        password: hashedPassword,
        type: "mahasiswa",
      },
      {
        id: mahasiswa2Id,
        email: "mahasiswa2@example.com",
        password: hashedPassword,
        type: "mahasiswa",
      },
    ]);

    // Seed mahasiswa details
    await db.insert(accountMahasiswaDetailTable).values([
      {
        accountId: mahasiswa1Id,
        name: "Mahasiswa One",
        phoneNumber: "08123456789",
        nim: "12345678",
        status: "verified",
        mahasiswaStatus: "active",
      },
      {
        accountId: mahasiswa2Id,
        name: "Mahasiswa Two",
        phoneNumber: "08198765432",
        nim: "87654321",
        status: "unverified",
        mahasiswaStatus: "inactive",
      },
    ]);

    // Seed OTA accounts
    await db.insert(accountTable).values([
      {
        id: ota1Id,
        email: "ota1@example.com",
        password: hashedPassword,
        type: "ota",
      },
      {
        id: ota2Id,
        email: "ota2@example.com",
        password: hashedPassword,
        type: "ota",
      },
    ]);

    // Seed OTA details
    await db.insert(accountOtaDetailTable).values([
      {
        accountId: ota1Id,
        name: "OTA Organization One",
        phoneNumber: "08111222333",
        job: "Scholarship Provider",
        address: "Jl. Example No. 1, Jakarta",
        linkage: "otm",
        funds: 50000000,
        maxCapacity: 10,
        startDate: new Date(),
        maxSemester: 8,
        transferDate: 10, // 10th day of month
        criteria: "GPA minimum 3.5, active in organizations",
        status: "verified",
      },
      {
        accountId: ota2Id,
        name: "OTA Organization Two",
        phoneNumber: "08444555666",
        job: "Education Foundation",
        address: "Jl. Example No. 2, Bandung",
        linkage: "alumni",
        funds: 75000000,
        maxCapacity: 15,
        startDate: new Date(),
        maxSemester: 6,
        transferDate: 15, // 15th day of month
        criteria: "From underprivileged family, GPA minimum 3.0",
        status: "unverified",
      },
    ]);

    // Seed connections between mahasiswa and OTA
    await db.insert(connectionTable).values({
      mahasiswaId: mahasiswa1Id,
      otaId: ota1Id,
    });

    console.log("Database reset completed successfully!");
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    // Close the database connection
    console.log("Closing database connection...");
  }
}

await resetDatabase();
