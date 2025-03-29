import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { JSX, useEffect, useState } from "react";

import { Input } from "../../../../../components/ui/input";
import MahasiswaCard from "./card";
import { LoaderCircle } from "lucide-react";

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
  // Fungsi untuk mengambil daftar mahasiswa aktif
  getMahasiswaAktifList: async (): Promise<Mahasiswa[]> => {
    // Pada implementasi sebenarnya, ini akan memanggil API backend
    return Promise.resolve([
      {
        id: "m001",
        name: "John Doe",
        smt: 5,
        faculty: "STEI-K Teknik Informatika",
        money: 1000000,
        link: "/mahasiswa/profile/m001",
      },
      {
        id: "m002",
        name: "Jane Smith",
        smt: 3,
        faculty: "STEI-K Teknik Informatika",
        money: 950000,
        link: "/mahasiswa/profile/m002",
      },
      {
        id: "m003",
        name: "Ahmad Fauzi",
        smt: 7,
        faculty: "FTTM Teknik Pertambangan",
        money: 1200000,
        link: "/mahasiswa/profile/m003",
      },
      {
        id: "m004",
        name: "Siti Rahayu",
        smt: 4,
        faculty: "FTSL Teknik Lingkungan",
        money: 875000,
        link: "/mahasiswa/profile/m004",
      },
      {
        id: "m005",
        name: "Michael Wong",
        smt: 2,
        faculty: "FTI Teknik Kimia",
        money: 1150000,
        link: "/mahasiswa/profile/m005",
      },
    ]);
  },

  // Fungsi untuk mengambil daftar mahasiswa non-aktif
  getMahasiswaNonAktifList: async (): Promise<Mahasiswa[]> => {
    // Pada implementasi sebenarnya, ini akan memanggil API backend
    return Promise.resolve([
      {
        id: "m006",
        name: "Devi Putri",
        smt: 6,
        faculty: "FMIPA Matematika",
        money: 925000,
        link: "/mahasiswa/profile/m006",
      },
      {
        id: "m007",
        name: "Budi Santoso",
        smt: 5,
        faculty: "FTMD Teknik Mesin",
        money: 1050000,
        link: "/mahasiswa/profile/m007",
      },
      {
        id: "m008",
        name: "Anisa Rahma",
        smt: 3,
        faculty: "FSRD Desain Interior",
        money: 980000,
        link: "/mahasiswa/profile/m008",
      },
      {
        id: "m009",
        name: "Reza Pratama",
        smt: 1,
        faculty: "STEI-K Teknik Elektro",
        money: 900000,
        link: "/mahasiswa/profile/m009",
      },
    ]);
  },

  // Fungsi pencarian untuk mahasiswa aktif
  searchMahasiswaAktif: async (query: string): Promise<Mahasiswa[]> => {
    // Pada implementasi sebenarnya, ini akan memanggil API backend dengan parameter pencarian
    const data = await MahasiswaService.getMahasiswaAktifList();

    // Filter data berdasarkan query pencarian
    const filteredData = data.filter((mahasiswa) =>
      mahasiswa.name.toLowerCase().includes(query.toLowerCase()),
    );

    return filteredData;
  },

  // Fungsi pencarian untuk mahasiswa non-aktif
  searchMahasiswaNonAktif: async (query: string): Promise<Mahasiswa[]> => {
    // Pada implementasi sebenarnya, ini akan memanggil API backend dengan parameter pencarian
    const data = await MahasiswaService.getMahasiswaNonAktifList();

    // Filter data berdasarkan query pencarian
    const filteredData = data.filter((mahasiswa) =>
      mahasiswa.name.toLowerCase().includes(query.toLowerCase()),
    );

    return filteredData;
  },
};

