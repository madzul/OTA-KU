import { api } from "@/api/client";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import React, { JSX, useState } from "react";

import OTACard from "./card";

// Response data dari API
interface OTAResponse {
  accountId: string;
  name: string;
  phoneNumber: string;
  nominal: number;
}

// Data OTA yang akan ditampilkan di UI
interface OTA {
  id: string;
  name: string;
  phoneNumber: string;
  nominal: number;
  link: string;
}

// TODO: FIKSASI DATA BELUM AMA IOM

const mapApiDataToOTA = (apiData: OTAResponse[]): OTA[] => {
  return apiData.map((item) => ({
    id: item.accountId.substring(3, 5),
    name: item.name,
    phoneNumber: item.phoneNumber,
    nominal: item.nominal,
    link: `/profil/${item.accountId}`,
  }));
};

function DaftarOTA(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Gunakan useQuery untuk fetch data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["listOTAMahasiswa", searchQuery],
    queryFn: () =>
      api.list.listOtaKu({
        q: searchQuery,
        page: 1,
      }),
    staleTime: 5 * 60 * 1000, // 5 menit

    select: (response) => {
      // Transform data API ke format UI
      if (response.success && response.body && response.body.data) {
        return mapApiDataToOTA(response.body.data);
      }
      return [];
    },
  });

  // Menangani perubahan input dengan debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const OTAList = data || [];

  // Handle error message
  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : "Gagal memuat data orang tua asuh"
    : null;

  return (
    <div className="flex flex-col gap-4 text-[32px] md:gap-8">
      <h1 className="text-dark font-bold">Orang Tua Asuh Saya</h1>

      <div className="w-full">
        <Input
          placeholder="Cari Orang Tua"
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

      {!isLoading && OTAList.length === 0 && (
        <div className="flex items-center justify-center py-16">
          <p className="text-dark text-center text-2xl font-bold md:text-3xl">
            Tidak ada Orang Tua yang ditemukan
          </p>
        </div>
      )}

      <section
        className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
      >
        {OTAList.map((orangtua_asuh) => (
          <OTACard
            key={orangtua_asuh.id}
            name={orangtua_asuh.name}
            phoneNumber={orangtua_asuh.phoneNumber}
            nominal={orangtua_asuh.nominal}
            link={orangtua_asuh.link}
          />
        ))}
      </section>
    </div>
  );
}

export default DaftarOTA;
