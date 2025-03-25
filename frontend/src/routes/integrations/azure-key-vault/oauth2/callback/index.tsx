import { api, queryClient } from "@/api/client";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute(
  "/integrations/azure-key-vault/oauth2/callback/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
      return;
    }

    if (state === localStorage.getItem("state")) {
      localStorage.removeItem("state");
      api.auth
        .oauth({
          formData: { code },
        })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["verify"] });
          navigate({ to: "/" });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return <div>Waiting to redirect</div>;
}
