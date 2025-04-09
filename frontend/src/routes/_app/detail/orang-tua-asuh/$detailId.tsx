import { useParams } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import DetailCardsOrangTuaAsuh from "./-components/detail-card";

interface OtaDetailResponse {
  success: boolean;
  message: string;
  body: {
    accountId: string;
    name: string;
    job: string;
    address: string;
    linkage: "otm" | "alumni";
    funds: number;
    maxCapacity: number;
    startDate: string;
    maxSemester: number;
    transferDate: number;
    criteria: string;
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

  useEffect(() => {
    async function fetchOtaData() {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/detail/orang-tua-asuh/${id}`,
          { credentials: "include" },
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: OtaDetailResponse = await response.json();

        if (!data.success) {
          throw new Error(data.message);
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

  if (error || !otaData) {
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
  const startDate = new Date(otaData.startDate);
  const formattedStartDate = startDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Transforming database data to match the component props
  const displayData = {
    name: otaData.name,
    role: otaData.linkage === "alumni" ? "Alumni ITB" : "Orang Tua Mitra",
    email: `${otaData.name.toLowerCase().replace(/\s+/g, ".")}@example.com`, // Example email
    phone: "+62812XXXXXXXX", // Example phone
    joinDate: `Bergabung sejak ${formattedStartDate}`,
    occupation: otaData.job,
    address: otaData.address,
    linkage: otaData.linkage,
    funds: otaData.funds,
    maxCapacity: otaData.maxCapacity,
    maxSemester: otaData.maxSemester,
    transferDate: otaData.transferDate,
    criteria: otaData.criteria,
    beneficiary: Math.floor(Math.random() * otaData.maxCapacity), // Random number for demonstration
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-primary mb-4 text-2xl font-bold">
        Detail Orang Tua Asuh
      </h1>
      <DetailCardsOrangTuaAsuh
        name={displayData.name}
        role={displayData.role}
        email={displayData.email}
        phone={displayData.phone}
        joinDate={displayData.joinDate}
        avatarSrc=""
        occupation={displayData.occupation}
        beneficiary={displayData.beneficiary}
        address={displayData.address}
        linkage={displayData.linkage}
        funds={displayData.funds}
        maxCapacity={displayData.maxCapacity}
        maxSemester={displayData.maxSemester}
        transferDate={displayData.transferDate}
        criteria={displayData.criteria}
      />
    </div>
  );
}

export default RouteComponent;
