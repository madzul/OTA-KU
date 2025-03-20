import { createFileRoute } from "@tanstack/react-router";

// import FirstRegister from "./-components/FirstRegister";
// import SecondRegister from "./-components/SecondRegister";
import ThirdRegister from "./-components/ThirdRegister";

// import FirstRegister from "./components/first-register";

export const Route = createFileRoute("/auth/register/orang-tua/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    // Navigasi antar stepnya belom
    <div className="md:px-auto min-h-[100vh] bg-[#F3F4F6] px-9 pt-16 pb-16">
      {/* <FirstRegister /> */}
      {/* <SecondRegister /> */}
      <ThirdRegister />
    </div>
  );
}
