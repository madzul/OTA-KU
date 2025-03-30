import { LoaderCircle } from "lucide-react";
import React, { JSX, useEffect, useState } from "react";

import { Input } from "../../../../../components/ui/input";
import OrangTuaCard from "./card";

// Interface untuk data orang tua
interface OrangTua {
  id: string;
  name: string;
  smt: number;
  faculty: string;
  money: number;
  link: string;
}

// Layanan API untuk mengelola data orang tua
// Catatan: Pada implementasi sebenarnya, ini akan dipisahkan ke file terpisah
const OrangTuaService = {
  // Fungsi simulasi untuk mengambil data dari API
  getOrangTuaList: async (): Promise<OrangTua[]> => {
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
  searchOrangTua: async (query: string): Promise<OrangTua[]> => {
    // Pada implementasi sebenarnya, ini akan memanggil API dengan parameter pencarian
    // Untuk saat ini, kita akan mengambil daftar lengkap dan memfilternya
    const data = await OrangTuaService.getOrangTuaList();

    // Filter data berdasarkan query pencarian
    const filteredData = data.filter((orangTua) =>
      orangTua.name.toLowerCase().includes(query.toLowerCase()),
    );

    return filteredData;
  },
};

function DaftarOrangTua(): JSX.Element {
  const [orangTuaList, setOrangTuaList] = useState<OrangTua[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Memuat data saat komponen pertama kali ditampilkan
  useEffect(() => {
    fetchOrangTuaData();
  }, []);

  // Effect untuk menangani pencarian
  useEffect(() => {
    // Debounce pencarian untuk mengurangi panggilan API yang berlebihan
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        fetchOrangTuaData(); // Reset ke daftar lengkap ketika pencarian kosong
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fungsi untuk mengambil semua data orang tua
  const fetchOrangTuaData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await OrangTuaService.getOrangTuaList();
      setOrangTuaList(data);
      setError(null);
    } catch (err) {
      console.error("Gagal mengambil data orang tua:", err);
      setError("Gagal memuat data orang tua");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menangani pencarian
  const handleSearch = async (query: string): Promise<void> => {
    setIsLoading(true);
    try {
      const results = await OrangTuaService.searchOrangTua(query);
      setOrangTuaList(results);
      setError(null);
    } catch (err) {
      console.error("Gagal mencari orang tua:", err);
      setError("Gagal mencari orang tua");
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
      <h1 className="text-dark font-bold">Orang Tua Asuh Saya</h1>

      <Input
        placeholder="Cari orang tua"
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

      {!isLoading && orangTuaList.length === 0 && (
        <p className="text-dark mt-[125px] text-center text-[24px] font-bold md:text-[32px]">
          Tidak ada orang tua yang ditemukan
        </p>
      )}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] md:gap-6">
        {orangTuaList.map((orangTua) => (
          <OrangTuaCard
            key={orangTua.id}
            name={orangTua.name}
            smt={orangTua.smt}
            faculty={orangTua.faculty}
            money={orangTua.money}
            link={orangTua.link}
          />
        ))}
      </section>
    </div>
  );
}

export default DaftarOrangTua;
