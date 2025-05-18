import { ConnectionListAllResponse } from "@/api/generated";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";

export const connectionColumns: ColumnDef<ConnectionListAllResponse>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name_ma",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Mahasiswa
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

      return <p>{account.name_ma}</p>;
    },
  },
  {
    accessorKey: "nim_ma",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          NIM Mahasiswa
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

      return <p>{account.nim_ma}</p>;
    },
  },
  {
    accessorKey: "name_ota",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Orang Tua Asuh
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

      return <p>{account.name_ota}</p>;
    },
  },
  {
    accessorKey: "number_ota",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No. Telepon OTA
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

      return <p>{account.number_ota}</p>;
    },
  },
  {
    accessorKey: "connection_status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status Hubungan Asuh
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownAZ className="ml-2 h-4 w-4" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const account = row.original;

      return (
        <div className="capitalize">
          {account.connection_status === "accepted" ? (
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
              Aktif
            </span>
          ) : (
            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
              Menunggu Konfirmasi
            </span>
          )}
        </div>
      );
    },
  },
  //   {
  //     accessorKey: "applicationStatus",
  //     header: ({ column }) => {
  //       return (
  //         <Button
  //           variant="ghost"
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         >
  //           Status Pendaftaran
  //           {column.getIsSorted() === "asc" ? (
  //             <ArrowUpAZ className="ml-2 h-4 w-4" />
  //           ) : (
  //             <ArrowDownAZ className="ml-2 h-4 w-4" />
  //           )}
  //         </Button>
  //       );
  //     },
  //     cell: ({ row }) => {
  //       const applicationStatus = row.getValue("applicationStatus") as string;
  //       return (
  //         <div className="capitalize">
  //           {applicationStatus === "accepted" ? (
  //             <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
  //               Terverifikasi
  //             </span>
  //           ) : applicationStatus === "pending" ? (
  //             <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
  //               Tertunda
  //             </span>
  //           ) : applicationStatus === "rejected" ? (
  //             <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
  //               Tertolak
  //             </span>
  //           ) : applicationStatus === "reapply" ? (
  //             <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
  //               Pengajuan Ulang
  //             </span>
  //           ) : applicationStatus === "outdated" ? (
  //             <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-800">
  //               Kedaluarsa
  //             </span>
  //           ) : (
  //             <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-800">
  //               Belum Terdaftar
  //             </span>
  //           )}
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     id: "actions",
  //     header: "Aksi",
  //     cell: ({ row }) => {
  //       const account = row.original;

  //       return <DropdownMenuAccount account={account} />;
  //     },
  //   },
];
