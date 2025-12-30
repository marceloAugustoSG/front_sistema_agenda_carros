import { Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "./pages/dashboard/layout"
import DashboardHome from "./pages/dashboard/Home"
import LoginPage from "./pages/login"
import { Toaster } from "./components/ui/sonner"
import EstatisticasPage from "./pages/dashboard/Estatisticas"
import ConfiguracoesPage from "./pages/dashboard/Configuracoes"
import AjudaPage from "./pages/dashboard/Ajuda"
import RegisterPage from "./pages/register"
import ForgotPasswordPage from "./pages/forgot-password"
import VeiculosPage from "./pages/dashboard/Veiculos"
import ClientesPage from "./pages/dashboard/Clientes"
import InteressesPage from "./pages/dashboard/Interesses"
import LembretesPage from "./pages/dashboard/Lembretes"
import PropostasPage from "./pages/dashboard/Propostas"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { isAuthenticated } from "./utils/auth"

export function App() {
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LoginPage />
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="estatisticas" element={<EstatisticasPage />} />
          <Route path="veiculos" element={<VeiculosPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="interesses" element={<InteressesPage />} />
          <Route path="lembretes" element={<LembretesPage />} />
          <Route path="propostas" element={<PropostasPage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
          <Route path="ajuda" element={<AjudaPage />} />
        </Route>
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />
          }
        />
      </Routes>
      <Toaster />
    </>
  )
}