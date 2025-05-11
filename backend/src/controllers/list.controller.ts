import { and, count, eq, ilike, isNotNull, lt, or, sql, not } from "drizzle-orm";
import { db } from "../db/drizzle.js";
import {
  accountMahasiswaDetailTable,
  accountOtaDetailTable,
  accountTable,
  connectionTable,
} from "../db/schema.js";
import {
  listMAActiveRoute,
  listMAPendingRoute,
  listMahasiswaAdminRoute,
  listMahasiswaOtaRoute,
  listOrangTuaAdminRoute,
  listOtaKuRoute,
  listAvailableOTARoute,
} from "../routes/list.route.js";
import { createAuthRouter, createRouter } from "./router-factory.js";

export const listRouter = createRouter();
export const listProtectedRouter = createAuthRouter();

const LIST_PAGE_SIZE = 6;
const LIST_PAGE_DETAIL_SIZE = 8;

listProtectedRouter.openapi(listMahasiswaOtaRoute, async (c) => {
  const { q, page } = c.req.query();

  // Validate page to be a positive integer
  let pageNumber = Number(page);
  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  try {
    const offset = (pageNumber - 1) * LIST_PAGE_SIZE;

    const countsQuery = db
      .select({ count: count() })
      .from(accountMahasiswaDetailTable)
      .innerJoin(
        accountTable,
        eq(accountMahasiswaDetailTable.accountId, accountTable.id),
      )
      .where(
        and(
          eq(accountMahasiswaDetailTable.mahasiswaStatus, "inactive"),
          eq(accountTable.applicationStatus, "accepted"),
          isNotNull(accountMahasiswaDetailTable.description),
          isNotNull(accountMahasiswaDetailTable.file),
          or(
            ilike(accountMahasiswaDetailTable.name, `%${q || ""}%`),
            ilike(accountMahasiswaDetailTable.nim, `%${q || ""}%`),
          ),
        ),
      );

    const mahasiswaListQuery = db
      .select({
        accountId: accountMahasiswaDetailTable.accountId,
        email: accountTable.email,
        type: accountTable.type,
        phoneNumber: accountTable.phoneNumber,
        provider: accountTable.provider,
        applicationStatus: accountTable.applicationStatus,
        name: accountMahasiswaDetailTable.name,
        nim: accountMahasiswaDetailTable.nim,
        mahasiswaStatus: accountMahasiswaDetailTable.mahasiswaStatus,
        description: accountMahasiswaDetailTable.description,
        file: accountMahasiswaDetailTable.file,
        major: accountMahasiswaDetailTable.major,
        faculty: accountMahasiswaDetailTable.faculty,
        cityOfOrigin: accountMahasiswaDetailTable.cityOfOrigin,
        highschoolAlumni: accountMahasiswaDetailTable.highschoolAlumni,
        religion: accountMahasiswaDetailTable.religion,
        gender: accountMahasiswaDetailTable.gender,
        gpa: accountMahasiswaDetailTable.gpa,
        kk: accountMahasiswaDetailTable.kk,
        ktm: accountMahasiswaDetailTable.ktm,
        waliRecommendationLetter:
          accountMahasiswaDetailTable.waliRecommendationLetter,
        transcript: accountMahasiswaDetailTable.transcript,
        salaryReport: accountMahasiswaDetailTable.salaryReport,
        pbb: accountMahasiswaDetailTable.pbb,
        electricityBill: accountMahasiswaDetailTable.electricityBill,
        ditmawaRecommendationLetter:
          accountMahasiswaDetailTable.ditmawaRecommendationLetter,
        notes: accountMahasiswaDetailTable.notes,
        adminOnlyNotes: accountMahasiswaDetailTable.adminOnlyNotes,
      })
      .from(accountMahasiswaDetailTable)
      .innerJoin(
        accountTable,
        eq(accountMahasiswaDetailTable.accountId, accountTable.id),
      )
      .where(
        and(
          eq(accountMahasiswaDetailTable.mahasiswaStatus, "inactive"),
          isNotNull(accountMahasiswaDetailTable.description),
          isNotNull(accountMahasiswaDetailTable.file),
          or(
            ilike(accountMahasiswaDetailTable.name, `%${q || ""}%`),
            ilike(accountMahasiswaDetailTable.nim, `%${q || ""}%`),
          ),
        ),
      )
      .limit(LIST_PAGE_SIZE)
      .offset(offset);

    const [mahasiswaList, counts] = await Promise.all([
      mahasiswaListQuery,
      countsQuery,
    ]);

    return c.json(
      {
        success: true,
        message: "Daftar mahasiswa berhasil diambil",
        body: {
          data: mahasiswaList.map((mahasiswa) => ({
            accountId: mahasiswa.accountId,
            email: mahasiswa.email,
            type: mahasiswa.type,
            phoneNumber: mahasiswa.phoneNumber || "",
            provider: mahasiswa.provider,
            applicationStatus: mahasiswa.applicationStatus,
            name: mahasiswa.name!,
            nim: mahasiswa.nim,
            mahasiswaStatus: mahasiswa.mahasiswaStatus,
            description: mahasiswa.description || "",
            file: mahasiswa.file || "",
            major: mahasiswa.major || "",
            faculty: mahasiswa.faculty || "",
            cityOfOrigin: mahasiswa.cityOfOrigin || "",
            highschoolAlumni: mahasiswa.highschoolAlumni || "",
            religion: mahasiswa.religion!,
            gender: mahasiswa.gender!,
            gpa: mahasiswa.gpa!,
            kk: mahasiswa.kk || "",
            ktm: mahasiswa.ktm || "",
            waliRecommendationLetter: mahasiswa.waliRecommendationLetter || "",
            transcript: mahasiswa.transcript || "",
            salaryReport: mahasiswa.salaryReport || "",
            pbb: mahasiswa.pbb || "",
            electricityBill: mahasiswa.electricityBill || "",
            ditmawaRecommendationLetter:
              mahasiswa.ditmawaRecommendationLetter || "",
            notes: mahasiswa.notes || "",
            adminOnlyNotes: mahasiswa.adminOnlyNotes || "",
          })),
          totalData: counts[0].count,
        },
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching mahasiswa list:", error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {},
      },
      500,
    );
  }
});

