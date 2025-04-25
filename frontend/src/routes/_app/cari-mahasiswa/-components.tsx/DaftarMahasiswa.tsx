import { api } from "@/api/client";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import React, { JSX, useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SessionContext } from "@/context/session";

// Response data dari API
interface MahasiswaResponse {
  accountId: string;
  email: string;
  name: string;
  nim: string;
  mahasiswaStatus: "active" | "inactive";
  description: string;
  file: string;
  major: string;
  faculty: string;
  cityOfOrigin: string;
  highschoolAlumni: string;
  notes: string;
}

// Data mahasiswa yang akan ditampilkan di UI
interface Mahasiswa {
  id: string;
  name: string;
  major: string;
  faculty: string;
  cityOfOrigin: string;
  highschoolAlumni: string;
  notes: string;
}

// TODO: FIKSASI DATA BELUM AMA IOM

const mapApiDataToMahasiswa = (apiData: MahasiswaResponse[]): Mahasiswa[] => {
  return apiData.map((item) => ({
    id: item.accountId,
    name: item.name,
    major: item.major || "Jurusan tidak tersedia",
    faculty: item.faculty || "Fakultas tidak tersedia",
    cityOfOrigin: item.cityOfOrigin || "Asal kota tidak tersedia",
    highschoolAlumni: item.highschoolAlumni || "Alumni SMA tidak tersedia",
    notes: item.notes || "Catatan tidak tersedia",
  }));
};

function DaftarMahasiswa(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const session = useContext(SessionContext);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<null | Mahasiswa>(null);

  const bantuHandler = useMutation({
    mutationFn: (id: { mahasiswa: string; ota: string }) => {
      return api.connect.connectOtaMahasiswa({
        formData: {
          mahasiswaId: id.mahasiswa,
          otaId: id.ota,
        },
      });
    },
    onSuccess: () => {
      toast.success("Berhasil melakukan permintaan Bantuan Orang Tua Asuh", {
        description: "Permintaan akan segera diproses oleh IOM ITB",
      });
      setSelectedMahasiswa(null);
    },
    onError: (error) => {
      toast.warning("Gagal melakukan permintaan Bantuan Orang Tua Asuh", {
        description: error.message,
      });
      setSelectedMahasiswa(null);
    },
  });

  const handleBantuConfirm = () => {
    if (selectedMahasiswa) {
      bantuHandler.mutate({
        mahasiswa: selectedMahasiswa.id,
        ota: session?.id || "",
      });
    }
  };

  // Gunakan useQuery untuk fetch data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["listMahasiswaOta", searchQuery],
    queryFn: () =>
      api.list.listMahasiswaOta({
        q: searchQuery,
        page: 1,
      }),
    staleTime: 5 * 60 * 1000, // 5 menit

    select: (response) => {
      // Transform data API ke format UI
      if (response.success && response.body && response.body.data) {
        return mapApiDataToMahasiswa(response.body.data);
      }
      return [];
    },
  });

  // Menangani perubahan input dengan debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const mahasiswaList = data || [];

  // Handle error message
  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : "Gagal memuat data mahasiswa"
    : null;

  return (
    <div className="flex flex-col gap-4 text-[32px] md:gap-8">
      <h1 className="text-dark font-bold">Cari Mahasiswa</h1>

      <div className="w-full">
        {/* TODO: Pakein debounce search */}
        <Input
          placeholder="Cari mahasiswa"
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full"
        />
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <div className="flex animate-spin items-center justify-center">
            <LoaderCircle size={32} />
          </div>
          <p className="text-dark text-center text-base font-medium">
            Sedang Memuat Data...
          </p>
        </div>
      )}

      {errorMessage && <p className="text-base text-red-500">{errorMessage}</p>}

      {!isLoading && mahasiswaList.length === 0 && (
        <div className="flex items-center justify-center py-16">
          <p className="text-dark text-center text-2xl font-bold md:text-3xl">
            Tidak ada mahasiswa yang ditemukan
          </p>
        </div>
      )}

      <section
        className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
      >
        {mahasiswaList.map((mahasiswa) => (
          <div
            key={mahasiswa.id}
            className="border p-4 rounded-lg shadow-md bg-white"
          >
            <h2 className="text-lg font-bold">{mahasiswa.name}</h2>
            <p className="text-sm text-gray-600">Jurusan: {mahasiswa.major}</p>
            <p className="text-sm text-gray-600">Fakultas: {mahasiswa.faculty}</p>
            <p className="text-sm text-gray-600">
              Asal Kota: {mahasiswa.cityOfOrigin}
            </p>
            <p className="text-sm text-gray-600">
              Alumni SMA: {mahasiswa.highschoolAlumni}
            </p>
            <div className="text-sm text-gray-600">
              <p>Catatan:</p>
              <p>{mahasiswa.notes}</p>
            </div>
            <div className="flex gap-2 mt-4">
              {/* TODO: page detail belom nampilin schema db detail mahasiswa yang terbaru */}
              <Button
                variant="outline"
                onClick={() => (window.location.href = `/detail/mahasiswa/${mahasiswa.id}`)}
              >
                Lihat Profil
              </Button>
              {/* TODO: Pas di klik masih internal server error */}
              <Button onClick={() => setSelectedMahasiswa(mahasiswa)}>
                Bantu
              </Button>
            </div>
          </div>
        ))}
      </section>

      {selectedMahasiswa && (
        <Dialog open={!!selectedMahasiswa} onOpenChange={() => setSelectedMahasiswa(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Konfirmasi Bantuan</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin memberikan bantuan kepada{" "}
                <span className="text-dark font-bold">{selectedMahasiswa.name}</span>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Button
                type="button"
                variant="outline"
                className="sm:flex-1"
                onClick={() => setSelectedMahasiswa(null)}
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleBantuConfirm}
                disabled={bantuHandler.isPending}
                className="sm:flex-1"
              >
                {bantuHandler.isPending ? "Memproses..." : "Bantu"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default DaftarMahasiswa;
