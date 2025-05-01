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
    console.log("Starting database seeding...");

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

    await db.transaction(async (tx) => {
      await tx
        .insert(accountTable)
        .values([
          {
            id: adminId,
            email: "admin@example.com",
            phoneNumber: "628123456789",
            password: hashedPassword,
            type: "admin",
            status: "verified",
            applicationStatus: "accepted",
          },
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
            applicationStatus: "accepted",
          },
          {
            id: mahasiswa4Id,
            email: "13599004@mahasiswa.itb.ac.id",
            phoneNumber: "628198766782",
            password: hashedPassword,
            type: "mahasiswa",
            status: "verified",
            applicationStatus: "pending",
          },
          {
            id: mahasiswa5Id,
            email: "13599005@mahasiswa.itb.ac.id",
            phoneNumber: "628198987411",
            password: hashedPassword,
            type: "mahasiswa",
            status: "verified",
            applicationStatus: "rejected",
          },
          {
            id: ota1Id,
            email: "ota1@example.com",
            phoneNumber: "628111222333",
            password: hashedPassword,
            type: "ota",
            status: "verified",
            applicationStatus: "accepted",
          },
          {
            id: ota2Id,
            email: "ota2@example.com",
            phoneNumber: "628444555666",
            password: hashedPassword,
            type: "ota",
            status: "verified",
            applicationStatus: "accepted",
          },
        ])
        .onConflictDoNothing();

      console.log("Account tables seeded");
    });

    await db.transaction(async (tx) => {
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
            major: "Teknik Informatika",
            faculty: "STEI-K",
            cityOfOrigin: "Jakarta",
            highschoolAlumni: "SMA Negeri 1 Jakarta",
            kk: "https://example.com/kk1.pdf",
            ktm: "https://example.com/ktm1.pdf",
            waliRecommendationLetter: "https://example.com/wali1.pdf",
            transcript: "https://example.com/transcript1.pdf",
            salaryReport: "https://example.com/salary1.pdf",
            pbb: "https://example.com/pbb1.pdf",
            electricityBill: "https://example.com/electricity1.pdf",
            ditmawaRecommendationLetter: "https://example.com/ditmawa1.pdf",
            notes: "Mahasiswa muslim with GPA 3.8",
            adminOnlyNotes: "Mahasiswa has a scholarship from the government",
          },
          {
            accountId: mahasiswa2Id,
            name: "Mahasiswa Two",
            nim: "13599002",
            description: "Mahasiswa Two is an active student.",
            file: "https://example.com/mahasiswa2.pdf",
            mahasiswaStatus: "active",
            major: "Teknik Elektro",
            faculty: "STEI-R",
            cityOfOrigin: "Bandung",
            highschoolAlumni: "SMA Negeri 2 Bandung",
            kk: "https://example.com/kk2.pdf",
            ktm: "https://example.com/ktm2.pdf",
            waliRecommendationLetter: "https://example.com/wali2.pdf",
            transcript: "https://example.com/transcript2.pdf",
            salaryReport: "https://example.com/salary2.pdf",
            pbb: "https://example.com/pbb2.pdf",
            electricityBill: "https://example.com/electricity2.pdf",
            ditmawaRecommendationLetter: "https://example.com/ditmawa2.pdf",
            notes: "Mahasiswa non-muslim with GPA 3.5",
            adminOnlyNotes: "Mahasiswa has a scholarship from the university",
          },
          {
            accountId: mahasiswa3Id,
            name: "Mahasiswa Three",
            nim: "13599003",
            description: "Mahasiswa Three is an active student.",
            file: "https://example.com/mahasiswa3.pdf",
            mahasiswaStatus: "active",
            major: "Teknik Mesin",
            faculty: "FTMD",
            cityOfOrigin: "Surabaya",
            highschoolAlumni: "SMA Negeri 3 Surabaya",
            kk: "https://example.com/kk3.pdf",
            ktm: "https://example.com/ktm3.pdf",
            waliRecommendationLetter: "https://example.com/wali3.pdf",
            transcript: "https://example.com/transcript3.pdf",
            salaryReport: "https://example.com/salary3.pdf",
            pbb: "https://example.com/pbb3.pdf",
            electricityBill: "https://example.com/electricity3.pdf",
            ditmawaRecommendationLetter: "https://example.com/ditmawa3.pdf",
            notes: "Mahasiswa muslim with GPA 3.9",
            adminOnlyNotes: "Mahasiswa has a scholarship from the government",
          },
          {
            accountId: mahasiswa4Id,
            name: "Mahasiswa Four",
            nim: "13599004",
            description: "Mahasiswa Four is an inactive student.",
            file: "https://example.com/mahasiswa4.pdf",
            mahasiswaStatus: "inactive",
            major: "Teknik Sipil",
            faculty: "FTSL",
            cityOfOrigin: "Yogyakarta",
            highschoolAlumni: "SMA Negeri 4 Yogyakarta",
            kk: "https://example.com/kk4.pdf",
            ktm: "https://example.com/ktm4.pdf",
            waliRecommendationLetter: "https://example.com/wali4.pdf",
            transcript: "https://example.com/transcript4.pdf",
            salaryReport: "https://example.com/salary4.pdf",
            pbb: "https://example.com/pbb4.pdf",
            electricityBill: "https://example.com/electricity4.pdf",
          },
          {
            accountId: mahasiswa5Id,
            name: "Mahasiswa Five",
            nim: "13599005",
            description: "Mahasiswa Five is an inactive student.",
            file: "https://example.com/mahasiswa5.pdf",
            mahasiswaStatus: "inactive",
            major: "Teknik Kimia",
            faculty: "FTI",
            cityOfOrigin: "Medan",
            highschoolAlumni: "SMA Negeri 5 Medan",
            kk: "https://example.com/kk5.pdf",
            ktm: "https://example.com/ktm5.pdf",
            waliRecommendationLetter: "https://example.com/wali5.pdf",
            transcript: "https://example.com/transcript5.pdf",
            salaryReport: "https://example.com/salary5.pdf",
            pbb: "https://example.com/pbb5.pdf",
            electricityBill: "https://example.com/electricity5.pdf",
            ditmawaRecommendationLetter: "https://example.com/ditmawa5.pdf",
            notes: "Rejected because of not a good student",
            adminOnlyNotes: "Mahasiswa had fight with other students",
          },
        ])
        .onConflictDoNothing();

      console.log("Mahasiswa details seeded");

      await tx
        .insert(accountOtaDetailTable)
        .values([
          {
            accountId: ota1Id,
            name: "OTA Organization One",
            job: "Scholarship Provider",
            address: "Jl. Example No. 1, Jakarta",
            linkage: "otm",
            funds: 500000,
            maxCapacity: 3,
            startDate: new Date(),
            maxSemester: 8,
            transferDate: 10,
            criteria: "GPA minimum 3.5, active in organizations",
          },
          {
            accountId: ota2Id,
            name: "OTA Organization Two",
            job: "Education Foundation",
            address: "Jl. Example No. 2, Bandung",
            linkage: "alumni",
            funds: 750000,
            maxCapacity: 2,
            startDate: new Date(),
            maxSemester: 6,
            transferDate: 15,
            criteria: "From underprivileged family, GPA minimum 3.0",
          },
        ])
        .onConflictDoNothing();

      console.log("OTA details seeded");

      await tx
        .insert(connectionTable)
        .values([
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
        ])
        .onConflictDoNothing();

      console.log("Connections seeded");
    });

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    console.log("Closing database connection...");
  }
}
