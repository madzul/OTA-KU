import { createFileRoute } from "@tanstack/react-router";
import ProfileCard from "./-components/profile-card"
import ProfileFormMA from "./-components/profile-form-ma";
// import ProfileFormOTA from "./-components/profile-form-ota";

export const Route = createFileRoute("/_app/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <p className="font-bold text-4xl mb-6 text-primary">Profile</p>
      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        <div>
          <ProfileCard 
            name="Budi Santoso"
            role="Orang Tua Asuh"
            email="Email@example.com"
            phone="08129130321321"
            joinDate="Bergabung di Maret 2024"
          />
        </div>
        <div>
          <ProfileFormMA/>
        </div>
      </div>
    </div>
  )
}