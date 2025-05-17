import { api } from "@/api/client";
import { ListTerminateForOTA } from "@/api/generated";
import Metadata from "@/components/metadata";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionContext } from "@/context/session";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

export const Route = createFileRoute("/_app/daftar/terminasi-mahasiswa/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = context.session;

    if (!user) {
      throw redirect({ to: "/auth/login" });
    }

    if (user.type !== "ota") {
      throw redirect({ to: "/" });
    }

    return { user };
  },
});

interface StudentCardProps {
  student: ListTerminateForOTA;
  onTerminateSuccess: (studentId: string) => void;
}

function StudentCard({ student, onTerminateSuccess }: StudentCardProps) {
  const session = useContext(SessionContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteConnection = useMutation({
    mutationFn: (data: { maId: string; requestTerminationNote: string }) => {
      return api.terminate.requestTerminateFromOta({
        formData: {
          otaId: session?.id ? session.id : "",
          mahasiswaId: data.maId,
          requestTerminationNote: data.requestTerminationNote,
        },
      });
    },
    onSuccess: () => {
      setIsModalOpen(false);
      onTerminateSuccess(student.mahasiswaId);
      try {
        toast.success(`Hubungan dengan ${student.maName} berhasil diterminasi`);
      } catch (e: Error | unknown) {
        toast.error(
          `Gagal mengakhiri hubungan dengan ${student.maName}. Silakan coba lagi.`,
          { description: e instanceof Error ? e.message : String(e) },
        );
      }
    },
  });

  const handleTerminate = () => {
    deleteConnection.mutate({
      maId: student.mahasiswaId,
      // TODO: Nanti tambahin input catatan terminasi
      requestTerminationNote:
        "Saya sudah tidak ingin berhubungan dengan mahasiswa ini.",
    });
  };

  return (
    <Card className="w-full rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{student.maName}</h2>
          <p className="text-xl text-gray-500">{student.maNIM || "13522005"}</p>
          <p className="mt-2 text-gray-500">
            Berhubungan sejak:{" "}
            <span className="font-semibold">
              {new Date(student.createdAt).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </p>
        </div>
        <Button
          variant="destructive"
          className="flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 focus:ring-2 focus:ring-red-300 focus:outline-none active:bg-red-700"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src="/icon/Type=remove.svg"
            alt="Terminate"
            className="h-5 w-5"
          />
          Terminate
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              Konfirmasi Terminasi
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mengakhiri hubungan dengan mahasiswa asuh{" "}
              <span className="font-bold">{student.maName}</span>?
            </DialogDescription>
          </DialogHeader>
          {/* <div className="py-4">
            <p className="text-sm text-gray-500">
              Tindakan ini akan mengakhiri hubungan akademik Anda dengan
              mahasiswa ini. Setelah terminasi, Anda tidak akan dapat melihat
              atau berinteraksi dengan mahasiswa ini lagi.
            </p>
          </div> */}
          <DialogFooter className="flex justify-end gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-gray-300 hover:bg-gray-50 active:bg-gray-100"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleTerminate}
              className="bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-300 focus:outline-none active:bg-red-700"
            >
              {"Ya, Terminasi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const queryClient = useQueryClient();

  const [localStudents, setLocalStudents] = useState<ListTerminateForOTA[]>([]);

  const { data: activeStudentsData, isSuccess: isActiveSuccess } = useQuery({
    queryKey: ["listTerminateForOta", debouncedSearchQuery],
    queryFn: () =>
      api.terminate.listTerminateForOta({
        q: debouncedSearchQuery,
        page: 1,
      }),
  });

  // Update local state when activeStudentsData changes
  useEffect(() => {
    if (activeStudentsData?.body?.data) {
      setLocalStudents(activeStudentsData.body.data);
    }
  }, [activeStudentsData]);

  // Handle student termination success
  const handleTerminateSuccess = (studentId: string) => {
    // Update local state immediately
    setLocalStudents((prevStudents) =>
      prevStudents.filter((student) => student.mahasiswaId !== studentId),
    );

    queryClient.invalidateQueries({
      queryKey: ["listTerminateForOta", debouncedSearchQuery],
    });
  };

  const isLoading = !isActiveSuccess;

  return (
    <main className="flex min-h-[calc(100vh-70px)] flex-col p-2 px-6 py-8 md:px-12 lg:min-h-[calc(100vh-96px)]">
      <Metadata title="Terminasi Mahasiswa Asuh Saya | BOTA" />
      <h1 className="mb-6 text-3xl font-bold text-[#003087]">
        Terminasi Hubungan Mahasiswa Asuh Saya
      </h1>

      <div className="relative mb-6">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Cari nama"
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : localStudents.length > 0 ? (
        <div className="flex w-full flex-col gap-4">
          {localStudents.map((student) => (
            <StudentCard
              key={student.mahasiswaId}
              student={student}
              onTerminateSuccess={handleTerminateSuccess}
            />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground py-8 text-center">
          Tidak ada mahasiswa untuk ditampilkan
        </div>
      )}
    </main>
  );
}