listProtectedRouter.openapi(listMahasiswaAdminRoute, async (c) => {
  const { q, page, jurusan, status } = c.req.query();

  // Validate page to be a positive integer
  let pageNumber = Number(page);
  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  try {
    const offset = (pageNumber - 1) * LIST_PAGE_DETAIL_SIZE;

    const baseConditions = [
      eq(accountTable.type, "mahasiswa"),
      isNotNull(accountTable.phoneNumber),
    ];

    const searchCondition = q
      ? or(
          ilike(accountMahasiswaDetailTable.name, `%${q}%`),
          ilike(accountTable.email, `%${q}%`),
        )
      : undefined;

    const filterConditions = [
      status
        ? eq(
            accountTable.applicationStatus,
            status as "pending" | "accepted" | "rejected" | "unregistered",
          )
        : undefined,
    ];

    const countsQuery = db
      .select({
        total: sql<number>`sum(case when ${accountTable.applicationStatus} != 'unregistered' then 1 else 0 end)`,
        accepted: sql<number>`sum(case when ${accountTable.applicationStatus} = 'accepted' then 1 else 0 end)`,
        pending: sql<number>`sum(case when ${accountTable.applicationStatus} = 'pending' then 1 else 0 end)`,
        rejected: sql<number>`sum(case when ${accountTable.applicationStatus} = 'rejected' then 1 else 0 end)`,
      })
      .from(accountTable)
      .where(and(...baseConditions));

    const countsPaginationQuery = db
      .select({ count: count() })
      .from(accountTable)
      .leftJoin(
        accountMahasiswaDetailTable,
        eq(accountTable.id, accountMahasiswaDetailTable.accountId),
      )
      .where(and(...baseConditions, searchCondition, ...filterConditions))
      .limit(LIST_PAGE_DETAIL_SIZE)
      .offset(offset);

    const mahasiswaListQuery = db
      .select({
        id: accountTable.id,
        email: accountTable.email,
        phoneNumber: accountTable.phoneNumber,
        provider: accountTable.provider,
        status: accountTable.status,
        applicationStatus: accountTable.applicationStatus,
        type: accountTable.type,
        name: accountMahasiswaDetailTable.name,
        nim: accountMahasiswaDetailTable.nim,
        mahasiswaStatus: accountMahasiswaDetailTable.mahasiswaStatus,
        description: accountMahasiswaDetailTable.description,
        file: accountMahasiswaDetailTable.file,
        major: accountMahasiswaDetailTable.major,
        faculty: accountMahasiswaDetailTable.faculty,
        cityOfOrigin: accountMahasiswaDetailTable.cityOfOrigin,
        highschoolAlumni: accountMahasiswaDetailTable.highschoolAlumni,
        religion: accountMahasiswaDetailTable.religion,
        gender: accountMahasiswaDetailTable.gender,
        gpa: accountMahasiswaDetailTable.gpa,
        kk: accountMahasiswaDetailTable.kk,
        ktm: accountMahasiswaDetailTable.ktm,
        waliRecommendationLetter:
          accountMahasiswaDetailTable.waliRecommendationLetter,
        transcript: accountMahasiswaDetailTable.transcript,
        salaryReport: accountMahasiswaDetailTable.salaryReport,
        pbb: accountMahasiswaDetailTable.pbb,
        electricityBill: accountMahasiswaDetailTable.electricityBill,
        ditmawaRecommendationLetter:
          accountMahasiswaDetailTable.ditmawaRecommendationLetter,
        notes: accountMahasiswaDetailTable.notes,
        adminOnlyNotes: accountMahasiswaDetailTable.adminOnlyNotes,
      })
      .from(accountTable)
      .leftJoin(
        accountMahasiswaDetailTable,
        eq(accountTable.id, accountMahasiswaDetailTable.accountId),
      )
      .where(
        and(
          ...baseConditions,
          searchCondition,
          ...filterConditions,
          isNotNull(accountMahasiswaDetailTable.description),
        ),
      )
      .limit(LIST_PAGE_DETAIL_SIZE)
      .offset(offset);

    const [mahasiswaList, counts, countsPagination] = await Promise.all([
      mahasiswaListQuery,
      countsQuery,
      countsPaginationQuery,
    ]);

    return c.json(
      {
        success: true,
        message: "Daftar mahasiswa berhasil diambil",
        body: {
          data: mahasiswaList.map((mahasiswa) => ({
            id: mahasiswa.id,
            email: mahasiswa.email,
            phoneNumber: mahasiswa.phoneNumber!,
            provider: mahasiswa.provider,
            status: mahasiswa.status,
            applicationStatus: mahasiswa.applicationStatus,
            type: mahasiswa.type,
            name: mahasiswa.name!,
            nim: mahasiswa.nim!,
            mahasiswaStatus: mahasiswa.mahasiswaStatus!,
            description: mahasiswa.description!,
            file: mahasiswa.file!,
            major: mahasiswa.major || "",
            faculty: mahasiswa.faculty || "",
            cityOfOrigin: mahasiswa.cityOfOrigin || "",
            highschoolAlumni: mahasiswa.highschoolAlumni || "",
            religion: mahasiswa.religion!,
            gender: mahasiswa.gender!,
            gpa: mahasiswa.gpa!,
            kk: mahasiswa.kk || "",
            ktm: mahasiswa.ktm || "",
            waliRecommendationLetter: mahasiswa.waliRecommendationLetter || "",
            transcript: mahasiswa.transcript || "",
            salaryReport: mahasiswa.salaryReport || "",
            pbb: mahasiswa.pbb || "",
            electricityBill: mahasiswa.electricityBill || "",
            ditmawaRecommendationLetter:
              mahasiswa.ditmawaRecommendationLetter || "",
            notes: mahasiswa.notes || "",
            adminOnlyNotes: mahasiswa.adminOnlyNotes || "",
          })),
          totalPagination: countsPagination[0].count,
          totalData: Number(counts[0].total),
          totalPending: Number(counts[0].pending),
          totalAccepted: Number(counts[0].accepted),
          totalRejected: Number(counts[0].rejected),
        },
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching mahasiswa list:", error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {},
      },
      500,
    );
  }
});

