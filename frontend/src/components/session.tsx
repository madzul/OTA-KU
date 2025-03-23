import { api } from "@/api/client";
import { SessionContext } from "@/context/session";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useQuery({
    queryKey: ["verify"],
    queryFn: () => api.auth.verif().catch(() => null),
  });

  if (data === null) {
    return <Navigate to="/auth/login" />;
  }

  // TODO: Handle loading state
  if (!data) {
    return <div>Loading...</div>;
  }

  if (!data.body.phoneNumber) {
    return <Navigate to="/profile" />;
  }

  return (
    <SessionContext.Provider value={data.body}>
      {children}
    </SessionContext.Provider>
  );
}
