import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";

export type MahasiswaColumn = {
  id: string;
  name: string;
  email: string;
  jurusan: string;
  status: string;
};

export const mahasiswaColumns: ColumnDef<MahasiswaColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-6 w-6" />
          ) : (
            <ArrowDownAZ className="ml-2 h-6 w-6" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownAZ className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "jurusan",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Jurusan
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownAZ className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownAZ className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold text-white",
            status === "pending"
              ? "bg-[#EAB308]"
              : status === "verified"
                ? "bg-succeed"
                : "bg-destructive",
          )}
        >
          {status === "pending"
            ? "Tertunda"
            : status === "verified"
              ? "Terverifikasi"
              : "Tertolak"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Aksi",
    cell: ({ row }) => {
      // TODO: Nanti ganti ke component yang lebih sesuai
      const status = row.getValue("status") as string;
      return (
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold text-white",
            status === "pending"
              ? "bg-[#EAB308]"
              : status === "verified"
                ? "bg-succeed"
                : "bg-destructive",
          )}
        >
          {status === "pending"
            ? "Tertunda"
            : status === "verified"
              ? "Terverifikasi"
              : "Tertolak"}
        </span>
      );
    },
  },
];

export type OrangTuaColumn = {
  id: string;
  name: string;
  phoneNumber: string;
  job: string;
  status: string;
};

export const orangTuaColumns: ColumnDef<OrangTuaColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-6 w-6" />
          ) : (
            <ArrowDownAZ className="ml-2 h-6 w-6" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No. Telepon
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownAZ className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "job",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pekerjaan
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownAZ className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownAZ className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold text-white",
            status === "pending"
              ? "bg-[#EAB308]"
              : status === "verified"
                ? "bg-succeed"
                : "bg-destructive",
          )}
        >
          {status === "pending"
            ? "Tertunda"
            : status === "verified"
              ? "Terverifikasi"
              : "Tertolak"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Aksi",
    cell: ({ row }) => {
      // TODO: Nanti ganti ke component yang lebih sesuai
      const status = row.getValue("status") as string;
      return (
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold text-white",
            status === "pending"
              ? "bg-[#EAB308]"
              : status === "verified"
                ? "bg-succeed"
                : "bg-destructive",
          )}
        >
          {status === "pending"
            ? "Tertunda"
            : status === "verified"
              ? "Terverifikasi"
              : "Tertolak"}
        </span>
      );
    },
  },
];
