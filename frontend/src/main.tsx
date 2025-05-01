import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import { queryClient } from "./api/client";
import { UserSchema } from "./api/generated";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const router = createRouter({
  routeTree,
  context: { session: undefined!, setSession: () => {} },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const [session, setSession] = useState<UserSchema | null | undefined>(
    undefined,
  );

  useEffect(() => {
    if (session) {
      router.update({
        context: {
          ...router.options.context,
          session,
          setSession,
        },
      });
    }
  }, [session]);

  function updateSession(newSession: UserSchema | null) {
    setSession(newSession);
    queryClient.setQueryData(["verify"], newSession);
  }

  return (
    <RouterProvider
      router={router}
      context={{ session, setSession: updateSession }}
    />
  );
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
