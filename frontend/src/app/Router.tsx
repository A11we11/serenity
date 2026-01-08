import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import { LoginPage } from "@/pages/auth/login-page";
import { RegisterPage } from "@/pages/auth/register-page";
import { PatientDashboard } from "@/pages/patient/dashboard-page";
import { DoctorDashboard } from "@/pages/doctor/dashboard-page";
import { NewConsultationPage } from "@/pages/patient/new-consultation-page";
import { ConsultationDetailPage } from "@/pages/patient/consultation-detail-page";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout>
          <Navigate to="/dashboard" replace />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout>
          <PatientDashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/consultations/new",
    element: (
      <ProtectedRoute>
        <Layout>
          <NewConsultationPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/consultations/:id",
    element: (
      <ProtectedRoute>
        <Layout>
          <ConsultationDetailPage />
        </Layout>
      </ProtectedRoute>
    ),
  },
]);
