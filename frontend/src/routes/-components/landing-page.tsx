import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

function LandingPage() {
  return (
    <div className="h-[calc(100vh-70px-64px)] lg:h-[calc(100vh-96px-64px)]">
      <section className="flex h-full flex-col items-center justify-center gap-10 lg:gap-15">
        {/* Text and icon */}
        <div className="flex flex-col items-center gap-6 lg:flex-row-reverse lg:gap-15 xl:gap-30">
          {/* Icon */}
          <img
            src="/icon/logo-basic.png"
            alt="landing page"
            className="w-[140px] lg:w-[330px]"
          />
          {/* Text */}
          <div className="text-dark flex flex-col gap-2">
            <h1 className="text-center text-[32px] font-bold lg:text-justify lg:text-[50px]">
              Bantuan Orang Tua Asuh (BOTA)
            </h1>
            <p className="w-full max-w-[700px] text-justify text-sm opacity-80 lg:max-w-[845px] lg:text-2xl">
              BOTA adalah program bantuan pendidikan bagi mahasiswa ITB yang
              mengalami kendala finansial. Melalui kolaborasi bersama IOM ITB,
              Anda bisa berperan sebagai Orang Tua Asuh—baik secara individu
              maupun lembaga—untuk memberikan dukungan berupa dana UKT, biaya
              hidup, atau keperluan akademik lainnya.
            </p>
          </div>
        </div>
        {/* Button */}
        <Button
          variant={"outline"}
          size={"xl"}
          className="w-[350px]"
          asChild
        >
          <Link to="/auth/login">Bergabung Sekarang</Link>
        </Button>
      </section>
    </div>
  );
}

export default LandingPage;
