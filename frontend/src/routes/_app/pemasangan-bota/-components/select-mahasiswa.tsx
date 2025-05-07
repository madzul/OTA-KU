import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserRound, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/api/client";
import { StudentDetail } from "./student-detail";

type SortField = "name" | "nim" | "major" | "faculty" | "religion" | "gender" | "gpa";
type SortDirection = "asc" | "desc";

interface MahasiswaItem {
  accountId: string;
  name: string;
  nim: string;
  mahasiswaStatus: 'active' | 'inactive';
  description?: string;
  major?: string;
  faculty?: string;
  religion?: string;
  gender?: string;
  gpa?: string;
}

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
  const [selectedStudent, setSelectedStudent] = useState<MahasiswaItem | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<MahasiswaItem[]>([]);
  const [totalData, setTotalData] = useState(0);
  
  useEffect(() => {
    fetchMahasiswaList();
  }, [currentPage, searchTerm]);

  const fetchMahasiswaList = async () => {
    setIsLoading(true);
    try {
      const response = await api.list.listMahasiswaOta({
        q: searchTerm,
        page: currentPage
      });
      
      if (response.success) {
        setStudents(response.body.data);
        setTotalData(response.body.totalData);
      }
    } catch (error) {
      console.error("Error fetching mahasiswa list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sort students
  const sortedStudents = [...students].sort((a, b) => {
    if (!sortField) return 0;
    
    let fieldA: string = a[sortField] as string || "";
    let fieldB: string = b[sortField] as string || "";
    
    fieldA = fieldA.toLowerCase();
    fieldB = fieldB.toLowerCase();
    
    if (sortDirection === "asc") {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });
  
  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(totalData / 6)); // Ensure at least 1 page is shown

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

  const handleOpenStudentDetail = (student: MahasiswaItem) => {
    setSelectedStudent(student);
    setShowDetailDialog(true);
  };

  // Get selected student details for the list view
  const getSelectedStudentDetails = () => {
    return selectedStudents.map(id => {
      const student = students.find(s => s.accountId === id);
      return student || null;
    }).filter(s => s !== null) as MahasiswaItem[];
  };

  const selectedStudentDetails = getSelectedStudentDetails();

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
              {selectedStudentDetails.map((student, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between px-4 py-3 border rounded-md"
                >
                  <div className="flex items-center">
                    <div className="h-6 w-6 flex items-center justify-center rounded-full bg-[#0A2463] text-white mr-3 text-xs">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.nim}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveStudent(student.accountId)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
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
              {isLoading ? (
                <div className="flex justify-center items-center p-12">
                  Loading...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead 
                        className="text-xs text-center font-medium text-gray-600 cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        Nama {getSortIcon("name")}
                      </TableHead>
                      <TableHead 
                        className="text-xs text-center font-medium text-gray-600 cursor-pointer"
                        onClick={() => handleSort("nim")}
                      >
                        NIM {getSortIcon("nim")}
                      </TableHead>
                      <TableHead 
                        className="text-xs text-center font-medium text-gray-600 cursor-pointer"
                        onClick={() => handleSort("major")}
                      >
                        Jurusan {getSortIcon("major")}
                      </TableHead>
                      <TableHead 
                        className="text-xs text-center font-medium text-gray-600 cursor-pointer"
                        onClick={() => handleSort("faculty")}
                      >
                        Fakultas {getSortIcon("faculty")}
                      </TableHead>
                      <TableHead 
                        className="text-xs text-center font-medium text-gray-600 cursor-pointer"
                        onClick={() => handleSort("religion")}
                      >
                        Agama {getSortIcon("religion")}
                      </TableHead>
                      <TableHead 
                        className="text-xs text-center font-medium text-gray-600 cursor-pointer"
                        onClick={() => handleSort("gender")}
                      >
                        Kelamin {getSortIcon("gender")}
                      </TableHead>
                      <TableHead 
                        className="text-xs text-center font-medium text-gray-600 cursor-pointer"
                        onClick={() => handleSort("gpa")}
                      >
                        IPK {getSortIcon("gpa")}
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
                    {sortedStudents.length > 0 ? (
                      sortedStudents.map((student) => (
                        <TableRow key={student.accountId} className="hover:bg-gray-50">
                          <TableCell className="text-sm font-medium text-center text-[#0A2463]">{student.name}</TableCell>
                          <TableCell className="text-sm text-center">{student.nim}</TableCell>
                          <TableCell className="text-sm text-center">{student.major || "-"}</TableCell>
                          <TableCell className="text-sm text-center">{student.faculty || "-"}</TableCell>
                          <TableCell className="text-sm text-center">{student.religion || "-"}</TableCell>
                          <TableCell className="text-sm text-center">{student.gender === 'M' ? 'Laki-laki' : 'Perempuan'}</TableCell>
                          <TableCell className="text-sm text-center">{student.gpa || "-"}</TableCell>
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
                              checked={selectedStudents.includes(student.accountId)}
                              onCheckedChange={() => handleStudentSelect(student.accountId)}
                              className="border-[#0A2463] data-[state=checked]:bg-[#0A2463] data-[state=checked]:text-white"
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                          Tidak ada mahasiswa yang ditemukan
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
            
            {/* Pagination - Updated with arrow icons */}
            <div className="flex justify-center items-center mt-4 gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="text-[#0A2463] hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="text-[#0A2463] hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
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
        <StudentDetail
          student={{
            id: selectedStudent.accountId,
            nama: selectedStudent.name,
            nim: selectedStudent.nim,
            jurusan: selectedStudent.major || "-",
            fakultas: selectedStudent.faculty || "-",
            agama: selectedStudent.religion || "-",
            kelamin: selectedStudent.gender === 'M' ? 'Laki-laki' : 'Perempuan',
            ipk: selectedStudent.gpa || "-"
          }}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
        />
      )}
    </div>
  );
}