listProtectedRouter.openapi(listOrangTuaAdminRoute, async (c) => {
  const { q, page, status } = c.req.query();

  // Validate page to be a positive integer
  let pageNumber = Number(page);
  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  try {
    const offset = (pageNumber - 1) * LIST_PAGE_DETAIL_SIZE;

    const baseConditions = [eq(accountTable.type, "ota")];

    const searchCondition = q
      ? or(ilike(accountOtaDetailTable.name, `%${q}%`))
      : undefined;

    const filterConditions = [
      status
        ? eq(
            accountTable.applicationStatus,
            status as "pending" | "accepted" | "rejected",
          )
        : undefined,
    ];

    const countsQuery = db
      .select({
        total: sql<number>`sum(case when ${accountTable.applicationStatus} != 'unregistered' then 1 else 0 end)`,
        accepted: sql<number>`sum(case when ${accountTable.applicationStatus} = 'accepted' then 1 else 0 end)`,
        pending: sql<number>`sum(case when ${accountTable.applicationStatus} = 'pending' then 1 else 0 end)`,
        rejected: sql<number>`sum(case when ${accountTable.applicationStatus} = 'rejected' then 1 else 0 end)`,
      })
      .from(accountTable)
      .innerJoin(
        accountOtaDetailTable,
        eq(accountTable.id, accountOtaDetailTable.accountId),
      )
      .where(and(...baseConditions));

    const countsPaginationQuery = db
      .select({ count: count() })
      .from(accountTable)
      .innerJoin(
        accountOtaDetailTable,
        eq(accountTable.id, accountOtaDetailTable.accountId),
      )
      .where(and(...baseConditions, searchCondition, ...filterConditions))
      .limit(LIST_PAGE_DETAIL_SIZE)
      .offset(offset);

    const orangTuaListQuery = db
      .select({
        id: accountTable.id,
        email: accountTable.email,
        phoneNumber: accountTable.phoneNumber,
        provider: accountTable.provider,
        status: accountTable.status,
        applicationStatus: accountTable.applicationStatus,
        name: accountOtaDetailTable.name,
        job: accountOtaDetailTable.job,
        address: accountOtaDetailTable.address,
        linkage: accountOtaDetailTable.linkage,
        funds: accountOtaDetailTable.funds,
        maxCapacity: accountOtaDetailTable.maxCapacity,
        startDate: accountOtaDetailTable.startDate,
        maxSemester: accountOtaDetailTable.maxSemester,
        transferDate: accountOtaDetailTable.transferDate,
        criteria: accountOtaDetailTable.criteria,
        allowAdminSelection: accountOtaDetailTable.allowAdminSelection,
      })
      .from(accountTable)
      .innerJoin(
        accountOtaDetailTable,
        eq(accountTable.id, accountOtaDetailTable.accountId),
      )
      .where(and(...baseConditions, searchCondition, ...filterConditions))
      .limit(LIST_PAGE_DETAIL_SIZE)
      .offset(offset);

    const [orangTuaList, counts, countsPagination] = await Promise.all([
      orangTuaListQuery,
      countsQuery,
      countsPaginationQuery,
    ]);

    return c.json(
      {
        success: true,
        message: "Daftar orang tua berhasil diambil",
        body: {
          data: orangTuaList.map((orangTua) => ({
            id: orangTua.id,
            email: orangTua.email,
            phoneNumber: orangTua.phoneNumber!,
            provider: orangTua.provider,
            status: orangTua.status,
            applicationStatus: orangTua.applicationStatus,
            name: orangTua.name,
            job: orangTua.job,
            address: orangTua.address,
            linkage: orangTua.linkage,
            funds: orangTua.funds,
            maxCapacity: orangTua.maxCapacity,
            startDate: orangTua.startDate,
            maxSemester: orangTua.maxSemester,
            transferDate: orangTua.transferDate,
            criteria: orangTua.criteria,
            allowAdminSelection: orangTua.allowAdminSelection,
          })),
          totalPagination: countsPagination[0].count,
          totalData: Number(counts[0].total),
          totalPending: Number(counts[0].pending),
          totalAccepted: Number(counts[0].accepted),
          totalRejected: Number(counts[0].rejected),
        },
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching orang tua list:", error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {},
      },
      500,
    );
  }
});

