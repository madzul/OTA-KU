import React from "react";

import { Button } from "../../../../../components/ui/button";

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
    <div className="flex w-[150px] flex-col gap-2 rounded-[12px] bg-white px-3 py-3 shadow-[0_0_4px_rgba(0,0,0,0.2)] md:h-[220px] md:w-[330px] md:gap-[18px] md:px-6 md:py-6">
      <div className="flex flex-col gap-2">
        {/* Name and smt */}
        <div className="flex flex-col justify-center md:flex-row md:items-center md:justify-between">
          <h5 className="text-base font-bold text-black md:text-[20px]">
            {name
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </h5>
          <span className="bg-dark/20 text-dark h-fit w-fit rounded-[4.58px] px-3 py-1 text-[8px] font-medium md:text-[14px]">
            Semester {smt}
          </span>
        </div>
        {/* Fakultas */}
        <span className="text-[10px] font-medium text-black/70 md:text-[14px]">
          {faculty}
        </span>
      </div>

      {/* Bantuan */}
      <div className="flex flex-col">
        <span className="text-[12px] text-black/80 md:text-[14px]">
          Bantuan Dibutuhkan
        </span>
        <span className="text-[12px] font-bold text-black md:text-[20px]">
          Rp.{money.toLocaleString("id-ID")}
        </span>
      </div>

      {/* Button */}
      <div className="flex w-full flex-col gap-2 md:flex-row md:justify-between">
        <Button
          variant={"outline"}
          onClick={() => (window.location.href = link)}
          className="h-8 w-full text-[12px] md:h-10 md:max-w-[130px] md:text-sm"
        >
          Lihat Profil
        </Button>
        <Button className="h-8 w-full text-[12px] md:h-10 md:max-w-[130px] md:text-sm">
          Bantu
        </Button>
      </div>
    </div>
  );
}

export default MahasiswaCard;
