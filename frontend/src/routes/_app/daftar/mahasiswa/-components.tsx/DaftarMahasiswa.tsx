import React, { useEffect, useState } from "react";

import { Input } from "../../../../../components/ui/input";
import MahasiswaCard from "./card";
import { LoaderCircle } from "lucide-react";

// API service mock - This would be in a separate file in a real app
const MahasiswaService = {
  // Mock function to simulate fetching data from an API
  getMahasiswaList: async () => {
    // This would be a real API call in production
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

  // Search function that would call an API endpoint with search params
  searchMahasiswa: async (query) => {
    // This would be a real API call with search parameters in production
    // For now, we'll just get the full list and filter it
    const data = await MahasiswaService.getMahasiswaList();

    // Filter the data based on the search query
    const filteredData = data.filter((mahasiswa) =>
      mahasiswa.name.toLowerCase().includes(query.toLowerCase()),
    );

    return filteredData;
  },
};

function DaftarMahasiswa() {
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load data when component mounts
  useEffect(() => {
    fetchMahasiswaData();
  }, []);

  // Effect for handling search
  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        fetchMahasiswaData(); // Reset to full list when search is empty
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Function to fetch all mahasiswa data
  const fetchMahasiswaData = async () => {
    setIsLoading(true);
    try {
      const data = await MahasiswaService.getMahasiswaList();
      setMahasiswaList(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching mahasiswa data:", err);
      setError("Gagal memuat data mahasiswa");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle search
  const handleSearch = async (query) => {
    setIsLoading(true);
    try {
      const results = await MahasiswaService.searchMahasiswa(query);
      setMahasiswaList(results);
      setError(null);
    } catch (err) {
      console.error("Error searching mahasiswa:", err);
      setError("Gagal mencari mahasiswa");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
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
          <div className="flex items-center justify-center animate-spin">
            <LoaderCircle />
          </div>
          <p className="text-dark text-center text-base font-medium">
            Sedang Memuat Data...
          </p>
        </div>
      )}

      {error && <p className="text-base text-red-500">{error}</p>}

      {!isLoading && mahasiswaList.length === 0 && (
        <p className="text-base">Tidak ada mahasiswa yang ditemukan</p>
      )}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] md:gap-6">
        {mahasiswaList.map((mahasiswa, index) => (
          <MahasiswaCard
            key={mahasiswa.id || index}
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
