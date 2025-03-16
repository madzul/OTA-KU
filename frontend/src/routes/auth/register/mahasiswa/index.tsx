import { createFileRoute } from "@tanstack/react-router";

import FirstRegister from "./-components/FirstRegister";

// import SecondRegister from "./-components/SecondRegister";

export const Route = createFileRoute("/auth/register/mahasiswa/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="md:px-auto min-h-[100vh] bg-[#F3F4F6] px-9 pt-16 pb-16">
      {/* Navigasi antar pagenya belom */}
      <FirstRegister />
      {/* <SecondRegister /> */}
    </div>
  );
}
