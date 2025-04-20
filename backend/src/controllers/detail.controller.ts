import { eq } from "drizzle-orm";
import { db } from "../db/drizzle.js";
import { accountMahasiswaDetailTable, accountOtaDetailTable } from "../db/schema.js";
import { getMahasiswaDetailRoute, getOtaDetailRoute } from "../routes/detail.route.js";
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
          name: mahasiswa.name!,
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

detailProtectedRouter.openapi(getOtaDetailRoute, async (c) => {
  const { id } = c.req.param();
  
  try {
    const otaDetail = await db
      .select()
      .from(accountOtaDetailTable)
      .where(eq(accountOtaDetailTable.accountId, id))
      .limit(1);

    if (otaDetail.length === 0) {
      return c.json(
        {
          success: false,
          message: "Orang tua asuh tidak ditemukan",
          error: {
            code: "NOT_FOUND",
            message: "Orang tua asuh dengan ID tersebut tidak ditemukan",
          },
        },
        404,
      );
    }

    const ota = otaDetail[0];
    
    // Make sure linkage is compatible with expected type
    const sanitizedLinkage = (ota.linkage === "otm" || ota.linkage === "alumni") ? ota.linkage : "alumni";

    return c.json(
      {
        success: true,
        message: "Detail orang tua asuh berhasil diambil",
        body: {
          accountId: ota.accountId,
          name: ota.name,
          job: ota.job,
          address: ota.address,
          linkage: sanitizedLinkage,
          funds: ota.funds,
          maxCapacity: ota.maxCapacity,
          startDate: ota.startDate.toISOString(),
          maxSemester: ota.maxSemester,
          transferDate: ota.transferDate,
          criteria: ota.criteria,
        },
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching orang tua asuh detail:", error);
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