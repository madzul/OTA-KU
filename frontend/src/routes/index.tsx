import { api } from "@/api/client";
import Navbar from "@/components/ui/navbar";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [isNavBarActive, setIsNavBarActive] = useState(false);
  const { data } = useQuery({
    queryKey: ["healthy"],
    queryFn: () => api.test.test(),
  });

  console.log(data);

  return (
    <div>
      <Navbar
        isNavBarActive={isNavBarActive}
        setIsNavBarActive={setIsNavBarActive}
      />
    </div>
  );
}
