import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UploadBuktiDialog } from "./upload-bukti-dialog";
import { ViewReceiptDialog } from "./view-receipt-dialog";
import { api } from "@/api/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TransactionStatus = "unpaid" | "pending" | "paid";

interface Transaction {
  id: string;
  name: string;
  nim: string;
  bill: number;
  amount_paid: number;
  paid_at: string | null;
  due_date: string;
  status: TransactionStatus;
  receipt: string;
}

interface StatusTransaksiTableProps {
  year: string;
  month: string;
}

export default function StatusTransaksiTable({ year, month }: StatusTransaksiTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const searchQuery = "";

  // Fetch transactions when filters change
  useEffect(() => {
    fetchTransactions();
  }, [year, month, currentPage, searchQuery]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const queryParams: Record<string, any> = {
        page: currentPage
      };
      
      if (searchQuery) queryParams.q = searchQuery;
      
      const response = await api.transaction.listTransactionOta(queryParams);
      
      if (response.success) {
        setTransactions(response.body.data.map((item: any) => ({
          ...item,
          id: item.id || item._id || item.nim || String(Math.random())
        })));
        setTotalPages(Math.max(1, Math.ceil(response.body.totalData / 6)));
      } else {
        console.error("Failed to fetch transactions:", response);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = (transaction: Transaction) => {
    setSelectedTransaction({
      ...transaction,
      id: transaction.id
    });
    setIsUploadModalOpen(true);
  };
  
  const handleViewClick = (transaction: Transaction) => {
    setSelectedTransaction({
      ...transaction,
      id: transaction.id
    });
    setIsViewModalOpen(true);
  };

  const handleUploadSuccess = () => {
    fetchTransactions();
    setIsUploadModalOpen(false);
  };

  const getStatusBadge = (status: TransactionStatus) => {
    const statusMap = {
      paid: { text: "Accepted", classes: "bg-green-500 text-white" },
      pending: { text: "Pending", classes: "bg-yellow-500 text-white" },
      unpaid: { text: "Unpaid", classes: "bg-red-500 text-white" },
    };

    const { text, classes } = statusMap[status];
    return (
      <div className={`px-4 py-1 rounded-full inline-block ${classes}`}>
        {text}
      </div>
    );
  };

  const getActionButton = (transaction: Transaction) => {
    if (transaction.status === "paid") {
      return (
        <Button 
          variant="outline" 
          className="rounded-full"
          onClick={() => handleViewClick(transaction)}
          disabled={!transaction.receipt}
        >
          Lihat
        </Button>
      );
    }
    
    else if (transaction.status === "pending") {
      return (
        <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="rounded-full"
              onClick={() => handleViewClick(transaction)}
            >
              Lihat
            </Button>
            <Button 
              variant="outline" 
              className="rounded-full border-red-500 text-red-500 hover:bg-red-50"
              onClick={() => handleUploadClick(transaction)}
            >
              Unggah Ulang
            </Button>
          </div>
      );
    }
    

    if (transaction.status === "unpaid") {
      if (transaction.receipt) {
        return (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="rounded-full border-red-500 text-red-500 hover:bg-red-50"
              onClick={() => handleUploadClick(transaction)}
            >
              Unggah
            </Button>
          </div>
        );
      } else {
        return (
          <Button 
            variant="default" 
            className="rounded-full bg-blue-700 hover:bg-blue-800 text-white"
            onClick={() => handleUploadClick(transaction)}
          >
            Unggah
          </Button>
        );
      }
    }

    return null;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      console.error("Error parsing date:", e);
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-600 font-medium">Nama</TableHead>
              <TableHead className="text-gray-600 font-medium">NIM (MA)</TableHead>
              <TableHead className="text-gray-600 font-medium">Besar Bantuan</TableHead>
              <TableHead className="text-gray-600 font-medium">Bantuan Terkirim</TableHead>
              <TableHead className="text-gray-600 font-medium">Waktu Bayar</TableHead>
              <TableHead className="text-gray-600 font-medium">Tenggat Waktu</TableHead>
              <TableHead className="text-gray-600 font-medium">Bukti</TableHead>
              <TableHead className="text-gray-600 font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(6).fill(0).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {Array(8).fill(0).map((_, cellIndex) => (
                    <TableCell key={`cell-${index}-${cellIndex}`}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <TableRow key={`${transaction.nim}-${index}`} className="border-t">
                  <TableCell>{transaction.name}</TableCell>
                  <TableCell>{transaction.nim}</TableCell>
                  <TableCell>{transaction.bill.toLocaleString()}</TableCell>
                  <TableCell>{transaction.amount_paid ? transaction.amount_paid.toLocaleString() : "-"}</TableCell>
                  <TableCell>{formatDate(transaction.paid_at)}</TableCell>
                  <TableCell>{formatDate(transaction.due_date)}</TableCell>
                  <TableCell>
                    {getActionButton(transaction)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(transaction.status)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Tidak ada data transaksi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && transactions.length > 0 && (
        <div className="flex justify-center items-center py-4 px-6 gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload Dialog */}
      <UploadBuktiDialog 
        open={isUploadModalOpen} 
        onOpenChange={setIsUploadModalOpen}
        transaction={selectedTransaction}
        onSuccess={handleUploadSuccess}
      />
      
      {/* View Receipt Dialog */}
      <ViewReceiptDialog 
        open={isViewModalOpen} 
        onOpenChange={setIsViewModalOpen}
        transaction={selectedTransaction}
      />
    </div>
  );
}