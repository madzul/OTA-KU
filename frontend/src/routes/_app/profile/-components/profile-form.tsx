"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Zod validation schema
const profileFormSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1, { message: "Nama lengkap harus diisi" }),
    occupation: z.string().optional(),
    address: z.string().optional(),
    relationshipWithITB: z.string().optional(),
  }),
  sponsorshipDetails: z.object({
    monthlyContribution: z
      .string()
      .min(300000, { message: "Minimal Rp 300.000" }),
    beneficiary: z.string().optional(),
    startDate: z.string().optional(),
    duration: z.string().optional(),
    dateTransfer: z.string().min(1).max(31),
    criteriaDescription: z.string().optional(),
    agreeToContact: z.boolean().optional(),
  }),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

const ProfileForm: React.FC = () => {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      personalInfo: {
        fullName: "",
        occupation: "",
        address: "",
        relationshipWithITB: "",
      },
      sponsorshipDetails: {
        monthlyContribution: "",
        beneficiary: "anak-asuh",
        startDate: "",
        duration: "semester",
        dateTransfer: "",
        criteriaDescription: "",
        agreeToContact: false,
      },
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log("Form Data:", data);
    // Handle form submission logic
  };

  const [date, setDate] = React.useState<Date>();
  return (
    <div className="mx-auto w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="personalInfo" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personalInfo">Data Diri</TabsTrigger>
              <TabsTrigger value="sponsorshipDetails">
                Detail Pendaftaran
              </TabsTrigger>
            </TabsList>

            <Card className="text-primary w-full">
              {/* Personal Info Tab */}
              <TabsContent value="personalInfo">
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
                    name="personalInfo.occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pekerjaan</FormLabel>
                        <FormControl>
                          <Input placeholder="Pekerjaan" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personalInfo.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Alamat" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personalInfo.relationshipWithITB"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keterkaitan dengan ITB</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="alumni">Alumni</SelectItem>
                            <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                            <SelectItem value="dosen">Dosen</SelectItem>
                            <SelectItem value="lainnya">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Sponsorship Details Tab */}
              <TabsContent value="sponsorshipDetails">
                <div className="space-y-4 p-4">
                  <FormField
                    control={form.control}
                    name="sponsorshipDetails.monthlyContribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Bersedia memberikan dana setiap bulan sebesar (dalam
                          Rp)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Minimal Rp 300.000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sponsorshipDetails.beneficiary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Untuk Diberikan Kepada</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Jumlah anak asuh"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sponsorshipDetails.startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dana akan mulai diberikan pada</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "border-input placeholder:text-muted-foreground flex h-9 w-full min-w-0 justify-start rounded-md border bg-white px-3 py-1 text-base text-black shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
                                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                                  !date && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? (
                                  format(date, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                {...field}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sponsorshipDetails.duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selama</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min. 1 semester"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sponsorshipDetails.dateTransfer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Dana akan ditransfer ke rekening IOM setiap tanggal
                        </FormLabel>
                        <Input type="number" placeholder="Tanggal" {...field} />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sponsorshipDetails.criteriaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Adapun Kriteria Anak Asuh yang Diinginkan (Opsional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Contoh: Jenis kelamin, fakultas, agama, dll."
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sponsorshipDetails.agreeToContact"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>
                            Saya bersedia dihubungi melalui nomor HP untuk
                            koordinasi dalam penyaluran bantuan. Demikian
                            pernyataan ini saya buat dengan sebenarnya untuk
                            dapat dipergunakan sebagaimana mestinya. Saya tidak
                            keberatan untuk berkomunikasi dengan anak asuh
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Card>
          </Tabs>

          <div className="flex justify-end space-x-2 p-4">
            <Button type="button" className="w-24 xl:w-40" variant="outline">
              Batal
            </Button>
            <Button type="submit" className="w-24 xl:w-40">Simpan</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
