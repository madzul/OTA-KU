import { useState } from "react";
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

// This represents our transaction data
type TransactionStatus = "Accepted" | "Pending" | "Rejected" | "Unpaid";

interface Transaction {
  id: string;
  name: string;
  nim: string;
  amount: number;
  paid: number | null;
  paymentDate: string | null;
  dueDate: string;
  status: TransactionStatus;
}

// Mock data for the table
const mockTransactions: Transaction[] = [
  {
    id: "1",
    name: "John Doe",
    nim: "13522001",
    amount: 300000,
    paid: 300000,
    paymentDate: "11/10/2024",
    dueDate: "12/10/2024",
    status: "Accepted",
  },
  {
    id: "2",
    name: "Jenni Doe",
    nim: "13522002",
    amount: 300000,
    paid: 300000,
    paymentDate: "11/10/2024",
    dueDate: "12/10/2024",
    status: "Pending",
  },
  {
    id: "3",
    name: "Jenni Doe",
    nim: "13522002",
    amount: 300000,
    paid: null,
    paymentDate: "11/10/2024",
    dueDate: "12/10/2024",
    status: "Rejected",
  },
  {
    id: "4",
    name: "Jenni Doe",
    nim: "13522002",
    amount: 300000,
    paid: null,
    paymentDate: null,
    dueDate: "12/10/2024",
    status: "Unpaid",
  },
];

export default function StatusTransaksiTable() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleUploadClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsUploadModalOpen(true);
  };

  const getStatusBadge = (status: TransactionStatus) => {
    const statusClasses = {
      Accepted: "bg-green-500 text-white",
      Pending: "bg-yellow-500 text-white",
      Rejected: "bg-red-500 text-white",
      Unpaid: "bg-red-500 text-white",
    };

    return (
      <div className={`px-4 py-1 rounded-full inline-block ${statusClasses[status]}`}>
        {status}
      </div>
    );
  };

  const getActionButton = (transaction: Transaction) => {
    if (transaction.status === "Rejected") {
      return (
        <Button 
          variant="outline" 
          className="rounded-full border-red-500 text-red-500 hover:bg-red-50"
          onClick={() => handleUploadClick(transaction)}
        >
          Unggah Ulang
        </Button>
      );
    } 
    
    if (transaction.status === "Unpaid") {
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

    return (
      <Button 
        variant="outline" 
        className="rounded-full"
      >
        Lihat
      </Button>
    );
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
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
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="border-t">
                <TableCell>{transaction.name}</TableCell>
                <TableCell>{transaction.nim}</TableCell>
                <TableCell>{transaction.amount.toLocaleString()}</TableCell>
                <TableCell>{transaction.paid ? transaction.paid.toLocaleString() : "-"}</TableCell>
                <TableCell>{transaction.paymentDate || "-"}</TableCell>
                <TableCell>{transaction.dueDate}</TableCell>
                <TableCell>
                  {getActionButton(transaction)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(transaction.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UploadBuktiDialog 
        open={isUploadModalOpen} 
        onOpenChange={setIsUploadModalOpen}
        transaction={selectedTransaction}
      />
    </div>
  );
}