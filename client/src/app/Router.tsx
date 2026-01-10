import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { PatientDashboard } from "@/pages/patient/DashboardPage";
// import { DoctorDashboard } from "@/pages/doctor/dashboard-page";
import { NewConsultationPage } from "@/pages/patient/NewConsultationPage";
import { ConsultationDetailPage } from "@/pages/patient/ConsultationDetailPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RegisterPage } from "@/pages/auth/RegisterPage";

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
