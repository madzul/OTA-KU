import { api } from "@/api/client";
import { ClientPagination } from "@/components/client-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Route } from "..";
import { StatusType, TransaksiItem, TransferStatusType, tagihanColumns } from "./columns";
import { PaymentDetailsModal } from "./confirmation-dialog";
import { DataTable } from "./data-table";
import { SearchFilterBar } from "./search-filter-bar";

const ITEMS_PER_PAGE = 8;

export function DaftarTagihanContent() {
  const navigate = useNavigate({ from: Route.fullPath });
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

  // Set to today's date for filtering
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonth = monthNames[currentDate.getMonth()];

  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>(currentYear);
  const [monthFilter, setMonthFilter] = useState<string>(currentMonth);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [transaksiData, setTransaksiData] = useState<TransaksiItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [pendingStatus, setPendingStatus] = useState<StatusType>("pending");

  useEffect(() => {
    const handleStatusDropdownChange = (event: Event) => {
      const customEvent = event as CustomEvent<{
        index: number;
        status: StatusType;
        namaOta: string;
      }>;

      const { index, status } = customEvent.detail;

      // If changing to paid or unpaid, show modal for details
      if (
        (status === "paid" || status === "unpaid") &&
        transaksiData[index]?.status === "pending"
      ) {
        setSelectedIndex(index);
        setPendingStatus(status);
        setIsModalOpen(true);
      } else {
        // For other status changes (like pending), update directly
        handleStatusChange(index, status);
      }
    };

    const handleTransferStatusChange = (event: Event) => {
      const customEvent = event as CustomEvent<{
        index: number;
        transferStatus: TransferStatusType;
        id: string;
      }>;

      const { index, transferStatus, id } = customEvent.detail;
      
      // Update the transfer status
      const newData = [...transaksiData];
      newData[index].transferStatus = transferStatus;
      setTransaksiData(newData);
      
      // Call API to update transfer status
      if (transferStatus === "paid") {
        acceptTransferStatusMutation.mutate({ id });
      } else {
        // In a real implementation, you might have a rejectTransferStatus API call
        // For now, we'll just update the UI
        toast.success("Status transfer diubah menjadi Belum Ditransfer", {
          description: "Perubahan berhasil disimpan.",
        });
      }
    };

    window.addEventListener(
      "status-dropdown-change",
      handleStatusDropdownChange,
    );
    
    window.addEventListener(
      "transfer-status-change",
      handleTransferStatusChange,
    );

    return () => {
      window.removeEventListener(
        "status-dropdown-change",
        handleStatusDropdownChange,
      );
      window.removeEventListener(
        "transfer-status-change",
        handleTransferStatusChange,
      );
    };
  }, [transaksiData]);

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
      const transformedData = transactionData.body.data.map((item, idx) => {
        return {
          id: item.id,
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
          transferStatus: item.transferStatus || "unpaid",
          due_date: item.due_date
            ? format(new Date(item.due_date), "dd/MM/yy")
            : "-",
          receipt: item.receipt,
          createdAt: item.createdAt,
          index: idx,
          paidFor: item.paid_for,
        };
      });

      setTransaksiData(transformedData);
    }
  }, [transactionData]);

  // Reset to page 1 when filters change
  useEffect(() => {
    // Only run this effect when filters change, not during initial render
    if (
      searchQuery ||
      yearFilter !== currentYear ||
      monthFilter !== currentMonth ||
      selectedStatus
    ) {
      navigate({
        to: location.pathname,
        search: (prev) => {
          return {
            ...prev,
            page: 1,
          };
        },
        replace: true,
      });
    }
  }, [
    searchQuery,
    yearFilter,
    monthFilter,
    selectedStatus,
    navigate,
    location.pathname,
    currentYear,
    currentMonth,
  ]);

  const updateTransactionAccMutation = useMutation({
    mutationFn: ({
      id,
      maId,
      otaId,
    }: {
      id: string;
      maId: string;
      otaId: string;
    }) =>
      api.transaction.verifyTransactionAcc({
        formData: { id: id, mahasiswaId: maId, otaId: otaId },
      }),

    onSuccess: () => {
      toast.success("Berhasil mengubah tagihan menjadi PAID", {
        description: "Tagihan berhasil diterima.",
      });
    },
    onError: () => {
      toast.error("Gagal mengubah tagihan menjadi PAID", {
        description: "Terjadi kesalahan saat menerima tagihan.",
      });
    },
  });

  const updateTransactionRejectMutation = useMutation({
    mutationFn: ({
      id,
      maId,
      otaId,
      amount,
      rejectionNote,
    }: {
      id: string;
      maId: string;
      otaId: string;
      amount: number;
      rejectionNote: string;
    }) =>
      api.transaction.verifyTransactionReject({
        formData: {
          id: id,
          mahasiswaId: maId,
          otaId: otaId,
          amountPaid: amount,
          rejectionNote: rejectionNote,
        },
      }),

    onSuccess: () => {
      toast.success("Berhasil mengubah tagihan menjadi UNPAID", {
        description: "Tagihan berhasil ditolak.",
      });
    },
    onError: () => {
      toast.error("Gagal mengubah tagihan menjadi UNPAID", {
        description: "Terjadi kesalahan saat menolak tagihan.",
      });
    },
  });

  // Mutation for accepting transfer status
  const acceptTransferStatusMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => 
      api.transaction.acceptTransferStatus({
        formData: { id: id },
      }),
    
    onSuccess: () => {
      toast.success("Status transfer diubah menjadi Ditransfer", {
        description: "Perubahan berhasil disimpan.",
      });
    },
    onError: () => {
      toast.error("Gagal mengubah status transfer", {
        description: "Terjadi kesalahan saat mengubah status transfer.",
      });
    }
  });

  // Function to handle payment details confirmation
  const handlePaymentDetailsConfirm = ({
    amount,
    rejectionNote,
  }: {
    amount: string;
    rejectionNote?: string;
  }) => {
    if (selectedIndex !== null && pendingStatus) {
      const newData = [...transaksiData];
      const item = newData[selectedIndex];

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

      // TODO: Cek bisa atau ga setelah update db after sprint review 4
      if (apiStatus === "paid") {
        updateTransactionAccMutation.mutate({
          id: item.id,
          maId: item.mahasiswaId,
          otaId: item.otaId,
        });
      } else if (apiStatus === "unpaid") {
        updateTransactionRejectMutation.mutate({
          id: item.id,
          maId: item.mahasiswaId,
          otaId: item.otaId,
          amount: Number(amount),
          rejectionNote: rejectionNote || "",
        });
      }
    }
  };

  // Function to handle modal close without confirmation
  const handleModalClose = () => {
    if (selectedIndex !== null) {
      const newData = [...transaksiData];
      newData[selectedIndex].status = "pending";
      setTransaksiData(newData);
    }

    setIsModalOpen(false);
    setSelectedIndex(null);
    setPendingStatus("pending");
  };

  // Function to handle status change
  const handleStatusChange = (index: number, status: StatusType) => {
    // If status is already accepted or rejected, don't allow changes
    const currentStatus = transaksiData[index].status;

    if (currentStatus === "paid" || currentStatus === "unpaid") {
      toast.error("Status tidak dapat diubah", {
        description:
          "Status yang sudah accepted atau rejected tidak dapat diubah kembali.",
      });
      return;
    }

    // For direct status changes (like to pending), update directly
    const newData = [...transaksiData];
    newData[index].status = status;
    setTransaksiData(newData);
  };

  // Calculate pagination values from API
  const totalItems = transactionData?.body?.totalData || 0;

  return (
    <section className="flex flex-col gap-4">
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

      {/* Search and Filters */}
      {isLoading ? (
        <div className="rounded-md bg-white">
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          yearFilter={yearFilter}
          onYearChange={setYearFilter}
          monthFilter={monthFilter}
          onMonthChange={setMonthFilter}
          statusFilter={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
      )}

      {/* Table */}
      {isLoading ? (
        <div className="rounded-md bg-white">
          <Skeleton className="h-80 w-full" />
        </div>
      ) : transaksiData.length === 0 ? (
        <div className="flex h-64 w-full items-center justify-center">
          <p className="text-lg text-gray-500">Tidak ada data yang ditemukan</p>
        </div>
      ) : (
        <DataTable columns={tagihanColumns} data={transaksiData} />
      )}

      {/* Pagination */}
      {isLoading ? (
        <div className="rounded-md bg-white">
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <ClientPagination
          total={totalItems}
          totalPerPage={ITEMS_PER_PAGE}
          animate={true}
        />
      )}

      {/* Payment Details Modal */}
      {isModalOpen && selectedIndex !== null && (
        <PaymentDetailsModal
          status={pendingStatus}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={handlePaymentDetailsConfirm}
          namaOta={transaksiData[selectedIndex]?.namaOta || ""}
        />
      )}
    </section>
  );
}