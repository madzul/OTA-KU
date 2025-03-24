import React from "react";

import MahasiswaCard from "./card";
import { Input } from "./ui/input";

function DaftarMahasiswa() {
  const DataMahasiswa = [
    {
      name: "John Doe",
      smt: 5,
      faculty: "STEI-K Teknik Informatika",
      money: 1000000,
      link: "/_app/profile/",
    },
    {
      name: "John Doe",
      smt: 5,
      faculty: "STEI-K Teknik Informatika",
      money: 1000000,
      link: "/_app/profile/",
    },
    {
      name: "John Doe",
      smt: 5,
      faculty: "STEI-K Teknik Informatika",
      money: 1000000,
      link: "/_app/profile/",
    },
    {
      name: "John Doe",
      smt: 5,
      faculty: "STEI-K Teknik Informatika",
      money: 1000000,
      link: "/_app/profile/",
    },
    {
      name: "John Doe",
      smt: 5,
      faculty: "STEI-K Teknik Informatika",
      money: 1000000,
      link: "/_app/profile/",
    },
    {
      name: "John Doe",
      smt: 5,
      faculty: "STEI-K Teknik Informatika",
      money: 1000000,
      link: "/_app/profile/",
    },
    {
      name: "John Doe",
      smt: 5,
      faculty: "STEI-K Teknik Informatika",
      money: 1000000,
      link: "/_app/profile/",
    },
    {
      name: "John Doe",
      smt: 5,
      faculty: "STEI-K Teknik Informatika",
      money: 1000000,
      link: "/_app/profile/",
    },
    {
      name: "John Doe",
      smt: 5,
      faculty: "STEI-K Teknik Informatika",
      money: 1000000,
      link: "/_app/profile/",
    },
  ];
  return (
    <div className="flex flex-col gap-4 text-[32px] md:gap-8">
      <h1 className="text-dark font-bold">Mahasiswa Asuh Saya</h1>
      <Input placeholder="Cari mahasiswa" />
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] md:gap-6">
        {DataMahasiswa.map((mahasiswa, index) => (
          <MahasiswaCard
            key={index}
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
