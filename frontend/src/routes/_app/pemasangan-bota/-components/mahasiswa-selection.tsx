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
import ConfirmationDialog from "./confirmation-dialog";
import { DataTable } from "./data-table";
import DetailDialogMahasiswa from "./detail-dialog-mahasiswa";
import FilterAgama from "./filter-agama";
import FilterFakultas from "./filter-fakultas";
import FilterJurusan from "./filter-jurusan";
import FilterKelamin from "./filter-kelamin";
import { OTA } from "./ota-popover";

export function MahasiswaSelection({
  selectedOTA,
  onConfirmSuccess,
}: {
  selectedOTA: OTA;
  onConfirmSuccess: () => void;
}) {
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
  const [showSelectedList, setShowSelectedList] = useState(false);

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

  const handleRemoveMahasiswa = (id: string) => {
    setSelectedMahasiswa((prev) => {
      const updated = new Set(prev);
      updated.delete(id);
      return updated;
    });
  };

  const resetFilters = () => {
    setJurusan(null);
    setFakultas(null);
    setAgama(null);
    setKelamin(null);

    // Trigger reset for filter components
    document.dispatchEvent(new CustomEvent("resetFilters"));
  };

  // Fetch the list of mahasiswa with pagination and search query
  const { data, isSuccess } = useQuery({
    queryKey: [
      "listMahasiswaOta",
      page,
      searchValue,
      jurusan,
      fakultas,
      agama,
      kelamin,
    ],
    queryFn: () =>
      api.list.listMahasiswaOta({
        page,
        q: searchValue,
        major: jurusan as
          | "Matematika"
          | "Fisika"
          | "Astronomi"
          | "Mikrobiologi"
          | "Kimia"
          | "Biologi"
          | "Sains dan Teknologi Farmasi"
          | "Aktuaria"
          | "Rekayasa Hayati"
          | "Rekayasa Pertanian"
          | "Rekayasa Kehutanan"
          | undefined,
        faculty: fakultas as
          | "FMIPA"
          | "SITH-S"
          | "SF"
          | "FITB"
          | "FTTM"
          | "STEI-R"
          | "FTSL"
          | "FTI"
          | "FSRD"
          | "FTMD"
          | "STEI-K"
          | "SBM"
          | "SITH-R"
          | "SAPPK"
          | undefined,
        religion: [
          "Islam",
          "Kristen Protestan",
          "Katolik",
          "Hindu",
          "Buddha",
          "Konghucu",
        ].includes(agama || "")
          ? (agama as
              | "Islam"
              | "Kristen Protestan"
              | "Katolik"
              | "Hindu"
              | "Buddha"
              | "Konghucu")
          : undefined,
        gender: kelamin || undefined,
      }),
  });

  // Map the data of mahasiswa to the format required by the DataTable
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

  // Fetch detail ota according selectedOta.accountId
  const { data: otaDetails } = useQuery({
    queryKey: ["otaDetails", selectedOTA?.accountId],
    queryFn: () =>
      api.detail.getOtaDetail({
        id: selectedOTA?.accountId || "",
      }),
  });

  // Map the data of detail ota to match the format
  const selectedOtaDetails = {
    accountId: otaDetails?.body.id,
    name: otaDetails?.body.name,
    maxCapacity: otaDetails?.body.maxCapacity,
    // Add other properties as needed
  };

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

  // Handle the confirmation dialog success for "Pasangkan" button
  const handleConfirmSuccess = () => {
    setSelectedMahasiswa(new Set());
    setShowSelectedList(false);
    onConfirmSuccess();
  };

  return (
    <>
      {!showSelectedList ? (
        <>
          <p className="text-dark text-base">
            Pilih mahasiswa yang ingin dipasangkan dengan{" "}
            <span className="font-bold">{selectedOTA.name}</span>
          </p>
          <div className="flex w-full flex-wrap gap-3">
            <div className="flex w-full max-w-[375px] gap-3 sm:flex-nowrap">
              <Button
                variant="default"
                className="flex flex-grow items-center justify-center gap-3"
                onClick={() => {
                  if (selectedMahasiswa.size === 0) {
                    toast.warning("Belum Ada Mahasiswa yang Dipilih", {
                      description:
                        "Silakan pilih mahasiswa yang tersedia terlebih dahulu",
                    });
                    return;
                  }
                  if (
                    selectedOtaDetails.maxCapacity !== undefined &&
                    // TODO: selectedMahasiswa.size > (selectedOtaDetails.maxCapacity - selectedOtaDetails.currentConnection) &&
                    selectedMahasiswa.size > selectedOtaDetails.maxCapacity &&
                    selectedOtaDetails.maxCapacity > 0
                  ) {
                    toast.warning("Kapasitas Terlampaui", {
                      description: `OTA ini hanya sanggup membantu hingga ${selectedOtaDetails.maxCapacity} mahasiswa. Silahkan kurangi pilihan Anda.`,
                    });
                    return;
                  }
                  setShowSelectedList(true);
                }}
              >
                Pilih {selectedMahasiswa.size} calon
              </Button>

              <Button
                variant="outline"
                className="border-destructive text-destructive hover:text-destructive h-9"
                disabled={selectedMahasiswa.size === 0}
                onClick={() => {
                  setSelectedMahasiswa(new Set());
                }}
              >
                Reset Pilihan
                <Trash2 className="text-destructive" />
              </Button>
            </div>

                {/* TODO: Abis ngubah search input harus balik lagi ke page 1 di pagination */}
            <div className="w-full sm:flex-1">
              <SearchInput
                placeholder="Cari nama atau NIM"
                setSearch={setSearch}
              />
            </div>

            {/* TODO: Abis ngubah filter harus balik lagi ke page 1 di pagination */}
            <div className="flex w-full flex-wrap gap-3">
              <FilterJurusan setJurusan={setJurusan} />
              <FilterFakultas setFakultas={setFakultas} />
              <FilterAgama setAgama={setAgama} />
              <FilterKelamin setKelamin={setKelamin} />
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:text-destructive h-9"
                onClick={resetFilters}
              >
                Reset Filter
                <Trash2 className="text-destructive ml-2" />
              </Button>
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
            // TODO: Set to 3 just for testing. Change to 10 later
            <ClientPagination totalPerPage={3} total={data.body.totalData} />
          )}
        </>
      ) : (
        <>
          <p className="text-dark text-base">
            Pilih mahasiswa yang ingin dipasangkan dengan{" "}
            <span className="font-bold">{selectedOTA.name}</span>
          </p>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              className="w-fit"
              onClick={() => setShowSelectedList(false)}
            >
              Kembali
            </Button>
            <p className="text-dark text-base font-bold">
              Total: <span className="font-bold">{selectedMahasiswa.size}</span>
            </p>
          </div>
          <div className="space-y-4">
            {[...selectedMahasiswa].map((id) => {
              const mahasiswa = data?.body.data.find(
                (item) => item.accountId === id,
              );
              if (!mahasiswa) return null;

              return (
                <div
                  key={id}
                  className="flex items-center justify-between rounded-md border p-4 shadow-sm"
                >
                  <div className="flex flex-1 items-center gap-4 overflow-hidden">
                    <DetailDialogMahasiswa id={id} />
                    <div className="flex-1 truncate">
                      <p className="text-dark truncate font-bold">
                        {mahasiswa.name}
                      </p>
                      <p className="text-muted-foreground truncate text-sm">
                        {mahasiswa.nim}
                      </p>
                    </div>
                  </div>
                  <Trash2
                    size={24}
                    className="text-destructive cursor-pointer"
                    onClick={() => handleRemoveMahasiswa(id)}
                  />
                </div>
              );
            })}
          </div>
          <ConfirmationDialog
            onConfirmSuccess={handleConfirmSuccess}
            selectedCount={selectedMahasiswa.size}
            otaName={selectedOTA.name}
            otaId={selectedOTA.accountId}
            selectedMahasiswa={selectedMahasiswa}
          />
        </>
      )}
    </>
  );
}