listProtectedRouter.openapi(listOtaKuRoute, async (c) => {
  const { q, page } = c.req.query();
  const maId = c.get("user").id;

  // Validate page to be a positive integer
  let pageNumber = Number(page);
  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  try {
    const offset = (pageNumber - 1) * LIST_PAGE_SIZE;

    const countsQuery = db
      .select({ count: count() })
      .from(accountOtaDetailTable)
      .innerJoin(
        connectionTable,
        eq(connectionTable.otaId, accountOtaDetailTable.accountId),
      )
      .where(
        and(
          eq(connectionTable.mahasiswaId, maId),
          eq(connectionTable.connectionStatus, "accepted"),
          ilike(accountOtaDetailTable.name, `%${q || ""}%`),
        ),
      );

    const OTAListQuery = db
      .select({
        accountId: accountOtaDetailTable.accountId,
        name: accountOtaDetailTable.name,
        phoneNumber: accountTable.phoneNumber,
        //TO-DO: Ganti jadi nominal per anak nanti di connection sekalian tambahin kondisi where connectionTable.mahasiswa_id = user.id gitu lah
        nominal: accountOtaDetailTable.funds,
      })
      .from(accountOtaDetailTable)
      .innerJoin(
        accountTable,
        eq(accountTable.id, accountOtaDetailTable.accountId),
      )
      .innerJoin(
        connectionTable,
        eq(connectionTable.otaId, accountOtaDetailTable.accountId),
      )
      .where(
        and(
          eq(connectionTable.mahasiswaId, maId),
          eq(connectionTable.connectionStatus, "accepted"),
          ilike(accountOtaDetailTable.name, `%${q || ""}%`),
        ),
      )
      .limit(LIST_PAGE_SIZE)
      .offset(offset);

    const [OTAList, counts] = await Promise.all([OTAListQuery, countsQuery]);

    return c.json(
      {
        success: true,
        message: "Daftar OTA-ku berhasil diambil",
        body: {
          data: OTAList.map((OTA) => ({
            accountId: OTA.accountId,
            name: OTA.name,
            phoneNumber: OTA.phoneNumber ?? "",
            nominal: OTA.nominal,
          })),
          totalData: counts[0].count,
        },
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching OTA-ku list:", error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {},
      },
      500,
    );
  }
});
listProtectedRouter.openapi(listMAActiveRoute, async (c) => {
  const { q, page } = c.req.query();
  const otaId = c.get("user").id;

  // Validate page to be a positive integer
  let pageNumber = Number(page);
  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  try {
    const offset = (pageNumber - 1) * LIST_PAGE_SIZE;

    const countsQuery = db
      .select({ count: count() })
      .from(connectionTable)
      .innerJoin(
        accountMahasiswaDetailTable,
        eq(connectionTable.mahasiswaId, accountMahasiswaDetailTable.accountId),
      )
      .innerJoin(
        accountTable,
        eq(accountMahasiswaDetailTable.accountId, accountTable.id),
      )
      .where(
        and(
          eq(connectionTable.otaId, otaId),
          eq(connectionTable.connectionStatus, "accepted"),
          or(
            ilike(accountMahasiswaDetailTable.name, `%${q || ""}%`),
            ilike(accountMahasiswaDetailTable.nim, `%${q || ""}%`),
          ),
        ),
      );

    const mahasiswaListQuery = db
      .select({
        accountId: accountMahasiswaDetailTable.accountId,
        name: accountMahasiswaDetailTable.name,
        nim: accountMahasiswaDetailTable.nim,
        mahasiswaStatus: accountMahasiswaDetailTable.mahasiswaStatus,
      })
      .from(connectionTable)
      .innerJoin(
        accountMahasiswaDetailTable,
        eq(connectionTable.mahasiswaId, accountMahasiswaDetailTable.accountId),
      )
      .innerJoin(
        accountTable,
        eq(accountMahasiswaDetailTable.accountId, accountTable.id),
      )
      .where(
        and(
          eq(connectionTable.otaId, otaId),
          eq(connectionTable.connectionStatus, "accepted"),
          or(
            ilike(accountMahasiswaDetailTable.name, `%${q || ""}%`),
            ilike(accountMahasiswaDetailTable.nim, `%${q || ""}%`),
          ),
        ),
      )
      .limit(LIST_PAGE_SIZE)
      .offset(offset);

    const [mahasiswaList, counts] = await Promise.all([
      mahasiswaListQuery,
      countsQuery,
    ]);

    return c.json(
      {
        success: true,
        message: "Daftar MA aktif berhasil diambil",
        body: {
          data: mahasiswaList.map((mahasiswa) => ({
            accountId: mahasiswa.accountId,
            name: mahasiswa.name!,
            nim: mahasiswa.nim,
            mahasiswaStatus: mahasiswa.mahasiswaStatus,
          })),
          totalData: counts[0].count,
        },
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching MA aktif list:", error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {},
      },
      500,
    );
  }
});

