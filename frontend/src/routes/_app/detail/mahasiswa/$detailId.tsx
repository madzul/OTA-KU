import Metadata from "@/components/metadata";
import { Card } from "@/components/ui/card";
import { redirect, useParams } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, UserX } from "lucide-react";
import { useEffect, useState } from "react";

import DetailCardsMahasiswaAsuh from "./-components/detail-card";

const genderMap = {
  M: "Laki-laki",
  F: "Perempuan",
};

interface MahasiswaDetailResponse {
  success: boolean;
  message: string;
  body: {
    id: string;
    email: string;
    type: string;
    adminOnlyNotes: string | null;
    applicationStatus: string;
    cityOfOrigin: string;
    description: string | null;
    dibacaRecommendationLetter: string | null;
    electricityBill: string | null;
    file: string | null;
    gender: "F" | "M";
    gpa: string;
    highSchoolAlumni: string;
    kk: string | null;
    ktm: string | null;
    mahasiswaStatus: string;
    major: string;
    name: string;
    nim: string;
    notes: string | null;
    pbb: string | null;
    phoneNumber: string;
    provider: string;
    religion: string;
    salaryReport: string | null;
    transcript: string | null;
    waliRecommendationLetter: string | null;
    faculty: string;
  };
}

export const Route = createFileRoute("/_app/detail/mahasiswa/$detailId")({
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

function RouteComponent() {
  const { detailId: id } = useParams({
    from: "/_app/detail/mahasiswa/$detailId",
  });
  const [mahasiswaData, setMahasiswaData] = useState<
    MahasiswaDetailResponse["body"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchMahasiswaData() {
      try {
        setLoading(true);
        setNotFound(false);

        const response = await fetch(
          `http://localhost:3000/api/detail/mahasiswa/${id}`,
          { credentials: "include" },
        );
        console.log("Response:", response);

        let data: MahasiswaDetailResponse;

        try {
          data = await response.json();
          console.log("Data:", data);

          if (
            !data.success &&
            (data.message.toLowerCase().includes("not found") ||
              data.message.toLowerCase().includes("tidak ditemukan") ||
              data.message.toLowerCase().includes("tidak ada") ||
              response.status === 404)
          ) {
            setNotFound(true);
            throw new Error("Mahasiswa Tidak Ditemukan");
          }

          if (!data.success) {
            throw new Error(data.message);
          }
        } catch {
          if (response.status === 404 || response.status === 400) {
            setNotFound(true);
            throw new Error("Mahasiswa Tidak Ditemukan");
          }

          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        if (!response.ok) {
          if (response.status === 404 || response.status === 400) {
            setNotFound(true);
            throw new Error("Mahasiswa Tidak Ditemukan");
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        setMahasiswaData(data.body);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch mahasiswa data",
        );
        console.error("Error fetching mahasiswa data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchMahasiswaData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <Metadata title="Detail Mahasiswa | BOTA" />
        <div className="text-center">
          <p className="text-primary text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Special handling for not found state
  if (notFound) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <Metadata title="Detail Mahasiswa | BOTA" />
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <UserX size={64} className="text-primary" />
          </div>
          <h1 className="text-primary text-2xl font-bold">
            Mahasiswa Tidak Ditemukan
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Data mahasiswa dengan ID tersebut tidak dapat ditemukan di sistem
          </p>
        </div>
      </div>
    );
  }

  if (error || !mahasiswaData) {
    if (error && error.includes("Mahasiswa Tidak Ditemukan")) {
      setNotFound(true);
      return (
        <div className="container mx-auto flex items-center justify-center px-4 py-16">
          <Metadata title="Detail Mahasiswa | BOTA" />
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <UserX size={64} className="text-primary" />
            </div>
            <h1 className="text-primary text-2xl font-bold">
              Mahasiswa Tidak Ditemukan
            </h1>
            <p className="text-muted-foreground mt-4 text-lg">
              Data mahasiswa dengan ID tersebut tidak dapat ditemukan di sistem
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <Metadata title="Detail Mahasiswa | BOTA" />
        <div className="text-center">
          <h1 className="text-primary text-2xl font-bold">Error</h1>
          <p className="text-muted-foreground mt-4 text-lg">
            {error || "Failed to load mahasiswa data"}
          </p>
        </div>
      </div>
    );
  }

  const nim = mahasiswaData.nim || mahasiswaData.email.split("@")[0];

  const angkatan = nim.length >= 4 ? "20" + nim.substring(0, 2) : "-";

  return (
    <main className="flex min-h-[calc(100vh-70px)] flex-col p-2 px-6 py-8 md:px-12 lg:min-h-[calc(100vh-96px)]">
      <Metadata title="Detail Mahasiswa | BOTA" />
      <h1 className="text-primary mb-4 text-2xl font-bold">
        Detail Mahasiswa Asuh
      </h1>

      {/* Data diri */}
      <DetailCardsMahasiswaAsuh
        name={mahasiswaData.name}
        role={
          mahasiswaData.mahasiswaStatus === "active"
            ? "Mahasiswa Aktif"
            : "Mahasiswa Tidak Aktif"
        }
        email={mahasiswaData.email}
        phone={mahasiswaData.phoneNumber || "-"}
        joinDate={`Terdaftar sejak ${angkatan}`}
        avatarSrc=""
        departement={mahasiswaData.major || "-"}
        faculty={mahasiswaData.faculty || "-"}
        batch={angkatan}
        gpa={mahasiswaData.gpa ? parseFloat(mahasiswaData.gpa) : undefined}
        gender={mahasiswaData.gender ? genderMap[mahasiswaData.gender] : "-"}
        religion={mahasiswaData.religion || "-"}
      />

      {/* Essay and IOM Notes */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center">
            <FileText className="text-primary mr-2 h-5 w-5" />
            <h3 className="text-lg font-semibold">Essay</h3>
          </div>
          <div className="text-gray-600">
            {mahasiswaData.file ? (
              <a
                href={mahasiswaData.file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Lihat Essay
              </a>
            ) : (
              "-"
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center">
            <FileText className="text-primary mr-2 h-5 w-5" />
            <h3 className="text-lg font-semibold">Catatan dari IOM</h3>
          </div>
          <div className="text-gray-600">
            {mahasiswaData.notes || mahasiswaData.adminOnlyNotes || "-"}
          </div>
        </Card>
      </div>

      {/* Status */}
      <div className="mt-6">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Status</h3>
          <div>
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                mahasiswaData.mahasiswaStatus === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {mahasiswaData.mahasiswaStatus === "active"
                ? "Aktif"
                : "Tidak Aktif"}
            </span>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default RouteComponent;
