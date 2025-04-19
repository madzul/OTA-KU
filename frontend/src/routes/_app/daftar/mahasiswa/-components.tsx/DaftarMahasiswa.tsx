import { api } from "@/api/client";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import React, { JSX, useState } from "react";

import MahasiswaCard from "./card";

// Response data dari API
interface MahasiswaResponse {
  accountId: string;
  name: string;
  nim: string;
  mahasiswaStatus: "active" | "inactive";
  description: string;
  file: string;
}

// Data mahasiswa yang akan ditampilkan di UI
interface Mahasiswa {
  id: string;
  name: string;
  angkatan: string;
  faculty: string;
  link: string;
}

// TODO: FIKSASI DATA BELUM AMA IOM

const mapApiDataToMahasiswa = (apiData: MahasiswaResponse[]): Mahasiswa[] => {
  return apiData.map((item) => ({
    id: item.accountId,
    name: item.name,
    angkatan: "20" + item.nim.substring(3, 5),
    faculty: "Jurusan " + item.nim.substring(0, 3) || "Fakultas tidak tersedia",
    link: `/profil/${item.accountId}`,
  }));
};

function DaftarMahasiswa(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Gunakan useQuery untuk fetch data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["listMahasiswaOta", searchQuery],
    queryFn: () =>
      api.list.listMahasiswaOta({
        q: searchQuery,
        page: 1,
      }),
    staleTime: 5 * 60 * 1000, // 5 menit

    select: (response) => {
      // Transform data API ke format UI
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

  const mahasiswaList = data || [];

  // Handle error message
  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : "Gagal memuat data mahasiswa"
    : null;

  return (
    <div className="flex flex-col gap-4 text-[32px] md:gap-8">
      <h1 className="text-dark font-bold">Cari Mahasiswa</h1>

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

      <section
        className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
      >
        {mahasiswaList.map((mahasiswa) => (
          <MahasiswaCard
            key={mahasiswa.id}
            name={mahasiswa.name}
            angkatan={mahasiswa.angkatan}
            faculty={mahasiswa.faculty}
            link={mahasiswa.link}
            id={mahasiswa.id}
          />
        ))}
      </section>
    </div>
  );
}

export default DaftarMahasiswa;
