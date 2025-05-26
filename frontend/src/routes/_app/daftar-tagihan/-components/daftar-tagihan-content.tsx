import { useLocation, useNavigate } from "@tanstack/react-router";

import { Route } from "..";

function DaftarTagihanContent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const currentPage = parseInt(searchParams.get("page") ?? "1") || 1;

  return (
    <section className="flex flex-col gap-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-dark text-3xl font-bold md:text-[50px]">
            Daftar Tagihan
          </h1>
          <p className="text-dark text-xl font-bold md:text-2xl">
            Verifikasi Transaksi OTA
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      {/* <div className="flex flex-col gap-4">
        <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
          <FilterYear
            years={data?.body.years || []}
            year={year}
            setYear={setYear}
          />
          <FilterMonth month={month} setMonth={setMonth} />
        </div>
      </div> */}

      {/* Search and Filters */}
      {/* {isLoading ? (
        <div className="rounded-md bg-white">
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          yearFilter={yearFilter}
          onYearChange={setYearFilter}
          monthFilter={monthFilter}
          onMonthChange={setMonthFilter}
          statusFilter={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
      )} */}

      {/* Table */}
      {/* {isLoading ? (
        <div className="rounded-md bg-white">
          <Skeleton className="h-80 w-full" />
        </div>
      ) : (
        <DataTable
          columns={tagihanColumns}
          data={transactionData?.body?.data || []}
        />
      )} */}

      {/* Pagination */}
      {/* {isLoading ? (
        <div className="rounded-md bg-white">
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <ClientPagination
          total={transactionData?.body?.totalData || 0}
          totalPerPage={ITEMS_PER_PAGE}
          animate={true}
        />
      )} */}
    </section>
  );
}

export default DaftarTagihanContent;
