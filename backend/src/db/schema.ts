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

export const applicationStatusEnum = pgEnum("account_status", [
  "accepted",
  "rejected",
  "pending",
]);

export const mahasiswaStatusEnum = pgEnum("mahasiswa_status", [
  "active",
  "inactive",
]);

export const connectionStatusEnum = pgEnum("connection_status", [
  "accepted",
  "rejected",
  "pending",
]);

export const providerEnum = pgEnum("provider", ["credentials", "azure"]);

export const accountTable = pgTable("account", {
  id: uuid("id").defaultRandom().primaryKey().unique().notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  phoneNumber: varchar({ length: 32 }).unique(),
  password: varchar({ length: 255 }).notNull(),
  type: accountTypeEnum("type").notNull(),
  provider: providerEnum("provider").notNull().default("credentials"),
  status: verificationStatusEnum("status").notNull().default("unverified"),
  applicationStatus: applicationStatusEnum("application_status")
    .notNull()
    .default("pending"),
});

export const accountMahasiswaDetailTable = pgTable("account_mahasiswa_detail", {
  accountId: uuid("account_id")
    .primaryKey()
    .notNull()
    .references(() => accountTable.id, {
      onDelete: "cascade",
    }),
  name: varchar({ length: 255 }).notNull(),
  nim: varchar({ length: 8 }).unique().notNull(),
  description: text("description"),
  file: text("file"),
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
  job: varchar({ length: 255 }).notNull(),
  address: varchar({ length: 255 }).notNull(),
  linkage: linkageEnum("linkage").notNull(),
  funds: integer("funds").notNull(),
  maxCapacity: integer("max_capacity").notNull(),
  startDate: timestamp("start_date").notNull(),
  maxSemester: integer("max_semester").notNull(),
  transferDate: integer("transfer_date").notNull(),
  criteria: text("criteria").notNull(),
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
      connectionStatus:  connectionStatusEnum("connection_status")
        .notNull()
        .default("pending"),
  },
  (table) => [primaryKey({ columns: [table.mahasiswaId, table.otaId] })],
);

export const otpTable = pgTable(
  "otp",
  {
    accountId: uuid("account_id")
      .notNull()
      .references(() => accountTable.id, {
        onDelete: "cascade",
      }),
    code: varchar({ length: 6 }).notNull(),
    expiredAt: timestamp("expired_at").notNull(),
  },
  (table) => [primaryKey({ columns: [table.accountId, table.code] })],
);

export const accountRelations = relations(accountTable, ({ one, many }) => ({
  accountMahasiswaDetail: one(accountMahasiswaDetailTable, {
    fields: [accountTable.id],
    references: [accountMahasiswaDetailTable.accountId],
  }),
  accountOtaDetail: one(accountOtaDetailTable, {
    fields: [accountTable.id],
    references: [accountOtaDetailTable.accountId],
  }),
  otps: many(otpTable),
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

export const otpRelations = relations(otpTable, ({ one }) => ({
  account: one(accountTable, {
    fields: [otpTable.accountId],
    references: [accountTable.id],
  }),
}));
