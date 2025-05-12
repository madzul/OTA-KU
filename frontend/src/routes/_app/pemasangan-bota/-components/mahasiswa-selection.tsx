import { api, queryClient } from "@/api/client";
import { ClientPagination } from "@/components/client-pagination";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { Route } from "..";
import { pemasanganBotaColumns } from "./columns";
import { DataTable } from "./data-table";

export function MahasiswaSelection() {
  const navigate = useNavigate({ from: Route.fullPath });
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const page = parseInt(searchParams.get("page") ?? "1") || 1;

  const [search, setSearch] = useState<string>("");
  const [searchValue] = useDebounce(search, 500);

  // Fetch the list of mahasiswa with pagination and search query
  const { data, isSuccess } = useQuery({
    queryKey: ["listMahasiswaOta", page, searchValue],
    queryFn: () =>
      api.list.listMahasiswaOta({
        page,
        q: searchValue,
      }),
  });

  const mahasiswaTableData = data?.body.data.map((item) => ({
    mahasiswaId: item.accountId,
    mahasiswaName: item.name,
    nim: item.nim,
    jurusan: item.major,
    fakultas: item.faculty,
    agama: item.religion,
    kelamin: item.gender === "F" ? "Perempuan" : "Laki-laki",
    ipk: item.gpa,
  }));

  useEffect(() => {
    queryClient.fetchQuery({
      queryKey: ["listMahasiswaOta"],
      queryFn: () =>
        api.list.listMahasiswaOta({
          page: 1,
          q: searchValue,
        }),
    });
    // Reset the page to 1 when the search value changes
    navigate({
      search: () => ({
        page: 1,
        q: searchValue,
      }),
    });
  }, [navigate, searchValue]);

  return (
    <>
      <p className="text-dark text-base font-bold">
        Pilih mahasiswa yang ingin dipasangkan dengan OTA
      </p>
      <div className="flex w-full flex-wrap gap-3">
        <div className="flex w-full max-w-[375px] gap-3 sm:flex-nowrap">
          <Button
            variant="default"
            className="flex flex-grow items-center justify-center gap-3"
          >
            Pilih X calon
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="border-destructive h-9 rounded-full sm:w-9"
          >
            <Trash2 className="text-destructive" />
          </Button>
        </div>

        <div className="w-full sm:flex-1">
          <SearchInput placeholder="Cari nama atau NIM" setSearch={setSearch} />
        </div>

        {/* Filter component placeholder */}
        {/* <FilterJurusan />
  <FilterFakultas />
  <FilterAgama />
  <FilterKelamin /> */}
      </div>

      {!isSuccess ? (
        <div className="rounded-md bg-white">
          <Skeleton className="h-80 w-full" />
        </div>
      ) : (
        <DataTable
          columns={pemasanganBotaColumns}
          data={mahasiswaTableData || []}
        />
      )}
      {!isSuccess ? (
        <div className="rounded-md bg-white">
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <ClientPagination totalPerPage={8} total={data.body.totalData} />
      )}
    </>
  );
}
