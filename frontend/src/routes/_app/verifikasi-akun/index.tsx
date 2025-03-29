import { api } from "@/api/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

import MahasiswaAsuhContent from "./-components/mahasiswa-asuh-content";
import OrangTuaAsuhContent from "./-components/orang-tua-asuh-content";

export const Route = createFileRoute("/_app/verifikasi-akun/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const user = await api.auth.verif().catch(() => null);
    if (user?.body.type !== "admin") {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  const [value, setValue] = useState("mahasiswa");

  return (
    <main className="flex min-h-[calc(100vh-96px)] w-full flex-col gap-4">
      {value === "mahasiswa" ? (
        <h1 className="text-dark text-3xl font-bold md:text-[50px]">
          Verifikasi Pendaftaran Mahasiswa Asuh
        </h1>
      ) : (
        <h1 className="text-dark text-3xl font-bold md:text-[50px]">
          Verifikasi Pendaftaran Orang Tua Asuh
        </h1>
      )}
      <Tabs defaultValue="mahasiswa" className="flex w-full flex-col gap-4">
        <TabsList className="w-full bg-[#BBBAB8]">
          <TabsTrigger
            value="mahasiswa"
            className="data-[state=active]:text-dark text-base font-bold text-white data-[state=active]:bg-white"
            onClick={() => setValue("mahasiswa")}
          >
            Mahasiswa Asuh
          </TabsTrigger>
          <TabsTrigger
            value="ota"
            className="data-[state=active]:text-dark text-base font-bold text-white data-[state=active]:bg-white"
            onClick={() => setValue("ota")}
          >
            Orang Tua Asuh
          </TabsTrigger>
        </TabsList>
        <TabsContent value="mahasiswa">
          <MahasiswaAsuhContent />
        </TabsContent>
        <TabsContent value="ota">
          <OrangTuaAsuhContent />
        </TabsContent>
      </Tabs>
    </main>
  );
}
