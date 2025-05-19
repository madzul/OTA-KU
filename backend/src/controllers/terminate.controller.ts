import { and, count, eq, ilike, or } from "drizzle-orm";

import { db } from "../db/drizzle.js";
import {
  accountMahasiswaDetailTable,
  accountOtaDetailTable,
  accountTable,
  connectionTable,
} from "../db/schema.js";
import {
  listTerminateForAdminRoute,
  listTerminateForOTARoute,
  rejectTerminateRoute,
  requestTerminateFromMARoute,
  requestTerminateFromOTARoute,
  terminationStatusMARoute,
  validateTerminateRoute,
} from "../routes/terminate.route.js";
import {
  TerminateRequestSchema,
  listTerminateQuerySchema,
  verifTerminateRequestSchema,
} from "../zod/terminate.js";
import { createAuthRouter } from "./router-factory.js";

export const terminateProtectedRouter = createAuthRouter();

const LIST_PAGE_SIZE = 6;

terminateProtectedRouter.openapi(listTerminateForAdminRoute, async (c) => {
  const user = c.var.user;
  const zodParseResult = listTerminateQuerySchema.parse(c.req.query());
  const { q, page } = zodParseResult;

  const userAccount = await db
    .select()
    .from(accountTable)
    .where(eq(accountTable.id, user.id))
    .limit(1);

  if (userAccount[0].status === "unverified") {
    return c.json(
      {
        success: false,
        message: "Akun anda belum diverifikasi.",
        error: {},
      },
      403,
    );
  }

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
        accountOtaDetailTable,
        eq(connectionTable.otaId, accountOtaDetailTable.accountId),
      )
      .where(
        and(
          or(
            eq(connectionTable.requestTerminateMahasiswa, true),
            eq(connectionTable.requestTerminateOta, true),
          ),
          eq(connectionTable.connectionStatus, "pending"),
          or(
            ilike(accountMahasiswaDetailTable.name, `%${q || ""}%`),
            ilike(accountMahasiswaDetailTable.nim, `%${q || ""}%`),
            ilike(accountOtaDetailTable.name, `%${q || ""}%`),
          ),
        ),
      );

    const terminateListQuery = db
      .select({
        otaId: connectionTable.otaId,
        otaName: accountOtaDetailTable.name,
        otaNumber: accountTable.phoneNumber,
        mahasiswaId: connectionTable.mahasiswaId,
        maName: accountMahasiswaDetailTable.name,
        maNIM: accountMahasiswaDetailTable.nim,
        createdAt: connectionTable.createdAt,
        requestTerminateOTA: connectionTable.requestTerminateOta,
        requestTerminateMA: connectionTable.requestTerminateMahasiswa,
        requestTerminationNoteOTA: connectionTable.requestTerminationNoteOTA,
        requestTerminationNoteMA: connectionTable.requestTerminationNoteMA,
      })
      .from(connectionTable)
      .innerJoin(
        accountMahasiswaDetailTable,
        eq(connectionTable.mahasiswaId, accountMahasiswaDetailTable.accountId),
      )
      .innerJoin(
        accountOtaDetailTable,
        eq(connectionTable.otaId, accountOtaDetailTable.accountId),
      )
      .innerJoin(accountTable, eq(connectionTable.otaId, accountTable.id))
      .where(
        and(
          or(
            eq(connectionTable.requestTerminateMahasiswa, true),
            eq(connectionTable.requestTerminateOta, true),
          ),
            // eq(connectionTable.connectionStatus, "pending"),
          or(
            ilike(accountMahasiswaDetailTable.name, `%${q || ""}%`),
            ilike(accountMahasiswaDetailTable.nim, `%${q || ""}%`),
            ilike(accountOtaDetailTable.name, `%${q || ""}%`),
          ),
        ),
      )
      .limit(LIST_PAGE_SIZE)
      .offset(offset);

    const [terminateList, counts] = await Promise.all([
      terminateListQuery,
      countsQuery,
    ]);

    console.log(terminateList);

    return c.json(
      {
        success: true,
        message: "Berhasil mendapatkan daftar request terminate untuk Admin",
        body: {
          data: terminateList.map((terminate) => ({
            otaId: terminate.otaId,
            otaName: terminate.otaName,
            otaNumber: terminate.otaNumber ?? "",
            mahasiswaId: terminate.mahasiswaId,
            maName: terminate.maName ?? "",
            maNIM: terminate.maNIM,
            createdAt: terminate.createdAt,
            requestTerminateOTA: terminate.requestTerminateOTA,
            requestTerminateMA: terminate.requestTerminateMA,
            requestTerminationNoteOTA: terminate.requestTerminationNoteOTA!,
            requestTerminationNoteMA: terminate.requestTerminationNoteMA!,
          })),
          totalData: counts[0].count,
        },
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: error,
      },
      500,
    );
  }
});

