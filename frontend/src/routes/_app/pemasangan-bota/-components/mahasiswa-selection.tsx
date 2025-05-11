import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { Trash2, UserRoundPlus } from "lucide-react";

export function MahasiswaSelection() {
  return (
    <>
      <p className="text-dark text-base font-bold">
        Pilih mahasiswa yang ingin dipasangkan dengan OTA
      </p>
      <div className="flex w-full gap-3">
        <Button
          variant="default"
          className="flex w-full max-w-40 items-center justify-center gap-3"
        >
          <UserRoundPlus className="scale-130" />
          {/* TODO: The "X" will be replace by how many mahasiswa has been selected according the check of checkboxes */}
          <p className="">X calon</p>
        </Button>
        {/* TODO: Erase all mahasiswa selection checkboxes (checkbox component will go back to uncheck state) */}
        <Button
          variant="outline"
          size="icon"
          className="border-destructive rounded-full"
        >
          <Trash2 className="text-destructive scale-130" />
        </Button>
        {/* TODO: Implement search and setSearch for list of mahasiswa */}
        <SearchInput placeholder="Cari nama atau NIM" />
        {/* TODO: Uncomment this when the filter is ready */}
        {/* <FilterJurusan />
        <FilterFakultas />
        <FilterAgama />
        <FilterKelamin /> */}
      </div>
      {/* TODO: Uncomment this when the list of mahasiswa is ready */}
      {/* <DataTable columns{pemasanganBotaColumns} data={listPilihanMahasiswa || []}/> */}
    </>
  );
}
