import Metadata from "@/components/metadata";
import { createFileRoute, redirect } from "@tanstack/react-router";
import StatusTransaksiTable from "./-components/status-transaksi-table";
import StatusTransaksiFilter from "./-components/status-transaksi-filter";

export const Route = createFileRoute("/_app/status-transaksi/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = context.session;
    if (!user) {
      throw redirect({ to: "/auth/login" });
    }
    if (user.type !== "ota") {
      throw redirect({ to: "/" });
    }
    return { user };
  },
});

function RouteComponent() {
  return (
    <main className="flex min-h-[calc(100vh-70px)] flex-col gap-4 p-2 px-6 py-16 md:px-12 lg:min-h-[calc(100vh-96px)]">
      <Metadata title="Status Transaksi | BOTA" />
      <h1 className="text-primary text-4xl font-bold mb-6">Status Transaksi</h1>
      
      <div className="space-y-6">
        <StatusTransaksiFilter />
        <StatusTransaksiTable />
      </div>
    </main>
  );
}