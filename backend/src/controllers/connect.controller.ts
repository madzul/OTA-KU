import { and, count, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "../db/drizzle.js";
import {
  accountMahasiswaDetailTable,
  accountOtaDetailTable,
  accountTable,
  connectionTable,
  transactionTable,
} from "../db/schema.js";
import {
  connectOtaMahasiswaByAdminRoute,
  connectOtaMahasiswaRoute,
  deleteConnectionRoute,
  isConnectedRoute,
  listAllConnectionRoute,
  listPendingConnectionRoute,
  listPendingTerminationConnectionRoute,
  verifyConnectionAccRoute,
  verifyConnectionRejectRoute,
} from "../routes/connect.route.js";
import {
  MahasiwaConnectSchema,
  connectionListAllQuerySchema,
  connectionListQuerySchema,
} from "../zod/connect.js";
import { createAuthRouter, createRouter } from "./router-factory.js";

export const connectRouter = createRouter();
export const connectProtectedRouter = createAuthRouter();

const LIST_PAGE_SIZE = 6;

connectProtectedRouter.openapi(connectOtaMahasiswaRoute, async (c) => {
  const user = c.var.user;
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());

  const zodParseResult = MahasiwaConnectSchema.parse(data);
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
      // Get OTA's max capacity
      const otaDetails = await tx
        .select({
          maxCapacity: accountOtaDetailTable.maxCapacity,
        })
        .from(accountOtaDetailTable)
        .where(eq(accountOtaDetailTable.accountId, otaId))
        .then((rows) => rows[0]);

      // active count di query terpisah
      const activeCount = await tx
        .select({
          count: sql<number>`count(*)`,
        })
        .from(accountMahasiswaDetailTable)
        .where(
          sql`${accountMahasiswaDetailTable.mahasiswaStatus} = 'active' AND 
              ${accountMahasiswaDetailTable.accountId} IN (
                SELECT ${accountMahasiswaDetailTable.accountId}
                FROM ${accountMahasiswaDetailTable}
                JOIN ${accountTable} 
                  ON ${accountTable.id} = ${accountMahasiswaDetailTable.accountId}
                WHERE ${accountTable.type} = 'mahasiswa'
                AND ${accountTable.id} = ${mahasiswaId}
              )`,
        )
        .then((rows) => Number(rows[0]?.count || 0));

      if (activeCount >= otaDetails.maxCapacity) {
        return c.json(
          {
            success: false,
            message: "Kapasitas orang tua asuh sudah penuh.",
            error: {},
          },
          400,
        );
      }

      // Update mahasiswa status to active
      await tx
        .update(accountMahasiswaDetailTable)
        .set({ mahasiswaStatus: "active" })
        .where(eq(accountMahasiswaDetailTable.accountId, mahasiswaId));

      await tx.insert(connectionTable).values({
        mahasiswaId,
        otaId,
        paidFor: 0,
      });
    });

    return c.json(
      {
        success: true,
        message: "Berhasil menghubungkan orang tua asuh dengan mahasiswa asuh.",
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

connectProtectedRouter.openapi(connectOtaMahasiswaByAdminRoute, async (c) => {
  const user = c.var.user;
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());

  const zodParseResult = MahasiwaConnectSchema.parse(data);
  const { mahasiswaId, otaId } = zodParseResult;

  const userAccount = await db
    .select()
    .from(accountTable)
    .where(eq(accountTable.id, user.id))
    .limit(1);

  console.log(user.id);

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
      // Get OTA's max capacity
      const otaDetails = await tx
        .select({
          maxCapacity: accountOtaDetailTable.maxCapacity,
        })
        .from(accountOtaDetailTable)
        .where(eq(accountOtaDetailTable.accountId, otaId))
        .then((rows) => rows[0]);

      // active count di query terpisah
      const activeCount = await tx
        .select({
          count: sql<number>`count(*)`,
        })
        .from(accountMahasiswaDetailTable)
        .where(
          sql`${accountMahasiswaDetailTable.mahasiswaStatus} = 'active' AND 
              ${accountMahasiswaDetailTable.accountId} IN (
                SELECT ${accountMahasiswaDetailTable.accountId}
                FROM ${accountMahasiswaDetailTable}
                JOIN ${accountTable} 
                  ON ${accountTable.id} = ${accountMahasiswaDetailTable.accountId}
                WHERE ${accountTable.type} = 'mahasiswa'
                AND ${accountTable.id} = ${mahasiswaId}
              )`,
        )
        .then((rows) => Number(rows[0]?.count || 0));

      if (activeCount >= otaDetails.maxCapacity) {
        return c.json(
          {
            success: false,
            message: "Kapasitas orang tua asuh sudah penuh.",
            error: {},
          },
          400,
        );
      }

      // Update mahasiswa status to active
      await tx
        .update(accountMahasiswaDetailTable)
        .set({ mahasiswaStatus: "active" })
        .where(eq(accountMahasiswaDetailTable.accountId, mahasiswaId));

      await tx.insert(connectionTable).values({
        mahasiswaId: mahasiswaId,
        otaId: otaId,
        connectionStatus: "accepted",
        paidFor: 0,
      });

      // Get bill
      const billResult = await tx
        .select({
          bill: accountMahasiswaDetailTable.bill,
        })
        .from(accountMahasiswaDetailTable)
        .where(eq(accountMahasiswaDetailTable.accountId, mahasiswaId))
        .limit(1);

      const bill_mahasiswa = billResult[0]?.bill;

      // Get transfer_date from OTA
      const transferDateResult = await tx
        .select({
          transferDate: accountOtaDetailTable.transferDate,
        })
        .from(accountOtaDetailTable)
        .where(eq(accountOtaDetailTable.accountId, otaId))
        .limit(1);

      const transfer_date = transferDateResult[0]?.transferDate;

      // Calculate due_date
      const now = new Date();
      const todayDay = now.getDate();
      const currentMonth = now.getMonth(); // 0-indexed
      const currentYear = now.getFullYear();

      const dueMonth =
        todayDay < transfer_date ? currentMonth : currentMonth + 1;
      const dueYear = dueMonth > 11 ? currentYear + 1 : currentYear;
      const normalizedMonth = dueMonth % 12;

      const dueDate = new Date(
        dueYear,
        normalizedMonth,
        transfer_date,
        23,
        59,
        59,
      );

      await tx.insert(transactionTable).values({
        transferStatus: "unpaid",
        mahasiswaId: mahasiswaId,
        otaId: otaId,
        bill: bill_mahasiswa,
        dueDate: dueDate,
      });
    });

    return c.json(
      {
        success: true,
        message: "Berhasil menghubungkan orang tua asuh dengan mahasiswa asuh.",
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

connectProtectedRouter.openapi(verifyConnectionAccRoute, async (c) => {
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());
  const zodParseResult = MahasiwaConnectSchema.parse(data);
  const { mahasiswaId, otaId } = zodParseResult;

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(connectionTable)
        .set({ connectionStatus: "accepted" })
        .where(
          and(
            eq(connectionTable.mahasiswaId, mahasiswaId),
            eq(connectionTable.otaId, otaId),
            eq(connectionTable.connectionStatus, "pending"),
            and(
              eq(connectionTable.requestTerminateMahasiswa, false),
              eq(connectionTable.requestTerminateOta, false),
            ),
          ),
        );

      // Get bill
      const billResult = await tx
        .select({
          bill: accountMahasiswaDetailTable.bill,
        })
        .from(accountMahasiswaDetailTable)
        .where(eq(accountMahasiswaDetailTable.accountId, mahasiswaId))
        .limit(1);

      const bill_mahasiswa = billResult[0]?.bill;

      // Get transfer_date from OTA
      const transferDateResult = await tx
        .select({
          transferDate: accountOtaDetailTable.transferDate,
        })
        .from(accountOtaDetailTable)
        .where(eq(accountOtaDetailTable.accountId, otaId))
        .limit(1);

      const transfer_date = transferDateResult[0]?.transferDate;

      // Calculate due_date
      const now = new Date();
      const todayDay = now.getDate();
      const currentMonth = now.getMonth(); // 0-indexed
      const currentYear = now.getFullYear();

      const dueMonth =
        todayDay < transfer_date ? currentMonth : currentMonth + 1;
      const dueYear = dueMonth > 11 ? currentYear + 1 : currentYear;
      const normalizedMonth = dueMonth % 12;

      const dueDate = new Date(
        dueYear,
        normalizedMonth,
        transfer_date,
        23,
        59,
        59,
      );

      await tx.insert(transactionTable).values({
        transferStatus: "unpaid",
        mahasiswaId: mahasiswaId,
        otaId: otaId,
        bill: bill_mahasiswa,
        dueDate: dueDate,
      });
    });

    return c.json(
      {
        success: true,
        message:
          "Berhasil melakukan penerimaan verifikasi connection oleh Admin",
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

connectProtectedRouter.openapi(verifyConnectionRejectRoute, async (c) => {
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());
  const zodParseResult = MahasiwaConnectSchema.parse(data);
  const { mahasiswaId, otaId } = zodParseResult;

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(connectionTable)
        .set({ connectionStatus: "rejected" })
        .where(
          and(
            eq(connectionTable.mahasiswaId, mahasiswaId),
            eq(connectionTable.otaId, otaId),
            eq(connectionTable.connectionStatus, "pending"),
            and(
              eq(connectionTable.requestTerminateMahasiswa, false),
              eq(connectionTable.requestTerminateOta, false),
            ),
          ),
        );
    });

    return c.json(
      {
        success: true,
        message:
          "Berhasil melakukan penolakan verifikasi connection oleh Admin",
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

connectProtectedRouter.openapi(listPendingConnectionRoute, async (c) => {
  const zodParseResult = connectionListQuerySchema.parse(c.req.query());
  const { q, page } = zodParseResult;

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
          eq(connectionTable.connectionStatus, "pending"),
          or(
            ilike(accountMahasiswaDetailTable.name, `%${q || ""}%`),
            ilike(accountMahasiswaDetailTable.nim, `%${q || ""}%`),
            ilike(accountOtaDetailTable.name, `%${q || ""}%`),
          ),
          and(
            eq(connectionTable.requestTerminateMahasiswa, false),
            eq(connectionTable.requestTerminateOta, false),
          ),
        ),
      );

    const connectionListQuery = db
      .select({
        mahasiswa_id: connectionTable.mahasiswaId,
        name_ma: accountMahasiswaDetailTable.name,
        nim_ma: accountMahasiswaDetailTable.nim,
        ota_id: connectionTable.otaId,
        name_ota: accountOtaDetailTable.name,
        number_ota: accountTable.phoneNumber,
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
          eq(connectionTable.connectionStatus, "pending"),
          or(
            ilike(accountMahasiswaDetailTable.name, `%${q || ""}%`),
            ilike(accountMahasiswaDetailTable.nim, `%${q || ""}%`),
            ilike(accountOtaDetailTable.name, `%${q || ""}%`),
          ),
          and(
            eq(connectionTable.requestTerminateMahasiswa, false),
            eq(connectionTable.requestTerminateOta, false),
          ),
        ),
      )
      .limit(LIST_PAGE_SIZE)
      .offset(offset);

    const [connectionList, counts] = await Promise.all([
      connectionListQuery,
      countsQuery,
    ]);

    return c.json(
      {
        success: true,
        message: "Daftar connection pending berhasil diambil",
        body: {
          data: connectionList.map((connection) => ({
            mahasiswa_id: connection.mahasiswa_id,
            name_ma: connection.name_ma ?? "",
            nim_ma: connection.nim_ma,
            ota_id: connection.ota_id,
            name_ota: connection.name_ota,
            number_ota: connection.number_ota ?? "",
          })),
          totalData: counts[0].count,
        },
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching connection list:", error);
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

connectProtectedRouter.openapi(
  listPendingTerminationConnectionRoute,
  async (c) => {
    const zodParseResult = connectionListQuerySchema.parse(c.req.query());
    const { q, page } = zodParseResult;

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
          eq(
            connectionTable.mahasiswaId,
            accountMahasiswaDetailTable.accountId,
          ),
        )
        .innerJoin(
          accountOtaDetailTable,
          eq(connectionTable.otaId, accountOtaDetailTable.accountId),
        )
        .where(
          and(
            eq(connectionTable.connectionStatus, "pending"),
            or(
              ilike(accountMahasiswaDetailTable.name, `%${q || ""}%`),
              ilike(accountMahasiswaDetailTable.nim, `%${q || ""}%`),
              ilike(accountOtaDetailTable.name, `%${q || ""}%`),
            ),
            or(
              eq(connectionTable.requestTerminateMahasiswa, true),
              eq(connectionTable.requestTerminateOta, true),
            ),
          ),
        );

      const connectionListQuery = db
        .select({
          mahasiswa_id: connectionTable.mahasiswaId,
          name_ma: accountMahasiswaDetailTable.name,
          nim_ma: accountMahasiswaDetailTable.nim,
          ota_id: connectionTable.otaId,
          name_ota: accountOtaDetailTable.name,
          number_ota: accountTable.phoneNumber,
          request_term_ota: connectionTable.requestTerminateOta,
          request_term_ma: connectionTable.requestTerminateMahasiswa,
        })
        .from(connectionTable)
        .innerJoin(
          accountMahasiswaDetailTable,
          eq(
            connectionTable.mahasiswaId,
            accountMahasiswaDetailTable.accountId,
          ),
        )
        .innerJoin(
          accountOtaDetailTable,
          eq(connectionTable.otaId, accountOtaDetailTable.accountId),
        )
        .innerJoin(accountTable, eq(connectionTable.otaId, accountTable.id))
        .where(
          and(
            eq(connectionTable.connectionStatus, "pending"),
            or(
              ilike(accountMahasiswaDetailTable.name, `%${q || ""}%`),
              ilike(accountMahasiswaDetailTable.nim, `%${q || ""}%`),
              ilike(accountOtaDetailTable.name, `%${q || ""}%`),
            ),
            or(
              eq(connectionTable.requestTerminateMahasiswa, true),
              eq(connectionTable.requestTerminateOta, true),
            ),
          ),
        )
        .limit(LIST_PAGE_SIZE)
        .offset(offset);

      const [connectionList, counts] = await Promise.all([
        connectionListQuery,
        countsQuery,
      ]);

      return c.json(
        {
          success: true,
          message: "Daftar connection pending berhasil diambil",
          body: {
            data: connectionList.map((connection) => ({
              mahasiswa_id: connection.mahasiswa_id,
              name_ma: connection.name_ma ?? "",
              nim_ma: connection.nim_ma,
              ota_id: connection.ota_id,
              name_ota: connection.name_ota,
              number_ota: connection.number_ota ?? "",
              request_term_ota: connection.request_term_ota,
              request_term_ma: connection.request_term_ma,
            })),
            totalData: counts[0].count,
          },
        },
        200,
      );
    } catch (error) {
      console.error("Error fetching connection list:", error);
      return c.json(
        {
          success: false,
          message: "Internal server error",
          error: error,
        },
        500,
      );
    }
  },
);

connectProtectedRouter.openapi(listAllConnectionRoute, async (c) => {
  const zodParseResult = connectionListAllQuerySchema.parse(c.req.query());
  const { q, page, connection_status } = zodParseResult;

  // Validate page to be a positive integer
  let pageNumber = Number(page);
  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  try {
    const offset = (pageNumber - 1) * LIST_PAGE_SIZE;

    const searchCondition = q
      ? or(
          ilike(accountMahasiswaDetailTable.name, `%${q}%`),
          ilike(accountOtaDetailTable.name, `%${q}%`),
          ilike(accountMahasiswaDetailTable.nim, `%${q}%`),
        )
      : undefined;

    const filterConditions = [
      connection_status
        ? eq(
            connectionTable.connectionStatus,
            connection_status as "accepted" | "rejected" | "pending",
          )
        : undefined,
    ];

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
      .where(and(searchCondition, ...filterConditions));

    const connectionListQuery = db
      .select({
        mahasiswa_id: connectionTable.mahasiswaId,
        name_ma: accountMahasiswaDetailTable.name,
        nim_ma: accountMahasiswaDetailTable.nim,
        ota_id: connectionTable.otaId,
        name_ota: accountOtaDetailTable.name,
        number_ota: accountTable.phoneNumber,
        connection_status: connectionTable.connectionStatus,
        request_term_ota: connectionTable.requestTerminateOta,
        request_term_ma: connectionTable.requestTerminateMahasiswa,
        paidFor: connectionTable.paidFor,
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
      .where(and(searchCondition, ...filterConditions))
      .limit(LIST_PAGE_SIZE)
      .offset(offset);

    const [connectionList, counts] = await Promise.all([
      connectionListQuery,
      countsQuery,
    ]);

    return c.json(
      {
        success: true,
        message: "Daftar connection pending berhasil diambil",
        body: {
          data: connectionList.map((connection) => ({
            mahasiswa_id: connection.mahasiswa_id,
            name_ma: connection.name_ma ?? "",
            nim_ma: connection.nim_ma,
            ota_id: connection.ota_id,
            name_ota: connection.name_ota,
            number_ota: connection.number_ota ?? "",
            connection_status: connection.connection_status,
            request_term_ota: connection.request_term_ota,
            request_term_ma: connection.request_term_ma,
            paidFor: connection.paidFor,
          })),
          totalPagination: counts[0].count,
        },
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching connection list:", error);
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

connectProtectedRouter.openapi(isConnectedRoute, async (c) => {
  const query = c.req.query();
  const zodParseResult = MahasiwaConnectSchema.parse(query);
  const { mahasiswaId, otaId } = zodParseResult;

  try {
    const connection = await db
      .select()
      .from(connectionTable)
      .where(
        and(
          eq(connectionTable.mahasiswaId, mahasiswaId),
          eq(connectionTable.otaId, otaId),
        ),
      )
      .limit(1);

    if (!connection.length) {
      return c.json(
        {
          isConnected: false,
          message: `Tidak ditemukan hubungan asuh antara ${mahasiswaId} dan ${otaId}`,
        },
        400,
      );
    }

    if (connection[0].connectionStatus === "accepted") {
      return c.json(
        {
          isConnected: true,
          message: `Ditemukan hubungan asuh antara ${mahasiswaId} dan ${otaId}`,
        },
        200,
      );
    }

    return c.json(
      {
        isConnected: false,
        message: `Hubungan asuh antara ${mahasiswaId} dan ${otaId} telah diajukan, tetapi belum diverifikasi admin`,
      },
      400,
    );
  } catch (error) {
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

connectProtectedRouter.openapi(deleteConnectionRoute, async (c) => {
  const query = c.req.query();
  const zodParseResult = MahasiwaConnectSchema.parse(query);
  const { mahasiswaId, otaId } = zodParseResult;

  try {
    await db
      .delete(connectionTable)
      .where(
        and(
          eq(connectionTable.mahasiswaId, mahasiswaId),
          eq(connectionTable.otaId, otaId),
        ),
      );

    return c.json(
      {
        success: true,
        message: `Successfuly deleted connection between ${mahasiswaId} and ${otaId}`,
      },
      200,
    );
  } catch (error) {
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
