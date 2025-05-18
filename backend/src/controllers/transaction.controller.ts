import { and, count, eq, gte, ilike, lte, or, sql } from "drizzle-orm";

import { db } from "../db/drizzle.js";
import {
  accountMahasiswaDetailTable,
  accountOtaDetailTable,
  accountTable,
  connectionTable,
  transactionTable,
} from "../db/schema.js";
import { uploadPdfToCloudinary } from "../lib/file-upload.js";
import {
  acceptTransferStatusRoute,
  detailTransactionRoute,
  listTransactionAdminRoute,
  listTransactionOTARoute,
  uploadReceiptRoute,
  verifyTransactionAccRoute,
  verifyTransactionRejectRoute,
} from "../routes/transaction.route.js";
import {
  AcceptTransferStatusSchema,
  DetailTransactionParams,
  TransactionListAdminQuerySchema,
  TransactionListOTAQuerySchema,
  UploadReceiptSchema,
  VerifyTransactionAcceptSchema,
  VerifyTransactionRejectSchema,
} from "../zod/transaction.js";
import { createAuthRouter } from "./router-factory.js";

export const transactionProtectedRouter = createAuthRouter();

const LIST_PAGE_SIZE = 6;

transactionProtectedRouter.openapi(listTransactionOTARoute, async (c) => {
  const user = c.var.user;
  const zodParseResult = TransactionListOTAQuerySchema.parse(c.req.query());
  const { q, status, page } = zodParseResult;

  // Validate page to be a positive integer
  let pageNumber = Number(page);
  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  try {
    const offset = (pageNumber - 1) * LIST_PAGE_SIZE;

    const conditions = [
      eq(transactionTable.otaId, user.id),
      or(
        ilike(accountMahasiswaDetailTable.name, `%${q || ""}%`),
        ilike(accountMahasiswaDetailTable.nim, `%${q || ""}%`),
      ),
    ];

    if (status) {
      conditions.push(eq(transactionTable.transactionStatus, status));
    }

    const countsQuery = db
      .select({ count: count() })
      .from(transactionTable)
      .innerJoin(
        accountMahasiswaDetailTable,
        eq(transactionTable.mahasiswaId, accountMahasiswaDetailTable.accountId),
      )
      .where(and(...conditions));

    const transactionOTAListQuery = db
      .select({
        id: transactionTable.id,
        mahasiswa_id: transactionTable.mahasiswaId,
        mahasiswa_name: accountMahasiswaDetailTable.name,
        mahasiswa_nim: accountMahasiswaDetailTable.nim,
        bill: transactionTable.bill,
        amount_paid: transactionTable.amountPaid,
        paid_at: transactionTable.paidAt,
        created_at: transactionTable.createdAt,
        due_date: transactionTable.dueDate,
        status: transactionTable.transactionStatus,
        receipt: transactionTable.transactionReceipt,
        rejection_note: transactionTable.rejectionNote,
      })
      .from(transactionTable)
      .innerJoin(
        accountMahasiswaDetailTable,
        eq(transactionTable.mahasiswaId, accountMahasiswaDetailTable.accountId),
      )
      .where(and(...conditions))
      .limit(LIST_PAGE_SIZE)
      .offset(offset);

    const [transactionOTAList, counts] = await Promise.all([
      transactionOTAListQuery,
      countsQuery,
    ]);

    return c.json(
      {
        success: true,
        message: "Daftar transaction untuk OTA berhasil diambil",
        body: {
          data: transactionOTAList.map((transaction) => ({
            id: transaction.mahasiswa_id,
            mahasiswa_id: transaction.mahasiswa_id,
            name: transaction.mahasiswa_name ?? "",
            nim: transaction.mahasiswa_nim,
            bill: transaction.bill,
            amount_paid: transaction.amount_paid,
            paid_at: transaction.paid_at ?? "",
            created_at: transaction.created_at,
            due_date: transaction.due_date,
            status: transaction.status,
            receipt: transaction.receipt ?? "",
            rejection_note: transaction.rejection_note ?? "",
          })),
          totalData: counts[0].count,
        },
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching mahasiswa list:", error);
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

transactionProtectedRouter.openapi(listTransactionAdminRoute, async (c) => {
  const zodParseResult = TransactionListAdminQuerySchema.parse(c.req.query());
  const { month, status, year, page } = zodParseResult;

  // Validate page to be a positive integer
  let pageNumber = Number(page);
  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  try {
    const offset = (pageNumber - 1) * LIST_PAGE_SIZE;

    const conditions = [];

    if (status) {
      conditions.push(eq(transactionTable.transactionStatus, status));
    }

    if (month) {
      conditions.push(
        sql`TRIM(TO_CHAR(${transactionTable.dueDate}, 'Month')) ILIKE ${month}`,
      );
    }

    if (year) {
      conditions.push(
        sql`EXTRACT(YEAR FROM ${transactionTable.dueDate}) = ${year}`,
      );
    }

    const countsQuery = db
      .select({ count: count() })
      .from(transactionTable)
      .where(and(...conditions));

    const transactionAdminListQuery = db
      .select({
        id: transactionTable.id,
        mahasiswa_id: transactionTable.mahasiswaId,
        ota_id: transactionTable.otaId,
        mahasiswa_name: accountMahasiswaDetailTable.name,
        mahasiswa_nim: accountMahasiswaDetailTable.nim,
        ota_name: accountOtaDetailTable.name,
        ota_number: accountTable.phoneNumber,
        bill: transactionTable.bill,
        amount_paid: transactionTable.amountPaid,
        paid_at: transactionTable.paidAt,
        due_date: transactionTable.dueDate,
        status: transactionTable.transactionStatus,
        transferStatus: transactionTable.transferStatus,
        receipt: transactionTable.transactionReceipt,
        createdAt: transactionTable.createdAt,
      })
      .from(transactionTable)
      .innerJoin(
        accountMahasiswaDetailTable,
        eq(transactionTable.mahasiswaId, accountMahasiswaDetailTable.accountId),
      )
      .innerJoin(
        accountOtaDetailTable,
        eq(transactionTable.otaId, accountOtaDetailTable.accountId),
      )
      .innerJoin(accountTable, eq(transactionTable.otaId, accountTable.id))
      .where(and(...conditions))
      .limit(LIST_PAGE_SIZE)
      .offset(offset);

    const [transactionAdminList, counts] = await Promise.all([
      transactionAdminListQuery,
      countsQuery,
    ]);

    return c.json(
      {
        success: true,
        message: "Daftar transaction untuk Admin berhasil diambil",
        body: {
          data: transactionAdminList.map((transaction) => ({
            id: transaction.id,
            mahasiswa_id: transaction.mahasiswa_id,
            ota_id: transaction.ota_id,
            name_ma: transaction.mahasiswa_name ?? "",
            nim_ma: transaction.mahasiswa_nim,
            name_ota: transaction.ota_name,
            number_ota: transaction.ota_number ?? "",
            bill: transaction.bill,
            amount_paid: transaction.amount_paid,
            paid_at: transaction.paid_at ?? "",
            due_date: transaction.due_date,
            status: transaction.status,
            transferStatus: transaction.transferStatus,
            receipt: transaction.receipt ?? "",
            createdAt: transaction.createdAt,
          })),
          totalData: counts[0].count,
        },
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching mahasiswa list:", error);
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

transactionProtectedRouter.openapi(detailTransactionRoute, async (c) => {
  const { id, page } = DetailTransactionParams.parse(c.req.param());

  // Validate page to be a positive integer
  let pageNumber = Number(page);
  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }

  try {
    const offset = (pageNumber - 1) * LIST_PAGE_SIZE;

    const mahasiswa = await db
      .select({
        nama_ma: accountMahasiswaDetailTable.name,
        nim_ma: accountMahasiswaDetailTable.nim,
        fakultas: accountMahasiswaDetailTable.faculty,
        jurusan: accountMahasiswaDetailTable.major,
      })
      .from(accountMahasiswaDetailTable)
      .where(eq(accountMahasiswaDetailTable.accountId, id))
      .limit(1);

    if (mahasiswa.length === 0) {
      return c.json(
        {
          success: false,
          message: "Mahasiswa tidak ditemukan",
          error: {},
        },
        404,
      );
    }

    const countQuery = db
      .select({ count: count() })
      .from(transactionTable)
      .where(eq(transactionTable.mahasiswaId, id));

    const detailTransactionQuery = await db
      .select({
        tagihan: transactionTable.bill,
        pembayaran: transactionTable.amountPaid,
        due_date: transactionTable.dueDate,
        status_bayar: transactionTable.transactionStatus,
        bukti_bayar: transactionTable.transactionReceipt,
      })
      .from(transactionTable)
      .where(eq(transactionTable.mahasiswaId, id))
      .limit(LIST_PAGE_SIZE)
      .offset(offset);

    const [detailTransaction, counts] = await Promise.all([
      detailTransactionQuery,
      countQuery,
    ]);

    return c.json(
      {
        success: true,
        message: "Detail transaction berhasil diambil",
        body: {
          nama_ma: mahasiswa[0].nama_ma ?? "Nama tidak tersedia",
          nim_ma: mahasiswa[0].nim_ma,
          fakultas: mahasiswa[0].fakultas ?? "Fakultas tidak tersedia",
          jurusan: mahasiswa[0].jurusan ?? "Jurusan tidak tersedia",
          data: detailTransaction.map((tx) => ({
            ...tx,
            bukti_bayar: tx.bukti_bayar ?? "",
          })),
          totalData: counts[0].count,
        },
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching detail transaction:", error);
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

transactionProtectedRouter.openapi(uploadReceiptRoute, async (c) => {
  const user = c.var.user;

  // Get the form data
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());

  // Parse using the UploadReceiptSchema
  const zodParseResult = UploadReceiptSchema.parse(data);
  const { id, paidFor, receipt } = zodParseResult;

  try {
    const receiptUrl = await uploadPdfToCloudinary(receipt);

    await db.transaction(async (tx) => {
      await tx
        .update(transactionTable)
        .set({
          transactionReceipt: receiptUrl.secure_url,
          transactionStatus: "pending",
        })
        .where(eq(transactionTable.id, id));

      await tx
        .update(connectionTable)
        .set({ paidFor })
        .where(
          and(
            eq(connectionTable.mahasiswaId, id),
            eq(connectionTable.otaId, user.id)
          )
        );
    });

    return c.json(
      {
        success: true,
        message: "Berhasil melakukan upload bukti pembayaran dari OTA.",
        body: {
          bukti_bayar: receiptUrl.secure_url,
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

transactionProtectedRouter.openapi(verifyTransactionAccRoute, async (c) => {
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());
  const zodParseResult = VerifyTransactionAcceptSchema.parse(data);
  const { id, mahasiswaId, otaId } = zodParseResult;

  try {
    const result = await db.transaction(async (tx) => {
      // Get the updated bill (amount paid)
      const billRow = await tx
        .select({ bill: transactionTable.bill })
        .from(transactionTable)
        .where(eq(transactionTable.id, id))
        .limit(1);

      await tx
        .update(transactionTable)
        .set({
          transactionStatus: "paid",
          transactionReceipt: "",
          amountPaid: billRow[0]?.bill ?? 0,
        })
        .where(eq(transactionTable.id, id));

      await tx
        .update(connectionTable)
        .set({ paidFor: sql`${connectionTable.paidFor} - 1` })
        .where(
          and(
            eq(connectionTable.mahasiswaId, mahasiswaId),
            eq(connectionTable.otaId, otaId),
          ),
        );

      return billRow[0]?.bill ?? 0;
    });

    return c.json(
      {
        success: true,
        message: "Berhasil melakukan penerimaan verifikasi pembayaran",
        body: {
          id: id,
          mahasiswaId: mahasiswaId,
          otaId: otaId,
          amountPaid: result,
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

transactionProtectedRouter.openapi(verifyTransactionRejectRoute, async (c) => {
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());
  const zodParseResult = VerifyTransactionRejectSchema.parse(data);
  const { id, otaId, mahasiswaId, amountPaid, rejectionNote } = zodParseResult;

  try {
    await db.transaction(async (tx) => {
      const existingTransaction = await tx
        .select({
          amountPaid: transactionTable.amountPaid,
        })
        .from(transactionTable)
        .where(eq(transactionTable.id, id))
        .limit(1);

      const currentAmountPaid = existingTransaction[0]?.amountPaid ?? 0;
      const newAmountPaid = currentAmountPaid + amountPaid;

      await tx
        .update(transactionTable)
        .set({
          transactionStatus: "unpaid",
          transactionReceipt: "",
          rejectionNote: rejectionNote,
          amountPaid: newAmountPaid,
        })
        .where(eq(transactionTable.id, id));

      await tx
        .update(connectionTable)
        .set({ paidFor: 0 })
        .where(
          and(
            eq(connectionTable.mahasiswaId, mahasiswaId),
            eq(connectionTable.otaId, otaId),
          ),
        );
    });

    return c.json(
      {
        success: true,
        message: "Berhasil melakukan penolakan verifikasi pembayaran",
        body: {
          id: id,
          mahasiswaId: mahasiswaId,
          otaId: otaId,
          rejectionNote: rejectionNote,
          amountPaid: amountPaid,
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

transactionProtectedRouter.openapi(acceptTransferStatusRoute, async (c) => {
  const body = await c.req.formData();
  const data = Object.fromEntries(body.entries());
  const zodParseResult = AcceptTransferStatusSchema.parse(data);
  const { id } = zodParseResult;

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(transactionTable)
        .set({ transferStatus: "paid" })
        .where(eq(transactionTable.id, id));
    });

    return c.json(
      {
        success: true,
        message: "Berhasil melakukan penerimaan transfer status",
        body: {
          id: id,
          status: "paid" as const,
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