listProtectedRouter.openapi(listMAPendingRoute, async (c) => {
  const { q, page } = c.req.query();
  const otaId = c.get("user").id;

  // Validate page to be a positive integer
  let pageNumber = Number(page);
  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  try {
    const offset = (pageNumber - 1) * LIST_PAGE_SIZE;

    const countsQuery = db
      .select({ count: count() })
      .from(connectionTable)
      .innerJoin(
        accountMahasiswaDetailTable,
        eq(connectionTable.mahasiswaId, accountMahasiswaDetailTable.accountId),
      )
      .innerJoin(
        accountTable,
        eq(accountMahasiswaDetailTable.accountId, accountTable.id),
      )
      .where(
        and(
          eq(connectionTable.otaId, otaId),
          eq(connectionTable.connectionStatus, "pending"),
          eq(connectionTable.requestTerminateMahasiswa, false),
          eq(connectionTable.requestTerminateOta, false),
          or(
            ilike(accountMahasiswaDetailTable.name, `%${q || ""}%`),
            ilike(accountMahasiswaDetailTable.nim, `%${q || ""}%`),
          ),
        ),
      );

    const mahasiswaListQuery = db
      .select({
        accountId: accountMahasiswaDetailTable.accountId,
        name: accountMahasiswaDetailTable.name,
        nim: accountMahasiswaDetailTable.nim,
        mahasiswaStatus: accountMahasiswaDetailTable.mahasiswaStatus,
      })
      .from(connectionTable)
      .innerJoin(
        accountMahasiswaDetailTable,
        eq(connectionTable.mahasiswaId, accountMahasiswaDetailTable.accountId),
      )
      .innerJoin(
        accountTable,
        eq(accountMahasiswaDetailTable.accountId, accountTable.id),
      )
      .where(
        and(
          eq(connectionTable.otaId, otaId),
          eq(connectionTable.connectionStatus, "pending"),
          eq(connectionTable.requestTerminateMahasiswa, false),
          eq(connectionTable.requestTerminateOta, false),
          or(
            ilike(accountMahasiswaDetailTable.name, `%${q || ""}%`),
            ilike(accountMahasiswaDetailTable.nim, `%${q || ""}%`),
          ),
        ),
      )
      .limit(LIST_PAGE_SIZE)
      .offset(offset);

    const [mahasiswaList, counts] = await Promise.all([
      mahasiswaListQuery,
      countsQuery,
    ]);

    return c.json(
      {
        success: true,
        message: "Daftar MA pending berhasil diambil",
        body: {
          data: mahasiswaList.map((mahasiswa) => ({
            accountId: mahasiswa.accountId,
            name: mahasiswa.name!,
            nim: mahasiswa.nim,
            mahasiswaStatus: mahasiswa.mahasiswaStatus,
          })),
          totalData: counts[0].count,
        },
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching MA pending list:", error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {},
      },
      500,
    );
  }
});

