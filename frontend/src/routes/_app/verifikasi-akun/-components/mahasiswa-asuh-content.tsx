import { api, queryClient } from "@/api/client";
import { ClientPagination } from "@/components/client-pagination";
import { SearchInput } from "@/components/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { Route } from "..";
import { mahasiswaColumns } from "./columns";
import CountDataCard from "./count-data-card";
import { DataTable } from "./data-table";
import { totalCountMahasiswa } from "./dummy";
import FilterStatus from "./filter-status";

// TODO: Tentuin jadi pake atau ga
// import FilterJurusan from "./filter-jurusan";

function MahasiswaAsuhContent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const page = parseInt(searchParams.get("page") ?? "1") || 1;

  const [search, setSearch] = useState<string>("");
  const [value] = useDebounce(search, 500);
  const [status, setStatus] = useState<"accepted" | "pending" | "rejected">();

  const { data, isSuccess } = useQuery({
    queryKey: ["listMahasiswaAdmin"],
    queryFn: () => api.list.listMahasiswaAdmin({ page }),
  });

  const mahasiswaTableData = data?.body.data.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    jurusan: item.major,
    status: item.applicationStatus,
  }));

  useEffect(() => {
    queryClient.fetchQuery({
      queryKey: ["listMahasiswaAdmin"],
      queryFn: () =>
        api.list.listMahasiswaAdmin({
          page: 1,
          q: value,
          status,
        }),
    });

    navigate({
      search: () => ({
        page: 1,
      }),
    });
  }, [navigate, status, value]);

  return (
    <section className="flex flex-col gap-4">
      {/* Card Count Info */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {totalCountMahasiswa.map((item, index) => (
          <CountDataCard
            key={index}
            color={item.color}
            count={
              index === 0
                ? data?.body.totalData
                : index === 1
                  ? data?.body.totalPending
                  : index === 2
                    ? data?.body.totalAccepted
                    : data?.body.totalRejected
            }
            title={item.title}
          />
        ))}
      </div>

      {/* Search and Filters */}
      {!isSuccess ? (
        <div className="rounded-md bg-white">
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <SearchInput
            placeholder="Cari nama atau email"
            setSearch={setSearch}
          />
          {/* <FilterJurusan /> */}
          <FilterStatus setStatus={setStatus} />
        </div>
      )}

      {/* Table */}
      {!isSuccess ? (
        <div className="rounded-md bg-white">
          <Skeleton className="h-80 w-full" />
        </div>
      ) : (
        <DataTable columns={mahasiswaColumns} data={mahasiswaTableData || []} />
      )}

      {/* Pagination */}
      {!isSuccess ? (
        <div className="rounded-md bg-white">
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <ClientPagination totalPerPage={8} total={data.body.totalData} />
      )}
    </section>
  );
}

export default MahasiswaAsuhContent;
