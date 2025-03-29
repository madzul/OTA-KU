import DetailCardsMahasiswaAsuh from "./-components/detail-cards";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/mahasiswa-asuh/detail/[id]/")({
    component: RouteComponent,
});
 
function RouteComponent() {
    // Data contoh untuk Mahasiswa Asuh
    const MahasiswaAsuhData = {
        name: "Muhammad Rizki",
        role: "Orang Tua Asuh",
        email: "rizki@example.com",
        phone: "081234567890",
        joinDate: "Bergabung di Maret 2024",
        avatarSrc: "",
        departement: "Teknik Informatika",
        faculty: "STEI-K",
        batch: "2023",
        gpa: 3.75,
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4 text-primary">Detail Mahasiswa Asuh</h1>
            <DetailCardsMahasiswaAsuh 
                name={MahasiswaAsuhData.name}
                role={MahasiswaAsuhData.role}
                email={MahasiswaAsuhData.email}
                phone={MahasiswaAsuhData.phone}
                joinDate={MahasiswaAsuhData.joinDate}
                avatarSrc={MahasiswaAsuhData.avatarSrc}
                departement={MahasiswaAsuhData.departement}
                faculty={MahasiswaAsuhData.faculty}
                batch={MahasiswaAsuhData.batch}
                gpa={MahasiswaAsuhData.gpa}
            />
        </div>
    )
}

export default RouteComponent;