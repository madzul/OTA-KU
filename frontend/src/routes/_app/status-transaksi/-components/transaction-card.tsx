import { TransactionOTA } from "@/api/generated";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFunding } from "@/lib/formatter";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";

import TransactionForm from "./transaction-form";

interface TransactionCardProps {
  data: Array<TransactionOTA>;
  totalBill: number;
  year: number;
  month: number;
}

function TransactionCard({
  data,
  totalBill,
  year,
  month,
}: TransactionCardProps) {
  const [paidFor, setPaidFor] = useState<number>(data[0].paid_for || 1);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Lunas</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Menunggu Verifikasi
          </Badge>
        );
      case "unpaid":
        return <Badge className="bg-red-100 text-red-800">Belum Bayar</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="mt-8 w-full max-w-[1000px] self-end">
      <CardHeader>
        <CardTitle className="text-dark text-xl font-bold">
          Pembayaran Mahasiswa Asuh - {data.length} Mahasiswa
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-12">
        <div className="flex flex-col gap-4">
          {/* Bantuan Terkirim */}
          <div className="flex flex-col">
            <p className="text-dark text-sm font-medium">Bantuan Terkirim</p>
            <div className="rounded-md p-3">
              <p className="text-dark text-lg font-semibold">
                {formatFunding(totalBill * paidFor)}
              </p>
              <p className="text-sm text-gray-600">
                {data.length} mahasiswa ×{" "}
                {formatFunding(totalBill / data.length)} × {paidFor} bulan
              </p>
            </div>
          </div>

          {/* Tenggat Waktu */}
          <div className="flex flex-col">
            <p className="text-dark text-sm font-medium">Tenggat Waktu</p>
            <div className="rounded-md p-3">
              <p className="text-dark font-bold">
                {format(data[0].due_date, "dd MMMM yyyy", { locale: id })}
              </p>
              <p className="text-sm text-gray-600">
                Tenggat waktu dari semua mahasiswa
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2">
            <p className="text-dark text-sm font-medium">Status Pembayaran</p>

            <div className="flex items-center justify-between rounded-md p-2">
              {getStatusBadge(data[0].status)}
            </div>
          </div>
        </div>

        <TransactionForm
          data={data}
          setPaidFor={setPaidFor}
          year={year}
          month={month}
        />
      </CardContent>
    </Card>
  );
}

export default TransactionCard;
