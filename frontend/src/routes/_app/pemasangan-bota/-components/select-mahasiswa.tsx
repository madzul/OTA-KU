import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserRound, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data for students with the provided information
const mockStudents = [
  {
    id: "S1",
    nama: "Siti Nurhaliza",
    nim: "101",
    jurusan: "Matematika",
    fakultas: "FMIPA",
    agama: "Islam",
    kelamin: "Perempuan",
    ipk: "3.62"
  },
  {
    id: "S2",
    nama: "Budi Santoso",
    nim: "135",
    jurusan: "Teknik Informatika",
    fakultas: "STEI",
    agama: "Kristen",
    kelamin: "Laki-laki",
    ipk: "3.45"
  },
  {
    id: "S3",
    nama: "Ahmad Rizky",
    nim: "122",
    jurusan: "Teknik Perminyakan",
    fakultas: "FTTM",
    agama: "Islam",
    kelamin: "Laki-laki",
    ipk: "3.72"
  },
  {
    id: "S4",
    nama: "Linda Oktaviani",
    nim: "104",
    jurusan: "Mikrobiologi",
    fakultas: "SITH-S",
    agama: "Katolik",
    kelamin: "Perempuan",
    ipk: "3.55"
  },
  {
    id: "S5",
    nama: "Dedi Firmansyah",
    nim: "150",
    jurusan: "Teknik Sipil",
    fakultas: "FTSL",
    agama: "Islam",
    kelamin: "Laki-laki",
    ipk: "3.33"
  }
];

// Mock data for displaying selected students in list view
const mockSelectedStudentDetails = {
  "S1": { 
    nama: "Muhammad Ahmad Naufal Ramadan",
    nim: "13522015"
  },
  "S2": { 
    nama: "Muhammad Ahmad Naufal Ramadan",
    nim: "13522015"
  },
  "S3": { 
    nama: "Muhammad Ahmad Naufal Ramadan",
    nim: "13522015"
  },
  "S4": { 
    nama: "Muhammad Ahmad Naufal Ramadan",
    nim: "13522015"
  },
  "S5": { 
    nama: "Muhammad Ahmad Naufal Ramadan",
    nim: "13522015"
  }
};

type SortField = "nama" | "nim" | "jurusan" | "fakultas" | "agama" | "kelamin" | "ipk";
type SortDirection = "asc" | "desc";

interface SelectMahasiswaProps {
  onSelect: (students: string[]) => void;
  onBack: () => void;
}

