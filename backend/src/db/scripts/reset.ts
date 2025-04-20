import { hash } from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { db } from "../drizzle.js";
import {
  accountMahasiswaDetailTable,
  accountOtaDetailTable,
  accountTable,
  connectionTable,
} from "../schema.js";

export async function resetDatabase() {
  try {
    await db.transaction(async (tx) => {
      console.log("Starting database reset...");

      // 1. Clear all tables in reverse order of dependencies
      console.log("Clearing existing data...");

      // First delete connections (which depend on both mahasiswa and ota)
      await tx.delete(connectionTable);

      // Then delete detail tables
      await tx.delete(accountMahasiswaDetailTable);
      await tx.delete(accountOtaDetailTable);

      // Finally delete accounts
      await tx.delete(accountTable);

      console.log("Database cleared successfully");

      // 2. Run migrations to ensure schema is up to date
      console.log("Running migrations...");
      // Uncomment if you want to run migrations as part of reset
      // await migrate(tx, { migrationsFolder: './drizzle' });

      // 3. Re-seed with initial data
      console.log("Re-seeding database with initial data...");

      // Hash passwords - adjust salt rounds as needed
      const hashedPassword = await hash("password123", 10);

      // Generate UUIDs
      const adminId = uuidv4();
      const mahasiswa1Id = uuidv4();
      const mahasiswa2Id = uuidv4();
      const mahasiswa3Id = uuidv4();
      const mahasiswa4Id = uuidv4();
      const mahasiswa5Id = uuidv4();
      const ota1Id = uuidv4();
      const ota2Id = uuidv4();

      // Seed admin account
      await tx.insert(accountTable).values({
        id: adminId,
        email: "admin@example.com",
        phoneNumber: "08123456789",
        password: hashedPassword,
        type: "admin",
        status: "verified",
      });

      // Seed mahasiswa accounts
      await tx.insert(accountTable).values([
        {
          id: mahasiswa1Id,
          email: "mahasiswa1@example.com",
          phoneNumber: "08123456780",
          password: hashedPassword,
          type: "mahasiswa",
          status: "verified",
        },
        {
          id: mahasiswa2Id,
          email: "mahasiswa2@example.com",
          phoneNumber: "08198765432",
          password: hashedPassword,
          type: "mahasiswa",
          status: "verified",
        },
        {
          id: mahasiswa3Id,
          email: "mahasiswa3@example.com",
          phoneNumber: "08198702490",
          password: hashedPassword,
          type: "mahasiswa",
          status: "verified",
        },
        {
          id: mahasiswa4Id,
          email: "mahasiswa4@example.com",
          phoneNumber: "08198766782",
          password: hashedPassword,
          type: "mahasiswa",
        },
        {
          id: mahasiswa5Id,
          email: "mahasiswa5@example.com",
          phoneNumber: "08198987411",
          password: hashedPassword,
          type: "mahasiswa",
        },
      ]);

      // Seed mahasiswa details
      await tx.insert(accountMahasiswaDetailTable).values([
        {
          accountId: mahasiswa1Id,
          name: "Mahasiswa One",
          nim: "12345678",
          description: "Mahasiswa One is an active student.",
          file: "https://example.com/mahasiswa1.pdf",
          mahasiswaStatus: "active",
        },
        {
          accountId: mahasiswa2Id,
          name: "Mahasiswa Two",
          nim: "87654321",
          description: "Mahasiswa Two is an active student.",
          file: "https://example.com/mahasiswa2.pdf",
          mahasiswaStatus: "active",
        },
        {
          accountId: mahasiswa3Id,
          name: "Mahasiswa Three",
          nim: "13522000",
          description: "Mahasiswa Three is an active student.",
          file: "https://example.com/mahasiswa3.pdf",
          mahasiswaStatus: "active",
        },
        {
          accountId: mahasiswa4Id,
          name: "Mahasiswa Four",
          nim: "10122000",
          description: "Mahasiswa Four is an inactive student.",
          file: "https://example.com/mahasiswa4.pdf",
          mahasiswaStatus: "inactive",
        },
        {
          accountId: mahasiswa5Id,
          name: "Mahasiswa Five",
          nim: "14523999",
          description: "Mahasiswa Five is an inactive student.",
          file: "https://example.com/mahasiswa5.pdf",
          mahasiswaStatus: "inactive",
        },
      ]);

      // Seed OTA accounts
      await tx.insert(accountTable).values([
        {
          id: ota1Id,
          email: "ota1@example.com",
          phoneNumber: "08987654321",
          password: hashedPassword,
          type: "ota",
          status: "verified",
        },
        {
          id: ota2Id,
          email: "ota2@example.com",
          phoneNumber: "08912345678",
          password: hashedPassword,
          type: "ota",
        },
      ]);

      // Seed OTA details
      await tx.insert(accountOtaDetailTable).values([
        {
          accountId: ota1Id,
          name: "OTA Organization One",
          job: "Scholarship Provider",
          address: "Jl. Example No. 1, Jakarta",
          linkage: "otm",
          funds: 50000000,
          maxCapacity: 10,
          startDate: new Date(),
          maxSemester: 8,
          transferDate: 10, // 10th day of month
          criteria: "GPA minimum 3.5, active in organizations",
        },
        {
          accountId: ota2Id,
          name: "OTA Organization Two",
          job: "Education Foundation",
          address: "Jl. Example No. 2, Bandung",
          linkage: "alumni",
          funds: 75000000,
          maxCapacity: 15,
          startDate: new Date(),
          maxSemester: 6,
          transferDate: 15, // 15th day of month
          criteria: "From underprivileged family, GPA minimum 3.0",
        },
      ]);

      // Seed connections between mahasiswa and OTA
      await tx.insert(connectionTable).values([
        {
          mahasiswaId: mahasiswa1Id,
          otaId: ota1Id,
          connectionStatus: "accepted",
        },
        {
          mahasiswaId: mahasiswa2Id,
          otaId: ota1Id,
          connectionStatus: "accepted",
        },
        {
          mahasiswaId: mahasiswa3Id,
          otaId: ota1Id,
          connectionStatus: "pending",
        },
      ]);

      console.log("Database reset completed successfully!");
    });
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    // Close the database connection
    console.log("Closing database connection...");
  }
}
