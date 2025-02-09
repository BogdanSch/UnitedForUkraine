import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout";
import { HomePage, NotFoundPage, UnauthorizedPage } from "../pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "home", element: <HomePage /> },
      { path: "unauthorized", element: <UnauthorizedPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
