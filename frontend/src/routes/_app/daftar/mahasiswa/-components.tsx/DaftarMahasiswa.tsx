import { api } from "@/api/client";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Filter, X } from "lucide-react";
import React, { JSX, useState, useEffect } from "react";
// import MahasiswaCard from "./card";
import { getNimJurusanCodeMap, getNimFakultasFromNimJurusanMap, getNimFakultasCodeMap } from "@/lib/nim";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface MahasiswaResponse {
  accountId: string;
  name: string;
  nim: string;
  mahasiswaStatus: "active" | "inactive";
  description: string;
  file: string;
}

interface Mahasiswa {
  id: string;
  name: string;
  angkatan: string;
  jurusan: string;
  fakultas: string;
  jurusanCode: string;
  fakultasCode: string;
  link: string;
}

const mapApiDataToMahasiswa = (apiData: MahasiswaResponse[]): Mahasiswa[] => {
  const nimJurusanCodeMap = getNimJurusanCodeMap();
  const nimFakultasFromJurusanMap = getNimFakultasFromNimJurusanMap();
  const nimFakultasCodeMap = getNimFakultasCodeMap();

  return apiData.map((item) => {
    const jurusanCode = item.nim.substring(0, 3);
    const fakultasCode = nimFakultasFromJurusanMap[jurusanCode] || "";
    
    const jurusan = nimJurusanCodeMap[jurusanCode] || "Jurusan tidak diketahui";
    const fakultas = nimFakultasCodeMap[fakultasCode] || "Fakultas tidak diketahui";
    
    return {
      id: item.accountId,
      name: item.name,
      angkatan: "20" + item.nim.substring(3, 5),
      jurusan: jurusan as string,
      fakultas: fakultas as string,
      jurusanCode,
      fakultasCode,
      link: `/profil/${item.accountId}`,
    };
  });
};

const getAngkatanOptions = (): string[] => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 10;
  
  return Array.from({ length: 11 }, (_, index) => {
    return (startYear + index).toString();
  });
};

