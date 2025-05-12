import { api, queryClient } from "@/api/client";
import { ClientPagination } from "@/components/client-pagination";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import { Route } from "..";
import { PemasanganBotaColumn, pemasanganBotaColumns } from "./columns";
import { DataTable } from "./data-table";
import { OTA } from "./ota-popover";
import FilterJurusan from "./filter-jurusan";
import FilterFakultas from "./filter-fakultas";
import FilterAgama from "./filter-agama";
import FilterKelamin from "./filter-kelamin";

export function MahasiswaSelection({ selectedOTA }: { selectedOTA: OTA }) {
  const navigate = useNavigate({ from: Route.fullPath });
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const page = parseInt(searchParams.get("page") ?? "1") || 1;

  const [search, setSearch] = useState<string>("");
  const [searchValue] = useDebounce(search, 500);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Set<string>>(
    new Set(),
  );
  const [jurusan, setJurusan] = useState<string | null>(null);
  const [fakultas, setFakultas] = useState<string | null>(null);
  const [agama, setAgama] = useState<string | null>(null);
  const [kelamin, setKelamin] = useState<"M" | "F" | null>(null);

  const handleCheckboxChange = (id: string, isChecked: boolean) => {
    setSelectedMahasiswa((prev) => {
      const updated = new Set(prev);
      if (isChecked) {
        updated.add(id);
      } else {
        updated.delete(id);
      }
      return updated;
    });
  };

  // Fetch the list of mahasiswa with pagination and search query
  const { data, isSuccess } = useQuery({
    queryKey: ["listMahasiswaOta", page, searchValue, jurusan, fakultas, agama, kelamin],
    queryFn: () =>
      api.list.listMahasiswaOta({
        page,
        q: searchValue,
        major: jurusan as "Matematika" | "Fisika" | "Astronomi" | "Mikrobiologi" | "Kimia" | "Biologi" | "Sains dan Teknologi Farmasi" | "Aktuaria" | "Rekayasa Hayati" | "Rekayasa Pertanian" | "Rekayasa Kehutanan" | undefined,
        faculty: fakultas as "FMIPA" | "SITH-S" | "SF" | "FITB" | "FTTM" | "STEI-R" | "FTSL" | "FTI" | "FSRD" | "FTMD" | "STEI-K" | "SBM" | "SITH-R" | "SAPPK" | undefined,
        religion: ["Islam", "Kristen Protestan", "Katolik", "Hindu", "Buddha", "Konghucu"].includes(agama || "")
          ? (agama as "Islam" | "Kristen Protestan" | "Katolik" | "Hindu" | "Buddha" | "Konghucu")
          : undefined,
        gender: kelamin || undefined,
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
    isSelected: selectedMahasiswa.has(item.accountId),
    onCheckboxChange: handleCheckboxChange,
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
      <p className="text-dark text-base ">
        Pilih mahasiswa yang ingin dipasangkan dengan <span className="font-bold">{selectedOTA.name}</span>
      </p>
      <div className="flex w-full flex-wrap gap-3">
        <div className="flex w-full max-w-[375px] gap-3 sm:flex-nowrap">
          {/* Button to go to list of selected mahasiswa */}
          <Button
            variant="default"
            className="flex flex-grow items-center justify-center gap-3"
            onClick={() => {
              if (selectedMahasiswa.size === 0) {
                toast.warning("Belum Ada Mahasiswa yang Dipilih", {
                  description:
                    "Silakan pilih mahasiswa yang tersedia terlebih dahulu",
                });
              }
            }}
          >
            Pilih {selectedMahasiswa.size} calon
          </Button>

          <Button
            variant="outline"
            className="border-destructive text-destructive h-9 hover:text-destructive"
            disabled={selectedMahasiswa.size === 0}
            onClick={() => {
              setSelectedMahasiswa(new Set());
            }}
          >
            Reset Pilihan
            <Trash2 className="text-destructive" />
          </Button>
        </div>

        <div className="w-full sm:flex-1">
          <SearchInput placeholder="Cari nama atau NIM" setSearch={setSearch} />
        </div>

        {/* TODO: Masih empty data yg dihasilin, di test di swagger juga ga muncul apaapa tapi kode nya 200 */}
        <div className="w-full flex flex-wrap gap-3">
          <FilterJurusan setJurusan={setJurusan} />
          <FilterFakultas setFakultas={setFakultas} />
          <FilterAgama setAgama={setAgama} />
          <FilterKelamin setKelamin={setKelamin} />
        </div>
      </div>

      {/* Table Mahasiswa */}
      {!isSuccess ? (
        <div className="rounded-md bg-white">
          <Skeleton className="h-80 w-full" />
        </div>
      ) : (
        <DataTable
          columns={pemasanganBotaColumns.map(
            (column): ColumnDef<PemasanganBotaColumn, unknown> =>
              column.id === "aksi"
                ? {
                    ...column,
                    cell: ({ row }) => {
                      const id = row.getValue("mahasiswaId") as string;
                      return (
                        <Checkbox
                          checked={selectedMahasiswa.has(id)}
                          onCheckedChange={(isChecked) =>
                            handleCheckboxChange(id, isChecked as boolean)
                          }
                        />
                      );
                    },
                  }
                : column,
          )}
          data={mahasiswaTableData || []}
        />
      )}

      {/* Pagination */}
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
