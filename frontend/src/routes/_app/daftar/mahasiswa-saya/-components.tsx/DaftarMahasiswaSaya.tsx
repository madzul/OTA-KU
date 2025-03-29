import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";

import { Input } from "../../../../../components/ui/input";
import MahasiswaCard from "./card";

// API service mock - This would be in a separate file in a real app
const MahasiswaService = {
  // Mock function to fetch active students
  getMahasiswaAktifList: async () => {
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
    ]);
  },

  // Mock function to fetch non-active students
  getMahasiswaNonAktifList: async () => {
    // This would be a real API call in production
    return Promise.resolve([
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

  // Search function for active students
  searchMahasiswaAktif: async (query) => {
    // This would be a real API call with search parameters in production
    const data = await MahasiswaService.getMahasiswaAktifList();

    // Filter the data based on the search query
    const filteredData = data.filter((mahasiswa) =>
      mahasiswa.name.toLowerCase().includes(query.toLowerCase())
    );

    return filteredData;
  },

  // Search function for non-active students
  searchMahasiswaNonAktif: async (query) => {
    // This would be a real API call with search parameters in production
    const data = await MahasiswaService.getMahasiswaNonAktifList();

    // Filter the data based on the search query
    const filteredData = data.filter((mahasiswa) =>
      mahasiswa.name.toLowerCase().includes(query.toLowerCase())
    );

    return filteredData;
  },
};

function DaftarMahasiswaSaya() {
  const [activeTab, setActiveTab] = useState("aktif");
  const [mahasiswaAktif, setMahasiswaAktif] = useState([]);
  const [mahasiswaNonAktif, setMahasiswaNonAktif] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load data when component mounts
  useEffect(() => {
    fetchMahasiswaAktif();
    fetchMahasiswaNonAktif();
  }, []);

  // Effect for handling search
  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        if (activeTab === "aktif") {
          handleSearchAktif(searchQuery);
        } else {
          handleSearchNonAktif(searchQuery);
        }
      } else {
        // Reset to full list when search is empty
        if (activeTab === "aktif") {
          fetchMahasiswaAktif();
        } else {
          fetchMahasiswaNonAktif();
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeTab]);

  // Function to fetch active mahasiswa data
  const fetchMahasiswaAktif = async () => {
    if (activeTab === "aktif") {
      setIsLoading(true);
    }
    try {
      const data = await MahasiswaService.getMahasiswaAktifList();
      setMahasiswaAktif(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching active mahasiswa data:", err);
      if (activeTab === "aktif") {
        setError("Gagal memuat data mahasiswa aktif");
      }
    } finally {
      if (activeTab === "aktif") {
        setIsLoading(false);
      }
    }
  };

  // Function to fetch non-active mahasiswa data
  const fetchMahasiswaNonAktif = async () => {
    if (activeTab === "non-aktif") {
      setIsLoading(true);
    }
    try {
      const data = await MahasiswaService.getMahasiswaNonAktifList();
      setMahasiswaNonAktif(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching non-active mahasiswa data:", err);
      if (activeTab === "non-aktif") {
        setError("Gagal memuat data mahasiswa non-aktif");
      }
    } finally {
      if (activeTab === "non-aktif") {
        setIsLoading(false);
      }
    }
  };

  // Function to handle search for active students
  const handleSearchAktif = async (query) => {
    setIsLoading(true);
    try {
      const results = await MahasiswaService.searchMahasiswaAktif(query);
      setMahasiswaAktif(results);
      setError(null);
    } catch (err) {
      console.error("Error searching active mahasiswa:", err);
      setError("Gagal mencari mahasiswa aktif");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle search for non-active students
  const handleSearchNonAktif = async (query) => {
    setIsLoading(true);
    try {
      const results = await MahasiswaService.searchMahasiswaNonAktif(query);
      setMahasiswaNonAktif(results);
      setError(null);
    } catch (err) {
      console.error("Error searching non-active mahasiswa:", err);
      setError("Gagal mencari mahasiswa non-aktif");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchQuery(""); // Reset search when changing tabs
  };

  // Get current data based on active tab
  const currentData = activeTab === "aktif" ? mahasiswaAktif : mahasiswaNonAktif;

  return (
    <div className="flex flex-col gap-4 text-[32px] md:gap-8">
      <h1 className="text-dark font-bold">Mahasiswa Asuh Saya</h1>
      <Tabs defaultValue="aktif" className="w-full" onValueChange={handleTabChange}>
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
            <p className="text-base">Tidak ada mahasiswa aktif yang ditemukan</p>
          )}

          <section className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] md:gap-6">
            {mahasiswaAktif.map((mahasiswa, index) => (
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
        </TabsContent>
        <TabsContent value="non-aktif" className="mt-4">
          <Input
            placeholder="Cari mahasiswa non-aktif"
            value={searchQuery}
            onChange={handleInputChange}
          />

          {isLoading && <p className="text-base">Memuat data...</p>}

          {error && <p className="text-base text-red-500">{error}</p>}

          {!isLoading && mahasiswaNonAktif.length === 0 && (
            <p className="text-base">Tidak ada mahasiswa non-aktif yang ditemukan</p>
          )}

          <section className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] md:gap-6">
            {mahasiswaNonAktif.map((mahasiswa, index) => (
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DaftarMahasiswaSaya;