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

// Layanan API untuk mengelola data mahasiswa
// Catatan: Pada implementasi sebenarnya, ini akan dipisahkan ke file terpisah
const MahasiswaService = {
  // Fungsi simulasi untuk mengambil data dari API
  getMahasiswaList: async (): Promise<Mahasiswa[]> => {
    // Pada implementasi sebenarnya, ini akan memanggil API backend
    return Promise.resolve([
      {
        id: "m001",
        name: "John Doe",
        smt: 5,
        faculty: "STEI-K Teknik Informatika",
        link: "/_app/profile/m001",
      },
      {
        id: "m002",
        name: "Jane Smith sasdad adssss adsssssss adssssss adssssss adssss",
        smt: 3,
        faculty: "STEI-K Teknik Informatika",
        link: "/_app/profile/m002",
      },
      {
        id: "m003",
        name: "Ahmad Fauzi",
        smt: 7,
        faculty: "FTTM Teknik Pertambangan",
        link: "/_app/profile/m003",
      },
      {
        id: "m004",
        name: "Siti Rahayu",
        smt: 4,
        faculty: "FTSL Teknik Lingkungan",
        link: "/_app/profile/m004",
      },
      {
        id: "m005",
        name: "Michael Wong",
        smt: 2,
        faculty: "FTI Teknik Kimia",
        link: "/_app/profile/m005",
      },
      {
        id: "m006",
        name: "Devi Putri",
        smt: 6,
        faculty: "FMIPA Matematika",
        link: "/_app/profile/m006",
      },
      {
        id: "m007",
        name: "Budi Santoso",
        smt: 5,
        faculty: "FTMD Teknik Mesin",
        link: "/_app/profile/m007",
      },
      {
        id: "m008",
        name: "Anisa Rahma",
        smt: 3,
        faculty: "FSRD Desain Interior",
        link: "/_app/profile/m008",
      },
      {
        id: "m009",
        name: "Reza Pratama",
        smt: 1,
        faculty: "STEI-K Teknik Elektro",
        link: "/_app/profile/m009",
      },
    ]);
  },

  // Fungsi pencarian yang akan memanggil endpoint API dengan parameter pencarian
  searchMahasiswa: async (query: string): Promise<Mahasiswa[]> => {
    // Pada implementasi sebenarnya, ini akan memanggil API dengan parameter pencarian
    // Untuk saat ini, kita akan mengambil daftar lengkap dan memfilternya
    const data = await MahasiswaService.getMahasiswaList();

    // Filter data berdasarkan query pencarian
    const filteredData = data.filter((mahasiswa) =>
      mahasiswa.name.toLowerCase().includes(query.toLowerCase()),
    );

    return filteredData;
  },
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
    <div className="container mx-auto flex flex-col gap-6 text-[32px]">
      <h1 className="text-dark font-bold">Mahasiswa Asuh Saya</h1>

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

      {error && <p className="py-4 text-base text-red-500">{error}</p>}

      {!isLoading && mahasiswaList.length === 0 && (
        <div className="flex items-center justify-center py-16">
          <p className="text-dark text-center text-2xl font-bold md:text-3xl">
            Tidak ada mahasiswa yang ditemukan
          </p>
        </div>
      )}

      <div className="w-full">
        <div
          className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {mahasiswaList.map((mahasiswa) => (
            <div key={mahasiswa.id} className="flex">
              <MahasiswaCard
                name={mahasiswa.name}
                smt={mahasiswa.smt}
                faculty={mahasiswa.faculty}
                link={mahasiswa.link}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DaftarMahasiswa;
