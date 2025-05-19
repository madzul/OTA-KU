import { TZDate } from "@date-fns/tz";
import { CronJob } from "cron";
import { addDays, startOfDay } from "date-fns";
import { and, eq, gte, lt } from "drizzle-orm";
import nodemailer from "nodemailer";

import { env } from "../config/env.config.js";
import { db } from "../db/drizzle.js";
import {
  accountTable,
  connectionTable,
  transactionTable,
} from "../db/schema.js";
import { deadlineTransaksiEmail } from "../lib/email/deadline-transaksi.js";

// Runs daily at midnight (00:00) Jakarta time - 7 days before due date reminder
export const dailyReminder7DaysCron = new CronJob(
  "0 0 * * *",
  async () => {
    // Get current time in Jakarta timezone
    const now = new TZDate(new Date(), "Asia/Jakarta");

    // Get 7 days from now, then normalize to start of day
    const targetDate = addDays(now, 7);
    const target = new TZDate(startOfDay(targetDate), "Asia/Jakarta");

    // Get start of next day (exclusive upper bound)
    const targetEnd = new TZDate(addDays(target, 1), "Asia/Jakarta");

    console.log(
      "Transaction cron job running for dueDate between",
      target.toISOString(),
      "and",
      targetEnd.toISOString(),
    );

    await db.transaction(async (tx) => {
      const dueTransactions = await tx
        .select({
          email: accountTable.email,
          bill: transactionTable.bill,
          dueDate: transactionTable.dueDate,
        })
        .from(transactionTable)
        .innerJoin(
          connectionTable,
          eq(transactionTable.otaId, connectionTable.otaId),
        )
        .innerJoin(accountTable, eq(transactionTable.otaId, accountTable.id))
        .where(
          and(
            gte(transactionTable.dueDate, target),
            lt(transactionTable.dueDate, targetEnd),
            eq(connectionTable.paidFor, 0),
          ),
        );

      console.log("Transactions due in 7 days:", dueTransactions.length);

      if (dueTransactions.length > 0) {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          secure: true,
          port: 465,
          auth: {
            user: env.EMAIL,
            pass: env.EMAIL_PASSWORD,
          },
        });

        try {
          await transporter.verify();
          console.log("SMTP Server is ready");
        } catch (error) {
          console.error("SMTP Server verification failed:", error);
          return;
        }

        await Promise.all(
          dueTransactions.map(async (transaction) => {
            try {
              await transporter.sendMail({
                from: env.EMAIL_FROM,
                to:
                  env.NODE_ENV !== "production"
                    ? env.TEST_EMAIL
                    : transaction.email,
                subject: "Pengingat Pembayaran Bantuan Orang Tua Asuh",
                html: deadlineTransaksiEmail(
                  transaction.bill,
                  transaction.dueDate.toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }),
                  7,
                  env.VITE_PUBLIC_URL + "/status-transaksi",
                ),
              });
              console.log(`Email sent to ${transaction.email}`);
            } catch (error) {
              console.error(
                `Error sending email to ${transaction.email}:`,
                error,
              );
            }
          }),
        );
      }
    });
  },
  null,
  true,
  "Asia/Jakarta",
);

// Runs daily at midnight (00:00) Jakarta time - 1 day before due date reminder
export const dailyReminderCron = new CronJob(
  "0 0 * * *",
  async () => {
    // Get current time in Jakarta timezone
    const now = new TZDate(new Date(), "Asia/Jakarta");

    // Get 1 day from now (tomorrow), then normalize to start of day
    const targetDate = addDays(now, 1);
    const target = new TZDate(startOfDay(targetDate), "Asia/Jakarta");

    // Get start of next day (exclusive upper bound)
    const targetEnd = new TZDate(addDays(target, 1), "Asia/Jakarta");

    console.log(
      "Final reminder cron job running for dueDate between",
      target.toISOString(),
      "and",
      targetEnd.toISOString(),
    );

    await db.transaction(async (tx) => {
      const dueTransactions = await tx
        .select({
          email: accountTable.email,
          bill: transactionTable.bill,
          dueDate: transactionTable.dueDate,
        })
        .from(transactionTable)
        .innerJoin(
          connectionTable,
          eq(transactionTable.otaId, connectionTable.otaId),
        )
        .innerJoin(accountTable, eq(transactionTable.otaId, accountTable.id))
        .where(
          and(
            gte(transactionTable.dueDate, target),
            lt(transactionTable.dueDate, targetEnd),
            eq(connectionTable.paidFor, 0),
          ),
        );

      console.log("Transactions due tomorrow:", dueTransactions.length);

      if (dueTransactions.length > 0) {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          secure: true,
          port: 465,
          auth: {
            user: env.EMAIL,
            pass: env.EMAIL_PASSWORD,
          },
        });

        try {
          await transporter.verify();
          console.log("SMTP Server is ready");
        } catch (error) {
          console.error("SMTP Server verification failed:", error);
          return;
        }

        // Send final reminder emails
        await Promise.all(
          dueTransactions.map(async (transaction) => {
            try {
              await transporter.sendMail({
                from: env.EMAIL_FROM,
                to:
                  env.NODE_ENV !== "production"
                    ? env.TEST_EMAIL
                    : transaction.email,
                subject: "Pengingat Pembayaran Bantuan Orang Tua Asuh",
                html: deadlineTransaksiEmail(
                  transaction.bill,
                  transaction.dueDate.toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }),
                  1, // 1 day remaining
                  env.VITE_PUBLIC_URL + "/status-transaksi",
                ),
              });
              console.log(`Final reminder email sent to ${transaction.email}`);
            } catch (error) {
              console.error(
                `Error sending final reminder email to ${transaction.email}:`,
                error,
              );
            }
          }),
        );
      }
    });
  },
  null,
  true,
  "Asia/Jakarta",
);
