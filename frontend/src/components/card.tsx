import React from "react";

import { Button } from "./ui/button";

function MahasiswaCard({
  name = "John Doe",
  smt = 5,
  faculty = "STEI-K Teknik Informatika",
  money = 1000000,
  link = "/_app/profile/",
}: {
  name: string;
  smt: number;
  faculty: string;
  money: number;
  link: string;
}) {
  return (
    <div className="flex w-[150px] flex-col gap-2 rounded-[12px] bg-white px-3 py-2 shadow-[0_0_4px_rgba(0,0,0,0.2)]">
      <div className="flex flex-col gap-2">
        {/* Name and smt */}
        <div className="flex flex-col justify-center">
          <h5 className="text-base font-bold text-black">
            {name
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </h5>
          <span className="bg-dark/20 text-dark w-fit rounded-[4.58px] px-3 py-1 text-[8px] font-medium">
            Semester {smt}
          </span>
        </div>
        {/* Fakultas */}
        <span className="text-[10px] font-medium text-black/70">{faculty}</span>
      </div>

      {/* Bantuan */}
      <div className="flex flex-col">
        <span className="text-[8px] text-black/80">Bantuan Dibutuhkan</span>
        <span className="text-[12px] font-bold text-black">
          Rp.{money.toLocaleString("id-ID")}
        </span>
      </div>

      {/* Button */}
      <div className="flex w-full flex-col gap-2">
        <Button
          variant={"outline"}
          onClick={() => (window.location.href = link)}
          className="h-5 w-full text-[6px]"
        >
          Lihat Profil
        </Button>
        <Button variant={"secondary"} className="h-5 w-full text-[6px]">
          Bantu
        </Button>
      </div>
    </div>
  );
}

export default MahasiswaCard;
