import Metadata from "@/components/metadata";
import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "./-components/landing-page";
import { useEffect, useState } from "react";
import ReapplyModal from "./-components/reapply-modal";
import { api } from "@/api/client";

export const Route = createFileRoute("/_app/")({
  component: Index,
  loader: async ({ context }) => {
    return { session: context.session };
  },
});

function Index() {
  const { session } = Route.useLoaderData();
  const [showReapplyModal, setShowReapplyModal] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [, setProfile] = useState<any>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    // Only check for reapply if user is logged in and is a mahasiswa
    if (session && session.type === "mahasiswa") {
      const fetchMahasiswaProfile = async () => {
        try {
          setLoading(true);
          const response = await api.profile.profileMahasiswa({ id: session.id });
          
          if (response.success) {
            setProfile(response.body);
            
            // Check if reapply is needed
            if (response.body.dueNextUpdateAt) {
              const dueDate = new Date(response.body.dueNextUpdateAt);
              const currentDate = new Date();
              
              // Calculate days remaining until due date
              const timeDiff = dueDate.getTime() - currentDate.getTime();
              const remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
              
              setDaysRemaining(remainingDays);
              
              // Show modal if less than 30 days remaining and application status is not already reapply
              if (remainingDays <= 30 && response.body.applicationStatus !== "reapply") {
                setShowReapplyModal(true);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching mahasiswa profile:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchMahasiswaProfile();
    }
  }, [session]);

  const handleDelayReapply = () => {
    setShowReapplyModal(false);
  };

  const handleReapply = () => {
    // Navigate to reapply form or update status
    window.location.href = "/profile";
    setShowReapplyModal(false);
  };

  return (
    <main className="flex min-h-[calc(100vh-70px)] flex-col items-center justify-center px-4 py-8 text-4xl md:px-12 lg:min-h-[calc(100vh-96px)]">
      <Metadata title="Beranda | BOTA" />
      <LandingPage session={session} />
      
      {/* Reapply Modal */}
      <ReapplyModal 
        open={showReapplyModal} 
        onOpenChange={setShowReapplyModal}
        daysRemaining={daysRemaining}
        onReapply={handleReapply}
        onDelay={handleDelayReapply}
      />
    </main>
  );
}