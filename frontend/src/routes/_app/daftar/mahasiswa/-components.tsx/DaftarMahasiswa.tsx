import { api } from "@/api/client";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import React, { JSX, useState } from "react";

import MahasiswaCard from "./card";

// Interface untuk data mahasiswa
interface Mahasiswa {
  id: string;
  name: string;
  smt: string;
  faculty: string;
  link: string;
}

// TODO: FIKSASI DATA BELUM AMA IOM
// accountId: string;
// name: string;
// nim: string;
// mahasiswaStatus: "active" | "inactive";
// description: string;
// file: string;

// TODO: Jangan pake any, component ini perlu di refactor ulang
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapApiDataToMahasiswa = (apiData: any[]): Mahasiswa[] => {
  return apiData.map((item) => ({
    id: item.accountId,
    name: item.name,
    smt: "20" + (parseInt(item.nim.substring(3, 5)) || 1), // Asumsi: 2 digit dari NIM menunjukkan semester
    faculty: item.description || "Fakultas tidak tersedia",
    link: `/detail/${item.accountId}`,
  }));
};

function DaftarMahasiswa(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Gunakan useQuery untuk fetch data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mahasiswaOta", searchQuery],
    queryFn: () =>
      api.list.listMahasiswaOta({
        q: searchQuery,
        page: 1, // Bisa ditambahkan state untuk paginasi jika diperlukan
      }),
    staleTime: 5 * 60 * 1000, // Data dianggap basi setelah 5 menit

    select: (response) => {
      // Transform data API ke format yang dibutuhkan komponen
      if (response.success && response.body && response.body.data) {
        return mapApiDataToMahasiswa(response.body.data);
      }
      return [];
    },
  });

  // Menangani perubahan input dengan debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  // Data mahasiswa dari hasil query
  const mahasiswaList = data || [];

  // Handle error message
  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : "Gagal memuat data mahasiswa"
    : null;

  console.log(JSON.stringify(data));
  return (
    <div className="flex flex-col gap-4 text-[32px] md:gap-8">
      <h1 className="text-dark font-bold">Daftar Mahasiswa</h1>

      <div className="w-full">
        <Input
          placeholder="Cari mahasiswa"
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full"
        />
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <div className="flex animate-spin items-center justify-center">
            <LoaderCircle size={32} />
          </div>
          <p className="text-dark text-center text-base font-medium">
            Sedang Memuat Data...
          </p>
        </div>
      )}

      {errorMessage && <p className="text-base text-red-500">{errorMessage}</p>}

      {!isLoading && mahasiswaList.length === 0 && (
        <div className="flex items-center justify-center py-16">
          <p className="text-dark text-center text-2xl font-bold md:text-3xl">
            Tidak ada mahasiswa yang ditemukan
          </p>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] md:gap-6">
        {mahasiswaList.map((mahasiswa) => (
          <MahasiswaCard
            key={mahasiswa.id}
            name={mahasiswa.name}
            smt={mahasiswa.smt}
            faculty={mahasiswa.faculty}
            link={mahasiswa.link}
          />
        ))}
      </section>
    </div>
  );
}

export default DaftarMahasiswa;
