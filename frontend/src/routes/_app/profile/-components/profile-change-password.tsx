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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
  userId: string;
}

export default function ChangePasswordForm({ userId }: ChangePasswordFormProps) {
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ChangePasswordValues) => {
      const formData = new FormData();
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);

      // Check where your backend is actually serving this endpoint
      // Based on your routes, it might be one of these:
      // - /api/password/change/{id}
      // - /api/v1/password/change/{id}
      // - /change/{id}
      
      const response = await fetch(`http://localhost:3000/api/password/change/${userId}`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to change password');
      }

      return responseData;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Password changed successfully");
        form.reset();
      } else {
        toast.error(data.message || "Failed to change password");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to change password");
    },
  });

  const onSubmit = (data: ChangePasswordValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-4 text-xl font-semibold">Change Password</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter new password"
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
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}