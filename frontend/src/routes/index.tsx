import { api } from "@/api/client";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data } = useQuery({
    queryKey: ["healthy"],
    queryFn: () => api.test.test(),
  });

  console.log(data);

  return (
    <div>
      <Navbar/>
      <Footer />
    </div>
  );
}
