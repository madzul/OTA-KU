"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  DaftarPengasuhanTable,
  type PengasuhanItem,
  type StatusType,
} from "./daftar-pengasuhan-table";
import { PaymentDetailsModal } from "./payment-details-modal";
import { SearchFilterBar } from "./search-filter-bar";

// Initial data with status - adding different names for better sort demonstration
const initialData: PengasuhanItem[] = [
  {
    namaMa: "John Doe",
    nimMa: "13522001",
    namaOta: "Erni Sugiyanti",
    noTelpOta: "082229920861",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "12/10/2024",
    status: "not-set",
  },
  {
    namaMa: "Alice Smith",
    nimMa: "13522002",
    namaOta: "Budi Santoso",
    noTelpOta: "082229920862",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "12/10/2024",
    status: "not-set",
  },
  {
    namaMa: "Bob Johnson",
    nimMa: "13522003",
    namaOta: "Dewi Putri",
    noTelpOta: "082229920863",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "12/10/2024",
    status: "not-set",
  },
  {
    namaMa: "Emma Wilson",
    nimMa: "13522004",
    namaOta: "Ahmad Rizki",
    noTelpOta: "082229920864",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "12/10/2024",
    status: "not-set",
  },
  {
    namaMa: "David Brown",
    nimMa: "13522005",
    namaOta: "Fitri Handayani",
    noTelpOta: "082229920865",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "12/10/2024",
    status: "not-set",
  },
  {
    namaMa: "Carol Davis",
    nimMa: "13522006",
    namaOta: "Gunawan Wibowo",
    noTelpOta: "082229920866",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "12/10/2024",
    status: "not-set",
  },
  {
    namaMa: "Frank Miller",
    nimMa: "13522007",
    namaOta: "Hana Sari",
    noTelpOta: "082229920867",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "12/10/2024",
    status: "not-set",
  },
  {
    namaMa: "Grace Taylor",
    nimMa: "13522008",
    namaOta: "Irfan Hakim",
    noTelpOta: "082229920868",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "12/10/2024",
    status: "not-set",
  },
];

export function DaftarTagihanPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null,
  );
  const [pendingStatus, setPendingStatus] = useState<StatusType | null>(null);
  const [pengasuhanData, setPengasuhanData] =
    useState<PengasuhanItem[]>(initialData);

  // Filter data based on search query, year, and month
  const filteredData = pengasuhanData.filter((item) => {
    // Search filter
    const matchesSearch =
      item.namaMa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaOta.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.noTelpOta.includes(searchQuery);

    // Year and month filters would be applied to tanggalWaktu
    // For this example, we're just checking if the filters are set
    // In a real application, you would parse the date and check against year/month
    const matchesYearMonth = true; // Placeholder for actual date filtering

    return matchesSearch && matchesYearMonth;
  });

  // Function to handle status change
  const handleStatusChange = (index: number, status: StatusType) => {
    // If status is already accepted or rejected, don't allow changes
    const actualIndex = pengasuhanData.findIndex(
      (item) => item === filteredData[index],
    );
    const currentStatus = pengasuhanData[actualIndex].status;

    if (currentStatus === "accepted" || currentStatus === "rejected") {
      toast.error("Status tidak dapat diubah", {
        description:
          "Status yang sudah accepted atau rejected tidak dapat diubah kembali.",
      });
      return;
    }

    // If changing to accepted or rejected, open modal
    if (status === "accepted" || status === "rejected") {
      setSelectedItemIndex(actualIndex);
      setPendingStatus(status);
      setIsModalOpen(true);
    } else {
      // For other status changes (like pending), update directly
      const newData = [...pengasuhanData];
      newData[actualIndex].status = status;
      setPengasuhanData(newData);
    }
  };

  // Function to handle payment details confirmation
  const handlePaymentDetailsConfirm = (paymentDetails: { amount: string }) => {
    if (selectedItemIndex !== null && pendingStatus) {
      const newData = [...pengasuhanData];
      const item = newData[selectedItemIndex];

      // Update payment details
      item.status = pendingStatus;
      item.paymentDetails = paymentDetails;
      item.pembayaran = paymentDetails.amount;

      // Set current date for waktuBayar
      item.waktuBayar = new Date().toLocaleDateString("id-ID");

      setPengasuhanData(newData);
      setIsModalOpen(false);
      setSelectedItemIndex(null);
      setPendingStatus(null);

      toast.success("Status berhasil diperbarui", {
        description: `Status pembayaran untuk ${item.namaOta} telah diubah menjadi ${pendingStatus === "accepted" ? "diterima" : "ditolak"}.`,
      });
    }
  };

  // Function to handle modal close without confirmation
  const handleModalClose = () => {
    // If modal is closed without confirmation, revert to pending
    if (selectedItemIndex !== null) {
      const newData = [...pengasuhanData];
      newData[selectedItemIndex].status = "pending";
      setPengasuhanData(newData);
    }

    setIsModalOpen(false);
    setSelectedItemIndex(null);
    setPendingStatus(null);
  };

  // Function to handle file click
  const handleFileClick = (index: number) => {
    console.log(`File clicked for row ${index}`);
    // Implement file preview or download functionality here
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-dark text-3xl font-bold md:text-[50px]">
            Daftar Tagihan Bantuan OTA
          </h1>
          <p className="text-blue-900">
            Pilih OTA yang akan dipasangkan dengan mahasiswa asuh
          </p>
        </div>
      </div>

      <SearchFilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        yearValue={yearFilter}
        onYearChange={setYearFilter}
        monthValue={monthFilter}
        onMonthChange={setMonthFilter}
      />

      <DaftarPengasuhanTable
        data={filteredData}
        onStatusChange={handleStatusChange}
        onFileClick={handleFileClick}
      />

      {selectedItemIndex !== null && (
        <PaymentDetailsModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={handlePaymentDetailsConfirm}
          namaOta={pengasuhanData[selectedItemIndex].namaOta}
        />
      )}
    </>
  );
}
