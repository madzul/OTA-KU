"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Zod validation schema
const profileFormSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1, "Nama lengkap tidak boleh kosong"),
    phoneNumber: z.string().min(1, "Nomor HP tidak boleh kosong"),
    NIM: z.string().min(1, "NIM tidak boleh kosong"),
    reasonForAssistance: z.string().min(1, "Alasan keperluan bantuan tidak boleh kosong"),
    fileUpload: z.instanceof(File).optional(), // Optional file upload
  }),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

const ProfileFormMA: React.FC = () => {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      personalInfo: {
        fullName: "",
        phoneNumber: "",
        NIM: "",
        reasonForAssistance: "",
        fileUpload: undefined, // Default value for file upload
      },
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log("Form Data:", data);
    // Handle form submission logic
  };

  return (
    <div className="mx-auto w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="text-primary w-full">
            <p className="text-primary px-4 text-4xl font-bold">Data Diri</p>
            <div className="space-y-4 p-4">
              <FormField
                control={form.control}
                name="personalInfo.fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalInfo.phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor HP (WhatsApp)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nomor HP (WhatsApp)" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalInfo.NIM"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIM</FormLabel>
                    <FormControl>
                      <Input placeholder="NIM" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personalInfo.reasonForAssistance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alasan keperluan bantuan</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Alasan keperluan bantuan" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* Input file */}
                <FormField
                    control={form.control}
                    name="personalInfo.fileUpload"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                        <FormLabel>Upload berkas pengajuan bantuan</FormLabel>
                        <FormControl>
                        <Input 
                          type="file" 
                          {...fieldProps} 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                            }
                          }}
                        />
                        </FormControl>
                    </FormItem>
                    )}
                />
            </div>
          </Card>

          <div className="flex justify-end space-x-2 p-4">
            <Button type="button" className="w-24 xl:w-40" variant="outline">
              Batal
            </Button>
            <Button type="submit" className="w-24 xl:w-40">
              Simpan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileFormMA;
