import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { Search, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { api } from "@/api/client";
import { Skeleton } from "@/components/ui/skeleton";

interface StudentCardProps {
  student: {
    name: string;
    // batch: string;
    // faculty: string;
    // department: string;
  };
}

function StudentCard({ student }: StudentCardProps) {
  return (
    <Card className="border-primary min-w-[288px] gap-2 overflow-hidden rounded-lg border p-0 pb-3">
      <CardHeader className="bg-[#003087] p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-white p-1">
            <User className="h-6 w-6 text-[#003087]" />
          </div>
          <div>
            <h3 className="font-semibold">{student.name}</h3>
            {/* <p className="text-sm">{student.batch}</p> */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="">
        <div className="mt-4 flex flex-row gap-5">
          <div>
            {/* <p className="text-muted-foreground text-sm">Fakultas</p> */}
            {/* <p>{student.faculty}</p> */}
          </div>
          <div>
            {/* <p className="text-muted-foreground text-sm">Jurusan</p> */}
            {/* <p>{student.department}</p> */}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant={"default"}>Lihat Profil</Button>
      </CardFooter>
    </Card>
  );
}

export const Route = createFileRoute("/_app/mahasiswa-asuh-saya/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const { data: activeStudentsData, isSuccess: isActiveSuccess } = useQuery({
    queryKey: ["listMaActive", debouncedSearchQuery],
    queryFn: () =>
      api.list.listMaActive({
        q: debouncedSearchQuery,
        page: 1,
      }),
  });

  const { data: pendingStudentsData, isSuccess: isPendingSuccess } = useQuery({
    queryKey: ["listMaPending", debouncedSearchQuery],
    queryFn: () =>
      api.list.listMaPending({
        q: debouncedSearchQuery,
        page: 1,
      }),
  });

  // TODO: Boros
  const activeStudents = activeStudentsData?.body.data.map((student) => ({
    name: student.name,
  })) ?? [];

  const pendingStudents = pendingStudentsData?.body.data.map((student) => ({
    name: student.name,
  })) ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-[#003087]">
        Mahasiswa Asuh Saya
      </h1>

      <Tabs defaultValue="aktif" className="flex w-full flex-col gap-4">
        <TabsList className="w-full bg-[#BBBAB8]">
          <TabsTrigger value="aktif" className="data-[state=active]:text-dark text-base font-bold text-white data-[state=active]:bg-white">
            Aktif
          </TabsTrigger>
          <TabsTrigger value="menunggu" className="data-[state=active]:text-dark text-base font-bold text-white data-[state=active]:bg-white">
            Menunggu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="aktif">
          <div className="relative mb-6">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Cari nama"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {!isActiveSuccess ? (
            <Skeleton className="h-80 w-full" />
          ) : (activeStudents ?? []).length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeStudents.map((student, index) => (
                <StudentCard key={index} student={student} />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground py-8 text-center">
              Tidak ada mahasiswa yang sedang diasuh
            </div>
          )}
        </TabsContent>

        <TabsContent value="menunggu">
          <div className="relative mb-6">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Cari nama"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {!isPendingSuccess ? (
            <Skeleton className="h-80 w-full" />
          ) : pendingStudents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pendingStudents.map((student, index) => (
                <StudentCard key={index} student={student} />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground py-8 text-center">
              Tidak ada mahasiswa yang sedang menunggu untuk diasuh
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}