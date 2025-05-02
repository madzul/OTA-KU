import { redirect, useParams } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import DetailCardsMahasiswaAsuh from "./-components/detail-card";

interface MahasiswaDetailResponse {
  success: boolean;
  message: string;
  body: {
    accountId: string;
    name: string;
    nim: string;
    mahasiswaStatus: string;
    description: string | null;
    file: string | null;
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

  useEffect(() => {
    async function fetchMahasiswaData() {
      try {
        setLoading(true);
        const response = await fetch(
          // TODO: Nanti ganti pake generated API
          `http://localhost:3000/api/detail/mahasiswa/${id}`,
          { credentials: "include" },
        );
        console.log("Response:", response);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: MahasiswaDetailResponse = await response.json();

        if (!data.success) {
          throw new Error(data.message);
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
        <div className="text-center">
          <p className="text-primary text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !mahasiswaData) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <div className="text-center">
          <h1 className="text-primary text-2xl font-bold">Error</h1>
          <p className="text-muted-foreground mt-4 text-lg">
            {error || "Failed to load mahasiswa data"}
          </p>
        </div>
      </div>
    );
  }

  // TODO: Transforming database data to match the component props
  const displayData = {
    name: mahasiswaData.name,
    role:
      mahasiswaData.mahasiswaStatus === "active"
        ? "Mahasiswa Aktif"
        : "Mahasiswa Tidak Aktif",
    email: `${mahasiswaData.nim}@mahasiswa.itb.ac.id`,
    phone: "-",
    joinDate: "Terdaftar sejak 2023",
    avatarSrc: "",
    departement: "Teknik Informatika",
    faculty: "STEI-K",
    batch: "2022",
    description: mahasiswaData.description || "-",
    file: mahasiswaData.file || "-",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-primary mb-4 text-2xl font-bold">
        Detail Mahasiswa Asuh
      </h1>
      <DetailCardsMahasiswaAsuh
        name={displayData.name}
        role={displayData.role}
        email={displayData.email}
        phone={displayData.phone}
        joinDate={displayData.joinDate}
        avatarSrc=""
        departement="Teknik Informatika"
        faculty="STEI-K"
        batch={displayData.batch}
        gpa={3.5}
      />

      {/* Additional information from API */}
      <div className="mt-8">
        <h2 className="text-primary mb-4 text-xl font-bold">
          Informasi Tambahan
        </h2>
        <div className="rounded-lg border p-4 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Deskripsi</h3>
            <p className="text-muted-foreground mt-2">
              {displayData.description}
            </p>
          </div>
          {displayData.file && displayData.file !== "-" && (
            <div>
              <h3 className="text-lg font-semibold">File Lampiran</h3>
              <a
                href={displayData.file}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-blue-600 hover:underline"
              >
                Lihat Dokumen
              </a>
            </div>
          )}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Status</h3>
            <div className="mt-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteComponent;