export function SelectMahasiswa({ onSelect, onBack }: SelectMahasiswaProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [showSelectedList, setShowSelectedList] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[0] | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const itemsPerPage = 7;
  
  // Filter students based on search term
  const filteredStudents = searchTerm 
    ? mockStudents.filter(student => 
        student.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
        student.nim.includes(searchTerm)
      )
    : mockStudents;
  
  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortField) return 0;
    
    const fieldA = a[sortField].toLowerCase();
    const fieldB = b[sortField].toLowerCase();
    
    if (sortDirection === "asc") {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };
  
  const handleRemoveStudent = (studentId: string) => {
    setSelectedStudents(prev => prev.filter(id => id !== studentId));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort direction if clicking the same field
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and reset direction to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleNext = () => {
    onSelect(selectedStudents);
  };
  
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <span className="ml-1 text-gray-300">↕</span>;
    }
    return sortDirection === "asc" ? 
      <ChevronUp className="ml-1 h-3 w-3 inline" /> : 
      <ChevronDown className="ml-1 h-3 w-3 inline" />;
  };

  const toggleSelectedList = () => {
    setShowSelectedList(!showSelectedList);
  };

  const handleOpenStudentDetail = (student: typeof mockStudents[0]) => {
    setSelectedStudent(student);
    setShowDetailDialog(true);
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-base mb-4 text-[#0A2463] font-medium">Pilih mahasiswa yang ingin dipasangkan dengan OTA</p>
        
        {showSelectedList ? (
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={toggleSelectedList}
                className="text-[#0A2463] border-[#0A2463]"
              >
                Kembali
              </Button>
              <div className="text-right text-sm">
                <span className="font-medium">Total</span>
                <span className="ml-4">{selectedStudents.length}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              {selectedStudents.map((studentId, index) => {
                const student = mockSelectedStudentDetails[studentId as keyof typeof mockSelectedStudentDetails] || 
                               { nama: "Unknown Student", nim: "---" };
                return (
                  <div 
                    key={index}
                    className="flex items-center justify-between px-4 py-3 border rounded-md"
                  >
                    <div className="flex items-center">
                      <div className="h-6 w-6 flex items-center justify-center rounded-full bg-[#0A2463] text-white mr-3 text-xs">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{student.nama}</div>
                        <div className="text-sm text-gray-500">{student.nim}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveStudent(studentId)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-4">
              <Button 
                variant="default" 
                className="bg-[#0A2463] hover:bg-[#0A2463]/90 text-white rounded-lg px-4 py-2 h-auto flex items-center gap-2"
                onClick={toggleSelectedList}
              >
                <UserRound className="h-4 w-4" />
                <span className="text-sm font-medium">{selectedStudents.length} calon</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="p-2 h-9 w-9 rounded-lg bg-[#0A2463] hover:bg-[#0A2463]/80"
                onClick={() => setSelectedStudents([])}
              >
                <Trash2 className="h-4 w-4 text-white" />
              </Button>
              
              <div className="relative flex-1 max-w-md">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Cari nama atau NIM"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10 pr-4 py-2 w-full border rounded-lg"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead 
                      className="text-xs text-center font-medium text-gray-600 cursor-pointer"
                      onClick={() => handleSort("nama")}
                    >
                      Nama {getSortIcon("nama")}
                    </TableHead>
                    <TableHead 
                      className="text-xs text-center font-medium text-gray-600 cursor-pointer"
                      onClick={() => handleSort("nim")}
                    >
                      NIM {getSortIcon("nim")}
                    </TableHead>
                    <TableHead 
                      className="text-xs text-center font-medium text-gray-600 cursor-pointer"
                      onClick={() => handleSort("jurusan")}
                    >
                      Jurusan {getSortIcon("jurusan")}
                    </TableHead>
                    <TableHead 
                      className="text-xs text-center font-medium text-gray-600 cursor-pointer"
                      onClick={() => handleSort("fakultas")}
                    >
                      Fakultas {getSortIcon("fakultas")}
                    </TableHead>
                    <TableHead 
                      className="text-xs text-center font-medium text-gray-600 cursor-pointer"
                      onClick={() => handleSort("agama")}
                    >
                      Agama {getSortIcon("agama")}
                    </TableHead>
                    <TableHead 
                      className="text-xs text-center font-medium text-gray-600 cursor-pointer"
                      onClick={() => handleSort("kelamin")}
                    >
                      Kelamin {getSortIcon("kelamin")}
                    </TableHead>
                    <TableHead 
                      className="text-xs text-center font-medium text-gray-600 cursor-pointer"
                      onClick={() => handleSort("ipk")}
                    >
                      IPK {getSortIcon("ipk")}
                    </TableHead>
                    <TableHead className="text-xs text-center w-16 font-medium text-gray-600">
                      Detail
                    </TableHead>
                    <TableHead className="text-xs text-center w-10 font-medium text-gray-600">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-gray-50">
                      <TableCell className="text-sm font-medium text-center text-[#0A2463]">{student.nama}</TableCell>
                      <TableCell className="text-sm text-center">{student.nim}</TableCell>
                      <TableCell className="text-sm text-center">{student.jurusan}</TableCell>
                      <TableCell className="text-sm text-center">{student.fakultas}</TableCell>
                      <TableCell className="text-sm text-center">{student.agama}</TableCell>
                      <TableCell className="text-sm text-center">{student.kelamin}</TableCell>
                      <TableCell className="text-sm text-center">{student.ipk}</TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-full px-4 text-xs font-medium border-[#0A2463] text-[#0A2463]"
                          onClick={() => handleOpenStudentDetail(student)}
                        >
                          Detail
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => handleStudentSelect(student.id)}
                          className="border-[#0A2463] data-[state=checked]:bg-[#0A2463] data-[state=checked]:text-white"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="text-[#0A2463] border-[#0A2463]"
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="text-[#0A2463] border-[#0A2463]"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
      
      {!showSelectedList && (
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="text-[#0A2463] border-[#0A2463]"
          >
            Kembali
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-[#0A2463] hover:bg-[#0A2463]/90 text-white px-8 font-medium"
            disabled={selectedStudents.length === 0}
          >
            Pasangkan
          </Button>
        </div>
      )}

      {/* Student Detail Dialog */}
      {selectedStudent && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#0A2463]">Detail Mahasiswa</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#0A2463]">{selectedStudent.nama}</h3>
                  <p className="text-gray-500 text-sm">NIM: {selectedStudent.nim}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-[#0A2463]">Jurusan</h4>
                    <p className="text-sm">{selectedStudent.jurusan}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-[#0A2463]">Fakultas</h4>
                    <p className="text-sm">{selectedStudent.fakultas}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-[#0A2463]">Agama</h4>
                    <p className="text-sm">{selectedStudent.agama}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-[#0A2463]">Jenis Kelamin</h4>
                    <p className="text-sm">{selectedStudent.kelamin}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-[#0A2463]">IPK</h4>
                    <p className="text-sm">{selectedStudent.ipk}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-[#0A2463]">Tempat, Tanggal Lahir</h4>
                  <p className="text-sm">Bandung, 01 Januari 2000</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#0A2463]">Alamat</h4>
                  <p className="text-sm">Jl. Ganesa No. 10, Bandung</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#0A2463]">Kontak</h4>
                  <p className="text-sm">Telepon: 08123456789</p>
                  <p className="text-sm">Email: {selectedStudent.nim}@std.itb.ac.id</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}