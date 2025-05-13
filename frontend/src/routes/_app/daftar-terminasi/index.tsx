import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/daftar-terminasi/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/daftar-terminasi/"!</div>;
}
