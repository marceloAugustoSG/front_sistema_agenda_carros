import { Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "./pages/dashboard/layout"
import DashboardHome from "./pages/dashboard/Home"
import LoginPage from "./pages/login"
import { Toaster } from "./components/ui/sonner"
import EstatisticasPage from "./pages/dashboard/Estatisticas"
import ConfiguracoesPage from "./pages/dashboard/Configuracoes"
import AjudaPage from "./pages/dashboard/Ajuda"
import RegisterPage from "./pages/register"
import VeiculosPage from "./pages/dashboard/Veiculos"
import ClientesPage from "./pages/dashboard/Clientes"
import InteressesPage from "./pages/dashboard/Interesses"
import EstoquePage from "./pages/dashboard/Estoque"

export function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="estatisticas" element={<EstatisticasPage />} />
          <Route path="veiculos" element={<VeiculosPage />} />
          <Route path="estoque" element={<EstoquePage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="interesses" element={<InteressesPage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
          <Route path="ajuda" element={<AjudaPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}