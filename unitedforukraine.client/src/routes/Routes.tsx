import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import {
  CampaignCreate,
  CampaignDetail,
  CampaignEdit,
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
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/campaigns",
    element: <MainLayout />,
    children: [
      { index: true, element: <CampaignIndex /> },
      { path: "detail/:id", element: <CampaignDetail /> },
      { path: "edit/:id", element: <CampaignEdit /> },
      { path: "create", element: <CampaignCreate /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "registered", element: <SuccessfulRegistration /> },
    ],
  },
]);
