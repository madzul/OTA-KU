import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";

import { env } from "../config/env.config.js";
import { db } from "../db/drizzle.js";
import { accountTable, otpTable } from "../db/schema.js";
import { emailHTML } from "../lib/email-html.js";
import { generateOTP } from "../lib/otp.js";
import { sendOtpRoute } from "../routes/otp.route.js";
import { SendOtpRequestSchema } from "../zod/otp.js";
import { createAuthRouter, createRouter } from "./router-factory.js";

export const otpRouter = createRouter();
export const otpProtectedRouter = createAuthRouter();

otpProtectedRouter.openapi(sendOtpRoute, async (c) => {
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());

  const zodParseResult = SendOtpRequestSchema.parse(data);
  const { email } = zodParseResult;

  try {
    const user = await db
      .select()
      .from(accountTable)
      .innerJoin(otpTable, eq(otpTable.accountId, accountTable.id))
      .where(eq(accountTable.email, email));

    if (!user.length) {
      return c.json(
        {
          success: false,
          message: "User not found",
          error: {},
        },
        404,
      );
    }

    const code = generateOTP();
    await db
      .update(otpTable)
      .set({ code, expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24) })
      .where(eq(otpTable.accountId, user[0].account.id));

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
        user: env.EMAIL,
        pass: env.EMAIL_PASSWORD,
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP Server verification failed:", error);
      } else {
        console.log("SMTP Server is ready:", success);
      }
    });

    await transporter
      .sendMail({
        from: env.EMAIL_FROM,
        to: email,
        subject: "Token OTP Bantuan Orang Tua Asuh",
        html: emailHTML(code),
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });

    return c.json(
      {
        success: true,
        message: "OTP sent successfully",
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
