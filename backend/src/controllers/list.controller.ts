import { and, count, eq, ilike, isNotNull, or } from "drizzle-orm";

import { db } from "../db/drizzle.js";
import { accountMahasiswaDetailTable } from "../db/schema.js";
import { listMahasiswaOtaRoute } from "../routes/list.route.js";
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