function DaftarMahasiswaSaya(): JSX.Element {
  const [activeTab, setActiveTab] = useState<"aktif" | "non-aktif">("aktif");
  const [mahasiswaAktif, setMahasiswaAktif] = useState<Mahasiswa[]>([]);
  const [mahasiswaNonAktif, setMahasiswaNonAktif] = useState<Mahasiswa[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Memuat data saat komponen pertama kali ditampilkan
  useEffect(() => {
    fetchMahasiswaAktif();
    fetchMahasiswaNonAktif();
  }, []);

  // Effect untuk menangani pencarian
  useEffect(() => {
    // Debounce pencarian untuk mengurangi panggilan API yang berlebihan
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        if (activeTab === "aktif") {
          handleSearchAktif(searchQuery);
        } else {
          handleSearchNonAktif(searchQuery);
        }
      } else {
        // Reset ke daftar lengkap ketika pencarian kosong
        if (activeTab === "aktif") {
          fetchMahasiswaAktif();
        } else {
          fetchMahasiswaNonAktif();
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeTab]);

  // Fungsi untuk mengambil data mahasiswa aktif
  const fetchMahasiswaAktif = async (): Promise<void> => {
    if (activeTab === "aktif") {
      setIsLoading(true);
    }
    try {
      const data = await MahasiswaService.getMahasiswaAktifList();
      setMahasiswaAktif(data);
      setError(null);
    } catch (err) {
      console.error("Gagal mengambil data mahasiswa aktif:", err);
      if (activeTab === "aktif") {
        setError("Gagal memuat data mahasiswa aktif");
      }
    } finally {
      if (activeTab === "aktif") {
        setIsLoading(false);
      }
    }
  };

  // Fungsi untuk mengambil data mahasiswa non-aktif
  const fetchMahasiswaNonAktif = async (): Promise<void> => {
    if (activeTab === "non-aktif") {
      setIsLoading(true);
    }
    try {
      const data = await MahasiswaService.getMahasiswaNonAktifList();
      setMahasiswaNonAktif(data);
      setError(null);
    } catch (err) {
      console.error("Gagal mengambil data mahasiswa non-aktif:", err);
      if (activeTab === "non-aktif") {
        setError("Gagal memuat data mahasiswa non-aktif");
      }
    } finally {
      if (activeTab === "non-aktif") {
        setIsLoading(false);
      }
    }
  };

  // Fungsi untuk menangani pencarian mahasiswa aktif
  const handleSearchAktif = async (query: string): Promise<void> => {
    setIsLoading(true);
    try {
      const results = await MahasiswaService.searchMahasiswaAktif(query);
      setMahasiswaAktif(results);
      setError(null);
    } catch (err) {
      console.error("Gagal mencari mahasiswa aktif:", err);
      setError("Gagal mencari mahasiswa aktif");
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menangani pencarian mahasiswa non-aktif
  const handleSearchNonAktif = async (query: string): Promise<void> => {
    setIsLoading(true);
    try {
      const results = await MahasiswaService.searchMahasiswaNonAktif(query);
      setMahasiswaNonAktif(results);
      setError(null);
    } catch (err) {
      console.error("Gagal mencari mahasiswa non-aktif:", err);
      setError("Gagal mencari mahasiswa non-aktif");
    } finally {
      setIsLoading(false);
    }
  };

  // Menangani perubahan input pencarian
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  // Menangani perubahan tab
  const handleTabChange = (value: "aktif" | "non-aktif"): void => {
    setActiveTab(value);
    setSearchQuery("");
  };

  // Mendapatkan data saat ini berdasarkan tab aktif
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   const currentData: Mahasiswa[] =
  //     activeTab === "aktif" ? mahasiswaAktif : mahasiswaNonAktif;

  return (
    <div className="flex flex-col gap-4 text-[32px] md:gap-8">
      <h1 className="text-dark font-bold">Mahasiswa Asuh Saya</h1>
      <Tabs
        defaultValue="aktif"
        className="w-full"
        onValueChange={(value) =>
          handleTabChange(value as "aktif" | "non-aktif")
        }
      >
        <TabsList className="w-full bg-black/10">
          <TabsTrigger
            value="aktif"
            className="data-[state=active]:text-dark data-[state=inactive]:text-white"
          >
            Aktif
          </TabsTrigger>
          <TabsTrigger
            value="non-aktif"
            className="data-[state=active]:text-dark data-[state=inactive]:text-white"
          >
            Non-Aktif
          </TabsTrigger>
        </TabsList>
        <TabsContent value="aktif" className="mt-4">
          <Input
            placeholder="Cari mahasiswa aktif"
            value={searchQuery}
            onChange={handleInputChange}
          />

          {isLoading && <p className="text-base">Memuat data...</p>}

          {error && <p className="text-base text-red-500">{error}</p>}

          {!isLoading && mahasiswaAktif.length === 0 && (
            <p className="text-dark mt-[125px] text-center text-[24px] font-bold md:text-[32px]">
              Tidak ada mahasiswa aktif yang ditemukan
            </p>
          )}

          <section className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] md:gap-6">
            {mahasiswaAktif.map((mahasiswa) => (
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
        </TabsContent>
        <TabsContent value="non-aktif" className="mt-4">
          <Input
            placeholder="Cari mahasiswa non-aktif"
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

          {!isLoading && mahasiswaNonAktif.length === 0 && (
            <p className="text-dark mt-[125px] text-center text-[24px] font-bold md:text-[32px]">
              Tidak ada mahasiswa non-aktif yang ditemukan
            </p>
          )}

          <section className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] md:gap-6">
            {mahasiswaNonAktif.map((mahasiswa) => (
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DaftarMahasiswaSaya;
