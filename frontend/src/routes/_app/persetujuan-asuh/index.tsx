import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/persetujuan-asuh/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/persetujuan-asuh/"! Halaman ini hanya bisa diakses oleh admin</div>
}
