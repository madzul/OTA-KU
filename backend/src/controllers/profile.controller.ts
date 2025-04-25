import { eq } from "drizzle-orm";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";

import { env } from "../config/env.config.js";
import { db } from "../db/drizzle.js";
import {
  accountMahasiswaDetailTable,
  accountOtaDetailTable,
  accountTable,
} from "../db/schema.js";
import { uploadPdfToCloudinary } from "../lib/file-upload.js";
import {
  editProfileMahasiswaRoute,
  editProfileOrangTuaRoute,
  pendaftaranMahasiswaRoute,
  pendaftaranOrangTuaRoute,
  profileMahasiswaRoute,
  profileOrangTuaRoute,
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

  const zodParseResult = MahasiswaRegistrationFormSchema.parse(data);
  const {
    name,
    nim,
    description,
    file,
    phoneNumber,
    cityOfOrigin,
    ditmawaRecommendationLetter,
    electricityBill,
    faculty,
    highschoolAlumni,
    kk,
    ktm,
    major,
    pbb,
    salaryReport,
    transcript,
    waliRecommendationLetter,
  } = zodParseResult;

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
    const [
      fileResult,
      kkResult,
      ktmResult,
      waliRecommendationLetterResult,
      transcriptResult,
      salaryReportResult,
      pbbResult,
      electricityBillResult,
      ditmawaRecommendationLetterResult,
    ] = await Promise.all([
      uploadPdfToCloudinary(file),
      uploadPdfToCloudinary(kk),
      uploadPdfToCloudinary(ktm),
      uploadPdfToCloudinary(waliRecommendationLetter),
      uploadPdfToCloudinary(transcript),
      uploadPdfToCloudinary(salaryReport),
      uploadPdfToCloudinary(pbb),
      uploadPdfToCloudinary(electricityBill),
      uploadPdfToCloudinary(ditmawaRecommendationLetter),
    ]);

    await db.transaction(async (tx) => {
      await tx
        .update(accountTable)
        .set({ phoneNumber })
        .where(eq(accountTable.id, user.id));

      await tx
        .insert(accountMahasiswaDetailTable)
        .values({
          accountId: user.id,
          name,
          nim,
          description,
          major,
          faculty,
          cityOfOrigin,
          highschoolAlumni,
          file: fileResult.secure_url,
          kk: kkResult.secure_url,
          ktm: ktmResult.secure_url,
          waliRecommendationLetter: waliRecommendationLetterResult.secure_url,
          transcript: transcriptResult.secure_url,
          salaryReport: salaryReportResult.secure_url,
          pbb: pbbResult.secure_url,
          electricityBill: electricityBillResult.secure_url,
          ditmawaRecommendationLetter:
            ditmawaRecommendationLetterResult.secure_url,
        })
        .onConflictDoUpdate({
          target: [accountMahasiswaDetailTable.accountId],
          set: {
            name,
            nim,
            description,
            major,
            faculty,
            cityOfOrigin,
            highschoolAlumni,
            file: fileResult.secure_url,
            kk: kkResult.secure_url,
            ktm: ktmResult.secure_url,
            waliRecommendationLetter: waliRecommendationLetterResult.secure_url,
            transcript: transcriptResult.secure_url,
            salaryReport: salaryReportResult.secure_url,
            pbb: pbbResult.secure_url,
            electricityBill: electricityBillResult.secure_url,
            ditmawaRecommendationLetter:
              ditmawaRecommendationLetterResult.secure_url,
          },
        });

      await tx
        .update(accountTable)
        .set({ applicationStatus: "pending" })
        .where(eq(accountTable.id, user.id));
    });

    const accessToken = await sign(
      {
        id: user.id,
        email: user.email,
        phoneNumber: phoneNumber,
        type: user.type,
        provider: user.provider,
        status: user.status,
        applicationStatus: "pending",
        oid: user.oid,
        createdAt: user.createdAt,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      },
      env.JWT_SECRET,
    );

    setCookie(c, "ota-ku.access-cookie", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return c.json(
      {
        success: true,
        message: "Berhasil mendaftar.",
        body: {
          name,
          nim,
          description,
          major,
          faculty,
          cityOfOrigin,
          highschoolAlumni,
          file: fileResult.secure_url,
          kk: kkResult.secure_url,
          ktm: ktmResult.secure_url,
          waliRecommendationLetter: waliRecommendationLetterResult.secure_url,
          transcript: transcriptResult.secure_url,
          salaryReport: salaryReportResult.secure_url,
          pbb: pbbResult.secure_url,
          electricityBill: electricityBillResult.secure_url,
          ditmawaRecommendationLetter:
            ditmawaRecommendationLetterResult.secure_url,
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

  const zodParseResult = OrangTuaRegistrationSchema.parse(data);

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
  } = zodParseResult;

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
      await tx.insert(accountOtaDetailTable).values({
        accountId: user.id,
        address,
        criteria,
        funds,
        job,
        linkage,
        maxCapacity,
        maxSemester,
        startDate: new Date(startDate),
        name,
        transferDate,
      });

      await tx
        .update(accountTable)
        .set({ applicationStatus: "pending" })
        .where(eq(accountTable.id, user.id));
    });

    const accessToken = await sign(
      {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        type: user.type,
        provider: user.provider,
        status: user.status,
        applicationStatus: "pending",
        oid: user.oid,
        createdAt: user.createdAt,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      },
      env.JWT_SECRET,
    );

    setCookie(c, "ota-ku.access-cookie", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
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

profileProtectedRouter.openapi(editProfileOrangTuaRoute, async (c) => {
  const user = c.var.user;
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());
  const zodParseResult = OrangTuaRegistrationSchema.parse(data);

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
  } = zodParseResult;

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
    await db
      .update(accountOtaDetailTable)
      .set({
        address,
        criteria,
        funds,
        job,
        linkage,
        maxCapacity,
        maxSemester,
        name,
        transferDate,
      })
      .where(eq(accountOtaDetailTable.accountId, user.id));

    return c.json(
      {
        success: true,
        message: "Profil OTA berhasil diperbarui.",
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

profileProtectedRouter.openapi(editProfileMahasiswaRoute, async (c) => {
  const user = c.var.user;
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());

  const zodParseResult = MahasiswaRegistrationFormSchema.parse(data);
  const {
    name,
    nim,
    description,
    file,
    phoneNumber,
    cityOfOrigin,
    ditmawaRecommendationLetter,
    electricityBill,
    faculty,
    highschoolAlumni,
    kk,
    ktm,
    major,
    pbb,
    salaryReport,
    transcript,
    waliRecommendationLetter,
  } = zodParseResult;

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
    const [
      fileResult,
      kkResult,
      ktmResult,
      waliRecommendationLetterResult,
      transcriptResult,
      salaryReportResult,
      pbbResult,
      electricityBillResult,
      ditmawaRecommendationLetterResult,
    ] = await Promise.all([
      uploadPdfToCloudinary(file),
      uploadPdfToCloudinary(kk),
      uploadPdfToCloudinary(ktm),
      uploadPdfToCloudinary(waliRecommendationLetter),
      uploadPdfToCloudinary(transcript),
      uploadPdfToCloudinary(salaryReport),
      uploadPdfToCloudinary(pbb),
      uploadPdfToCloudinary(electricityBill),
      uploadPdfToCloudinary(ditmawaRecommendationLetter),
    ]);

    await db.transaction(async (tx) => {
      await tx
        .update(accountTable)
        .set({ phoneNumber })
        .where(eq(accountTable.id, user.id));

      await tx
        .update(accountMahasiswaDetailTable)
        .set({
          name,
          nim,
          description,
          major,
          faculty,
          cityOfOrigin,
          highschoolAlumni,
          file: fileResult.secure_url,
          kk: kkResult.secure_url,
          ktm: ktmResult.secure_url,
          waliRecommendationLetter: waliRecommendationLetterResult.secure_url,
          transcript: transcriptResult.secure_url,
          salaryReport: salaryReportResult.secure_url,
          pbb: pbbResult.secure_url,
          electricityBill: electricityBillResult.secure_url,
          ditmawaRecommendationLetter:
            ditmawaRecommendationLetterResult.secure_url,
        })
        .where(eq(accountMahasiswaDetailTable.accountId, user.id));
    });

    return c.json(
      {
        success: true,
        message: "Berhasil edit profile MA.",
        body: {
          name,
          nim,
          description,
          major,
          faculty,
          cityOfOrigin,
          highschoolAlumni,
          file: fileResult.secure_url,
          kk: kkResult.secure_url,
          ktm: ktmResult.secure_url,
          waliRecommendationLetter: waliRecommendationLetterResult.secure_url,
          transcript: transcriptResult.secure_url,
          salaryReport: salaryReportResult.secure_url,
          pbb: pbbResult.secure_url,
          electricityBill: electricityBillResult.secure_url,
          ditmawaRecommendationLetter:
            ditmawaRecommendationLetterResult.secure_url,
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

profileProtectedRouter.openapi(profileOrangTuaRoute, async (c) => {
  const user = c.var.user;

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
    const profileDataOTA = await db
      .select({
        email: accountTable.email,
        phone_number: accountTable.phoneNumber,
        name: accountOtaDetailTable.name,
        join_date: accountOtaDetailTable.startDate,
      })
      .from(accountTable)
      .innerJoin(
        accountOtaDetailTable,
        eq(accountOtaDetailTable.accountId, accountTable.id),
      )
      .where(eq(accountTable.id, user.id))
      .limit(1);

    // if (profileDataOTA.length === 0) {
    //   return c.json(
    //     {
    //       success: false,
    //       message: "Profil tidak ditemukan.",
    //       error: {},
    //     },
    //     404
    //   );
    // }

    const formattedProfile = {
      email: profileDataOTA[0].email,
      phone_number: profileDataOTA[0].phone_number ?? "",
      name: profileDataOTA[0].name,
      join_date: new Date(profileDataOTA[0].join_date).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      }),
    };

    return c.json(
      {
        success: true,
        message: "Berhasil mengakses profil OTA",
        body: formattedProfile,
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

profileProtectedRouter.openapi(profileMahasiswaRoute, async (c) => {
  const user = c.var.user;

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

  //TO-DO: add join_date to db
  try {
    const profileDataMahasiswa = await db
      .select({
        email: accountTable.email,
        phone_number: accountTable.phoneNumber,
        name: accountMahasiswaDetailTable.name,
        // join_date: accountMahasiswaDetailTable.startDate,
      })
      .from(accountTable)
      .innerJoin(
        accountMahasiswaDetailTable,
        eq(accountMahasiswaDetailTable.accountId, accountTable.id),
      )
      .where(eq(accountTable.id, user.id))
      .limit(1);

    // if (profileDataOTA.length === 0) {
    //   return c.json(
    //     {
    //       success: false,
    //       message: "Profil tidak ditemukan.",
    //       error: {},
    //     },
    //     404
    //   );
    // }

    const formattedProfile = {
      email: profileDataMahasiswa[0].email,
      phone_number: profileDataMahasiswa[0].phone_number ?? "",
      name: profileDataMahasiswa[0].name!,
      // join_date: new Date(profileDataMahasiswa[0].join_date).toLocaleString("en-US", {
      //   month: "long",
      //   year: "numeric",
      // }),
    };

    return c.json(
      {
        success: true,
        message: "Berhasil mengakses profil MA",
        body: formattedProfile,
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