terminateProtectedRouter.openapi(listTerminateForOTARoute, async (c) => {
  const user = c.var.user;
  const zodParseResult = listTerminateQuerySchema.parse(c.req.query());
  const { q, page } = zodParseResult;

  const userAccount = await db
    .select()
    .from(accountTable)
    .where(eq(accountTable.id, user.id))
    .limit(1);

  if (userAccount[0].status === "unverified") {
    return c.json(
      {
        success: false,
        message: "Akun anda belum diverifikasi.",
        error: {},
      },
      403,
    );
  }

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
      .where(
        and(
          eq(connectionTable.connectionStatus, "accepted"),
          or(
            ilike(accountMahasiswaDetailTable.name, `%${q || ""}%`),
            ilike(accountMahasiswaDetailTable.nim, `%${q || ""}%`),
          ),
        ),
      );

    const terminateListQuery = db
      .select({
        mahasiswaId: connectionTable.mahasiswaId,
        maName: accountMahasiswaDetailTable.name,
        maNIM: accountMahasiswaDetailTable.nim,
        requestTerminationNoteOTA: connectionTable.requestTerminationNoteOTA,
        requestTerminationNoteMA: connectionTable.requestTerminationNoteMA,
        requestTerminateMa: connectionTable.requestTerminateMahasiswa,
        requestTerminateOta: connectionTable.requestTerminateOta,
        createdAt: connectionTable.createdAt,
      })
      .from(connectionTable)
      .innerJoin(
        accountMahasiswaDetailTable,
        eq(connectionTable.mahasiswaId, accountMahasiswaDetailTable.accountId),
      )
      .where(
        and(
          eq(connectionTable.connectionStatus, "accepted"),
          or(
            ilike(accountMahasiswaDetailTable.name, `%${q || ""}%`),
            ilike(accountMahasiswaDetailTable.nim, `%${q || ""}%`),
          ),
        ),
      )
      .limit(LIST_PAGE_SIZE)
      .offset(offset);

    const [terminateList, counts] = await Promise.all([
      terminateListQuery,
      countsQuery,
    ]);

    return c.json(
      {
        success: true,
        message: "Berhasil mendapatkan daftar terminate untuk OTA",
        body: {
          data: terminateList.map((terminate) => ({
            mahasiswaId: terminate.mahasiswaId,
            maName: terminate.maName ?? "",
            maNIM: terminate.maNIM,
            requestTerminationNoteOTA: terminate.requestTerminationNoteOTA!,
            requestTerminationNoteMA: terminate.requestTerminationNoteMA!,
            requestTerminateMa: terminate.requestTerminateMa,
            requestTerminateOta: terminate.requestTerminateOta,
            createdAt: terminate.createdAt,
          })),
          totalData: counts[0].count,
        },
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: error,
      },
      500,
    );
  }
});

terminateProtectedRouter.openapi(terminationStatusMARoute, async (c) => {
  const user = c.var.user;

  const userAccount = await db
    .select()
    .from(accountTable)
    .where(eq(accountTable.id, user.id))
    .limit(1);

  if (userAccount[0].status === "unverified") {
    return c.json(
      {
        success: false,
        message: "Akun anda belum diverifikasi.",
        error: {},
      },
      403,
    );
  }

  try {
    const terminationStatus = await db
      .select({
        otaId: connectionTable.otaId,
        otaName: accountOtaDetailTable.name,
        connectionStatus: connectionTable.connectionStatus,
        requestTerminationNoteOTA: connectionTable.requestTerminationNoteOTA,
        requestTerminationNoteMA: connectionTable.requestTerminationNoteMA,
        requestTerminateOTA: connectionTable.requestTerminateOta,
        requestTerminateMA: connectionTable.requestTerminateMahasiswa,
      })
      .from(connectionTable)
      .innerJoin(
        accountOtaDetailTable,
        eq(connectionTable.otaId, accountOtaDetailTable.accountId),
      )
      .where(eq(connectionTable.mahasiswaId, user.id))
      .limit(1);

    const status = terminationStatus[0];

    return c.json(
      {
        success: true,
        message: "Status terminasi untuk MA berhasil diambil",
        body: {
          otaId: status.otaId,
          otaName: status.otaName,
          connectionStatus: status.connectionStatus,
          requestTerminationNoteOTA: status.requestTerminationNoteOTA!,
          requestTerminationNoteMA: status.requestTerminationNoteMA!,
          requestTerminateOTA: status.requestTerminateOTA,
          requestTerminateMA: status.requestTerminateMA,
        },
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: error,
      },
      500,
    );
  }
});

