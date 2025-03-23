import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/protected-example/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/protected-example/"!</div>;
}
