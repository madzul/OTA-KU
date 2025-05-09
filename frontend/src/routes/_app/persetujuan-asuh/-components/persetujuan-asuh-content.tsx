import { SearchInput } from "@/components/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useDebounce } from "use-debounce";

import { DataTable } from "./data-table";
import { persetujuanAsuhColumns } from "./columns";
import { dummyData } from "./dummy";

function PersetujuanAsuhContent() {
  const [search, setSearch] = useState<string>("");
  const [value] = useDebounce(search, 500);

  const filteredData = dummyData.filter(
    (item) =>
      item.mahasiswaName.toLowerCase().includes(value.toLowerCase()) ||
      item.nim.includes(value) ||
      item.otaName.toLowerCase().includes(value.toLowerCase()) ||
      item.phoneNumber.includes(value)
  );

  const isLoading = false; // Simulate loading state if needed

  return (
    <section className="flex flex-col gap-4">
      {/* Search */}
      {isLoading ? (
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
      {isLoading ? (
        <div className="rounded-md bg-white">
          <Skeleton className="h-80 w-full" />
        </div>
      ) : (
        <DataTable columns={persetujuanAsuhColumns} data={filteredData} />
      )}
    </section>
  );
}

export default PersetujuanAsuhContent;
