import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Routes.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";

import "./includes.ts";

const root = document.querySelector<HTMLDivElement>("#root")!;

createRoot(root).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
