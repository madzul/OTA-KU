"use client";

import { ClientPagination } from "@/components/client-pagination";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  DaftarPengasuhanTable,
  type PengasuhanItem,
  type StatusType,
} from "./daftar-pengasuhan-table";
import { PaymentDetailsModal } from "./payment-details-modal";
import { SearchFilterBar } from "./search-filter-bar";

// Initial data with status and date information for filtering
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
    date: new Date(2024, 9, 12), // 12 Oct 2024
  },
  {
    namaMa: "Alice Smith",
    nimMa: "13522002",
    namaOta: "Budi Santoso",
    noTelpOta: "082229920862",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "05/09/2024",
    status: "not-set",
    date: new Date(2024, 8, 5), // 5 Sep 2024
  },
  {
    namaMa: "Bob Johnson",
    nimMa: "13522003",
    namaOta: "Dewi Putri",
    noTelpOta: "082229920863",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "20/08/2024",
    status: "not-set",
    date: new Date(2024, 7, 20), // 20 Aug 2024
  },
  {
    namaMa: "Emma Wilson",
    nimMa: "13522004",
    namaOta: "Ahmad Rizki",
    noTelpOta: "082229920864",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "15/07/2024",
    status: "not-set",
    date: new Date(2024, 6, 15), // 15 Jul 2024
  },
  {
    namaMa: "David Brown",
    nimMa: "13522005",
    namaOta: "Fitri Handayani",
    noTelpOta: "082229920865",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "10/06/2024",
    status: "not-set",
    date: new Date(2024, 5, 10), // 10 Jun 2024
  },
  {
    namaMa: "Carol Davis",
    nimMa: "13522006",
    namaOta: "Gunawan Wibowo",
    noTelpOta: "082229920866",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "25/05/2024",
    status: "not-set",
    date: new Date(2024, 4, 25), // 25 May 2024
  },
  {
    namaMa: "Frank Miller",
    nimMa: "13522007",
    namaOta: "Hana Sari",
    noTelpOta: "082229920867",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "30/04/2024",
    status: "not-set",
    date: new Date(2024, 3, 30), // 30 Apr 2024
  },
  {
    namaMa: "Grace Taylor",
    nimMa: "13522008",
    namaOta: "Irfan Hakim",
    noTelpOta: "082229920868",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "05/03/2024",
    status: "not-set",
    date: new Date(2024, 2, 5), // 5 Mar 2024
  },
  {
    namaMa: "Henry Wilson",
    nimMa: "13522009",
    namaOta: "Joko Widodo",
    noTelpOta: "082229920869",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "15/02/2024",
    status: "not-set",
    date: new Date(2024, 1, 15), // 15 Feb 2024
  },
  {
    namaMa: "Ivy Robinson",
    nimMa: "13522010",
    namaOta: "Kartika Putri",
    noTelpOta: "082229920870",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "20/01/2024",
    status: "not-set",
    date: new Date(2024, 0, 20), // 20 Jan 2024
  },
  {
    namaMa: "Jack Thompson",
    nimMa: "13522011",
    namaOta: "Linda Susanti",
    noTelpOta: "082229920871",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "10/12/2023",
    status: "not-set",
    date: new Date(2023, 11, 10), // 10 Dec 2023
  },
  {
    namaMa: "Kelly Wright",
    nimMa: "13522012",
    namaOta: "Muhammad Ali",
    noTelpOta: "082229920872",
    tagihan: "300,000",
    pembayaran: "-",
    waktuBayar: "-",
    tanggalWaktu: "05/11/2023",
    status: "not-set",
    date: new Date(2023, 10, 5), // 5 Nov 2023
  },
];

// Items per page for pagination
const ITEMS_PER_PAGE = 8;

export function DaftarTagihanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Get page from URL or default to 1
  const currentPage = parseInt(searchParams.get("page") ?? "1") || 1;

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

    // Year filter
    const matchesYear =
      yearFilter === "" ||
      yearFilter === "all" ||
      item.date.getFullYear().toString() === yearFilter;

    // Month filter
    const matchesMonth =
      monthFilter === "" ||
      monthFilter === "all" ||
      (item.date.getMonth() + 1).toString().padStart(2, "0") === monthFilter;

    return matchesSearch && matchesYear && matchesMonth;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: 1,
      }),
    });
  }, [searchQuery, yearFilter, monthFilter, navigate]);

  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentPageData = filteredData.slice(startIndex, endIndex);

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
        data={currentPageData}
        onStatusChange={handleStatusChange}
        onFileClick={handleFileClick}
      />

      {/* Pagination */}
      <ClientPagination
        total={totalItems}
        totalPerPage={ITEMS_PER_PAGE}
        animate={true}
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
