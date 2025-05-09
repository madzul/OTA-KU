import { api } from "@/api/client";
import { SearchInput } from "@/components/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import { DataTable } from "./data-table";
import { persetujuanAsuhColumns } from "./columns";

function PersetujuanAsuhContent() {
  const [search, setSearch] = useState<string>("");
  const [value] = useDebounce(search, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["listConnection", value],
    queryFn: () =>
      api.connect.listConnection({
        q: value,
        page: 1,
      }),
    select: (response) =>
      response.body.data.map((item) => ({
        id: `${item.mahasiswa_id}-${item.ota_id}`,
        mahasiswaName: item.name_ma,
        nim: item.nim_ma,
        otaName: item.name_ota,
        phoneNumber: item.number_ota,
      })),
  });

  const isLoadingState = isLoading || isError;

  return (
    <section className="flex flex-col gap-4">
      {/* Search */}
      {isLoadingState ? (
        <div className="rounded-md bg-white">
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <SearchInput
          placeholder="Cari Nama Mahasiswa, NIM, Nama OTA, atau No. Telepon"
          setSearch={setSearch}
        />
      )}

      {/* Table */}
      {isLoadingState ? (
        <div className="rounded-md bg-white">
          <Skeleton className="h-80 w-full" />
        </div>
      ) : (
        <DataTable columns={persetujuanAsuhColumns} data={data || []} />
      )}
    </section>
  );
}

export default PersetujuanAsuhContent;
