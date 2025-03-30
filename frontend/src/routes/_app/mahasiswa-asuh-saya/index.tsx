import { createFileRoute, redirect } from '@tanstack/react-router'
import * as React from "react"
import { Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for students
const students = Array.from({ length: 5 }, (_, i) => ({
  name: `Budi Santoso Ke-${i + 1}`,
  batch: "Angkatan 2022",
  faculty: "STEI-K",
  department: "Sistem dan Teknologi Informasi",
}));

interface StudentCardProps {
  student: {
    name: string
    batch: string
    faculty: string
    department: string
  }
}

// Temporary StudentCard Component
function StudentCard({ student }: StudentCardProps) {
  return (
    <Card className="min-w-[288px] border border-primary rounded-lg overflow-hidden p-0 pb-3 gap-2">
      <CardHeader className="bg-[#003087] text-white p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-full p-1">
            <User className="h-6 w-6 text-[#003087]" />
          </div>
          <div>
            <h3 className="font-semibold">{student.name}</h3>
            <p className="text-sm">{student.batch}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="">
        <div className="flex flex-row gap-5 mt-4">
          <div>
            <p className="text-sm text-muted-foreground">Fakultas</p>
            <p>{student.faculty}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Jurusan</p>
            <p>{student.department}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        {/* TODO: Ganti redirect route */}
        <Button variant={'default'} onClick={() => redirect({to:"/mahasiswa/detail/:id"})}>Lihat Profil</Button>
      </CardFooter>
    </Card>
  )
}

export const Route = createFileRoute('/_app/mahasiswa-asuh-saya/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#003087] mb-6">Mahasiswa Asuh Saya</h1>

      {/* Tabs */}
      <Tabs defaultValue="aktif" className="mb-6">
        <TabsList className="grid w-full grid-cols-2 rounded-lg bg-border">
          <TabsTrigger value="aktif" className="rounded-l-lg">
            Aktif
          </TabsTrigger>
          <TabsTrigger value="menunggu" className="rounded-r-lg">
            Menunggu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="aktif">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

            {/* Student Cards Grid */}
            {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student, index) => (
              <StudentCard key={index} student={student} />
              ))}
            </div>
            ) : (
            <div className="text-center py-8 text-muted-foreground">Tidak ada mahasiswa yang sedang diasuh</div>
            )}
        </TabsContent>

        <TabsContent value="menunggu">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Student Cards Grid */}
          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student, index) => (
              <StudentCard key={index} student={student} />
              ))}
            </div>
            ) : (
            <div className="text-center py-8 text-muted-foreground">Tidak ada mahasiswa yang sedang menunggu untuk diasuh</div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  )
}