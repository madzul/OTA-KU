import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";

import ConfirmationDialog from "./confirmation-dialog";
import DetailDialogMahasiswa from "./detail-dialog-mahasiswa";
import DetailDialogOta from "./detail-dialog-ota";

export type PersetujuanAsuhColumn = {
  id: string;
  mahasiswaName: string;
  nim: string;
  otaName: string;
  phoneNumber: string;
};

export const persetujuanAsuhColumns: ColumnDef<PersetujuanAsuhColumn>[] = [
  {
    accessorKey: "idMahasiswa",
    header: "ID Mahasiswa",
  },
  {
    accessorKey: "mahasiswaName",
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
  },
  {
    accessorKey: "nim",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          NIM
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-6 w-6" />
          ) : (
            <ArrowDownAZ className="ml-2 h-6 w-6" />
          )}
        </Button>
      );
    }
  },
  {
    accessorKey: "detailMahasiswa",
    header: "Detail Mahasiswa",
    cell: ({ row }) => {
      const id = row.getValue("idMahasiswa") as string;
      return <DetailDialogMahasiswa id={id} />;
    },
  },
  {
    accessorKey: "idOta",
    header: "ID OTA",
  }, 
  {
    accessorKey: "otaName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama OTA
          {column.getIsSorted() === "asc" ? (
            <ArrowUpAZ className="ml-2 h-6 w-6" />
          ) : (
            <ArrowDownAZ className="ml-2 h-6 w-6" />
          )}
        </Button>
      );
    }
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
            <ArrowUpAZ className="ml-2 h-6 w-6" />
          ) : (
            <ArrowDownAZ className="ml-2 h-6 w-6" />
          )}
        </Button>
      );
    }
  },
  {
    accessorKey: "detailOta",
    header: "Detail OTA",
    cell: ({ row }) => {
      const id = row.getValue("idOta") as string;
      return <DetailDialogOta id={id} />;
    },
  },
  {
    accessorKey: "aksi",
    header: "Aksi",
    cell: ({ row }) => {
      // TODO: Nanti sesuain ganti atau tambahin id nya yang diperlukan (kayaknya sih idMahasiswa dan idOta)
      const id = row.getValue("id") as string;
      return <ConfirmationDialog id={id} />;
    },
  },
];
