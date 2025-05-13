import { eq } from "drizzle-orm";

import { db } from "../db/drizzle.js";
import { accountMahasiswaDetailTable, accountTable } from "../db/schema.js";
import {
  applicationStatusRoute,
  getApplicationStatusRoute,
  getReapplicationStatusRoute,
  getVerificationStatusRoute,
} from "../routes/status.route.js";
import { ApplicationStatusSchema } from "../zod/status.js";
import { createAuthRouter, createRouter } from "./router-factory.js";

export const statusRouter = createRouter();
export const statusProtectedRouter = createAuthRouter();

statusProtectedRouter.openapi(applicationStatusRoute, async (c) => {
  const id = c.req.param("id");
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());

  const zodParseResult = ApplicationStatusSchema.parse(data);
  const { status, adminOnlyNotes, notes } = zodParseResult;

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(accountTable)
        .set({
          applicationStatus: status,
        })
        .where(eq(accountTable.id, id));

      const user = await tx
        .select()
        .from(accountTable)
        .where(eq(accountTable.id, id));

      const type = user[0]?.type;

      if (type === "mahasiswa") {
        await tx
          .update(accountMahasiswaDetailTable)
          .set({
            notes: notes ?? null,
            adminOnlyNotes: adminOnlyNotes ?? null,
          })
          .where(eq(accountMahasiswaDetailTable.accountId, id));
      }
    });

    return c.json(
      {
        success: true,
        message: "Berhasil mengubah status pendaftaran",
        body: { status },
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Gagal mengubah status pendaftaran",
        error: error,
      },
      500,
    );
  }
});

statusProtectedRouter.openapi(getApplicationStatusRoute, async (c) => {
  const user = c.var.user;
  const id = c.req.param("id");

  if (user.id !== id) {
    return c.json(
      {
        success: false,
        message: "Unauthorized",
        error: {},
      },
      403,
    );
  }

  try {
    const user = await db
      .select()
      .from(accountTable)
      .where(eq(accountTable.id, id));

    return c.json(
      {
        success: true,
        message: "Berhasil mengambil status pendaftaran",
        body: { status: user[0].applicationStatus },
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Gagal mengambil status pendaftaran",
        error: error,
      },
      500,
    );
  }
});

statusProtectedRouter.openapi(getVerificationStatusRoute, async (c) => {
  const user = c.var.user;
  const id = c.req.param("id");

  if (user.id !== id) {
    return c.json(
      {
        success: false,
        message: "Unauthorized",
        error: {},
      },
      403,
    );
  }

  try {
    const user = await db
      .select()
      .from(accountTable)
      .where(eq(accountTable.id, id));

    return c.json(
      {
        success: true,
        message: "Berhasil mengambil status pendaftaran",
        body: { status: user[0].status },
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Gagal mengambil status pendaftaran",
        error: error,
      },
      500,
    );
  }
});

statusProtectedRouter.openapi(getReapplicationStatusRoute, async (c) => {
  const user = c.var.user;
  const id = c.req.param("id");

  if (user.id !== id) {
    return c.json(
      {
        success: false,
        message: "Forbidden",
        error: {},
      },
      403,
    );
  }

  try {
    const user = await db
      .select()
      .from(accountTable)
      .where(eq(accountTable.id, id));

    if (user[0].type !== "mahasiswa") {
      return c.json(
        {
          success: false,
          message: "Forbidden",
          error: {},
        },
        403,
      );
    }

    const dueNextUpdateAt = await db
      .select({
        dueNextUpdateAt: accountMahasiswaDetailTable.dueNextUpdateAt,
      })
      .from(accountMahasiswaDetailTable)
      .where(eq(accountMahasiswaDetailTable.accountId, id));

    // Return true if current date is 30 days before dueNextUpdateAt
    const currentDate = new Date();
    const dueDate = new Date(dueNextUpdateAt[0].dueNextUpdateAt);
    const thirtyDaysBeforeDueDate = new Date(
      dueDate.getTime() - 30 * 24 * 60 * 60 * 1000,
    );
    const isThirtyDaysBeforeDueDate =
      currentDate >= thirtyDaysBeforeDueDate && currentDate <= dueDate;
    const daysRemaining = Math.ceil(
      (dueDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24),
    );

    return c.json(
      {
        success: true,
        message: "Berhasil mengambil status pendaftaran",
        body: {
          status: isThirtyDaysBeforeDueDate,
          daysRemaining: daysRemaining,
        },
      },
      200,
    );
  } catch (error) {
    console.error(error);
    return c.json(
      {
        success: false,
        message: "Gagal mengambil status pendaftaran",
        error: error,
      },
      500,
    );
  }
});
