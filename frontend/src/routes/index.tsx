import LandingPage from "./-components/landing-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2 text-4xl">
      <LandingPage />
    </div>
  );
}
