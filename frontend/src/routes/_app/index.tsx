import { createFileRoute } from "@tanstack/react-router";

import LandingPage from "./-components/landing-page";

export const Route = createFileRoute("/_app/")({
  component: Index,
  loader: async ({ context }) => {
    return { session: context.session };
  },
});

function Index() {
  const { session } = Route.useLoaderData();

  return (
    <div className="p-2 text-4xl">
      <LandingPage session={session} />
    </div>
  );
}
