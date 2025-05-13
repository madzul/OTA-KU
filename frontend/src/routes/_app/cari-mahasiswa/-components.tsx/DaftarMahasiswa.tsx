import { api } from "@/api/client";
import { UserSchema } from "@/api/generated";
import { ClientPagination } from "@/components/client-pagination";
import Spinner from "@/components/loading-spinner";
import { Input } from "@/components/ui/input";
import { Fakultas, Jurusan } from "@/lib/nim";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import React, { JSX, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { Route } from "..";
import MahasiswaCard from "./mahasiswa-card";

function DaftarMahasiswa({ session }: { session: UserSchema }): JSX.Element {
  const navigate = useNavigate({ from: Route.fullPath });
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const page = parseInt(searchParams.get("page") ?? "1") || 1;

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [value] = useDebounce(searchQuery, 500);
  const [major, setMajor] = useState<Jurusan>();
  const [faculty, setFaculty] = useState<Fakultas>();
  const [gender, setGender] = useState<"M" | "F">();
  const [religion, setReligion] = useState<
    "Islam" | "Kristen Protestan" | "Hindu" | "Buddha" | "Katolik" | "Konghucu"
  >();

  // Gunakan useQuery untuk fetch data
  const { data, isLoading } = useQuery({
    queryKey: [
      "listMahasiswaOta",
      page,
      value,
      faculty,
      gender,
      major,
      religion,
    ],
    queryFn: () =>
      api.list.listMahasiswaOta({
        q: value,
        page,
        faculty,
        gender,
        major,
        religion,
      }),
  });

  // Menangani perubahan input dengan debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (value || faculty || gender || major || religion) {
      navigate({
        search: () => ({
          page: 1,
        }),
      });
    }
  }, [value, faculty, gender, major, religion, navigate]);

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
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
          <p className="text-dark text-center text-base font-medium">
            Sedang Memuat Data...
          </p>
        </div>
      )}

      {!isLoading && data?.body.data.length === 0 && (
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
        {data?.body.data.map((mahasiswa) => (
          <MahasiswaCard
            key={mahasiswa.accountId}
            mahasiswa={mahasiswa}
            session={session}
            queries={{
              page,
              value,
              faculty,
              major,
              gender,
              religion,
            }}
          />
        ))}
      </section>

      <ClientPagination total={data?.body.totalData || 0} totalPerPage={6} />
    </div>
  );
}

export default DaftarMahasiswa;
