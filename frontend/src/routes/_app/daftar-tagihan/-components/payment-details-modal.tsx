"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const paymentDetailsSchema = z.object({
  amount: z.string().min(1, { message: "Jumlah pembayaran harus diisi" }),
});

type PaymentDetailsFormValues = z.infer<typeof paymentDetailsSchema>;

interface PaymentDetailsModalProps {
  status: "pending" | "unpaid" | "paid";
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentDetails: PaymentDetailsFormValues) => void;
  namaOta: string;
}

export function PaymentDetailsModal({
  status,
  isOpen,
  onClose,
  onConfirm,
  namaOta,
}: PaymentDetailsModalProps) {
  const form = useForm<PaymentDetailsFormValues>({
    resolver: zodResolver(paymentDetailsSchema),
    defaultValues: {
      amount: "300000",
    },
  });

  const handleSubmit = (data: PaymentDetailsFormValues) => {
    onConfirm(data);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detail Pembayaran</DialogTitle>
          <DialogDescription>
            {status === "unpaid" ? (
              <div>
                Ubah status pembayaran OTA{" "}
                <span className="font-medium">{namaOta}</span>
                menjadi UNPAID. Masukkan jumlah pembayaran yang telah dibayarkan
                jika ada.
              </div>
            ) : (
              <div>
                Ubah status pembayaran OTA{" "}
                <span className="font-medium">{namaOta}</span> menjadi
                PAID?{" "}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {status === "unpaid" && (
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Pembayaran (Rp)</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 300000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Batal
              </Button>
              <Button type="submit">Konfirmasi</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
