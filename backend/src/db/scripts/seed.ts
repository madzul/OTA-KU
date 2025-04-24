import { hash } from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { db } from "../drizzle.js";
import {
  accountMahasiswaDetailTable,
  accountOtaDetailTable,
  accountTable,
  connectionTable,
} from "../schema.js";

export async function seed() {
  try {
    await db.transaction(async (tx) => {
      console.log("Starting database seeding...");

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
      await tx
        .insert(accountTable)
        .values({
          id: adminId,
          email: "admin@example.com",
          phoneNumber: "628123456789",
          password: hashedPassword,
          type: "admin",
          status: "verified",
        })
        .onConflictDoNothing();

      console.log("Admin account seeded");

      // Seed mahasiswa accounts
      await tx
        .insert(accountTable)
        .values([
          {
            id: mahasiswa1Id,
            email: "13599001@mahasiswa.itb.ac.id",
            phoneNumber: "628123456780",
            password: hashedPassword,
            type: "mahasiswa",
            status: "verified",
            applicationStatus: "accepted",
          },
          {
            id: mahasiswa2Id,
            email: "13599002@mahasiswa.itb.ac.id",
            phoneNumber: "628198765432",
            password: hashedPassword,
            type: "mahasiswa",
            status: "verified",
            applicationStatus: "accepted",
          },
          {
            id: mahasiswa3Id,
            email: "13599003@mahasiswa.itb.ac.id",
            phoneNumber: "628198702490",
            password: hashedPassword,
            type: "mahasiswa",
            status: "verified",
            applicationStatus: "pending",
          },
          {
            id: mahasiswa4Id,
            email: "13599004@mahasiswa.itb.ac.id",
            phoneNumber: "628198766782",
            password: hashedPassword,
            type: "mahasiswa",
            applicationStatus: "pending",
          },
          {
            id: mahasiswa5Id,
            email: "13599005@mahasiswa.itb.ac.id",
            phoneNumber: "628198987411",
            password: hashedPassword,
            type: "mahasiswa",
            applicationStatus: "rejected",
          },
        ])
        .onConflictDoNothing();

      console.log("Mahasiswa accounts seeded");

      // Seed mahasiswa details
      await tx
        .insert(accountMahasiswaDetailTable)
        .values([
          {
            accountId: mahasiswa1Id,
            name: "Mahasiswa One",
            nim: "13599001",
            description: "Mahasiswa One is an active student.",
            file: "https://example.com/mahasiswa1.pdf",
            mahasiswaStatus: "active",
          },
          {
            accountId: mahasiswa2Id,
            name: "Mahasiswa Two",
            nim: "13599002",
            description: "Mahasiswa Two is an active student.",
            file: "https://example.com/mahasiswa2.pdf",
            mahasiswaStatus: "active",
          },
          {
            accountId: mahasiswa3Id,
            name: "Mahasiswa Three",
            nim: "13599003",
            description: "Mahasiswa Three is an active student.",
            file: "https://example.com/mahasiswa3.pdf",
            mahasiswaStatus: "active",
          },
          {
            accountId: mahasiswa4Id,
            name: "Mahasiswa Four",
            nim: "13599004",
            description: "Mahasiswa Four is an inactive student.",
            file: "https://example.com/mahasiswa4.pdf",
            mahasiswaStatus: "inactive",
          },
          {
            accountId: mahasiswa5Id,
            name: "Mahasiswa Five",
            nim: "13599005",
            description: "Mahasiswa Five is an inactive student.",
            file: "https://example.com/mahasiswa5.pdf",
            mahasiswaStatus: "inactive",
          },
        ])
        .onConflictDoNothing();

      console.log("Mahasiswa details seeded");

      // Seed OTA accounts
      await tx
        .insert(accountTable)
        .values([
          {
            id: ota1Id,
            email: "ota1@example.com",
            phoneNumber: "628111222333",
            password: hashedPassword,
            type: "ota",
            status: "verified",
          },
          {
            id: ota2Id,
            email: "ota2@example.com",
            phoneNumber: "628444555666",
            password: hashedPassword,
            type: "ota",
          },
        ])
        .onConflictDoNothing();

      console.log("OTA accounts seeded");

      // Seed OTA details
      await tx
        .insert(accountOtaDetailTable)
        .values([
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
        ])
        .onConflictDoNothing();

      console.log("OTA details seeded");

      // Seed connections between mahasiswa and OTA
      await tx
        .insert(connectionTable)
        .values([
          {
            mahasiswaId: mahasiswa1Id,
            otaId: ota1Id,
            connectionStatus: "accepted"
          },
          {
            mahasiswaId: mahasiswa2Id,
            otaId: ota1Id,
            connectionStatus: "accepted"
          },
          {
            mahasiswaId: mahasiswa3Id,
            otaId: ota1Id,
            connectionStatus: "pending"
          },
        ])
        .onConflictDoNothing();

      console.log("Connections seeded");

      console.log("Database seeding completed successfully!");
    });
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the database connection
    console.log("Closing database connection...");
  }
}