listProtectedRouter.openapi(listAvailableOTARoute, async (c) => {
  const { q, page } = c.req.query();

  // Validate page to be a positive integer
  let pageNumber = Number(page);
  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  try {
    const offset = (pageNumber - 1) * LIST_PAGE_SIZE;

    const countsQuery = db
      .select({ count: count() })
      .from(accountOtaDetailTable)
      .innerJoin(
        accountTable,
        eq(accountTable.id, accountOtaDetailTable.accountId),
      )
      .where(
        and(
          eq(accountOtaDetailTable.allowAdminSelection, true),
          eq(accountTable.applicationStatus, "accepted"),
          ilike(accountOtaDetailTable.name, `%${q || ""}%`),
        ),
      );

    const otaListQuery = db
      .select({
        id: accountOtaDetailTable.accountId,
        name: accountOtaDetailTable.name,
        phoneNumber: accountTable.phoneNumber,
        funds: accountOtaDetailTable.funds,
        maxCapacity: accountOtaDetailTable.maxCapacity,
        currentCount: sql<number>`COUNT(${connectionTable.mahasiswaId})`,
        criteria: accountOtaDetailTable.criteria,
      })
      .from(accountOtaDetailTable)
      .innerJoin(
        accountTable,
        eq(accountTable.id, accountOtaDetailTable.accountId),
      )
      .leftJoin(
        connectionTable,
        and(
          eq(connectionTable.otaId, accountOtaDetailTable.accountId),
          eq(connectionTable.connectionStatus, "accepted"),
        ),
      )
      .where(
        and(
          eq(accountOtaDetailTable.allowAdminSelection, true),
          eq(accountTable.applicationStatus, "accepted"),
          ilike(accountOtaDetailTable.name, `%${q || ""}%`),
        ),
      )
      .groupBy(
        accountOtaDetailTable.accountId,
        accountOtaDetailTable.name,
        accountTable.phoneNumber,
        accountOtaDetailTable.funds,
        accountOtaDetailTable.maxCapacity,
        accountOtaDetailTable.criteria,
      )
      .having(
        lt(
          sql<number>`COUNT(${connectionTable.mahasiswaId})`,
          accountOtaDetailTable.maxCapacity,
        ),
      )
      .limit(LIST_PAGE_SIZE)
      .offset(offset);

    const [otaList, counts] = await Promise.all([otaListQuery, countsQuery]);
  
      return c.json(
        {
          success: true,
          message: "Daftar OTA yang tersedia berhasil diambil",
          body: {
            data: otaList.map((ota) => ({
              accountId: ota.id,
              name: ota.name,
              phoneNumber: ota.phoneNumber ?? "",
              nominal: ota.funds,
            })),
            totalData: counts[0].count,
          },
        },
        200,
      );
  } catch (error) {
    console.error("Error fetching available OTA list:", error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: {},
      },
      500,
    );
  }
});
