import { Button } from "@/components/ui/button";

function OTACard({
  name = "Name not found",
  phoneNumber = "000000000",
  link = "/profile/not-found",
}: {
  name: string;
  phoneNumber: string;
  link: string;
}) {
  return (
    <div className="flex h-fit w-full min-w-[330px] flex-col gap-[18px] rounded-[12px] bg-white px-6 py-6 shadow-[0_0_6px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col gap-2">
        {/* Name and phoneNumber */}
        <div className="flex flex-col justify-between">
          <h5 className="text-[20px] font-bold text-black">
            {name
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
              .slice(0, 20) + (name.length > 20 ? "..." : "")}
          </h5>
        </div>
        {/* Nomor Telepon */}
        <div className="flex items-center gap-2">
          <img
            src="/icon/Type=phone.svg"
            alt="phone"
            className="mr-2 inline-block h-6 w-6"
          />
          <span className="text-dark/80 text-[14px] font-medium">
            {phoneNumber}
          </span>
        </div>
      </div>
      {/* Button */}
      <div className="w-full">
        <Button
          variant={"outline"}
          onClick={() => (window.location.href = link)}
          className="h-10 w-full text-sm"
        >
          Lihat Profil
        </Button>
      </div>
    </div>
  );
}

export default OTACard;