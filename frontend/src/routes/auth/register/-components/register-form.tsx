import { api } from "@/api/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { UserRegisRequestSchema } from "@/lib/zod/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type UserRegisterFormValues = z.infer<typeof UserRegisRequestSchema>;

export default function RegisterForm({ role }: { role: string }) {
  const navigate = useNavigate();
  const registerCallbackMutation = useMutation({
    mutationFn: (data: UserRegisterFormValues) =>
      api.auth.regis({ requestBody: data }),
    onSuccess: (_data, _variables, context) => {
      toast.dismiss(context);
      toast.success("Berhasil melakukan registrasi", {
        description: "Silakan cek email Anda untuk verifikasi",
      });

      setTimeout(() => {
        navigate({ to: "/" });
      }, 1500); // 1.5 seconds delay
    },
    onError: (_error, _variables, context) => {
      toast.dismiss(context);
      toast.warning("Gagal melakukan registrasi", {
        description: "Silakan coba lagi",
      });
    },
    onMutate: () => {
      const loading = toast.loading("Sedang melakukan registrasi...", {
        description: "Mohon tunggu sebentar",
        duration: Infinity,
      });
      return loading;
    },
  });

  const form = useForm<UserRegisterFormValues>({
    resolver: zodResolver(UserRegisRequestSchema),
    defaultValues: {
      type: role as "mahasiswa" | "ota",
    },
  });

  async function onSubmit(values: UserRegisterFormValues) {
    registerCallbackMutation.mutate(values);
  }

  return (
    <div className="flex flex-col items-center gap-9">
      <img
        src="/icon/logo-basic.png"
        alt="logo"
        className="mx-auto h-[81px] w-[123px]"
      />
      <h1 className="text-primary text-center text-3xl font-bold md:text-[50px]">
        Daftar Sebagai {role === "mahasiswa" ? "Mahasiswa" : "Orang Tua Asuh"}
      </h1>
      <h2 className="text-primary text-center text-2xl md:text-[26px]">
        Silahkan isi kolom yang tersedia
      </h2>
      <section className="md:w-[400px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan email Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">
                    Nomor HP (Whatsapp)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor WA Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">
                    Kata sandi
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Masukkan kata sandi Anda"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-sm">
                    Konfirmasi kata sandi
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Masukkan kata sandi Anda"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                className="bg-secondary hover:bg-secondary/90 px-8 text-white"
                onClick={() => navigate({ reloadDocument: true })}
                disabled={registerCallbackMutation.isPending}
              >
                Kembali
              </Button>
              <Button
                type="submit"
                disabled={registerCallbackMutation.isPending}
              >
                Daftar
              </Button>
            </div>

            {/* TODO: Add microsoft azure OAuth2 */}
          </form>
        </Form>
      </section>
    </div>
  );
}
