import { api } from "@/api/client";
import Metadata from "@/components/metadata";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import DetailCardsOrangTuaAsuh from "./-components/detail-card";
import { UserX } from "lucide-react";

export const Route = createFileRoute("/_app/orang-tua-asuh-saya/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = context.session;
    if (!user) {
      throw redirect({ to: "/auth/login" });
    }
    if (user.type !== "mahasiswa") {
      throw redirect({ to: "/" });
    }
    return { user };
  },
});

function RouteComponent() {
  const { user } = Route.useRouteContext();
  const { data } = useQuery({
    queryKey: ["getMyOtaDetail", user.id],
    queryFn: () => api.detail.getMyOtaDetail(),
  });

  // Cek apakah data OTA tersedia dan valid
  const hasOta = data?.body && Object.keys(data.body).length > 0;

  return (
    <main className="flex min-h-[calc(100vh-70px)] flex-col items-center justify-center p-2 px-6 py-8 md:px-12 lg:min-h-[calc(100vh-96px)]">
      <Metadata title="Orang Tua Asuh Saya | BOTA" />
      <h1 className="text-primary mb-4 text-2xl font-bold">
        Orang Tua Asuh Saya
      </h1>
      {!hasOta ? (
        <div className="flex w-full max-w-[300px] flex-col items-center justify-center gap-4">
          <div className="mb-4 h-24 w-24 flex items-center justify-center overflow-hidden rounded-full bg-gray-100">
            <UserX className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-lg font-bold">Belum ada orang tua asuh</h2>
        </div>
      ) : (
        <DetailCardsOrangTuaAsuh
          id={data.body.id || "-"}
          name={data.body.name || "-"}
          email={data.body.email || "-"}
          phoneNumber={data.body.phoneNumber || "-"}
          transferDate={data.body.transferDate || 0}
          createdAt={data.body.createdAt || "-"}
          isDetailVisible={data.body.isDetailVisible || false}
        />
      )}
    </main>
  );
}