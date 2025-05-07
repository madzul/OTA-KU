import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StudentProps {
  id: string;
  nama: string;
  nim: string;
  jurusan: string;
  fakultas: string;
  agama: string;
  kelamin: string;
  ipk: string;
  alamat?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  telepon?: string;
  email?: string;
}

interface StudentDetailProps {
  student: StudentProps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetail({ student, open, onOpenChange }: StudentDetailProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#0A2463]">Detail Mahasiswa</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-[#0A2463]">{student.nama}</h3>
              <p className="text-gray-500 text-sm">NIM: {student.nim}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-[#0A2463]">Jurusan</h4>
                <p className="text-sm">{student.jurusan}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-[#0A2463]">Fakultas</h4>
                <p className="text-sm">{student.fakultas}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-[#0A2463]">Agama</h4>
                <p className="text-sm">{student.agama}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-[#0A2463]">Jenis Kelamin</h4>
                <p className="text-sm">{student.kelamin}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-[#0A2463]">IPK</h4>
                <p className="text-sm">{student.ipk}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-[#0A2463]">Tempat, Tanggal Lahir</h4>
              <p className="text-sm">
                {student.tempatLahir || "Bandung"}, {student.tanggalLahir || "01 Januari 2000"}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-[#0A2463]">Alamat</h4>
              <p className="text-sm">{student.alamat || "Jl. Ganesa No. 10, Bandung"}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-[#0A2463]">Kontak</h4>
              <p className="text-sm">Telepon: {student.telepon || "08123456789"}</p>
              <p className="text-sm">Email: {student.email || `${student.nim}@std.itb.ac.id`}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}