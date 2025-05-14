import { useState } from "react";
import Metadata from "@/components/metadata";
import { createFileRoute, redirect } from "@tanstack/react-router";
import StatusTransaksiTable from "./-components/status-transaksi-table";
import StatusTransaksiFilter from "./-components/status-transaksi-filter";
import { Toaster } from "sonner";

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
  // Get the current date for default filters
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = (currentDate.getMonth() + 1).toString(); // 1-12
  
  // Set initial filters with current date
  const [filters, setFilters] = useState<{
    year: string;
    month: string;
  }>({
    year: currentYear,
    month: currentMonth,
  });
  
  const handleFilterChange = (newFilters: { year: string; month: string }) => {
    console.log("Filters changed:", newFilters);
    setFilters(newFilters);
  };
  
  return (
    <main className="px-6 py-8 md:px-12 min-h-screen">
      <Metadata title="Status Transaksi | BOTA" />
      <h1 className="text-primary text-4xl font-bold mb-6">Status Transaksi</h1>
     
      <div className="space-y-6">
        <StatusTransaksiFilter onFilterChange={handleFilterChange} />
        <StatusTransaksiTable year={filters.year} month={filters.month} />
      </div>
     
      <Toaster position="top-center" />
    </main>
  );
}