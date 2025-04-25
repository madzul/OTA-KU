import { eq } from "drizzle-orm";

import { db } from "../db/drizzle.js";
import { accountMahasiswaDetailTable, accountTable } from "../db/schema.js";
import { applicationStatusRoute } from "../routes/status.route.js";
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
        error: {},
      },
      500,
    );
  }
});
