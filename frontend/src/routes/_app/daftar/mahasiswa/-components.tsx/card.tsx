import { Button } from "@/components/ui/button";

function MahasiswaCard({
  name = "Name not found",
  smt = 0,
  faculty = "faculty not found",
  link = "/profile/not-found",
}: {
  name: string;
  smt: string;
  faculty: string;
  link: string;
}) {
  return (
    <div className="flex h-fit min-w-[330px] w-full flex-col gap-[18px] rounded-[12px] bg-white px-6 py-6 shadow-[0_0_6px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col gap-2">
        {/* Name and smt */}
        <div className="flex flex-col justify-between">
          <h5 className="text-[20px] font-bold text-black">
            {name
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
              .slice(0, 20) + (name.length > 20 ? "..." : "")}
          </h5>
          <span className="bg-dark/20 text-dark h-fit w-fit rounded-[4.58px] px-3 py-1 text-[14px] font-medium">
            Semester {smt}
          </span>
        </div>
        {/* Fakultas */}
        <span className="text-[14px] font-medium text-black/70">{faculty}</span>
      </div>

      {/* Bantuan */}
      {/* <div className="flex flex-col">
        <span className="text-[14px] text-black/80">Bantuan Dibutuhkan</span>
        <span className="text-[20px] font-bold text-black">
          Rp.{money.toLocaleString("id-ID")}
        </span>
      </div> */}

      {/* Button */}
      <div className="flex w-full flex-row justify-between gap-4">
        <Button
          variant={"outline"}
          onClick={() => (window.location.href = link)}
          className="h-10 w-full max-w-[130px] text-sm"
        >
          Lihat Profil
        </Button>
        <Button className="h-10 w-full max-w-[130px] text-sm">Bantu</Button>
      </div>
    </div>
  );
}

export default MahasiswaCard;
