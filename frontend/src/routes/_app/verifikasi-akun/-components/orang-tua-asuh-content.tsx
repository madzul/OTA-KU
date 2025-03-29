import { ClientPagination } from "@/components/client-pagination";
import { SearchInput } from "@/components/search-input";

import { orangTuaColumns } from "./columns";
import CountDataCard from "./count-data-card";
import { DataTable } from "./data-table";
import { orangTuaTableData, totalCountOrangTua } from "./dummy";
import FilterStatus from "./filter-status";

function OrangTuaAsuhContent() {
  return (
    <section className="flex flex-col gap-4">
      {/* Card Count Info */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {totalCountOrangTua.map((item, index) => (
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
        <FilterStatus />
      </div>

      {/* Table */}
      <DataTable columns={orangTuaColumns} data={orangTuaTableData} />

      {/* Pagination */}
      {/* TODO: Ganti jadi value aslinya nanti */}
      <ClientPagination totalPerPage={8} total={64} />
    </section>
  );
}

export default OrangTuaAsuhContent;
