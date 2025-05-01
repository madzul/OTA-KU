import { createFileRoute } from "@tanstack/react-router";

import LandingPage from "./-components/landing-page";

export const Route = createFileRoute("/_app/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2 text-4xl">
      <LandingPage />
    </div>
  );
}
