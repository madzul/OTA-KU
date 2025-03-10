import { api } from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

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
    <div className="p-2 text-4xl text-succeed">
      <h3>Welcome Home!</h3>
      <Button variant={"default"} size={"lg"}>Click me!</Button>
    </div>
  );
}
