import { and, count, eq, ilike, isNotNull, or } from "drizzle-orm";

import { db } from "../db/drizzle.js";
import { accountMahasiswaDetailTable, accountOtaDetailTable, accountRelations, accountTable } from "../db/schema.js";
import { listMAActiveRoute, listMahasiswaOtaRoute, listMAPendingRoute, listOtaKuRoute } from "../routes/list.route.js";
import { createAuthRouter, createRouter } from "./router-factory.js";

export const listRouter = createRouter();
export const listProtectedRouter = createAuthRouter();

const PAGE_SIZE = 6;

listProtectedRouter.openapi(listMahasiswaOtaRoute, async (c) => {
  const { q, page } = c.req.query();

  // Validate page to be a positive integer
  let pageNumber = Number(page);
  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  try {
    const offset = (pageNumber - 1) * PAGE_SIZE;

    const countsQuery = db
      .select({ count: count() })
      .from(accountMahasiswaDetailTable)
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
      );

    const mahasiswaListQuery = db
      .select()
      .from(accountMahasiswaDetailTable)
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
      .limit(PAGE_SIZE)
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
            name: mahasiswa.name,
            nim: mahasiswa.nim,
            mahasiswaStatus: mahasiswa.mahasiswaStatus,
            description: mahasiswa.description || "",
            file: mahasiswa.file || "",
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

listProtectedRouter.openapi(listOtaKuRoute, async(c) => {
  const { q, page } = c.req.query();

  // Validate page to be a positive integer
  let pageNumber = Number(page);
  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  try {
    const offset = (pageNumber - 1) * PAGE_SIZE;

    const countsQuery = db
      .select({ count: count() })
      .from(accountOtaDetailTable)
      .where(
        ilike(accountOtaDetailTable.name, `%${q || ""}%`)
      );

    const OTAListQuery = db
      .select({
        name: accountOtaDetailTable.name,
        phoneNumber: accountTable.phoneNumber,
        //TO-DO: Ganti jadi nominal per anak nanti di connection sekalian tambahin kondisi where connectionTable.mahasiswa_id = user.id gitu lah
        nominal: accountOtaDetailTable.funds
      })
      .from(accountOtaDetailTable)
      .innerJoin(accountTable, eq(accountTable.id, accountOtaDetailTable.accountId))
      .where(
          ilike(accountOtaDetailTable.name, `%${q || ""}%`)
      )
      .limit(PAGE_SIZE)
      .offset(offset);

    const [OTAList, counts] = await Promise.all([
      OTAListQuery,
      countsQuery,
    ]);

    return c.json(
      {
        success: true,
        message: "Daftar OTA-ku berhasil diambil",
        body: {
          data: OTAList.map((OTA) => ({
            name: OTA.name,
            phoneNumber: OTA.phoneNumber ?? "",
            nominal: OTA.nominal
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
})

//TO-DO: nanti status bukan liat dari inactive di detail MA, tapi liat status di connection
listProtectedRouter.openapi(listMAActiveRoute, async (c) => {
  const { q, page } = c.req.query();

  // Validate page to be a positive integer
  let pageNumber = Number(page);
  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  try {
    const offset = (pageNumber - 1) * PAGE_SIZE;

    const countsQuery = db
      .select({ count: count() })
      .from(accountMahasiswaDetailTable)
      .where(
        and(
          eq(accountMahasiswaDetailTable.mahasiswaStatus, "active"),
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
        name: accountMahasiswaDetailTable.name,
        nim: accountMahasiswaDetailTable.nim,
        mahasiswaStatus: accountMahasiswaDetailTable.mahasiswaStatus
      })
      .from(accountMahasiswaDetailTable)
      .where(
        and(
          eq(accountMahasiswaDetailTable.mahasiswaStatus, "active"),
          isNotNull(accountMahasiswaDetailTable.description),
          isNotNull(accountMahasiswaDetailTable.file),
          or(
            ilike(accountMahasiswaDetailTable.name, `%${q || ""}%`),
            ilike(accountMahasiswaDetailTable.nim, `%${q || ""}%`),
          ),
        ),
      )
      .limit(PAGE_SIZE)
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
            name: mahasiswa.name,
            nim: mahasiswa.nim,
            mahasiswaStatus: mahasiswa.mahasiswaStatus
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

//TO-DO: nanti status bukan liat dari inactive di detail MA, tapi liat status di connection
listProtectedRouter.openapi(listMAPendingRoute, async (c) => {
  const { q, page } = c.req.query();

  // Validate page to be a positive integer
  let pageNumber = Number(page);
  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  try {
    const offset = (pageNumber - 1) * PAGE_SIZE;

    const countsQuery = db
      .select({ count: count() })
      .from(accountMahasiswaDetailTable)
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
      );

    const mahasiswaListQuery = db
      .select({
        accountId: accountMahasiswaDetailTable.accountId,
        name: accountMahasiswaDetailTable.name,
        nim: accountMahasiswaDetailTable.nim,
        mahasiswaStatus: accountMahasiswaDetailTable.mahasiswaStatus
      })
      .from(accountMahasiswaDetailTable)
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
      .limit(PAGE_SIZE)
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
            name: mahasiswa.name,
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
