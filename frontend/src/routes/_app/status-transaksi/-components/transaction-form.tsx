import { api, queryClient } from "@/api/client";
import { TransactionOTA } from "@/api/generated";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { UploadReceiptSchema } from "@/lib/zod/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check, ChevronsUpDown, FileUp } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface TransactionFormProps {
  data: Array<TransactionOTA>;
  setPaidFor: (paidFor: number) => void;
  year: number;
  month: number;
}

type TransactionFormValues = z.infer<typeof UploadReceiptSchema>;

const months = [
  { value: 1, label: "1 Bulan" },
  { value: 2, label: "2 Bulan" },
  { value: 3, label: "3 Bulan" },
  { value: 4, label: "4 Bulan" },
  { value: 5, label: "5 Bulan" },
  { value: 6, label: "6 Bulan" },
];

function TransactionForm({
  data,
  setPaidFor,
  year,
  month,
}: TransactionFormProps) {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragState, setDragState] = useState<boolean>(false);
  const [fileURL, setFileURL] = useState<string>("");

  const uploadReceiptCallbackMutation = useMutation({
    mutationFn: (formData: TransactionFormValues) =>
      api.transaction.uploadReceipt({
        formData: {
          ids: JSON.stringify(data.map((item) => item.mahasiswa_id)),
          receipt: formData.receipt,
          paidFor: formData.paidFor,
        },
      }),
    onSuccess: (_data, _variables, context) => {
      toast.dismiss(context);
      toast.success("Berhasil mengirim pembayaran", {
        description: "Silakan tunggu hingga admin memverifikasi data",
      });
      queryClient.invalidateQueries({
        queryKey: ["listAllTransaction", year, month],
      });
    },
    onError: (error, _variables, context) => {
      toast.dismiss(context);
      toast.warning("Gagal mengirim pembayaran", {
        description: error.message,
      });
    },
    onMutate: () => {
      const loading = toast.loading("Sedang mengirim pembayaran...", {
        description: "Mohon tunggu sebentar",
        duration: Infinity,
      });
      return loading;
    },
  });

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(UploadReceiptSchema),
    defaultValues: {
      ids: data.map((item) => item.mahasiswa_id),
      paidFor: data[0].paid_for || 1,
    },
  });

  const handleFileChange = (file: File | null) => {
    if (file) {
      setFileName(file.name);
      form.setValue("receipt", file);
      const fileURL = URL.createObjectURL(file);
      setFileURL(fileURL);
    }
  };

  function onSubmit(values: TransactionFormValues) {
    uploadReceiptCallbackMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8"
      >
        {/* Jumlah Bulan Pembayaran */}
        <FormField
          control={form.control}
          name="paidFor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dark">
                Pembayaran untuk berapa bulan
              </FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                      disabled={data[0].status !== "unpaid"}
                    >
                      {field.value
                        ? months.find((month) => month.value === field.value)
                            ?.label
                        : "Pilih Bulan"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {months.map((month) => (
                          <CommandItem
                            value={month.label}
                            key={month.value}
                            onSelect={() => {
                              form.setValue("paidFor", month.value);
                              setPaidFor(month.value);
                              setOpen(false);
                            }}
                          >
                            {month.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                month.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="receipt"
          render={() => {
            const isDragging = dragState;

            const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              e.stopPropagation();
              setDragState(true);
            };

            const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              e.stopPropagation();
              setDragState(false);
            };

            const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              e.stopPropagation();
              setDragState(false);
              const file = e.dataTransfer.files?.[0] || null;
              handleFileChange(file);
            };

            return (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel className="text-primary text-sm">
                  Bukti Pembayaran
                </FormLabel>
                {data[0].receipt ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(data[0].receipt, "_blank")}
                  >
                    Lihat Bukti Pembayaran
                  </Button>
                ) : (
                  <>
                    <FormControl>
                      <div
                        className={`flex flex-col items-center justify-center rounded-md border-2 ${
                          isDragging
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 hover:border-muted-foreground/50"
                        } border-dashed p-6 transition-all`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <Input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            handleFileChange(file);
                            // Reset the input value to allow re-selecting the same file
                            if (!file) {
                              e.target.value = "";
                            }
                          }}
                          ref={fileInputRef}
                        />
                        <div className="flex flex-col items-center gap-2 text-center">
                          <FileUp className="text-muted-foreground h-8 w-8" />
                          <p className="text-sm font-medium">
                            {isDragging
                              ? "Geser berkas kesini untuk upload"
                              : fileName ||
                                `Klik untuk upload atau drag & drop`}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              Pilih Bukti Pembayaran
                            </Button>
                            {fileURL && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(fileURL, "_blank")}
                              >
                                Lihat File
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </>
                )}
              </FormItem>
            );
          }}
        />

        <Button
          type="submit"
          className="self-end"
          disabled={data[0].status !== "unpaid"}
        >
          Kirim Pembayaran
        </Button>
      </form>
    </Form>
  );
}

export default TransactionForm;
