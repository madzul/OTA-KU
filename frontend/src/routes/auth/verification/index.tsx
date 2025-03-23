import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Kode OTP harus terdiri dari 6 karakter.",
  }),
});

export const Route = createFileRoute("/auth/verification/")({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("OTP submitted:", data.pin);
  }

  // const handleResend = () => {
  //   console.log("Resending OTP...")
  //   console.log("OTP resent!")
  // }

  const handleChangeNumber = () => {
    console.log("Changing number...");
  };

  return (
    <main className="text-primary flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full md:w-3/5 lg:w-1/2 xl:w-1/3">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <img src="/logo-iom-icon.svg" alt="IOM-ITB Logo" className="h-16" />
          </div>
          <h1 className="text-3xl font-bold md:text-4xl xl:text-5xl">
            Verifikasi Kode OTP
          </h1>
          <p className="my-6 text-xl md:text-2xl xl:text-3xl">
            Cek WhatsApp Anda
          </p>
        </div>

        <div className="text-center text-sm md:text-base xl:text-lg">
          <div className="mb-6">
            <p className="">
              Kami telah mengirimkan kode 6 digit ke nomor WhatsApp Anda:
            </p>
            <p className="mt-1 font-medium">+62 8999-9999-999</p>
            <p className="mt-1">
              Silahkan masukkan kode tersebut untuk melanjutkan
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage className="text-destructive mt-2 text-sm" />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-4/5">
                Lanjutkan
              </Button>
            </form>
          </Form>
        </div>

        <div className="flex flex-col pt-0 text-sm xl:text-base">
          <div className="mt-4 flex justify-center">
            <span>Kirim ulang kode dalam 30 detik / Belum menerima kode? </span>
            <button onClick={handleChangeNumber} className="ml-1 underline">
              Kirim ulang
            </button>
          </div>

          <div className="mt-2 flex justify-center">
            <span>Nomor salah? </span>
            <button onClick={handleChangeNumber} className="ml-1 underline">
              Ubah nomor
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
