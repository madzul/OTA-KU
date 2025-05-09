"use client";

import { api } from "@/api/client";
import { ClientPagination } from "@/components/client-pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  DaftarTransaksiTable,
  type StatusType,
  type TransaksiItem,
} from "./daftar-transaksi-table";
import { PaymentDetailsModal } from "./payment-details-modal";
import { SearchFilterBar } from "./search-filter-bar";

const ITEMS_PER_PAGE = 8;

export function DaftarTagihanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Get page from URL or default to 1
  const currentPage = parseInt(searchParams.get("page") ?? "1") || 1;

  // Define valid month types to match API expectations
  type MonthType =
    | "January"
    | "February"
    | "March"
    | "April"
    | "May"
    | "June"
    | "July"
    | "August"
    | "September"
    | "October"
    | "November"
    | "December"
    | undefined;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ] as const;

  // Set to todays date for filtering
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = monthNames[currentDate.getMonth()];

  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>(currentYear);
  const [monthFilter, setMonthFilter] = useState<string>(currentMonth);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null,
  );
  const [pendingStatus, setPendingStatus] = useState<StatusType>("pending");
  const [transaksiData, setTransaksiData] = useState<TransaksiItem[]>([]);

  // Fetch transactions data
  const { data: transactionData, isLoading } = useQuery({
    queryKey: [
      "listTransactionAdmin",
      currentPage,
      searchQuery,
      yearFilter,
      monthFilter,
      selectedStatus,
    ],
    queryFn: () => {
      return api.transaction.listTransactionAdmin({
        page: currentPage,
        month: monthFilter === "all" ? undefined : (monthFilter as MonthType),
        year: parseInt(yearFilter),
        status:
          selectedStatus === "pending" || selectedStatus === "unpaid"
            ? selectedStatus
            : undefined,
      });
    },
  });

  // Transform the data from API format to component format
  useEffect(() => {
    if (transactionData?.body?.data) {
      //   console.log("Transaction Data:", JSON.stringify(transactionData));
      const transformedData = transactionData.body.data.map((item) => {
        return {
          mahasiswaId: item.mahasiswa_id,
          otaId: item.ota_id,
          namaMa: item.name_ma,
          nimMa: item.nim_ma,
          namaOta: item.name_ota,
          noTelpOta: item.number_ota,
          tagihan: item.bill.toLocaleString("id-ID"),
          pembayaran: item.amount_paid,
          waktuBayar: item.paid_at
            ? format(new Date(item.paid_at), "dd/MM/yy")
            : "-",
          status: item.status,
          due_date: item.due_date
            ? format(new Date(item.due_date), "dd/MM/yy")
            : "-",
          receipt: item.receipt,
        };
      });

      setTransaksiData(transformedData);
    }
  }, [transactionData]);

  // Reset to page 1 when filters change
  useEffect(() => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: 1,
      }),
    });
  }, [searchQuery, yearFilter, monthFilter, selectedStatus, navigate]);

  // Local filtering for search (the API might not support text search)
  const filteredData = transaksiData.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.namaMa.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaOta.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.noTelpOta.includes(searchQuery);

    return matchesSearch;
  });

  // Calculate pagination values from API
  const totalItems = transactionData?.body?.totalData || 0;

  // Function to handle status change
  const handleStatusChange = (index: number, status: StatusType) => {
    // If status is already accepted or rejected, don't allow changes
    const currentStatus = filteredData[index].status;

    if (currentStatus === "paid" || currentStatus === "unpaid") {
      toast.error("Status tidak dapat diubah", {
        description:
          "Status yang sudah accepted atau rejected tidak dapat diubah kembali.",
      });
      return;
    }

    // If changing to accepted or rejected, open modal
    if (status === "paid" || status === "unpaid") {
      setSelectedItemIndex(index);
      setPendingStatus(status);
      setIsModalOpen(true);
    } else {
      // For other status changes (like pending), update directly
      const newData = [...transaksiData];
      newData[index].status = status;
      setTransaksiData(newData);
    }
  };

  const updateTransactionAccMutation = useMutation({
    mutationFn: ({ maId, otaId }: { maId: string; otaId: string }) =>
      api.transaction.verifyTransactionAcc({
        formData: { mahasiswaId: maId, otaId: otaId },
      }),

    onSuccess: () => {
      toast.success("Berhasil mengubah tagihan benjadi PAID", {
        description: "Tagihan berhasil diterima.",
      });
    },
    onError: () => {
      toast.error("Gagal mengubah tagihan benjadi PAID", {
        description: "Terjadi kesalahan saat menerima tagihan.",
      });
    },
  });

  const updateTransactionRejectMutation = useMutation({
    mutationFn: ({
      maId,
      otaId,
      amount,
    }: {
      maId: string;
      otaId: string;
      amount: number;
    }) =>
      api.transaction.verifyTransactionReject({
        formData: { mahasiswaId: maId, otaId: otaId, amountPaid: amount },
      }),

    onSuccess: () => {
      toast.success("Berhasil mengubah tagihan benjadi UNPAID", {
        description: "Tagihan berhasil ditolak.",
      });
    },
    onError: () => {
      toast.error("Gagal mengubah tagihan benjadi UNPAID", {
        description: "Terjadi kesalahan saat menolak tagihan.",
      });
    },
  });

  // Function to handle payment details confirmation
  const handlePaymentDetailsConfirm = ({ amount }: { amount: string }) => {
    if (selectedItemIndex !== null && pendingStatus) {
      const newData = [...transaksiData];
      const item = newData[selectedItemIndex];

      // Update payment details
      item.status = pendingStatus;
      item.pembayaran = Number(amount);

      setTransaksiData(newData);
      setIsModalOpen(false);

      // Map UI status to API status
      const apiStatus =
        pendingStatus === "paid"
          ? "paid"
          : pendingStatus === "unpaid"
            ? "unpaid"
            : "pending";

      console.log("MA ID OTAID AMOUNT", item.mahasiswaId, item.otaId, amount);
      if (apiStatus === "paid") {
        updateTransactionAccMutation.mutate({
          maId: item.mahasiswaId,
          otaId: item.otaId,
        });
      } else if (apiStatus === "unpaid") {
        updateTransactionRejectMutation.mutate({
          maId: item.mahasiswaId,
          otaId: item.otaId,
          amount: Number(amount),
        });
      }
    }
  };

  // Function to handle modal close without confirmation
  const handleModalClose = () => {
    if (selectedItemIndex !== null) {
      const newData = [...transaksiData];
      newData[selectedItemIndex].status = "pending";
      setTransaksiData(newData);
    }

    setIsModalOpen(false);
    setSelectedItemIndex(null);
    setPendingStatus(null);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-dark text-3xl font-bold md:text-[50px]">
            Daftar Tagihan Bantuan OTA
          </h1>
          <p className="text-blue-900">
            Kelola tagihan dan pembayaran bantuan Orang Tua Asuh
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
        statusValue={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center">
          <p className="text-lg text-gray-500">Loading data...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="flex h-64 w-full items-center justify-center">
          <p className="text-lg text-gray-500">Tidak ada data yang ditemukan</p>
        </div>
      ) : (
        <DaftarTransaksiTable
          data={filteredData}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Pagination */}
      <ClientPagination
        total={totalItems}
        totalPerPage={ITEMS_PER_PAGE}
        animate={true}
      />

      {selectedItemIndex !== null && (
        <PaymentDetailsModal
          status={pendingStatus}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={handlePaymentDetailsConfirm}
          namaOta={filteredData[selectedItemIndex]?.namaOta || ""}
        />
      )}
    </>
  );
}
