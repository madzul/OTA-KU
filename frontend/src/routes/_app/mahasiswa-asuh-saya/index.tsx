import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/mahasiswa-asuh-saya/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/mahasiswa-asuh-saya/"!</div>
}
