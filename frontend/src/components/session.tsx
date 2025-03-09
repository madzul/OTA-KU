// // TODO: Fix all error after implementing auth
// import { api } from "@/api/client";
// import { UserWithRoles } from "@/api/generated";
// import { saveUserCache } from "@/lib/session";
// import { useQuery } from "@tanstack/react-query";
// import { Navigate } from "@tanstack/react-router";
// import { createContext, useEffect } from "react";

// export const SessionContext = createContext<UserWithRoles>(
//   null as unknown as UserWithRoles,
// );

// export default function SessionProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { data } = useQuery({
//     queryKey: ["me"],
//     queryFn: () => api.auth.getMe().catch(() => null),
//   });

//   useEffect(() => {
//     if (data !== undefined) {
//       saveUserCache(data);
//     }
//   }, [data]);

//   if (data === null) {
//     return <Navigate to="/auth/login" />;
//   }

//   if (!data) {
//     // TODO: loading UI
//     return <div>Loading...</div>;
//   }
//   return (
//     <SessionContext.Provider value={data}>{children}</SessionContext.Provider>
//   );
// }
