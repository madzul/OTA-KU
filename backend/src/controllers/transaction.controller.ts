import { eq, sql, count, and, or, ilike } from "drizzle-orm";

import { db } from "../db/drizzle.js";
import { createAuthRouter } from "./router-factory.js";
import { detailTransactionRoute, listTransactionAdminRoute, listTransactionOTARoute, uploadReceiptRoute, verifyTransactionAccRoute, verifyTransactionRejectRoute } from "../routes/transaction.route.js";
import { DetailTransactionParams, TransactionListAdminQuerySchema, TransactionListOTAQuerySchema, UploadReceiptSchema, VerifyTransactionAcceptSchema, VerifyTransactionRejectSchema } from "../zod/transaction.js";
import { accountMahasiswaDetailTable, accountOtaDetailTable, accountTable, transactionTable } from "../db/schema.js";

export const transactionProtectedRouter = createAuthRouter();

const LIST_PAGE_SIZE = 6;

transactionProtectedRouter.openapi(listTransactionOTARoute, async (c) => {
    const user = c.var.user;
    const zodParseResult = TransactionListOTAQuerySchema.parse(c.req.query());
    const { q, status, page } = zodParseResult

    // Validate page to be a positive integer
    let pageNumber = Number(page);
    if (isNaN(pageNumber) || pageNumber < 1) {
        pageNumber = 1;
    }

    try{
        const offset = (pageNumber - 1) * LIST_PAGE_SIZE;

        const conditions = [
            eq(transactionTable.otaId, user.id),
            or(
                ilike(accountMahasiswaDetailTable.name, `%${q || ""}%`),
                ilike(accountMahasiswaDetailTable.nim, `%${q || ""}%`)
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
            eq(transactionTable.mahasiswaId, accountMahasiswaDetailTable.accountId)
        )
        .where(and(...conditions));
        
        const transactionOTAListQuery = db
        .select({
            mahasiswa_name: accountMahasiswaDetailTable.name,
            mahasiswa_nim: accountMahasiswaDetailTable.nim,
            bill: transactionTable.bill,
            amount_paid: transactionTable.amountPaid,
            due_date: transactionTable.dueDate,
            status: transactionTable.transactionStatus,
            receipt: transactionTable.transactionReceipt
        })
        .from(transactionTable)
        .innerJoin(
            accountMahasiswaDetailTable,
            eq(transactionTable.mahasiswaId, accountMahasiswaDetailTable.accountId)
        )
        .where(and(...conditions))
        .limit(LIST_PAGE_SIZE)
        .offset(offset);

        const [transactionOTAList, counts] = await Promise.all([
            transactionOTAListQuery,
            countsQuery,
        ]);

        return c.json({
            success: true,
            message: "Daftar transaction untuk OTA berhasil diambil",
            body:{
                data: transactionOTAList.map((transaction) => ({
                    name: transaction.mahasiswa_name ?? "",
                    nim: transaction.mahasiswa_nim,
                    bill: transaction.bill,
                    amount_paid: transaction.amount_paid,
                    due_date: transaction.due_date,
                    status: transaction.status,
                    receipt: transaction.receipt ?? ""
                })),
                totalData: counts[0].count,
            },
        },
        200,
      )
    } catch (error) {
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

transactionProtectedRouter.openapi(listTransactionAdminRoute, async (c) => {
    const user = c.var.user;
    const zodParseResult = TransactionListAdminQuerySchema.parse(c.req.query());
    const { month, status, year, page } = zodParseResult

    // Validate page to be a positive integer
    let pageNumber = Number(page);
    if (isNaN(pageNumber) || pageNumber < 1) {
        pageNumber = 1;
    }

    try{
        const offset = (pageNumber - 1) * LIST_PAGE_SIZE;

        const conditions = [];
        
        if (status) {
            conditions.push(eq(transactionTable.transactionStatus, status));
        }

        if (month) {
            conditions.push(
                sql`TRIM(TO_CHAR(${transactionTable.dueDate}, 'Month')) ILIKE ${month}`
            );
        }
          
        if (year) {
            conditions.push(
                sql`EXTRACT(YEAR FROM ${transactionTable.dueDate}) = ${year}`
            );
        }
        
        const countsQuery = db
        .select({ count: count() })
        .from(transactionTable)
        .where(and(...conditions));
        
        const transactionAdminListQuery = db
        .select({
            mahasiswa_name: accountMahasiswaDetailTable.name,
            mahasiswa_nim: accountMahasiswaDetailTable.nim,
            ota_name: accountOtaDetailTable.name,
            ota_number: accountTable.phoneNumber,
            bill: transactionTable.bill,
            amount_paid: transactionTable.amountPaid,
            due_date: transactionTable.dueDate,
            status: transactionTable.transactionStatus,
            receipt: transactionTable.transactionReceipt
        })
        .from(transactionTable)
        .innerJoin(
            accountMahasiswaDetailTable,
            eq(transactionTable.mahasiswaId, accountMahasiswaDetailTable.accountId)
        )
        .innerJoin(
            accountOtaDetailTable,
            eq(transactionTable.otaId, accountOtaDetailTable.accountId)
        )
        .innerJoin(
            accountTable,
            eq(transactionTable.otaId, accountTable.id)
        )
        .where(and(...conditions))
        .limit(LIST_PAGE_SIZE)
        .offset(offset);

        const [transactionAdminList, counts] = await Promise.all([
            transactionAdminListQuery,
            countsQuery,
        ]);

        return c.json({
            success: true,
            message: "Daftar transaction untuk Admin berhasil diambil",
            body:{
                data: transactionAdminList.map((transaction) => ({
                    name_ma: transaction.mahasiswa_name ?? "",
                    nim_ma: transaction.mahasiswa_nim,
                    name_ota: transaction.ota_name,
                    number_ota: transaction.ota_number ?? "",
                    bill: transaction.bill,
                    amount_paid: transaction.amount_paid,
                    due_date: transaction.due_date,
                    status: transaction.status,
                    receipt: transaction.receipt ?? ""
                })),
                totalData: counts[0].count,
            },
        },
        200,
      )
    } catch (error) {
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

transactionProtectedRouter.openapi(detailTransactionRoute, async(c) => {
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
            404
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

        const [detailTransaction, counts] = await Promise.all([detailTransactionQuery, countQuery]);
    
        return c.json({
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
      } catch (err) {
        console.error("Error fetching detail transaction:", err);
        return c.json(
          {
            success: false,
            message: "Internal server error",
            error: {},
          },
          500
        );
    }
})

transactionProtectedRouter.openapi(uploadReceiptRoute, async(c) => {
    const user = c.var.user;
    const zodParseResult = UploadReceiptSchema.parse(c.req.query());
    const { mahasiswaId, receipt } = zodParseResult

    try{
        await db.transaction(async (tx) => {
            await tx
              .update(transactionTable)
              .set(
                {
                  transactionReceipt: receipt, 
                  transactionStatus: "pending"
                }
              )
              .where(
                and(
                  eq(transactionTable.mahasiswaId, mahasiswaId),
                  eq(transactionTable.otaId, user.id)
                )
            )
        }); 

        return c.json(
          {
            success: true,
            message: "Berhasil melakukan upload bukti pembayaran dari OTA.",
            body: {
              bukti_bayar: receipt
            }
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
})

transactionProtectedRouter.openapi(verifyTransactionAccRoute, async(c) => {
    const zodParseResult = VerifyTransactionAcceptSchema.parse(c.req.query());
    const { otaId, mahasiswaId } = zodParseResult

    try{
        const result = await db.transaction(async(tx) => {
            await tx
              .update(transactionTable)
                .set(
                    { 
                        transactionStatus: "paid",
                        transactionReceipt: null
                    }
                )
                .where(
                    and(
                        eq(transactionTable.mahasiswaId, mahasiswaId),
                        eq(transactionTable.otaId, otaId)
                    )
                )

            // Get the updated bill (amount paid)
            const billRow = await tx
              .select({ bill: transactionTable.bill })
              .from(transactionTable)
              .where(
                  and(
                      eq(transactionTable.mahasiswaId, mahasiswaId),
                      eq(transactionTable.otaId, otaId)
                  )
              )
              .limit(1);

            return billRow[0]?.bill ?? 0; // fallback to 0 if not found
        });

        return c.json(
            {
              success: true,
              message: "Berhasil melakukan upload bukti pembayaran dari OTA.",
              body: {
                mahasiswaId: mahasiswaId,
                otaId: otaId,
                amountPaid: result
              },
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
})

transactionProtectedRouter.openapi(verifyTransactionRejectRoute, async(c) => {
    const zodParseResult = VerifyTransactionRejectSchema.parse(c.req.query());
    const { otaId, mahasiswaId, amountPaid } = zodParseResult

    try{
        await db.transaction(async(tx) => {
            await tx
              .update(transactionTable)
                .set(
                    { 
                        transactionStatus: "paid",
                        transactionReceipt: null
                    }
                )
                .where(
                    and(
                        eq(transactionTable.mahasiswaId, mahasiswaId),
                        eq(transactionTable.otaId, otaId)
                    )
                )
        });

        return c.json(
            {
              success: true,
              message: "Berhasil melakukan upload bukti pembayaran dari OTA.",
              body: {
                mahasiswaId: mahasiswaId,
                otaId: otaId,
                amountPaid: amountPaid
              },
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
})