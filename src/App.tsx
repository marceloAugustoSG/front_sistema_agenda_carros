import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./pages/dashboard/layout";
import DashboardHome from "./pages/dashboard/Home";
import LoginPage from "./pages/login";
import { Toaster } from "./components/ui/sonner";
import LogistasPage from "./pages/dashboard/Logistas";
import EstatisticasPage from "./pages/dashboard/Estatisticas";
import ConfiguracoesPage from "./pages/dashboard/Configuracoes";
import AjudaPage from "./pages/dashboard/Ajuda";

export function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="estatisticas" element={<EstatisticasPage />} />
          <Route path="logistas" element={<LogistasPage />} />
          <Route path="configuracoes" element={<ConfiguracoesPage />} />
          <Route path="ajuda" element={<AjudaPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}