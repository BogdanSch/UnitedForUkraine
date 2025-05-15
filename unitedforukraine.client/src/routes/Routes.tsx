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
  NotAuthorized,
  NotFoundPage,
  RegisterPage,
  SuccessfulRegistration,
  About,
  Donate,
  Confirmation,
  Failed,
  Dashboard,
} from "../pages";
import ProtectedRoute from "./middleware/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "home", element: <HomePage /> },
      { path: "about", element: <About /> },
      { path: "/notAuthorized", element: <NotAuthorized /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/campaigns",
    element: <MainLayout />,
    children: [
      { index: true, element: <CampaignIndex /> },
      { path: "detail/:id", element: <CampaignDetail /> },
      {
        path: "edit/:id",
        element: (
          <ProtectedRoute requireAdmin>
            <CampaignEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "create",
        element: (
          <ProtectedRoute requireAdmin>
            <CampaignCreate />
          </ProtectedRoute>
        ),
      },
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
  {
    path: "/donate",
    element: <MainLayout />,
    children: [
      { path: "confirmation", element: <Confirmation /> },
      { path: "failed", element: <Failed /> },
      {
        path: ":id",
        element: (
          <ProtectedRoute requireAdmin>
            <Donate />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
