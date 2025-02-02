import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Routes.tsx";

import "./includes.ts";

const root = document.querySelector<HTMLDivElement>("#root")!;

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
