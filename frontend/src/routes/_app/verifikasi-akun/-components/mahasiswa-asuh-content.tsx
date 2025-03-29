import { ClientPagination } from "@/components/client-pagination";
import { SearchInput } from "@/components/search-input";

import { mahasiswaColumns } from "./columns";
import CountDataCard from "./count-data-card";
import { DataTable } from "./data-table";
import { mahasiswaTableData, totalCountMahasiswa } from "./dummy";
import FilterStatus from "./filter-status";

// TODO: Tentuin jadi pake atau ga
// import FilterJurusan from "./filter-jurusan";

function MahasiswaAsuhContent() {
  return (
    <section className="flex flex-col gap-4">
      {/* Card Count Info */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {totalCountMahasiswa.map((item, index) => (
          <CountDataCard
            key={index}
            color={item.color}
            count={item.count}
            title={item.title}
          />
        ))}
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <SearchInput placeholder="Cari nama atau email" />
        {/* <FilterJurusan /> */}
        <FilterStatus />
      </div>

      {/* Table */}
      <DataTable columns={mahasiswaColumns} data={mahasiswaTableData} />

      {/* Pagination */}
      {/* TODO: Ganti jadi value aslinya nanti */}
      <ClientPagination totalPerPage={8} total={64} />
    </section>
  );
}

export default MahasiswaAsuhContent;
