import { and, eq, sql } from "drizzle-orm";

import { db } from "../db/drizzle.js";
import {
  accountMahasiswaDetailTable,
  connectionTable
} from "../db/schema.js";
import { createAuthRouter } from "./router-factory.js";
import { requestTerminateFromMARoute, requestTerminateFromOTARoute, validateTerminateRoute } from "../routes/terminate.route.js";
import { TerminateRequestSchema } from "../zod/terminate.js";

export const terminateProtectedRouter = createAuthRouter();

terminateProtectedRouter.openapi(requestTerminateFromMARoute, async(c) => {
    const user = c.var.user;
    const body = await c.req.formData();
    const data = Object.fromEntries(body.entries());

    const zodParseResult = TerminateRequestSchema.parse(data)
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

    try{
        await db.transaction(async (tx) => {
            await tx
            .update(connectionTable)
            .set({ connectionStatus: "pending" }) //TODO: on relation connection, attribute connection_status tambahine enum pending_terminate biar bisa dibedain pending pengajuan sama pending termination
            .where(
                and(
                    eq(connectionTable.mahasiswaId, mahasiswaId),
                    eq(connectionTable.otaId, otaId)
                )
            )
        })

        return c.json(
            {
              success: true,
              message: "Berhasil mengirimkan request terminate hubungan asuh dari akun MA",
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
})

terminateProtectedRouter.openapi(requestTerminateFromOTARoute, async(c) => {
    const user = c.var.user;
    const body = await c.req.formData();
    const data = Object.fromEntries(body.entries());

    const zodParseResult = TerminateRequestSchema.parse(data)
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

    try{
        await db.transaction(async (tx) => {
            await tx
            .update(connectionTable)
            .set({ connectionStatus: "pending" }) //TODO: on relation connection, attribute connection_status tambahine enum pending_terminate biar bisa dibedain pending pengajuan sama pending termination
            .where(
                and(
                    eq(connectionTable.mahasiswaId, mahasiswaId),
                    eq(connectionTable.otaId, otaId)
                )
            )
        })

        return c.json(
            {
              success: true,
              message: "Berhasil mengirimkan request terminate hubungan asuh dari akun OTA",
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
})

terminateProtectedRouter.openapi(validateTerminateRoute, async(c) => {
    const user = c.var.user;
    const body = await c.req.formData();
    const data = Object.fromEntries(body.entries());

    const zodParseResult = TerminateRequestSchema.parse(data)
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

    try{
        await db.transaction(async (tx) => {
            await tx
            .delete(connectionTable)
            .where(
                and(
                    eq(connectionTable.mahasiswaId, mahasiswaId),
                    eq(connectionTable.otaId, otaId),
                    eq(connectionTable.connectionStatus, "pending") //TODO: on relation connection, attribute connection_status tambahine enum pending_terminate biar bisa dibedain pending pengajuan sama pending termination
                )
            )

            await tx
            .update(accountMahasiswaDetailTable)
            .set({ mahasiswaStatus : "inactive" })
            .where(
                eq(accountMahasiswaDetailTable.accountId, mahasiswaId)
            )
        })

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
            error: {},
          },
          500,
        );
    }
})
