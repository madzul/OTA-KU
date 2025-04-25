import { createFileRoute } from "@tanstack/react-router";

import DaftarOrangTua from "./-components.tsx/DaftarOrangTua";

export const Route = createFileRoute("/_app/orang-tua-asuh-saya/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <DaftarOrangTua />
    </div>
  );
}
