import { LoaderCircle } from "lucide-react";
import React, { JSX, useEffect, useState } from "react";

import { Input } from "../../../../../components/ui/input";
import MahasiswaCard from "./card";

// Interface untuk data mahasiswa
interface Mahasiswa {
  id: string;
  name: string;
  smt: number;
  faculty: string;
  money: number;
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
        money: 1000000,
        link: "/_app/profile/m001",
      },
      {
        id: "m002",
        name: "Jane Smith",
        smt: 3,
        faculty: "STEI-K Teknik Informatika",
        money: 950000,
        link: "/_app/profile/m002",
      },
      {
        id: "m003",
        name: "Ahmad Fauzi",
        smt: 7,
        faculty: "FTTM Teknik Pertambangan",
        money: 1200000,
        link: "/_app/profile/m003",
      },
      {
        id: "m004",
        name: "Siti Rahayu",
        smt: 4,
        faculty: "FTSL Teknik Lingkungan",
        money: 875000,
        link: "/_app/profile/m004",
      },
      {
        id: "m005",
        name: "Michael Wong",
        smt: 2,
        faculty: "FTI Teknik Kimia",
        money: 1150000,
        link: "/_app/profile/m005",
      },
      {
        id: "m006",
        name: "Devi Putri",
        smt: 6,
        faculty: "FMIPA Matematika",
        money: 925000,
        link: "/_app/profile/m006",
      },
      {
        id: "m007",
        name: "Budi Santoso",
        smt: 5,
        faculty: "FTMD Teknik Mesin",
        money: 1050000,
        link: "/_app/profile/m007",
      },
      {
        id: "m008",
        name: "Anisa Rahma",
        smt: 3,
        faculty: "FSRD Desain Interior",
        money: 980000,
        link: "/_app/profile/m008",
      },
      {
        id: "m009",
        name: "Reza Pratama",
        smt: 1,
        faculty: "STEI-K Teknik Elektro",
        money: 900000,
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
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Memuat data saat komponen pertama kali ditampilkan
  useEffect(() => {
    fetchMahasiswaData();
  }, []);

  // Effect untuk menangani pencarian
  useEffect(() => {
    // Debounce pencarian untuk mengurangi panggilan API yang berlebihan
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        fetchMahasiswaData(); // Reset ke daftar lengkap ketika pencarian kosong
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fungsi untuk mengambil semua data mahasiswa
  const fetchMahasiswaData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await MahasiswaService.getMahasiswaList();
      setMahasiswaList(data);
      setError(null);
    } catch (err) {
      console.error("Gagal mengambil data mahasiswa:", err);
      setError("Gagal memuat data mahasiswa");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menangani pencarian
  const handleSearch = async (query: string): Promise<void> => {
    setIsLoading(true);
    try {
      const results = await MahasiswaService.searchMahasiswa(query);
      setMahasiswaList(results);
      setError(null);
    } catch (err) {
      console.error("Gagal mencari mahasiswa:", err);
      setError("Gagal mencari mahasiswa");
    } finally {
      setIsLoading(false);
    }
  };

  // Menangani perubahan input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 text-[32px] md:gap-8">
      <h1 className="text-dark font-bold">Mahasiswa Asuh Saya</h1>

      <Input
        placeholder="Cari mahasiswa"
        value={searchQuery}
        onChange={handleInputChange}
      />

      {isLoading && (
        <div className="flex flex-col gap-4">
          <div className="flex animate-spin items-center justify-center">
            <LoaderCircle />
          </div>
          <p className="text-dark text-center text-base font-medium">
            Sedang Memuat Data...
          </p>
        </div>
      )}

      {error && <p className="text-base text-red-500">{error}</p>}

      {!isLoading && mahasiswaList.length === 0 && (
        <p className="text-dark mt-[125px] text-center text-[24px] font-bold md:text-[32px]">
          Tidak ada mahasiswa yang ditemukan
        </p>
      )}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] md:gap-6">
        {mahasiswaList.map((mahasiswa) => (
          <MahasiswaCard
            key={mahasiswa.id}
            name={mahasiswa.name}
            smt={mahasiswa.smt}
            faculty={mahasiswa.faculty}
            money={mahasiswa.money}
            link={mahasiswa.link}
          />
        ))}
      </section>
    </div>
  );
}

export default DaftarMahasiswa;
