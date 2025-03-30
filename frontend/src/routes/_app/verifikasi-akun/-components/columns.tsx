import { api, queryClient } from "@/api/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  CircleCheck,
  CircleX,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export type MahasiswaColumn = {
  id: string;
  name: string;
  email: string;
  jurusan: string;
  status: string;
};

export const mahasiswaColumns: ColumnDef<MahasiswaColumn>[] = [
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
              : status === "accepted"
                ? "bg-succeed"
                : "bg-destructive",
          )}
        >
          {status === "pending"
            ? "Tertunda"
            : status === "accepted"
              ? "Terverifikasi"
              : "Tertolak"}
        </span>
      );
    },
  },
  {
    accessorKey: "aksi",
    header: "Aksi",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      const status = row.getValue("status") as
        | "pending"
        | "accepted"
        | "rejected";

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const applicationStatusCallbackMutation = useMutation({
        mutationFn: (status: "accepted" | "rejected") => {
          return api.status.applicationStatus({
            formData: { status },
            id: id,
          });
        },
        onSuccess: (_data, _variables, context) => {
          toast.dismiss(context);
          toast.success("Berhasil mengubah status", {
            description: "Status berhasil diubah",
          });
        },
        onError: (_error, _variables, context) => {
          toast.dismiss(context);
          toast.warning("Gagal mengubah status", {
            description: "Silakan coba lagi",
          });
        },
        onMutate: () => {
          const loading = toast.loading("Sedang mengubah status...", {
            description: "Mohon tunggu sebentar",
            duration: Infinity,
          });
          return loading;
        },
      });

      return (
        <div className="flex gap-6">
          {status === "pending" ? (
            <>
              <CircleCheck
                className="text-succeed h-5 w-5 hover:cursor-pointer"
                onClick={async () => {
                  await applicationStatusCallbackMutation.mutateAsync(
                    "accepted",
                  );
                  await queryClient.invalidateQueries({
                    queryKey: ["listMahasiswaAdmin"],
                    refetchType: "active",
                  });
                }}
              />
              <CircleX
                className="text-destructive h-5 w-5 hover:cursor-pointer"
                onClick={async () => {
                  await applicationStatusCallbackMutation.mutateAsync(
                    "rejected",
                  );
                  await queryClient.invalidateQueries({
                    queryKey: ["listMahasiswaAdmin"],
                    refetchType: "active",
                  });
                }}
              />
            </>
          ) : status === "accepted" ? (
            <RefreshCw
              className="text-destructive h-5 w-5 hover:cursor-pointer"
              onClick={async () => {
                await applicationStatusCallbackMutation.mutateAsync("rejected");
                await queryClient.invalidateQueries({
                  queryKey: ["listMahasiswaAdmin"],
                  refetchType: "active",
                });
              }}
            />
          ) : (
            <RefreshCw
              className="text-succeed h-5 w-5 hover:cursor-pointer"
              onClick={async () => {
                await applicationStatusCallbackMutation.mutateAsync("accepted");
                await queryClient.invalidateQueries({
                  queryKey: ["listMahasiswaAdmin"],
                  refetchType: "active",
                });
              }}
            />
          )}
        </div>
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
              : status === "accepted"
                ? "bg-succeed"
                : "bg-destructive",
          )}
        >
          {status === "pending"
            ? "Tertunda"
            : status === "accepted"
              ? "Terverifikasi"
              : "Tertolak"}
        </span>
      );
    },
  },
  {
    accessorKey: "aksi",
    header: "Aksi",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      const status = row.getValue("status") as
        | "pending"
        | "accepted"
        | "rejected";

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const applicationStatusCallbackMutation = useMutation({
        mutationFn: (status: "accepted" | "rejected") => {
          return api.status.applicationStatus({
            formData: { status },
            id: id,
          });
        },
        onSuccess: (_data, _variables, context) => {
          toast.dismiss(context);
          toast.success("Berhasil mengubah status", {
            description: "Status berhasil diubah",
          });
        },
        onError: (_error, _variables, context) => {
          toast.dismiss(context);
          toast.warning("Gagal mengubah status", {
            description: "Silakan coba lagi",
          });
        },
        onMutate: () => {
          const loading = toast.loading("Sedang mengubah status...", {
            description: "Mohon tunggu sebentar",
            duration: Infinity,
          });
          return loading;
        },
      });

      return (
        <div className="flex gap-6">
          {status === "pending" ? (
            <>
              <CircleCheck
                className="text-succeed h-5 w-5 hover:cursor-pointer"
                onClick={async () => {
                  await applicationStatusCallbackMutation.mutateAsync(
                    "accepted",
                  );
                  await queryClient.invalidateQueries({
                    queryKey: ["listOrangTuaAdmin"],
                    refetchType: "active",
                  });
                }}
              />
              <CircleX
                className="text-destructive h-5 w-5 hover:cursor-pointer"
                onClick={async () => {
                  await applicationStatusCallbackMutation.mutateAsync(
                    "rejected",
                  );
                  await queryClient.invalidateQueries({
                    queryKey: ["listOrangTuaAdmin"],
                    refetchType: "active",
                  });
                }}
              />
            </>
          ) : status === "accepted" ? (
            <RefreshCw
              className="text-destructive h-5 w-5 hover:cursor-pointer"
              onClick={async () => {
                await applicationStatusCallbackMutation.mutateAsync("rejected");
                await queryClient.invalidateQueries({
                  queryKey: ["listOrangTuaAdmin"],
                  refetchType: "active",
                });
              }}
            />
          ) : (
            <RefreshCw
              className="text-succeed h-5 w-5 hover:cursor-pointer"
              onClick={async () => {
                await applicationStatusCallbackMutation.mutateAsync("accepted");
                await queryClient.invalidateQueries({
                  queryKey: ["listOrangTuaAdmin"],
                  refetchType: "active",
                });
              }}
            />
          )}
        </div>
      );
    },
  },
];
