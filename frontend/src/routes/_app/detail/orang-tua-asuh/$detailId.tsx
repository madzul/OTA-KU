import { useParams } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { UserX } from "lucide-react";

import DetailCardsOrangTuaAsuh from "./-components/detail-card";

// Update to match actual API response structure
interface OtaDetailResponse {
  success: boolean;
  message: string;
  body: {
    id: string;
    email: string;
    type: string;
    address: string;
    applicationStatus: string;
    criteria: string;
    funds: number;
    job: string;
    linkage: "otm" | "alumni" | "dosen" | "lainnya" | "none";
    maxCapacity: number;
    maxSemester: number;
    name: string;
    phoneNumber: string;
    provider: string;
    startDate?: string;
    transferDate: number;
  };
}

export const Route = createFileRoute("/_app/detail/orang-tua-asuh/$detailId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { detailId: id } = useParams({
    from: "/_app/detail/orang-tua-asuh/$detailId",
  });
  const [otaData, setOtaData] = useState<OtaDetailResponse["body"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchOtaData() {
      try {
        setLoading(true);
        setNotFound(false); // Reset not found state
        
        const response = await fetch(
          // TODO: Nanti ganti pake generated API
          `http://localhost:3000/api/detail/orang-tua/${id}`,
          { credentials: "include" },
        );
        console.log("Response:", response);

        let data: OtaDetailResponse;
        
        try {
          data = await response.json();
          console.log("Data:", data);
          
          // Check if the response message indicates "not found" regardless of HTTP status
          if (!data.success && 
              (data.message.toLowerCase().includes("not found") || 
               data.message.toLowerCase().includes("tidak ditemukan") ||
               data.message.toLowerCase().includes("tidak ada") ||
               response.status === 404)) {
            setNotFound(true);
            throw new Error("Orang Tua Asuh Tidak Ditemukan");
          }
          
          // General data error handling
          if (!data.success) {
            throw new Error(data.message);
          }
        } catch (jsonError) {
          // If JSON parsing fails or we don't get proper data format
          if (response.status === 404 || response.status === 400) {
            setNotFound(true);
            throw new Error("Orang Tua Asuh Tidak Ditemukan");
          }
          
          // Re-throw for other errors
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // Handle case where response is not OK but we still got JSON
        if (!response.ok) {
          if (response.status === 404 || response.status === 400) {
            setNotFound(true);
            throw new Error("Orang Tua Asuh Tidak Ditemukan");
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        setOtaData(data.body);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch orang tua asuh data",
        );
        console.error("Error fetching orang tua asuh data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchOtaData();
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

  // Special handling for not found state
  if (notFound) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <UserX size={64} className="text-primary" />
          </div>
          <h1 className="text-primary text-2xl font-bold">Orang Tua Asuh Tidak Ditemukan</h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Data orang tua asuh dengan ID tersebut tidak dapat ditemukan di sistem
          </p>
        </div>
      </div>
    );
  }

  if (error || !otaData) {
    // Don't show generic error for not found cases - those should be caught by the notFound check above
    if (error && error.includes("Orang Tua Asuh Tidak Ditemukan")) {
      setNotFound(true);
      return (
        <div className="container mx-auto flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <UserX size={64} className="text-primary" />
            </div>
            <h1 className="text-primary text-2xl font-bold">Orang Tua Asuh Tidak Ditemukan</h1>
            <p className="text-muted-foreground mt-4 text-lg">
              Data orang tua asuh dengan ID tersebut tidak dapat ditemukan di sistem
            </p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <div className="text-center">
          <h1 className="text-primary text-2xl font-bold">Error</h1>
          <p className="text-muted-foreground mt-4 text-lg">
            {error || "Failed to load orang tua asuh data"}
          </p>
        </div>
      </div>
    );
  }

  // Format the startDate to a more human-readable form
  const startDate = otaData.startDate 
    ? new Date(otaData.startDate) 
    : new Date();
    
  const formattedStartDate = startDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Calculate random beneficiary count for demo
  const beneficiaryCount = Math.floor(Math.random() * (otaData.maxCapacity || 1)); 

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-primary mb-4 text-2xl font-bold">
        Detail Orang Tua Asuh
      </h1>
      <DetailCardsOrangTuaAsuh
        name={otaData.name}
        role={otaData.linkage === "otm" 
          ? "Orang Tua Asuh" 
          : otaData.linkage === "alumni" 
            ? "Alumni ITB" 
            : otaData.linkage === "dosen" 
              ? "Dosen ITB" 
              : otaData.linkage === "lainnya" 
                ? "Lainnya" 
                : "Tidak Ada"}
        email={otaData.email}
        phone={otaData.phoneNumber || "-"}
        joinDate={`Bergabung sejak ${formattedStartDate}`}
        avatarSrc=""
        occupation={otaData.job}
        beneficiary={beneficiaryCount}
        address={otaData.address}
        linkage={otaData.linkage}
        funds={otaData.funds}
        maxCapacity={otaData.maxCapacity}
        maxSemester={otaData.maxSemester}
        transferDate={otaData.transferDate}
        criteria={otaData.criteria}
      />
    </div>
  );
}

export default RouteComponent;