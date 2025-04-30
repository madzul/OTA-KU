import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/daftar-pengasuhan/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/daftar-pengasuhan/"! Halaman ini hanya bisa diakses oleh admin</div>
}
