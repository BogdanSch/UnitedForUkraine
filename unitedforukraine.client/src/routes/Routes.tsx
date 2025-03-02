import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import {
  CampaignIndex,
  HomePage,
  LoginPage,
  NotFoundPage,
  RegisterPage,
  SuccessfulRegistration,
} from "../pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "home", element: <HomePage /> },
      { path: "campaigns", element: <CampaignIndex /> },
      { path: "registered", element: <SuccessfulRegistration /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);
