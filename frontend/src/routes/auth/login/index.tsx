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
import { UserLoginRequestSchema } from "@/lib/zod/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/auth/login/")({
  component: RouteComponent,
});

type UserLoginFormValues = z.infer<typeof UserLoginRequestSchema>;

function RouteComponent() {
  const navigate = useNavigate();
  const loginCallbackMutation = useMutation({
    mutationFn: (data: UserLoginFormValues) =>
      api.auth.login({ requestBody: data }),
    onSuccess: (_data, _variables, context) => {
      toast.dismiss(context);
      toast.success("Berhasil melakukan login", {
        description: "Selamat datang kembali!",
      });

      setTimeout(() => {
        navigate({ to: "/" });
      }, 1500); // 1.5 seconds delay
    },
    onError: (_error, _variables, context) => {
      toast.dismiss(context);
      toast.warning("Gagal melakukan login", {
        description: "Silakan coba lagi",
      });
    },
    onMutate: () => {
      const loading = toast.loading("Sedang melakukan login...", {
        description: "Mohon tunggu sebentar",
        duration: Infinity,
      });
      return loading;
    },
  });

  const form = useForm<UserLoginFormValues>({
    resolver: zodResolver(UserLoginRequestSchema),
  });

  async function onSubmit(values: UserLoginFormValues) {
    loginCallbackMutation.mutate(values);
  }

  return (
    <div className="md:px-auto min-h-[100vh] bg-[#F3F4F6] px-9 pt-16 pb-16">
      <div className="flex flex-col items-center gap-9">
        <img
          src="/icon/logo-basic.png"
          alt="logo"
          className="mx-auto h-[81px] w-[123px]"
        />
        <h1 className="text-primary text-center text-3xl font-bold md:text-[50px]">
          Selamat Datang Kembali!
        </h1>
        <h2 className="text-primary text-center text-2xl md:text-[26px]">
          Masuk ke akun Anda
        </h2>
        <section className="md:w-[400px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-5"
            >
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary text-sm">
                      Email atau No. Whatsapp
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan email atau nomor WA Anda"
                        {...field}
                      />
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
                        placeholder="Masukkan password Anda"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TODO: Ganti ke route aslinya nanti */}
              <Link to="." className="text-primary underline">
                Lupa password?
              </Link>

              <Button type="submit">Masuk</Button>

              {/* TODO: Add microsoft azure OAuth2 */}

              <p className="text-primary text-center text-base">
                Belum punya akun?{" "}
                <Link to="/auth/register" className="underline">
                  Daftar disini sekarang
                </Link>
              </p>
            </form>
          </Form>
        </section>
      </div>
    </div>
  );
}
