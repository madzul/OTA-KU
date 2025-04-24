import { eq, sql } from "drizzle-orm";

import { db } from "../db/drizzle.js";
import {
  accountMahasiswaDetailTable,
  accountOtaDetailTable,
  accountTable,
  connectionTable,
} from "../db/schema.js";
import { connectOtaMahasiswaRoute } from "../routes/connect.route.js";
import { MahasiwaConnectSchema } from "../zod/connect.js";
import { createAuthRouter, createRouter } from "./router-factory.js";

export const connectRouter = createRouter();
export const connectProtectedRouter = createAuthRouter();

connectProtectedRouter.openapi(connectOtaMahasiswaRoute, async (c) => {
  const user = c.var.user;
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());

  const zodParseResult = MahasiwaConnectSchema.parse(data);
  const { mahasiswaId, otaId } = zodParseResult;

  if (user.status === "unverified") {
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
