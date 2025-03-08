import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", [
  "mahasiswa",
  "ota",
  "admin",
]);

export const linkageEnum = pgEnum("linkage", [
  "otm",
  "dosen",
  "alumni",
  "lainnya",
  "none",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "verified",
  "unverified",
]);

export const mahasiswaStatusEnum = pgEnum("mahasiswa_status", [
  "active",
  "inactive",
]);

export const accountTable = pgTable("account", {
  id: uuid("id").defaultRandom().primaryKey().unique().notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  password: varchar({ length: 255 }).notNull(),
  type: accountTypeEnum("type").notNull(),
});

export const accountMahasiswaDetailTable = pgTable("account_mahasiswa_detail", {
  accountId: uuid("account_id")
    .primaryKey()
    .notNull()
    .references(() => accountTable.id, {
      onDelete: "cascade",
    }),
  name: varchar({ length: 255 }).notNull(),
  phoneNumber: varchar({ length: 32 }).unique().notNull(),
  nim: varchar({ length: 8 }).unique().notNull(),
  status: verificationStatusEnum("status").notNull().default("unverified"),
  mahasiswaStatus: mahasiswaStatusEnum("mahasiswa_status")
    .notNull()
    .default("inactive"),
});

export const accountOtaDetailTable = pgTable("account_ota_detail", {
  accountId: uuid("account_id")
    .primaryKey()
    .notNull()
    .references(() => accountTable.id, {
      onDelete: "cascade",
    }),
  name: varchar({ length: 255 }).notNull(),
  phoneNumber: varchar({ length: 32 }).unique().notNull(),
  job: varchar({ length: 255 }).notNull(),
  address: varchar({ length: 255 }).notNull(),
  linkage: linkageEnum("linkage").notNull(),
  funds: integer("funds").notNull(),
  maxCapacity: integer("max_capacity").notNull(),
  startDate: timestamp("start_date").notNull(),
  maxSemester: integer("max_semester").notNull(),
  transferDate: integer("transfer_date").notNull(),
  criteria: text("criteria").notNull(),
  status: verificationStatusEnum("status").notNull().default("unverified"),
});

export const connectionTable = pgTable(
  "connection",
  {
    mahasiswaId: uuid("mahasiswa_id")
      .notNull()
      .references(() => accountMahasiswaDetailTable.accountId, {
        onDelete: "cascade",
      }),
    otaId: uuid("ota_id")
      .notNull()
      .references(() => accountOtaDetailTable.accountId, {
        onDelete: "cascade",
      }),
  },
  (table) => [primaryKey({ columns: [table.mahasiswaId, table.otaId] })],
);

export const accountRelations = relations(accountTable, ({ one }) => ({
  accountMahasiswaDetail: one(accountMahasiswaDetailTable, {
    fields: [accountTable.id],
    references: [accountMahasiswaDetailTable.accountId],
  }),
  accountOtaDetail: one(accountOtaDetailTable, {
    fields: [accountTable.id],
    references: [accountOtaDetailTable.accountId],
  }),
}));

export const accountMahasiswaDetailRelations = relations(
  accountMahasiswaDetailTable,
  ({ one }) => ({
    account: one(accountTable, {
      fields: [accountMahasiswaDetailTable.accountId],
      references: [accountTable.id],
    }),
    connection: one(connectionTable, {
      fields: [accountMahasiswaDetailTable.accountId],
      references: [connectionTable.mahasiswaId],
    }),
  }),
);

export const accountOtaDetailRelations = relations(
  accountOtaDetailTable,
  ({ one }) => ({
    account: one(accountTable, {
      fields: [accountOtaDetailTable.accountId],
      references: [accountTable.id],
    }),
    connection: one(connectionTable, {
      fields: [accountOtaDetailTable.accountId],
      references: [connectionTable.otaId],
    }),
  }),
);

export const connectionRelations = relations(connectionTable, ({ one }) => ({
  mahasiswa: one(accountMahasiswaDetailTable, {
    fields: [connectionTable.mahasiswaId],
    references: [accountMahasiswaDetailTable.accountId],
  }),
  ota: one(accountOtaDetailTable, {
    fields: [connectionTable.otaId],
    references: [accountOtaDetailTable.accountId],
  }),
}));
