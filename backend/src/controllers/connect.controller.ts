import { eq, sql, and, or, ilike, count } from "drizzle-orm";

import { db } from "../db/drizzle.js";
import {
  accountMahasiswaDetailTable,
  accountOtaDetailTable,
  accountTable,
  connectionTable,
} from "../db/schema.js";
import { connectOtaMahasiswaRoute, listConnectionRoute, verifyConnectionAccRoute, verifyConnectionRejectRoute } from "../routes/connect.route.js";
import { connectionListQuerySchema, MahasiwaConnectSchema } from "../zod/connect.js";
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
        error: {},
      },
      500,
    );
  }
});

connectProtectedRouter.openapi(verifyConnectionAccRoute, async(c) => {
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());
  const zodParseResult = MahasiwaConnectSchema.parse(data);
  const { mahasiswaId, otaId } = zodParseResult;

  try{
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
              eq(connectionTable.requestTerminateOta, false)
            )
          )
        )
    })

    return c.json(
      {
        success: true,
        message: "Berhasil melakukan penerimaan verifikasi connection oleh Admin",
      },
      200
    );
  } catch (error) {
    console.error(error);
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

connectProtectedRouter.openapi(verifyConnectionRejectRoute, async(c) => {
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());
  const zodParseResult = MahasiwaConnectSchema.parse(data);
  const { mahasiswaId, otaId } = zodParseResult;

  try{
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
              eq(connectionTable.requestTerminateOta, false)
            )
          )
        )
    })

    return c.json(
      {
        success: true,
        message: "Berhasil melakukan penolakan verifikasi connection oleh Admin",
      },
      200
    );
  } catch (error) {
    console.error(error);
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

connectProtectedRouter.openapi(listConnectionRoute, async(c) => {
  const zodParseResult = connectionListQuerySchema.parse(c.req.query());
  const { q, page } = zodParseResult

  // Validate page to be a positive integer
  let pageNumber = Number(page);
  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  try{
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
            eq(connectionTable.requestTerminateOta, false)
          )
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
      .innerJoin(
        accountTable,
        eq(connectionTable.otaId, accountTable.id),
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
            eq(connectionTable.requestTerminateOta, false)
          )
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
          message: "Daftar connection berhasil diambil",
          body: {
            data: connectionList.map((connection) => ({
              mahasiswa_id: connection.mahasiswa_id,
              name_ma: connection.name_ma ?? "",
              nim_ma: connection.nim_ma,
              ota_id: connection.ota_id,
              name_ota: connection.name_ota,
              number_ota: connection.number_ota ?? ""
            })),
            totalData: counts[0].count,
          }
        },
        200
      )
  }catch (error) {
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
})

