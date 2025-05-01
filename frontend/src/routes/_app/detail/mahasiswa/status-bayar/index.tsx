import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/detail/mahasiswa/status-bayar/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/detail/mahasiswa/status-bayar/"! Halaman ini hanya bisa dilihat oleh verified OTA yang mengasuh mahasiswa ini</div>
}