function DaftarMahasiswa(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<{
    fakultas: string[];
    jurusan: string[];
    angkatan: string[];
  }>({
    fakultas: [],
    jurusan: [],
    angkatan: [],
  });
  
  const [availableJurusan, setAvailableJurusan] = useState<{ code: string; name: string }[]>([]);
  
  const fakultasOptions = Object.entries(getNimFakultasCodeMap()).map(([code, name]) => ({
    code,
    name: name as string,
  }));
  
  const allJurusan = Object.entries(getNimJurusanCodeMap()).map(([code, name]) => ({
    code,
    name: name as string,
  }));
  
  const angkatanOptions = getAngkatanOptions();
  
  useEffect(() => {
    const nimFakultasFromJurusanMap = getNimFakultasFromNimJurusanMap();
    
    if (filters.fakultas.length === 0) {
      setAvailableJurusan(allJurusan);
    } else {
      const filteredJurusan = allJurusan.filter((jurusan) => {
        const fakultasCode = nimFakultasFromJurusanMap[jurusan.code] || "";
        return filters.fakultas.includes(fakultasCode);
      });
      setAvailableJurusan(filteredJurusan);
    }
  }, [filters.fakultas]);
  
  const activeFilterCount = filters.fakultas.length + filters.jurusan.length + filters.angkatan.length;
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["listMahasiswaOta", searchQuery],
    queryFn: () =>
      api.list.listMahasiswaOta({
        q: searchQuery,
        page: 1,
      }),
    staleTime: 5 * 60 * 1000,
    select: (response) => {
      if (response.success && response.body && response.body.data) {
        return mapApiDataToMahasiswa(response.body.data);
      }
      return [];
    },
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };
  
  const toggleFakultasFilter = (fakultasCode: string) => {
    setFilters((prev) => {
      const newFakultas = prev.fakultas.includes(fakultasCode)
        ? prev.fakultas.filter((code) => code !== fakultasCode)
        : [...prev.fakultas, fakultasCode];
      
      if (prev.fakultas.includes(fakultasCode)) {
        const nimFakultasFromJurusanMap = getNimFakultasFromNimJurusanMap();
        const jurusanToRemove = Object.entries(nimFakultasFromJurusanMap)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([_, fakCode]) => fakCode === fakultasCode)
          .map(([jurCode]) => jurCode);
        
        return {
          ...prev,
          fakultas: newFakultas,
          jurusan: prev.jurusan.filter((code) => !jurusanToRemove.includes(code)),
        };
      }
      
      return {
        ...prev,
        fakultas: newFakultas,
      };
    });
  };
  
  const toggleJurusanFilter = (jurusanCode: string) => {
    setFilters((prev) => ({
      ...prev,
      jurusan: prev.jurusan.includes(jurusanCode)
        ? prev.jurusan.filter((code) => code !== jurusanCode)
        : [...prev.jurusan, jurusanCode],
    }));
  };
  
  const toggleAngkatanFilter = (angkatan: string) => {
    setFilters((prev) => ({
      ...prev,
      angkatan: prev.angkatan.includes(angkatan)
        ? prev.angkatan.filter((year) => year !== angkatan)
        : [...prev.angkatan, angkatan],
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      fakultas: [],
      jurusan: [],
      angkatan: [],
    });
  };
  
  const filteredMahasiswa = (data || []).filter((mahasiswa) => {
    const matchesFakultas = filters.fakultas.length === 0 || filters.fakultas.includes(mahasiswa.fakultasCode);
    const matchesJurusan = filters.jurusan.length === 0 || filters.jurusan.includes(mahasiswa.jurusanCode);
    const matchesAngkatan = filters.angkatan.length === 0 || filters.angkatan.includes(mahasiswa.angkatan);
    
    return matchesFakultas && matchesJurusan && matchesAngkatan;
  });
  
  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : "Gagal memuat data mahasiswa"
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cari Mahasiswa</h1>
        <p className="text-gray-600">Temukan mahasiswa berdasarkan nama, fakultas, jurusan, atau angkatan</p>
      </div>
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Input
              placeholder="Cari berdasarkan nama atau NIM..."
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full pl-10 h-12"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-12 gap-2">
                <Filter size={18} /> 
                Filter
                {activeFilterCount > 0 && (
                  <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md">
              <SheetHeader className="border-b pb-6">
                <SheetTitle className="text-xl">Filter Mahasiswa</SheetTitle>
              </SheetHeader>
              
              <ScrollArea className="h-[calc(100vh-180px)] pr-4">
                <div className="py-4 space-y-6">
                  <div className="text-lg ml-6 xl:text-xl">
                    <h3 className="font-medium mb-3">Fakultas</h3>
                    <div className="space-y-3">
                      {fakultasOptions.map((fakultas) => (
                        <div key={fakultas.code} className="flex items-center space-x-3">
                          <Checkbox 
                            id={`fakultas-${fakultas.code}`} 
                            checked={filters.fakultas.includes(fakultas.code)}
                            onCheckedChange={() => toggleFakultasFilter(fakultas.code)}
                          />
                          <label 
                            htmlFor={`fakultas-${fakultas.code}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:cursor-pointer"
                          >
                            {fakultas.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-lg ml-6 xl:text-xl">
                    <h3 className="font-medium text-lg mb-3">Jurusan</h3>
                    {availableJurusan.length > 0 ? (
                      <div className="space-y-3">
                        {availableJurusan.map((jurusan) => (
                          <div key={jurusan.code} className="flex items-center space-x-3">
                            <Checkbox 
                              id={`jurusan-${jurusan.code}`} 
                              checked={filters.jurusan.includes(jurusan.code)}
                              onCheckedChange={() => toggleJurusanFilter(jurusan.code)}
                              disabled={filters.fakultas.length > 0 && !filters.fakultas.includes(
                                getNimFakultasFromNimJurusanMap()[jurusan.code]
                              )}
                            />
                            <label 
                              htmlFor={`jurusan-${jurusan.code}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:cursor-pointer"
                            >
                              {jurusan.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Pilih fakultas terlebih dahulu</p>
                    )}
                  </div>
                  
                  <div className="text-lg ml-6 xl:text-xl">
                    <h3 className="font-medium text-lg mb-3">Angkatan</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {angkatanOptions.map((angkatan) => (
                        <div key={angkatan} className="flex items-center space-x-3">
                          <Checkbox 
                            id={`angkatan-${angkatan}`} 
                            checked={filters.angkatan.includes(angkatan)}
                            onCheckedChange={() => toggleAngkatanFilter(angkatan)}
                          />
                          <label 
                            htmlFor={`angkatan-${angkatan}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:cursor-pointer"
                          >
                            {angkatan}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <SheetFooter className="flex flex-row justify-between gap-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="flex-1"
                >
                  Reset Filter
                </Button>
                <SheetClose asChild>
                  <Button className="flex-1">Terapkan</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Active filters */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.fakultas.map((fakultasCode) => {
              const fakultasName = fakultasOptions.find(f => f.code === fakultasCode)?.name;
              return (
                <Badge 
                  key={fakultasCode} 
                  variant="outline" 
                  className="flex items-center gap-1 py-1 px-3 rounded-full"
                >
                  <span className="text-sm">Fakultas: {fakultasName}</span>
                  <button
                    onClick={() => toggleFakultasFilter(fakultasCode)}
                    className="ml-1 rounded-full hover:bg-gray-100 p-0.5"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              );
            })}
            
            {filters.jurusan.map((jurusanCode) => {
              const jurusanName = allJurusan.find(j => j.code === jurusanCode)?.name;
              return (
                <Badge 
                  key={jurusanCode} 
                  variant="outline" 
                  className="flex items-center gap-1 py-1 px-3 rounded-full"
                >
                  <span className="text-sm">Jurusan: {jurusanName}</span>
                  <button
                    onClick={() => toggleJurusanFilter(jurusanCode)}
                    className="ml-1 rounded-full hover:bg-gray-100 p-0.5"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              );
            })}
            
            {filters.angkatan.map((angkatan) => (
              <Badge 
                key={angkatan} 
                variant="outline" 
                className="flex items-center gap-1 py-1 px-3 rounded-full"
              >
                <span className="text-sm">Angkatan: {angkatan}</span>
                <button
                  onClick={() => toggleAngkatanFilter(angkatan)}
                  className="ml-1 rounded-full hover:bg-gray-100 p-0.5"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600 font-medium">{errorMessage}</p>
          <Button 
            variant="ghost" 
            className="mt-4 text-red-600 hover:bg-red-100"
            onClick={() => window.location.reload()}
          >
            Coba Lagi
          </Button>
        </div>
      ) : filteredMahasiswa.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-lg border border-dashed bg-gray-50">
          <svg
            className="h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada hasil</h3>
          <p className="text-gray-500 text-sm">
            {searchQuery ? 
              `Tidak ditemukan mahasiswa dengan kata kunci "${searchQuery}"` : 
              "Tidak ada mahasiswa yang sesuai dengan filter"}
          </p>
          {searchQuery && (
            <Button 
              variant="ghost" 
              className="mt-4"
              onClick={() => setSearchQuery("")}
            >
              Hapus pencarian
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Menampilkan <span className="font-medium">{filteredMahasiswa.length}</span> mahasiswa
            </p>
            {activeFilterCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="text-gray-600 hover:text-gray-900"
              >
                Hapus semua filter
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* {filteredMahasiswa.map((mahasiswa) => (
              <MahasiswaCard
                key={mahasiswa.id}
                name={mahasiswa.name}
                angkatan={mahasiswa.angkatan}
                faculty={mahasiswa.jurusan}
                link={mahasiswa.link}
                id={mahasiswa.id}
              />
            ))} */}
          </div>
        </>
      )}
    </div>
  );
}

export default DaftarMahasiswa;