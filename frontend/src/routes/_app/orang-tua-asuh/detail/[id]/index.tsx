import DetailCardsOrangTuaAsuh from "./-components/detail-cards";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/orang-tua-asuh/detail/[id]/")({
    component: RouteComponent,
});
 
function RouteComponent() {
    // Data contoh untuk Orang Tua Asuh
    const orangTuaAsuhData = {
        name: "Muhammad Rizki",
        role: "Orang Tua Asuh",
        email: "rizki@example.com",
        phone: "081234567890",
        joinDate: "Bergabung di Maret 2024",
        avatarSrc: "",
        occupation: "Pengusaha",
        beneficiary: 3
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4 text-primary">Detail Orang Tua Asuh</h1>
            <DetailCardsOrangTuaAsuh 
                name={orangTuaAsuhData.name}
                role={orangTuaAsuhData.role}
                email={orangTuaAsuhData.email}
                phone={orangTuaAsuhData.phone}
                joinDate={orangTuaAsuhData.joinDate}
                avatarSrc={orangTuaAsuhData.avatarSrc}
                occupation={orangTuaAsuhData.occupation}
                beneficiary={orangTuaAsuhData.beneficiary}
            />
        </div>
    )
}

export default RouteComponent;