terminateProtectedRouter.openapi(requestTerminateFromMARoute, async (c) => {
  const user = c.var.user;
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());

  const zodParseResult = TerminateRequestSchema.parse(data);
  const { mahasiswaId, otaId, requestTerminationNote } = zodParseResult;

  const userAccount = await db
    .select()
    .from(accountTable)
    .where(eq(accountTable.id, user.id))
    .limit(1);

  if (userAccount[0].status === "unverified") {
    return c.json(
      {
        success: false,
        message: "Akun anda belum diverifikasi.",
        error: {},
      },
      403,
    );
  }

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(connectionTable)
        .set({
          connectionStatus: "accepted",
          requestTerminateMahasiswa: true,
          requestTerminationNoteMA: requestTerminationNote,
        })
        .where(
          and(
            eq(connectionTable.mahasiswaId, mahasiswaId),
            eq(connectionTable.otaId, otaId),
          ),
        );
    });

    return c.json(
      {
        success: true,
        message:
          "Berhasil mengirimkan request terminate hubungan asuh dari akun MA",
        body: {
          mahasiswaId,
          otaId,
        },
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: error,
      },
      500,
    );
  }
});

terminateProtectedRouter.openapi(requestTerminateFromOTARoute, async (c) => {
  const user = c.var.user;
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());

  const zodParseResult = TerminateRequestSchema.parse(data);
  const { mahasiswaId, otaId, requestTerminationNote } = zodParseResult;

  const userAccount = await db
    .select()
    .from(accountTable)
    .where(eq(accountTable.id, user.id))
    .limit(1);

  if (userAccount[0].status === "unverified") {
    return c.json(
      {
        success: false,
        message: "Akun anda belum diverifikasi.",
        error: {},
      },
      403,
    );
  }

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(connectionTable)
        .set({
          connectionStatus: "accepted",
          requestTerminateOta: true,
          requestTerminationNoteOTA: requestTerminationNote,
        })
        .where(
          and(
            eq(connectionTable.mahasiswaId, mahasiswaId),
            eq(connectionTable.otaId, otaId),
          ),
        );
    });

    return c.json(
      {
        success: true,
        message:
          "Berhasil mengirimkan request terminate hubungan asuh dari akun OTA",
        body: {
          mahasiswaId,
          otaId,
        },
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: error,
      },
      500,
    );
  }
});

terminateProtectedRouter.openapi(validateTerminateRoute, async (c) => {
  const user = c.var.user;
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());

  const zodParseResult = verifTerminateRequestSchema.parse(data);
  const { mahasiswaId, otaId } = zodParseResult;

  const userAccount = await db
    .select()
    .from(accountTable)
    .where(eq(accountTable.id, user.id))
    .limit(1);

  if (userAccount[0].status === "unverified") {
    return c.json(
      {
        success: false,
        message: "Akun anda belum diverifikasi.",
        error: {},
      },
      403,
    );
  }

  try {
    await db.transaction(async (tx) => {
      await tx
        .delete(connectionTable)
        .where(
          and(
            eq(connectionTable.mahasiswaId, mahasiswaId),
            eq(connectionTable.otaId, otaId),
            eq(connectionTable.connectionStatus, "accepted"),
            or(
              eq(connectionTable.requestTerminateMahasiswa, true),
              eq(connectionTable.requestTerminateOta, true),
            ),
          ),
        );

      await tx
        .update(accountMahasiswaDetailTable)
        .set({ mahasiswaStatus: "inactive" })
        .where(eq(accountMahasiswaDetailTable.accountId, mahasiswaId));
    });

    return c.json(
      {
        success: true,
        message: "Berhasil memvalidasi terminasi hubungan",
        body: {
          mahasiswaId,
          otaId,
        },
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: error,
      },
      500,
    );
  }
});

terminateProtectedRouter.openapi(rejectTerminateRoute, async (c) => {
  const user = c.var.user;
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());

  const zodParseResult = verifTerminateRequestSchema.parse(data);
  const { mahasiswaId, otaId } = zodParseResult;

  const userAccount = await db
    .select()
    .from(accountTable)
    .where(eq(accountTable.id, user.id))
    .limit(1);

  if (userAccount[0].status === "unverified") {
    return c.json(
      {
        success: false,
        message: "Akun anda belum diverifikasi.",
        error: {},
      },
      403,
    );
  }

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(connectionTable)
        .set({
          requestTerminateMahasiswa: false,
          requestTerminateOta: false,
          connectionStatus: "accepted",
          requestTerminationNoteMA: null,
          requestTerminationNoteOTA: null,
        })
        .where(
          and(
            eq(connectionTable.mahasiswaId, mahasiswaId),
            eq(connectionTable.otaId, otaId),
            eq(connectionTable.connectionStatus, "accepted"),
            or(
              eq(connectionTable.requestTerminateMahasiswa, true),
              eq(connectionTable.requestTerminateOta, true),
            ),
          ),
        );
    });

    return c.json(
      {
        success: true,
        message: "Berhasil menolak request terminasi hubungan asuh",
        body: {
          mahasiswaId,
          otaId,
        },
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: error,
      },
      500,
    );
  }
});
