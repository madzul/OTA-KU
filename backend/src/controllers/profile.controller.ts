import { v4 as uuid } from "uuid";

import { db } from "../db/drizzle.js";
import {
  accountMahasiswaDetailTable,
  accountOtaDetailTable,
} from "../db/schema.js";
import cloudinary from "../lib/cloudinary.js";
import {
  pendaftaranMahasiswaRoute,
  pendaftaranOrangTuaRoute,
} from "../routes/profile.route.js";
import {
  MahasiswaRegistrationFormSchema,
  OrangTuaRegistrationSchema,
} from "../zod/profile.js";
import { createAuthRouter, createRouter } from "./router-factory.js";

export const profileRouter = createRouter();
export const profileProtectedRouter = createAuthRouter();

profileProtectedRouter.openapi(pendaftaranMahasiswaRoute, async (c) => {
  const user = c.var.user;
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());

  const zodParseResult = MahasiswaRegistrationFormSchema.safeParse(data);
  if (!zodParseResult.success) {
    return c.json(
      {
        success: false,
        message: "Gagal mendaftar.",
        error: zodParseResult.error.errors,
      },
      400,
    );
  }

  const { name, nim, description, file } = zodParseResult.data;

  try {
    const fileUuid = uuid();

    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = Buffer.from(fileBuffer).toString("base64");
    const base64DataUri = `data:application/pdf;base64,${fileBase64}`;

    const result = await cloudinary.uploader.upload(base64DataUri, {
      folder: "profile",
      public_id: fileUuid,
      resource_type: "raw",
    });

    await db.insert(accountMahasiswaDetailTable).values({
      accountId: user.id,
      name,
      nim,
      description,
      file: result.secure_url,
    });

    return c.json(
      {
        success: true,
        message: "Berhasil mendaftar.",
        body: {
          name,
          nim,
          description,
          file: result.secure_url,
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

profileProtectedRouter.openapi(pendaftaranOrangTuaRoute, async (c) => {
  const user = c.var.user;
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());

  const zodParseResult = OrangTuaRegistrationSchema.safeParse(data);
  if (!zodParseResult.success) {
    return c.json(
      {
        success: false,
        message: "Gagal mendaftar.",
        error: zodParseResult.error.errors,
      },
      400,
    );
  }

  const {
    name,
    address,
    criteria,
    funds,
    job,
    linkage,
    maxCapacity,
    maxSemester,
    startDate,
    transferDate,
  } = zodParseResult.data;

  try {
    await db.insert(accountOtaDetailTable).values({
      accountId: user.id,
      address,
      criteria,
      funds,
      job,
      linkage,
      maxCapacity,
      maxSemester,
      startDate,
      name,
      transferDate,
    });

    return c.json(
      {
        success: true,
        message: "Berhasil mendaftar.",
        body: {
          name,
          address,
          criteria,
          funds,
          job,
          linkage,
          maxCapacity,
          maxSemester,
          startDate,
          transferDate,
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
