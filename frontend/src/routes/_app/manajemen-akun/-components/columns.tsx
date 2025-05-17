import { AllAccountListElement } from "@/api/generated";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";

export const accountColumns: ColumnDef<AllAccountListElement>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
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
    cell: ({ row }) => {
      const account = row.original;

      return (
        <p>
          {account.type === "mahasiswa"
            ? account.ma_name
            : account.type === "ota"
              ? account.ota_name
              : account.admin_name}
        </p>
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
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipe
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownAZ className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <div className="capitalize">
          {type === "mahasiswa" ? (
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
              Mahasiswa
            </span>
          ) : type === "ota" ? (
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
              Orang Tua Asuh
            </span>
          ) : type === "admin" ? (
            <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">
              Admin
            </span>
          ) : type === "bankes" ? (
            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
              Bantuan Kesejahteraan
            </span>
          ) : (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">
              Pengurus
            </span>
          )}
        </div>
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
        <div className="capitalize">
          {status === "verified" ? (
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
              Verified
            </span>
          ) : (
            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
              Unverified
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "applicationStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Application Status
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownAZ className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const applicationStatus = row.getValue("applicationStatus") as string;
      return (
        <div className="capitalize">
          {applicationStatus === "accepted" ? (
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
              Terverifikasi
            </span>
          ) : applicationStatus === "pending" ? (
            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
              Tertunda
            </span>
          ) : applicationStatus === "rejected" ? (
            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
              Tertolak
            </span>
          ) : applicationStatus === "reapply" ? (
            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
              Pengajuan Ulang
            </span>
          ) : applicationStatus === "outdated" ? (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">
              Kedaluarsa
            </span>
          ) : (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">
              Belum Terdaftar
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const account = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
            {account.status === "verified" ? (
              <DropdownMenuItem className="cursor-pointer text-red-600">
                <UserX className="mr-2 h-4 w-4" />
                Unverify
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="cursor-pointer text-green-600">
                <UserCheck className="mr-2 h-4 w-4" />
                Verify
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
