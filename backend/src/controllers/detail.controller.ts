import { eq } from "drizzle-orm";
import { db } from "../db/drizzle.js";
import { accountMahasiswaDetailTable } from "../db/schema.js";
import { getMahasiswaDetailRoute } from "../routes/detail.route.js";
import { createAuthRouter, createRouter } from "./router-factory.js";

export const detailRouter = createRouter();
export const detailProtectedRouter = createAuthRouter();

detailProtectedRouter.openapi(getMahasiswaDetailRoute, async (c) => {
  const { id } = c.req.param();
  
  try {
    const mahasiswaDetail = await db
      .select()
      .from(accountMahasiswaDetailTable)
      .where(eq(accountMahasiswaDetailTable.accountId, id))
      .limit(1);

    if (mahasiswaDetail.length === 0) {
      return c.json(
        {
          success: false,
          message: "Mahasiswa tidak ditemukan",
          error: {
            code: "NOT_FOUND",
            message: "Mahasiswa dengan ID tersebut tidak ditemukan",
          },
        },
        404,
      );
    }

    const mahasiswa = mahasiswaDetail[0];

    return c.json(
      {
        success: true,
        message: "Detail mahasiswa berhasil diambil",
        body: {
          accountId: mahasiswa.accountId,
          name: mahasiswa.name,
          nim: mahasiswa.nim,
          mahasiswaStatus: mahasiswa.mahasiswaStatus,
          description: mahasiswa.description || null,
          file: mahasiswa.file || null,
        },
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching mahasiswa detail:", error);
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